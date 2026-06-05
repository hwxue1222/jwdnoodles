'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

function makePlaceholderSvg(label: string | null | undefined) {
  const text =
    label === null || label === undefined || label === ''
      ? ''
      : `
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#51704b" font-size="22" font-family="Arial, Helvetica, sans-serif">
      ${label}
    </text>`;

  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <rect width="100%" height="100%" fill="#edf4e5"/>
    <rect x="24" y="24" width="752" height="552" rx="16" fill="#f7faf1" stroke="#c9d9b5"/>
    ${text}
  </svg>`
  );
}

export function SafeImg({
  src,
  alt,
  className,
  onClick,
  title,
  placeholderLabel,
  loading,
}: {
  src?: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  title?: string;
  placeholderLabel?: string | null;
  loading?: 'eager' | 'lazy';
}) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [safariVisible, setSafariVisible] = useState(() => loading === 'eager');
  const fallbackSrc = useMemo(
    () => `data:image/svg+xml;charset=utf-8,${makePlaceholderSvg(placeholderLabel ?? 'Image Placeholder')}`,
    [placeholderLabel]
  );
  const resolvedSrc = !src || failed ? fallbackSrc : src;
  const isSafari = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('safari') && !ua.includes('chrome') && !ua.includes('crios') && !ua.includes('android');
  }, []);
  const effectiveLoading = loading ?? 'lazy';
  const shouldSafariLazy = isSafari && effectiveLoading === 'lazy' && resolvedSrc !== fallbackSrc;
  const browserLoading = isSafari ? undefined : effectiveLoading;
  const finalSrc = shouldSafariLazy && !safariVisible ? fallbackSrc : resolvedSrc;

  useEffect(() => {
    if (!isSafari) return;
    if (!shouldSafariLazy) {
      setSafariVisible(true);
      return;
    }

    setSafariVisible(false);
    const el = imgRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting || e.intersectionRatio > 0);
        if (!hit) return;
        setSafariVisible(true);
        io.disconnect();
      },
      { root: null, rootMargin: '200px', threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isSafari, shouldSafariLazy, resolvedSrc]);

  return (
    <img
      ref={imgRef}
      src={finalSrc}
      alt={alt}
      className={className}
      title={title}
      onClick={onClick}
      onError={() => setFailed(true)}
      decoding="async"
      loading={browserLoading}
    />
  );
}
