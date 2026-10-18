import { Newspaper, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col gap-0 pt-10 animate-in fade-in duration-500">
      <section className="container mx-auto px-6 lg:px-12 py-12 relative">
        {/* Match Result Card Skeleton */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div className="w-full">
            <div className="w-full h-[400px] md:h-[300px] rounded-[3rem] bg-white/50 dark:bg-[#111318]/50 animate-pulse border border-gray-100 dark:border-white/[0.04]" />
          </div>
        </div>

        {/* Search & Filter Skeleton */}
        <div className="space-y-4 mb-12">
          <div className="h-14 w-full max-w-2xl rounded-2xl bg-white/50 dark:bg-[#111318]/50 animate-pulse border border-gray-100 dark:border-white/[0.04]" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-24 rounded-full bg-white/50 dark:bg-[#111318]/50 animate-pulse border border-gray-100 dark:border-white/[0.04]" />
            ))}
          </div>
        </div>

        {/* News Feed Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col md:flex-row gap-8 p-8 rounded-[2.5rem] bg-white/50 dark:bg-[#111318]/50 animate-pulse border border-gray-100 dark:border-white/[0.04]">
              <div className="w-full md:w-72 h-48 rounded-3xl bg-gray-200/50 dark:bg-gray-800/50" />
              <div className="flex-1 space-y-4 py-2">
                <div className="h-4 w-24 bg-gray-200/50 dark:bg-gray-800/50 rounded" />
                <div className="h-8 w-3/4 bg-gray-200/50 dark:bg-gray-800/50 rounded" />
                <div className="h-4 w-full bg-gray-200/50 dark:bg-gray-800/50 rounded" />
                <div className="h-4 w-2/3 bg-gray-200/50 dark:bg-gray-800/50 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Central Loading Indicator */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative bg-white dark:bg-[#1a1c23] px-8 py-4 rounded-full shadow-2xl border border-gray-100 dark:border-white/5 flex items-center gap-3 animate-bounce">
                <span className="text-2xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase">
                  Factos <span className="text-blue-600">체크 중</span>
                </span>
                <span className="text-2xl animate-pulse">👍</span>
              </div>
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
