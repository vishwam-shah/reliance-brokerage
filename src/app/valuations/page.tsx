'use client';

import { Icon } from '@iconify/react';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/Button';

export default function ValuationsPage() {
  const { translate: t } = useLanguage();

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="container max-w-3xl">
        <div className="mb-12">
          <span className="eyebrow">{t('valuations.eyebrow')}</span>
          <h1 className="font-headline text-display-lg font-bold text-on-surface mt-5 mb-4">
            {t('valuations.title')}
          </h1>
          <p className="text-body-lg text-on-surface-variant">{t('valuations.description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Standard Package */}
          <div className="bg-surface-container-lowest p-8 flex flex-col">
            <h3 className="font-headline text-title-lg font-bold text-on-surface mb-4">{t('valuations.standard_package')}</h3>
            <ul className="space-y-3 mb-8 flex-grow">
              {[t('valuations.standard_feature1'), t('valuations.standard_feature2'), t('valuations.standard_feature3')].map((f, i) => (
                <li key={i} className="flex gap-3">
                  <Icon icon="mdi:check-circle" className="text-accent flex-shrink-0" style={{ width: '20px', height: '20px' }} />
                  <span className="text-body-sm text-on-surface-variant">{f}</span>
                </li>
              ))}
            </ul>
            <Button variant="secondary" href="/contact-us">{t('valuations.standard_cta')}</Button>
          </div>

          {/* Institutional Package */}
          <div className="bg-surface-container-lowest p-8 border-2 border-accent flex flex-col">
            <div className="bg-accent text-on-accent px-3 py-1 inline-block mb-4 w-fit">
              <span className="font-label font-bold text-label-sm">{t('valuations.popular_badge')}</span>
            </div>
            <h3 className="font-headline text-title-lg font-bold text-on-surface mb-4">{t('valuations.institutional_package')}</h3>
            <ul className="space-y-3 mb-8 flex-grow">
              {[t('valuations.institutional_feature1'), t('valuations.institutional_feature2'), t('valuations.institutional_feature3'), t('valuations.institutional_feature4')].map((f, i) => (
                <li key={i} className="flex gap-3">
                  <Icon icon="mdi:check-circle" className="text-accent flex-shrink-0" style={{ width: '20px', height: '20px' }} />
                  <span className="text-body-sm text-on-surface-variant">{f}</span>
                </li>
              ))}
            </ul>
            <Button variant="primary" href="/contact-us">{t('valuations.institutional_cta')}</Button>
          </div>
        </div>

        <div className="bg-surface-container-highest p-12">
          <h2 className="font-headline text-headline-lg font-bold text-on-surface mb-6">{t('valuations.our_process')}</h2>
          <div className="space-y-6">
            {[
              { title: t('valuations.step1_title'), desc: t('valuations.step1_desc') },
              { title: t('valuations.step2_title'), desc: t('valuations.step2_desc') },
              { title: t('valuations.step3_title'), desc: t('valuations.step3_desc') },
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary text-on-primary font-headline font-bold text-title-lg flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-headline font-bold text-on-surface mb-2">{step.title}</h4>
                  <p className="text-body-sm text-on-surface-variant">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
