'use client';

import { Lang, LANG_LABEL } from '@/lib/i18n';

export function LanguageSwitcher({
  lang,
  onChange,
  className,
  compact,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
  className?: string;
  compact?: boolean;
}) {
  const labels = compact
    ? ({ zh: '中', en: 'EN', ms: 'BM' } as const satisfies Record<Lang, string>)
    : LANG_LABEL;
  return (
    <select
      value={lang}
      onChange={(e) => onChange(e.target.value as Lang)}
      className={`h-9 w-16 px-2 text-xs rounded-full border border-[#3b5b3e] bg-[#f7faf1] text-[#2f4a31] hover:bg-white transition md:h-11 md:w-auto md:px-3 md:text-sm ${className ?? ''}`}
      aria-label="Language"
    >
      <option value="zh">{labels.zh}</option>
      <option value="en">{labels.en}</option>
      <option value="ms">{labels.ms}</option>
    </select>
  );
}
