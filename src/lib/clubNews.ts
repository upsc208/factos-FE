import { client } from '@/client/client.gen';

/**
 * 팀별 뉴스 (factos-BE `GET /api/news/clubs/{clubId}`).
 *
 * 생성 클라이언트(src/client)는 1기 백엔드 기준이라 이 엔드포인트가 없다.
 * 생성 파일에 넣으면 `npm run api` 때 덮어써지므로 여기 따로 둔다 — baseUrl 설정은 같은 client를 쓴다.
 */

export type TranslationStatus = 'PENDING' | 'DONE';

export interface ClubNewsItem {
  id: number;
  clubs: string[]; // config/clubs의 id ("arsenal", "mancity" …)
  titleKo?: string | null;
  titleEn?: string | null;
  keySentences: string[]; // 번역 전이면 영어 원문
  translationStatus: TranslationStatus;
  articleType: 'WEB_ARTICLE' | 'SNS_POST' | 'YOUTUBE';
  sourceName: string; // "BBC Sport", "Sky Sports", 트윗은 "X"
  authorName?: string | null; // 트윗이면 기자 계정
  originalUrl: string;
  imageUrl?: string | null;
  publishedAt?: string | null;
  viewCount: number;
}

export interface ClubNewsPage {
  content: ClubNewsItem[];
  totalPages: number;
  number: number;
}

export interface ClubNewsFilter {
  sources?: string[]; // ClubSource.internalId 목록. 없으면 전체
  search?: string;
}

export async function getClubNews(
  clubId: string,
  page: number,
  size: number,
  filter: ClubNewsFilter = {},
): Promise<ClubNewsPage | null> {
  const res = await client.get<{ 200: ClubNewsPage }, unknown, false>({
    url: '/api/news/clubs/{clubId}',
    path: { clubId },
    query: {
      page,
      size,
      ...(filter.search ? { search: filter.search } : {}),
      ...(filter.sources?.length ? { sources: filter.sources } : {}),
    },
  });
  return res.data ?? null;
}

/** 출처 필터 항목. internalId를 [getClubNews]의 sources에 그대로 넘긴다 */
export interface ClubSource {
  internalId: string; // 매체명("BBC Sport") 또는 기자 계정("David_Ornstein")
  displayName: string;
  category: 'MEDIA' | 'JOURNALIST';
}

export async function getClubSources(clubId: string): Promise<ClubSource[]> {
  const res = await client.get<{ 200: ClubSource[] }, unknown, false>({
    url: '/api/news/clubs/{clubId}/sources',
    path: { clubId },
  });
  return res.data ?? [];
}

/** 상세 응답 중 Big6 기사에만 있는 필드 (생성 타입에 없음) */
export interface ClubNewsDetailExtras {
  titleEn?: string | null;
  keySentencesEn?: string[] | null;
  translationStatus?: TranslationStatus | null;
}

/** 번역 전이면 영어 제목. 번역 상태가 없는 기존 기사는 한국어 제목 그대로 */
export function displayTitle(news: { titleKo?: string | null; titleEn?: string | null; translationStatus?: TranslationStatus | null }): string {
  if (news.translationStatus === 'PENDING') return news.titleEn || news.titleKo || '';
  return news.titleKo || news.titleEn || '';
}
