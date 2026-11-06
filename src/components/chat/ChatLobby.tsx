'use client';

import { useEffect, useState } from 'react';
import { MessagesSquare, Swords } from 'lucide-react';
import { CLUBS } from '@/config/clubs';
import { fetchChatRooms, type ChatRoomSummary } from '@/lib/chat';
import ChatRoom from './ChatRoom';

const ROOM_LIST_REFRESH_MS = 60_000; // 매치 방 열림·접속자 수 갱신

function kickoffLabel(iso?: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('ko-KR', {
    month: 'numeric', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit',
  });
}

/**
 * 팀 채팅 화면: 왼쪽(모바일은 위) 방 목록 + 고른 방.
 * 고른 방은 `?room=`에 남겨 새로고침·공유해도 같은 방으로 온다.
 */
export default function ChatLobby({ clubId, initialRoomId }: { clubId: string; initialRoomId?: string }) {
  const [rooms, setRooms] = useState<ChatRoomSummary[] | null>(null);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(initialRoomId ?? `team-${clubId}`);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetchChatRooms(clubId)
        .then((r) => { if (alive) { setRooms(r); setError(''); } })
        .catch(() => { if (alive) setError('채팅방 목록을 불러오지 못했어요.'); });
    load();
    const timer = setInterval(load, ROOM_LIST_REFRESH_MS);
    return () => { alive = false; clearInterval(timer); };
  }, [clubId]);

  const select = (roomId: string) => {
    setSelectedId(roomId);
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomId);
    window.history.replaceState(null, '', url);
  };

  // 목록에 없는 방(지난 경기 링크 등)이면 팀 방으로
  const selected = rooms?.find((r) => r.roomId === selectedId) ?? rooms?.[0];
  const teamRoom = rooms?.filter((r) => r.type === 'TEAM') ?? [];
  const matchRooms = rooms?.filter((r) => r.type === 'MATCH') ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="flex flex-col gap-2">
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!rooms && !error && <p className="text-sm text-gray-400">불러오는 중…</p>}

        {teamRoom.map((r) => (
          <RoomButton key={r.roomId} room={r} active={selected?.roomId === r.roomId} onClick={() => select(r.roomId)} />
        ))}

        {rooms && (
          <p className="mt-4 mb-1 text-xs font-bold text-gray-400 tracking-wide">경기 채팅</p>
        )}
        {rooms && matchRooms.length === 0 && (
          <p className="text-sm text-gray-400">예정된 경기를 불러오는 중이에요. 잠시 뒤 다시 확인해 주세요.</p>
        )}
        {matchRooms.map((r) => (
          <RoomButton key={r.roomId} room={r} active={selected?.roomId === r.roomId} onClick={() => select(r.roomId)} />
        ))}
      </aside>

      <section>
        {/* key: 방을 바꾸면 이전 연결을 끊고 새로 들어간다 */}
        {selected && <ChatRoom key={selected.roomId} room={selected} />}
      </section>
    </div>
  );
}

function RoomButton({ room, active, onClick }: { room: ChatRoomSummary; active: boolean; onClick: () => void }) {
  const derby = room.clubs.length > 1;
  const Icon = room.type === 'TEAM' ? MessagesSquare : Swords;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-2xl border transition ${
        active
          ? 'border-[var(--primary)] bg-[var(--primary-glow)]'
          : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#111318] hover:border-gray-300 dark:hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="shrink-0" style={{ color: 'var(--primary)' }} />
        <span className="font-bold text-sm text-gray-900 dark:text-white truncate flex-1">{room.title}</span>
        {room.open ? (
          <span className="text-[11px] font-bold text-emerald-600 shrink-0">● {room.onlineCount}</span>
        ) : (
          <span className="text-[11px] font-bold text-gray-400 shrink-0">대기</span>
        )}
      </div>
      {room.type === 'MATCH' && (
        <p className="mt-1 pl-6 text-xs text-gray-500 dark:text-gray-400">
          {kickoffLabel(room.kickoff)}{room.tournament ? ` · ${room.tournament}` : ''}
        </p>
      )}
      {derby && (
        <p className="mt-1 pl-6 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
          {room.clubs.map((id) => CLUBS[id]?.nameKo ?? id).join(' · ')} 팬 공동 방
        </p>
      )}
    </button>
  );
}
