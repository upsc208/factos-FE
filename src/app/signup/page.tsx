import { Suspense } from 'react';
import Link from 'next/link';
import SignupView from '@/components/member/SignupView';

export const metadata = { title: '가입 마치기', robots: { index: false } };

export default function SignupPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-white dark:bg-[#111318] rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl p-8">
        <Link href="/" className="text-xs font-bold text-gray-400">FACTOS</Link>
        <h1 className="mt-2 mb-2 text-2xl font-black text-gray-900 dark:text-white">가입 마치기</h1>
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">댓글에 보일 닉네임과 응원하는 팀을 정해 주세요.</p>
        {/* useSearchParams를 쓰는 클라이언트 컴포넌트는 Suspense 안에 둔다 */}
        <Suspense fallback={null}>
          <SignupView />
        </Suspense>
      </div>
    </main>
  );
}
