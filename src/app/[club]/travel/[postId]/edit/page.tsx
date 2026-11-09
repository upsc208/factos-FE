import { CLUBS } from '@/config/clubs';
import { notFound } from 'next/navigation';
import PostEditor from '@/components/travel/PostEditor';

export const metadata = { title: '글 수정 · 축구 여행', robots: { index: false } };

export default async function TravelEditPage({ params }: { params: Promise<{ club: string; postId: string }> }) {
  const { club: clubId, postId } = await params;
  const id = Number(postId);
  if (!CLUBS[clubId] || !Number.isInteger(id) || id <= 0) notFound();

  return (
    <div className="container mx-auto px-6 lg:px-12 pt-24 pb-20 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">글 수정</h1>
      <PostEditor clubId={clubId} postId={id} />
    </div>
  );
}
