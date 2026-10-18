'use client';

import { useState, Suspense } from 'react';
import { ChevronRight } from 'lucide-react';
import SourceFilter from '@/components/Filters/SourceFilter';

interface NewsFeedContainerProps {
  sourcesData: any[];
  children: React.ReactNode;
}

export default function NewsFeedContainer({ sourcesData, children }: NewsFeedContainerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-16 mt-12 relative">
      {/* Desktop Sidebar Container */}
      <div 
        className={`
          hidden md:block shrink-0 transition-all duration-500 ease-in-out overflow-visible
          ${isExpanded ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none'}
        `}
      >
        <div className={`sticky top-28 self-start w-80 transition-transform duration-500 ${isExpanded ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="relative bg-white dark:bg-[#111318] rounded-3xl border border-gray-200 dark:border-white/[0.04] shadow-xl dark:shadow-black/40 pt-8 px-6 pb-10 dark-card-pattern">
            {/* Desktop Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="h-1 w-10 bg-gray-200 dark:bg-volt/15 rounded-full mb-4"></div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-volt/40 uppercase tracking-widest text-center">
                필터
              </h3>
            </div>
            
            <Suspense fallback={<div className="h-40 w-full animate-pulse bg-gray-50 dark:bg-white/5 rounded-2xl" />}>
              <SourceFilter allSources={sourcesData} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Toggle Button (Visible when collapsed) */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-[60] group items-center"
        >
          <div className="h-32 w-2 bg-gray-200 rounded-r-full group-hover:bg-primary transition-all duration-300" />
          <div className="flex items-center justify-center w-10 h-16 bg-white dark:bg-[#111318] border-2 border-l-0 border-gray-100 dark:border-white/[0.04] rounded-r-2xl shadow-2xl -ml-0.5 transition-all duration-300 group-hover:pl-2">
            <ChevronRight size={24} className="text-gray-400 group-hover:text-primary" strokeWidth={3} />
          </div>
        </button>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-grow min-w-0 transition-all duration-500">
        {children}
      </div>

      {/* Close Button Trigger */}
      {isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          className="hidden md:flex fixed left-[320px] lg:left-[calc(320px+4rem)] top-1/2 -translate-y-1/2 z-[60] group items-center opacity-0 hover:opacity-100 transition-opacity duration-300"
          title="필터 접기"
        >
           <div className="h-16 w-1 bg-gray-100 rounded-full group-hover:bg-primary/30 transition-colors" />
        </button>
      )}
    </div>
  );
}
