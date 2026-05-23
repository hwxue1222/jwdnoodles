'use client';

import { Lang, LANG_LABEL } from '@/lib/i18n';

export function LanguageSwitcher({
  lang,
  onChange,
  className,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
  className?: string;
}) {
  return (
    <select
      value={lang}
      onChange={(e) => onChange(e.target.value as Lang)}
      className={`h-11 px-3 rounded-full border border-[#3b5b3e] bg-[#f7faf1] text-[#2f4a31] hover:bg-white transition ${className ?? ''}`}
      aria-label="Language"
    >
      <option value="zh">{LANG_LABEL.zh}</option>
      <option value="en">{LANG_LABEL.en}</option>
      <option value="ms">{LANG_LABEL.ms}</option>
    </select>
  );
}

