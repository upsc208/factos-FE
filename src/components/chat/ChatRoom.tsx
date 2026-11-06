'use client';

import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { Send, Users } from 'lucide-react';
import { useMember } from '@/components/member/MemberProvider';
import { ApiError } from '@/lib/member';
import {
  CHAT_MAX_LENGTH, CHAT_NICKNAME_MAX, CHAT_NICKNAME_MIN,
  chatClientId, chatSocketUrl, fetchChatRoom, reserveChatNickname, saveChatNickname, savedChatNickname,
  type ChatMessage, type ChatRoomSummary,
} from '@/lib/chat';

type Phase = 'nickname' | 'joining' | 'connected' | 'reconnecting';

// 화면에 그릴 줄. 내 오류 안내도 같은 목록에 끼운다
type Line = (ChatMessage & { key: string }) | { key: string; type: 'ERROR'; content: string };

const MAX_LINES = 300;
let lineSeq = 0;
const toLine = (m: ChatMessage): Line => ({ ...m, key: `m${lineSeq++}` });

function timeOf(iso?: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * 채팅방 하나. 닉네임 선점(REST) → 최근 메시지(REST) → STOMP 접속·구독 순서.
 * roomId가 바뀌면 부모가 key로 새로 그리므로, 이 컴포넌트는 방 하나만 책임진다.
 */
export default function ChatRoom({ room }: { room: ChatRoomSummary }) {
  const { member } = useMember();
  const [phase, setPhase] = useState<Phase>('nickname');
  const [nickname, setNickname] = useState('');
  const [joinedAs, setJoinedAs] = useState('');
  const [lines, setLines] = useState<Line[]>([]);
  const [online, setOnline] = useState(room.onlineCount);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const clientRef = useRef<Client | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  // 닉네임 기본값: 지난번 채팅 닉네임 → 회원 닉네임
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage는 브라우저에서만 읽힌다
    setNickname((cur) => cur || savedChatNickname() || member?.nickname || '');
  }, [member?.nickname]);

  // 방에서 나가면(언마운트) 연결을 끊는다
  useEffect(() => () => { clientRef.current?.deactivate(); }, []);

  // 맨 아래를 보고 있을 때만 새 메시지를 따라 내려간다
  useEffect(() => {
    const el = logRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const push = (line: Line) => setLines((prev) => [...prev, line].slice(-MAX_LINES));

  const join = async () => {
    const nick = nickname.trim();
    if (nick.length < CHAT_NICKNAME_MIN) {
      setError(`닉네임은 ${CHAT_NICKNAME_MIN}~${CHAT_NICKNAME_MAX}자로 입력해주세요.`);
      return;
    }
    setError('');
    setPhase('joining');
    try {
      const reserved = await reserveChatNickname(room.roomId, nick);
      const info = await fetchChatRoom(room.roomId);
      saveChatNickname(reserved.nickname);
      setJoinedAs(reserved.nickname);
      setLines(info.messages.filter((m) => m.type !== 'LED').map(toLine));
      setOnline(info.onlineCount);
      connect();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '채팅방에 들어가지 못했습니다.');
      setPhase('nickname');
    }
  };

  const connect = () => {
    const client = new Client({
      brokerURL: chatSocketUrl(),
      connectHeaders: { 'x-chat-client-id': chatClientId() },
      reconnectDelay: 3000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,
      onConnect: () => {
        setPhase('connected');
        // 재접속 때도 이 콜백이 다시 불리므로 구독은 여기서 한다
        client.subscribe(`/topic/chat/${room.roomId}`, (frame) => {
          const msg = JSON.parse(frame.body) as ChatMessage;
          if (msg.type !== 'LED') push(toLine(msg));
        });
        client.subscribe('/user/queue/errors', (frame) => {
          const body = JSON.parse(frame.body) as { error?: string };
          push({ key: `e${lineSeq++}`, type: 'ERROR', content: body.error || '메시지를 보내지 못했습니다.' });
        });
      },
      onWebSocketClose: () => setPhase((p) => (p === 'connected' ? 'reconnecting' : p)),
    });
    clientRef.current = client;
    client.activate();
  };

  const send = () => {
    const content = text.trim();
    const client = clientRef.current;
    if (!content || !client?.connected) return;
    client.publish({
      destination: `/app/chat/${room.roomId}`,
      body: JSON.stringify({ nickname: joinedAs, content }),
    });
    setText('');
    stickToBottom.current = true;
  };

  const closedMatch = !room.open;

  return (
    <div className="flex flex-col h-[70vh] min-h-[420px] rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111318] overflow-hidden">
      {/* 방 머리 */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/5">
        <div className="min-w-0 flex-1">
          <p className="font-bold text-gray-900 dark:text-white truncate">{room.title}</p>
          {room.clubs.length > 1 && (
            <p className="text-xs text-gray-400">두 팀 팬이 함께 쓰는 방이에요</p>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 shrink-0">
          <Users size={14} /> {phase === 'connected' || phase === 'reconnecting' ? online + 1 : online}
        </span>
      </div>

      {closedMatch ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 p-8 text-center">
          <p className="font-bold text-gray-800 dark:text-gray-100">아직 열리지 않은 방이에요</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">경기 시작 1시간 전에 열리고, 끝나고 3시간 뒤 닫혀요.</p>
        </div>
      ) : phase === 'nickname' || phase === 'joining' ? (
        <form
          className="flex-1 flex flex-col items-center justify-center gap-3 p-8"
          onSubmit={(e) => { e.preventDefault(); join(); }}
        >
          <p className="font-bold text-gray-800 dark:text-gray-100">채팅에서 쓸 닉네임</p>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, CHAT_NICKNAME_MAX))}
            placeholder={`${CHAT_NICKNAME_MIN}~${CHAT_NICKNAME_MAX}자`}
            className="w-full max-w-xs h-11 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b0c10] text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            disabled={phase === 'joining'}
            className="w-full max-w-xs h-11 rounded-xl text-sm font-bold text-white disabled:opacity-40"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {phase === 'joining' ? '들어가는 중…' : '입장'}
          </button>
          <p className="text-xs text-gray-400 text-center">로그인 없이도 쓸 수 있어요. 링크는 보낼 수 없어요.</p>
        </form>
      ) : (
        <>
          <div
            ref={logRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
            }}
            className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2"
          >
            {lines.length === 0 && (
              <p className="m-auto text-sm text-gray-400">첫 메시지를 남겨 보세요.</p>
            )}
            {lines.map((line) => <ChatLine key={line.key} line={line} me={joinedAs} />)}
          </div>

          {phase === 'reconnecting' && (
            <p className="px-5 py-1.5 text-xs text-amber-600 bg-amber-50 dark:bg-amber-500/10">연결이 끊겨 다시 잇는 중이에요…</p>
          )}

          <form
            className="flex items-center gap-2 p-3 border-t border-gray-100 dark:border-white/5"
            onSubmit={(e) => { e.preventDefault(); send(); }}
          >
            <span className="hidden sm:block text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0 max-w-24 truncate">{joinedAs}</span>
            <input
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, CHAT_MAX_LENGTH))}
              placeholder="메시지 입력"
              className="flex-1 min-w-0 h-11 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0b0c10] text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
            />
            <button
              type="submit"
              disabled={!text.trim() || phase !== 'connected'}
              className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center text-white disabled:opacity-40"
              style={{ backgroundColor: 'var(--primary)' }}
              title="보내기"
            >
              <Send size={18} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}

function ChatLine({ line, me }: { line: Line; me: string }) {
  if (line.type === 'ERROR') {
    return <p className="text-xs text-red-500 text-center">{line.content}</p>;
  }
  // 매치봇의 골·경기 상태 알림
  if (line.type === 'GOAL' || line.type === 'GOAL_CANCELLED' || line.type === 'STATUS') {
    return (
      <p className="self-center text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200">
        {line.content}
      </p>
    );
  }
  const mine = line.nickname === me;
  const admin = line.type === 'ADMIN';
  return (
    <div className={`flex flex-col max-w-[85%] ${mine ? 'self-end items-end' : 'self-start items-start'}`}>
      <span className="text-[11px] text-gray-400 mb-0.5">
        <span className={`font-bold ${admin ? 'text-amber-600' : 'text-gray-600 dark:text-gray-300'}`}>
          {admin ? `${line.nickname} (운영자)` : line.nickname}
        </span>
        {line.ipHash && <span className="ml-1">#{line.ipHash}</span>}
        <span className="ml-1.5">{timeOf(line.sentAt)}</span>
      </span>
      <p
        className={`px-3.5 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${
          admin
            ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-100'
            : mine
              ? 'text-white'
              : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-100'
        }`}
        style={mine && !admin ? { backgroundColor: 'var(--primary)' } : undefined}
      >
        {line.content}
      </p>
    </div>
  );
}
