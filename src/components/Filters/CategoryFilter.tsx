'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { 
  LayoutGrid, 
  ArrowLeftRight, 
  Trophy, 
  Megaphone, 
  Stethoscope, 
  Mic2, 
  ClipboardList, 
  MoreHorizontal,
  Flame
} from 'lucide-react';

const categories = [
  { id: 'all', label: '전체', icon: LayoutGrid },
  { id: 'hyped', label: 'Hyped', icon: Flame },
  { id: '이적시장', label: '이적시장', icon: ArrowLeftRight },
  { id: '경기리뷰', label: '경기리뷰', icon: Trophy },
  { id: '오피셜', label: '오피셜', icon: Megaphone },
  { id: '부상/명단', label: '부상/명단', icon: Stethoscope },
  { id: '인터뷰', label: '인터뷰', icon: Mic2 },
  { id: '예상라인업', label: '예상라인업', icon: ClipboardList },
  { id: '기타', label: '기타', icon: MoreHorizontal },
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const isHypedActive = searchParams.get('isHyped') === 'true';
  const currentCategory = isHypedActive ? 'hyped' : (searchParams.get('category') || 'all');

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset both filters first
    params.delete('category');
    params.delete('isHyped');
    
    if (categoryId === 'hyped') {
      params.set('isHyped', 'true');
    } else if (categoryId !== 'all') {
      params.set('category', categoryId);
    }
    
    params.set('page', '1'); // 카테고리 변경 시 1페이지로 이동
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full mb-8 relative group">
      {/* Left Gradient Fade */}
      <div className="absolute left-0 top-0 bottom-2 w-12 bg-gradient-to-r from-gray-50 dark:from-[#0a0b10] to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity md:hidden"></div>
      
      {/* Right Gradient Fade */}
      <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-gray-50 dark:from-[#0a0b10] to-transparent z-10 pointer-events-none md:hidden"></div>

      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center justify-start md:justify-center gap-2 min-w-max px-6 md:px-1">
          {categories.map((category) => {
            const isActive = currentCategory === category.id;
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`
                  flex items-center gap-3 px-7 py-3.5 rounded-full text-base font-black transition-all whitespace-nowrap border
                  ${isActive
                    ? 'bg-primary dark:bg-volt/90 text-white dark:text-black border-transparent shadow-xl shadow-primary/20 dark:shadow-volt/10'
                    : 'bg-white dark:bg-[#111318] border-gray-100 dark:border-white/[0.04] text-gray-500 dark:text-gray-400 hover:border-primary/30 dark:hover:border-volt/15 hover:text-primary dark:hover:text-volt hover:bg-primary/5 dark:hover:bg-volt/5'}
                `}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'} />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
