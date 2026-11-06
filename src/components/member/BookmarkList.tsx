'use client';

import { useEffect, useState } from 'react';
import NewsCard from '@/components/NewsCard';
import { CLUBS } from '@/config/clubs';
import type { ClubNewsItem } from '@/lib/clubNews';
import { fetchBookmarks } from '@/lib/member';
import { useMember } from './MemberProvider';
import LoginButtons from './LoginButtons';

export default function BookmarkList({ clubId }: { clubId: string }) {
  const { member, loading } = useMember();
  const [items, setItems] = useState<ClubNewsItem[] | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!member) return;
    fetchBookmarks(page)
      .then((p) => { setItems(p.content); setTotalPages(p.totalPages); })
      .catch(() => setItems([]));
  }, [member, page]);

  if (loading) return null;

  if (!member) {
    return (
      <div className="max-w-xs mx-auto flex flex-col items-center gap-4 py-16">
        <p className="text-sm text-gray-500 dark:text-gray-400">로그인하면 즐겨찾기한 기사를 볼 수 있어요</p>
        <LoginButtons />
      </div>
    );
  }

  if (items === null) return <div className="h-40 animate-pulse bg-gray-100 dark:bg-white/5 rounded-3xl" />;
  if (items.length === 0) return <p className="text-gray-400 text-center py-16">아직 즐겨찾기한 기사가 없습니다.</p>;

  return (
    <>
      {items.map((news) => (
        // 다른 팀 기사를 담았을 수도 있다 — 카드 링크는 기사의 첫 팀 페이지로 (없으면 지금 팀)
        <NewsCard key={news.id} news={news} showImage club={CLUBS[news.clubs[0]] ?? CLUBS[clubId]} />
      ))}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)} className="px-4 h-10 rounded-xl border text-sm font-bold disabled:opacity-30">이전</button>
          <span className="self-center text-sm text-gray-500">{page + 1} / {totalPages}</span>
          <button type="button" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)} className="px-4 h-10 rounded-xl border text-sm font-bold disabled:opacity-30">다음</button>
        </div>
      )}
    </>
  );
}
