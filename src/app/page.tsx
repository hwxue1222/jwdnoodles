'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Lightbox } from '@/components/Lightbox';
import { SafeImg } from '@/components/SafeImg';
import { SiteShell } from '@/components/SiteShell';
import { SocialLinks } from '@/components/SocialLinks';
import { t } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';
import { BRAND } from '@/lib/siteData';

export default function HomePage() {
  const { lang } = useLang();
  const tt = (key: string, params?: Record<string, string | number>) => t(lang, key, params);

  const [lightbox, setLightbox] = useState<{ open: boolean; src?: string; alt: string }>({ open: false, alt: '' });
  const openLightbox = (src: string | undefined, alt: string) => setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox((s) => ({ ...s, open: false }));

  return (
    <SiteShell>
      <Lightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c7d8b5] bg-[#f7faf1] text-[#2f4a31] text-sm">
              <span className="h-2 w-2 rounded-full bg-[#3b5b3e]" />
              {BRAND.tagline[lang]}
            </div>
            <h1 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-[#213821]">{tt('hero.title')}</h1>
            <p className="mt-4 text-[#486449] text-base md:text-lg leading-relaxed">{tt('hero.subtitle')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="h-11 px-5 rounded-full bg-[#3b5b3e] text-white hover:bg-[#2f4a31] transition inline-flex items-center justify-center"
              >
                {tt('hero.cta.menu')}
              </Link>
              <Link
                href="/reservation"
                className="h-11 px-5 rounded-full border border-[#3b5b3e] bg-[#f7faf1] text-[#2f4a31] hover:bg-white transition inline-flex items-center justify-center"
              >
                {tt('hero.cta.reserve')}
              </Link>
            </div>
            <div className="mt-8 md:hidden">
              <SocialLinks />
            </div>
          </div>

          <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-4">
            <div className="rounded-xl overflow-hidden">
              <SafeImg
                src="/images/hero/noodles.jpg"
                alt="Hero"
                className="w-full h-[320px] md:h-[420px] object-cover cursor-zoom-in"
                onClick={() => openLightbox('/images/hero/noodles.jpg', 'Hero')}
              />
            </div>
            <p className="mt-3 text-sm text-[#486449]">{tt('menu.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/about" className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6 hover:bg-white transition">
            <div className="text-[#274126] font-semibold">{tt('nav.about')}</div>
            <div className="mt-2 text-sm text-[#486449]">{tt('section.about.title')}</div>
          </Link>
          <Link href="/stores" className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6 hover:bg-white transition">
            <div className="text-[#274126] font-semibold">{tt('nav.stores')}</div>
            <div className="mt-2 text-sm text-[#486449]">{tt('section.stores.subtitle')}</div>
          </Link>
          <Link href="/contact" className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6 hover:bg-white transition">
            <div className="text-[#274126] font-semibold">{tt('nav.contact')}</div>
            <div className="mt-2 text-sm text-[#486449]">{tt('contact.subtitle')}</div>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
