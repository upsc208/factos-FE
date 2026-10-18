'use client';

import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="dark-mode-toggle"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="
        fixed bottom-6 right-6 z-[999]
        w-14 h-14
        flex items-center justify-center
        rounded-full
        bg-gray-900 dark:bg-[#111318]
        text-white dark:text-volt
        shadow-2xl shadow-black/20 dark:shadow-black/50
        border border-white/10 dark:border-volt/15
        backdrop-blur-sm
        hover:scale-110 active:scale-95
        transition-all duration-300 ease-out
        group
        cursor-pointer
      "
    >
      {/* Sun icon - shown in dark mode */}
      <Sun
        size={22}
        className={`
          absolute transition-all duration-500 ease-out
          ${theme === 'dark'
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 rotate-90 scale-0'
          }
        `}
        strokeWidth={2.5}
      />
      {/* Moon icon - shown in light mode */}
      <Moon
        size={22}
        className={`
          absolute transition-all duration-500 ease-out
          ${theme === 'light'
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-0'
          }
        `}
        strokeWidth={2.5}
      />

      {/* Glow ring on hover */}
      <div className="
        absolute inset-0 rounded-full
        bg-gradient-to-br from-amber-400/0 to-purple-500/0
        group-hover:from-amber-400/20 group-hover:to-purple-500/20
        dark:group-hover:from-volt/20 dark:group-hover:to-volt/5
        transition-all duration-500
      " />
    </button>
  );
}
