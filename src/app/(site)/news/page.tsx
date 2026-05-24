'use client';

import { useEffect, useMemo, useState } from 'react';
import { Lightbox } from '@/components/Lightbox';
import { SafeImg } from '@/components/SafeImg';
import { Section } from '@/components/Section';
import { t } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';
import { NEWS } from '@/lib/siteData';

export default function NewsPage() {
  const { lang } = useLang();
  const tt = (key: string, params?: Record<string, string | number>) => t(lang, key, params);

  const [lightbox, setLightbox] = useState<{ open: boolean; src?: string; alt: string }>({ open: false, alt: '' });
  const openLightbox = (src: string | undefined, alt: string) => setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox((s) => ({ ...s, open: false }));

  const [newsMetaById, setNewsMetaById] = useState<Record<string, { title?: string; image?: string }>>({});
  const sortedNews = useMemo(() => [...NEWS].sort((a, b) => (b.dateISO || '').localeCompare(a.dateISO || '')), []);
  useEffect(() => {
    let cancelled = false;
    const ids = new Set(Object.keys(newsMetaById));
    const targets = sortedNews.filter((n) => n.url && !ids.has(n.id));
    if (targets.length === 0) return;

    const run = async () => {
      for (const n of targets) {
        try {
          const res = await fetch(`/api/news/meta?url=${encodeURIComponent(n.url as string)}`);
          if (!res.ok) throw new Error('bad status');
          const data = (await res.json()) as { title?: string; image?: string };
          if (cancelled) return;
          setNewsMetaById((prev) => ({ ...prev, [n.id]: { title: data.title, image: data.image } }));
        } catch {
          if (cancelled) return;
          setNewsMetaById((prev) => ({ ...prev, [n.id]: {} }));
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [newsMetaById, sortedNews]);

  return (
    <>
      <Lightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />

      <div className="py-12 md:py-14" />

      <Section title={tt('section.news.title')} subtitle={tt('news.subtitle')}>
        <div className="space-y-4">
          {sortedNews.map((n) => {
            const meta = newsMetaById[n.id];
            const href = n.url?.trim();
            const title = (meta?.title || n.title[lang]).trim();
            const imgSrc = n.photoSrc || meta?.image;
            let host = '';
            if (href) {
              try {
                host = new URL(href).hostname.replace(/^www\./, '');
              } catch {
                host = href;
              }
            }

            return (
              <div key={n.id} className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] overflow-hidden">
                <div className="p-5 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 items-stretch">
                  <div className="shrink-0 text-sm text-[#486449] tabular-nums md:w-28">{n.dateISO}</div>

                  <div className="min-w-0 flex-1">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-xl font-semibold text-[#274126] hover:underline underline-offset-4 truncate"
                        title={title}
                      >
                        {title}
                      </a>
                    ) : (
                      <div className="text-xl font-semibold text-[#274126] truncate" title={title}>
                        {title}
                      </div>
                    )}

                    {href ? (
                      <div className="mt-2 text-sm text-[#486449] truncate" title={href}>
                        {host}
                      </div>
                    ) : (
                      <div className="mt-2 text-[#2f4a31] leading-relaxed max-h-14 overflow-hidden" title={n.body[lang]}>
                        {n.body[lang]}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 md:w-56">
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer" className="block">
                        <SafeImg
                          src={imgSrc}
                          alt={title}
                          placeholderLabel="News"
                          className="w-full h-36 md:h-28 object-cover rounded-xl border border-[#d5e6c3]"
                        />
                      </a>
                    ) : (
                      <SafeImg
                        src={imgSrc}
                        alt={title}
                        placeholderLabel="News"
                        className="w-full h-36 md:h-28 object-cover rounded-xl border border-[#d5e6c3] cursor-zoom-in"
                        onClick={() => openLightbox(imgSrc, title)}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="py-12 md:py-14" />
    </>
  );
}
