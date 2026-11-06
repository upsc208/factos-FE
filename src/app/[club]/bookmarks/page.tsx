import { CLUBS } from '@/config/clubs';
import { notFound } from 'next/navigation';
import BookmarkList from '@/components/member/BookmarkList';

export const metadata = { title: '즐겨찾기', robots: { index: false } };

/** 내 즐겨찾기. 로그인 쿠키는 브라우저에서만 실리므로 목록은 클라이언트 컴포넌트가 읽는다 */
export default async function BookmarksPage({ params }: { params: Promise<{ club: string }> }) {
  const { club: clubId } = await params;
  const club = CLUBS[clubId];
  if (!club) notFound();

  return (
    <div className="container mx-auto px-6 lg:px-12 pt-24 pb-20 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-10 tracking-tight">즐겨찾기</h1>
      <BookmarkList clubId={club.id} />
    </div>
  );
}
