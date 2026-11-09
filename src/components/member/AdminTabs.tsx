'use client';

import { useState } from 'react';
import ReportAdmin from './ReportAdmin';
import SuspensionAdmin from './SuspensionAdmin';

type Tab = 'reports' | 'suspensions';

/** 관리자 페이지 탭: 신고 목록 / 정지 목록 */
export default function AdminTabs() {
  const [tab, setTab] = useState<Tab>('reports');
  const [reportCount, setReportCount] = useState<number | null>(null);

  return (
    <div>
      <div className="flex gap-1 mb-8 border-b border-gray-100 dark:border-white/10">
        {(['reports', 'suspensions'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 h-11 -mb-px text-sm font-bold border-b-2 transition ${
              tab === t
                ? 'border-[var(--primary,#111318)] text-gray-900 dark:text-white'
                : 'border-transparent text-gray-400'
            }`}
          >
            {t === 'reports' ? '신고' : '정지 목록'}
            {t === 'reports' && !!reportCount && (
              <span className="ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full bg-red-600 text-white">{reportCount}</span>
            )}
          </button>
        ))}
      </div>
      {/* 신고 탭은 숨겨도 남겨 둔다 — 탭 배지 숫자를 유지하려고 */}
      <div hidden={tab !== 'reports'}><ReportAdmin onCount={setReportCount} /></div>
      {tab === 'suspensions' && <SuspensionAdmin />}
    </div>
  );
}
