'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    // 윈도우 객체 확인
    if (typeof window === 'undefined') return;

    const currentUrl = window.location.href;
    const shareTitle = `알레띠 뉴스 | ${title || ''}`;
    
    // 1. Web Share API 시도
    if (navigator.share) {
      try {
        // 공유 데이터 객체를 명시적으로 생성 (불필요한 속성 제거)
        const data = {
          title: shareTitle,
          text: title || '',
          url: currentUrl,
        };

        // canShare 체크 시 에러가 발생할 수 있으므로 try-catch 내부에서 수행
        let canShare = false;
        try {
          canShare = !!(navigator.canShare && navigator.canShare(data));
        } catch (e) {
          console.warn('navigator.canShare failed:', e);
        }

        if (canShare || !navigator.canShare) {
          await navigator.share(data);
          return;
        }
      } catch (err) {
        // AbortError(사용자 취소)는 무시
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('Web Share API error:', err);
      }
    }

    // 2. 클립보드 복사 폴백
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        // 구형 브라우저 대응 (execCommand)
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className={`p-2 transition-all rounded-full flex items-center justify-center
          ${isCopied 
            ? 'bg-green-50 text-green-600' 
            : 'text-gray-400 hover:text-primary hover:bg-gray-50'
          }`}
        title="기사 공유하기"
      >
        {isCopied ? <Check size={20} /> : <Share2 size={20} />}
      </button>

      {/* 복사 완료 안내 툴팁 */}
      {isCopied && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-lg whitespace-nowrap animate-in fade-in zoom-in duration-200">
          링크가 복사되었습니다!
        </div>
      )}
    </div>
  );
}
