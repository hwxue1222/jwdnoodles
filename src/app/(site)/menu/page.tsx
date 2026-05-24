'use client';

import { useMemo, useState } from 'react';
import { Lightbox } from '@/components/Lightbox';
import { SafeImg } from '@/components/SafeImg';
import { Section } from '@/components/Section';
import { t } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';
import { BRAND, MENU, MENU_PAGES } from '@/lib/siteData';

const MENU_CATEGORY_KEY = 'lanzhou:menu:categoryId';

export default function MenuPage() {
  const { lang } = useLang();
  const tt = (key: string, params?: Record<string, string | number>) => t(lang, key, params);

  const [lightbox, setLightbox] = useState<{ open: boolean; src?: string; alt: string }>({ open: false, alt: '' });
  const openLightbox = (src: string | undefined, alt: string) => setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox((s) => ({ ...s, open: false }));

  const [menuCategoryId, setMenuCategoryId] = useState(() => {
    const fallback = MENU[0]?.id ?? '';
    if (typeof window === 'undefined') return fallback;
    return localStorage.getItem(MENU_CATEGORY_KEY) ?? fallback;
  });

  const menuCategoriesToShow = useMemo(() => {
    if (!menuCategoryId) return MENU;
    const found = MENU.find((c) => c.id === menuCategoryId);
    return found ? [found] : MENU;
  }, [menuCategoryId]);

  const menuCatCode = (catTitle: string) => {
    const m = catTitle.match(/[A-Z]\./);
    return m ? m[0].slice(0, 1) : catTitle.slice(0, 1);
  };

  const onPickMenuCategory = (nextId: string) => {
    setMenuCategoryId(nextId);
    try {
      localStorage.setItem(MENU_CATEGORY_KEY, nextId);
    } catch {}
  };

  return (
    <>
      <Lightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />

      <div className="py-12 md:py-14" />

      <Section title={tt('section.menu.title')} subtitle={tt('menu.subtitle')}>
        <div className="rounded-2xl border border-[#c7d8b5] bg-[#edf4e5] overflow-hidden">
          <div className="px-6 py-6 border-b border-[#c7d8b5] bg-[#f7faf1]">
            <div className="text-2xl font-semibold text-[#274126]">{BRAND.name}</div>
            <div className="mt-1 text-[#486449]">{BRAND.tagline[lang]}</div>
          </div>

          <div className="p-6 space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MENU_PAGES.map((p) => (
                <button
                  key={p.src}
                  type="button"
                  className="text-left rounded-xl border border-[#d5e6c3] bg-white/60 hover:bg-white transition overflow-hidden"
                  onClick={() => openLightbox(p.src, p.label[lang])}
                >
                  <SafeImg src={p.src} alt={p.label[lang]} className="w-full h-36 object-cover" />
                  <div className="px-3 py-2 text-xs text-[#486449]">{p.label[lang]}</div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {MENU.map((cat) => {
                const code = menuCatCode(cat.title.en);
                const active = cat.id === menuCategoryId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    title={cat.title[lang]}
                    onClick={() => onPickMenuCategory(cat.id)}
                    className={[
                      'shrink-0 h-9 min-w-9 px-3 rounded-full border text-sm font-semibold transition',
                      active ? 'bg-[#3b5b3e] text-white border-[#3b5b3e]' : 'bg-white/70 text-[#2f4a31] border-[#c7d8b5] hover:bg-white',
                    ].join(' ')}
                  >
                    {code}
                  </button>
                );
              })}
            </div>

            {menuCategoriesToShow.map((cat) => (
              <div key={cat.id}>
                <div className="text-xl font-semibold text-[#2f4a31]">{cat.title[lang]}</div>
                {cat.subtitle ? <div className="mt-1 text-sm text-[#486449]">{cat.subtitle[lang]}</div> : null}
                <div className="mt-4 divide-y divide-[#c7d8b5] border-t border-[#c7d8b5]">
                  {cat.items.map((item) => {
                    const dishSrc = item.photoSrc ?? `/images/dishes/${item.code}.jpg`;
                    return (
                      <div key={item.id} className="py-5 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm tracking-wide text-[#486449]">{item.code}</div>
                              <div className="mt-1 text-lg font-semibold text-[#274126] truncate" title={item.name.ms}>
                                {item.name.ms}
                              </div>
                            </div>
                            <div className="shrink-0 text-[#2f4a31] font-semibold tabular-nums">
                              {item.priceText?.[lang]
                                ? item.priceText[lang]
                                : typeof item.priceMYR === 'number'
                                  ? tt('menu.price', { value: item.priceMYR.toFixed(2) })
                                  : ''}
                            </div>
                          </div>
                          {item.desc[lang] ? <div className="mt-2 text-[#486449]">{item.desc[lang]}</div> : null}
                          <div className="mt-2 text-sm text-[#486449]">
                            <div className="truncate" title={item.name.en}>
                              {item.name.en}
                            </div>
                            <div className="truncate" title={item.name.zh}>
                              {item.name.zh}
                            </div>
                          </div>
                        </div>
                        <div className="flex md:justify-end">
                          <SafeImg
                            src={dishSrc}
                            alt={item.name.ms}
                            placeholderLabel={null}
                            className="w-full md:w-44 h-32 object-cover rounded-xl border border-[#d5e6c3] cursor-zoom-in bg-[#edf4e5]"
                            onClick={() => openLightbox(dishSrc, item.name.ms)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="py-12 md:py-14" />
    </>
  );
}

