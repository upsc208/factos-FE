'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { Check } from 'lucide-react';
import { NewsSource } from '@/client/types.gen';

interface SourceFilterProps {
  allSources: NewsSource[];
}

export default function SourceFilter({ allSources }: SourceFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 현재 선택된 ID들을 가져옵니다.
  // 이 때, allSources의 internalId와 대조하여 정확한 케이싱을 유지한 목록을 관리합니다.
  const selectedInternalIdsFromUrl = useMemo(() => {
    const sourcesParam = searchParams.get('sources');
    if (!sourcesParam) return allSources.map(s => s.internalId); // 파라미터 없으면 전체 선택
    if (sourcesParam === 'none') return [];
    
    // URL에 있는 값들 중 실제 존재하는 internalId만 필터링 (대소문자 무시 비교 후 실제 값 반환)
    const urlIds = sourcesParam.split(',');
    return urlIds.map(urlId => {
      const found = allSources.find(s => s.internalId.toLowerCase() === urlId.toLowerCase());
      return found ? found.internalId : urlId;
    });
  }, [searchParams, allSources]);

  const toggleSource = (internalId: string) => {
    let nextInternalIds: string[];

    if (selectedInternalIdsFromUrl.includes(internalId)) {
      // Unchecking
      nextInternalIds = selectedInternalIdsFromUrl.filter((id) => id !== internalId);
    } else {
      // Checking
      nextInternalIds = [...selectedInternalIdsFromUrl, internalId];
    }

    const searchParamsObj: Record<string, string> = {};
    
    // 기존 파라미터 유지 (query, category, isHyped)
    const currentQuery = searchParams.get('query');
    if (currentQuery) searchParamsObj.query = currentQuery;
    
    const currentCategory = searchParams.get('category');
    if (currentCategory) searchParamsObj.category = currentCategory;
    
    const currentIsHyped = searchParams.get('isHyped');
    if (currentIsHyped) searchParamsObj.isHyped = currentIsHyped;

    // Logic for URL param
    if (nextInternalIds.length === allSources.length && nextInternalIds.length > 0) {
      // All selected -> clear param for clean URL
    } else if (nextInternalIds.length === 0) {
      // None selected
      searchParamsObj.sources = 'none';
    } else {
      // URL에는 백엔드가 원하는 정확한 대소문자(internalId)를 넣습니다.
      searchParamsObj.sources = nextInternalIds.join(',');
    }

    searchParamsObj.page = '1';
    
    // URLSearchParams를 쓰되, 최종 문자열을 직접 확인
    const newParams = new URLSearchParams(searchParamsObj);
    const queryString = newParams.toString();
    
    router.push(`?${queryString}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-3 pb-12 sm:pb-0">
      {allSources.length > 0 ? (
        allSources.map((source) => {
          const isSelected = selectedInternalIdsFromUrl.includes(source.internalId);
          return (
            <label
              key={source.internalId}
              className={`
                flex items-center justify-between px-5 py-3.5 rounded-xl cursor-pointer transition-all border
                ${isSelected
                  ? 'bg-primary/5 dark:bg-volt/[0.03] border-primary/30 dark:border-volt/30 text-primary dark:text-gray-100 shadow-sm'
                  : 'bg-gray-50 dark:bg-white/[0.02] border-gray-100 dark:border-white/[0.04] text-gray-500 dark:text-gray-400 hover:border-secondary/20 dark:hover:border-volt/15'}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-4 h-4 rounded-md flex items-center justify-center border transition-all
                  ${isSelected ? 'bg-primary dark:bg-volt border-primary dark:border-volt' : 'bg-white dark:bg-[#1c1e27] border-gray-200 dark:border-white/[0.06]'}
                `}>
                  {isSelected && <Check size={10} className="text-white dark:text-black stroke-[4px]" />}
                </div>
                <span className={`text-[13px] font-bold tracking-tight ${isSelected ? 'text-primary dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                  {source.displayName}
                </span>
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={isSelected}
                onChange={() => toggleSource(source.internalId)}
              />
            </label>
          );
        })
      ) : (
        <p className="text-[10px] font-bold text-gray-300 italic text-center">등록된 소스가 없습니다.</p>
      )}

      <div className="flex flex-col gap-2 mt-4 sm:mt-6">
        <div className="flex gap-2">
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete('sources');
              params.set('page', '1');
              router.push(`?${params.toString()}`, { scroll: false });
            }}
            disabled={selectedInternalIdsFromUrl.length === allSources.length}
            className={`
              flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
              ${selectedInternalIdsFromUrl.length === allSources.length
                ? 'bg-gray-50 dark:bg-white/[0.02] text-gray-300 dark:text-gray-600 cursor-not-allowed border border-gray-100 dark:border-white/[0.04]'
                : 'bg-secondary dark:bg-[#1c1e27] text-white dark:text-gray-300 hover:bg-primary dark:hover:bg-volt dark:hover:text-black border border-transparent dark:border-volt/25 shadow-md'}
            `}
          >
            전체 선택
          </button>
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('sources', 'none');
              params.set('page', '1');
              router.push(`?${params.toString()}`, { scroll: false });
            }}
            disabled={selectedInternalIdsFromUrl.length === 0}
            className={`
              flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
              ${selectedInternalIdsFromUrl.length === 0
                ? 'bg-gray-50 dark:bg-white/[0.02] text-gray-300 dark:text-gray-600 cursor-not-allowed border border-gray-100 dark:border-white/[0.04]'
                : 'bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/[0.04] text-gray-600 dark:text-gray-400 hover:border-primary dark:hover:border-volt/30 hover:text-primary dark:hover:text-volt dark:hover:bg-volt/5 shadow-md'}
            `}
          >
            전체 해제
          </button>
        </div>
      </div>
    </div>
  );
}
