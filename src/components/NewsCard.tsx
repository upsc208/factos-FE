import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, User, ImageIcon, Sparkles, Clock } from 'lucide-react';
import { NewsListResponse } from '@/client/types.gen';
import { ClubConfig } from '@/config/clubs';

interface NewsCardProps {
  news: NewsListResponse;
  showImage?: boolean;
  fromPage?: number;
  club: ClubConfig;
}

export default function NewsCard({ news, showImage = false, fromPage, club }: NewsCardProps) {
  const getArticleTypeText = (type: string) => {
    switch (type) {
      case 'WEB_ARTICLE': return '웹 기사';
      case 'SNS_POST': return 'X 기사';
      default: return '기타';
    }
  };

  // Type assertion for imageUrl since it's missing in NewsListResponse type but expected in data
  const imageUrl = (news as any).imageUrl;

  return (
    <Link
      href={`/${club.id}/news/${news.id}${fromPage ? `?fromPage=${fromPage}` : ''}`}
      id={`news-${news.id}`}
      className="group relative flex flex-col bg-white dark:bg-[#111318] rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-2xl dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-500 overflow-hidden mb-8 sm:mb-10"
    >
      {/* 상단 액센트 라인 */}
      <div 
        className="h-2 w-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(90deg, var(--primary), var(--accent), transparent)' }}
      />


      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row gap-6 sm:gap-8">
        {/* 이미지 영역 - 웹 기사만 표시 */}
        {showImage && news.articleType === 'WEB_ARTICLE' && (
          <div className="relative h-56 w-full sm:h-48 sm:w-56 lg:h-56 lg:w-72 shrink-0 overflow-hidden rounded-2xl bg-gray-100 dark:bg-[#16181f] border border-gray-100 dark:border-white/[0.04] shadow-inner group/img">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={news.titleKo || ''}
                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-[#16181f]">
                <ImageIcon size={40} className="text-gray-300" />
              </div>
            )}
          </div>
        )}

        {/* 콘텐츠 영역 */}
        <div className="flex flex-col flex-grow min-w-0 justify-center">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span 
                className="text-[11px] sm:text-[12px] lg:text-[13px] font-bebas text-white px-3 py-1.5 rounded-md uppercase tracking-widest shadow-md"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {news.sourceName}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] lg:text-[13px] font-extrabold uppercase tracking-tighter text-gray-500 dark:text-gray-400">
              <User size={16} style={{ color: 'var(--primary)' }} />
              <span className="truncate max-w-[100px] sm:max-w-none font-kanit">{news.authorName || 'NEWS'}</span>
            </div>

            <div className="w-1 h-1 rounded-full bg-gray-300 hidden xs:block" />

            <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] lg:text-[13px] font-bold text-gray-400 font-kanit">
              <Clock size={16} />
              <span className="whitespace-nowrap">
                {news.publishedAt
                  ? new Date(news.publishedAt).toLocaleString('ko-KR', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  }) + ' KST'
                  : '날짜 없음'}
              </span>
            </div>
          </div>

          <h3 className="mb-5 text-2xl sm:text-3xl lg:text-[2rem] font-black text-gray-900 dark:text-white transition-colors line-clamp-2 leading-[1.2] tracking-tight group-hover:text-primary">
            {news.titleKo}
          </h3>

          {news.summaryKo && (
            <div 
              className="relative p-5 sm:p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border-l-4 transition-all hidden xs:block shadow-inner"
              style={{ borderLeftColor: 'var(--primary)' }}
            >
              <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--primary)' }}>
                <Sparkles size={18} className="fill-current" />
                <span className="text-[11px] lg:text-[12px] font-bebas tracking-[0.2em] uppercase">AI Insight</span>
              </div>
              <p className="text-base lg:text-[1.1rem] text-gray-600 dark:text-gray-300 line-clamp-2 font-bold leading-relaxed font-kanit">
                {news.summaryKo}
              </p>
            </div>
          )}

          <div 
            className="mt-6 lg:mt-8 flex items-center gap-2 text-[12px] lg:text-[13px] font-bebas opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all sm:translate-y-2 group-hover:translate-y-0 uppercase tracking-[0.2em]"
            style={{ color: 'var(--primary)' }}
          >
            <span className="border-b-2 border-current pb-0.5">Read Full Story</span>
            <ExternalLink size={16} />
          </div>
        </div>
      </div>
    </Link>

  );
}

