'use client';

import { useState } from 'react';
import Image, { StaticImageData } from 'next/image';

interface TributeBadgeProps {
  image: StaticImageData | string;
  name: string;
  subText: string;
  number?: string;
  stats: {
    label: string;
    value: string | number;
  }[];
}

export default function TributeBadge({ image, name, subText, number, stats }: TributeBadgeProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    // Only toggle flip state on mobile (touch devices)
    // Desktop will rely on CSS hover
    if (window.innerWidth < 768) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div
      className="relative group cursor-pointer w-40 md:w-40 h-12 md:h-14 [perspective:1000px] shrink-0"
      onClick={handleFlip}
    >
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''} md:group-hover:[transform:rotateY(180deg)] md:group-hover:!rotate-y-180`}>
        {/* Front: Image + Text */}
        <div className="absolute inset-0 [backface-visibility:hidden] flex items-center gap-3 bg-white dark:bg-[#0a0b10] px-3 rounded-2xl border border-gray-100 dark:border-volt/10 shadow-sm transition-all md:group-hover:border-primary/20 dark:md:group-hover:border-volt/15">
          <div className="relative h-11 w-11 transition-all duration-500 shrink-0">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none md:group-hover:text-primary dark:md:group-hover:text-volt transition-colors">
              {subText}
            </span>
            <span className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mt-1 whitespace-nowrap">
              {name} {number && <span className="text-blue-700 dark:text-volt italic">#{number}</span>}
            </span>
          </div>
        </div>

        {/* Back: Stats */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-primary dark:bg-[#0a0b10] dark:border dark:border-volt/20 rounded-2xl flex items-center justify-around px-2 text-white dark:text-volt shadow-lg">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-black opacity-80 dark:opacity-60 dark:text-gray-300 uppercase tracking-widest">{stat.label}</span>
                <span className="text-base font-black tracking-tighter text-white dark:text-volt">{stat.value}</span>
              </div>
              {idx < stats.length - 1 && <div className="w-px h-6 bg-white/20 dark:bg-volt/20 ml-2"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
