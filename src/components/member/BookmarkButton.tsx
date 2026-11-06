'use client';

import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useMember } from './MemberProvider';
import { fetchBookmarked, setBookmark } from '@/lib/member';

/** 기사 상세의 즐겨찾기 토글. 비로그인이면 누를 때 로그인 안내 */
export default function BookmarkButton({ articleId }: { articleId: number }) {
  const { member } = useMember();
  const [saved, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState('');
  // 로그아웃하면 이전 값이 남아 있어도 꺼진 것으로 보인다
  const on = !!member && saved;

  useEffect(() => {
    if (!member) return;
    fetchBookmarked(articleId).then(setOn).catch(() => setOn(false));
  }, [member, articleId]);

  const toggle = async () => {
    if (!member) {
      setHint('로그인하면 즐겨찾기를 쓸 수 있어요 (오른쪽 위 "로그인")');
      return;
    }
    setBusy(true);
    const next = !on;
    setOn(next); // 먼저 바꿔 보여 주고, 실패하면 되돌린다
    try {
      setOn(await setBookmark(articleId, next));
    } catch {
      setOn(!next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-pressed={on}
        title={on ? '즐겨찾기 해제' : '즐겨찾기'}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border border-gray-100 dark:border-white/[0.04] bg-white/50 dark:bg-white/[0.03] text-gray-600 dark:text-gray-300 hover:opacity-80 transition disabled:opacity-50"
      >
        <Bookmark size={16} className={on ? 'fill-current' : ''} style={on ? { color: 'var(--primary)' } : undefined} />
        <span className="hidden sm:inline">{on ? '저장됨' : '저장'}</span>
      </button>
      {hint && (
        <p className="absolute right-0 top-full mt-2 w-56 text-xs bg-gray-900 text-white rounded-lg px-3 py-2 z-10" onClick={() => setHint('')}>
          {hint}
        </p>
      )}
    </div>
  );
}
