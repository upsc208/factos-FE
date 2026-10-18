import { X } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  allAuthors: string[];
  allSources: string[];
  selectedAuthors: string[];
  selectedSources: string[];
  onToggleAuthor: (author: string) => void;
  onToggleSource: (source: string) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  allAuthors,
  allSources,
  selectedAuthors,
  selectedSources,
  onToggleAuthor,
  onToggleSource,
  onReset
}: FilterSidebarProps) {
  return (
    <aside className={`
      fixed inset-0 z-50 bg-white p-6 md:relative md:inset-auto md:z-0 md:p-0 md:bg-transparent md:block md:w-64 shrink-0
      transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="flex items-center justify-between mb-8 md:hidden">
        <h3 className="text-xl font-bold text-gray-900">필터 설정</h3>
        <button onClick={onClose} className="text-gray-400">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-8 sticky top-24">
        {/* 기자 필터 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 soft-shadow">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-50 pb-2 flex justify-between items-center">
            기자별 필터
            <span className="text-[10px] text-aleti-red">{selectedAuthors.length} 선택됨</span>
          </h4>
          <div className="space-y-3">
            {allAuthors.map(author => (
              <label key={author} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none h-5 w-5 border-2 border-gray-200 rounded-md checked:bg-aleti-red checked:border-aleti-red transition-all"
                    checked={selectedAuthors.includes(author)}
                    onChange={() => onToggleAuthor(author)}
                  />
                  <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-[10px] font-bold">✓</div>
                </div>
                <span className="text-sm font-semibold text-gray-600 group-hover:text-aleti-red transition-colors">
                  {author}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 언론사 필터 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 soft-shadow">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-50 pb-2 flex justify-between items-center">
            언론사별 필터
            <span className="text-[10px] text-aleti-red">{selectedSources.length} 선택됨</span>
          </h4>
          <div className="space-y-3">
            {allSources.map(source => (
              <label key={source} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none h-5 w-5 border-2 border-gray-200 rounded-md checked:bg-aleti-navy checked:border-aleti-navy transition-all"
                    checked={selectedSources.includes(source)}
                    onChange={() => onToggleSource(source)}
                  />
                  <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-[10px] font-bold">✓</div>
                </div>
                <span className="text-sm font-semibold text-gray-600 group-hover:text-aleti-navy transition-colors">
                  {source}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button 
          onClick={onReset}
          className="w-full py-3 rounded-xl bg-gray-50 text-gray-400 text-xs font-bold hover:bg-gray-100 hover:text-gray-600 transition-all border border-gray-100"
        >
          필터 및 검색 초기화
        </button>
      </div>
    </aside>
  );
}
