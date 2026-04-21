'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession, redirectForRole } from '@/hooks/useSession';
import Button from '@/components/ui/Button';

const Navigation = () => {
  const { currentLang, switchLanguage, translate: t } = useLanguage();
  const { user, loading, logout } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const navLinks = [
    { label: t('nav.listings'), href: '/listings' },
    { label: t('nav.how_it_works'), href: '/how-it-works' },
    { label: t('nav.valuations'), href: '/valuations' },
    { label: t('nav.about'), href: '/about-us' },
    { label: t('nav.contact'), href: '/contact-us' },
    { label: t('nav.legal'), href: '/legal-hub' },
  ];

  const toggleLanguage = () => switchLanguage(currentLang === 'en' ? 'zh' : 'en');

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    router.push('/');
    router.refresh();
  };

  if (!isLoaded) {
    return <nav className="nav-public" aria-label="Primary navigation" />;
  }

  const dashboardHref = user ? redirectForRole(user.role) : '/dashboard';
  const initials = user?.name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';

  return (
    <nav className="nav-public" aria-label="Primary navigation">
      <div className="nav-inner">
        <Link href="/" className="nav-brand flex items-center gap-2">
          <Image src="/logo.jpeg" alt="Reliance Brokerage" width={36} height={36} className="rounded-md" />
          <span>Reliance Brokerage</span>
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
            className="hidden lg:flex px-3 py-2 min-h-11 min-w-11 items-center justify-center text-label-xs font-bold text-black uppercase tracking-widest transition-colors hover:text-black focus:outline-accent focus:outline-2 focus:outline-offset-2"
            title="English / 中文"
          >
            <span>{currentLang === 'en' ? '中文' : 'English'}</span>
          </button>

          {loading ? null : user ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="hidden lg:flex items-center gap-2 px-3 py-2 hover:bg-surface-container rounded">
                <div className="w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold text-label-sm">
                  {initials}
                </div>
                <span className="text-label-sm font-semibold">{user.name.split(' ')[0]}</span>
                <Icon icon="mdi:chevron-down" style={{ width: '14px', height: '14px' }} />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={6}
                  className="bg-surface border border-outline-variant shadow-card py-2 min-w-[200px] z-50"
                >
                  <div className="px-4 py-2 border-b border-outline-variant">
                    <div className="text-body-sm font-semibold">{user.name}</div>
                    <div className="text-label-xs text-on-surface-variant capitalize">{user.role}</div>
                  </div>
                  <DropdownMenu.Item asChild>
                    <Link href={dashboardHref} className="block px-4 py-2 text-body-sm hover:bg-surface-container outline-none cursor-pointer">
                      <Icon icon="mdi:view-dashboard" className="inline mr-2" style={{ width: '16px', height: '16px' }} />
                      Dashboard
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={handleLogout}
                    className="px-4 py-2 text-body-sm text-error hover:bg-error hover:bg-opacity-10 outline-none cursor-pointer"
                  >
                    <Icon icon="mdi:logout" className="inline mr-2" style={{ width: '16px', height: '16px' }} />
                    Sign out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : (
            <>
              <Button href="/sign-in" variant="ghost" size="sm" className="hidden lg:inline-flex">
                {t('nav.sign_in')}
              </Button>
              <Button href="/register" variant="primary" size="sm" className="hidden lg:inline-flex">
                {t('nav.list_business')}
              </Button>
            </>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Open navigation"
            className="lg:hidden p-1 bg-transparent border-none cursor-pointer flex items-center justify-center"
          >
            <Icon
              icon={mobileMenuOpen ? 'mdi:close' : 'mdi:menu'}
              className="text-black"
              style={{ width: '28px', height: '28px' }}
            />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-surface border-b border-black border-opacity-5 p-6 flex flex-col gap-4 lg:hidden z-40">
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
          >
            {currentLang === 'en' ? '中文' : 'English'}
          </button>
          <div className="flex gap-3 mt-2 flex-col">
            {user ? (
              <>
                <Button href={dashboardHref} variant="primary" size="sm" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button href="/sign-in" variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav.sign_in')}
                </Button>
                <Button href="/register" variant="primary" size="sm" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav.list_business')}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
