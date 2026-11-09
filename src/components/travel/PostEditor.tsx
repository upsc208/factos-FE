'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMember } from '@/components/member/MemberProvider';
import LoginButtons from '@/components/member/LoginButtons';
import { CLUB_ORDER, CLUBS } from '@/config/clubs';
import { ApiError } from '@/lib/member';
import {
  createPost, fetchPost, updatePost, POST_CATEGORIES, POST_CONTENT_MAX, POST_TITLE_MAX, type PostCategory,
} from '@/lib/travel';

/** 글쓰기·수정. 로그인(football-svc)과 가입 마치기가 끝난 회원만 */
export default function PostEditor({ clubId, postId }: { clubId: string; postId?: number }) {
  const { member, loading } = useMember();
  const router = useRouter();
  const [club, setClub] = useState<string>(clubId);
  const [category, setCategory] = useState<PostCategory>('REVIEW');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // 수정이면 원래 글을 채운다
  useEffect(() => {
    if (!postId) return;
    fetchPost(postId)
      .then((p) => {
        if (!p.mine) { setError('본인이 쓴 글만 고칠 수 있어요.'); return; }
        setClub(p.club ?? '');
        setCategory(p.category);
        setTitle(p.title);
        setContent(p.content);
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : '글을 불러오지 못했어요.'));
  }, [postId]);

  if (loading) return null;
  if (!member) {
    return (
      <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.03] flex flex-col items-center gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">로그인하면 글을 쓸 수 있어요 (뉴스 댓글과 같은 계정이에요)</p>
        <div className="w-full max-w-xs"><LoginButtons /></div>
      </div>
    );
  }

  const submit = async () => {
    setBusy(true);
    setError('');
    const input = { club: club || null, category, title: title.trim(), content: content.trim() };
    try {
      const saved = postId ? await updatePost(postId, input) : await createPost(input);
      router.push(`/${clubId}/travel/${saved.id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '저장하지 못했어요.');
      setBusy(false);
    }
  };

  const field = 'w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111318] px-4 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <select value={category} onChange={(e) => setCategory(e.target.value as PostCategory)} className={`${field} h-11 w-auto`}>
          {POST_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select value={club} onChange={(e) => setClub(e.target.value)} className={`${field} h-11 w-auto`}>
          {CLUB_ORDER.map((id) => <option key={id} value={id}>{CLUBS[id]?.nameKo ?? id}</option>)}
          <option value="">팀 무관</option>
        </select>
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value.slice(0, POST_TITLE_MAX))}
        placeholder="제목"
        className={`${field} h-12 font-bold`}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, POST_CONTENT_MAX))}
        placeholder="경기장 가는 길, 펍, 좌석 시야, 숙소… 다른 팬에게 도움이 될 이야기를 남겨 주세요"
        rows={14}
        className={`${field} py-3 resize-y`}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{content.length}/{POST_CONTENT_MAX}</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => router.back()} className="px-4 h-10 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10">
            취소
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy || !title.trim() || !content.trim()}
            className="px-5 h-10 rounded-xl text-sm font-bold text-white disabled:opacity-40"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {busy ? '저장 중…' : postId ? '수정' : '등록'}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
