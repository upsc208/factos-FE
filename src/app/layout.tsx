import type { Metadata } from "next";
import { Bebas_Neue, Kanit, Great_Vibes } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import DarkModeToggle from "@/components/DarkModeToggle";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fipa-news.kr'),
  title: {
    default: "Factos 👍 👀 | 해외 축구 뉴스 플랫폼",
    template: "%s | FIPA NEWS"
  },
  description: "글로벌 축구 팬들을 위한 최신 뉴스, 경기 정보 및 분석 플랫폼.",
  other: {
    referrer: 'no-referrer',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${bebasNeue.variable} ${kanit.variable} ${greatVibes.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0a0b10] text-gray-950 dark:text-gray-100 font-sans overflow-x-hidden transition-colors duration-300 dark-geo-pattern antialiased">
        <ThemeProvider>
          {children}
          <Analytics />
          <SpeedInsights />
          <DarkModeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
