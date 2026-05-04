'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useSession } from '@/hooks/useSession';
import EnquiryForm from '@/components/public/EnquiryForm';

export default function SellYourBusinessPage() {
  const { user } = useSession();

  const isLoggedInSeller = user?.role === 'seller';
  const isLoggedInBuyer = user?.role === 'buyer';

  const benefits = [
    { icon: 'mdi:shield-check', title: 'Verified Buyers Only', desc: 'Every enquiry is screened by our team — no tyre-kickers.' },
    { icon: 'mdi:lock', title: 'Confidential Process', desc: 'Your business details are never shared without your approval.' },
    { icon: 'mdi:cash-multiple', title: 'No Upfront Fees', desc: 'List for free. Pay 10% commission only when your deal closes.' },
    { icon: 'mdi:account-tie', title: 'Advisory Support', desc: 'Help with valuation, due diligence and negotiation.' },
    { icon: 'mdi:speedometer', title: 'Fast Turnaround', desc: 'Average 5 weeks from listing to deal close.' },
    { icon: 'mdi:translate', title: 'Bilingual Service', desc: 'Full support in English and Mandarin.' },
  ];

  const steps = [
    { n: 1, title: 'Create Your Free Account', desc: 'Sign up as a seller in under 2 minutes — no credit card required.' },
    { n: 2, title: 'Post Your Listing', desc: 'Upload photos, financials, and a business description. Our team reviews within 24 hours.' },
    { n: 3, title: 'Get Approved & Go Live', desc: 'Once approved, your listing appears to thousands of pre-screened buyers.' },
    { n: 4, title: 'Receive Buyer Enquiries', desc: 'We forward only serious enquiries directly to your dashboard and WhatsApp.' },
    { n: 5, title: 'Close The Deal', desc: 'We facilitate due diligence, negotiation and paperwork. You only pay when the deal completes.' },
  ];

  const faqs = [
    {
      q: 'How much does it cost to list?',
      a: 'Listing your business is completely free. We only charge a 10% service fee on the final transaction value when your business is successfully sold or rented out.',
    },
    {
      q: 'Will my business identity stay confidential?',
      a: 'Yes. We never publish your contact information publicly. Buyer enquiries come through our platform, and we only forward them to you with your consent.',
    },
    {
      q: 'How long does it take to sell?',
      a: 'On average, businesses listed on Reliance Brokerage close within 5 weeks. The timeline depends on sector, asking price, and documentation readiness.',
    },
    {
      q: 'Do I need a valuation?',
      a: 'Not required, but recommended. We offer Standard (RM 2,500) and Institutional (RM 8,000) valuation packages — see our Valuations page.',
    },
    {
      q: 'Can I edit or remove my listing later?',
      a: 'Yes. You have full control from your seller dashboard — edit details, upload new photos, mark as sold, or remove anytime.',
    },
  ];

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Hero ── */}
      <section className="py-16 bg-gradient-to-br from-surface via-surface-container-low to-surface-container">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="eyebrow">For Business Owners</span>
              <h1 className="font-headline text-display-md sm:text-display-lg font-bold text-on-surface mt-5 mb-6 leading-tight">
                Sell or Rent Out Your Business with Confidence
              </h1>
              <p className="text-body-lg text-on-surface-variant mb-8 leading-relaxed">
                Reach pre-screened buyers across Malaysia. List your business in 5 minutes — pay nothing
                until your deal closes.
              </p>

              <div className="flex flex-wrap gap-3">
                {isLoggedInSeller ? (
                  <Link href="/dashboard" className="btn btn-primary btn-lg">
                    <Icon icon="mdi:plus" style={{ width: 20, height: 20 }} className="mr-1" />
                    Post a New Listing
                  </Link>
                ) : isLoggedInBuyer ? (
                  <Link href="/dashboard" className="btn btn-primary btn-lg">
                    <Icon icon="mdi:swap-horizontal" style={{ width: 20, height: 20 }} className="mr-1" />
                    Switch to Seller Account
                  </Link>
                ) : (
                  <>
                    <Link href="/register" className="btn btn-primary btn-lg">
                      <Icon icon="mdi:storefront" style={{ width: 20, height: 20 }} className="mr-1" />
                      List My Business — Free
                    </Link>
                    <Link href="/sign-in" className="btn btn-ghost btn-lg">
                      Already a seller? Sign in
                    </Link>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-8 text-body-sm text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <Icon icon="mdi:check-circle" className="text-accent" style={{ width: 18, height: 18 }} />
                  Free to list
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon icon="mdi:check-circle" className="text-accent" style={{ width: 18, height: 18 }} />
                  No upfront fees
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon icon="mdi:check-circle" className="text-accent" style={{ width: 18, height: 18 }} />
                  24-hour review
                </div>
              </div>
            </div>

            {/* Right side: stats card */}
            <div className="bg-white border border-outline-variant rounded-3xl p-8 shadow-card">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: 'RM 0', label: 'Upfront fee' },
                  { value: '10%', label: 'On successful close' },
                  { value: '24h', label: 'Listing review' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-headline font-bold text-headline-lg text-accent leading-none">{s.value}</p>
                    <p className="text-label-sm text-on-surface-variant mt-2">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-outline-variant">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent bg-opacity-15 flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:shield-star" className="text-accent" style={{ width: 22, height: 22 }} />
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface text-body-sm">Trusted Brokerage</p>
                    <p className="text-label-sm text-on-surface-variant mt-0.5">
                      Licensed by Reliance Brokerage Sales &amp; Negotiator
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <span className="eyebrow">Why sellers choose us</span>
            <h2 className="font-headline text-display-sm font-bold text-on-surface mt-4">
              Built for serious business owners
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white border border-outline-variant rounded-2xl p-6 hover:shadow-card transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-accent bg-opacity-10 flex items-center justify-center mb-4">
                  <Icon icon={b.icon} className="text-accent" style={{ width: 24, height: 24 }} />
                </div>
                <h3 className="font-headline font-bold text-on-surface text-title-md mb-2">{b.title}</h3>
                <p className="text-body-sm text-on-surface-variant">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-16 bg-surface-container">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <span className="eyebrow">How it works</span>
            <h2 className="font-headline text-display-sm font-bold text-on-surface mt-4">
              From listing to closing in 5 steps
            </h2>
          </div>
          <div className="space-y-4">
            {steps.map((s) => (
              <div key={s.n} className="bg-white border border-outline-variant rounded-2xl p-6 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary font-headline font-bold text-headline-sm flex items-center justify-center flex-shrink-0">
                  {s.n}
                </div>
                <div>
                  <h3 className="font-headline font-bold text-on-surface text-title-md mb-1">{s.title}</h3>
                  <p className="text-body-sm text-on-surface-variant">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing/Fee callout ── */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="bg-white border-l-4 border-accent rounded-r-2xl p-8 shadow-card">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-accent bg-opacity-15 flex items-center justify-center flex-shrink-0">
                <span className="font-headline font-bold text-accent text-headline-sm">10%</span>
              </div>
              <div className="flex-1">
                <h3 className="font-headline font-bold text-on-surface text-title-lg mb-2">
                  Pay only when you sell
                </h3>
                <p className="text-body-md text-on-surface-variant mb-4 leading-relaxed">
                  Listing is always free. We charge a flat 10% commission on the final transaction value
                  — payable only when your business is successfully sold or rented out.
                </p>
                <Link href="/legal-hub#terms" className="text-body-sm font-semibold text-accent hover:underline inline-flex items-center gap-1">
                  Read full terms
                  <Icon icon="mdi:arrow-right" style={{ width: 16, height: 16 }} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-surface-container">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <span className="eyebrow">Common questions</span>
            <h2 className="font-headline text-display-sm font-bold text-on-surface mt-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="bg-white border border-outline-variant rounded-2xl p-5 group [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer">
                  <span className="font-headline font-semibold text-on-surface text-title-sm pr-4">{f.q}</span>
                  <Icon
                    icon="mdi:plus"
                    className="text-on-surface-variant flex-shrink-0 group-open:rotate-45 transition-transform"
                    style={{ width: 22, height: 22 }}
                  />
                </summary>
                <p className="text-body-sm text-on-surface-variant mt-4 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 bg-primary">
        <div className="container max-w-4xl text-center">
          <h2 className="font-headline text-display-md font-bold text-on-primary mb-4">
            Ready to list your business?
          </h2>
          <p className="text-body-lg text-on-primary opacity-80 mb-8 max-w-2xl mx-auto">
            Join hundreds of business owners who&apos;ve found qualified buyers through Reliance Brokerage.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center max-w-3xl mx-auto">
            <div>
              {isLoggedInSeller ? (
                <Link href="/dashboard" className="btn btn-secondary btn-lg w-full sm:w-auto">
                  Go to Dashboard
                </Link>
              ) : (
                <Link href="/register" className="btn btn-secondary btn-lg w-full sm:w-auto">
                  Create Free Seller Account
                </Link>
              )}
              <p className="text-label-sm text-on-primary opacity-60 mt-3">
                Takes less than 2 minutes
              </p>
            </div>

            <span className="text-on-primary opacity-50 text-body-sm">— or —</span>

            <div>
              <a
                href="https://wa.me/60142642414?text=Hello%20Reliance%20Brokerage%2C%20I%27d%20like%20to%20discuss%20listing%20my%20business."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg w-full sm:w-auto bg-[#25D366] text-white hover:opacity-90"
              >
                <Icon icon="mdi:whatsapp" style={{ width: 20, height: 20 }} className="mr-1" />
                Talk to a Broker
              </a>
              <p className="text-label-sm text-on-primary opacity-60 mt-3">
                Speak to our team directly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Inline enquiry form (general lead capture) ── */}
      <section className="py-16">
        <div className="container max-w-2xl">
          <div className="text-center mb-8">
            <span className="eyebrow">Not ready to register?</span>
            <h2 className="font-headline text-headline-lg font-bold text-on-surface mt-3">
              Send us a quick enquiry instead
            </h2>
            <p className="text-body-md text-on-surface-variant mt-2">
              Tell us a bit about your business and we&apos;ll be in touch within 24 hours.
            </p>
          </div>
          <EnquiryForm
            defaultType="Sell"
            availableTypes={['Sell', 'Rent']}
          />
        </div>
      </section>
    </div>
  );
}
