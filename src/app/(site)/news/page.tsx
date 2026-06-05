'use client';

import { useMemo, useState } from 'react';
import { Lightbox } from '@/components/Lightbox';
import { SafeImg } from '@/components/SafeImg';
import { Section } from '@/components/Section';
import { t } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';
import { NEWS } from '@/lib/siteData';

export default function NewsPage() {
  const { lang } = useLang();
  const tt = (key: string, params?: Record<string, string | number>) => t(lang, key, params);

  const [lightbox, setLightbox] = useState<{
    open: boolean;
    type: 'image' | 'video';
    src?: string;
    posterSrc?: string;
    alt: string;
  }>({ open: false, type: 'image', alt: '' });
  const openLightboxImage = (src: string | undefined, alt: string) => setLightbox({ open: true, type: 'image', src, alt });
  const openLightboxVideo = (src: string | undefined, alt: string, posterSrc?: string) =>
    setLightbox({ open: true, type: 'video', src, posterSrc, alt });
  const closeLightbox = () => setLightbox((s) => ({ ...s, open: false }));

  const sortedNews = useMemo(() => [...NEWS].sort((a, b) => (b.dateISO || '').localeCompare(a.dateISO || '')), []);

  return (
    <>
      <Lightbox
        open={lightbox.open}
        type={lightbox.type}
        src={lightbox.src}
        posterSrc={lightbox.posterSrc}
        alt={lightbox.alt}
        onClose={closeLightbox}
      />

      <div className="py-12 md:py-14" />

      <Section title={tt('section.news.title')} subtitle={tt('news.subtitle')}>
        <div className="space-y-4">
          {sortedNews.map((n) => {
            const href = n.url?.trim();
            const title = n.title[lang].trim();
            const imgSrc = n.photoSrc;
            const videoSrc = n.videoSrc?.trim();
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
                  <div className="hidden md:block shrink-0 text-sm text-[#486449] tabular-nums md:w-28">{n.dateISO}</div>

                  <div className="min-w-0 flex-1">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-xl font-semibold text-[#274126] hover:underline underline-offset-4 whitespace-normal break-words"
                        title={title}
                      >
                        {title}
                      </a>
                    ) : (
                      <div className="text-xl font-semibold text-[#274126] whitespace-normal break-words" title={title}>
                        {title}
                      </div>
                    )}

                    <div className="mt-2 text-sm text-[#486449] tabular-nums md:hidden">{n.dateISO}</div>

                    {href ? (
                      <div className="mt-1 md:mt-2 text-sm text-[#486449] truncate" title={href}>
                        {host}
                      </div>
                    ) : (
                      <div className="mt-2 text-[#2f4a31] leading-relaxed" title={n.body[lang]}>
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
                    ) : videoSrc ? (
                      <div className="relative">
                        <div
                          className="w-full h-36 md:h-28 rounded-xl border border-[#d5e6c3] overflow-hidden bg-[#edf4e5] cursor-pointer"
                          onClick={() => openLightboxVideo(videoSrc, title)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') openLightboxVideo(videoSrc, title);
                          }}
                        >
                          <video
                            preload="metadata"
                            muted
                            playsInline
                            className="w-full h-full object-cover pointer-events-none"
                          >
                            <source src={videoSrc} type="video/mp4" />
                          </video>
                        </div>
                        <button
                          type="button"
                          aria-label="Play"
                          className="absolute inset-0 flex items-center justify-center"
                          onClick={() => openLightboxVideo(videoSrc, title)}
                        >
                          <span className="h-12 w-12 rounded-full bg-black/40 text-white flex items-center justify-center text-lg">
                            ▶
                          </span>
                        </button>
                      </div>
                    ) : (
                      <SafeImg
                        src={imgSrc}
                        alt={title}
                        placeholderLabel="News"
                        className="w-full h-36 md:h-28 object-cover rounded-xl border border-[#d5e6c3] cursor-zoom-in"
                        onClick={() => openLightboxImage(imgSrc, title)}
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
