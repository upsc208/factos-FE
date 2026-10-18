import React from 'react';
import { STATS_TRANSLATIONS, STATS_DISPLAY_ORDER } from './utils';

interface StatsSectionProps {
  stats: Record<string, { home: string, away: string }> | undefined;
  isExpanded: boolean;
}

export const StatsSection = ({ stats, isExpanded }: StatsSectionProps) => {
  if (!stats || Object.keys(stats).length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      <h4 className="text-sm md:text-base font-black tracking-widest uppercase text-white text-center">경기 통계</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto w-full">
        {Object.entries(stats)
          .sort(([a], [b]) => {
            const order = STATS_DISPLAY_ORDER;
            let idxA = order.indexOf(a);
            let idxB = order.indexOf(b);
            if (idxA === -1) idxA = 99;
            if (idxB === -1) idxB = 99;
            return idxA - idxB;
          })
          .map(([label, val], idx) => {
            const homeValStr = val.home || '0';
            const awayValStr = val.away || '0';
            const homeVal = parseFloat(homeValStr.replace(/[^0-9.]/g, '')) || 0;
            const awayVal = parseFloat(awayValStr.replace(/[^0-9.]/g, '')) || 0;
            const total = homeVal + awayVal;
            const homePct = total === 0 ? 50 : (homeVal / total) * 100;

            const translatedLabel = STATS_TRANSLATIONS[label] || label;

            return (
              <div key={idx} className="flex flex-col gap-2">
                <div className="flex justify-between text-xs md:text-sm font-bold uppercase tracking-tight px-1 text-white">
                  <span>{homeValStr}</span>
                  <span>{translatedLabel}</span>
                  <span>{awayValStr}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-white dark:bg-volt transition-all duration-1000"
                    style={{ width: `${isExpanded ? homePct : 0}%` }}
                  />
                  <div
                    className="h-full bg-white/30 transition-all duration-1000"
                    style={{ width: `${isExpanded ? 100 - homePct : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
