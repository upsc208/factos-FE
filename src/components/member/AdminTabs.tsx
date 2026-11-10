'use client';

import { useState } from 'react';
import { useMember } from '@/components/member/MemberProvider';
import { isModerator, isSadmin, roleLabel } from '@/lib/member';
import ReportAdmin from './ReportAdmin';
import RoleAdmin from './RoleAdmin';
import StatsLinks from './StatsLinks';
import SuspensionAdmin from './SuspensionAdmin';

type Tab = 'reports' | 'suspensions' | 'roles' | 'stats';

const LABELS: Record<Tab, string> = { reports: '신고', suspensions: '정지 목록', roles: '권한', stats: '통계' };

/**
 * 관리자 페이지 탭. admin(팀 관리자) 이상: 신고 · 정지 목록. sadmin만: 권한 · 통계.
 * 화면에서 숨기는 것과 별개로 서버 API·nginx가 권한을 다시 확인한다
 */
export default function AdminTabs() {
  const { member, loading } = useMember();
  const [tab, setTab] = useState<Tab>('reports');
  const [reportCount, setReportCount] = useState<number | null>(null);

  if (loading) return null;
  if (!isModerator(member)) return <p className="py-20 text-center text-gray-400">관리자만 볼 수 있어요.</p>;

  const tabs: Tab[] = isSadmin(member) ? ['reports', 'suspensions', 'roles', 'stats'] : ['reports', 'suspensions'];

  return (
    <div>
      <p className="mb-6 text-xs text-gray-400">내 권한: <b className="text-gray-600 dark:text-gray-300">{roleLabel(member?.role, member?.adminClub)}</b></p>
      <div className="flex gap-1 mb-8 border-b border-gray-100 dark:border-white/10 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 h-11 -mb-px text-sm font-bold border-b-2 transition shrink-0 ${
              tab === t
                ? 'border-[var(--primary,#111318)] text-gray-900 dark:text-white'
                : 'border-transparent text-gray-400'
            }`}
          >
            {LABELS[t]}
            {t === 'reports' && !!reportCount && (
              <span className="ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full bg-red-600 text-white">{reportCount}</span>
            )}
          </button>
        ))}
      </div>
      {/* 신고 탭은 숨겨도 남겨 둔다 — 탭 배지 숫자를 유지하려고 */}
      <div hidden={tab !== 'reports'}><ReportAdmin onCount={setReportCount} /></div>
      {tab === 'suspensions' && <SuspensionAdmin />}
      {tab === 'roles' && <RoleAdmin />}
      {tab === 'stats' && <StatsLinks />}
    </div>
  );
}
