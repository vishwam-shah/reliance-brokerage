'use client';

import { useLanguage } from '@/hooks/useLanguage';

export default function LegalHubPage() {
  const { translate: t } = useLanguage();

  return (
    <div className="bg-surface min-h-screen pt-24 pb-20">
      <div className="container max-w-3xl">
        <div className="mb-16 flex gap-4 border-b border-black border-opacity-10 pb-6 sticky top-24 bg-surface z-10">
          <a href="#terms" className="font-label font-semibold text-label-md text-on-surface-variant hover:text-on-surface">{t('legal.terms_nav')}</a>
          <a href="#privacy" className="font-label font-semibold text-label-md text-on-surface-variant hover:text-on-surface">{t('legal.privacy_nav')}</a>
        </div>

        <section id="terms" className="mb-20 scroll-mt-32">
          <h1 className="font-headline text-display-md font-bold text-on-surface mb-8">{t('legal.terms_title')}</h1>
          <div className="space-y-8">
            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">{t('legal.terms_1_title')}</h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{t('legal.terms_1_body')}</p>
            </div>
            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">{t('legal.terms_2_title')}</h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed mb-4">{t('legal.terms_2_body1')}</p>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{t('legal.terms_2_body2')}</p>
              <ul className="ml-6 mt-3 space-y-2">
                {['terms_2_li1','terms_2_li2','terms_2_li3','terms_2_li4'].map(k => (
                  <li key={k} className="text-body-md text-on-surface-variant">{t(`legal.${k}`)}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">{t('legal.terms_3_title')}</h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{t('legal.terms_3_body')}</p>
            </div>
            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">{t('legal.terms_4_title')}</h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{t('legal.terms_4_body')}</p>
            </div>
          </div>
        </section>

        <section id="privacy" className="scroll-mt-32">
          <h1 className="font-headline text-display-md font-bold text-on-surface mb-8">{t('legal.privacy_title')}</h1>
          <div className="space-y-8">
            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">{t('legal.privacy_1_title')}</h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed mb-4">{t('legal.privacy_1_body')}</p>
              <ul className="ml-6 mt-3 space-y-2">
                {['privacy_1_li1','privacy_1_li2','privacy_1_li3','privacy_1_li4'].map(k => (
                  <li key={k} className="text-body-md text-on-surface-variant">{t(`legal.${k}`)}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">{t('legal.privacy_2_title')}</h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{t('legal.privacy_2_body')}</p>
            </div>
            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">{t('legal.privacy_3_title')}</h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{t('legal.privacy_3_body')}</p>
            </div>
            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">{t('legal.privacy_4_title')}</h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{t('legal.privacy_4_body')}</p>
            </div>
            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">{t('legal.privacy_5_title')}</h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {t('legal.privacy_5_body')}{' '}
                <a href="mailto:privacy@reliance-brokerage.com" className="text-on-surface font-semibold hover:text-primary underline">
                  privacy@reliance-brokerage.com
                </a>.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
