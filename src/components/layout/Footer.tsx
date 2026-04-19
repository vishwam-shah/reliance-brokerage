'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useLanguage } from '@/hooks/useLanguage';

const WHATSAPP_NUMBER = '60142642414';
const FACEBOOK_URL = 'https://www.facebook.com/share/1AzzSAjE4m/';
const EMAIL = 'contactus@reliancebrokerage.my';

const Footer = () => {
  const { translate: t } = useLanguage();

  return (
    <footer className="bg-black text-white py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.jpeg" alt="Reliance Brokerage" width={40} height={40} className="rounded-md" />
              <h3 className="font-headline font-bold text-headline-sm">Reliance Brokerage</h3>
            </div>
            <p className="text-body-sm text-white opacity-75 mb-6">{t('footer.company_desc')}</p>
            <div className="flex gap-3">
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 bg-[#1877F2] flex items-center justify-center hover:opacity-80 transition-opacity">
                <Icon icon="mdi:facebook" className="text-white" style={{ width: '20px', height: '20px' }} />
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-9 h-9 bg-[#25D366] flex items-center justify-center hover:opacity-80 transition-opacity">
                <Icon icon="mdi:whatsapp" className="text-white" style={{ width: '20px', height: '20px' }} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-label font-bold text-label-lg mb-4 uppercase tracking-wider">{t('footer.nav_heading')}</h4>
            <ul className="space-y-2 text-body-sm">
              <li><Link href="/listings" className="text-white opacity-75 hover:opacity-100 transition-opacity">{t('nav.listings')}</Link></li>
              <li><Link href="/how-it-works" className="text-white opacity-75 hover:opacity-100 transition-opacity">{t('nav.how_it_works')}</Link></li>
              <li><Link href="/valuations" className="text-white opacity-75 hover:opacity-100 transition-opacity">{t('nav.valuations')}</Link></li>
              <li><Link href="/about-us" className="text-white opacity-75 hover:opacity-100 transition-opacity">{t('nav.about')}</Link></li>
              <li><Link href="/contact-us" className="text-white opacity-75 hover:opacity-100 transition-opacity">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-label font-bold text-label-lg mb-4 uppercase tracking-wider">{t('footer.legal_heading')}</h4>
            <ul className="space-y-2 text-body-sm">
              <li><Link href="/legal-hub#terms" className="text-white opacity-75 hover:opacity-100 transition-opacity">{t('footer.terms')}</Link></li>
              <li><Link href="/legal-hub#privacy" className="text-white opacity-75 hover:opacity-100 transition-opacity">{t('footer.privacy')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-label font-bold text-label-lg mb-4 uppercase tracking-wider">{t('footer.contact_heading')}</h4>
            <div className="space-y-3">
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-body-sm text-white opacity-75 hover:opacity-100 transition-opacity">
                <Icon icon="mdi:email" style={{ width: '16px', height: '16px' }} />
                {EMAIL}
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-body-sm text-white opacity-75 hover:opacity-100 transition-opacity">
                <Icon icon="mdi:whatsapp" style={{ width: '16px', height: '16px' }} />
                +60 14-264 2414
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white border-opacity-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-body-sm text-white opacity-60">
            © 2010–{new Date().getFullYear()} Reliance Brokerage. {t('footer.copyright')}
          </p>
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-label-xs text-white opacity-60 hover:opacity-100 transition-opacity uppercase tracking-widest">
            <Icon icon="mdi:facebook" style={{ width: '14px', height: '14px' }} />
            Reliance Brokerage Sales & Negotiator
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
