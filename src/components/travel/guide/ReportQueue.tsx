'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMember } from '@/components/member/MemberProvider';
import { CLUBS } from '@/config/clubs';
import { ApiError, isModerator } from '@/lib/member';
import { fetchPendingReports, formatGbp, ITEM_CATEGORIES, reviewReport, type GuideReport } from '@/lib/travel';

function describe(r: GuideReport) {
  if (r.kind === 'PUB') {
    return [
      r.club && `${CLUBS[r.club]?.nameKo ?? r.club} 팬 펍`,
      r.showsFootball && '축구 중계',
    ].filter(Boolean).join(' · ') || '메모';
  }
  const price = r.pricePence != null ? formatGbp(r.pricePence) : '가격 없음';
  if (r.itemId) return `가격 → ${price}`;
  return `새 항목 (${ITEM_CATEGORIES.find((c) => c.id === r.category)?.label ?? r.category}) ${price}`;
}

/** 관리자: 회원 제보 처리 (전체 관리자는 전부, 팀 관리자는 자기 팀 것) */
export default function ReportQueue() {
  const { member, loading } = useMember();
  const [reports, setReports] = useState<GuideReport[] | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    fetchPendingReports().then(setReports).catch((e) => setError(e instanceof ApiError ? e.message : '불러오지 못했어요.'));
  }, []);

  useEffect(() => { if (isModerator(member)) load(); }, [member, load]);

  const review = async (id: number, approve: boolean) => {
    try {
      await reviewReport(id, approve);
      setReports((prev) => prev?.filter((r) => r.id !== id) ?? null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '처리하지 못했어요.');
    }
  };

  if (loading) return null;
  if (!isModerator(member)) return <p className="py-20 text-center text-gray-400">관리자만 볼 수 있어요.</p>;

  return (
    <div>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {reports && reports.length === 0 && <p className="py-20 text-center text-gray-400">처리할 제보가 없어요.</p>}
      <ul className="flex flex-col divide-y divide-gray-100 dark:divide-white/5">
        {reports?.map((r) => (
          <li key={r.id} className="py-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0 text-sm">
              <p className="text-xs text-gray-400">
                {r.kind === 'PUB' ? '펍' : '경기장'} {r.club && `· ${CLUBS[r.club]?.nameKo ?? r.club}`} · {r.reporter}
                {r.seenOn && ` · ${r.seenOn} 봄`}
              </p>
              <p className="mt-0.5 font-bold text-gray-900 dark:text-white break-words">{r.target}</p>
              <p className="text-gray-700 dark:text-gray-300">{describe(r)}</p>
              {r.note && <p className="text-gray-500">“{r.note}”</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button type="button" onClick={() => review(r.id, false)} className="px-4 h-9 rounded-xl text-xs font-bold border border-gray-200 dark:border-white/10 text-gray-500">거절</button>
              <button type="button" onClick={() => review(r.id, true)} className="px-4 h-9 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: 'var(--primary)' }}>승인</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
