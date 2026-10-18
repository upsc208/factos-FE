import Link from 'next/link';
import { ChevronLeft, ShieldAlert, Info, Shield, Target } from 'lucide-react';
import { CLUBS } from '@/config/clubs';
import { notFound } from 'next/navigation';

export default async function AboutPage({
  params: paramsPromise,
}: {
  params: Promise<{ club: string }>;
}) {
  const params = await paramsPromise;
  const clubId = params.club;
  const club = CLUBS[clubId];

  if (!club) {
    notFound();
  }

  return (
    <div className="bg-white dark:bg-[#0a0b10] min-h-screen pb-20 transition-colors duration-300 pt-16">
      <div className="sticky top-16 z-40 w-full bg-white/80 dark:bg-[#0d0e14]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-6 lg:px-12 h-14 flex items-center justify-between">
          <Link href={`/${club.id}`} className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:opacity-70 transition-all">
            <ChevronLeft size={16} />
            홈으로 돌아가기
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">About Platform</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-gray-950 dark:text-white mb-10 tracking-tighter uppercase font-bebas">
            ABOUT <span style={{ color: 'var(--primary)' }}>{club.shortName} NEWS</span>
          </h1>

          <div className="prose prose-xl text-gray-600 dark:text-gray-300 leading-relaxed space-y-8 font-medium max-w-none font-kanit">
            <p className="text-xl sm:text-2xl font-bold leading-relaxed mb-16">
              <strong>{club.shortName} NEWS</strong>는 {club.nameKo}를 사랑하는 한국 팬들이 언어의 장벽 없이 현지의 생생한 소식을 접할 수 있도록 돕기 위해 시작된 <strong>비공식 팬 프로젝트</strong>입니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 not-prose">
              <div className="space-y-6">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: 'var(--primary)' }}>
                  <Shield size={28} />
                </div>
                <h3 className="text-2xl font-black uppercase font-bebas">Authenticity</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  현지 유력 언론사와 공식 소셜 미디어를 통해 검증된 정보만을 필터링하여 전달합니다.
                </p>
              </div>
              <div className="space-y-6">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: 'var(--secondary)' }}>
                  <Target size={28} />
                </div>
                <h3 className="text-2xl font-black uppercase font-bebas">Accessibility</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  복잡한 외국 기사를 AI 기술을 활용하여 핵심만 요약, 한국 팬들이 읽기 편한 형태로 재구성합니다.
                </p>
              </div>
            </div>

            <div 
              className="p-8 sm:p-12 rounded-[3rem] border my-16 not-prose"
              style={{ backgroundColor: 'var(--primary-glow)', borderColor: 'var(--primary-border-glow)' }}
            >
              <h2 
                className="text-2xl sm:text-3xl font-black mb-8 flex items-center gap-3 uppercase font-bebas"
                style={{ color: 'var(--primary)' }}
              >
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
                Project Mission
              </h2>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="font-bold shrink-0 mt-1" style={{ color: 'var(--primary)' }}>01.</span>
                  <p className="text-gray-700 dark:text-gray-300 font-bold text-lg leading-tight">가장 빠르고 정확한 {club.shortName} 뉴스 전달</p>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold shrink-0 mt-1" style={{ color: 'var(--primary)' }}>02.</span>
                  <p className="text-gray-700 dark:text-gray-300 font-bold text-lg leading-tight">AI 기반의 요약으로 정보 습득 효율성 극대화</p>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold shrink-0 mt-1" style={{ color: 'var(--primary)' }}>03.</span>
                  <p className="text-gray-700 dark:text-gray-300 font-bold text-lg leading-tight">글로벌 팬덤을 위한 디지털 뉴스 허브 구축</p>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-100 dark:border-white/5 pt-16 not-prose">
              <h3 
                className="flex items-center gap-2 font-black mb-6 uppercase tracking-tighter text-xl sm:text-2xl font-bebas"
                style={{ color: 'var(--primary)' }}
              >
                <ShieldAlert size={28} /> Legal Disclaimer
              </h3>
              <div className="space-y-4 text-sm font-bold text-gray-500 dark:text-gray-400">
                <p>• 본 사이트는 {club.nameKo} 구단 또는 특정 언론사와 공식적인 관계가 없는 <strong>비공식 팬 페이지</strong>입니다.</p>
                <p>• 서비스 내에서 제공되는 요약 정보는 AI 기술로 생성되었으며, 원문 기사와 뉘앙스 차이가 있을 수 있습니다.</p>
                <p>• 모든 뉴스 권한은 원작자 및 해당 언론사에 있으며, 본 서비스는 정보 전달의 편의를 위해서만 링크를 제공합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
