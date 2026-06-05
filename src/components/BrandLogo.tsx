'use client';

import { SafeImg } from '@/components/SafeImg';

export function BrandLogo({
  className,
  iconClassName,
  textClassName,
}: {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-3 min-w-0 ${className ?? ''}`}>
      <SafeImg
        src="/images/brand/icon.png"
        alt="JWD icon"
        className={`h-11 w-11 rounded-xl border border-[#c7d8b5] bg-white object-contain p-1 ${iconClassName ?? ''}`}
      />
      <div className={`min-w-0 ${textClassName ?? ''}`}>
        <div className="flex items-center gap-2 min-w-0">
          <SafeImg
            src="/images/brand/zh.png"
            alt="金味德"
            className="h-6 w-auto max-w-[140px] object-contain"
          />
          <SafeImg src="/images/brand/en.png" alt="JWD" className="h-6 w-auto max-w-[88px] object-contain" />
        </div>
        <div className="mt-0.5 text-xs tracking-wide text-[#3b5b3e] truncate">Lanzhou China Muslim Specialties</div>
      </div>
    </div>
  );
}

