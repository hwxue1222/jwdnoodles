'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Lightbox } from '@/components/Lightbox';
import { SafeImg } from '@/components/SafeImg';
import { SocialAccountsList, SocialLinks } from '@/components/SocialLinks';
import { WorldMap } from '@/components/WorldMap';
import { t } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';
import { BRAND, CONTACT, GLOBAL_LOCATIONS, HERO_SLIDES, MENU, MENU_PAGES, NEWS, STORES, Store } from '@/lib/siteData';

const RESERVATION_STORE_KEY = 'lanzhou:reservation:storeId';
const MENU_CATEGORY_KEY = 'lanzhou:menu:categoryId';

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

type Meridiem = 'AM' | 'PM';

function formatTime12Input(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (!digits) return '';
  if (digits.length <= 2) return digits;
  const hh = digits.length === 3 ? digits.slice(0, 1) : digits.slice(0, 2);
  const mm = digits.length === 3 ? digits.slice(1) : digits.slice(2);
  return `${hh.padStart(2, '0')}:${mm}`;
}

function normalizeTime12(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (!digits) return '';

  let hh = 0;
  let mm = 0;

  if (digits.length <= 2) {
    hh = Number(digits);
    mm = 0;
  } else if (digits.length === 3) {
    hh = Number(digits.slice(0, 1));
    mm = Number(digits.slice(1, 3));
  } else {
    hh = Number(digits.slice(0, 2));
    mm = Number(digits.slice(2, 4));
  }

  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return '';

  if (hh <= 0) hh = 12;
  if (hh > 12) hh = ((hh - 1) % 12) + 1;
  if (mm < 0) mm = 0;
  if (mm > 59) mm = 59;

  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
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
  const { lang, setLang } = useLang();
  const tt = (key: string, params?: Record<string, string | number>) => t(lang, key, params);

  const [heroIndex, setHeroIndex] = useState(0);
  const heroSlides = HERO_SLIDES;
  const heroSlide = heroSlides[Math.min(Math.max(heroIndex, 0), Math.max(0, heroSlides.length - 1))];
  const heroCanLeft = heroSlides.length > 1 && heroIndex > 0;
  const heroCanRight = heroSlides.length > 1 && heroIndex < heroSlides.length - 1;

  const goHeroPrev = () => {
    const len = heroSlides.length;
    if (len <= 1) return;
    setHeroIndex((i) => Math.max(0, i - 1));
  };
  const goHeroNext = () => {
    const len = heroSlides.length;
    if (len <= 1) return;
    setHeroIndex((i) => Math.min(len - 1, i + 1));
  };

  const storesCarouselRef = useRef<HTMLDivElement | null>(null);
  const [storesCanLeft, setStoresCanLeft] = useState(false);
  const [storesCanRight, setStoresCanRight] = useState(false);

  const menuPagesCarouselRef = useRef<HTMLDivElement | null>(null);
  const [menuPagesCanLeft, setMenuPagesCanLeft] = useState(false);
  const [menuPagesCanRight, setMenuPagesCanRight] = useState(false);

  const [menuCategoryId, setMenuCategoryId] = useState(() => {
    const fallback = MENU[0]?.id ?? '';
    if (typeof window === 'undefined') return fallback;
    return localStorage.getItem(MENU_CATEGORY_KEY) ?? fallback;
  });

  const [lightbox, setLightbox] = useState<{
    open: boolean;
    type: 'image' | 'video';
    src?: string;
    posterSrc?: string;
    alt: string;
  }>({ open: false, type: 'image', alt: '' });

  const openLightbox = (src: string | undefined, alt: string) => setLightbox({ open: true, type: 'image', src, alt });
  const openLightboxVideo = (src: string | undefined, alt: string, posterSrc?: string) =>
    setLightbox({ open: true, type: 'video', src, posterSrc, alt });
  const closeLightbox = () => setLightbox((s) => ({ ...s, open: false }));

  const reservableStores = useMemo(() => STORES.filter((s) => s.acceptsReservation), []);
  const defaultStoreId = reservableStores[0]?.id ?? '';
  const reservationStoreId = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') return () => {};
      window.addEventListener('storage', onStoreChange);
      window.addEventListener('lanzhou:reservation:storeId', onStoreChange);
      return () => {
        window.removeEventListener('storage', onStoreChange);
        window.removeEventListener('lanzhou:reservation:storeId', onStoreChange);
      };
    },
    () => {
      if (typeof window === 'undefined') return defaultStoreId;
      const saved = localStorage.getItem(RESERVATION_STORE_KEY);
      const next = reservableStores.some((s) => s.id === saved) ? (saved as string) : defaultStoreId;
      return next;
    },
    () => defaultStoreId,
  );

  const setReservationStoreId = (next: string) => {
    if (!next) return;
    localStorage.setItem(RESERVATION_STORE_KEY, next);
    window.dispatchEvent(new Event('lanzhou:reservation:storeId'));
  };
  const [reservationName, setReservationName] = useState('');
  const [reservationPhone, setReservationPhone] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTimeHHMM, setReservationTimeHHMM] = useState('');
  const [reservationMeridiem, setReservationMeridiem] = useState<Meridiem>('PM');
  const [reservationPax, setReservationPax] = useState('2');
  const [reservationNote, setReservationNote] = useState('');

  const reservationStore = reservableStores.find((s) => s.id === reservationStoreId) ?? reservableStores[0];

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

  const onSubmitReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationStore) return;

    const normalizedTime = normalizeTime12(reservationTimeHHMM);
    const timeText = normalizedTime ? `${normalizedTime} ${reservationMeridiem}` : '-';

    const parts = [
      'Reservation',
      `${BRAND.chineseName} / ${BRAND.name}`,
      `${tt('reservation.store')}: ${reservationStore.name[lang]}`,
      `${tt('reservation.name')}: ${reservationName}`,
      `${tt('reservation.phone')}: ${reservationPhone}`,
      `${tt('reservation.date')}: ${reservationDate || '-'}`,
      `${tt('reservation.time')}: ${timeText}`,
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

  const scrollStoresBy = (direction: -1 | 1) => {
    const el = storesCarouselRef.current;
    if (!el) return;
    const amount = Math.max(260, Math.round(el.clientWidth * 0.9));
    const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    if (!maxScrollLeft) return;
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  const scrollMenuPagesBy = (direction: -1 | 1) => {
    const el = menuPagesCarouselRef.current;
    if (!el) return;
    const amount = Math.max(240, Math.round(el.clientWidth * 0.9));
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = storesCarouselRef.current;
    if (!el) return;

    const update = () => {
      const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
      setStoresCanLeft(el.scrollLeft > 4);
      setStoresCanRight(el.scrollLeft < maxScrollLeft - 4);
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = menuPagesCarouselRef.current;
    if (!el) return;

    const update = () => {
      const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
      setMenuPagesCanLeft(el.scrollLeft > 4);
      setMenuPagesCanRight(el.scrollLeft < maxScrollLeft - 4);
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#e8f2dd] text-[#1c2a1c]">
      <Lightbox
        open={lightbox.open}
        type={lightbox.type}
        src={lightbox.src}
        posterSrc={lightbox.posterSrc}
        alt={lightbox.alt}
        onClose={closeLightbox}
      />

      <header className="sticky top-0 z-40 border-b border-[#c7d8b5] bg-[#f7faf1]/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-3">
          <a href="#top" className="min-w-0">
            <BrandLogo />
          </a>

          <nav className="hidden lg:flex items-center gap-5 text-sm text-[#2f4a31]">
            <a className="hover:underline underline-offset-4" href="#top">
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
            <LanguageSwitcher lang={lang} onChange={setLang} compact />
          </div>
        </div>
        <div className="lg:hidden px-4 md:px-8 pb-3">
          <div className="flex items-center gap-3 overflow-x-auto text-sm text-[#2f4a31]">
            <a className="whitespace-nowrap hover:underline underline-offset-4" href="#top">
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
              <div
                className="relative rounded-xl overflow-hidden"
              >
                <SafeImg
                  src={heroSlide?.src}
                  alt={heroSlide?.alt?.[lang] ?? 'Hero'}
                  placeholderLabel="Hero"
                  className="w-full h-[320px] md:h-[420px] object-cover cursor-zoom-in"
                  onClick={() => openLightbox(heroSlide?.src, heroSlide?.caption?.[lang] ?? 'Hero')}
                />
                <button
                  type="button"
                  onClick={goHeroPrev}
                  disabled={!heroCanLeft}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-[#c7d8b5] bg-[#f7faf1]/90 backdrop-blur text-[#2f4a31] hover:bg-white transition shadow-sm disabled:opacity-40 disabled:hover:bg-[#f7faf1]/90"
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goHeroNext}
                  disabled={!heroCanRight}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-[#c7d8b5] bg-[#f7faf1]/90 backdrop-blur text-[#2f4a31] hover:bg-white transition shadow-sm disabled:opacity-40 disabled:hover:bg-[#f7faf1]/90"
                  aria-label="Next photo"
                >
                  ›
                </button>
              </div>
              <p className="mt-3 text-sm text-[#486449] min-h-5 truncate" title={heroSlide?.caption?.[lang] ?? ''}>
                {heroSlide?.caption?.[lang] ? heroSlide.caption[lang] : '\u00A0'}
              </p>
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
          <div className="-mx-4 md:mx-0">
            <div className="px-4 md:px-0 flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollStoresBy(-1)}
                disabled={!storesCanLeft}
                className="shrink-0 h-11 w-11 rounded-full border border-[#c7d8b5] bg-[#f7faf1]/90 backdrop-blur text-[#2f4a31] hover:bg-white transition shadow-sm disabled:opacity-40 disabled:hover:bg-[#f7faf1]/90"
                aria-label="Scroll stores left"
              >
                ‹
              </button>

              <div
                ref={storesCarouselRef}
                className="min-w-0 flex-1 flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
              >
                {STORES.map((store) => (
                  <div
                    key={store.id}
                    className="snap-start shrink-0 w-[86vw] sm:w-[420px] max-w-[520px] rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] overflow-hidden"
                  >
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
                        <p className="mt-1 text-sm text-[#486449] min-h-5">{store.note ? store.note[lang] : '\u00A0'}</p>
                        <div className="mt-4 rounded-xl border border-[#d5e6c3] bg-[#edf4e5] px-4 py-3 min-h-[74px]">
                          <div className="text-xs font-semibold tracking-wide text-[#486449]">{tt('store.hours')}</div>
                          <div className="mt-1 text-sm text-[#2f4a31]">{store.hours ? store.hours[lang] : '\u00A0'}</div>
                        </div>
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

              <button
                type="button"
                onClick={() => scrollStoresBy(1)}
                disabled={!storesCanRight}
                className="shrink-0 h-11 w-11 rounded-full border border-[#c7d8b5] bg-[#f7faf1]/90 backdrop-blur text-[#2f4a31] hover:bg-white transition shadow-sm disabled:opacity-40 disabled:hover:bg-[#f7faf1]/90"
                aria-label="Scroll stores right"
              >
                ›
              </button>
            </div>
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
              <div className="-mx-6">
                <div className="px-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => scrollMenuPagesBy(-1)}
                    disabled={!menuPagesCanLeft}
                    className="shrink-0 h-11 w-11 rounded-full border border-[#c7d8b5] bg-[#f7faf1]/90 backdrop-blur text-[#2f4a31] hover:bg-white transition shadow-sm disabled:opacity-40 disabled:hover:bg-[#f7faf1]/90"
                    aria-label="Scroll menu pages left"
                  >
                    ‹
                  </button>

                  <div
                    ref={menuPagesCarouselRef}
                    className="min-w-0 flex-1 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
                  >
                    {MENU_PAGES.map((p) => (
                      <button
                        key={p.src}
                        type="button"
                        className="snap-start shrink-0 w-[72vw] sm:w-[340px] rounded-xl border border-[#d5e6c3] bg-white/60 hover:bg-white transition overflow-hidden text-left"
                        onClick={() => openLightbox(p.src, p.label[lang])}
                      >
                        <div className="w-full aspect-[900/651] bg-[#edf4e5]">
                          <SafeImg src={p.src} alt={p.label[lang]} className="w-full h-full object-contain" />
                        </div>
                        <div className="px-3 py-2 text-xs text-[#486449]">{p.label[lang]}</div>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollMenuPagesBy(1)}
                    disabled={!menuPagesCanRight}
                    className="shrink-0 h-11 w-11 rounded-full border border-[#c7d8b5] bg-[#f7faf1]/90 backdrop-blur text-[#2f4a31] hover:bg-white transition shadow-sm disabled:opacity-40 disabled:hover:bg-[#f7faf1]/90"
                    aria-label="Scroll menu pages right"
                  >
                    ›
                  </button>
                </div>
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
                        active
                          ? 'bg-[#3b5b3e] text-white border-[#3b5b3e]'
                          : 'bg-white/70 text-[#2f4a31] border-[#c7d8b5] hover:bg-white',
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
          <div className="space-y-4">
            {sortedNews.map((n) => {
              const meta = newsMetaById[n.id];
              const href = n.url?.trim();
              const title = (meta?.title || n.title[lang]).trim();
              const imgSrc = n.photoSrc || meta?.image;
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
                              src={videoSrc}
                              preload="auto"
                              muted
                              playsInline
                              className="w-full h-full object-cover pointer-events-none"
                            />
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
                  type="number"
                  value={reservationPax}
                  onChange={(e) => setReservationPax(e.target.value)}
                  inputMode="numeric"
                  min={1}
                  step={1}
                  className="mt-1 w-full h-11 px-4 rounded-xl border border-[#c7d8b5] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#3b5b3e]/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#2f4a31]">{tt('reservation.name')}</label>
                <input
                  value={reservationName}
                  onChange={(e) => setReservationName(e.target.value)}
                  autoComplete="name"
                  className="mt-1 w-full h-11 px-4 rounded-xl border border-[#c7d8b5] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#3b5b3e]/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#2f4a31]">{tt('reservation.phone')}</label>
                <input
                  type="tel"
                  value={reservationPhone}
                  onChange={(e) => setReservationPhone(e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
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
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#2f4a31]">{tt('reservation.time')}</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 330"
                    value={formatTime12Input(reservationTimeHHMM)}
                    onChange={(e) => setReservationTimeHHMM(formatTime12Input(e.target.value))}
                    onBlur={() => setReservationTimeHHMM(normalizeTime12(reservationTimeHHMM))}
                    className="w-full h-11 px-4 rounded-xl border border-[#c7d8b5] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#3b5b3e]/30"
                    pattern="\\d{1,2}(:\\d{2})?"
                    required
                  />
                  <select
                    value={reservationMeridiem}
                    onChange={(e) => setReservationMeridiem(e.target.value as Meridiem)}
                    className="h-11 px-3 rounded-xl border border-[#c7d8b5] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#3b5b3e]/30"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
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
              <div className="md:col-span-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-[#486449] leading-relaxed">
                  <div className="text-xs font-semibold tracking-wide text-[#2f4a31]">Disclaimer</div>
                  <div className="mt-1 text-sm">{tt('reservation.disclaimer')}</div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 md:flex-nowrap md:justify-end">
                  <div className="text-sm text-[#486449] md:text-right">
                    {reservationStore?.reservationWhatsAppPhone ?? CONTACT.phone}
                  </div>
                  <button
                    type="submit"
                    className="h-11 px-6 rounded-full bg-[#3b5b3e] text-white hover:bg-[#2f4a31] transition"
                  >
                    {tt('reservation.submit')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Section>

        <div className="py-12 md:py-14" />

        <Section id="contact" title={tt('section.contact.title')} subtitle={tt('contact.subtitle')}>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#2f4a31]">
                <div className="grid grid-cols-1 gap-4">
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
                    <div className="mt-1">{CONTACT.address[lang]}</div>
                  </div>
                </div>
                <div className="min-w-0 md:pl-6 md:border-l md:border-[#e5e7eb]">
                  <div className="text-sm text-[#486449]">{tt('contact.follow')}</div>
                  <div className="mt-3">
                    <SocialAccountsList />
                  </div>
                </div>
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
