import Link from 'next/link';
import SuspensionAdmin from '@/components/member/SuspensionAdmin';

export const metadata = { title: '관리자', robots: { index: false } };

/** 회원 관리자(팀 관리자·전체 관리자) 페이지. 권한 확인은 쿠키를 가진 브라우저에서 한다 (서버 API도 다시 막는다) */
export default function AdminPage() {
  return (
    <main className="flex-1 flex justify-center px-4 py-20">
      <div className="w-full max-w-3xl">
        <Link href="/" className="text-xs font-bold text-gray-400">FACTOS</Link>
        <h1 className="mt-2 mb-4 text-2xl font-black text-gray-900 dark:text-white">관리자 · 정지 목록</h1>
        <SuspensionAdmin />
      </div>
    </main>
  );
}
