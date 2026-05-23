import { SafeImg } from '@/components/SafeImg';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

export type WorldMapLocation = {
  id: string;
  label: string;
  xPct: number;
  yPct: number;
  photoSrc?: string;
};

export function WorldMap({
  locations,
  onOpen,
}: {
  locations: WorldMapLocation[];
  onOpen: (src: string | undefined, alt: string) => void;
}) {
  const [bgOk, setBgOk] = useState(true);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const carouselTrackRef = useRef<HTMLDivElement | null>(null);
  const carouselSecondCopyRef = useRef<HTMLDivElement | null>(null);
  const [cursor, setCursor] = useState<{ xPct: number; yPct: number } | null>(null);
  const [imgNatural, setImgNatural] = useState<{ w: number; h: number }>({ w: 1600, h: 795 });
  const [imgBox, setImgBox] = useState<{ ox: number; oy: number; w: number; h: number }>({ ox: 0, oy: 0, w: 0, h: 0 });
  const [carouselPaused, setCarouselPaused] = useState(false);

  const debug = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('popstate', onStoreChange);
      window.addEventListener('hashchange', onStoreChange);
      return () => {
        window.removeEventListener('popstate', onStoreChange);
        window.removeEventListener('hashchange', onStoreChange);
      };
    },
    () => new URLSearchParams(window.location.search).has('mapDebug'),
    () => false,
  );

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const reduceMotion = mq?.matches ?? false;
    if (reduceMotion) return;

    const track = carouselTrackRef.current;
    if (!track) return;

    const second = carouselSecondCopyRef.current;
    if (!second) return;

    let raf = 0;
    let lastT = 0;
    const speedPxPerSecond = 32;

    const tick = (t: number) => {
      if (!lastT) lastT = t;
      const dt = t - lastT;
      lastT = t;

      const singleWidth = second.offsetLeft;
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      if (!carouselPaused && maxScroll > 0 && singleWidth > 0) {
        const next = el.scrollLeft + (speedPxPerSecond * dt) / 1000;
        if (next >= singleWidth) {
          el.scrollLeft = next - singleWidth;
        } else {
          el.scrollLeft = next;
        }
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [carouselPaused, locations.length]);

  const scrollCarouselBy = (direction: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    const track = carouselTrackRef.current;
    const second = carouselSecondCopyRef.current;
    if (!track || !second) return;
    const singleWidth = second.offsetLeft;
    const amount = Math.max(260, Math.round(el.clientWidth * 0.8));
    if (!singleWidth) {
      el.scrollBy({ left: direction * amount, behavior: 'smooth' });
      return;
    }

    if (el.scrollLeft >= singleWidth) el.scrollLeft = el.scrollLeft - singleWidth;
    if (el.scrollLeft < 0) el.scrollLeft = el.scrollLeft + singleWidth;

    if (direction === 1) {
      if (el.scrollLeft + amount >= singleWidth) el.scrollLeft = el.scrollLeft - singleWidth;
    } else {
      if (el.scrollLeft - amount < 0) el.scrollLeft = el.scrollLeft + singleWidth;
    }

    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      const baseW = bgOk ? imgNatural.w : 1000;
      const baseH = bgOk ? imgNatural.h : 500;
      if (!rect.width || !rect.height) return;
      const scale = Math.min(rect.width / baseW, rect.height / baseH);
      const w = baseW * scale;
      const h = baseH * scale;
      const ox = (rect.width - w) / 2;
      const oy = (rect.height - h) / 2;
      setImgBox({ ox, oy, w, h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [bgOk, imgNatural.h, imgNatural.w]);

  const computePct = (clientX: number, clientY: number) => {
    const el = wrapRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const x = ((clientX - rect.left - imgBox.ox) / imgBox.w) * 100;
    const y = ((clientY - rect.top - imgBox.oy) / imgBox.h) * 100;
    const xPct = Math.max(0, Math.min(100, x));
    const yPct = Math.max(0, Math.min(100, y));
    return { xPct, yPct };
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1]">
        <div
          ref={wrapRef}
          className="relative aspect-[1600/900]"
          onPointerMove={(e) => {
            if (!debug) return;
            setCursor(computePct(e.clientX, e.clientY));
          }}
          onPointerLeave={() => {
            if (!debug) return;
            setCursor(null);
          }}
          onClick={(e) => {
            if (!debug) return;
            const pct = computePct(e.clientX, e.clientY);
            if (!pct) return;
            const text = `${pct.xPct.toFixed(1)}, ${pct.yPct.toFixed(1)}`;
            console.log('[WorldMap] pin pct:', text);
            navigator.clipboard?.writeText?.(text).catch(() => {});
          }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {bgOk ? (
              <img
                src="/images/global/world-map.jpg"
                alt="World map"
                className="absolute inset-0 w-full h-full object-contain bg-[#edf4e5]"
                onError={() => setBgOk(false)}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth && img.naturalHeight) {
                    setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
                  }
                }}
                loading="lazy"
              />
            ) : null}

            {!bgOk ? (
              <svg
                viewBox="0 0 1000 500"
                className="absolute inset-0 w-full h-full"
                role="img"
                aria-label="World map"
                preserveAspectRatio="xMidYMid meet"
              >
                <rect x="0" y="0" width="1000" height="500" fill="#edf4e5" />
                <path
                  d="M70 140 L110 95 L165 75 L235 80 L285 110 L310 150 L295 175 L260 170 L240 195 L205 220 L175 245 L140 255 L105 235 L80 205 Z"
                  fill="#d5e6c3"
                  stroke="#c7d8b5"
                  strokeWidth="3"
                />
                <path
                  d="M240 245 L275 275 L300 320 L295 360 L270 410 L230 440 L210 405 L210 350 L220 300 Z"
                  fill="#d5e6c3"
                  stroke="#c7d8b5"
                  strokeWidth="3"
                />
                <path
                  d="M255 65 L285 40 L325 35 L355 55 L345 80 L305 90 L270 80 Z"
                  fill="#d5e6c3"
                  stroke="#c7d8b5"
                  strokeWidth="3"
                />
                <path
                  d="M330 120 L380 85 L455 75 L520 90 L585 80 L700 95 L820 130 L910 175 L885 215 L820 220 L780 210 L740 230 L700 250 L640 270 L580 260 L540 225 L500 210 L440 190 L380 165 L345 145 Z"
                  fill="#d5e6c3"
                  stroke="#c7d8b5"
                  strokeWidth="3"
                />
                <path
                  d="M470 225 L520 235 L560 265 L570 305 L560 350 L530 400 L485 425 L455 385 L445 330 L455 275 Z"
                  fill="#d5e6c3"
                  stroke="#c7d8b5"
                  strokeWidth="3"
                />
                <path
                  d="M760 330 L820 340 L875 370 L865 415 L825 450 L780 440 L755 405 L750 370 Z"
                  fill="#d5e6c3"
                  stroke="#c7d8b5"
                  strokeWidth="3"
                />
              </svg>
            ) : null}
          </div>

          {locations.map((loc) => (
            <button
              key={loc.id}
              type="button"
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${imgBox.ox + (imgBox.w * loc.xPct) / 100}px`, top: `${imgBox.oy + (imgBox.h * loc.yPct) / 100}px` }}
              onClick={(e) => {
                e.stopPropagation();
                onOpen(loc.photoSrc, loc.label);
              }}
            >
              <span className="relative flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#3b5b3e]/25 group-hover:bg-[#3b5b3e]/35 transition" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-[#3b5b3e] border-2 border-white shadow" />
              </span>
              <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-6 opacity-0 group-hover:opacity-100 transition whitespace-nowrap text-xs bg-[#213821] text-white px-2 py-1 rounded-md shadow">
                {loc.label}
              </span>
            </button>
          ))}

          {debug ? (
            <div className="absolute left-3 top-3 rounded-lg border border-[#c7d8b5] bg-white/80 px-3 py-2 text-xs text-[#2f4a31] shadow-sm">
              <div className="font-semibold">Map Debug</div>
              <div className="mt-1 tabular-nums">{cursor ? `${cursor.xPct.toFixed(1)}, ${cursor.yPct.toFixed(1)}` : '—'}</div>
              <div className="mt-1 text-[#486449]">Click map to copy</div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-4">
        <div className="relative">
          <button
            type="button"
            aria-label="Scroll left"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full border border-[#c7d8b5] bg-white/80 text-[#2f4a31] shadow-sm hover:bg-white transition"
            onClick={() => scrollCarouselBy(-1)}
            onMouseEnter={() => setCarouselPaused(true)}
            onMouseLeave={() => setCarouselPaused(false)}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full border border-[#c7d8b5] bg-white/80 text-[#2f4a31] shadow-sm hover:bg-white transition"
            onClick={() => scrollCarouselBy(1)}
            onMouseEnter={() => setCarouselPaused(true)}
            onMouseLeave={() => setCarouselPaused(false)}
          >
            ›
          </button>

          <div
            ref={carouselRef}
            className="noScrollbar overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] px-12"
            onMouseEnter={() => setCarouselPaused(true)}
            onMouseLeave={() => setCarouselPaused(false)}
            onTouchStart={() => setCarouselPaused(true)}
            onTouchEnd={() => setCarouselPaused(false)}
          >
            <div ref={carouselTrackRef} className="flex gap-4 w-max pr-2">
              <div className="flex gap-4 w-max">
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    className="text-left flex-none w-[220px] sm:w-[260px] lg:w-[300px]"
                    onClick={() => onOpen(loc.photoSrc, loc.label)}
                  >
                    <SafeImg
                      src={loc.photoSrc}
                      alt={loc.label}
                      placeholderLabel={loc.label}
                      className="w-full h-32 sm:h-36 lg:h-40 object-cover rounded-xl border border-[#d5e6c3] cursor-zoom-in bg-[#edf4e5]"
                    />
                    <div className="mt-2 text-sm text-[#2f4a31] whitespace-normal break-words leading-snug" title={loc.label}>
                      {loc.label}
                    </div>
                  </button>
                ))}
              </div>

              <div ref={carouselSecondCopyRef} className="flex gap-4 w-max" aria-hidden="true">
                {locations.map((loc) => (
                  <button
                    key={`${loc.id}-dup`}
                    type="button"
                    className="text-left flex-none w-[220px] sm:w-[260px] lg:w-[300px]"
                    tabIndex={-1}
                    onClick={() => onOpen(loc.photoSrc, loc.label)}
                  >
                    <SafeImg
                      src={loc.photoSrc}
                      alt={loc.label}
                      placeholderLabel={loc.label}
                      className="w-full h-32 sm:h-36 lg:h-40 object-cover rounded-xl border border-[#d5e6c3] cursor-zoom-in bg-[#edf4e5]"
                    />
                    <div className="mt-2 text-sm text-[#2f4a31] whitespace-normal break-words leading-snug" title={loc.label}>
                      {loc.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
        </div>
        </div>
        <style jsx>{`
          .noScrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
}
