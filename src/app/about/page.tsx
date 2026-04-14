import Button from '@/components/ui/Button';

export const metadata = {
  title: 'About Us | Reliance Brokerage',
  description: 'Learn about Reliance Brokerage - Malaysia\'s institutional brokerage firm',
};

export default function AboutPage() {
  return (
    <div className="bg-surface">
      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="container">
          <div className="max-w-3xl">
            <span className="eyebrow">Our Story</span>
            <h1 className="font-headline text-display-lg font-bold text-on-surface mt-5 mb-8">
              Fifteen Years of Institutional Excellence
            </h1>
            <p className="text-body-lg text-on-surface-variant leading-relaxed mb-6">
              Since 2010, Reliance Brokerage has been Malaysia's quiet architect of high-value
              business transitions. We don't compete on noise; we compete on results.
            </p>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              Our reputation is built on three pillars: Deep local intelligence, Ironclad
              discretion, and Institutional-grade execution.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-surface-container">
        <div className="container">
          <h2 className="font-headline text-display-md font-bold text-on-surface mb-16 text-center">
            How We Operate
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-8">
              <div className="w-16 h-16 bg-accent text-on-accent flex items-center justify-center font-headline text-2xl font-bold mb-4">
                01
              </div>
              <h3 className="font-headline text-title-lg font-bold text-on-surface mb-4">
                Local Mastery
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                Our team knows every supply chain, every regulatory corner, every buyer preference
                in the Klang Valley and beyond.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-8">
              <div className="w-16 h-16 bg-accent text-on-accent flex items-center justify-center font-headline text-2xl font-bold mb-4">
                02
              </div>
              <h3 className="font-headline text-title-lg font-bold text-on-surface mb-4">
                Confidentiality First
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                Your transaction details are shielded with institutional protocols and legal
                safeguards. Nobody knows your business until you approve.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-8">
              <div className="w-16 h-16 bg-accent text-on-accent flex items-center justify-center font-headline text-2xl font-bold mb-4">
                03
              </div>
              <h3 className="font-headline text-title-lg font-bold text-on-surface mb-4">
                Results, Not Transactions
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                We succeed when your business finds the right buyer at the right valuation. Long-term
                relationships matter more than one-off deals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container max-w-3xl">
          <h2 className="font-headline text-display-md font-bold text-on-surface mb-8">
            Our Leadership
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-8 leading-relaxed">
            Our team comprises seasoned M&A professionals, financial analysts, and deal architects
            with deep roots in the Malaysian business ecosystem. Combined experience exceeds 200
            years in institutional finance.
          </p>

          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-6 pb-8 border-b border-black border-opacity-10">
                <div className="w-24 h-24 bg-surface-container-lowest flex-shrink-0" />
                <div>
                  <h4 className="font-headline text-title-lg font-bold text-on-surface mb-1">
                    Senior Team Member {i}
                  </h4>
                  <p className="text-body-sm text-on-surface-variant font-semibold mb-2">
                    Role & Responsibility
                  </p>
                  <p className="text-body-sm text-on-surface-variant">
                    Experience and expertise in institutional business advisory.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-on-primary">
        <div className="container text-center">
          <h2 className="font-headline text-display-md font-bold mb-6">
            Ready to Secure Your Business Legacy?
          </h2>
          <p className="text-body-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Let's discuss how Reliance Brokerage can help you navigate your next business transition.
          </p>
          <Button
            href="/register"
            variant="primary"
            size="lg"
            className="!bg-on-primary !text-primary hover:!bg-surface-container-low"
          >
            Schedule a Consultation
          </Button>
        </div>
      </section>
    </div>
  );
}
