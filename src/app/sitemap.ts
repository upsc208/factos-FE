import { MetadataRoute } from 'next';
import { getClubNews } from '@/lib/clubNews';
import { CLUB_ORDER } from '@/config/clubs';
import { SITE_URL } from '@/config/site';

// 빌드 때 한 번 만들어 굳히지 않는다 (빌드 서버에는 백엔드가 없어 기사가 0개로 굳는다). 1시간마다 다시 만든다
export const revalidate = 3600;

const PAGE_SIZE = 100; // 백엔드 NewsController.MAX_PAGE_SIZE
const MAX_PAGES_PER_CLUB = 30; // 팀당 3,000개까지. 사이트맵 한 파일 한도(5만)보다 한참 작게

/**
 * 팀 페이지 6개 + 팀별 기사 상세. 기사는 팀별 목록 API(`/api/news/clubs/{club}`)에서 모은다.
 * 여러 팀에 걸린 기사(같은 기사가 아스날·첼시 피드에 나온 경우)는 처음 나온 팀 주소 하나만 넣는다.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'always', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    ...CLUB_ORDER.map((club) => ({
      url: `${SITE_URL}/${club}`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    })),
  ];

  const seen = new Set<number>();
  const articles: MetadataRoute.Sitemap = [];

  // 팀마다 따로 실패해도 나머지 팀 기사는 넣는다
  await Promise.all(
    CLUB_ORDER.map(async (club) => {
      try {
        for (let page = 0; page < MAX_PAGES_PER_CLUB; page++) {
          const res = await getClubNews(club, page, PAGE_SIZE);
          if (!res) break;
          for (const item of res.content) {
            if (seen.has(item.id)) continue;
            seen.add(item.id);
            articles.push({
              url: `${SITE_URL}/${club}/news/${item.id}`,
              lastModified: item.publishedAt ? new Date(item.publishedAt) : now,
              changeFrequency: 'daily',
              priority: 0.6,
            });
          }
          if (page + 1 >= res.totalPages) break;
        }
      } catch (error) {
        console.error(`사이트맵: ${club} 기사 목록을 가져오지 못했습니다`, error);
      }
    }),
  );

  return [...staticPages, ...articles];
}
