'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, KeyboardEvent } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }
    params.set('page', '1'); // 검색 시 1페이지로 이동
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-12 w-full relative">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search size={20} className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="뉴스 제목이나 기자를 검색하세요"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/[0.04] rounded-2xl py-4 pl-12 pr-24 soft-shadow focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-volt/15 focus:border-primary dark:focus:border-volt/30 transition-all text-sm md:text-base font-medium placeholder:text-gray-400 dark:text-gray-100"
      />
      <button
        onClick={handleSearch}
        className="absolute inset-y-2 right-2 px-4 md:px-6 bg-primary dark:bg-volt text-white dark:text-black rounded-xl font-bold text-xs md:text-sm hover:bg-primary/90 dark:hover:bg-volt/90 transition-colors whitespace-nowrap"
      >
        검색
      </button>
    </div>
  );
}
