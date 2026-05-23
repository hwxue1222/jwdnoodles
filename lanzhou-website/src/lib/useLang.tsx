'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { detectLang, Lang, LANG_STORAGE_KEY } from '@/lib/i18n';

export function useLang() {
  const lang = useSyncExternalStore<Lang>(
    (onStoreChange) => {
      window.addEventListener('storage', onStoreChange);
      window.addEventListener('lanzhou:lang', onStoreChange);
      return () => {
        window.removeEventListener('storage', onStoreChange);
        window.removeEventListener('lanzhou:lang', onStoreChange);
      };
    },
    () => {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      const next: Lang =
        saved === 'zh' || saved === 'en' || saved === 'ms' ? saved : detectLang(typeof navigator === 'undefined' ? '' : navigator.language);
      return next;
    },
    () => 'zh',
  );

  const setLang = (next: Lang) => {
    localStorage.setItem(LANG_STORAGE_KEY, next);
    window.dispatchEvent(new Event('lanzhou:lang'));
  };

  const locale = useMemo(() => {
    if (lang === 'zh') return 'zh-CN';
    if (lang === 'ms') return 'ms-MY';
    return 'en-US';
  }, [lang]);

  return { lang, setLang, locale };
}
