'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, LogIn, LogOut, Settings, UserCircle2 } from 'lucide-react';
import { useMember } from './MemberProvider';
import { teamLabel } from '@/lib/member';
import LoginButtons from './LoginButtons';

interface AccountMenuProps {
  clubId?: string;
  linkClassName: string; // 헤더의 다른 메뉴와 같은 모양
}

/** 헤더 오른쪽: 비로그인이면 "로그인", 로그인했으면 닉네임 + 즐겨찾기·로그아웃 */
export default function AccountMenu({ clubId, linkClassName }: AccountMenuProps) {
  const { member, loading, logout } = useMember();
  const [open, setOpen] = useState(false);

  // 첫 응답 전에는 자리만 잡아 둔다 (로그인한 사람에게 "로그인"이 잠깐 보이는 깜빡임 방지)
  if (loading) return <span className="w-16 h-5" aria-hidden />;

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} className={linkClassName} aria-expanded={open}>
        {member ? (
          member.profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- 카카오·구글 CDN 이미지라 next/image 도메인 설정 없이 그대로 쓴다
            <img src={member.profileImageUrl} alt="" className="w-5 h-5 rounded-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <UserCircle2 className="w-5 h-5" />
          )
        ) : (
          <LogIn className="w-5 h-5" />
        )}
        <span className="tracking-tight max-w-[6rem] truncate">{member ? member.nickname : '로그인'}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-60 p-4 bg-white dark:bg-[#111318] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-[70] text-gray-800 dark:text-gray-200">
            {member ? (
              <div className="flex flex-col gap-1">
                <p className="px-2 pb-2 text-xs text-gray-400">
                  {member.provider === 'KAKAO' ? '카카오' : 'Google'} 계정
                  {teamLabel(member.favoriteTeam) && ` · ${teamLabel(member.favoriteTeam)} 팬`}
                </p>
                <Link
                  href="/me"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  <Settings size={16} /> 내 정보
                </Link>
                <Link
                  href={clubId ? `/${clubId}/bookmarks` : '/'}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  <Bookmark size={16} /> 즐겨찾기
                </Link>
                <button
                  type="button"
                  onClick={async () => { setOpen(false); await logout(); }}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 dark:hover:bg-white/10 text-left"
                >
                  <LogOut size={16} /> 로그아웃
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">로그인하면 댓글과 즐겨찾기를 쓸 수 있어요</p>
                <LoginButtons />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
