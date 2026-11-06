'use client';

import { useState } from 'react';
import { ApiError } from '@/lib/member';
import { SUSPEND_DAYS, SUSPEND_REASON_MAX, suspendCommentAuthor } from '@/lib/moderation';

interface SuspendFormProps {
  commentId: number;
  nickname: string;
  onDone: (commentDeleted: boolean) => void;
  onCancel: () => void;
}

/** 관리자: 댓글 작성자 임시 정지. 사유 필수, 기간 선택, 댓글도 지울지 */
export default function SuspendForm({ commentId, nickname, onDone, onCancel }: SuspendFormProps) {
  const [reason, setReason] = useState('');
  const [days, setDays] = useState<number>(3);
  const [deleteComment, setDeleteComment] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!reason.trim()) {
      setError('정지 사유를 입력해 주세요.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await suspendCommentAuthor(commentId, reason.trim(), days, deleteComment);
      onDone(deleteComment);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '정지하지 못했습니다.');
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 p-4 rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50/60 dark:bg-red-500/5 flex flex-col gap-3">
      <p className="text-sm font-bold text-red-700 dark:text-red-300">{nickname} 님 임시 정지</p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value.slice(0, SUSPEND_REASON_MAX))}
        placeholder="정지 사유 (정지된 회원에게 그대로 보여요)"
        rows={2}
        className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b0c10] p-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
      />
      <div className="flex flex-wrap items-center gap-2">
        {SUSPEND_DAYS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDays(d)}
            className={`px-3 h-8 rounded-lg text-xs font-bold border transition ${
              days === d
                ? 'bg-red-600 border-red-600 text-white'
                : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
            }`}
          >
            {d}일
          </button>
        ))}
        <label className="ml-auto flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
          <input type="checkbox" checked={deleteComment} onChange={(e) => setDeleteComment(e.target.checked)} />
          이 댓글도 삭제
        </label>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 h-9 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10">
          취소
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="px-4 h-9 rounded-xl text-xs font-bold text-white bg-red-600 disabled:opacity-40"
        >
          {busy ? '처리 중…' : `${days}일 정지`}
        </button>
      </div>
    </div>
  );
}
