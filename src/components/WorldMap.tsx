import { SafeImg } from '@/components/SafeImg';
import { useState } from 'react';

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-6 items-start">
      <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] overflow-hidden">
        <div className="relative aspect-[1600/795]">
          {bgOk ? (
            <img
              src="/images/global/world-map.jpg"
              alt="World map"
              className="absolute inset-0 w-full h-full object-contain bg-[#edf4e5]"
              onError={() => setBgOk(false)}
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

          {locations.map((loc) => (
            <button
              key={loc.id}
              type="button"
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${loc.xPct}%`, top: `${loc.yPct}%` }}
              onClick={() => onOpen(loc.photoSrc, loc.label)}
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
        </div>
      </div>

      <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {locations.map((loc) => (
            <button
              key={loc.id}
              type="button"
              className="text-left"
              onClick={() => onOpen(loc.photoSrc, loc.label)}
            >
              <SafeImg
                src={loc.photoSrc}
                alt={loc.label}
                placeholderLabel={loc.label}
                className="w-full h-24 object-cover rounded-xl border border-[#d5e6c3] cursor-zoom-in bg-[#edf4e5]"
              />
              <div className="mt-1 text-xs text-[#2f4a31] truncate" title={loc.label}>
                {loc.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
