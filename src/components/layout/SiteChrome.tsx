'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';

function isAppRoute(pathname: string) {
  return pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
}

export function SiteHeader() {
  const pathname = usePathname();
  if (isAppRoute(pathname)) return null;
  return <Navigation />;
}

export function SiteFooter() {
  const pathname = usePathname();
  if (isAppRoute(pathname)) return null;
  return (
    <>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

export function SiteMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const appRoute = isAppRoute(pathname);
  return (
    <main
      id="main-content"
      className={appRoute ? 'app-main' : undefined}
    >
      {children}
    </main>
  );
}
