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
          <span className="inline-flex items-center rounded-md bg-[#365e66] px-2 py-1 text-[13px] sm:text-[15px] font-extrabold tracking-[0.12em] text-[#d9d27a] whitespace-nowrap">
            <span>JWD</span>
            <span className="ml-0.5 text-[0.75em] leading-none align-top">®</span>
            <span className="ml-2">MEE TARIK</span>
          </span>
        </div>
        <div className="mt-0.5 text-xs tracking-wide text-[#3b5b3e] truncate">Lanzhou China Muslim Specialties</div>
      </div>
    </div>
  );
}
