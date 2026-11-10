import { CLUBS } from '@/config/clubs';
import { notFound } from 'next/navigation';
import TravelTabs from '@/components/travel/TravelTabs';
import TravelBoard from '@/components/travel/TravelBoard';

export const metadata = { title: '커뮤니티 · 축구 여행' };

/** 축구 여행 커뮤니티 (travel-svc). 목록은 브라우저에서 읽는다 */
export default async function TravelBoardPage({ params }: { params: Promise<{ club: string }> }) {
  const { club: clubId } = await params;
  const club = CLUBS[clubId];
  if (!club) notFound();

  return (
    <div className="container mx-auto px-6 lg:px-12 pt-24 pb-20 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">축구 여행</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">직관 후기, 경기장 가는 길, 펍과 숙소 팁을 나눠요</p>
      <TravelTabs clubId={club.id} />
      <TravelBoard clubId={club.id} />
    </div>
  );
}
