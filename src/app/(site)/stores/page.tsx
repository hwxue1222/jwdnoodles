'use client';

import { useState } from 'react';
import { Lightbox } from '@/components/Lightbox';
import { SafeImg } from '@/components/SafeImg';
import { Section } from '@/components/Section';
import { WorldMap } from '@/components/WorldMap';
import { t } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';
import { GLOBAL_LOCATIONS, STORES, Store } from '@/lib/siteData';

function mapEmbedUrl(store: Store) {
  return `https://www.google.com/maps?q=${encodeURIComponent(store.map.placeQuery)}&output=embed`;
}

function mapOpenUrl(store: Store) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.map.placeQuery)}`;
}

export default function StoresPage() {
  const { lang } = useLang();
  const tt = (key: string, params?: Record<string, string | number>) => t(lang, key, params);

  const [lightbox, setLightbox] = useState<{ open: boolean; src?: string; alt: string }>({ open: false, alt: '' });
  const openLightbox = (src: string | undefined, alt: string) => setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox((s) => ({ ...s, open: false }));
  const [storeMapOpenById, setStoreMapOpenById] = useState<Record<string, boolean>>({});
  const loadStoreMap = (storeId: string) => setStoreMapOpenById((s) => ({ ...s, [storeId]: true }));

  return (
    <>
      <Lightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />

      <div className="py-12 md:py-14" />

      <Section title={tt('section.global.title')} subtitle={tt('section.global.subtitle')}>
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

      <Section title={tt('section.stores.title')} subtitle={tt('section.stores.subtitle')}>
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
                  {storeMapOpenById[store.id] ? (
                    <iframe
                      src={mapEmbedUrl(store)}
                      className="w-full h-56"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map-${store.id}`}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => loadStoreMap(store.id)}
                      className="w-full h-56 flex items-center justify-center text-sm text-[#2f4a31] hover:bg-white/40 transition"
                    >
                      {tt('store.loadMap')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="py-12 md:py-14" />
    </>
  );
}
