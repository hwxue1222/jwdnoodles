'use client';

import { SOCIAL_LINKS } from '@/lib/siteData';

function extractAccount(href: string) {
  try {
    const u = new URL(href);
    const host = u.hostname.replace(/^www\./, '');
    const parts = u.pathname.split('/').filter(Boolean);
    if (host === 'facebook.com') return parts[0] ? `/${parts[0]}` : href;
    if (host === 'tiktok.com') return parts[0] ?? href;
    if (host === 'xiaohongshu.com') return parts[parts.length - 1] ?? href;
    if (host === 'wa.me') return `+${parts[0] ?? ''}`.replace(/\+$/, href);
    return href;
  } catch {
    return href;
  }
}

function IconButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="h-11 w-11 rounded-full border border-[#3b5b3e] text-[#2f4a31] bg-transparent hover:bg-[#3b5b3e] hover:text-white transition flex items-center justify-center"
    >
      {children}
    </a>
  );
}

export function SocialLinks({ className }: { className?: string }) {
  return <SocialLinksInner className={className} showText={false} />;
}

export function SocialLinksWithText({ className }: { className?: string }) {
  return <SocialLinksInner className={className} showText />;
}

export function SocialAccountsList({ className }: { className?: string }) {
  return (
    <div className={`grid gap-2 ${className ?? ''}`}>
      <a
        href={SOCIAL_LINKS.facebook}
        target="_blank"
        rel="noreferrer"
        className="min-w-0 flex items-center gap-2 text-[#486449] hover:underline underline-offset-4"
        title={SOCIAL_LINKS.facebook}
      >
        <span className="h-9 w-9 shrink-0 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16.7V5a19 19 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4V11H8v3h2.5v8h3z" />
          </svg>
        </span>
        <span className="truncate">Facebook: {extractAccount(SOCIAL_LINKS.facebook)}</span>
      </a>

      <a
        href={SOCIAL_LINKS.tiktok}
        target="_blank"
        rel="noreferrer"
        className="min-w-0 flex items-center gap-2 text-[#486449] hover:underline underline-offset-4"
        title={SOCIAL_LINKS.tiktok}
      >
        <span className="h-9 w-9 shrink-0 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M15.5 4c.4 2 1.8 3.5 3.8 3.8V11c-1.5 0-2.9-.5-4-1.3V16a6 6 0 1 1-6-6c.4 0 .7 0 1.1.1v3.4a3 3 0 1 0 1.9 2.8V4h3.2z" />
          </svg>
        </span>
        <span className="truncate">TikTok: {extractAccount(SOCIAL_LINKS.tiktok)}</span>
      </a>

      <a
        href={SOCIAL_LINKS.xiaohongshu}
        target="_blank"
        rel="noreferrer"
        className="min-w-0 flex items-center gap-2 text-[#486449] hover:underline underline-offset-4"
        title={SOCIAL_LINKS.xiaohongshu}
      >
        <span className="h-9 w-9 shrink-0 rounded-full bg-[#FF2E4D] text-white flex items-center justify-center hover:opacity-90 transition">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M7 5.8C7 4.8 7.8 4 8.8 4h6.4C16.2 4 17 4.8 17 5.8v12.4c0 1-.8 1.8-1.8 1.8H8.8c-1 0-1.8-.8-1.8-1.8V5.8zm2.2.7v11h5.6v-11H9.2z" />
            <path d="M10 9h4v1.8h-4V9zm0 3h4v1.8h-4V12z" />
          </svg>
        </span>
        <span className="truncate">小红书: {extractAccount(SOCIAL_LINKS.xiaohongshu)}</span>
      </a>

      <a
        href={SOCIAL_LINKS.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="min-w-0 flex items-center gap-2 text-[#486449] hover:underline underline-offset-4"
        title={SOCIAL_LINKS.whatsapp}
      >
        <span className="h-9 w-9 shrink-0 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.5-4.4-1.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.7-6.1c-.3-.1-1.7-.8-2-1s-.5-.1-.7.1-.8 1-.9 1.1-.3.2-.6.1a6.7 6.7 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.8c-.1-.3 0-.5.1-.6l.5-.6c.1-.1.2-.3.3-.4.1-.1.1-.3 0-.5s-.7-1.6-1-2.2c-.3-.6-.6-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3s2 3 4.9 4.2c.7.3 1.2.4 1.6.5.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4s-.2-.2-.4-.3z" />
          </svg>
        </span>
        <span className="truncate">WhatsApp: {extractAccount(SOCIAL_LINKS.whatsapp)}</span>
      </a>
    </div>
  );
}

function SocialLinksInner({ className, showText }: { className?: string; showText: boolean }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-4 ${className ?? ''}`}>
      <div className="flex items-center gap-3">
        <IconButton href={SOCIAL_LINKS.facebook} label="Facebook">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16.7V5a19 19 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4V11H8v3h2.5v8h3z" />
          </svg>
        </IconButton>
        <IconButton href={SOCIAL_LINKS.tiktok} label="TikTok">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M15.5 4c.4 2 1.8 3.5 3.8 3.8V11c-1.5 0-2.9-.5-4-1.3V16a6 6 0 1 1-6-6c.4 0 .7 0 1.1.1v3.4a3 3 0 1 0 1.9 2.8V4h3.2z" />
          </svg>
        </IconButton>
        <IconButton href={SOCIAL_LINKS.xiaohongshu} label="小红书">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M7 5.8C7 4.8 7.8 4 8.8 4h6.4C16.2 4 17 4.8 17 5.8v12.4c0 1-.8 1.8-1.8 1.8H8.8c-1 0-1.8-.8-1.8-1.8V5.8zm2.2.7v11h5.6v-11H9.2z" />
            <path d="M10 9h4v1.8h-4V9zm0 3h4v1.8h-4V12z" />
          </svg>
        </IconButton>
        <IconButton href={SOCIAL_LINKS.whatsapp} label="WhatsApp">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.5-4.4-1.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.7-6.1c-.3-.1-1.7-.8-2-1s-.5-.1-.7.1-.8 1-.9 1.1-.3.2-.6.1a6.7 6.7 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.8c-.1-.3 0-.5.1-.6l.5-.6c.1-.1.2-.3.3-.4.1-.1.1-.3 0-.5s-.7-1.6-1-2.2c-.3-.6-.6-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3s2 3 4.9 4.2c.7.3 1.2.4 1.6.5.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4s-.2-.2-.4-.3z" />
          </svg>
        </IconButton>
      </div>

      {showText ? (
        <div className="text-sm">
          <SocialAccountsList />
        </div>
      ) : null}
    </div>
  );
}
