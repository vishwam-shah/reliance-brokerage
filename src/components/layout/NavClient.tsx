'use client';

import { usePathname } from 'next/navigation';

function isAppRoute(pathname: string) {
  return pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
}

export default function NavClient() {
  const pathname = usePathname();
  
  if (isAppRoute(pathname)) {
    return <div className="app-main" />;
  }
  
  return null;
}
