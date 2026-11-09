'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Flag } from 'lucide-react';
import { useMember } from './MemberProvider';
import SuspendForm from './SuspendForm';
import { ApiError, isModerator } from '@/lib/member';
import {
  dismissReports,
  fetchReports,
  formatDateTime,
  moderatorDeleteComment,
  reportReasonLabel,
  type ReportedComment,
} from '@/lib/moderation';

/** 관리자 페이지: 처리 안 된 신고 (댓글별로 모아 신고 많은 순). 삭제·정지·문제없음 */
export default function ReportAdmin({ onCount }: { onCount?: (n: number) => void }) {
  const { member, loading } = useMember();
  const [items, setItems] = useState<ReportedComment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [suspending, setSuspending] = useState<number | null>(null);

  const allowed = isModerator(member);

  const load = useCallback(async () => {
    setError('');
    try {
      const res = await fetchReports();
      setItems(res);
      onCount?.(res.length);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '신고 목록을 불러오지 못했어요.');
    } finally {
      setLoaded(true);
    }
  }, [onCount]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 관리자 확인 뒤 한 번 읽는다
    if (allowed) load();
  }, [allowed, load]);

  const drop = (commentId: number) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.commentId !== commentId);
      onCount?.(next.length);
      return next;
    });
  };

  const remove = async (r: ReportedComment) => {
    if (!window.confirm('이 댓글을 삭제할까요?')) return;
    try {
      await moderatorDeleteComment(r.commentId);
      drop(r.commentId);
      setNotice('댓글을 삭제했어요.');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '삭제하지 못했어요.');
    }
  };

  const dismiss = async (r: ReportedComment) => {
    try {
      await dismissReports(r.commentId);
      drop(r.commentId);
      setNotice('문제없음으로 처리했어요. 댓글은 그대로 남아요.');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '처리하지 못했어요.');
    }
  };

  if (loading || !allowed) return null;

  return (
    <div>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {notice && <p className="mb-4 text-sm text-emerald-600">{notice}</p>}

      {loaded && items.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-400">처리할 신고가 없어요.</p>
      )}

      <ul className="flex flex-col gap-3">
        {items.map((r) => (
          <li key={r.commentId} className="p-5 rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#111318]">
            <p className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300">
                <Flag size={11} /> 신고 {r.reportCount}
              </span>
              {Object.entries(r.reasons).map(([reason, n]) => (
                <span key={reason} className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                  {reportReasonLabel(reason)} {n}
                </span>
              ))}
              <span className="ml-auto text-xs text-gray-400">최근 {formatDateTime(r.lastReportedAt)}</span>
            </p>

            <p className="mt-3 text-sm">
              <span className="font-bold text-gray-900 dark:text-white">{r.authorNickname}</span>
            </p>
            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words border-l-2 border-red-200 dark:border-red-500/30 pl-2">
              {r.commentContent}
            </p>
            {r.details.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1">
                {r.details.map((d, i) => (
                  <li key={i} className="text-xs text-gray-500 dark:text-gray-400">“{d}”</li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-xs text-gray-400 truncate">
              {r.articleClub ? (
                <Link href={`/${r.articleClub}/news/${r.articleId}`} className="underline">{r.articleTitle}</Link>
              ) : (
                r.articleTitle
              )}
            </p>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => dismiss(r)}
                className="px-3 h-8 rounded-lg text-xs font-bold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300"
              >
                문제없음
              </button>
              <button
                type="button"
                onClick={() => remove(r)}
                className="px-3 h-8 rounded-lg text-xs font-bold border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-300"
              >
                댓글 삭제
              </button>
              <button
                type="button"
                onClick={() => { setSuspending(suspending === r.commentId ? null : r.commentId); setNotice(''); }}
                disabled={!r.authorMemberId}
                title={r.authorMemberId ? undefined : '탈퇴한 회원이라 정지할 수 없어요'}
                className="px-3 h-8 rounded-lg text-xs font-bold text-white bg-red-600 disabled:opacity-40"
              >
                작성자 정지
              </button>
            </div>
            {suspending === r.commentId && (
              <SuspendForm
                commentId={r.commentId}
                nickname={r.authorNickname}
                onCancel={() => setSuspending(null)}
                onDone={() => {
                  setSuspending(null);
                  drop(r.commentId);
                  setNotice(`${r.authorNickname} 님을 정지했어요. 정지 목록 탭에서 볼 수 있어요.`);
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
