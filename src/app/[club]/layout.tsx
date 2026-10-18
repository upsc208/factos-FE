import Header from "@/components/Header";
import { CLUBS } from "@/config/clubs";
import { notFound } from "next/navigation";

export default async function ClubLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ club: string }>;
}) {
  const { club: clubId } = await params;
  const club = CLUBS[clubId];

  if (!club) {
    notFound();
  }

  const isChelsea = club.id === 'chelsea';
  const isLiverpool = club.id === 'liverpool';
  const isArsenal = club.id === 'arsenal';
  const isTottenham = club.id === 'tottenham';
  const isManCity = club.id === 'mancity';
  const isManUtd = club.id === 'manutd';

  const lightBg = isChelsea
    ? '#f0f4fa'
    : isLiverpool
      ? '#faf0f1'
      : isArsenal
        ? '#faf9f9'
        : isManCity
          ? '#f0f9ff'
          : isTottenham
            ? '#f8fafc'
            : '#f9fafb';

  const darkBg = isChelsea
    ? '#080e1a'
    : isLiverpool
      ? '#140809'
      : isArsenal
        ? '#0f0202'
        : isManCity
          ? '#081629'
          : isTottenham
            ? '#050814'
            : '#0a0b10';

  // Dynamic footer colors
  const footerBg = (isManUtd || isManCity)
    ? '#ffffff'
    : isArsenal
      ? 'var(--arsenal-top-bar-bg)'
      : isLiverpool
        ? '#C8102E'
        : isChelsea
          ? '#034694'
          : isTottenham
            ? '#132257'
            : '#1a1a1a';

  const footerText = isManUtd
    ? '#111318'
    : isManCity
      ? '#1C2C5B'
      : isArsenal
        ? '#EF0107'
        : '#ffffff';

  const footerMuted = isManUtd
    ? 'rgba(17, 19, 24, 0.6)'
    : isManCity
      ? 'rgba(28, 44, 91, 0.7)'
      : isArsenal
        ? 'rgba(239, 1, 7, 0.7)'
        : 'rgba(255, 255, 255, 0.7)';

  const footerAccent = isManUtd
    ? 'rgba(17, 19, 24, 0.4)'
    : isManCity
      ? 'rgba(28, 44, 91, 0.5)'
      : isArsenal
        ? 'rgba(239, 1, 7, 0.5)'
        : 'rgba(255, 255, 255, 0.4)';

  const footerBorder = (isManUtd || isManCity)
    ? `1px solid ${isManCity ? 'rgba(28, 44, 91, 0.1)' : 'rgba(17, 19, 24, 0.08)'}`
    : isArsenal
      ? '1px solid rgba(239, 1, 7, 0.15)'
      : 'none';

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-500 bg-background pattern-${club.design.patternType}`}>
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --primary: ${club.colors.primary};
          --secondary: ${club.colors.secondary};
          --accent: ${club.colors.accent};
          --volt: ${club.colors.darkAccent};
          --background: ${lightBg};
          --manutd-card-bg: linear-gradient(135deg, #b91c1c 0%, #da291c 50%, #80120d 100%);
          --manutd-stripe-bg: #DA291C;
          --primary-glow: ${club.colors.primary}05;
          --primary-border-glow: ${club.colors.primary}10;
          --primary-border-glow-20: ${club.colors.primary}20;
          --footer-bg: ${footerBg};
          --footer-text: ${footerText};
          --footer-muted: ${footerMuted};
          --footer-accent: ${footerAccent};
          --footer-border: ${footerBorder};
        }
        .dark {
          --background: ${darkBg};
          ${isManUtd ? `
            --primary: #E5B824;
            --secondary: #1072E5;
            --accent: #E5B824;
            --volt: #E5B824;
            --background: #121316;
            --surface: #18191D;
            --surface-secondary: #1E2026;
            --surface-tertiary: #252830;
            --manutd-card-bg: linear-gradient(135deg, #18191D 0%, #121316 100%);
            --manutd-stripe-bg: #121316;
            --border-color: rgba(229, 184, 36, 0.15);
            --border-light: rgba(16, 114, 229, 0.15);
            --text-primary: #F8F9FA;
            --text-secondary: #A0A5B5;
            --text-tertiary: #707585;
            --text-muted: #4A4E5A;
            --primary-glow: rgba(229, 184, 36, 0.02);
            --primary-border-glow: rgba(229, 184, 36, 0.08);
            --primary-border-glow-20: rgba(229, 184, 36, 0.15);
            --footer-bg: #000000;
            --footer-text: #F8F9FA;
            --footer-muted: #A0A5B5;
            --footer-accent: #707585;
            --footer-border: 1px solid rgba(229, 184, 36, 0.15);
          ` : `
            --primary-glow: ${club.colors.primary}08;
            --primary-border-glow: ${club.colors.primary}15;
            --primary-border-glow-20: ${club.colors.primary}25;
          `}
        }
      `}} />

      <Header clubId={clubId} />

      {club.id === 'manutd' && <div className="pattern-dots-glow" />}

      <main className="flex-grow relative z-10">
        {children}
      </main>

      <footer
        className="py-12 relative z-10 transition-colors duration-500"
        style={{
          backgroundColor: 'var(--footer-bg)',
          borderTop: 'var(--footer-border)'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="text-center">
              <p className="text-sm font-bold mb-1 transition-colors duration-500" style={{ color: 'var(--footer-text)' }}>
                Factos 👍 👀 | 해외 축구 뉴스 플랫폼
              </p>
              <p className="text-xs transition-colors duration-500" style={{ color: 'var(--footer-muted)' }} suppressHydrationWarning>
                &copy; {new Date().getFullYear()} Factos News. All rights reserved.
              </p>
            </div>
            <p className="text-[11px] italic transition-colors duration-500" style={{ color: 'var(--footer-accent)' }}>
              &quot;본 사이트는 해외 축구 비공식 팬 페이지입니다.&quot;
            </p>
          </div>
        </div>
      </footer>
    </div>
  );


}
