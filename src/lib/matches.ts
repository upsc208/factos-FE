import type { RecentMatch as GeneratedRecentMatch, UpcomingMatch as GeneratedUpcomingMatch } from '@/client/types.gen';
import { API_BASE } from '@/lib/member';

/**
 * 팀별 경기 데이터 (factos-BE `match/`, `rating/`). 1기 생성 클라이언트(`/api/matches/{clubCode}/…`)와
 * 주소가 달라 여기 손으로 둔다 — `npm run api`로 재생성해도 덮이지 않게.
 *
 * - 직전 경기: 스코어·득점·선발·교체·카드·통계 + FotMob 선수 평점. isHome은 요청한 팀 기준
 *   (Big6 맞대결은 두 팀 페이지가 같은 경기를 보여 준다)
 * - 팬 평점: 로그인 없이 IP당 선수 한 표 (0~5점)
 */

export interface FotmobPlayerRating {
  name: string;
  shirt?: string | null;
  rating?: number | null; // 0~10
  isHome: boolean;
  starter: boolean;
}

export type RecentMatch = GeneratedRecentMatch & {
  playerRatings?: FotmobPlayerRating[] | null;
  playerOfTheMatch?: string | null;
};

export type UpcomingMatch = GeneratedUpcomingMatch & {
  matchId?: string | null; // 채팅 매치 방 키
};

export interface PlayerRating {
  playerName: string;
  shirt?: string | null;
  averageScore: number; // 팬 평균 0~5
  voteCount: number;
  myScore?: number | null;
  fotmobRating?: number | null;
  starter: boolean;
}

export const FAN_SCORE_MAX = 5;

/** 서버 컴포넌트에서. 아직 수집 전이면(204) null */
export async function getClubRecentMatch(clubId: string): Promise<RecentMatch | null> {
  const res = await fetch(`${API_BASE}/api/matches/clubs/${clubId}/recent`, { cache: 'no-store' });
  if (res.status === 204 || !res.ok) return null;
  return res.json();
}

export async function getClubUpcomingMatches(clubId: string): Promise<UpcomingMatch[]> {
  const res = await fetch(`${API_BASE}/api/matches/clubs/${clubId}/upcoming`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

// ---- 팬 평점 (브라우저에서 — 투표자는 IP로 구분) ----

export async function fetchPlayerRatings(matchId: string, clubId: string): Promise<PlayerRating[]> {
  const res = await fetch(`${API_BASE}/api/matches/${matchId}/ratings?club=${clubId}`);
  if (!res.ok) throw new Error('평점을 불러오지 못했어요.');
  return res.json();
}

export async function submitPlayerRating(matchId: string, clubId: string, playerName: string, score: number): Promise<PlayerRating> {
  const res = await fetch(`${API_BASE}/api/matches/${matchId}/ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ club: clubId, playerName, score }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || '평점을 남기지 못했어요.');
  }
  return res.json();
}

// ---- 팀 브리핑 5줄 (경기 카드 첫 장) ----

export interface Briefing {
  content: string[]; // 최신순 최대 5줄
  createdAt?: string; // 가장 최근 줄이 만들어진 시각
}

export async function getClubBriefing(clubId: string): Promise<Briefing | null> {
  const res = await fetch(`${API_BASE}/api/headlines/clubs/${clubId}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const body = (await res.json()) as { content: string[]; createdAt?: string | null };
  return { content: body.content, createdAt: body.createdAt ?? undefined };
}
