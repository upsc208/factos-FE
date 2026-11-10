'use client';

import { useCallback, useEffect, useState } from 'react';
import { CLUBS } from '@/config/clubs';
import {
  ApiError, fetchModerators, roleLabel, searchMembers, setMemberRole, type ManagedMember,
} from '@/lib/member';

const input = 'h-10 px-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm';
const CLUB_IDS = Object.keys(CLUBS);

function Row({ m, onChanged, onError }: { m: ManagedMember; onChanged: (m: ManagedMember) => void; onError: (msg: string) => void }) {
  const [club, setClub] = useState(m.adminClub ?? CLUB_IDS[0]);
  const [busy, setBusy] = useState(false);
  const run = async (role: 'MEMBER' | 'TEAM_ADMIN') => {
    setBusy(true);
    try {
      onChanged(await setMemberRole(m.id, role, role === 'TEAM_ADMIN' ? club : undefined));
    } catch (e) {
      onError(e instanceof ApiError ? e.message : '바꾸지 못했어요.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="py-3 flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 dark:text-white break-all">{m.nickname}</p>
        <p className="text-xs text-gray-400">{roleLabel(m.role, m.adminClub)} · {m.provider} · #{m.id}</p>
      </div>
      {m.role === 'ADMIN' ? (
        <p className="text-xs text-gray-400">sadmin은 운영자 API로만 바꿔요</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <select value={club} onChange={(e) => setClub(e.target.value)} className={input} aria-label="맡을 팀">
            {CLUB_IDS.map((id) => <option key={id} value={id}>{CLUBS[id].nameKo}</option>)}
          </select>
          <button type="button" disabled={busy} onClick={() => run('TEAM_ADMIN')}
            className="px-4 h-10 rounded-xl text-xs font-bold text-white disabled:opacity-50" style={{ backgroundColor: 'var(--primary, #111318)' }}>
            {m.role === 'TEAM_ADMIN' ? '팀 바꾸기' : 'admin 지정'}
          </button>
          {m.role === 'TEAM_ADMIN' && (
            <button type="button" disabled={busy} onClick={() => run('MEMBER')}
              className="px-4 h-10 rounded-xl text-xs font-bold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 disabled:opacity-50">
              해제
            </button>
          )}
        </div>
      )}
    </li>
  );
}

/** sadmin: 팀 관리자(admin) 지정·해제 */
export default function RoleAdmin() {
  const [moderators, setModerators] = useState<ManagedMember[] | null>(null);
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<ManagedMember[] | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    fetchModerators().then(setModerators).catch((e) => setError(e instanceof ApiError ? e.message : '불러오지 못했어요.'));
  }, []);
  useEffect(load, [load]);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setFound(await searchMembers(query));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '찾지 못했어요.');
    }
  };

  const changed = (m: ManagedMember) => {
    setFound((prev) => prev?.map((x) => (x.id === m.id ? m : x)) ?? null);
    load();
  };

  return (
    <div className="flex flex-col gap-10">
      <p className="text-sm text-gray-500">
        <b>sadmin</b> 전부 + 통계 · <b>admin</b> 맡은 팀의 신고 처리·댓글 삭제·정지 · <b>user</b> 일반 회원
      </p>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <section>
        <h2 className="font-bold text-gray-900 dark:text-white mb-2">관리자</h2>
        {moderators && moderators.length === 0 && <p className="text-sm text-gray-400">아직 없어요.</p>}
        <ul className="flex flex-col divide-y divide-gray-100 dark:divide-white/5">
          {moderators?.map((m) => <Row key={`${m.id}-${m.role}-${m.adminClub}`} m={m} onChanged={changed} onError={setError} />)}
        </ul>
      </section>

      <section>
        <h2 className="font-bold text-gray-900 dark:text-white mb-2">회원 찾아 admin 지정</h2>
        <form onSubmit={search} className="flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="닉네임" className={`${input} flex-1 min-w-0`} />
          <button type="submit" disabled={!query.trim()} className="px-4 h-10 rounded-xl text-sm font-bold border border-gray-200 dark:border-white/10 disabled:opacity-50">찾기</button>
        </form>
        {found && found.length === 0 && <p className="mt-3 text-sm text-gray-400">없어요.</p>}
        <ul className="mt-2 flex flex-col divide-y divide-gray-100 dark:divide-white/5">
          {found?.map((m) => <Row key={`${m.id}-${m.role}-${m.adminClub}`} m={m} onChanged={changed} onError={setError} />)}
        </ul>
      </section>
    </div>
  );
}
