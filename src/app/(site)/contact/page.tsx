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
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-[#c7d8b5] bg-[#f7faf1] p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,430px)_280px] lg:justify-between gap-6 text-[#2f4a31]">
              <div className="max-w-[430px]">
                <div>
                  <div className="text-sm text-[#486449]">{tt('contact.address')}</div>
                  <div className="mt-3 space-y-3">
                    {CONTACT.storeAddresses[lang].map((store) => (
                      <div
                        key={`${store.label}-${store.address}`}
                        className="rounded-xl border border-[#d5e6c3] bg-white/70 px-4 py-3"
                      >
                        <div className="text-sm font-semibold text-[#2f4a31]">{store.label}</div>
                        <div className="mt-1 text-sm leading-6 text-[#486449]">{store.address}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="min-w-0 lg:w-[280px] lg:pl-6 lg:border-l lg:border-[#e5e7eb]">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-sm text-[#486449]">{tt('contact.phone')}</div>
                    <div className="mt-1 font-semibold">{CONTACT.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#486449]">{tt('contact.email')}</div>
                    <div className="mt-1 font-semibold">{CONTACT.email}</div>
                  </div>
                </div>
                <div className="mt-6 text-sm text-[#486449]">{tt('contact.follow')}</div>
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
