import React from 'react';
import Link from 'next/link';
import { MessagesSquare } from 'lucide-react';
import type { UpcomingMatch } from '@/lib/matches';
import { formatKST } from './utils';

interface UpcomingSectionProps {
  upcomingMatches: UpcomingMatch[] | null | undefined;
  clubId: string;
}

export const UpcomingSection = ({ upcomingMatches, clubId }: UpcomingSectionProps) => {
  return (
    <div className="w-full md:w-[30%] flex flex-col pt-4 md:pt-0">
      <div className="text-[10px] md:text-xs font-bold tracking-widest uppercase mb-6 opacity-70">
        Upcoming Matches
      </div>

      <div className="flex flex-col gap-6">
        {(!upcomingMatches || upcomingMatches.length === 0) && (
          <p className="text-xs opacity-60">일정을 불러오는 중이에요</p>
        )}
        {upcomingMatches && upcomingMatches.slice(0, 3).map((match, idx) => (
          <div key={match.matchId ?? idx} className="flex flex-col gap-1">
            <div className="flex items-start gap-2 text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-tight">
              <span className="shrink-0 mt-0.5">vs</span>
              <span className="break-words min-w-0">{match.opponent}</span>
            </div>
            <div className="text-[10px] md:text-xs font-medium opacity-80 uppercase tracking-widest mt-1 flex flex-wrap items-center gap-x-1.5">
              <span className="whitespace-nowrap">{formatKST(match.matchDate)}</span>
              <span className="opacity-40">&middot;</span>
              <span className="whitespace-nowrap">{match.tournament}</span>
              <span className="opacity-40">&middot;</span>
              <span className="whitespace-nowrap">{match.isHome ? 'HOME' : 'AWAY'}</span>
              {/* 매치 채팅방 (킥오프 1시간 전부터 열림) */}
              {match.matchId && (
                <Link href={`/${clubId}/chat?room=${match.matchId}`} className="ml-1 inline-flex items-center gap-1 normal-case tracking-normal underline-offset-2 hover:underline">
                  <MessagesSquare size={12} /> 채팅
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
