'use client';

import { Icon } from '@iconify/react';
import { useLanguage } from '@/hooks/useLanguage';

export default function HowItWorksPage() {
  const { translate: t } = useLanguage();

  const steps = [
    {
      number: 1,
      title: t('process.steps.list'),
      description: t('process.steps.list_desc'),
      details: [
        'Confidential initial consultation',
        'Business documentation review',
        'Anonymous listing creation',
        'Private network distribution',
      ],
    },
    {
      number: 2,
      title: t('process.steps.screen'),
      description: t('process.steps.screen_desc'),
      details: [
        'Financial viability assessment',
        'Capital readiness verification',
        'Buyer profile matching',
        'Preliminary interest evaluation',
      ],
    },
    {
      number: 3,
      title: t('process.steps.introduce'),
      description: t('process.steps.introduce_desc'),
      details: [
        'Controlled introduction meetings',
        'Synergy assessment',
        'Strategic alignment review',
        'Non-disclosure agreement execution',
      ],
    },
    {
      number: 4,
      title: t('process.steps.due_diligence'),
      description: t('process.steps.due_diligence_desc'),
      details: [
        'Financial audit and analysis',
        'Legal and compliance review',
        'Asset and IP verification',
        'Liability assessment',
      ],
    },
    {
      number: 5,
      title: t('process.steps.complete'),
      description: t('process.steps.complete_desc'),
      details: [
        'Binding agreement negotiation',
        'Legal documentation finalization',
        'Institutional escrow setup',
        'Secure funds transfer',
      ],
    },
  ];

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-12">
        <div className="container">
          <span className="eyebrow">Our Framework</span>
          <h1 className="font-headline text-display-lg font-bold text-on-surface mt-5 mb-4">
            {t('process.title')}
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-3xl">
            {t('process.description')}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="container">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-start ${
                  index % 2 === 1 ? 'md:grid-cols-2 [&>:first-child]:md:order-2' : ''
                }`}
              >
                {/* Left: Number & Title */}
                <div className="flex flex-col justify-center">
                  <div className="inline-flex items-baseline gap-4 mb-6">
                    <div className="w-20 h-20 bg-primary text-on-primary flex items-center justify-center font-headline text-5xl font-black">
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

                {/* Right: Details */}
                <div className="bg-surface-container-lowest p-10">
                  <h4 className="font-label font-bold text-label-sm text-on-surface-variant uppercase tracking-widest mb-6">
                    What Happens
                  </h4>
                  <ul className="space-y-4">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex gap-3">
                        <Icon
                          icon="mdi:check-circle"
                          className="text-accent flex-shrink-0"
                          style={{ width: '20px', height: '20px' }}
                        />
                        <span className="text-body-sm text-on-surface-variant leading-relaxed">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-surface-container">
        <div className="container max-w-2xl">
          <h2 className="font-headline text-display-md font-bold text-on-surface mb-12 text-center">
            Typical Timeline
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="text-right flex-shrink-0">
                <p className="font-headline font-bold text-on-surface">Week 1–2</p>
                <p className="text-body-sm text-on-surface-variant">Initial Setup</p>
              </div>
              <div className="w-1 bg-accent" />
              <div className="pb-6">
                <p className="text-body-sm text-on-surface-variant">
                  Confidential consultation and preliminary documentation gathering.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-right flex-shrink-0">
                <p className="font-headline font-bold text-on-surface">Week 3–6</p>
                <p className="text-body-sm text-on-surface-variant">Buyer Screening</p>
              </div>
              <div className="w-1 bg-accent" />
              <div className="pb-6">
                <p className="text-body-sm text-on-surface-variant">
                  Anonymous listing circulated to qualified institutional buyers.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-right flex-shrink-0">
                <p className="font-headline font-bold text-on-surface">Week 7–14</p>
                <p className="text-body-sm text-on-surface-variant">Meetings & LOI</p>
              </div>
              <div className="w-1 bg-accent" />
              <div className="pb-6">
                <p className="text-body-sm text-on-surface-variant">
                  Controlled buyer meetings and letter of intent negotiation.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-right flex-shrink-0">
                <p className="font-headline font-bold text-on-surface">Week 15–24</p>
                <p className="text-body-sm text-on-surface-variant">Due Diligence</p>
              </div>
              <div className="w-1 bg-accent" />
              <div className="pb-6">
                <p className="text-body-sm text-on-surface-variant">
                  Comprehensive financial, legal, and operational due diligence.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-right flex-shrink-0">
                <p className="font-headline font-bold text-on-surface">Week 25–28</p>
                <p className="text-body-sm text-on-surface-variant">Closing</p>
              </div>
              <div className="w-1 bg-accent" />
              <div>
                <p className="text-body-sm text-on-surface-variant">
                  Final agreements, legal execution, and institutional escrow transfer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
