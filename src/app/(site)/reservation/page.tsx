'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { Section } from '@/components/Section';
import { t } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';
import { BRAND, CONTACT, STORES } from '@/lib/siteData';

const RESERVATION_STORE_KEY = 'lanzhou:reservation:storeId';

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

export default function ReservationPage() {
  const { lang } = useLang();
  const tt = (key: string, params?: Record<string, string | number>) => t(lang, key, params);

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

  return (
    <>
      <div className="py-12 md:py-14" />

      <Section title={tt('section.reservation.title')} subtitle={tt('reservation.subtitle')}>
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
                <div className="text-sm text-[#486449] md:text-right">{reservationStore?.reservationWhatsAppPhone ?? CONTACT.phone}</div>
                <button type="submit" className="h-11 px-6 rounded-full bg-[#3b5b3e] text-white hover:bg-[#2f4a31] transition">
                  {tt('reservation.submit')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Section>

      <div className="py-12 md:py-14" />
    </>
  );
}

