'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMember } from './MemberProvider';
import LoginButtons from './LoginButtons';
import ProfileForm from './ProfileForm';
import { ApiError, withdraw } from '@/lib/member';

/** 내 정보: 닉네임·응원팀 수정, 회원 탈퇴 */
export default function AccountView() {
  const { member, loading, setMember } = useMember();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState('');

  if (loading) return null;
  if (!member) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">로그인이 필요합니다</p>
        <div className="w-full max-w-xs"><LoginButtons /></div>
      </div>
    );
  }

  const doWithdraw = async () => {
    setWithdrawing(true);
    setError('');
    try {
      await withdraw();
      setMember(null);
      router.replace('/');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '탈퇴하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      setWithdrawing(false);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <section>
        <p className="mb-6 text-xs text-gray-400">{member.provider === 'KAKAO' ? '카카오' : 'Google'} 계정으로 로그인됨</p>
        <ProfileForm
          key={member.id}
          initial={member}
          submitLabel="저장"
          onSaved={(updated) => { setMember(updated); setSaved(true); }}
        />
        {saved && <p className="mt-3 text-sm text-green-600">저장했습니다.</p>}
      </section>

      <section className="pt-8 border-t border-gray-100 dark:border-white/10">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">회원 탈퇴</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
          닉네임·응원팀·즐겨찾기가 지워지고 되돌릴 수 없습니다. 작성한 댓글은 지워지지 않고
          작성자가 &quot;탈퇴한 회원&quot;으로 표시됩니다. 지우고 싶은 댓글은 탈퇴 전에 직접 삭제해 주세요.
        </p>
        {confirming ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={doWithdraw}
              disabled={withdrawing}
              className="h-10 px-4 rounded-xl text-sm font-bold bg-red-600 text-white disabled:opacity-50"
            >
              {withdrawing ? '처리 중…' : '정말 탈퇴하기'}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={withdrawing}
              className="h-10 px-4 rounded-xl text-sm font-bold border border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-300"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="h-10 px-4 rounded-xl text-sm font-bold border border-red-300 text-red-600"
          >
            탈퇴하기
          </button>
        )}
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </section>
    </div>
  );
}
