'use client';

import { Icon } from '@iconify/react';
import { useLanguage } from '@/hooks/useLanguage';

export default function HowItWorksPage() {
  const { translate: t } = useLanguage();

  const steps = [
    { number: 1, title: t('process.steps.list'), description: t('process.steps.list_desc'), details: t('how_it_works.step1_details') as unknown as string[] },
    { number: 2, title: t('process.steps.screen'), description: t('process.steps.screen_desc'), details: t('how_it_works.step2_details') as unknown as string[] },
    { number: 3, title: t('process.steps.introduce'), description: t('process.steps.introduce_desc'), details: t('how_it_works.step3_details') as unknown as string[] },
    { number: 4, title: t('process.steps.due_diligence'), description: t('process.steps.due_diligence_desc'), details: t('how_it_works.step4_details') as unknown as string[] },
    { number: 5, title: t('process.steps.complete'), description: t('process.steps.complete_desc'), details: t('how_it_works.step5_details') as unknown as string[] },
  ];

  const timeline = [
    { label: t('how_it_works.week1_label'), phase: t('how_it_works.week1_phase'), desc: t('how_it_works.week1_desc') },
    { label: t('how_it_works.week2_label'), phase: t('how_it_works.week2_phase'), desc: t('how_it_works.week2_desc') },
    { label: t('how_it_works.week3_label'), phase: t('how_it_works.week3_phase'), desc: t('how_it_works.week3_desc') },
    { label: t('how_it_works.week4_label'), phase: t('how_it_works.week4_phase'), desc: t('how_it_works.week4_desc') },
    { label: t('how_it_works.week5_label'), phase: t('how_it_works.week5_phase'), desc: t('how_it_works.week5_desc') },
  ];

  return (
    <div className="bg-surface min-h-screen">
      <section className="pt-24 pb-12">
        <div className="container">
          <span className="eyebrow">{t('how_it_works.eyebrow')}</span>
          <h1 className="font-headline text-display-lg font-bold text-on-surface mt-5 mb-4">
            {t('process.title')}
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-3xl">
            {t('process.description')}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-start ${index % 2 === 1 ? '[&>:first-child]:md:order-2' : ''}`}
              >
                <div className="flex flex-col justify-center">
                  <div className="inline-flex items-baseline gap-4 mb-6">
                    <div className="w-20 h-20 bg-primary text-on-primary flex items-center justify-center font-headline text-5xl font-black flex-shrink-0">
                      {step.number}
                    </div>
                    <h2 className="font-headline text-display-sm font-bold text-on-surface">
                      {step.title}
                    </h2>
                  </div>
                  <p className="text-body-lg text-on-surface-variant mb-8 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-10">
                  <h4 className="font-label font-bold text-label-sm text-on-surface-variant uppercase tracking-widest mb-6">
                    {t('how_it_works.what_happens')}
                  </h4>
                  <ul className="space-y-4">
                    {Array.isArray(step.details) && step.details.map((detail, i) => (
                      <li key={i} className="flex gap-3">
                        <Icon icon="mdi:check-circle" className="text-accent flex-shrink-0" style={{ width: '20px', height: '20px' }} />
                        <span className="text-body-sm text-on-surface-variant leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface-container">
        <div className="container max-w-2xl">
          <h2 className="font-headline text-display-md font-bold text-on-surface mb-12 text-center">
            {t('how_it_works.typical_timeline')}
          </h2>
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-right flex-shrink-0 w-28">
                  <p className="font-headline font-bold text-on-surface">{item.label}</p>
                  <p className="text-body-sm text-on-surface-variant">{item.phase}</p>
                </div>
                <div className="w-1 bg-accent flex-shrink-0" />
                <div className={i < timeline.length - 1 ? 'pb-6' : ''}>
                  <p className="text-body-sm text-on-surface-variant">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
