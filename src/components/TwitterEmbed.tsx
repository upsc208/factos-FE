'use client';

import React, { Component, ErrorInfo, ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// react-tweet의 EmbeddedTweet 컴포넌트를 클라이언트 사이드 전용으로 로드
const EmbeddedTweet = dynamic(() => import('react-tweet').then(mod => mod.EmbeddedTweet), {
  ssr: false,
  loading: () => <div className="h-40 w-full animate-pulse bg-gray-50 dark:bg-white/5 rounded-2xl" />
});

// 에러 바운더리
class TweetErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Tweet hydration failed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface TwitterEmbedProps {
  tweetData?: any;
  originalUrl?: string;
}

export default function TwitterEmbed({ tweetData, originalUrl }: TwitterEmbedProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const FallbackUI = (
    <div className="p-8 text-center bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
      <p className="text-gray-500 dark:text-gray-400 text-sm">트윗 내용을 렌더링할 수 없습니다.</p>
      {originalUrl && (
        <a 
          href={originalUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary dark:text-volt text-xs font-bold mt-2 inline-block hover:underline"
        >
          트위터에서 직접 보기
        </a>
      )}
    </div>
  );

  if (!mounted) {
    return (
      <div className="min-h-[200px] flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-2xl animate-pulse">
        <p className="text-gray-400 text-sm">트윗 준비 중...</p>
      </div>
    );
  }

  if (!tweetData) return FallbackUI;

  return (
    <div className="w-full flex justify-center twitter-embed-container min-h-[200px]">
      <TweetErrorBoundary fallback={FallbackUI}>
        {/* 클라이언트 사이드 전용 EmbeddedTweet 컴포넌트 사용 */}
        <EmbeddedTweet tweet={tweetData} />
      </TweetErrorBoundary>
    </div>
  );
}
