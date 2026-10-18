'use client';

import React from 'react';

interface TacticalFieldProps {
  lineup: any;
  homeTeam: string;
  awayTeam: string;
}

export const TacticalField = ({ lineup, homeTeam, awayTeam }: TacticalFieldProps) => {
  // Find club colors based on the team name to reflect home kit design
  const findClubColors = (teamName: string) => {
    const name = (teamName || '').toLowerCase();
    if (name.includes('arsenal') || name.includes('아스날')) {
      return { bg: '#EF0107', border: '#ffffff', text: '#ffffff' };
    }
    if (name.includes('city') || name.includes('맨시티')) {
      return { bg: '#85C6F2', border: '#ffffff', text: '#1C2C5B' };
    }
    if (name.includes('united') || name.includes('맨유')) {
      return { bg: '#DA291C', border: '#000000', text: '#ffffff' };
    }
    if (name.includes('liverpool') || name.includes('리버풀')) {
      return { bg: '#C8102E', border: '#ffffff', text: '#ffffff' };
    }
    if (name.includes('chelsea') || name.includes('첼시')) {
      return { bg: '#034694', border: '#ffffff', text: '#ffffff' };
    }
    if (name.includes('tottenham') || name.includes('토트넘')) {
      return { bg: '#ffffff', border: '#132257', text: '#132257' };
    }
    // Default fallback
    return { bg: '#ffffff', border: '#cccccc', text: '#000000' };
  };

  const homeColors = findClubColors(homeTeam);
  const awayColors = findClubColors(awayTeam);

  const renderTeam = (teamLineup: any, isHome: boolean) => {
    if (!teamLineup) return <div className="flex-1" />;
    const formation = teamLineup.formation || '4-4-2';
    const starters = teamLineup.starters || [];
    const rows = [1, ...formation.split('-').map(Number)];
    const colors = isHome ? homeColors : awayColors;
    
    let playerIdx = 0;
    const playerRows = rows.map(count => {
      const rowPlayers = starters.slice(playerIdx, playerIdx + count);
      playerIdx += count;
      return rowPlayers;
    });

    return (
      <div className={`flex-1 flex ${isHome ? 'flex-row' : 'flex-row-reverse'} justify-between items-center h-full px-2 sm:px-4 md:px-8`}>
        {playerRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex flex-col justify-around h-full py-1 sm:py-2 md:py-4">
            {(isHome ? [...row].reverse() : row).map((player: any, pIdx: number) => (
              <div key={pIdx} className="flex flex-col items-center gap-0.5 sm:gap-1 group/player">
                <div 
                  className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-black text-[7px] sm:text-[9px] md:text-xs shadow-lg border sm:border-2 transition-transform group-hover/player:scale-110"
                  style={{ 
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                >
                  {player?.shirt || ''}
                </div>
                <div className="text-[6px] sm:text-[8px] md:text-[10px] font-bold text-white text-center leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] max-w-[35px] sm:max-w-[50px] md:max-w-[70px] truncate">
                  {player?.name ? player.name.split(' ').pop() : ''}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center px-4 font-black uppercase tracking-tighter text-[10px] sm:text-sm md:text-base text-white">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: homeColors.bg }}></span>
          <span>{homeTeam}</span>
          <span className="opacity-60">({lineup?.home?.formation || 'N/A'})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="opacity-60">({lineup?.away?.formation || 'N/A'})</span>
          <span>{awayTeam}</span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: awayColors.bg }}></span>
        </div>
      </div>

      <div className="relative w-full aspect-[2/1] sm:aspect-[2.2/1] bg-[#2d5a27] rounded-lg sm:rounded-xl border border-white/20 overflow-hidden shadow-2xl group">
        <div className="absolute inset-0 flex">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-black/5' : ''}`} />
          ))}
        </div>

        <div className="absolute inset-0 border border-white/20 pointer-events-none">
          <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4 aspect-square border border-white/20 rounded-full" />
        </div>

        <div className="absolute inset-0 flex">
          {renderTeam(lineup.home, true)}
          {renderTeam(lineup.away, false)}
        </div>
      </div>
    </div>
  );
};
