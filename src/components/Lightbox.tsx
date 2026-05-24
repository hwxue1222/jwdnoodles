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
}: {
  open: boolean;
  type?: 'image' | 'video';
  src?: string;
  posterSrc?: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

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
        <div className="rounded-xl overflow-hidden bg-white shadow-2xl">
          {type === 'video' ? (
            <video
              src={src}
              poster={posterSrc}
              controls
              playsInline
              className="w-full h-auto max-h-[80vh] object-contain bg-[#edf4e5]"
            />
          ) : (
            <SafeImg src={src} alt={alt} className="w-full h-auto max-h-[80vh] object-contain bg-[#edf4e5]" />
          )}
          <div className="px-4 py-3 text-sm text-[#2f4a31] border-t border-[#e5e7eb]">{alt}</div>
        </div>
      </div>
    </div>
  );
}
