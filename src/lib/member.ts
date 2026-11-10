import type { ClubNewsPage } from '@/lib/clubNews';
import { apiBase } from '@/config/api';

/**
 * 회원 기능 (로그인·댓글·즐겨찾기) API. **브라우저에서만** 부른다.
 *
 * 로그인 상태는 백엔드가 심은 HttpOnly 쿠키라 자바스크립트로 읽을 수 없고, 서버 컴포넌트의 fetch에는
 * 사용자 쿠키가 실리지 않는다. 그래서 전부 클라이언트에서 `credentials: 'include'`로 부른다.
 * 쿠키가 실리려면 프론트와 API가 같은 사이트여야 한다 (localhost끼리, 또는 factos.kr / api.factos.kr).
 */

// 브라우저와 서버(SSR)가 다른 주소를 쓴다 — config/api.ts. 운영 브라우저에서는 빈 값(같은 출처 /api)
export const API_BASE = apiBase();

/** 응원하는 팀: Big6(config/clubs의 id) + 기타 */
export type FavoriteTeam = 'arsenal' | 'chelsea' | 'liverpool' | 'mancity' | 'manutd' | 'tottenham' | 'other';

export const TEAM_OPTIONS: { id: FavoriteTeam; label: string }[] = [
  { id: 'arsenal', label: '아스날' },
  { id: 'mancity', label: '맨시티' },
  { id: 'manutd', label: '맨유' },
  { id: 'liverpool', label: '리버풀' },
  { id: 'chelsea', label: '첼시' },
  { id: 'tottenham', label: '토트넘' },
  { id: 'other', label: '기타' },
];

export const teamLabel = (id?: string | null) => TEAM_OPTIONS.find((t) => t.id === id)?.label;

export type MemberRole = 'MEMBER' | 'TEAM_ADMIN' | 'ADMIN';

/**
 * 권한 세 단계 (화면 이름 = 저장 값): sadmin = ADMIN (개발자·운영자, 통계·팀 관리자 지정) ·
 * admin = TEAM_ADMIN (팀별 관리자, 자기 팀 신고·정지) · user = MEMBER
 */
export const isModerator = (m?: Member | null) => !!m && (m.role === 'TEAM_ADMIN' || m.role === 'ADMIN');
export const isSadmin = (m?: Member | null) => !!m && m.role === 'ADMIN';

export const roleLabel = (role?: MemberRole | null, club?: string | null) =>
  role === 'ADMIN' ? 'sadmin' : role === 'TEAM_ADMIN' ? `admin · ${teamLabel(club) ?? club ?? '?'}` : 'user';

export interface Member {
  id: number;
  nickname: string;
  profileImageUrl?: string | null;
  provider: 'KAKAO' | 'GOOGLE';
  favoriteTeam?: FavoriteTeam | null;
  signupCompleted: boolean; // false면 /signup에서 닉네임·응원팀을 정해야 한다
  role?: MemberRole; // 관리자 권한. 없으면 일반 회원
  adminClub?: string | null; // 팀 관리자가 맡은 팀
  suspendedUntil?: string | null; // 정지 중이면 끝나는 시각 (댓글 작성 불가)
  suspensionReason?: string | null;
}

export interface Comment {
  id: number;
  content: string;
  nickname: string;
  profileImageUrl?: string | null;
  createdAt: string;
  mine: boolean;
  favoriteTeam?: FavoriteTeam | null;
  moderatable?: boolean; // 보는 사람이 이 댓글을 지우고 작성자를 정지할 수 있는 관리자인지
  reported?: boolean; // 보는 사람이 이미 신고한 댓글인지
  reportCount?: number | null; // 처리 안 된 신고 수 — 관리자에게만 온다
}

export interface NicknameCheck {
  nickname: string;
  available: boolean;
  reason?: string | null;
}

// 백엔드 MemberService와 같은 규칙 (서버가 최종 판단, 여기선 입력 중 안내용)
export const NICKNAME_MIN = 2;
export const NICKNAME_MAX = 12;

export interface CommentPage {
  content: Comment[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export type Provider = 'kakao' | 'google';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: { ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
  });
  if (!res.ok) {
    // 백엔드 오류 응답은 {"error": "..."}
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.error || '요청을 처리하지 못했습니다.');
  }
  // 204나 본문 없는 201(신고 등)은 undefined
  const text = res.status === 204 ? "" : await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// ---- 로그인 ----

/** 비로그인이면 null */
export async function fetchMe(): Promise<Member | null> {
  try {
    return await call<Member>('/api/auth/me');
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return null;
    throw e;
  }
}

/** 백엔드에 앱 키가 설정된 로그인 수단 */
export const fetchProviders = () => call<Provider[]>('/api/auth/providers');

/** 로그인은 fetch가 아니라 페이지 이동이다 (제공자 로그인 화면을 거쳐 returnTo로 돌아온다) */
export function loginUrl(provider: Provider, returnTo: string): string {
  return `${API_BASE}/api/auth/${provider}/login?returnTo=${encodeURIComponent(returnTo)}`;
}

export const logout = () => call<void>('/api/auth/logout', { method: 'POST' });

// ---- 가입 마치기·내 정보·탈퇴 ----

export const checkNickname = (nickname: string) =>
  call<NicknameCheck>(`/api/members/nickname-check?nickname=${encodeURIComponent(nickname)}`);

/** 닉네임 중복이면 ApiError(409) */
export const updateProfile = (nickname: string, favoriteTeam: FavoriteTeam) =>
  call<Member>('/api/me/profile', { method: 'PUT', body: JSON.stringify({ nickname, favoriteTeam }) });

export const withdraw = () => call<void>('/api/me', { method: 'DELETE' });

// ---- 댓글 ----

export const fetchComments = (articleId: number, page = 0) =>
  call<CommentPage>(`/api/news/${articleId}/comments?page=${page}&size=50`);

export const postComment = (articleId: number, content: string) =>
  call<Comment>(`/api/news/${articleId}/comments`, { method: 'POST', body: JSON.stringify({ content }) });

export const deleteComment = (commentId: number) => call<void>(`/api/comments/${commentId}`, { method: 'DELETE' });

/** 댓글 신고. reason: ABUSE | SPAM | FLOOD | OTHER (OTHER면 detail 필수). 이미 신고했으면 409 */
export const reportComment = (commentId: number, reason: string, detail?: string) =>
  call<void>(`/api/comments/${commentId}/report`, { method: 'POST', body: JSON.stringify({ reason, detail: detail || undefined }) });

// ---- 즐겨찾기 ----

export const fetchBookmarked = (articleId: number) =>
  call<{ bookmarked: boolean }>(`/api/me/bookmarks/${articleId}`).then((r) => r.bookmarked);

export const setBookmark = (articleId: number, on: boolean) =>
  call<{ bookmarked: boolean }>(`/api/me/bookmarks/${articleId}`, { method: on ? 'PUT' : 'DELETE' }).then((r) => r.bookmarked);

export const fetchBookmarks = (page = 0) => call<ClubNewsPage>(`/api/me/bookmarks?page=${page}&size=20`);

// ── sadmin: 팀 관리자 지정 (서버도 sadmin만 받는다) ──
export interface ManagedMember {
  id: number;
  nickname: string;
  provider: string;
  role: MemberRole;
  adminClub?: string | null;
  createdAt: string;
}

export const fetchModerators = () => call<ManagedMember[]>('/api/moderation/members/moderators');
export const searchMembers = (nickname: string) =>
  call<ManagedMember[]>(`/api/moderation/members?nickname=${encodeURIComponent(nickname)}`);
export const setMemberRole = (id: number, role: 'MEMBER' | 'TEAM_ADMIN', club?: string) =>
  call<ManagedMember>(`/api/moderation/members/${id}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role, club }),
  });
