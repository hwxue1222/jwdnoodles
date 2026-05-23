'use client';

import { useEffect, useMemo, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Lightbox } from '@/components/Lightbox';
import { SafeImg } from '@/components/SafeImg';
import { SocialLinks } from '@/components/SocialLinks';
import { WorldMap } from '@/components/WorldMap';
import { t } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';
import { BRAND, CONTACT, GLOBAL_LOCATIONS, MENU, MENU_PAGES, NEWS, STORES, Store } from '@/lib/siteData';

const RESERVATION_STORE_KEY = 'lanzhou:reservation:storeId';

function mapEmbedUrl(store: Store) {
  return `https://www.google.com/maps?q=${encodeURIComponent(store.map.placeQuery)}&output=embed`;
}

function mapOpenUrl(store: Store) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.map.placeQuery)}`;
}

function toWhatsAppPhone(raw: string | undefined) {
  if (!raw) return '';
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';
  if (trimmed.startsWith('+0')) return `60${digits.slice(1)}`;
  if (trimmed.startsWith('0')) return `60${digits.slice(1)}`;
  return digits;
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#274126]">{title}</h2>
            {subtitle ? <p className="mt-2 text-[#486449]">{subtitle}</p> : null}
          </div>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

export default function Home() {
  const { lang, setLang, ready } = useLang();
  const tt = (key: string, params?: Record<string, string | number>) => t(lang, key, params);

  const [lightbox, setLightbox] = useState<{ open: boolean; src?: string; alt: string }>({ open: false, alt: '' });

  const openLightbox = (src: string | undefined, alt: string) => setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox((s) => ({ ...s, open: false }));

  const reservableStores = useMemo(() => STORES.filter((s) => s.acceptsReservation), []);
  const defaultStoreId = reservableStores[0]?.id ?? '';
  const [reservationStoreId, setReservationStoreId] = useState(defaultStoreId);
  const [reservationName, setReservationName] = useState('');
  const [reservationPhone, setReservationPhone] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [reservationPax, setReservationPax] = useState('2');
  const [reservationNote, setReservationNote] = useState('');

  useEffect(() => {
    if (!ready) return;
    const saved = localStorage.getItem(RESERVATION_STORE_KEY);
    const next = reservableStores.some((s) => s.id === saved) ? (saved as string) : defaultStoreId;
    setReservationStoreId(next);
  }, [ready, defaultStoreId, reservableStores]);

  useEffect(() => {
    if (!ready) return;
    if (!reservationStoreId) return;
    localStorage.setItem(RESERVATION_STORE_KEY, reservationStoreId);
  }, [reservationStoreId, ready]);

  const reservationStore = reservableStores.find((s) => s.id === reservationStoreId) ?? reservableStores[0];

  const onSubmitReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationStore) return;

    const parts = [
      `${BRAND.chineseName} / ${BRAND.name}`,
      `${tt('reservation.store')}: ${reservationStore.name[lang]}`,
      `${tt('reservation.name')}: ${reservationName}`,
      `${tt('reservation.phone')}: ${reservationPhone}`,
      `${tt('reservation.date')}: ${reservationDate || '-'}`,
      `${tt('reservation.time')}: ${reservationTime || '-'}`,
      `${tt('reservation.pax')}: ${reservationPax}`,
      reservationNote.trim() ? `${tt('reservation.note')}: ${reservationNote.trim()}` : null,
    ].filter(Boolean);

    const msg = parts.join('\n');
    const storePhone = toWhatsAppPhone(reservationStore.reservationWhatsAppPhone ?? CONTACT.phone);
    const whatsappUrl = storePhone
      ? `https://wa.me/${storePhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#e8f2dd] text-[#1c2a1c]">
      <Lightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />

      <header className="sticky top-0 z-40 border-b border-[#c7d8b5] bg-[#f7faf1]/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-3">
          <a href="#top" className="min-w-0">
            <BrandLogo />
          </a>

          <nav className="hidden lg:flex items-center gap-5 text-sm text-[#2f4a31]">
            <a className="hover:underline underline-offset-4" href="#about">
              {tt('nav.about')}
            </a>
            <a className="hover:underline underline-offset-4" href="#stores">
              {tt('nav.stores')}
            </a>
            <a className="hover:underline underline-offset-4" href="#menu">
              {tt('nav.menu')}
            </a>
            <a className="hover:underline underline-offset-4" href="#halal">
              {tt('nav.halal')}
            </a>
            <a className="hover:underline underline-offset-4" href="#news">
              {tt('nav.news')}
            </a>
            <a className="hover:underline underline-offset-4" href="#reservation">
              {tt('nav.reservation')}
            </a>
            <a className="hover:underline underline-offset-4" href="#contact">
              {tt('nav.contact')}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <SocialLinks />
            </div>
            <LanguageSwitcher lang={lang} onChange={setLang} />
          </div>
        </div>
        <div className="lg:hidden px-4 md:px-8 pb-3">
          <div className="flex items-center gap-3 overflow-x-auto text-sm text-[#2f4a31]">
            <a className="whitespace-nowrap hover:underline underline-offset-4" href="#about">
              {tt('nav.about')}
            </a>
            <a className="whitespace-nowrap hover:underline underline-offset-4" href="#stores">
              {tt('nav.stores')}
            </a>
            <a className="whitespace-nowrap hover:underline underline-offset-4" href="#menu">
              {tt('nav.menu')}
            </a>
            <a className="whitespace-nowrap hover:underline underline-offset-4" href="#halal">
              {tt('nav.halal')}
            </a>
            <a className="whitespace-nowrap hover:underline underline-offset-4" href="#news">
              {tt('nav.news')}
            </a>
            <a className="whitespace-nowrap hover:underline underline-offset-4" href="#reservation">
              {tt('nav.reservation')}
            </a>
            <a className="whitespace-nowrap hover:underline underline-offset-4" href="#contact">
              {tt('nav.contact')}
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c7d8b5] bg-[#f7faf1] text-[#2f4a31] text-sm">
                <span className="h-2 w-2 rounded-full bg-[#3b5b3e]" />
                {BRAND.tagline[lang]}
              </div>
              <h1 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-[#213821]">
                {tt('hero.title')}
              </h1>
              <p className="mt-4 text-[#486449] text-base md:text-lg leading-relaxed">{tt('hero.subtitle')}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#menu"
                  className="h-11 px-5 rounded-full bg-[#3b5b3e] text-white hover:bg-[#2f4a31] transition inline-flex items-center justify-center"
                >
                  {tt('hero.cta.menu')}
                </a>
                <a
                  href="#reservation"
                  className="h-11 px-5 rounded-full border border-[#3b5b3e] bg-[#f7faf1] text-[#2f4a31] hover:bg-white transition inline-flex items-center justify-center"
                >
                  {tt('hero.cta.reserve')}
                </a>
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

        <Section id="about" title={tt('section.about.title')}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6 text-[#2f4a31] leading-relaxed">
              <p>{tt('section.about.p1')}</p>
              <p className="mt-4">{tt('section.about.p2')}</p>
            </div>
            <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6">
              <div className="grid grid-cols-2 gap-4">
                <SafeImg
                  src="/images/gallery/1.jpg"
                  alt="Gallery 1"
                  className="w-full h-40 object-cover rounded-xl border border-[#d5e6c3] cursor-zoom-in"
                  onClick={() => openLightbox('/images/gallery/1.jpg', 'Gallery 1')}
                />
                <SafeImg
                  src="/images/gallery/2.jpg"
                  alt="Gallery 2"
                  className="w-full h-40 object-cover rounded-xl border border-[#d5e6c3] cursor-zoom-in"
                  onClick={() => openLightbox('/images/gallery/2.jpg', 'Gallery 2')}
                />
                <SafeImg
                  src="/images/gallery/3.jpg"
                  alt="Gallery 3"
                  className="w-full h-40 object-cover rounded-xl border border-[#d5e6c3] cursor-zoom-in"
                  onClick={() => openLightbox('/images/gallery/3.jpg', 'Gallery 3')}
                />
                <SafeImg
                  src="/images/gallery/4.jpg"
                  alt="Gallery 4"
                  className="w-full h-40 object-cover rounded-xl border border-[#d5e6c3] cursor-zoom-in"
                  onClick={() => openLightbox('/images/gallery/4.jpg', 'Gallery 4')}
                />
              </div>
            </div>
          </div>
        </Section>

        <div className="py-12 md:py-14" />

        <Section id="global" title={tt('section.global.title')} subtitle={tt('section.global.subtitle')}>
          <WorldMap
            locations={GLOBAL_LOCATIONS.map((l) => ({
              id: l.id,
              label: l.label[lang],
              xPct: l.pin.xPct,
              yPct: l.pin.yPct,
              photoSrc: l.photoSrc,
            }))}
            onOpen={openLightbox}
          />
        </Section>

        <div className="py-12 md:py-14" />

        <Section id="stores" title={tt('section.stores.title')} subtitle={tt('section.stores.subtitle')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STORES.map((store) => (
              <div key={store.id} className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] overflow-hidden">
                <SafeImg
                  src={store.photoSrc}
                  alt={store.name[lang]}
                  className="w-full h-56 object-cover cursor-zoom-in"
                  onClick={() => openLightbox(store.photoSrc, store.name[lang])}
                />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold text-[#274126] truncate">{store.name[lang]}</h3>
                      <p className="mt-1 text-sm text-[#486449]">
                        {store.status === 'opening_soon'
                          ? tt('store.openingSoon', { date: store.openingDate[lang] })
                          : tt('store.opened', { date: store.openingDate[lang] })}
                      </p>
                      <p className="mt-3 text-[#2f4a31]">{store.address[lang]}</p>
                      {store.note ? <p className="mt-1 text-sm text-[#486449]">{store.note[lang]}</p> : null}
                      {store.hours ? (
                        <div className="mt-4 rounded-xl border border-[#d5e6c3] bg-[#edf4e5] px-4 py-3">
                          <div className="text-xs font-semibold tracking-wide text-[#486449]">{tt('store.hours')}</div>
                          <div className="mt-1 text-sm text-[#2f4a31]">{store.hours[lang]}</div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href={mapOpenUrl(store)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center h-10 px-4 rounded-full border border-[#3b5b3e] text-[#2f4a31] bg-[#edf4e5] hover:bg-white transition"
                    >
                      {tt('store.viewOnMaps')}
                    </a>
                  </div>
                  <div className="mt-5 rounded-xl overflow-hidden border border-[#d5e6c3] bg-[#edf4e5]">
                    <iframe
                      src={mapEmbedUrl(store)}
                      className="w-full h-56"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map-${store.id}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div className="py-12 md:py-14" />

        <Section id="menu" title={tt('section.menu.title')} subtitle={tt('menu.subtitle')}>
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

              {MENU.map((cat) => (
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

        <Section id="halal" title={tt('section.halal.title')}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_.9fr] gap-6">
            <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#edf4e5] border border-[#c7d8b5] text-[#2f4a31] text-sm">
                <span className="h-2 w-2 rounded-full bg-[#3b5b3e]" />
                {tt('halal.badge')}
              </div>
              <p className="mt-4 text-[#2f4a31] leading-relaxed">{tt('halal.p1')}</p>
              <p className="mt-3 text-[#486449] leading-relaxed">{tt('halal.p2')}</p>
              <div className="mt-6">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-[#3b5b3e] text-white hover:bg-[#2f4a31] transition"
                >
                  WhatsApp
                </a>
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

        <Section id="news" title={tt('section.news.title')} subtitle={tt('news.subtitle')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {NEWS.map((n) => (
              <div key={n.id} className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] overflow-hidden">
                <SafeImg
                  src={n.photoSrc}
                  alt={n.title[lang]}
                  className="w-full h-48 object-cover cursor-zoom-in"
                  onClick={() => openLightbox(n.photoSrc, n.title[lang])}
                />
                <div className="p-6">
                  <div className="text-sm text-[#486449] tabular-nums">{n.dateISO}</div>
                  <div className="mt-1 text-xl font-semibold text-[#274126]">{n.title[lang]}</div>
                  <div className="mt-3 text-[#2f4a31] leading-relaxed">{n.body[lang]}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div className="py-12 md:py-14" />

        <Section id="reservation" title={tt('section.reservation.title')} subtitle={tt('reservation.subtitle')}>
          <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6">
            <form onSubmit={onSubmitReservation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#2f4a31]">{tt('reservation.store')}</label>
                <select
                  value={reservationStoreId}
                  onChange={(e) => setReservationStoreId(e.target.value)}
                  className="mt-1 w-full h-11 px-4 rounded-xl border border-[#c7d8b5] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#3b5b3e]/30"
                  required
                >
                  {reservableStores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name[lang]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#2f4a31]">{tt('reservation.pax')}</label>
                <input
                  value={reservationPax}
                  onChange={(e) => setReservationPax(e.target.value)}
                  inputMode="numeric"
                  className="mt-1 w-full h-11 px-4 rounded-xl border border-[#c7d8b5] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#3b5b3e]/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#2f4a31]">{tt('reservation.name')}</label>
                <input
                  value={reservationName}
                  onChange={(e) => setReservationName(e.target.value)}
                  className="mt-1 w-full h-11 px-4 rounded-xl border border-[#c7d8b5] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#3b5b3e]/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#2f4a31]">{tt('reservation.phone')}</label>
                <input
                  value={reservationPhone}
                  onChange={(e) => setReservationPhone(e.target.value)}
                  className="mt-1 w-full h-11 px-4 rounded-xl border border-[#c7d8b5] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#3b5b3e]/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#2f4a31]">{tt('reservation.date')}</label>
                <input
                  type="date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="mt-1 w-full h-11 px-4 rounded-xl border border-[#c7d8b5] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#3b5b3e]/30"
                />
              </div>
              <div>
                <label className="block text-sm text-[#2f4a31]">{tt('reservation.time')}</label>
                <input
                  type="time"
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                  className="mt-1 w-full h-11 px-4 rounded-xl border border-[#c7d8b5] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#3b5b3e]/30"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[#2f4a31]">{tt('reservation.note')}</label>
                <textarea
                  value={reservationNote}
                  onChange={(e) => setReservationNote(e.target.value)}
                  placeholder={tt('reservation.placeholder.note')}
                  className="mt-1 w-full min-h-[96px] px-4 py-3 rounded-xl border border-[#c7d8b5] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#3b5b3e]/30"
                />
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-[#486449]">
                  {reservationStore?.reservationWhatsAppPhone ?? CONTACT.phone}
                </div>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-full bg-[#3b5b3e] text-white hover:bg-[#2f4a31] transition"
                >
                  {tt('reservation.submit')}
                </button>
              </div>
            </form>
          </div>
        </Section>

        <div className="py-12 md:py-14" />

        <Section id="contact" title={tt('section.contact.title')} subtitle={tt('contact.subtitle')}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6">
              <div className="grid grid-cols-1 gap-4 text-[#2f4a31]">
                <div>
                  <div className="text-sm text-[#486449]">{tt('contact.phone')}</div>
                  <div className="mt-1 font-semibold">{CONTACT.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-[#486449]">{tt('contact.email')}</div>
                  <div className="mt-1 font-semibold">{CONTACT.email}</div>
                </div>
                <div>
                  <div className="text-sm text-[#486449]">{tt('contact.address')}</div>
                  <div className="mt-1">{reservationStore?.address?.[lang] ?? STORES[0]?.address?.[lang] ?? ''}</div>
                </div>
              </div>
              <div className="mt-6">
                <div className="text-sm text-[#486449]">{tt('contact.follow')}</div>
                <div className="mt-3">
                  <SocialLinks />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6">
              <div className="text-[#274126] font-semibold">Photos</div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <SafeImg
                  src="/images/gallery/5.jpg"
                  alt="Gallery 5"
                  className="w-full h-44 object-cover rounded-xl border border-[#d5e6c3] cursor-zoom-in"
                  onClick={() => openLightbox('/images/gallery/5.jpg', 'Gallery 5')}
                />
                <SafeImg
                  src="/images/gallery/6.jpg"
                  alt="Gallery 6"
                  className="w-full h-44 object-cover rounded-xl border border-[#d5e6c3] cursor-zoom-in"
                  onClick={() => openLightbox('/images/gallery/6.jpg', 'Gallery 6')}
                />
              </div>
            </div>
          </div>
        </Section>
      </main>

      <footer className="mt-14 border-t border-[#c7d8b5] bg-[#f7faf1]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <BrandLogo />
            <div className="mt-2 text-sm text-[#486449]">{t(lang, 'footer.rights', { year: new Date().getFullYear() })}</div>
          </div>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}
