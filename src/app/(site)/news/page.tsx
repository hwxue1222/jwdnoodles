'use client';

import { useEffect, useState } from 'react';
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
  useEffect(() => {
    let cancelled = false;
    const ids = new Set(Object.keys(newsMetaById));
    const targets = NEWS.filter((n) => n.url && !ids.has(n.id));
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
  }, [newsMetaById]);

  return (
    <>
      <Lightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />

      <div className="py-12 md:py-14" />

      <Section title={tt('section.news.title')} subtitle={tt('news.subtitle')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {NEWS.map((n) => (
            <div key={n.id} className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] overflow-hidden">
              {(() => {
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

                const content = (
                  <>
                    <SafeImg
                      src={imgSrc}
                      alt={title}
                      placeholderLabel="News"
                      className={`w-full h-48 object-cover ${href ? 'cursor-pointer' : 'cursor-zoom-in'}`}
                      onClick={href ? undefined : () => openLightbox(imgSrc, title)}
                    />
                    <div className="p-6">
                      <div className="text-sm text-[#486449] tabular-nums">{n.dateISO}</div>
                      <div className="mt-1 text-xl font-semibold text-[#274126]">{title}</div>
                      {href ? (
                        <div className="mt-3 text-sm text-[#486449] truncate" title={href}>
                          {host}
                        </div>
                      ) : (
                        <div className="mt-3 text-[#2f4a31] leading-relaxed">{n.body[lang]}</div>
                      )}
                    </div>
                  </>
                );

                return href ? (
                  <a href={href} target="_blank" rel="noreferrer" className="block">
                    {content}
                  </a>
                ) : (
                  content
                );
              })()}
            </div>
          ))}
        </div>
      </Section>

      <div className="py-12 md:py-14" />
    </>
  );
}

