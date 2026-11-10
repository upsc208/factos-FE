import { CLUBS } from '@/config/clubs';
import { notFound } from 'next/navigation';
import TravelTabs from '@/components/travel/TravelTabs';
import StadiumGuideView from '@/components/travel/guide/StadiumGuideView';

export const metadata = { title: '경기장 가이드 · 축구 여행' };

/** 축구 여행 첫 화면: 경기장 가는 길 · 다가올 홈경기 · 경기장 안 굿즈·음식 가격 (travel-svc) */
export default async function TravelPage({ params }: { params: Promise<{ club: string }> }) {
  const { club: clubId } = await params;
  const club = CLUBS[clubId];
  if (!club) notFound();

  return (
    <div className="container mx-auto px-6 lg:px-12 pt-24 pb-20 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">축구 여행</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{club.nameKo} 직관 준비 — 경기장, 펍, 다녀온 사람들 이야기</p>
      <TravelTabs clubId={club.id} />
      <StadiumGuideView clubId={club.id} />
    </div>
  );
}
