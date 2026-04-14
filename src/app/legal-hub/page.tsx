export const metadata = {
  title: 'Legal & Privacy | Reliance Brokerage',
  description: 'Terms of Service, Privacy Policy, and legal information',
};

export default function LegalHubPage() {
  return (
    <div className="bg-surface min-h-screen pt-24 pb-20">
      <div className="container max-w-3xl">
        {/* Navigation */}
        <div className="mb-16 flex gap-4 border-b border-black border-opacity-10 pb-6 sticky top-24 bg-surface">
          <a
            href="#terms"
            className="font-label font-semibold text-label-md text-on-surface-variant hover:text-on-surface"
          >
            Terms
          </a>
          <a
            href="#privacy"
            className="font-label font-semibold text-label-md text-on-surface-variant hover:text-on-surface"
          >
            Privacy
          </a>
        </div>

        {/* Terms of Service */}
        <section id="terms" className="mb-20 scroll-mt-32">
          <h1 className="font-headline text-display-md font-bold text-on-surface mb-8">
            Terms of Service
          </h1>

          <div className="space-y-8">
            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">
                1. Introduction
              </h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                These Terms of Service govern your use of the Reliance Brokerage website and
                services. By accessing and using this website, you acknowledge that you have read,
                understood, and agree to be bound by these terms.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">
                2. Use License
              </h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials (information
                or software) on Reliance Brokerage's website for personal, non-commercial transitory
                viewing only. This is the grant of a license, not a transfer of title.
              </p>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Under this license you may not:
              </p>
              <ul className="ml-6 mt-3 space-y-2">
                <li className="text-body-md text-on-surface-variant">
                  • Modify or copy the materials
                </li>
                <li className="text-body-md text-on-surface-variant">
                  • Use the materials for any commercial purpose or for any public display
                </li>
                <li className="text-body-md text-on-surface-variant">
                  • Attempt to decompile or reverse engineer any software
                </li>
                <li className="text-body-md text-on-surface-variant">
                  • Remove any copyright or other proprietary notations
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">
                3. Disclaimer
              </h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                The materials on Reliance Brokerage's website are provided "as is." Reliance
                Brokerage makes no warranties, expressed or implied, and hereby disclaims and
                negates all other warranties including, without limitation, implied warranties or
                conditions of merchantability, fitness for a particular purpose, or non-infringement
                of intellectual property or other violation of rights.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">
                4. Limitations
              </h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                In no event shall Reliance Brokerage or its suppliers be liable for any damages
                (including, without limitation, damages for loss of data or profit, or due to
                business interruption) arising out of the use or inability to use the materials on
                Reliance Brokerage's website.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy */}
        <section id="privacy" className="scroll-mt-32">
          <h1 className="font-headline text-display-md font-bold text-on-surface mb-8">
            Privacy Policy
          </h1>

          <div className="space-y-8">
            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">
                1. Information We Collect
              </h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed mb-4">
                We collect information you provide directly to us, such as:
              </p>
              <ul className="ml-6 mt-3 space-y-2">
                <li className="text-body-md text-on-surface-variant">
                  • Name, email address, and phone number
                </li>
                <li className="text-body-md text-on-surface-variant">
                  • Business information and financial data
                </li>
                <li className="text-body-md text-on-surface-variant">
                  • Payment and billing information
                </li>
                <li className="text-body-md text-on-surface-variant">
                  • Communication preferences
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services,
                process transactions, send transactional and promotional communications, and comply
                with applicable laws and regulations.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">
                3. Confidentiality & Security
              </h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Your privacy and the security of your information is our highest priority. We
                implement industry-standard encryption and security protocols to protect your data.
                We never sell your information to third parties.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">
                4. Data Retention
              </h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                We retain your information for as long as necessary to provide our services and
                comply with legal obligations. You may request deletion of your account at any time.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">
                5. Contact Us
              </h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                If you have questions about this Privacy Policy or our privacy practices, please
                contact us at{' '}
                <a
                  href="mailto:privacy@reliancebrokerage.my"
                  className="text-on-surface font-semibold hover:text-primary underline"
                >
                  privacy@reliancebrokerage.my
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
