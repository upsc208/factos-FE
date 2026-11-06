import Link from 'next/link';
import AccountView from '@/components/member/AccountView';

export const metadata = { title: '내 정보', robots: { index: false } };

export default function MyPage() {
  return (
    <main className="flex-1 flex justify-center px-4 py-20">
      <div className="w-full max-w-md bg-white dark:bg-[#111318] rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl p-8">
        <Link href="/" className="text-xs font-bold text-gray-400">FACTOS</Link>
        <h1 className="mt-2 mb-8 text-2xl font-black text-gray-900 dark:text-white">내 정보</h1>
        <AccountView />
      </div>
    </main>
  );
}
