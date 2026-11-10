'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMember } from '@/components/member/MemberProvider';
import { isModerator } from '@/lib/member';

/** 축구 여행 상단 탭: 경기장 · 펍 · 커뮤니티 (+ 관리자에게만 제보 처리) */
export default function TravelTabs({ clubId }: { clubId: string }) {
  const pathname = usePathname();
  const { member } = useMember();
  const base = `/${clubId}/travel`;
  const tabs = [
    { href: base, label: '경기장', active: pathname === base },
    { href: `${base}/pubs`, label: '펍', active: pathname.startsWith(`${base}/pubs`) },
    {
      href: `${base}/board`, label: '커뮤니티',
      active: pathname.startsWith(`${base}/board`) || pathname.startsWith(`${base}/write`) || /\/travel\/\d+/.test(pathname),
    },
    ...(isModerator(member) ? [{ href: `${base}/manage`, label: '제보 처리', active: pathname.startsWith(`${base}/manage`) }] : []),
  ];

  return (
    <nav className="flex gap-1 mb-8 border-b border-gray-100 dark:border-white/5 overflow-x-auto">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`px-4 h-11 inline-flex items-center text-sm font-bold whitespace-nowrap border-b-2 -mb-px transition ${
            t.active ? 'text-gray-900 dark:text-white' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
          style={t.active ? { borderColor: 'var(--primary)' } : undefined}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
