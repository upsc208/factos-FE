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
