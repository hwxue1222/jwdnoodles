'use client';

import { useEffect } from 'react';
import { SafeImg } from '@/components/SafeImg';

export function Lightbox({
  open,
  type = 'image',
  src,
  posterSrc,
  alt,
  onClose,
  onPrev,
  onNext,
  canPrev = false,
  canNext = false,
}: {
  open: boolean;
  type?: 'image' | 'video';
  src?: string;
  posterSrc?: string;
  alt: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && canPrev && onPrev) onPrev();
      if (e.key === 'ArrowRight' && canNext && onNext) onNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, onPrev, onNext, canPrev, canNext]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-w-[980px] w-full" onMouseDown={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="Close"
          className="absolute -top-10 right-0 h-9 w-9 rounded-full bg-white/90 text-zinc-900 hover:bg-white transition"
          onClick={onClose}
        >
          ×
        </button>
        {canPrev && onPrev ? (
          <button
            type="button"
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-14 w-14 rounded-2xl border border-[#c7d8b5] bg-white/92 text-[#2f4a31] text-3xl leading-none shadow-lg hover:bg-white transition"
            onClick={onPrev}
          >
            ‹
          </button>
        ) : null}
        {canNext && onNext ? (
          <button
            type="button"
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-14 w-14 rounded-2xl border border-[#c7d8b5] bg-white/92 text-[#2f4a31] text-3xl leading-none shadow-lg hover:bg-white transition"
            onClick={onNext}
          >
            ›
          </button>
        ) : null}
        <div className="rounded-xl overflow-hidden bg-white shadow-2xl max-h-[90vh] flex flex-col">
          <div className="bg-[#edf4e5] w-full flex-1 min-h-[240px]">
            {type === 'video' ? (
              <video
                poster={posterSrc}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
              >
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <SafeImg src={src} alt={alt} className="w-full h-full object-contain" />
            )}
          </div>
          <div className="px-4 py-3 text-sm text-[#2f4a31] border-t border-[#e5e7eb]">{alt}</div>
        </div>
      </div>
    </div>
  );
}
