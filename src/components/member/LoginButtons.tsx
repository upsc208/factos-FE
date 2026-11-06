'use client';

import { useMember } from './MemberProvider';
import type { Provider } from '@/lib/member';

// 카카오·구글 로그인 버튼은 각 사 가이드의 색을 따른다 (카카오 노랑, 구글 흰 바탕)
const STYLE: Record<Provider, { label: string; className: string }> = {
  kakao: { label: '카카오로 로그인', className: 'bg-[#FEE500] text-[#191919] hover:brightness-95' },
  google: {
    label: 'Google로 로그인',
    className: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 dark:border-white/20',
  },
};

/** 설정된 로그인 수단만 버튼으로. 하나도 없으면 안내 문구 */
export default function LoginButtons() {
  const { providers, login } = useMember();

  if (providers.length === 0) {
    return <p className="text-xs text-gray-400 text-center">지금은 로그인을 쓸 수 없습니다.</p>;
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {providers.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => login(p)}
          className={`w-full h-11 rounded-xl text-sm font-bold transition ${STYLE[p].className}`}
        >
          {STYLE[p].label}
        </button>
      ))}
    </div>
  );
}
