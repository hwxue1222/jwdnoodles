'use client';

import { useState } from 'react';
import { Lightbox } from '@/components/Lightbox';
import { SafeImg } from '@/components/SafeImg';
import { Section } from '@/components/Section';
import { t } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';

const ABOUT_GALLERY = [
  '/images/gallery/1.jpg',
  '/images/gallery/2.jpg',
  '/images/gallery/3.jpg',
  '/images/gallery/4.jpg',
  '/images/gallery/5.jpg',
  '/images/gallery/6.jpg',
] as const;

export default function AboutPage() {
  const { lang } = useLang();
  const tt = (key: string, params?: Record<string, string | number>) => t(lang, key, params);

  const [lightbox, setLightbox] = useState<{ open: boolean; src?: string; alt: string }>({ open: false, alt: '' });
  const openLightbox = (src: string | undefined, alt: string) => setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox((s) => ({ ...s, open: false }));

  return (
    <>
      <Lightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />

      <div className="py-12 md:py-14" />

      <Section title={tt('section.about.title')}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6 text-[#2f4a31] leading-relaxed">
            <p>{tt('section.about.p1')}</p>
            <p className="mt-4">{tt('section.about.p2')}</p>
          </div>
          <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6">
            <div className="rounded-xl overflow-hidden border border-[#d5e6c3] bg-[#edf4e5]">
              <div className="relative w-full aspect-[16/9]">
                <video
                  className="absolute inset-0 w-full h-full object-contain"
                  src="/videos/about.mp4"
                  controls
                  playsInline
                  preload="auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6">
            <div className="text-lg font-semibold text-[#274126]">{tt('hero.title')}</div>
            <p className="mt-3 text-[#2f4a31] leading-relaxed whitespace-pre-line">{tt('hero.subtitle')}</p>
          </div>
          <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-4">
            <div className="rounded-xl overflow-hidden">
              <SafeImg
                src="/images/hero/noodles.jpg"
                alt="Lanzhou noodles"
                className="w-full h-[260px] md:h-[320px] object-cover cursor-zoom-in"
                onClick={() => openLightbox('/images/hero/noodles.jpg', 'Lanzhou noodles')}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ABOUT_GALLERY.map((src, i) => (
              <button
                key={src}
                type="button"
                className="rounded-xl overflow-hidden border border-[#d5e6c3] bg-[#edf4e5] cursor-zoom-in"
                onClick={() => openLightbox(src, `Gallery ${i + 1}`)}
              >
                <SafeImg src={src} alt={`Gallery ${i + 1}`} className="w-full aspect-square object-cover" placeholderLabel={null} />
              </button>
            ))}
          </div>
        </div>
      </Section>

      <div className="py-12 md:py-14" />
    </>
  );
}
