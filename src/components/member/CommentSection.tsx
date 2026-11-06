'use client';

import { useCallback, useEffect, useState } from 'react';
import { MessageCircle, Trash2, UserCircle2 } from 'lucide-react';
import { useMember } from './MemberProvider';
import LoginButtons from './LoginButtons';
import { ApiError, deleteComment, fetchComments, postComment, teamLabel, type Comment } from '@/lib/member';

const MAX_LENGTH = 500; // 백엔드 CommentController.MAX_LENGTH와 같게

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return '방금';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return new Date(iso).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
}

/** 기사 상세 하단 댓글. 목록은 누구나, 쓰기·삭제는 로그인 회원만 */
export default function CommentSection({ articleId }: { articleId: number }) {
  const { member, loading: memberLoading } = useMember();
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);

  // 로그인 상태가 바뀌면 다시 읽는다 — "내 댓글"(삭제 버튼) 표시가 달라진다
  const load = useCallback(() => {
    fetchComments(articleId)
      .then((page) => { setComments(page.content); setTotal(page.totalElements); })
      .catch(() => setComments([]))
      .finally(() => setLoaded(true));
  }, [articleId]);

  useEffect(() => { if (!memberLoading) load(); }, [load, memberLoading, member?.id]);

  const submit = async () => {
    const content = text.trim();
    if (!content) return;
    setPosting(true);
    setError('');
    try {
      const created = await postComment(articleId, content);
      setComments((prev) => [...prev, created]);
      setTotal((t) => t + 1);
      setText('');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '댓글을 등록하지 못했습니다.');
    } finally {
      setPosting(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
      setTotal((t) => t - 1);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '댓글을 지우지 못했습니다.');
    }
  };

  return (
    <section className="mb-16 py-10 border-t border-gray-100 dark:border-white/5">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <MessageCircle size={20} style={{ color: 'var(--primary)' }} />
        댓글 {loaded && <span className="text-gray-400 font-semibold">{total}</span>}
      </h3>

      {/* 작성 */}
      {memberLoading ? null : member ? (
        <div className="mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
            placeholder="댓글을 남겨 주세요"
            rows={3}
            className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111318] p-4 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 resize-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">{text.length}/{MAX_LENGTH}</span>
            <button
              type="button"
              onClick={submit}
              disabled={posting || !text.trim()}
              className="px-5 h-10 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition"
              style={{ backgroundColor: 'var(--primary)' }}
            >
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

      {/* 목록 */}
      {loaded && comments.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">첫 댓글을 남겨 보세요.</p>
      )}
      <ul className="flex flex-col gap-5">
        {comments.map((c) => (
          <li key={c.id} className="flex gap-3">
            {c.profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- 카카오·구글 CDN 프로필 이미지
              <img src={c.profileImageUrl} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
            ) : (
              <UserCircle2 className="w-9 h-9 text-gray-300 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-gray-900 dark:text-white">{c.nickname}</span>
                {teamLabel(c.favoriteTeam) && (
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                    {teamLabel(c.favoriteTeam)}
                  </span>
                )}
                <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
                {c.mine && (
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    className="ml-auto text-gray-400 hover:text-red-500"
                    title="삭제"
                  >
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
  );
}
