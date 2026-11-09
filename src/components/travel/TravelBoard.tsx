'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, PenSquare, Plane } from 'lucide-react';
import { CLUBS } from '@/config/clubs';
import { ApiError } from '@/lib/member';
import { fetchPosts, POST_CATEGORIES, timeAgo, type PostCategory, type PostSummary } from '@/lib/travel';

/** 축구 여행 게시판 목록. 기본은 이 팀 글, "전체"로 바꿀 수 있다 */
export default function TravelBoard({ clubId }: { clubId: string }) {
  const [scope, setScope] = useState<'club' | 'all'>('club');
  const [category, setCategory] = useState<PostCategory | ''>('');
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (next: number) => {
    setError('');
    try {
      const res = await fetchPosts({ club: scope === 'club' ? clubId : undefined, category: category || undefined, page: next });
      setPosts((prev) => (next === 0 ? res.content : [...prev, ...res.content]));
      setPage(next);
      setLast(res.last);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '글을 불러오지 못했어요.');
    } finally {
      setLoaded(true);
    }
  }, [scope, category, clubId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 필터가 바뀌면 처음부터 다시 읽는다
    load(0);
  }, [load]);

  const chip = (active: boolean) =>
    `px-3 h-8 rounded-lg text-xs font-bold border transition ${
      active ? 'text-white border-transparent' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button type="button" onClick={() => setScope('club')} className={chip(scope === 'club')}
          style={scope === 'club' ? { backgroundColor: 'var(--primary)' } : undefined}>
          {CLUBS[clubId]?.nameKo ?? clubId}
        </button>
        <button type="button" onClick={() => setScope('all')} className={chip(scope === 'all')}
          style={scope === 'all' ? { backgroundColor: 'var(--primary)' } : undefined}>
          전체
        </button>
        <span className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1" />
        <button type="button" onClick={() => setCategory('')} className={chip(category === '')}
          style={category === '' ? { backgroundColor: 'var(--primary)' } : undefined}>
          모든 글
        </button>
        {POST_CATEGORIES.map((c) => (
          <button key={c.id} type="button" onClick={() => setCategory(c.id)} className={chip(category === c.id)}
            style={category === c.id ? { backgroundColor: 'var(--primary)' } : undefined}>
            {c.label}
          </button>
        ))}
        <Link
          href={`/${clubId}/travel/write`}
          className="ml-auto inline-flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <PenSquare size={16} /> 글쓰기
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {loaded && posts.length === 0 && !error && (
        <div className="py-20 flex flex-col items-center gap-3 text-gray-400">
          <Plane size={40} />
          <p className="text-sm">아직 글이 없어요. 첫 직관 이야기를 남겨 보세요.</p>
        </div>
      )}

      <ul className="flex flex-col divide-y divide-gray-100 dark:divide-white/5">
        {posts.map((p) => (
          <li key={p.id}>
            <Link href={`/${clubId}/travel/${p.id}`} className="block py-4 group">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                  {p.categoryLabel}
                </span>
                {scope === 'all' && p.club && <span>{CLUBS[p.club]?.nameKo ?? p.club}</span>}
              </div>
              <p className="mt-1.5 font-bold text-gray-900 dark:text-white group-hover:underline break-words">{p.title}</p>
              <p className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                <span>{p.author.nickname}</span>
                <span>{timeAgo(p.createdAt)}</span>
                {p.commentCount > 0 && (
                  <span className="inline-flex items-center gap-0.5"><MessageCircle size={12} /> {p.commentCount}</span>
                )}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {!last && (
        <button type="button" onClick={() => load(page + 1)}
          className="mt-6 w-full h-11 rounded-xl text-sm font-bold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300">
          더 보기
        </button>
      )}
    </div>
  );
}
