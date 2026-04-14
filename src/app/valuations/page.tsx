import { Icon } from '@iconify/react';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Business Valuations | Reliance Brokerage',
  description: 'Expert SME business valuations tailored for institutional buyers in Malaysia',
};

export default function ValuationsPage() {
  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="container max-w-3xl">
        <div className="mb-12">
          <span className="eyebrow">Expert Valuation Services</span>
          <h1 className="font-headline text-display-lg font-bold text-on-surface mt-5 mb-4">
            Precision Valuations for Institutional Exits
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Our proprietary valuation framework goes beyond standard EBITDA multiples. We account
            for local market dynamics, supply chain positioning, and institutional buyer
            expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-surface-container-lowest p-8">
            <h3 className="font-headline text-title-lg font-bold text-on-surface mb-4">
              Standard Valuation Package
            </h3>
            <ul className="space-y-3 mb-8">
              <li className="flex gap-3">
                <Icon
                  icon="mdi:check-circle"
                  className="text-accent flex-shrink-0"
                  style={{ width: '20px', height: '20px' }}
                />
                <span className="text-body-sm text-on-surface-variant">
                  Comprehensive financial analysis
                </span>
              </li>
              <li className="flex gap-3">
                <Icon
                  icon="mdi:check-circle"
                  className="text-accent flex-shrink-0"
                  style={{ width: '20px', height: '20px' }}
                />
                <span className="text-body-sm text-on-surface-variant">
                  Market benchmarking and comps analysis
                </span>
              </li>
              <li className="flex gap-3">
                <Icon
                  icon="mdi:check-circle"
                  className="text-accent flex-shrink-0"
                  style={{ width: '20px', height: '20px' }}
                />
                <span className="text-body-sm text-on-surface-variant">
                  Executive summary report
                </span>
              </li>
            </ul>
            <Button variant="secondary" href="/register">
              Request Valuation
            </Button>
          </div>

          <div className="bg-surface-container-lowest p-8 border-2 border-accent">
            <div className="bg-accent text-on-accent px-3 py-1 inline-block mb-4">
              <span className="font-label font-bold text-label-sm">POPULAR</span>
            </div>
            <h3 className="font-headline text-title-lg font-bold text-on-surface mb-4">
              Institutional Package
            </h3>
            <ul className="space-y-3 mb-8">
              <li className="flex gap-3">
                <Icon
                  icon="mdi:check-circle"
                  className="text-accent flex-shrink-0"
                  style={{ width: '20px', height: '20px' }}
                />
                <span className="text-body-sm text-on-surface-variant">
                  Everything in Standard, plus:
                </span>
              </li>
              <li className="flex gap-3">
                <Icon
                  icon="mdi:check-circle"
                  className="text-accent flex-shrink-0"
                  style={{ width: '20px', height: '20px' }}
                />
                <span className="text-body-sm text-on-surface-variant">
                  Institutional buyer network consultation
                </span>
              </li>
              <li className="flex gap-3">
                <Icon
                  icon="mdi:check-circle"
                  className="text-accent flex-shrink-0"
                  style={{ width: '20px', height: '20px' }}
                />
                <span className="text-body-sm text-on-surface-variant">
                  Strategic positioning report
                </span>
              </li>
              <li className="flex gap-3">
                <Icon
                  icon="mdi:check-circle"
                  className="text-accent flex-shrink-0"
                  style={{ width: '20px', height: '20px' }}
                />
                <span className="text-body-sm text-on-surface-variant">
                  Exit timeline optimization
                </span>
              </li>
            </ul>
            <Button variant="primary" href="/register">
              Get Started
            </Button>
          </div>
        </div>

        <div className="bg-surface-container-highest p-12">
          <h2 className="font-headline text-headline-lg font-bold text-on-surface mb-6">
            Our Process
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary text-on-primary font-headline font-bold text-title-lg flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-headline font-bold text-on-surface mb-2">
                  Initial Consultation
                </h4>
                <p className="text-body-sm text-on-surface-variant">
                  We understand your business, goals, and timeline in a confidential meeting.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary text-on-primary font-headline font-bold text-title-lg flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-headline font-bold text-on-surface mb-2">
                  Financial Deep Dive
                </h4>
                <p className="text-body-sm text-on-surface-variant">
                  Our team analyzes 3–5 years of financials, contracts, and operational data.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary text-on-primary font-headline font-bold text-title-lg flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-headline font-bold text-on-surface mb-2">
                  Valuation Report & Discussion
                </h4>
                <p className="text-body-sm text-on-surface-variant">
                  Detailed report with valuation range, methodology, and market positioning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
