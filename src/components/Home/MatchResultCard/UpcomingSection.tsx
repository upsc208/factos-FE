import React from 'react';
import type { UpcomingMatch } from '@/client/types.gen';
import { formatKST } from './utils';

interface UpcomingSectionProps {
  upcomingMatches: UpcomingMatch[] | null | undefined;
}

export const UpcomingSection = ({ upcomingMatches }: UpcomingSectionProps) => {
  return (
    <div className="w-full md:w-[30%] flex flex-col pt-4 md:pt-0">
      <div className="text-[10px] md:text-xs font-bold tracking-widest uppercase mb-6 opacity-70">
        Upcoming Matches
      </div>

      <div className="flex flex-col gap-6">
        {upcomingMatches && upcomingMatches.slice(0, 3).map((match, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <div className="flex items-start gap-2 text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-tight">
              <span className="shrink-0 mt-0.5">vs</span>
              <span className="break-words min-w-0">{match.opponent}</span>
            </div>
            <div className="text-[10px] md:text-xs font-medium opacity-80 uppercase tracking-widest mt-1 flex flex-wrap gap-x-1.5">
              <span className="whitespace-nowrap">{formatKST(match.matchDate)}</span>
              <span className="opacity-40">&middot;</span>
              <span className="whitespace-nowrap">{match.tournament}</span>
              <span className="opacity-40">&middot;</span>
              <span className="whitespace-nowrap">{match.isHome ? 'HOME' : 'AWAY'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
