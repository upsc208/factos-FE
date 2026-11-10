import { CLUBS } from '@/config/clubs';
import { notFound } from 'next/navigation';
import TravelTabs from '@/components/travel/TravelTabs';
import PubFinder from '@/components/travel/guide/PubFinder';

export const metadata = { title: '펍 · 축구 여행' };

export default async function TravelPubsPage({ params }: { params: Promise<{ club: string }> }) {
  const { club: clubId } = await params;
  const club = CLUBS[clubId];
  if (!club) notFound();

  return (
    <div className="container mx-auto px-6 lg:px-12 pt-24 pb-20 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">축구 여행</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">경기장 근처 펍, 표가 없을 때 {club.nameKo} 경기를 같이 볼 곳</p>
      <TravelTabs clubId={club.id} />
      <PubFinder clubId={club.id} />
    </div>
  );
}
