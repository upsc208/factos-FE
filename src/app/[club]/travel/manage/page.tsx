import { CLUBS } from '@/config/clubs';
import { notFound } from 'next/navigation';
import TravelTabs from '@/components/travel/TravelTabs';
import ReportQueue from '@/components/travel/guide/ReportQueue';

export const metadata = { title: '제보 처리 · 축구 여행', robots: { index: false } };

export default async function TravelManagePage({ params }: { params: Promise<{ club: string }> }) {
  const { club: clubId } = await params;
  if (!CLUBS[clubId]) notFound();

  return (
    <div className="container mx-auto px-6 lg:px-12 pt-24 pb-20 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">제보 처리</h1>
      <TravelTabs clubId={clubId} />
      <ReportQueue />
    </div>
  );
}
