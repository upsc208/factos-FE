'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Trash2, UserCircle2 } from 'lucide-react';
import { useMember } from '@/components/member/MemberProvider';
import LoginButtons from '@/components/member/LoginButtons';
import { CLUBS } from '@/config/clubs';
import { ApiError, teamLabel } from '@/lib/member';
import {
  addTravelComment, deletePost, deleteTravelComment, fetchPost, fetchTravelComments, timeAgo,
  TRAVEL_COMMENT_MAX, type PostDetail, type TravelAuthor, type TravelComment,
} from '@/lib/travel';

function Avatar({ author }: { author: TravelAuthor }) {
  return author.profileImageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element -- 카카오·구글 CDN 프로필 이미지
    <img src={author.profileImageUrl} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
  ) : (
    <UserCircle2 className="w-9 h-9 text-gray-300 shrink-0" />
  );
}

/** 글 상세 + 댓글. 읽기는 누구나, 댓글은 로그인 회원 */
export default function PostView({ clubId, postId }: { clubId: string; postId: number }) {
  const { member, loading: memberLoading } = useMember();
  const router = useRouter();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<TravelComment[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [posting, setPosting] = useState(false);

  // 로그인 상태가 바뀌면 다시 읽는다 — "내 글"(수정·삭제) 표시가 달라진다
  const load = useCallback(() => {
    fetchPost(postId)
      .then(setPost)
      .catch((e) => (e instanceof ApiError && e.status === 404 ? setNotFound(true) : setError('글을 불러오지 못했어요.')));
    fetchTravelComments(postId).then((p) => setComments(p.content)).catch(() => setComments([]));
  }, [postId]);

  useEffect(() => { if (!memberLoading) load(); }, [load, memberLoading, member?.id]);

  const removePost = async () => {
    if (!window.confirm('이 글을 삭제할까요? 댓글도 함께 지워져요.')) return;
    try {
      await deletePost(postId);
      router.push(`/${clubId}/travel/board`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '삭제하지 못했어요.');
    }
  };

  const submitComment = async () => {
    const content = text.trim();
    if (!content) return;
    setPosting(true);
    setError('');
    try {
      const c = await addTravelComment(postId, content);
      setComments((prev) => [...prev, c]);
      setPost((p) => (p ? { ...p, commentCount: p.commentCount + 1 } : p));
      setText('');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '댓글을 등록하지 못했어요.');
    } finally {
      setPosting(false);
    }
  };

  const removeComment = async (id: number) => {
    try {
      await deleteTravelComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
      setPost((p) => (p ? { ...p, commentCount: p.commentCount - 1 } : p));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '댓글을 지우지 못했어요.');
    }
  };

  if (notFound) return <p className="py-20 text-center text-gray-400">글을 찾을 수 없어요.</p>;
  if (!post) return error ? <p className="py-20 text-center text-red-500">{error}</p> : null;

  return (
    <article>
      <Link href={`/${clubId}/travel/board`} className="inline-flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-gray-600 mb-6">
        <ArrowLeft size={16} /> 목록
      </Link>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className="font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">{post.categoryLabel}</span>
        {post.club && <span>{CLUBS[post.club]?.nameKo ?? post.club}</span>}
      </div>
      <h1 className="mt-3 text-2xl sm:text-3xl font-black text-gray-900 dark:text-white break-words">{post.title}</h1>

      <div className="mt-4 flex items-center gap-3">
        <Avatar author={post.author} />
        <div className="text-sm">
          <p className="font-bold text-gray-900 dark:text-white">
            {post.author.nickname}
            {teamLabel(post.author.favoriteTeam) && (
              <span className="ml-2 text-[11px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-500">{teamLabel(post.author.favoriteTeam)}</span>
            )}
          </p>
          <p className="text-xs text-gray-400">
            {timeAgo(post.createdAt)}{post.updatedAt !== post.createdAt && ' · 수정됨'}
          </p>
        </div>
        {(post.mine || post.deletable) && (
          <div className="ml-auto flex gap-2">
            {post.mine && (
              <Link href={`/${clubId}/travel/${post.id}/edit`} className="px-3 h-8 inline-flex items-center rounded-lg text-xs font-bold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300">
                수정
              </Link>
            )}
            {post.deletable && (
              <button type="button" onClick={removePost} className="px-3 h-8 rounded-lg text-xs font-bold border border-red-200 dark:border-red-500/30 text-red-600">
                삭제
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-[15px] leading-7 text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">{post.content}</div>

      <section className="mt-14 pt-10 border-t border-gray-100 dark:border-white/5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <MessageCircle size={20} style={{ color: 'var(--primary)' }} /> 댓글 <span className="text-gray-400">{post.commentCount}</span>
        </h2>

        {memberLoading ? null : member ? (
          <div className="mb-8">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, TRAVEL_COMMENT_MAX))}
              placeholder="댓글을 남겨 주세요"
              rows={3}
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111318] p-4 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 resize-none"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-400">{text.length}/{TRAVEL_COMMENT_MAX}</span>
              <button type="button" onClick={submitComment} disabled={posting || !text.trim()}
                className="px-5 h-10 rounded-xl text-sm font-bold text-white disabled:opacity-40" style={{ backgroundColor: 'var(--primary)' }}>
                {posting ? '등록 중…' : '등록'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] flex flex-col items-center gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">로그인하면 댓글을 쓸 수 있어요</p>
            <div className="w-full max-w-xs"><LoginButtons /></div>
          </div>
        )}
        {error && <p className="mb-6 text-sm text-red-500">{error}</p>}

        <ul className="flex flex-col gap-5">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <Avatar author={c.author} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-gray-900 dark:text-white">{c.author.nickname}</span>
                  <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
                  {c.deletable && (
                    <button type="button" onClick={() => removeComment(c.id)} className="ml-auto text-gray-400 hover:text-red-500" title="삭제">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{c.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
