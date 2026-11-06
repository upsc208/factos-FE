'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import {
  ApiError, checkNickname, updateProfile, NICKNAME_MAX, NICKNAME_MIN, TEAM_OPTIONS,
  type FavoriteTeam, type Member, type NicknameCheck,
} from '@/lib/member';

interface ProfileFormProps {
  initial?: Member | null; // 내 정보 수정이면 지금 값으로 채운다. 가입 마치기면 비운다
  submitLabel: string;
  onSaved: (member: Member) => void;
}

/**
 * 닉네임(중복 확인) + 응원팀. 가입 마치기와 내 정보 수정이 같이 쓴다.
 * 중복 확인을 통과한 그 닉네임 그대로일 때만 저장 버튼이 켜진다 — 확인 후 고치면 다시 확인해야 한다.
 * 확인과 저장 사이에 남이 가져갈 수 있으므로 저장 때 서버가 한 번 더 막는다(409).
 */
export default function ProfileForm({ initial, submitLabel, onSaved }: ProfileFormProps) {
  const [nickname, setNickname] = useState(initial?.signupCompleted ? initial.nickname : '');
  const [team, setTeam] = useState<FavoriteTeam | null>(initial?.favoriteTeam ?? null);
  // 수정 화면에서 닉네임을 그대로 두면 확인 없이 저장할 수 있게, 지금 닉네임은 확인된 것으로 시작한다
  const [check, setCheck] = useState<NicknameCheck | null>(
    initial?.signupCompleted ? { nickname: initial.nickname, available: true } : null,
  );
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const trimmed = nickname.trim();
  const checkedThis = check && check.nickname === trimmed;
  const canSave = !!checkedThis && check.available && !!team && !saving;

  const runCheck = async () => {
    if (trimmed.length < NICKNAME_MIN) {
      setCheck({ nickname: trimmed, available: false, reason: `닉네임은 ${NICKNAME_MIN}~${NICKNAME_MAX}자로 정해 주세요.` });
      return;
    }
    setChecking(true);
    try {
      setCheck(await checkNickname(trimmed));
    } catch {
      setCheck({ nickname: trimmed, available: false, reason: '확인하지 못했습니다. 잠시 후 다시 시도해 주세요.' });
    } finally {
      setChecking(false);
    }
  };

  const save = async () => {
    if (!canSave || !team) return;
    setSaving(true);
    setError('');
    try {
      onSaved(await updateProfile(trimmed, team));
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        setCheck({ nickname: trimmed, available: false, reason: e.message });
      } else {
        setError(e instanceof ApiError ? e.message : '저장하지 못했습니다.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <label htmlFor="nickname" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">닉네임</label>
        <div className="flex gap-2">
          <input
            id="nickname"
            value={nickname}
            maxLength={NICKNAME_MAX}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runCheck(); }}
            placeholder={`${NICKNAME_MIN}~${NICKNAME_MAX}자, 한글·영문·숫자·_`}
            className="flex-1 min-w-0 h-11 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111318] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <button
            type="button"
            onClick={runCheck}
            disabled={checking || !trimmed}
            className="shrink-0 h-11 px-4 rounded-xl text-sm font-bold border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-200 disabled:opacity-40"
          >
            {checking ? '확인 중…' : '중복 확인'}
          </button>
        </div>
        {checkedThis ? (
          <p className={`mt-2 text-xs flex items-center gap-1 ${check.available ? 'text-green-600' : 'text-red-500'}`}>
            {check.available ? <Check size={14} /> : <X size={14} />}
            {check.available ? '쓸 수 있는 닉네임입니다.' : check.reason}
          </p>
        ) : (
          trimmed && <p className="mt-2 text-xs text-gray-400">중복 확인을 눌러 주세요.</p>
        )}
      </div>

      <div>
        <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">응원하는 팀</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="응원하는 팀">
          {TEAM_OPTIONS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={team === t.id}
              onClick={() => setTeam(t.id)}
              className={`h-11 rounded-xl text-sm font-bold border transition ${
                team === t.id
                  ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                  : 'bg-white dark:bg-[#111318] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-gray-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="button"
        onClick={save}
        disabled={!canSave}
        className="h-12 rounded-xl text-sm font-black bg-gray-900 text-white dark:bg-white dark:text-gray-900 disabled:opacity-30"
      >
        {saving ? '저장 중…' : submitLabel}
      </button>
    </div>
  );
}
