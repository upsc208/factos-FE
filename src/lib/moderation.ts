import { call } from '@/lib/member';

/**
 * 관리자(팀 관리자·전체 관리자) API — factos-BE `moderation/`. 로그인 쿠키로 동작하고 권한은 서버가 판단한다.
 * - 팀 관리자: 자기 팀 기사의 댓글만 삭제·정지
 * - 전체 관리자: 모든 기사
 * 관리자 권한 부여는 운영자 API(`/api/admin/members`)로만 한다 — 이 화면에는 없다.
 */

export const REPORT_REASONS = [
  { id: 'ABUSE', label: '욕설·비하' },
  { id: 'SPAM', label: '광고·스팸' },
  { id: 'FLOOD', label: '도배' },
  { id: 'OTHER', label: '기타' },
] as const; // 백엔드 ReportReason
export type ReportReasonId = (typeof REPORT_REASONS)[number]['id'];
export const REPORT_DETAIL_MAX = 200;

export const reportReasonLabel = (id: string) => REPORT_REASONS.find((r) => r.id === id)?.label ?? id;

/** 관리자 신고 목록 한 칸 — 댓글 하나에 모인 신고 */
export interface ReportedComment {
  commentId: number;
  commentContent: string;
  authorNickname: string;
  authorMemberId?: number | null;
  articleId: number;
  articleTitle: string;
  articleClub?: string | null;
  reportCount: number;
  reasons: Partial<Record<ReportReasonId, number>>;
  details: string[];
  firstReportedAt: string;
  lastReportedAt: string;
}

export const fetchReports = () => call<ReportedComment[]>('/api/moderation/reports');

export const dismissReports = (commentId: number) =>
  call<{ closed: number }>(`/api/moderation/reports/${commentId}/dismiss`, { method: 'POST' });

export const SUSPEND_DAYS = [1, 3, 7, 30] as const; // 백엔드 ModerationService.ALLOWED_DAYS
export const SUSPEND_REASON_MAX = 500;

export interface Suspension {
  id: number;
  memberId?: number | null;
  nickname: string;
  reason: string;
  club?: string | null; // 어느 팀 관리 범위에서 내린 정지인지
  commentContent?: string | null; // 신고한 댓글 사본 (댓글이 지워져도 남는다)
  articleId?: number | null;
  createdByNickname: string;
  createdAt: string;
  endsAt: string;
  liftedAt?: string | null;
  liftedByNickname?: string | null;
  active: boolean;
  liftable: boolean; // 지금 보는 관리자가 해제할 수 있는지
}

export interface SuspensionPage {
  content: Suspension[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export const moderatorDeleteComment = (commentId: number) =>
  call<void>(`/api/moderation/comments/${commentId}`, { method: 'DELETE' });

export const suspendCommentAuthor = (commentId: number, reason: string, days: number, deleteComment: boolean) =>
  call<Suspension>(`/api/moderation/comments/${commentId}/suspend`, {
    method: 'POST',
    body: JSON.stringify({ reason, days, deleteComment }),
  });

export function fetchSuspensions(opts: { active: boolean; club?: string; page?: number }) {
  const q = new URLSearchParams({ active: String(opts.active), page: String(opts.page ?? 0), size: '20' });
  if (opts.club) q.set('club', opts.club);
  return call<SuspensionPage>(`/api/moderation/suspensions?${q}`);
}

export const liftSuspension = (id: number) =>
  call<Suspension>(`/api/moderation/suspensions/${id}/lift`, { method: 'POST' });

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
