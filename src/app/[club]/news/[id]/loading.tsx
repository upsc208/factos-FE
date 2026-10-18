export default function NewsDetailLoading() {
  return (
    <div className="bg-white dark:bg-[#0a0b10] min-h-screen pb-20 transition-colors duration-300">
      {/* Sticky Back Bar Skeleton */}
      <div className="sticky top-16 sm:top-20 z-40 w-full bg-white/80 dark:bg-[#0d0e14]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-4 h-12 flex items-center">
          <div className="h-4 w-32 bg-gray-100 dark:bg-white/5 animate-pulse rounded" />
        </div>
      </div>

      <article className="container mx-auto px-4 pt-8 sm:pt-12 max-w-3xl">
        <header className="mb-8 sm:mb-10">
          {/* Title Skeleton */}
          <div className="h-10 sm:h-16 w-full bg-gray-100 dark:bg-white/5 animate-pulse rounded-xl mb-6" />
          <div className="h-10 sm:h-16 w-3/4 bg-gray-100 dark:bg-white/5 animate-pulse rounded-xl mb-8" />

          {/* Meta Info Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-gray-100 dark:border-white/5 py-4 sm:py-6 gap-6">
            <div className="flex gap-4">
              <div className="h-6 w-20 bg-gray-100 dark:bg-white/5 animate-pulse rounded" />
              <div className="h-6 w-32 bg-gray-100 dark:bg-white/5 animate-pulse rounded" />
            </div>
            <div className="h-10 w-24 bg-gray-100 dark:bg-white/5 animate-pulse rounded-xl" />
          </div>
        </header>

        {/* AI Summary Skeleton */}
        <div className="mb-12 bg-gray-50 dark:bg-white/[0.02] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-white/5">
          <div className="h-4 w-24 bg-gray-100 dark:bg-white/5 animate-pulse rounded mb-4" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-100 dark:bg-white/5 animate-pulse rounded" />
            <div className="h-4 w-full bg-gray-100 dark:bg-white/5 animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-gray-100 dark:bg-white/5 animate-pulse rounded" />
          </div>
        </div>

        {/* Image Skeleton */}
        <div className="mb-12">
          <div className="relative h-[300px] sm:h-[450px] w-full bg-gray-100 dark:bg-white/5 animate-pulse rounded-3xl" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4 mb-20">
          <div className="h-6 w-full bg-gray-100 dark:bg-white/5 animate-pulse rounded" />
          <div className="h-6 w-full bg-gray-100 dark:bg-white/5 animate-pulse rounded" />
          <div className="h-6 w-5/6 bg-gray-100 dark:bg-white/5 animate-pulse rounded" />
          <div className="h-6 w-full bg-gray-100 dark:bg-white/5 animate-pulse rounded" />
          <div className="h-6 w-4/5 bg-gray-100 dark:bg-white/5 animate-pulse rounded" />
        </div>
      </article>
    </div>
  );
}
