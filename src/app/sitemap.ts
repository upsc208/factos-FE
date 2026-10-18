import { MetadataRoute } from 'next';
import { getNews } from '@/client/sdk.gen';

/**
 * 3,000개 이상의 데이터를 안전하게 가져오기 위해 
 * 페이지네이션을 순회하며 뉴스 URL 목록을 생성합니다.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://atleti.kr';

  // 1. 정적 페이지 정의
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 2. 동적 뉴스 페이지 URL 수집
  let allNewsUrls: MetadataRoute.Sitemap = [];
  const size = 500; // 한 번에 가져올 양 (백엔드 부담 최소화)

  try {
    // 첫 번째 페이지 호출하여 전체 페이지 수 확인
    const firstResponse = await getNews({
      query: { page: 0, size: size }
    } as any);

    if (firstResponse.data && firstResponse.data.content) {
      const totalPages = firstResponse.data.totalPages || 1;

      // 첫 페이지 데이터 추가
      const firstPageUrls = firstResponse.data.content.map((news) => ({
        url: `${baseUrl}/news/${news.id}`,
        lastModified: news.publishedAt ? new Date(news.publishedAt) : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.6,
      }));
      allNewsUrls = [...firstPageUrls];

      // 나머지 페이지 병렬 호출 (부하 조절을 위해 Promise.all 사용)
      if (totalPages > 1) {
        const remainingPagePromises = [];
        for (let i = 1; i < totalPages; i++) {
          remainingPagePromises.push(getNews({ query: { page: i, size: size } } as any));
        }

        const responses = await Promise.all(remainingPagePromises);
        responses.forEach((res) => {
          if (res.data && res.data.content) {
            const pageUrls = res.data.content.map((news) => ({
              url: `${baseUrl}/news/${news.id}`,
              lastModified: news.publishedAt ? new Date(news.publishedAt) : new Date(),
              changeFrequency: 'daily' as const,
              priority: 0.6,
            }));
            allNewsUrls = [...allNewsUrls, ...pageUrls];
          }
        });
      }
    }
  } catch (error) {
    console.error('사이트맵 생성 중 뉴스 데이터를 가져오지 못했습니다:', error);
  }

  return [...staticPages, ...allNewsUrls];
}
