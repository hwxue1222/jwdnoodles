'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Lightbox } from '@/components/Lightbox';
import { SafeImg } from '@/components/SafeImg';
import { Section } from '@/components/Section';
import { t } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';

export default function HalalPage() {
  const { lang } = useLang();
  const tt = (key: string, params?: Record<string, string | number>) => t(lang, key, params);

  const [lightbox, setLightbox] = useState<{ open: boolean; src?: string; alt: string }>({ open: false, alt: '' });
  const openLightbox = (src: string | undefined, alt: string) => setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox((s) => ({ ...s, open: false }));

  return (
    <>
      <Lightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />

      <div className="py-12 md:py-14" />

      <Section title={tt('section.halal.title')}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_.9fr] gap-6">
          <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#edf4e5] border border-[#c7d8b5] text-[#2f4a31] text-sm">
              <span className="h-2 w-2 rounded-full bg-[#3b5b3e]" />
              {tt('halal.badge')}
            </div>
            <p className="mt-4 text-[#2f4a31] leading-relaxed">{tt('halal.p1')}</p>
            <p className="mt-3 text-[#486449] leading-relaxed">{tt('halal.p2')}</p>
            <div className="mt-6">
              <Link href="/contact" className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-[#3b5b3e] text-white hover:bg-[#2f4a31] transition">
                WhatsApp
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6">
            <div className="text-[#274126] font-semibold">Certificates</div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <SafeImg
                src="/images/halal/cert-1.jpg"
                alt="Certificate 1"
                className="w-full h-44 object-cover rounded-xl border border-[#d5e6c3] cursor-zoom-in"
                onClick={() => openLightbox('/images/halal/cert-1.jpg', 'Certificate 1')}
              />
              <SafeImg
                src="/images/halal/cert-2.jpg"
                alt="Certificate 2"
                className="w-full h-44 object-cover rounded-xl border border-[#d5e6c3] cursor-zoom-in"
                onClick={() => openLightbox('/images/halal/cert-2.jpg', 'Certificate 2')}
              />
            </div>
          </div>
        </div>
      </Section>

      <div className="py-12 md:py-14" />
    </>
  );
}

