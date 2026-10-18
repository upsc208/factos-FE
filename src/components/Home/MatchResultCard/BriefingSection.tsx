import React from 'react';
import { Sparkles, Clock, Info } from 'lucide-react';
import { formatKST } from './utils';

interface BriefingSectionProps {
  briefing: string[];
  clubName: string;
  createdAt?: string;
}

export const BriefingSection = ({ briefing, clubName, createdAt }: BriefingSectionProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/10 rounded-lg">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black tracking-tighter uppercase font-bebas">
              {clubName} AI 브리핑
            </h3>
            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest flex items-center gap-1">
              <Clock size={10} />
              최근 8시간 업데이트
            </p>
          </div>
        </div>
        {createdAt && (
          <span className="text-[10px] font-bold opacity-40 bg-black/20 px-2 py-1 rounded">
            {formatKST(createdAt)}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 pr-1">
        {briefing && briefing.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {briefing.map((item, i) => (
              <div 
                key={i} 
                className="group flex gap-4 items-start p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-2xl font-black text-white/10 group-hover:text-white/20 transition-colors font-bebas shrink-0 pt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-sm md:text-base font-bold text-white/90 leading-relaxed tracking-tight break-keep">
                  {item}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 opacity-50">
            <Info size={32} />
            <p className="text-sm font-bold uppercase tracking-widest">
              No recent briefings available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
