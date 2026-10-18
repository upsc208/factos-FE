'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();
  
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    
    if (currentPage <= 4) return [...pages.slice(0, 5), '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', ...pages.slice(totalPages - 5)];
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `?${params.toString()}#news-section`;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-16">
      {currentPage === 1 ? (
        <div className="p-2 rounded-xl border border-gray-200 dark:border-white/[0.04] text-gray-400 opacity-30 bg-white dark:bg-[#111318]">
          <ChevronLeft size={20} />
        </div>
      ) : (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="p-2 rounded-xl border border-gray-200 dark:border-white/[0.04] text-gray-400 hover:border-primary dark:hover:border-volt/20 hover:text-primary dark:hover:text-volt transition-all bg-white dark:bg-[#111318] soft-shadow"
        >
          <ChevronLeft size={20} />
        </Link>
      )}

      <div className="flex items-center gap-1 flex-wrap justify-center">
        {getVisiblePages().map((page, index) => (
          page === '...' ? (
            <span key={index} className="min-w-[40px] h-10 flex items-center justify-center text-gray-300 font-bold">
              ...
            </span>
          ) : (
            <Link
              key={index}
              href={createPageUrl(page as number)}
              className={`
                flex items-center justify-center min-w-[40px] h-10 rounded-xl font-bold text-sm transition-all
                ${currentPage === page 
                  ? 'bg-primary dark:bg-volt/90 text-white dark:text-black shadow-lg shadow-primary/20 dark:shadow-volt/10' 
                  : 'bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/[0.04] text-gray-500 dark:text-gray-400 hover:border-primary dark:hover:border-volt/20 hover:text-primary dark:hover:text-volt'
                }
              `}
            >
              {page}
            </Link>
          )
        ))}
      </div>

      {currentPage === totalPages ? (
        <div className="p-2 rounded-xl border border-gray-200 dark:border-[#2a3050] text-gray-400 opacity-30 bg-white dark:bg-[#141828]">
          <ChevronRight size={20} />
        </div>
      ) : (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="p-2 rounded-xl border border-gray-200 dark:border-[#2a3050] text-gray-400 hover:border-primary hover:text-primary transition-all bg-white dark:bg-[#141828] soft-shadow"
        >
          <ChevronRight size={20} />
        </Link>
      )}
    </nav>
  );
}
