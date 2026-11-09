'use client';

import { useState } from 'react';
import { ApiError, reportComment } from '@/lib/member';
import { REPORT_DETAIL_MAX, REPORT_REASONS, type ReportReasonId } from '@/lib/moderation';

interface ReportFormProps {
  commentId: number;
  onDone: () => void;
  onCancel: () => void;
}

/** 회원: 댓글 신고. 사유를 고르고 (기타면 내용 필수) 관리자에게 보낸다 */
export default function ReportForm({ commentId, onDone, onCancel }: ReportFormProps) {
  const [reason, setReason] = useState<ReportReasonId | null>(null);
  const [detail, setDetail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!reason) {
      setError('신고 사유를 골라 주세요.');
      return;
    }
    if (reason === 'OTHER' && !detail.trim()) {
      setError('기타 사유를 적어 주세요.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await reportComment(commentId, reason, detail.trim());
      onDone();
    } catch (e) {
      // 이미 신고한 댓글(409)은 신고된 것으로 본다
      if (e instanceof ApiError && e.status === 409) {
        onDone();
        return;
      }
      setError(e instanceof ApiError ? e.message : '신고하지 못했어요.');
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] flex flex-col gap-3">
      <p className="text-sm font-bold text-gray-800 dark:text-gray-100">이 댓글을 신고할까요?</p>
      <div className="flex flex-wrap gap-2">
        {REPORT_REASONS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setReason(r.id)}
            className={`px-3 h-8 rounded-lg text-xs font-bold border transition ${
              reason === r.id
                ? 'bg-gray-900 border-gray-900 text-white dark:bg-white dark:border-white dark:text-gray-900'
                : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <textarea
        value={detail}
        onChange={(e) => setDetail(e.target.value.slice(0, REPORT_DETAIL_MAX))}
        placeholder={reason === 'OTHER' ? '신고 사유를 적어 주세요' : '덧붙일 말 (선택)'}
        rows={2}
        className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b0c10] p-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
      />
      <p className="text-[11px] text-gray-400">신고 내용은 관리자만 봐요. 작성자에게 신고자는 알려지지 않아요.</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 h-9 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10">
          취소
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="px-4 h-9 rounded-xl text-xs font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 disabled:opacity-40"
        >
          {busy ? '보내는 중…' : '신고하기'}
        </button>
      </div>
    </div>
  );
}
