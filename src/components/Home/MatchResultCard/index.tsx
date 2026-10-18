'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import type { RecentMatch, UpcomingMatch, BriefingResponse } from '@/client/types.gen';
import { sortScorers } from './utils';
import { ScoreSection } from './ScoreSection';
import { ScorersSection } from './ScorersSection';
import { UpcomingSection } from './UpcomingSection';
import { StatsSection } from './StatsSection';
import { TacticalField } from './TacticalField';
import { MatchEvents } from './MatchEvents';
import { BriefingSection } from './BriefingSection';
import { TransferProbabilitySection } from './TransferProbabilitySection';
import { ClubConfig } from '@/config/clubs';
import type { PlayerTransferProbability } from '@/client/types.gen';

interface MatchResultCardProps {
  recentMatch?: RecentMatch | null;
  upcomingMatches?: UpcomingMatch[] | null;
  briefing?: BriefingResponse | null;
  transferRanking?: PlayerTransferProbability[] | null;
  club: ClubConfig;
}

export default function MatchResultCard({ recentMatch, upcomingMatches, briefing, transferRanking, club }: MatchResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSlide, setActiveSlide] = useState<'briefing' | 'transfer' | 'match'>('briefing');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle window resize to detect mobile/desktop
  React.useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe Left -> Next Slide
      if (activeSlide === 'briefing') {
        setActiveSlide(isMobile ? 'transfer' : 'match');
      } else if (activeSlide === 'transfer') {
        setActiveSlide('match');
      } else if (activeSlide === 'match') {
        setActiveSlide('briefing');
      }
    } else if (isRightSwipe) {
      // Swipe Right -> Prev Slide
      if (activeSlide === 'match') {
        setActiveSlide(isMobile ? 'transfer' : 'briefing');
      } else if (activeSlide === 'transfer') {
        setActiveSlide('briefing');
      } else if (activeSlide === 'briefing') {
        setActiveSlide('match');
      }
    }
  };

  const getCardBackground = () => {
    if (club.id === 'manutd') {
      return { background: 'var(--manutd-card-bg)' };
    }
    if (club.id === 'liverpool') {
      return { background: 'linear-gradient(135deg, #b21e29 0%, #c8102e 50%, #7a0c14 100%)' };
    }
    if (club.id === 'chelsea') {
      return { background: 'linear-gradient(135deg, #0551c9 0%, #03388c 100%)' };
    }
    if (club.id === 'arsenal') {
      return { background: 'linear-gradient(135deg, #EF0107 0%, #bd0004 100%)' };
    }
    if (club.id === 'tottenham') {
      return { background: 'linear-gradient(135deg, #1d2d5f 0%, #132257 50%, #0a1336 100%)' };
    }
    if (club.id === 'mancity') {
      return { background: 'linear-gradient(135deg, #a4d8f8 0%, #85C6F2 50%, #5ba7de 100%)' };
    }
    return { 
      backgroundColor: club.colors.secondary === '#FFFFFF' ? club.colors.primary : club.colors.secondary,
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3))'
    };
  };

  const sortedScorers = recentMatch ? sortScorers(recentMatch.scorers) : [];
  const homeScorers = sortedScorers.filter(s => s.isHome);
  const awayScorers = sortedScorers.filter(s => !s.isHome);

  return (
    <div 
      className="text-white rounded-xl shadow-lg w-full max-w-none font-sans tracking-wide flex flex-col overflow-hidden border border-white/10 transition-all duration-500 relative"
      style={getCardBackground()}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Visual Decorations */}
      {club.id === 'manutd' && <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '12px 12px' }} />}
      {club.id === 'mancity' && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute w-[200%] h-[300%]" style={{ transform: 'rotate(25deg) translate(-32%, -35%)', background: 'linear-gradient(90deg, transparent 40%, #ffffff 45%, #ffffff 55%, transparent 60%)', backgroundSize: '100% 100%' }} />
        </div>
      )}

      {/* Collar trim detail at the top */}
      <div className="absolute top-0 left-0 right-0 h-[6px] z-20 overflow-hidden">
        {club.id === 'manutd' && <div className="h-full bg-[#0f1015] dark:bg-[#1072E5] flex flex-col"><div className="h-[2px] w-full bg-white/80 dark:bg-[#E5B824]/80 mt-[2px]" /></div>}
        {club.id === 'liverpool' && <div className="h-full bg-white"><div className="h-[2px] w-full bg-[#c8102e] mt-[2px]" /></div>}
        {club.id === 'chelsea' && <div className="h-full bg-white"><div className="h-[2px] w-full bg-[#EE242C] mt-[2px]" /></div>}
        {club.id === 'arsenal' && <div className="h-full bg-white flex flex-col justify-between py-[1px]"><div className="h-[1px] w-full bg-[#EF0107]" /><div className="h-[1px] w-full bg-[#EF0107]" /><div className="h-[1px] w-full bg-[#EF0107]" /></div>}
        {club.id === 'tottenham' && <div className="h-full bg-white flex flex-col justify-between py-[1px]"><div className="h-[1px] w-full bg-[#132257]" /><div className="h-[2px] w-full bg-[#B0B7C3]" /><div className="h-[1px] w-full bg-[#132257]" /></div>}
        {club.id === 'mancity' && <div className="h-full bg-white flex flex-col justify-center"><div className="h-[1px] w-full bg-[#1C2C5B] opacity-10" /></div>}
      </div>

      <div className="relative z-10 flex flex-col">
        {/* Fixed Height Content Area */}
        <div className="h-[360px] flex flex-col overflow-hidden relative">
          {/* Briefing Slide (Desktop: Briefing + Transfer / Mobile: Briefing only) */}
          {activeSlide === 'briefing' && (
            <div className="flex-grow overflow-y-auto md:overflow-hidden scrollbar-hide p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="h-full flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-start">
                <div className="w-full md:w-[79%] flex flex-col h-full pr-0 md:pr-8 md:border-r border-white/20">
                  <BriefingSection 
                    briefing={briefing?.content || []} 
                    clubName={club.nameKo} 
                    createdAt={briefing?.createdAt}
                  />
                </div>
                {/* Desktop view: side-by-side / Mobile view: hidden in this slide */}
                <div className="hidden md:flex md:w-[21%] flex-col h-full">
                  <TransferProbabilitySection players={transferRanking || []} />
                </div>
              </div>
            </div>
          )}

          {/* Transfer Slide (Mobile only) */}
          {activeSlide === 'transfer' && (
            <div className="flex-grow overflow-y-auto scrollbar-hide p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-500 md:hidden">
              <div className="min-h-full flex flex-col items-start justify-start">
                <div className="w-full flex flex-col h-full">
                  <TransferProbabilitySection players={transferRanking || []} />
                </div>
              </div>
            </div>
          )}

          {/* Match Slide */}
          {activeSlide === 'match' && (
            recentMatch ? (
              <div className="flex-grow p-6 md:p-8 animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center">
                <div className="w-full md:w-[70%] flex flex-col pr-0 md:pr-8 md:border-r border-white/20">
                  <ScoreSection 
                    homeTeam={recentMatch.homeTeam}
                    awayTeam={recentMatch.awayTeam}
                    homeScore={recentMatch.homeScore}
                    awayScore={recentMatch.awayScore}
                    matchDate={recentMatch.matchDate}
                    tournament={recentMatch.tournament}
                    isHome={recentMatch.isHome}
                  />
                  <ScorersSection homeScorers={homeScorers} awayScorers={awayScorers} />
                  <div className="order-4 md:order-3 border-t border-white/20 mb-8 mx-2"></div>
                </div>
                <UpcomingSection upcomingMatches={upcomingMatches} />
              </div>
            ) : (
              <div className="flex-grow p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <Shield size={48} />
                <p className="font-bold uppercase tracking-widest">No match data available</p>
              </div>
            )
          )}
        </div>

        {/* Carousel Controls - Nav Arrows */}
        <div className="absolute inset-y-0 left-0 right-0 pointer-events-none flex items-center justify-between px-3 z-30">
          {/* Left Arrow (Prev) */}
          <div className="flex items-center">
            {(isMobile ? (activeSlide === 'transfer' || activeSlide === 'match') : (activeSlide === 'match')) && (
              <button 
                onClick={() => {
                  if (activeSlide === 'match') setActiveSlide(isMobile ? 'transfer' : 'briefing');
                  else if (activeSlide === 'transfer') setActiveSlide('briefing');
                }}
                className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all pointer-events-auto backdrop-blur-sm shadow-lg"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>
            )}
          </div>

          {/* Right Arrow (Next) */}
          <div className="flex items-center">
            {(isMobile ? (activeSlide === 'briefing' || activeSlide === 'transfer') : (activeSlide === 'briefing')) && (
              <button 
                onClick={() => {
                  if (activeSlide === 'briefing') setActiveSlide(isMobile ? 'transfer' : 'match');
                  else if (activeSlide === 'transfer') setActiveSlide('match');
                }}
                className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all pointer-events-auto backdrop-blur-sm shadow-lg"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 pb-4">
          <button 
            onClick={() => setActiveSlide('briefing')}
            className={`w-2 h-2 rounded-full transition-all ${activeSlide === 'briefing' ? 'bg-white w-4' : 'bg-white/30'}`}
          />
          {/* Only show Transfer dot on mobile - use mounted check to prevent hydration mismatch */}
          {mounted && isMobile && (
            <button 
              onClick={() => setActiveSlide('transfer')}
              className={`w-2 h-2 rounded-full transition-all ${activeSlide === 'transfer' ? 'bg-white w-4' : 'bg-white/30'}`}
            />
          )}
          <button 
            onClick={() => setActiveSlide('match')}
            className={`w-2 h-2 rounded-full transition-all ${activeSlide === 'match' ? 'bg-white w-4' : 'bg-white/30'}`}
          />
        </div>
      </div>

      {/* Toggle Button / Spacer Area */}
      <div className="relative z-10 border-t border-white/10">
        {activeSlide === 'match' && recentMatch ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-4 bg-black/20 hover:bg-black/40 flex items-center justify-center gap-2 transition-all duration-300 group"
          >
            <span className="text-xs font-bold tracking-widest uppercase opacity-60 group-hover:opacity-100">
              {isExpanded ? '경기 상세 정보 닫기' : '경기 상세 정보 보기'}
            </span>
            {isExpanded ? <ChevronUp size={16} className="opacity-60 group-hover:opacity-100" /> : <ChevronDown size={16} className="opacity-60 group-hover:opacity-100" />}
          </button>
        ) : (
          /* Empty spacer with same height as button to maintain uniform card size */
          <div className="w-full py-4 bg-transparent h-[48px]" />
        )}
      </div>

      {/* Accordion Content (Only for match view) */}
      {activeSlide === 'match' && recentMatch && (
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-6 md:p-8 bg-black/20 flex flex-col gap-12 border-t border-white/5">
            <StatsSection stats={recentMatch.stats} isExpanded={isExpanded} />
            {recentMatch.lineup && (
              <div className="flex flex-col gap-8 -mx-6 md:mx-0">
                <h4 className="text-sm md:text-base font-black tracking-widest uppercase text-white text-center px-6">선발 명단 및 전술</h4>
                <div className="w-full overflow-hidden">
                  <TacticalField lineup={recentMatch.lineup} homeTeam={recentMatch.homeTeam} awayTeam={recentMatch.awayTeam} />
                </div>
              </div>
            )}
            <MatchEvents substitutions={recentMatch.substitutions} cards={recentMatch.cards} />
          </div>
        </div>
      )}
    </div>
  );
}
