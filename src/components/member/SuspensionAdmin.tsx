'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useMember } from './MemberProvider';
import { ApiError, isModerator, teamLabel } from '@/lib/member';
import { fetchSuspensions, formatDateTime, liftSuspension, type Suspension } from '@/lib/moderation';
import { CLUB_ORDER, CLUBS } from '@/config/clubs';

type Tab = 'active' | 'all';

/** 관리자 페이지: 정지 목록 (지금 정지 중 / 전체 기록), 팀별로 거르기, 해제 */
export default function SuspensionAdmin() {
  const { member, loading } = useMember();
  const [tab, setTab] = useState<Tab>('active');
  const [club, setClub] = useState(''); // '' = 전체 팀
  const [items, setItems] = useState<Suspension[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (nextPage: number) => {
    setBusy(true);
    setError('');
    try {
      const res = await fetchSuspensions({ active: tab === 'active', club: club || undefined, page: nextPage });
      setItems((prev) => (nextPage === 0 ? res.content : [...prev, ...res.content]));
      setPage(nextPage);
      setHasMore(nextPage + 1 < res.totalPages);
      setTotal(res.totalElements);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '정지 목록을 불러오지 못했어요.');
    } finally {
      setBusy(false);
    }
  }, [tab, club]);

  const allowed = isModerator(member);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 탭·팀을 바꾸면 처음부터 다시 읽는다
    if (allowed) load(0);
  }, [allowed, load]);

  const lift = async (s: Suspension) => {
    if (!window.confirm(`${s.nickname} 님의 정지를 해제할까요?`)) return;
    try {
      const updated = await liftSuspension(s.id);
      setItems((prev) => (tab === 'active' ? prev.filter((x) => x.id !== s.id) : prev.map((x) => (x.id === s.id ? updated : x))));
      if (tab === 'active') setTotal((t) => t - 1);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '해제하지 못했어요.');
    }
  };

  if (loading) return null;
  if (!allowed) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">관리자만 볼 수 있는 페이지예요.</p>;
  }

  return (
    <div>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {member!.role === 'ADMIN' ? '전체 관리자' : `${teamLabel(member!.adminClub) ?? member!.adminClub} 팀 관리자`} · {member!.nickname}
        <span className="block mt-1 text-xs text-gray-400">
          신고 탭이나 기사 댓글 옆 버튼으로 댓글을 지우고 정지할 수 있어요.{member!.role === 'TEAM_ADMIN' && ' 담당 팀 기사의 댓글만 관리할 수 있어요.'}
        </span>
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(['active', 'all'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 h-9 rounded-xl text-sm font-bold border transition ${
              tab === t ? 'text-white border-transparent' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
            }`}
            style={tab === t ? { backgroundColor: 'var(--primary, #111318)' } : undefined}
          >
            {t === 'active' ? '정지 중' : '전체 기록'}
          </button>
        ))}
        <select
          value={club}
          onChange={(e) => setClub(e.target.value)}
          className="ml-auto h-9 px-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111318] text-sm text-gray-700 dark:text-gray-200"
        >
          <option value="">모든 팀</option>
          {CLUB_ORDER.map((id) => (
            <option key={id} value={id}>{CLUBS[id]?.nameKo ?? id}</option>
          ))}
        </select>
      </div>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <p className="mb-3 text-xs font-bold text-gray-400">{total}건</p>

      {!busy && items.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-400">{tab === 'active' ? '지금 정지된 회원이 없어요.' : '정지 기록이 없어요.'}</p>
      )}

      <ul className="flex flex-col gap-3">
        {items.map((s) => (
          <li key={s.id} className="p-5 rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#111318]">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-gray-900 dark:text-white">{s.nickname}</span>
                  {s.club && (
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                      {CLUBS[s.club]?.nameKo ?? s.club}
                    </span>
                  )}
                  <StatusBadge s={s} />
                </p>
                <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">사유: {s.reason}</p>
                {s.commentContent && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 border-l-2 border-gray-200 dark:border-white/10 pl-2 whitespace-pre-wrap break-words">
                    {s.commentContent}
                    {s.articleId && s.club && (
                      <Link href={`/${s.club}/news/${s.articleId}`} className="ml-2 underline">기사</Link>
                    )}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-400">
                  {formatDateTime(s.createdAt)} {s.createdByNickname} → {formatDateTime(s.endsAt)}까지
                  {s.liftedAt && ` · ${formatDateTime(s.liftedAt)} ${s.liftedByNickname ?? ''} 해제`}
                </p>
              </div>
              {s.liftable && (
                <button
                  type="button"
                  onClick={() => lift(s)}
                  className="shrink-0 px-3 h-8 rounded-lg text-xs font-bold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-red-300 hover:text-red-600"
                >
                  해제
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={() => load(page + 1)}
          disabled={busy}
          className="mt-6 w-full h-11 rounded-xl text-sm font-bold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 disabled:opacity-40"
        >
          더 보기
        </button>
      )}
    </div>
  );
}

function StatusBadge({ s }: { s: Suspension }) {
  if (s.active) return <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300">정지 중</span>;
  if (s.liftedAt) return <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">해제됨</span>;
  return <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-500">기간 끝남</span>;
}
