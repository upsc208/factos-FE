import { CLUBS } from '@/config/clubs';
import { notFound } from 'next/navigation';
import PostView from '@/components/travel/PostView';

export const metadata = { title: '축구 여행' };

export default async function TravelPostPage({ params }: { params: Promise<{ club: string; postId: string }> }) {
  const { club: clubId, postId } = await params;
  const id = Number(postId);
  if (!CLUBS[clubId] || !Number.isInteger(id) || id <= 0) notFound();

  return (
    <div className="container mx-auto px-6 lg:px-12 pt-24 pb-20 max-w-3xl">
      <PostView clubId={clubId} postId={id} />
    </div>
  );
}
