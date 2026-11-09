'use client';

import React, { useEffect, useState } from 'react';
import { Star, Trophy } from 'lucide-react';
import { FAN_SCORE_MAX, fetchPlayerRatings, submitPlayerRating, type PlayerRating } from '@/lib/matches';

interface RatingsSectionProps {
  matchId: string;
  clubId: string;
  clubName: string;
  playerOfTheMatch?: string | null;
}

/** FotMob 평점 색: 7.0 이상 초록, 6.0 이상 주황, 그 아래 빨강 (FotMob 화면과 같은 구간) */
function ratingColor(r: number) {
  if (r >= 7) return 'bg-emerald-500';
  if (r >= 6) return 'bg-amber-500';
  return 'bg-red-500';
}

/**
 * 직전 경기 우리 팀 선수 평점: FotMob 평점 + 팬 평점(로그인 없이 IP당 선수 한 표).
 * 펼쳤을 때만 그려지므로 그때 불러온다.
 */
export const RatingsSection = ({ matchId, clubId, clubName, playerOfTheMatch }: RatingsSectionProps) => {
  const [players, setPlayers] = useState<PlayerRating[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchPlayerRatings(matchId, clubId)
      .then((list) => { if (alive) setPlayers(list); })
      .catch((e: Error) => { if (alive) setError(e.message); });
    return () => { alive = false; };
  }, [matchId, clubId]);

  const vote = async (player: string, score: number) => {
    setBusy(player);
    setError('');
    try {
      const updated = await submitPlayerRating(matchId, clubId, player, score);
      setPlayers((prev) => prev?.map((p) => (p.playerName === player ? updated : p)) ?? prev);
    } catch (e) {
      setError(e instanceof Error ? e.message : '평점을 남기지 못했어요.');
    } finally {
      setBusy(null);
    }
  };

  if (players && players.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h4 className="text-sm md:text-base font-black tracking-widest uppercase text-white">{clubName} 선수 평점</h4>
        <p className="mt-1 text-[11px] text-white/60">왼쪽 숫자는 FotMob 평점, 별은 팬 평점이에요. 별을 눌러 평가해 보세요.</p>
      </div>

      {error && <p className="text-center text-xs text-white/80">{error}</p>}
      {!players && !error && <p className="text-center text-xs text-white/60">불러오는 중…</p>}

      {players && (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 max-w-4xl mx-auto w-full">
          {players.map((p) => {
            const potm = playerOfTheMatch === p.playerName;
            return (
              <li key={p.playerName} className="flex items-center gap-3 py-2 border-b border-white/10">
                <span
                  className={`w-10 shrink-0 text-center text-xs font-black rounded-md py-1 ${p.fotmobRating != null ? ratingColor(p.fotmobRating) : 'bg-white/10'}`}
                  title="FotMob 평점"
                >
                  {p.fotmobRating != null ? p.fotmobRating.toFixed(1) : '-'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                    {p.shirt && <span className="text-white/50 text-xs">{p.shirt}</span>}
                    {p.playerName}
                    {potm && <Trophy size={13} className="text-yellow-300 shrink-0" aria-label="경기 최우수 선수" />}
                    {!p.starter && <span className="text-[10px] font-semibold text-white/50">교체</span>}
                  </p>
                  <p className="text-[11px] text-white/60">
                    팬 {p.voteCount > 0 ? `${p.averageScore.toFixed(1)} (${p.voteCount}명)` : '평가 없음'}
                  </p>
                </div>
                <div className="flex shrink-0" aria-label={`${p.playerName} 평점 주기`}>
                  {Array.from({ length: FAN_SCORE_MAX }, (_, i) => i + 1).map((score) => {
                    const on = (p.myScore ?? 0) >= score;
                    return (
                      <button
                        key={score}
                        type="button"
                        disabled={busy === p.playerName}
                        onClick={() => vote(p.playerName, score)}
                        className="p-0.5 disabled:opacity-50"
                        title={`${score}점`}
                      >
                        <Star size={16} className={on ? 'fill-yellow-300 text-yellow-300' : 'text-white/40'} />
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
