import { ApiError } from '@/lib/member';
import { travelApiBase } from '@/config/api';

/**
 * travel-svc 커뮤니티 API (`/api/travel`). 회원가입·로그인은 football-svc에서만 하고,
 * 그 로그인 쿠키가 여기에도 실린다 (`credentials: 'include'`).
 */

export const POST_CATEGORIES = [
  { id: 'REVIEW', label: '직관 후기' },
  { id: 'TIP', label: '여행 팁' },
  { id: 'QUESTION', label: '질문' },
  { id: 'FREE', label: '자유' },
] as const; // travel-svc PostCategory
export type PostCategory = (typeof POST_CATEGORIES)[number]['id'];

export const POST_TITLE_MAX = 100;
export const POST_CONTENT_MAX = 5000;
export const TRAVEL_COMMENT_MAX = 500;

export interface TravelAuthor {
  memberId: number;
  nickname: string;
  profileImageUrl?: string | null;
  favoriteTeam?: string | null;
}

export interface PostSummary {
  id: number;
  club?: string | null;
  category: PostCategory;
  categoryLabel: string;
  title: string;
  author: TravelAuthor;
  commentCount: number;
  createdAt: string;
}

export interface PostDetail extends PostSummary {
  content: string;
  updatedAt: string;
  mine: boolean;
  deletable: boolean;
}

export interface TravelComment {
  id: number;
  content: string;
  author: TravelAuthor;
  createdAt: string;
  mine: boolean;
  deletable: boolean;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  last: boolean;
}

export interface PostInput {
  club?: string | null;
  category: PostCategory;
  title: string;
  content: string;
}

async function travelCall<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${travelApiBase()}${path}`, {
    ...init,
    credentials: 'include',
    headers: { ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.error || '요청을 처리하지 못했습니다.');
  }
  const text = res.status === 204 ? '' : await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export function fetchPosts(opts: { club?: string; category?: PostCategory; page?: number }) {
  const q = new URLSearchParams({ page: String(opts.page ?? 0), size: '20' });
  if (opts.club) q.set('club', opts.club);
  if (opts.category) q.set('category', opts.category);
  return travelCall<Page<PostSummary>>(`/api/travel/posts?${q}`);
}

export const fetchPost = (id: number) => travelCall<PostDetail>(`/api/travel/posts/${id}`);

export const createPost = (input: PostInput) =>
  travelCall<PostDetail>('/api/travel/posts', { method: 'POST', body: JSON.stringify(input) });

export const updatePost = (id: number, input: PostInput) =>
  travelCall<PostDetail>(`/api/travel/posts/${id}`, { method: 'PUT', body: JSON.stringify(input) });

export const deletePost = (id: number) => travelCall<void>(`/api/travel/posts/${id}`, { method: 'DELETE' });

export const fetchTravelComments = (postId: number, page = 0) =>
  travelCall<Page<TravelComment>>(`/api/travel/posts/${postId}/comments?page=${page}&size=50`);

export const addTravelComment = (postId: number, content: string) =>
  travelCall<TravelComment>(`/api/travel/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ content }) });

export const deleteTravelComment = (id: number) => travelCall<void>(`/api/travel/comments/${id}`, { method: 'DELETE' });

export function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return '방금';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return new Date(iso).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
}

// ── 경기장 가이드 · 펍 ─────────────────────────────────────

export interface Stadium {
  club: string;
  name: string;
  nameKo: string;
  city: string;
  lat: number;
  lng: number;
  transit?: string | null;
}

export interface PubRow {
  id: number;
  name: string;
  club?: string | null; // 이 팀 팬이 모이는 곳
  kind: 'PUB' | 'BAR';
  city?: string | null;
  lat: number;
  lng: number;
  address?: string | null;
  website?: string | null;
  openingHours?: string | null;
  showsFootball: boolean; // 스포츠 중계 (OSM live_sport 또는 사람이 확인)
  note?: string | null;
  source: 'OSM' | 'ADMIN';
  distanceMeters?: number | null;
}

export interface StadiumGuide {
  stadium: Stadium;
  pubs: PubRow[];
  radiusMeters: number;
}

export interface Area {
  id: string;
  nameKo: string;
  pubCount: number;
}

export interface WatchSpots {
  club: string;
  city?: string | null;
  fanPubs: PubRow[];
  footballPubs: PubRow[];
}

export const ITEM_CATEGORIES = [
  { id: 'FOOD', label: '음식' },
  { id: 'DRINK', label: '음료·맥주' },
  { id: 'GOODS', label: '굿즈' },
  { id: 'TOUR', label: '투어·박물관' },
] as const; // travel-svc ItemCategory
export type ItemCategory = (typeof ITEM_CATEGORIES)[number]['id'];

export interface StadiumItem {
  id: number;
  category: ItemCategory;
  categoryLabel: string;
  name: string;
  nameKo?: string | null;
  pricePence?: number | null;
  note?: string | null;
  checkedOn?: string | null; // YYYY-MM-DD
}

export interface ItemsResponse {
  club: string;
  items: StadiumItem[];
  gbpKrw?: number | null;
  canManage: boolean;
}

export interface ItemInput {
  category: ItemCategory;
  name: string;
  nameKo?: string | null;
  pricePence?: number | null;
  note?: string | null;
  checkedOn?: string | null;
}

export type ReportInput =
  | { kind: 'ITEM'; itemId: number; pricePence: number; note?: string; seenOn?: string }
  | { kind: 'ITEM'; club: string; category: ItemCategory; name: string; pricePence?: number | null; note?: string; seenOn?: string }
  | { kind: 'PUB'; pubId: number; club?: string | null; showsFootball?: boolean | null; note?: string; seenOn?: string };

export interface GuideReport {
  id: number;
  kind: 'ITEM' | 'PUB';
  club?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  target: string;
  itemId?: number | null;
  pubId?: number | null;
  category?: ItemCategory | null;
  name?: string | null;
  pricePence?: number | null;
  showsFootball?: boolean | null;
  note?: string | null;
  seenOn?: string | null;
  reporter: string;
  createdAt?: string | null;
}

export const fetchStadiumGuide = (club: string, radius = 1500) =>
  travelCall<StadiumGuide>(`/api/travel/clubs/${club}/stadium?radius=${radius}`);
export const fetchAreas = () => travelCall<Area[]>('/api/travel/areas');
export const fetchWatchSpots = (club: string, city?: string) =>
  travelCall<WatchSpots>(`/api/travel/clubs/${club}/watch${city ? `?city=${encodeURIComponent(city)}` : ''}`);

/** 내 근처 펍. 위치는 소수 둘째 자리(약 1km)로 줄여 보낸다 — 정확한 위치를 서버에 남기지 않으려고 */
export function fetchPubsNear(lat: number, lng: number, opts: { club?: string; football?: boolean } = {}) {
  const q = new URLSearchParams({ lat: lat.toFixed(2), lng: lng.toFixed(2), radius: '3000' });
  if (opts.club) q.set('club', opts.club);
  if (opts.football) q.set('football', 'true');
  return travelCall<PubRow[]>(`/api/travel/pubs/near?${q}`);
}

export const fetchItems = (club: string) => travelCall<ItemsResponse>(`/api/travel/clubs/${club}/items`);
export const createItem = (club: string, input: ItemInput) =>
  travelCall<StadiumItem>(`/api/travel/clubs/${club}/items`, { method: 'POST', body: JSON.stringify(input) });
export const updateItem = (id: number, input: ItemInput) =>
  travelCall<StadiumItem>(`/api/travel/items/${id}`, { method: 'PUT', body: JSON.stringify(input) });
export const deleteItem = (id: number) => travelCall<void>(`/api/travel/items/${id}`, { method: 'DELETE' });

export const submitReport = (input: ReportInput) =>
  travelCall<GuideReport>('/api/travel/reports', { method: 'POST', body: JSON.stringify(input) });
export const fetchPendingReports = () => travelCall<GuideReport[]>('/api/travel/reports');
export const reviewReport = (id: number, approve: boolean) =>
  travelCall<GuideReport>(`/api/travel/reports/${id}/${approve ? 'approve' : 'reject'}`, { method: 'POST' });

/** £4.80 */
export const formatGbp = (pence: number) => `£${(pence / 100).toFixed(2)}`;

/** 약 8,600원 (100원 단위로 반올림) */
export const formatKrw = (pence: number, gbpKrw: number) =>
  `약 ${(Math.round((pence / 100) * gbpKrw / 100) * 100).toLocaleString('ko-KR')}원`;

export const formatDistance = (m: number) => (m < 1000 ? `${Math.round(m / 10) * 10}m` : `${(m / 1000).toFixed(1)}km`);

/** 걸어서 몇 분 (분당 80m) */
export const walkMinutes = (m: number) => Math.max(1, Math.round(m / 80));

/** 확인한 지 1년이 넘은 가격 — 시즌이 바뀌면 오른다 */
export const isStale = (date?: string | null) => !!date && Date.now() - new Date(date).getTime() > 365 * 86400_000;

export const mapsUrl = (p: { name: string; lat: number; lng: number }) =>
  `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;

export interface TravelFixture {
  matchId: string;
  club: string;
  opponent: string;
  kickoff: string; // +09:00
  isHome: boolean;
  tournament: string;
  stadium?: Stadium | null;
}

export const fetchTravelFixtures = (club: string) => travelCall<TravelFixture[]>(`/api/travel/clubs/${club}/fixtures`);

/** 영국 현지 시각 "11/22 (토) 15:00" */
export function ukTime(iso: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Europe/London', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(iso));
}

/** 한국 시각 */
export function kstTime(iso: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(iso));
}

/**
 * 영국은 토요일 오후 3시(14:45~17:15 시작) 경기를 TV로 중계하지 않는다 (3시 블랙아웃).
 * 이런 경기는 펍에서도 볼 수 없다
 */
export function isUkBlackout(iso: string) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
    .formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const minutes = Number(get('hour')) * 60 + Number(get('minute'));
  return get('weekday') === 'Sat' && minutes >= 14 * 60 + 45 && minutes <= 17 * 60 + 15;
}
