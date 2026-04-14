'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

const Footer = () => {
  const { translate: t } = useLanguage();

  return (
    <footer className="bg-black text-white py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-headline font-bold text-headline-sm mb-4">
              Reliance Brokerage
            </h3>
            <p className="text-body-sm text-white opacity-75">
              Malaysia's premier institutional brokerage for high-value business transitions.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-label font-bold text-label-lg mb-4 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-body-sm">
              <li>
                <Link
                  href="/listings"
                  className="text-white opacity-75 hover:opacity-100 transition-opacity"
                >
                  {t('nav.listings')}
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-white opacity-75 hover:opacity-100 transition-opacity"
                >
                  {t('nav.how_it_works')}
                </Link>
              </li>
              <li>
                <Link
                  href="/valuations"
                  className="text-white opacity-75 hover:opacity-100 transition-opacity"
                >
                  {t('nav.valuations')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white opacity-75 hover:opacity-100 transition-opacity"
                >
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-label font-bold text-label-lg mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2 text-body-sm">
              <li>
                <Link
                  href="/legal-hub#terms"
                  className="text-white opacity-75 hover:opacity-100 transition-opacity"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/legal-hub#privacy"
                  className="text-white opacity-75 hover:opacity-100 transition-opacity"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-label font-bold text-label-lg mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <p className="text-body-sm text-white opacity-75">
              inquiries@reliancebrokerage.my
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white border-opacity-20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-body-sm text-white opacity-60">
            © 2010–{new Date().getFullYear()} Reliance Brokerage. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Social links can be added here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
