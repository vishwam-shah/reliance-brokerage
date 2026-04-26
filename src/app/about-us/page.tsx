'use client';

import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  const { translate: t } = useLanguage();

  return (
    <div className="bg-surface">
      <section className="py-12 sm:py-16">
        <div className="container">
          <div className="max-w-3xl">
            <span className="eyebrow">{t('about.eyebrow')}</span>
            <h1 className="font-headline text-display-lg font-bold text-on-surface mt-5 mb-8">
              {t('about.title')}
            </h1>
            <p className="text-body-lg text-on-surface-variant leading-relaxed mb-6">
              {t('about.description1')}
            </p>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              {t('about.description2')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface-container">
        <div className="container">
          <h2 className="font-headline text-display-md font-bold text-on-surface mb-16 text-center">
            {t('about.how_we_operate')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', title: t('about.pillar1_title'), desc: t('about.pillar1_desc') },
              { num: '02', title: t('about.pillar2_title'), desc: t('about.pillar2_desc') },
              { num: '03', title: t('about.pillar3_title'), desc: t('about.pillar3_desc') },
            ].map(pillar => (
              <div key={pillar.num} className="bg-surface-container-lowest p-8">
                <div className="w-16 h-16 bg-accent text-on-accent flex items-center justify-center font-headline text-2xl font-bold mb-4">
                  {pillar.num}
                </div>
                <h3 className="font-headline text-title-lg font-bold text-on-surface mb-4">{pillar.title}</h3>
                <p className="text-body-sm text-on-surface-variant">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-3xl">
          <h2 className="font-headline text-display-md font-bold text-on-surface mb-8">
            {t('about.leadership_title')}
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-8 leading-relaxed">
            {t('about.leadership_desc')}
          </p>
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-6 pb-8 border-b border-black border-opacity-10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-surface-container-lowest flex-shrink-0" />
                <div>
                  <h4 className="font-headline text-title-lg font-bold text-on-surface mb-1">
                    {t('about.team_member')} {i}
                  </h4>
                  <p className="text-body-sm text-on-surface-variant font-semibold mb-2">{t('about.team_role')}</p>
                  <p className="text-body-sm text-on-surface-variant">{t('about.team_bio')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-on-primary">
        <div className="container text-center">
          <h2 className="font-headline text-display-md font-bold mb-6">{t('about.cta_title')}</h2>
          <p className="text-body-lg text-on-primary opacity-90 mb-8 max-w-2xl mx-auto">{t('about.cta_desc')}</p>
          <Button href="/contact-us" variant="primary" size="lg" className="!bg-on-primary !text-primary hover:!bg-surface-container-low">
            {t('about.cta_button')}
          </Button>
        </div>
      </section>
    </div>
  );
}
