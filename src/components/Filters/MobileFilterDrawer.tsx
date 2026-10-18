'use client';

import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { NewsSource } from '@/client/types.gen';
import SourceFilter from './SourceFilter';

interface MobileFilterDrawerProps {
  allSources: NewsSource[];
}

export default function MobileFilterDrawer({ allSources }: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center justify-center gap-2 bg-gray-900 dark:bg-volt/90 text-white dark:text-black px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
      >
        <Filter size={18} />
        필터
      </button>

      {/* Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-gray-50 dark:bg-[#0a0b10] z-[101] shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-white dark:bg-[#0d0e14] border-b border-gray-100 dark:border-volt/8">
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
              필터 설정
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Filter Content - Scrollable Area */}
          <div className="flex-grow overflow-y-auto px-6 py-4">
            <SourceFilter allSources={allSources} />
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="bg-white dark:bg-[#0d0e14] border-t border-gray-100 dark:border-volt/8 p-6">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-4 bg-primary dark:bg-volt/90 text-white dark:text-black rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 dark:shadow-volt/10 active:scale-[0.98] transition-transform"
            >
              필터 적용
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
