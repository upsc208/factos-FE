'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Newspaper, Info, Sparkles, Ticket, ShoppingBag, ChevronDown } from 'lucide-react';
import { CLUBS, CLUB_ORDER } from '@/config/clubs';

export default function Header({ clubId: propClubId }: { clubId?: string }) {
  const params = useParams();
  const pathname = usePathname();
  const clubId = propClubId || params.club as string;
  const club = CLUBS[clubId];

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY <= 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isChelsea = clubId === 'chelsea';
  const isLiverpool = clubId === 'liverpool';
  const isArsenal = clubId === 'arsenal';
  const isTottenham = clubId === 'tottenham';
  const isManCity = clubId === 'mancity';
  const isManUtd = clubId === 'manutd';
  const isColoredHeader = (isChelsea || isLiverpool || isArsenal || isTottenham || isManCity) && club;

  // Dynamic Header Styles
  let headerBgClass = 'bg-white dark:bg-[#0d0e14] border-b border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none';
  if (isChelsea && club) {
    headerBgClass = 'bg-[#034694] dark:bg-[#080e1a] border-b border-white/10 text-white shadow-md';
  } else if (isLiverpool && club) {
    headerBgClass = 'bg-[#c8102e] dark:bg-[#140809] text-white';
  } else if (isArsenal && club) {
    headerBgClass = 'bg-[#EF0107] dark:bg-[#0e0202] border-b border-white/10 text-white shadow-md';
  } else if (isTottenham && club) {
    headerBgClass = 'bg-[#132257] dark:bg-[#070b1a] border-b border-white/10 text-white shadow-md';
  } else if (isManCity && club) {
    headerBgClass = 'bg-[#85C6F2] dark:bg-[#081629] border-b border-white/10 text-white shadow-md';
  }

  const textPrimaryClass = isColoredHeader
    ? 'text-white'
    : 'text-gray-900 dark:text-white';

  const textSecondaryClass = isColoredHeader
    ? 'text-white/70'
    : 'text-gray-400';

  const navLinkClass = isColoredHeader
    ? 'group flex items-center gap-2 text-white/90 hover:text-white transition-all'
    : 'group flex items-center gap-2 text-gray-800 dark:text-gray-300 hover:opacity-70 transition-all';

  const navButtonClass = isColoredHeader
    ? 'group flex items-center gap-2 px-4 py-2 rounded-xl transition-all border border-white/20 hover:bg-white/10 text-white'
    : 'group flex items-center gap-2 px-4 py-2 rounded-xl transition-all border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-800 dark:text-gray-300';

  let switcherButtonClass = isColoredHeader
    ? 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white hover:bg-white/20 transition-all relative z-[70] cursor-pointer'
    : 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black text-xs font-bold text-black hover:bg-gray-50 transition-all relative z-[70] cursor-pointer shadow-sm';

  if (isManUtd && club) {
    switcherButtonClass = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary dark:bg-volt/95 border border-primary/20 dark:border-volt/20 text-xs font-bold text-white dark:text-black hover:bg-primary/90 dark:hover:bg-volt transition-all relative z-[70] cursor-pointer shadow-sm';
  }

  const logoNewsHighlightStyle = isColoredHeader
    ? { color: '#ffffff' }
    : { color: clubId ? 'var(--primary, #9ca3af)' : '#9ca3af' };

  const getStripePattern = () => {
    if (clubId === 'chelsea' && club) {
      return '#034694';
    }
    if (clubId === 'liverpool' && club) {
      return '#c8102e';
    }
    if (clubId === 'arsenal' && club) {
      return 'var(--arsenal-top-bar-bg)';
    }
    if (clubId === 'tottenham' && club) {
      return 'var(--tottenham-top-bar-bg)';
    }
    if (clubId === 'mancity' && club) {
      return 'linear-gradient(135deg, #85C6F2 0%, #a4d8f8 50%, #85C6F2 100%)';
    }
    if (clubId === 'manutd' && club) {
      return 'var(--manutd-stripe-bg)';
    }
    return '#111827'; // Neutral dark gray/black
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-colors duration-300 ${headerBgClass}`}>
      {/* Man City Diagonal Sash Background */}
      {isManCity && club && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-15 z-0">
          <div 
            className="absolute w-[200%] h-[300%]" 
            style={{
              transform: 'rotate(-25deg) translate(-25%, -45%)',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 12%, rgba(255,255,255,0.7) 15%, transparent 16%, transparent 18%, rgba(255,255,255,0.7) 19%, rgba(255,255,255,0.7) 20%, transparent 21%, transparent 23%, rgba(255,255,255,0.7) 24%, rgba(255,255,255,0.7) 32%, transparent 33%)',
              backgroundSize: '100% 100%'
            }}
          />
        </div>
      )}

      {/* Decorative Top Stripe */}
      <div 
        className={`relative w-full overflow-hidden flex items-center justify-center transition-all duration-300 ease-in-out ${
          isAtTop ? 'h-10 opacity-100' : 'h-0 opacity-0 pointer-events-none'
        }`}
        style={{ background: getStripePattern() }}
      >
        {clubId === 'liverpool' && club && (
          <div className="w-full h-full flex items-center justify-center px-6 sm:px-12 relative animate-in fade-in duration-1000 overflow-hidden">
             {/* Adidas-style 3-Stripes Left (White) */}
             <div className="absolute left-6 lg:left-12 top-0 bottom-0 flex gap-[9px] items-stretch">
               <div className="w-[9px] bg-white" style={{ transform: 'skewX(-45deg)', transformOrigin: 'top' }} />
               <div className="w-[9px] bg-white" style={{ transform: 'skewX(-45deg)', transformOrigin: 'top' }} />
               <div className="w-[9px] bg-white" style={{ transform: 'skewX(-45deg)', transformOrigin: 'top' }} />
             </div>

             {/* 25/26 Iconic Pinstripe Pattern */}
             <div className="absolute inset-0 opacity-[0.15] pointer-events-none flex justify-center gap-12">
               {Array.from({ length: 15 }).map((_, i) => (
                 <div key={i} className="w-[1px] h-full bg-white" />
               ))}
             </div>
             
             {/* Main YNWA Slogan in Cursive (Restored) */}
             <span 
               className="text-white text-lg sm:text-xl lg:text-2xl select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] leading-none pt-1 z-10"
               style={{ fontFamily: 'var(--font-great-vibes)', wordSpacing: '0.25em' }}
             >
               You&apos;ll Never Walk Alone
             </span>

             {/* Adidas-style 3-Stripes Right (White) */}
             <div className="absolute right-6 lg:right-12 top-0 bottom-0 flex gap-[9px] items-stretch">
               <div className="w-[9px] bg-white" style={{ transform: 'skewX(45deg)', transformOrigin: 'top' }} />
               <div className="w-[9px] bg-white" style={{ transform: 'skewX(45deg)', transformOrigin: 'top' }} />
               <div className="w-[9px] bg-white" style={{ transform: 'skewX(45deg)', transformOrigin: 'top' }} />
             </div>
          </div>
        )}
        
        {clubId === 'chelsea' && club && (
          <div className="w-full h-full flex items-center justify-center px-6 sm:px-12 relative animate-in fade-in duration-1000 overflow-hidden">
            {/* White Vertical Bar Left (Flipped Flatter Sharp Curve) */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-[20px] bg-white z-20" 
              style={{ clipPath: 'polygon(0 0, 100% 0, 65% 45%, 15% 100%, 0 100%)' }}
            />

            <div className="flex flex-col items-center">
              <span className="font-bebas text-2xl sm:text-4xl tracking-[0.4em] font-black italic uppercase text-white">
                KEEP THE BLUE FLAG FLYING HIGH
              </span>
            </div>

            {/* White Vertical Bar Right (Flipped Flatter Corrected Mirror) */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-[20px] bg-white z-20" 
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 85% 100%, 35% 45%)' }}
            />

            {/* Chelsea Collar Trim (Red Stripe) */}
            <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#EE242C] z-20" />
          </div>
        )}

        {clubId === 'manutd' && club && (
          <div className="w-full h-full flex items-center justify-center px-6 sm:px-12 relative animate-in fade-in slide-in-from-left-8 duration-1000">
             {/* Adidas-style 3-Stripes Left (Black / Gold in Dark) */}
             <div className="absolute left-6 lg:left-12 top-0 bottom-0 flex gap-[9px] items-stretch">
               <div className="w-[9px] bg-black dark:bg-[#E5B824]" style={{ transform: 'skewX(-45deg)', transformOrigin: 'top' }} />
               <div className="w-[9px] bg-black dark:bg-[#E5B824]" style={{ transform: 'skewX(-45deg)', transformOrigin: 'top' }} />
               <div className="w-[9px] bg-black dark:bg-[#E5B824]" style={{ transform: 'skewX(-45deg)', transformOrigin: 'top' }} />
             </div>
             
             {/* Main Slogan (White / Gold in Dark) */}
             <span className="text-white dark:text-[#E5B824] font-bebas text-xl sm:text-2xl lg:text-3xl tracking-[0.4em] font-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] italic uppercase">
               GLORY GLORY MAN UNITED
             </span>

             {/* Adidas-style 3-Stripes Right (Black / Gold in Dark) */}
             <div className="absolute right-6 lg:right-12 top-0 bottom-0 flex gap-[9px] items-stretch">
               <div className="w-[9px] bg-black dark:bg-[#E5B824]" style={{ transform: 'skewX(45deg)', transformOrigin: 'top' }} />
               <div className="w-[9px] bg-black dark:bg-[#E5B824]" style={{ transform: 'skewX(45deg)', transformOrigin: 'top' }} />
               <div className="w-[9px] bg-black dark:bg-[#E5B824]" style={{ transform: 'skewX(45deg)', transformOrigin: 'top' }} />
             </div>

             {/* Collar trim detail at the bottom of the stripe (Blue & Gold in Dark) */}
             <div className="absolute bottom-0 left-0 right-0 h-[5px] bg-[#0f1015] dark:bg-[#1072E5]" />
             <div className="absolute bottom-[2px] left-0 right-0 h-[1px] bg-white/90 dark:bg-[#E5B824]/90" />
          </div>
        )}

        {clubId === 'arsenal' && club && (
          <div className="w-full h-full flex items-center justify-center px-6 sm:px-12 relative animate-in fade-in slide-in-from-left-8 duration-1000">
             {/* Adidas 3-Stripes Left */}
             <div className="absolute left-6 lg:left-12 top-0 bottom-0 flex gap-[9px] items-stretch">
               <div className="w-[9px] bg-[#EF0107]" style={{ transform: 'skewX(-45deg)', transformOrigin: 'top' }} />
               <div className="w-[9px] bg-[#EF0107]" style={{ transform: 'skewX(-45deg)', transformOrigin: 'top' }} />
               <div className="w-[9px] bg-[#EF0107]" style={{ transform: 'skewX(-45deg)', transformOrigin: 'top' }} />
             </div>
             
             {/* Main Slogan only */}
             <div className="flex items-center gap-3 sm:gap-6 z-10">
               <span className="font-bebas text-2xl sm:text-3xl tracking-[0.2em] font-black italic uppercase" style={{ color: 'var(--arsenal-top-bar-text)' }}>
                 VICTORIA CONCORDIA CRESCIT
               </span>
             </div>

             {/* Adidas 3-Stripes Right */}
             <div className="absolute right-6 lg:right-12 top-0 bottom-0 flex gap-[9px] items-stretch">
               <div className="w-[9px] bg-[#EF0107]" style={{ transform: 'skewX(45deg)', transformOrigin: 'top' }} />
               <div className="w-[9px] bg-[#EF0107]" style={{ transform: 'skewX(45deg)', transformOrigin: 'top' }} />
               <div className="w-[9px] bg-[#EF0107]" style={{ transform: 'skewX(45deg)', transformOrigin: 'top' }} />
             </div>

             {/* Bottom solid gold piping stripe */}
             <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#DBA111] z-20" />
          </div>
        )}

        {clubId === 'tottenham' && club && (
          <div className="w-full h-full flex items-center justify-center px-6 sm:px-12 relative animate-in fade-in slide-in-from-left-8 duration-1000">
             {/* Left Sleeve Detail */}
             <div className="absolute left-0 top-0 bottom-0 flex gap-0 items-stretch overflow-hidden">
               <div className="w-16 md:w-32 bg-[#132257]" style={{ transform: 'skewX(-40deg)', transformOrigin: 'top left' }} />
               <div className="w-[4px] bg-[#B0B7C3]" style={{ transform: 'skewX(-40deg)', transformOrigin: 'top left' }} />
             </div>

             {/* Right Sleeve Detail */}
             <div className="absolute right-0 top-0 bottom-0 flex gap-0 items-stretch overflow-hidden">
               {/* White cuff stripe */}
               <div className="w-[4px] bg-[#B0B7C3]" style={{ transform: 'skewX(40deg)', transformOrigin: 'top right' }} />
               {/* Navy sleeve block */}
               <div className="w-16 md:w-32 bg-[#132257]" style={{ transform: 'skewX(40deg)', transformOrigin: 'top right' }} />
             </div>

             {/* Slogan only */}
             <div className="flex items-center gap-3 sm:gap-6 z-10">
               {/* Red AIA Inspired Slogan */}
               <span className="font-bebas text-2xl sm:text-3xl tracking-[0.4em] font-black italic uppercase text-[#E4002B]">
                 Come on you Spurs
               </span>
             </div>

             {/* Grey collar-cuff line at the bottom */}
             <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B0B7C3]/50 z-20" />
          </div>
        )}

        {clubId === 'mancity' && club && (
          <div className="w-full h-full flex items-center justify-center px-6 sm:px-12 relative animate-in fade-in duration-1000 overflow-hidden">
             {/* 25/26 Iconic Diagonal Sash */}
             <div 
               className="absolute inset-0 opacity-60 pointer-events-none" 
               style={{
                 background: 'linear-gradient(65deg, transparent 40%, rgba(255,255,255,0.9) 45%, rgba(255,255,255,0.9) 55%, transparent 60%)',
                 backgroundSize: '100% 100%'
               }}
             />
             
             {/* White Geometric Sleeve Detail */}
             <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-white/20 skew-x-[-15deg] -ml-4" />
             <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-white/20 skew-x-[15deg] -mr-4" />

             {/* Slogan only */}
             <div className="flex items-center gap-4 sm:gap-10 z-10">
               <div className="flex flex-col items-center">
                 <span className="font-bebas text-2xl sm:text-4xl tracking-[0.3em] font-black italic uppercase drop-shadow-sm text-[#1C2C5B]">
                   Superbia in Proelio
                 </span>
               </div>
             </div>

             {/* Bottom white trim line */}
             <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white z-20" />
          </div>
        )}

        {(!clubId || !club) && (
          <div className="w-full h-full flex items-center justify-center px-6 sm:px-12 animate-in fade-in duration-1000">
             <span className="text-white font-bebas text-xl sm:text-2xl tracking-[0.5em] font-black uppercase">
               Factos Football News Platform
             </span>
          </div>
        )}

      </div>
      
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row md:h-20 items-center justify-between px-2 sm:px-6 lg:px-12 py-4 md:py-0 mt-0 gap-y-4 md:gap-y-0 relative z-[70]">
        <div className="flex w-full items-center justify-between md:justify-start md:flex-1 gap-2 md:gap-4 lg:gap-6 shrink-0">
          <Link href={club ? `/${club.id}` : "/"} className="flex items-center space-x-2 sm:space-x-3 group shrink-0">
            <div 
              className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl shadow-lg group-hover:scale-105 transition-transform shrink-0 border border-white/10"
              style={{ backgroundColor: isColoredHeader ? '#ffffff' : (club?.colors.primary || '#111827') }}
            >
              <span className={`text-[10px] sm:text-sm font-black italic ${isColoredHeader ? (isChelsea ? 'text-[#034694]' : isLiverpool ? 'text-[#c8102e]' : isArsenal ? 'text-[#EF0107]' : isTottenham ? 'text-[#132257]' : 'text-[#85C6F2]') : 'text-white'}`}>{club ? club.shortName.substring(0, 2) : 'FP'}</span>
              <div className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-black text-white shadow-sm">
                <Sparkles size={8} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`text-base sm:text-xl font-black tracking-tighter uppercase leading-none font-bebas ${textPrimaryClass}`}>
                {club ? club.shortName : 'FACTOS'} <span style={logoNewsHighlightStyle}>NEWS</span>
              </span>
              <span className={`text-[8px] sm:text-[10px] font-bold tracking-[0.2em] uppercase leading-none mt-1 hidden sm:block ${textSecondaryClass}`}>
                {club ? `${club.shortName} 최신 소식` : '글로벌 축구 통합 뉴스'}
              </span>
            </div>
          </Link>
 
          {/* Club Switcher (Mobile Only) */}
          <div className="relative md:hidden">
            <button 
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className={switcherButtonClass}
            >
              팀 변경
              <ChevronDown size={14} className={`transition-transform duration-300 ${isSwitcherOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isSwitcherOpen && (
              <>
                <div 
                  className="fixed inset-0 z-[60]" 
                  onClick={() => setIsSwitcherOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-22 sm:w-28 bg-white dark:bg-[#111318] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                    {CLUB_ORDER.map((id) => {
                    const c = CLUBS[id];
                    return (
                      <Link
                        key={c.id}
                        href={`/${c.id}`}
                        onClick={() => setIsSwitcherOpen(false)}
                        className={`flex items-center justify-center px-3 py-3 text-sm font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer w-full ${c.id === clubId ? 'text-primary bg-gray-50 dark:bg-white/5' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        <span className="truncate">{c.nameKo}</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <nav className="flex items-center justify-center gap-x-4 md:gap-x-6 lg:gap-x-8 md:flex-none md:justify-center text-sm font-extrabold w-full md:w-auto mt-4 md:mt-0 whitespace-nowrap">
          <Link href={club ? `/${club.id}#news-section` : "/"} className={navLinkClass}>
            <Newspaper className="w-5 h-5" />
            <span className="tracking-tight">뉴스</span>
          </Link>
          <Link href="/about" className={navLinkClass}>
            <Info className="w-5 h-5" />
            <span className="tracking-tight">소개</span>
          </Link>
          <div className={`hidden lg:block h-6 w-[1px] mx-2 ${isColoredHeader ? 'bg-white/20' : 'bg-gray-200 dark:bg-white/10'}`}></div>
          <a
            href={club?.links.officialTickets || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={navButtonClass}
          >
            <Ticket className="w-5 h-5" />
            <span className="tracking-tighter font-extrabold">티켓</span>
          </a>
          <a
            href={club?.links.officialStore || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={navButtonClass}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="tracking-tighter font-extrabold">스토어</span>
          </a>
        </nav>

        <div className="hidden md:flex md:flex-1 justify-end">
          {/* Club Switcher (Desktop Only) */}
          <div className="relative">
            <button 
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className={switcherButtonClass}
            >
              팀 변경
              <ChevronDown size={14} className={`transition-transform duration-300 ${isSwitcherOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isSwitcherOpen && (
              <>
                <div 
                  className="fixed inset-0 z-[60]" 
                  onClick={() => setIsSwitcherOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-22 sm:w-28 bg-white dark:bg-[#111318] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                    {CLUB_ORDER.map((id) => {
                    const c = CLUBS[id];
                    return (
                      <Link
                        key={c.id}
                        href={`/${c.id}`}
                        onClick={() => setIsSwitcherOpen(false)}
                        className={`flex items-center justify-center px-3 py-3 text-sm font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer w-full ${c.id === clubId ? 'text-primary bg-gray-50 dark:bg-white/5' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        <span className="truncate">{c.nameKo}</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
