'use client';

import { useState } from 'react';
import { Zap, Globe, Cpu, Send, CheckCircle2, AlertCircle, Shield, ShieldAlert } from 'lucide-react';
import { submitFeedback } from '@/client/sdk.gen';

export default function AboutPage() {
  const [category, setCategory] = useState('SUGGESTION');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsAtSubmitting] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsAtSubmitting(true);
    setStatus('IDLE');

    try {
      await submitFeedback({
        body: {
          category,
          title,
          content
        }
      });
      setStatus('SUCCESS');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setStatus('ERROR');
    } finally {
      setIsAtSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a0b10] min-h-screen pb-20 transition-colors duration-300">
      <main className="container mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-100 text-xs font-black uppercase tracking-[0.2em] mb-6">
            Global Football News Hub
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-gray-950 dark:text-white mb-10 tracking-tighter uppercase font-bebas leading-[0.85]">
            FACTOS <span className="text-gray-400 dark:text-gray-500">NEWS</span>
          </h1>

          <div className="prose prose-xl text-gray-600 dark:text-gray-300 leading-relaxed space-y-12 font-medium max-w-none font-kanit">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Factos News는 파편화된 해외 축구 소식을 한곳에 모아, 가장 직관적이고 빠르게 전달하는 <span className="text-black dark:text-white border-b-4 border-gray-900 dark:border-white">AI 기반 뉴스 플랫폼</span>입니다.
            </p>

            <p className="text-lg">
              우리는 수많은 언론사와 소셜 미디어에서 쏟아지는 정보 중, 팬들이 정말로 궁금해하는 <strong>&apos;사실(Factos)&apos;</strong>만을 골라냅니다. 언어의 장벽과 정보의 과부하를 넘어, 모든 축구 팬이 평등하게 최신 소식을 누릴 수 있는 환경을 구축하는 것이 우리의 미션입니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 not-prose">
              <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 space-y-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white bg-gray-900 dark:bg-gray-800">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-black uppercase font-bebas">Real-time</h3>
                <p className="text-sm text-gray-500 font-bold leading-relaxed">
                  현지 유력 기자들과 클럽 공식 채널의 소식을 24시간 모니터링하여 실시간으로 업데이트합니다.
                </p>
              </div>
              <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 space-y-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white bg-gray-400 dark:bg-gray-600">
                  <Cpu size={24} />
                </div>
                <h3 className="text-xl font-black uppercase font-bebas">AI Summary</h3>
                <p className="text-sm text-gray-500 font-bold leading-relaxed">
                  복잡하고 긴 외국어 기사를 AI가 분석하여 핵심 내용만 3줄 요약으로 제공합니다.
                </p>
              </div>
              <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 space-y-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white bg-gray-200 dark:bg-gray-700">
                  <Globe size={24} />
                </div>
                <h3 className="text-xl font-black uppercase font-bebas">Multi-Club</h3>
                <p className="text-sm text-gray-500 font-bold leading-relaxed">
                  맨유, 리버풀, 아스널 등 프리미어리그 주요 구단별 맞춤형 테마와 전용 뉴스 피드를 지원합니다.
                </p>
              </div>
            </div>

            <div className="space-y-16">
              <section>
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3 uppercase font-bebas text-gray-900 dark:text-white">
                  <div className="h-1.5 w-8 rounded-full bg-gray-900 dark:bg-white"></div>
                  The Factos Experience
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { title: "검증된 소스", desc: "BBC, The Athletic 등 공신력 있는 매체의 정보만을 취급합니다." },
                    { title: "데이터 시각화", desc: "단순 텍스트를 넘어 경기 결과, 라인업, 스탯을 직관적인 UI로 제공합니다." },
                    { title: "개인화된 테마", desc: "자신이 응원하는 구단의 컬러와 아이덴티티가 반영된 전용 페이지를 경험하세요." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 items-start p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <span className="text-4xl font-black text-gray-200 dark:text-white/10 group-hover:text-gray-900/20 dark:group-hover:text-white/20 transition-colors font-bebas">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">{item.title}</h4>
                        <p className="text-gray-500 dark:text-gray-400 font-bold">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Feedback Form Section */}
              <section className="pt-20 border-t border-gray-100 dark:border-white/5">
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-black mb-2 uppercase font-bebas text-gray-900 dark:text-white">
                    Feedback & Support
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">
                    플랫폼 발전을 위한 건의사항이나 버그 제보를 남겨주세요. 관리자의 슬랙으로 직접 전달됩니다.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6 not-prose">
                    <div className="flex flex-wrap gap-3">
                      {[
                        { id: 'SUGGESTION', label: '건의사항' },
                        { id: 'BUG', label: '버그 신고' },
                        { id: 'ETC', label: '기타' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`px-5 py-2.5 rounded-full text-sm font-black transition-all ${
                            category === cat.id
                              ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow-lg scale-105'
                              : 'bg-gray-50 text-gray-400 dark:bg-white/5 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="제목을 입력해주세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all font-bold"
                      />
                      <textarea
                        placeholder="내용을 상세히 적어주시면 큰 도움이 됩니다"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={5}
                        className="w-full px-6 py-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all font-bold resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        {status === 'SUCCESS' && (
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm animate-in fade-in slide-in-from-left-4">
                            <CheckCircle2 size={18} />
                            소중한 의견이 전달되었습니다. 감사합니다!
                          </div>
                        )}
                        {status === 'ERROR' && (
                          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm animate-in fade-in slide-in-from-left-4">
                            <AlertCircle size={18} />
                            전송에 실패했습니다. 잠시 후 다시 시도해주세요.
                          </div>
                        )}
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting || !title || !content}
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-black hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl"
                      >
                        {isSubmitting ? '전송 중...' : '보내기'}
                        <Send size={18} />
                      </button>
                    </div>
                  </form>
                </div>
              </section>

              <section className="p-8 sm:p-12 rounded-[3rem] bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Shield size={120} />
                </div>
                <h3 className="flex items-center gap-2 font-black mb-6 uppercase tracking-tighter text-2xl font-bebas text-gray-400">
                  <ShieldAlert size={28} /> Legal Disclaimer
                </h3>
                <div className="space-y-4 text-sm font-bold text-gray-400 relative z-10">
                  <p>• Factos News는 축구 팬들을 위한 <strong>비공식 프로젝트</strong>이며, 특정 구단이나 언론사와 공식 파트너십 관계가 없습니다.</p>
                  <p>• 모든 기사의 저작권은 해당 원문 언론사에 있으며, 본 서비스는 원활한 정보 습득을 돕는 매개체 역할만을 수행합니다.</p>
                  <p>• AI 요약 정보는 기술적 한계로 인해 원문의 의도와 미세한 차이가 있을 수 있으므로, 정확한 내용은 원문 링크를 참조하시기 바랍니다.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.5em] mt-20">
        &copy; 2026 Factos News Platform. All Factos Reserved.
      </footer>
    </div>
  );
}
