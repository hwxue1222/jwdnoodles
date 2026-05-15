'use client';

import { useMemo, useState } from 'react';

const PLACEHOLDER_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <rect width="100%" height="100%" fill="#edf4e5"/>
    <rect x="24" y="24" width="752" height="552" rx="16" fill="#f7faf1" stroke="#c9d9b5"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#51704b" font-size="22" font-family="Arial, Helvetica, sans-serif">
      Image Placeholder
    </text>
  </svg>`
);

export function SafeImg({
  src,
  alt,
  className,
  onClick,
  title,
}: {
  src?: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  title?: string;
}) {
  const [failed, setFailed] = useState(false);
  const fallbackSrc = useMemo(() => `data:image/svg+xml;charset=utf-8,${PLACEHOLDER_SVG}`, []);
  const finalSrc = !src || failed ? fallbackSrc : src;

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      title={title}
      onClick={onClick}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

