'use client';

import { Section } from '@/components/Section';
import { SocialAccountsList } from '@/components/SocialLinks';
import { t } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';
import { CONTACT } from '@/lib/siteData';

export default function ContactPage() {
  const { lang } = useLang();
  const tt = (key: string, params?: Record<string, string | number>) => t(lang, key, params);

  return (
    <>
      <div className="py-12 md:py-14" />

      <Section title={tt('section.contact.title')} subtitle={tt('contact.subtitle')}>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#2f4a31]">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="text-sm text-[#486449]">{tt('contact.phone')}</div>
                  <div className="mt-1 font-semibold">{CONTACT.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-[#486449]">{tt('contact.email')}</div>
                  <div className="mt-1 font-semibold">{CONTACT.email}</div>
                </div>
                <div>
                  <div className="text-sm text-[#486449]">{tt('contact.address')}</div>
                  <div className="mt-1">{CONTACT.address[lang]}</div>
                </div>
              </div>
              <div className="min-w-0 md:pl-6 md:border-l md:border-[#e5e7eb]">
                <div className="text-sm text-[#486449]">{tt('contact.follow')}</div>
                <div className="mt-3">
                  <SocialAccountsList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div className="py-12 md:py-14" />
    </>
  );
}
