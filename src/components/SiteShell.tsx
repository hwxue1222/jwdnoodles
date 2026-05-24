'use client';

import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SocialLinks } from '@/components/SocialLinks';
import { t } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';

const NAV = [
  { href: '/about', key: 'nav.about' },
  { href: '/stores', key: 'nav.stores' },
  { href: '/menu', key: 'nav.menu' },
  { href: '/halal', key: 'nav.halal' },
  { href: '/news', key: 'nav.news' },
  { href: '/reservation', key: 'nav.reservation' },
  { href: '/contact', key: 'nav.contact' },
] as const;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useLang();
  const tt = (key: string, params?: Record<string, string | number>) => t(lang, key, params);

  return (
    <div className="min-h-screen bg-[#e8f2dd] text-[#1c2a1c]">
      <header className="sticky top-0 z-40 border-b border-[#c7d8b5] bg-[#f7faf1]/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="min-w-0">
            <BrandLogo />
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-sm text-[#2f4a31]">
            {NAV.map((n) => (
              <Link key={n.href} className="hover:underline underline-offset-4" href={n.href}>
                {tt(n.key)}
              </Link>
            ))}
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
            {NAV.map((n) => (
              <Link key={n.href} className="whitespace-nowrap hover:underline underline-offset-4" href={n.href}>
                {tt(n.key)}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="min-h-[60vh]">{children}</main>

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

