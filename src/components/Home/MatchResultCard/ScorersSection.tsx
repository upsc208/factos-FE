import React from 'react';
import { IoMdFootball } from 'react-icons/io';
import { GiSonicShoes } from 'react-icons/gi';

interface ScorersSectionProps {
  homeScorers: any[];
  awayScorers: any[];
}

export const ScorersSection = ({ homeScorers, awayScorers }: ScorersSectionProps) => {
  return (
    <div className="order-3 md:order-4 grid grid-cols-2 px-1 md:px-2 w-full mb-6 md:mb-8 gap-x-6 md:gap-x-12">
      {/* Home Scorers */}
      <div className="flex flex-col items-start gap-2 min-w-0">
        {homeScorers.map((scorer, i) => (
          <div key={i} className="text-[10px] md:text-base font-bold tracking-tight flex items-center gap-x-1 md:gap-x-2 w-full min-w-0">
            <span className="shrink-0 opacity-60 font-medium">{scorer.time}&apos;</span>
            <div className="flex items-center gap-1 min-w-0 shrink">
              <IoMdFootball size={12} className="opacity-90 shrink-0 md:w-4 md:h-4" />
              <span className="truncate">{scorer.name}</span>
            </div>
            {scorer.assist && (
              <div className="hidden lg:flex items-center gap-1 opacity-40 font-medium text-sm italic shrink-0">
                <GiSonicShoes size={14} className="shrink-0" />
                <span className="truncate max-w-[140px]">{scorer.assist}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Away Scorers */}
      <div className="flex flex-col items-end gap-2 text-right min-w-0">
        {awayScorers.map((scorer, i) => (
          <div key={i} className="text-[10px] md:text-base font-bold tracking-tight flex items-center justify-end gap-x-1 md:gap-x-2 w-full min-w-0">
            {scorer.assist && (
              <div className="hidden lg:flex items-center gap-1 opacity-40 font-medium text-sm italic shrink-0">
                <span className="truncate max-w-[140px]">{scorer.assist}</span>
                <GiSonicShoes size={14} className="shrink-0" />
              </div>
            )}
            <div className="flex items-center gap-1 min-w-0 shrink justify-end">
              <span className="truncate">{scorer.name}</span>
              <IoMdFootball size={12} className="opacity-90 shrink-0 md:w-4 md:h-4" />
            </div>
            <span className="shrink-0 opacity-60 font-medium">{scorer.time}&apos;</span>
          </div>
        ))}
      </div>
    </div>
  );
};
