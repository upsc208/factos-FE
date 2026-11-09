import { getClubBriefing, getClubRecentMatch, getClubUpcomingMatches, type Briefing, type RecentMatch, type UpcomingMatch } from '@/lib/matches';
import { getClubNews, getClubSources, type ClubNewsPage, type ClubSource } from '@/lib/clubNews';
import NewsCard from '@/components/NewsCard';
import NewsFeedContainer from '@/components/Home/NewsFeedContainer';
import SearchBar from '@/components/Filters/SearchBar';
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
  searchParams: Promise<{ page?: string; size?: string; query?: string; sources?: string }>;
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
  const sourcesParam = searchParams.sources || '';
  // SourceFilter는 전부 해제하면 'none'을 넣는다 → 서버에 묻지 않고 빈 목록
  const noSourceSelected = sourcesParam === 'none';
  const sources = sourcesParam && !noSourceSelected ? sourcesParam.split(',') : [];

  let newsData: ClubNewsPage | null = null;
  let sourcesData: ClubSource[] = [];
  let recentMatchData: RecentMatch | null = null;
  let upcomingMatchesData: UpcomingMatch[] = [];
  let briefingData: Briefing | null = null;

  try {
    // Fetch news and sources in parallel using allSettled for robustness
    const results = await Promise.allSettled([
      // 팀별 목록 (BBC·Sky 기사 + 기자 트윗)
      noSourceSelected ? Promise.resolve(null) : getClubNews(club.id, page, size, { sources, search: query }),
      getClubSources(club.id),
      // 팀별 직전 경기(상세·평점) + 다가올 경기
      getClubRecentMatch(club.id),
      getClubUpcomingMatches(club.id),
      // 팀 브리핑 5줄
      getClubBriefing(club.id),
    ]);

    if (results[0].status === 'fulfilled') newsData = results[0].value;
    if (results[1].status === 'fulfilled') sourcesData = results[1].value;
    if (results[2].status === 'fulfilled') recentMatchData = results[2].value;
    if (results[3].status === 'fulfilled') upcomingMatchesData = results[3].value;
    if (results[4].status === 'fulfilled') briefingData = results[4].value;

  } catch (error) {
    console.error('Unexpected error during data fetch:', error);
  }

  const newsList = newsData?.content ?? [];
  const totalPages = newsData?.totalPages ?? 0;
  const currentPage = (newsData?.number ?? 0) + 1;

  return (
    <div className="flex flex-col gap-0 pt-10">
      <section className="container mx-auto px-6 lg:px-12 py-12 relative">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div className="w-full">
            <MatchResultCard 
              recentMatch={recentMatchData} 
              upcomingMatches={upcomingMatchesData}
              briefing={briefingData}
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
          {/* 카테고리 필터는 뺐다 — Big6 기사는 카테고리 분류를 하지 않는다 (CategoryFilter 컴포넌트는 남겨 둠) */}
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

