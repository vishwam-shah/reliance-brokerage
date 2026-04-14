'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/Button';

const Navigation = () => {
  const { currentLang, switchLanguage, translate: t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const navLinks = [
    { label: t('nav.listings'), href: '/listings' },
    { label: t('nav.how_it_works'), href: '/how-it-works' },
    { label: t('nav.valuations'), href: '/valuations' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.legal'), href: '/legal-hub' },
  ];

  const toggleLanguage = () => {
    switchLanguage(currentLang === 'en' ? 'zh' : 'en');
  };

  if (!isLoaded) {
    return <nav className="nav-public" aria-label="Primary navigation" />;
  }

  return (
    <nav className="nav-public" aria-label="Primary navigation">
      <div className="nav-inner">
        <Link href="/" className="nav-brand">
          Reliance Brokerage
        </Link>

        <ul className="nav-links" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-on-surface">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="hidden sm:flex px-3 py-2 min-h-11 min-w-11 items-center justify-center text-label-xs font-bold text-black uppercase tracking-widest transition-colors hover:text-black focus:outline-accent focus:outline-2 focus:outline-offset-2"
            title="English / 中文"
          >
            <span>{currentLang === 'en' ? '中文' : 'English'}</span>
          </button>
          <Button href="/sign-in" variant="ghost" size="sm" className="hidden md:inline-flex">
            {t('nav.sign_in')}
          </Button>
          <Button href="/register" variant="primary" size="sm" className="hidden md:inline-flex">
            {t('nav.list_business')}
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Open navigation"
            className="md:hidden p-1 bg-transparent border-none cursor-pointer flex items-center justify-center"
          >
            <Icon
              icon={mobileMenuOpen ? 'mdi:close' : 'mdi:menu'}
              className="text-black"
              style={{ width: '28px', height: '28px' }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-surface border-b border-black border-opacity-5 p-6 flex flex-col gap-4 md:hidden z-40">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-label font-semibold text-label-sm text-black uppercase tracking-widest hover:text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              toggleLanguage();
              setMobileMenuOpen(false);
            }}
            className="font-label font-semibold text-label-sm text-black uppercase tracking-widest hover:text-black text-left"
            title="English / 中文"
          >
            {currentLang === 'en' ? '中文' : 'English'}
          </button>
          <div className="flex gap-3 mt-2 flex-col">
            <Button href="/sign-in" variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
              {t('nav.sign_in')}
            </Button>
            <Button href="/register" variant="primary" size="sm" onClick={() => setMobileMenuOpen(false)}>
              {t('nav.list_business')}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
