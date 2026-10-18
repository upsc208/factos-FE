import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { MdRectangle } from 'react-icons/md';

interface MatchEventsProps {
  substitutions: any[] | undefined;
  cards: any[] | undefined;
}

export const MatchEvents = ({ substitutions, cards }: MatchEventsProps) => {
  const safeSubstitutions = substitutions || [];
  const safeCards = cards || [];
  if (safeSubstitutions.length + safeCards.length === 0) return null;

  const renderEvent = (e: any, isMobile: boolean) => {
    const isSubstitution = 'inName' in e;
    
    return (
      <div key={`${e.time}-${e.name || e.inName}`} className={
        isMobile 
          ? "flex items-center gap-1.5 text-[9px] py-0.5" 
          : "flex items-center gap-3 text-xs md:text-sm py-1.5 px-3 bg-white/5 rounded-lg"
      }>
        <span className={`font-bold opacity-40 ${isMobile ? 'min-w-[20px]' : 'min-w-[28px]'}`}>{e.time}&apos;</span>
        {isSubstitution ? (
          <div className={`flex items-center gap-1 md:gap-2 flex-1 min-w-0 ${isMobile ? '' : ''}`}>
            <ArrowLeftRight size={isMobile ? 10 : 14} className="text-green-400 shrink-0" />
            <div className="flex flex-col leading-tight min-w-0">
              <span className={`font-bold text-white ${isMobile ? 'text-[9px]' : 'text-sm md:text-base'} truncate`}>{e.inName}</span>
              <span className={`opacity-50 italic truncate ${isMobile ? 'text-[7px]' : 'text-[10px] md:text-xs'}`}>for {e.outName}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1 md:gap-2 flex-1 min-w-0">
            <MdRectangle
              size={isMobile ? 12 : 16}
              style={{ 
                color: e.color?.toLowerCase() === 'yellow' || e.color === 'Y' ? '#facc15' : '#ff0000' 
              }}
              className="rotate-90 shrink-0"
            />
            <span className={`font-bold text-white ${isMobile ? 'text-[9px]' : 'text-sm md:text-base'} truncate`}>{e.name}</span>
          </div>
        )}
      </div>
    );
  };

  const homeEvents = [...safeSubstitutions, ...safeCards]
    .filter(e => e.isHome)
    .sort((a, b) => parseInt(a.time) - parseInt(b.time));

  const awayEvents = [...safeSubstitutions, ...safeCards]
    .filter(e => !e.isHome)
    .sort((a, b) => parseInt(a.time) - parseInt(b.time));

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <h4 className="text-sm md:text-base font-black tracking-widest uppercase text-white text-center">주요 경기 상황</h4>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-row gap-24 justify-center items-start">
        <div className="flex-1 flex flex-col gap-2">
          {homeEvents.map(e => renderEvent(e, false))}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {awayEvents.map(e => (
            <div key={`${e.time}-${e.name || e.inName}`} className="flex items-center gap-3 text-sm py-1.5 px-3 bg-white/5 rounded-lg flex-row-reverse text-right">
               <span className="font-bold opacity-40 min-w-[28px]">{e.time}&apos;</span>
               {'inName' in e ? (
                  <div className="flex items-center gap-2 flex-1 flex-row-reverse text-right">
                    <ArrowLeftRight size={14} className="text-green-400 shrink-0" />
                    <div className="flex flex-col leading-tight">
                      <span className="font-bold text-white text-base">{e.inName}</span>
                      <span className="text-xs opacity-50 italic">for {e.outName}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1 flex-row-reverse text-right">
                    <MdRectangle
                      size={16}
                      style={{ color: e.color?.toLowerCase() === 'yellow' || e.color === 'Y' ? '#facc15' : '#ff0000' }}
                      className="rotate-90 shrink-0"
                    />
                    <span className="font-bold text-white text-base">{e.name}</span>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-row justify-center items-stretch min-h-[80px]">
        <div className="flex-1 flex flex-col gap-3 pr-2 md:pr-12">
          {homeEvents.map(e => renderEvent(e, true))}
        </div>
        <div className="w-px bg-white/20 self-stretch"></div>
        <div className="flex-1 flex flex-col gap-3 pl-2 md:pl-12 text-right">
          {awayEvents.map(e => (
            <div key={`${e.time}-${e.name || e.inName}`} className="flex items-center gap-1.5 text-[9px] py-0.5 flex-row-reverse">
              <span className="font-bold opacity-40 min-w-[20px]">{e.time}&apos;</span>
              {'inName' in e ? (
                <div className="flex items-center gap-1 flex-1 flex-row-reverse text-right min-w-0">
                  <ArrowLeftRight size={10} className="text-green-400 shrink-0" />
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="font-bold text-white text-[9px] truncate">{e.inName}</span>
                    <span className="text-[7px] opacity-50 italic truncate">for {e.outName}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1 md:gap-2 flex-1 flex-row-reverse text-right min-w-0">
                  <MdRectangle
                    size={12}
                    style={{ color: e.color?.toLowerCase() === 'yellow' || e.color === 'Y' ? '#facc15' : '#ff0000' }}
                    className="rotate-90 shrink-0"
                  />
                  <span className="font-bold text-white text-[9px] truncate">{e.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
