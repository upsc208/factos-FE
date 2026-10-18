import { getNews, getSources, getRecentMatch, getUpcomingMatches, getLatestBriefing, getTransferRanking } from '@/client/sdk.gen';
import NewsCard from '@/components/NewsCard';
import NewsFeedContainer from '@/components/Home/NewsFeedContainer';
import SearchBar from '@/components/Filters/SearchBar';
import CategoryFilter from '@/components/Filters/CategoryFilter';
import Pagination from '@/components/Pagination';
import { Newspaper, Sparkles } from 'lucide-react';
import MatchResultCard from '@/components/Home/MatchResultCard';
import MobileFilterDrawer from '@/components/Filters/MobileFilterDrawer';
import { CLUBS } from '@/config/clubs';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default async function Home({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ club: string }>;
  searchParams: Promise<{ page?: string; size?: string; query?: string; sources?: string; category?: string; isHyped?: string }>;
}) {
  const params = await paramsPromise;
  const clubId = params.club;
  const club = CLUBS[clubId];

  if (!club) {
    notFound();
  }

  const searchParams = await searchParamsPromise;
  const pageRaw = parseInt(searchParams.page || '1');
  const page = isNaN(pageRaw) ? 0 : pageRaw - 1;
  const sizeRaw = parseInt(searchParams.size || '10');
  const size = isNaN(sizeRaw) ? 10 : sizeRaw;
  const query = searchParams.query || '';
  const category = searchParams.category || '';
  const sourcesParam = searchParams.sources || '';
  const sources = sourcesParam ? sourcesParam.split(',') : [];
  const isHyped = searchParams.isHyped === 'true';

  let newsData = null;
  let sourcesData: any[] = [];
  let recentMatchData = null;
  let upcomingMatchesData: any[] = [];
  let briefingData = null;
  let transferRankingData = null;

  try {
    // Fetch news and sources in parallel using allSettled for robustness
    const results = await Promise.allSettled([
      getNews({
        path: { clubCode: club.clubCode },
        query: {
          page: page,
          size: size,
          search: query,
          ...(category && category !== 'all' ? { category } : {}),
          ...(sourcesParam && sourcesParam !== 'none' ? { sources } : {})
        }
      }),
      getSources({
        path: { clubCode: club.clubCode }
      }),
      getRecentMatch({
        path: { clubCode: club.clubCode }
      }),
      getUpcomingMatches({
        path: { clubCode: club.clubCode }
      }),
      getLatestBriefing({
        path: { clubCode: club.clubCode }
      }),
      getTransferRanking({
        path: { clubCode: club.clubCode }
      })
    ]);

    if (results[0].status === 'fulfilled') newsData = results[0].value.data;
    if (results[1].status === 'fulfilled') sourcesData = results[1].value.data || [];
    if (results[2].status === 'fulfilled') recentMatchData = results[2].value.data || null;
    if (results[3].status === 'fulfilled') upcomingMatchesData = results[3].value.data || [];
    if (results[4].status === 'fulfilled') briefingData = results[4].value.data || null;
    if (results[5].status === 'fulfilled') transferRankingData = results[5].value.data || null;

  } catch (error) {
    console.error('Unexpected error during data fetch:', error);
  }

  let newsList = (newsData as any)?.content || [];
  let totalPages = (newsData as any)?.totalPages || 0;
  const currentPage = ((newsData as any)?.number || 0) + 1;

  return (
    <div className="flex flex-col gap-0 pt-10">
      <section className="container mx-auto px-6 lg:px-12 py-12 relative">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div className="w-full">
            <MatchResultCard 
              recentMatch={recentMatchData} 
              upcomingMatches={upcomingMatchesData} 
              briefing={briefingData}
              transferRanking={transferRankingData}
              club={club} 
            />
          </div>
          <Suspense fallback={<div className="h-12 w-24 bg-gray-100 animate-pulse rounded-2xl md:hidden" />}>
            <MobileFilterDrawer allSources={sourcesData} />
          </Suspense>
        </div>

        <div id="news-section" className="scroll-mt-36 md:scroll-mt-24">
          <Suspense fallback={<div className="h-14 w-full bg-gray-100 animate-pulse rounded-2xl mb-12" />}>
            <SearchBar />
          </Suspense>
          <Suspense fallback={<div className="h-10 w-full bg-gray-100 animate-pulse rounded-full mb-8" />}>
            <CategoryFilter />
          </Suspense>
        </div>

        <NewsFeedContainer sourcesData={sourcesData}>
          {newsList.length > 0 ? (
            <>
              <div className="flex flex-col min-h-[600px] -mt-10">
                {newsList.map((news) => (
                  <NewsCard key={news.id} news={news} showImage={true} fromPage={currentPage} club={club} />
                ))}
              </div>

              <Suspense fallback={<div className="h-10 w-full bg-gray-100 animate-pulse rounded-xl mt-16" />}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </Suspense>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-48 bg-white dark:bg-[#111318] rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-white/[0.04] relative">
              <div className="relative mb-8 z-10">
                <Newspaper size={80} className="text-gray-100" />
                <Sparkles size={24} className="absolute -top-2 -right-2 text-gray-200 animate-pulse" />
              </div>
              <p className="text-gray-400 dark:text-gray-500 font-black tracking-tight text-center px-4 text-xl uppercase relative z-10">
                등록된 뉴스가 없습니다.
              </p>
            </div>
          )}
        </NewsFeedContainer>
      </section>
    </div>
  );
}

