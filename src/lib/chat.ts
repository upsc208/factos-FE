import { API_BASE, ApiError } from '@/lib/member';

/**
 * 팀 채팅 API (factos-BE `chat/`). 브라우저에서만 부른다.
 *
 * - 팀 방: `team-{clubId}` — 항상 열림
 * - 매치 방: FotMob 경기 ID — 킥오프 1시간 전 ~ 3시간 후 열림.
 *   Big6 맞대결은 두 팀 목록에 같은 roomId로 나와 한 방에서 만난다
 * - 채팅 닉네임은 회원 닉네임과 별개로, 방마다 선점한다 (비로그인도 채팅 가능)
 */

export type ChatRoomType = 'TEAM' | 'MATCH';

export interface ChatRoomSummary {
  roomId: string;
  type: ChatRoomType;
  title: string;
  clubs: string[]; // 이 방에 모이는 팀. 맞대결이면 2개
  open: boolean;
  onlineCount: number;
  kickoff?: string | null;
  tournament?: string | null;
}

export type ChatMessageType = 'USER' | 'ADMIN' | 'GOAL' | 'GOAL_CANCELLED' | 'STATUS' | 'LED';

export interface ChatMessage {
  matchId: string;
  nickname: string;
  content: string;
  sentAt?: string | null;
  ipHash?: string | null; // 같은 브라우저·IP면 같은 4자리 — 닉네임을 바꿔도 동일인을 알아볼 수 있다
  type: ChatMessageType;
}

export interface ChatRoomInfo {
  open: boolean;
  onlineCount: number;
  messages: ChatMessage[];
}

export const CHAT_MAX_LENGTH = 200; // 백엔드 ChatService.MAX_CONTENT_LENGTH
export const CHAT_NICKNAME_MIN = 2;
export const CHAT_NICKNAME_MAX = 12;

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.error || '요청을 처리하지 못했습니다.');
  }
  return res.json();
}

export const fetchChatRooms = (clubId: string) =>
  call<ChatRoomSummary[]>(`/api/chat/rooms?club=${encodeURIComponent(clubId)}`);

export const fetchChatRoom = (roomId: string) =>
  call<ChatRoomInfo>(`/api/chat/${encodeURIComponent(roomId)}`);

/** 방에 들어가기 전에 닉네임을 잡는다. 중복·금칙어·닫힌 방이면 409 (ApiError.message에 안내 문구) */
export const reserveChatNickname = (roomId: string, nickname: string) =>
  call<{ nickname: string }>(`/api/chat/${encodeURIComponent(roomId)}/nickname`, {
    method: 'POST',
    headers: { 'X-Chat-Client-Id': chatClientId() },
    body: JSON.stringify({ nickname }),
  });

// ---- 브라우저 저장값 (실패해도 동작해야 한다: 사생활 보호 모드 등) ----

const CLIENT_ID_KEY = 'factos_chat_client_id';
const NICKNAME_KEY = 'factos_chat_nickname';
let memoryClientId: string | null = null;

/** 이 브라우저의 고정 식별자. 서버는 닉네임 주인을 이 값으로 판정한다 (ChatClient.kt: 8~64자 영숫자·-·_) */
export function chatClientId(): string {
  try {
    const saved = localStorage.getItem(CLIENT_ID_KEY);
    if (saved) return saved;
  } catch { /* 저장소를 못 쓰면 이번 탭 동안만 쓴다 */ }
  if (!memoryClientId) {
    memoryClientId = 'c-' + (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  }
  try { localStorage.setItem(CLIENT_ID_KEY, memoryClientId); } catch { /* 무시 */ }
  return memoryClientId;
}

export function savedChatNickname(): string {
  try { return localStorage.getItem(NICKNAME_KEY) ?? ''; } catch { return ''; }
}

export function saveChatNickname(nickname: string) {
  try { localStorage.setItem(NICKNAME_KEY, nickname); } catch { /* 무시 */ }
}

/**
 * STOMP 접속 주소. 백엔드는 `/ws`를 SockJS로 열어 두는데, Spring SockJS는 순수 WebSocket도
 * `/ws/websocket`에서 받는다. 그래서 sockjs-client 없이 붙는다.
 */
export function chatSocketUrl(): string {
  // 운영은 API가 같은 출처(빈 값)라 지금 페이지 주소로 만든다
  if (!API_BASE) return `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/websocket`;
  return API_BASE.replace(/^http/, 'ws') + '/ws/websocket';
}
