import { CLUBS } from '@/config/clubs';
import { notFound } from 'next/navigation';
import PostEditor from '@/components/travel/PostEditor';

export const metadata = { title: '글쓰기 · 축구 여행', robots: { index: false } };

export default async function TravelWritePage({ params }: { params: Promise<{ club: string }> }) {
  const { club: clubId } = await params;
  if (!CLUBS[clubId]) notFound();

  return (
    <div className="container mx-auto px-6 lg:px-12 pt-24 pb-20 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">글쓰기</h1>
      <PostEditor clubId={clubId} />
    </div>
  );
}
