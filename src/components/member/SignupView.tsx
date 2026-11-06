'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMember } from './MemberProvider';
import LoginButtons from './LoginButtons';
import ProfileForm from './ProfileForm';

// 로그인 후 돌아갈 곳은 우리 사이트 안의 경로만 (백엔드 AuthController.safeReturnTo와 같은 규칙)
function safeReturnTo(raw: string | null): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') && !raw.includes('\\') && raw !== '/signup' ? raw : '/';
}

/** 첫 로그인 직후: 닉네임·응원팀을 정해 가입을 마친다 */
export default function SignupView() {
  const { member, loading, setMember } = useMember();
  const router = useRouter();
  const returnTo = safeReturnTo(useSearchParams().get('returnTo'));
  const alreadyDone = !!member?.signupCompleted;

  // 이미 가입을 마친 사람이 이 주소로 들어오면 돌려보낸다 (렌더 중에 이동하지 않도록 effect에서)
  useEffect(() => {
    if (alreadyDone) router.replace(returnTo);
  }, [alreadyDone, returnTo, router]);

  if (loading || alreadyDone) return null;

  if (!member) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">먼저 로그인해 주세요</p>
        <div className="w-full max-w-xs"><LoginButtons /></div>
      </div>
    );
  }

  return (
    <ProfileForm
      initial={member}
      submitLabel="가입 마치기"
      onSaved={(updated) => {
        setMember(updated);
        router.replace(returnTo);
      }}
    />
  );
}
