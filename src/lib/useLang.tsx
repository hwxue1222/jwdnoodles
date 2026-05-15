'use client';

import { useEffect, useMemo, useState } from 'react';
import { detectLang, Lang, LANG_STORAGE_KEY } from '@/lib/i18n';

export function useLang() {
  const [lang, setLang] = useState<Lang>('zh');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    const next: Lang =
      saved === 'zh' || saved === 'en' || saved === 'ms' ? saved : detectLang(typeof navigator === 'undefined' ? '' : navigator.language);
    setLang(next);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang, ready]);

  const locale = useMemo(() => {
    if (lang === 'zh') return 'zh-CN';
    if (lang === 'ms') return 'ms-MY';
    return 'en-US';
  }, [lang]);

  return { lang, setLang, locale, ready };
}

