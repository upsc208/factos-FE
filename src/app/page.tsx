import Link from 'next/link';
import { CLUBS, CLUB_ORDER } from '@/config/clubs';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b10] flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white uppercase font-bebas">
            CHOOSE YOUR <span className="text-blue-600">PLATFORM</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
            원하시는 구단의 뉴스 플랫폼을 선택해주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CLUB_ORDER.map((id) => {
            const club = CLUBS[id];
            return (
              <Link
                key={club.id}
                href={`/${club.id}`}
                className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#111318] p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100 dark:border-white/5"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ backgroundColor: club.colors.primary }}
                />
                <div className="relative z-10 flex flex-col items-center space-y-6">
                  <div 
                    className="h-20 w-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg"
                    style={{ backgroundColor: club.colors.primary }}
                  >
                    {club.shortName.substring(0, 1)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {club.nameKo}
                    </h3>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                      {club.name}
                    </p>
                  </div>
                  <div 
                    className="px-6 py-2 rounded-full text-white text-xs font-black uppercase tracking-widest shadow-md transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ backgroundColor: club.colors.primary }}
                  >
                    Enter Portal
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <footer className="pt-12 text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">
          &copy; 2026 FIPA NEWS PLATFORM
        </footer>
      </div>
    </div>
  );
}
