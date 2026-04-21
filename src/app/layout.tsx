import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { SiteHeader, SiteFooter, SiteMain } from '@/components/layout/SiteChrome';
import './globals.css';

export const metadata: Metadata = {
  title: 'Reliance Brokerage | Institutional Grade Business Brokerage Malaysia',
  description: 'Reliance Brokerage — Malaysia\'s premier institutional brokerage for high-value business transitions, expert SME valuations, and confidential acquisitions.',
  openGraph: {
    title: 'Reliance Brokerage | Institutional Grade Business Brokerage Malaysia',
    description: 'Architectural stability for high-value business transitions. Serving Malaysia\'s most significant SME divestments and acquisitions since 2010.',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reliance Brokerage | Institutional Grade Business Brokerage Malaysia',
    description: 'Architectural stability for high-value business transitions. Serving Malaysia\'s most significant SME divestments and acquisitions since 2010.',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://cdn.tailwindcss.com" />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <SiteHeader />
        <SiteMain>{children}</SiteMain>
        <SiteFooter />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
