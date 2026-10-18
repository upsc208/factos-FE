import React from 'react';
import { TrendingUp, User, Info, Newspaper } from 'lucide-react';
import type { PlayerTransferProbability } from '@/client/types.gen';

interface TransferProbabilitySectionProps {
  players: PlayerTransferProbability[];
}

export const TransferProbabilitySection = ({ players }: TransferProbabilitySectionProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6 shrink-0">
        <div className="p-2 bg-white/10 rounded-lg">
          <TrendingUp size={18} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-black tracking-tighter uppercase font-bebas">
            이적 예측 확률
          </h3>
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
            AI 기반 이적 랭킹
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pr-1">
        {players && players.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {players.slice(0, 7).map((player, i) => (
              <div 
                key={i} 
                className="group flex items-center justify-between p-3 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-base font-black text-white/20 group-hover:text-white/40 transition-colors font-bebas w-4">
                    {i + 1}
                  </span>
                  <span className="text-sm md:text-base font-bold text-white/90 truncate">
                    {player.playerName}
                  </span>
                </div>
                <div className="shrink-0 ml-4">
                  <span className="text-lg font-black font-bebas italic text-white flex items-baseline gap-0.5">
                    {player.probability}<span className="text-[10px] opacity-60">%</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 opacity-30">
            <Info size={32} />
            <p className="text-xs font-bold uppercase tracking-widest">
              No transfer data available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
