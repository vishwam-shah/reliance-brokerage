'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import EnquiryForm from '@/components/public/EnquiryForm';
import { formatListingRmAmount } from '@/lib/utils';

const WHATSAPP_NUMBER = '60142642414';

type Listing = {
  _id: string;
  title: string;
  slug: string;
  sector: string;
  location: string;
  valuation: string;
  valuationNum: number;
  revenue: string;
  revenueNum: number;
  rentPrice: string;
  availableFor: ('buy' | 'rent')[];
  status: string;
  description: string;
  images: string[];
  featured: boolean;
  views: number;
  createdAt: string;
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params?.slug ?? '');
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/listings/${encodeURIComponent(slug)}`)
      .then(async (r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data?.listing) setListing(data.listing);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Icon icon="mdi:loading" className="animate-spin text-accent" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  if (notFound || !listing) {
    return (
      <div className="min-h-screen bg-surface py-12 sm:py-16">
        <div className="container max-w-2xl text-center py-20">
          <Icon icon="mdi:alert-circle-outline" className="text-on-surface-variant mx-auto mb-4" style={{ width: 64, height: 64 }} />
          <h1 className="font-headline text-display-sm font-bold text-on-surface mb-3">Listing not found</h1>
          <p className="text-body-md text-on-surface-variant mb-6">
            This listing may have been closed, removed, or the link is incorrect.
          </p>
          <button onClick={() => router.push('/listings')} className="btn btn-primary">
            Browse all listings
          </button>
        </div>
      </div>
    );
  }

  const cover = listing.images?.[activeImage];
  const wabuilder = (intent: 'buy' | 'rent') => {
    const action = intent === 'buy' ? 'purchase' : 'rent';
    const msg = `Hello Reliance Brokerage,\n\nI am interested to ${action}:\n\nListing: ${listing.title}\nSector: ${listing.sector}\nLocation: ${listing.location}\nLink: ${typeof window !== 'undefined' ? window.location.href : ''}\n\nPlease contact me.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const enquiryTypes: ('Buy' | 'Rent')[] = listing.availableFor
    .map((a) => (a === 'buy' ? 'Buy' : 'Rent') as 'Buy' | 'Rent');

  const valuationDisplay = formatListingRmAmount(listing.valuationNum, listing.valuation);
  const revenueDisplay = formatListingRmAmount(listing.revenueNum, listing.revenue);

  return (
    <div className="min-h-screen bg-surface py-12 sm:py-16">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="mb-6 text-body-sm">
          <Link href="/listings" className="text-on-surface-variant hover:text-on-surface inline-flex items-center gap-1">
            <Icon icon="mdi:chevron-left" style={{ width: 16, height: 16 }} />
            Back to listings
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">

          {/* ─── Left column: gallery + details ─── */}
          <div>

            {/* Gallery */}
            {listing.images && listing.images.length > 0 ? (
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="relative aspect-[16/10] bg-surface-container rounded-2xl overflow-hidden">
                  <img
                    src={cover}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  {listing.featured && (
                    <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-accent text-white text-label-xs font-bold uppercase tracking-wider shadow-card">
                      ★ Featured
                    </span>
                  )}
                </div>
                {listing.images.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
                    {listing.images.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          i === activeImage ? 'border-accent' : 'border-transparent hover:border-outline-variant'
                        }`}
                      >
                        <img src={src} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[16/10] bg-surface-container rounded-2xl flex items-center justify-center">
                <Icon icon="mdi:image-outline" className="text-on-surface-variant opacity-30" style={{ width: 64, height: 64 }} />
              </div>
            )}

            {/* Title block */}
            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-primary text-on-primary text-label-xs font-semibold uppercase tracking-wider rounded-full">
                  {listing.sector}
                </span>
                {listing.availableFor.includes('buy') && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-label-xs font-semibold uppercase tracking-wider rounded-full">
                    For Sale
                  </span>
                )}
                {listing.availableFor.includes('rent') && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-label-xs font-semibold uppercase tracking-wider rounded-full">
                    For Rent
                  </span>
                )}
              </div>
              <h1 className="font-headline text-display-sm sm:text-display-md font-bold text-on-surface">
                {listing.title}
              </h1>
              <p className="flex items-center gap-2 text-body-md text-on-surface-variant mt-3">
                <Icon icon="mdi:map-marker" className="text-accent" style={{ width: 18, height: 18 }} />
                {listing.location}
                <span className="mx-2 text-outline-variant">·</span>
                <Icon icon="mdi:eye-outline" style={{ width: 16, height: 16 }} />
                {listing.views.toLocaleString()} views
              </p>
            </div>

            {/* Financial highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {valuationDisplay && (
                <div className="bg-white border border-outline-variant rounded-2xl p-5">
                  <p className="text-label-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-2">
                    Asking Price
                  </p>
                  <p className="font-headline font-bold text-on-surface text-headline-sm">{valuationDisplay}</p>
                </div>
              )}
              {revenueDisplay && (
                <div className="bg-white border border-outline-variant rounded-2xl p-5">
                  <p className="text-label-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-2">
                    Annual Revenue
                  </p>
                  <p className="font-headline font-bold text-on-surface text-headline-sm">{revenueDisplay}</p>
                </div>
              )}
              {listing.rentPrice && (
                <div className="bg-white border border-outline-variant rounded-2xl p-5">
                  <p className="text-label-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-2">
                    Monthly Rental
                  </p>
                  <p className="font-headline font-bold text-on-surface text-headline-sm">{listing.rentPrice}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-10">
              <h2 className="font-headline text-title-lg font-bold text-on-surface mb-4">About this Business</h2>
              {listing.description ? (
                <p className="text-body-md text-on-surface leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              ) : (
                <p className="text-body-sm text-on-surface-variant italic">
                  No detailed description provided. Submit an enquiry to request more information.
                </p>
              )}
            </div>

            {/* Trust signals */}
            <div className="bg-white border border-outline-variant rounded-2xl p-6 mt-10">
              <h3 className="font-headline font-bold text-on-surface mb-4 text-title-md">Why use Reliance Brokerage</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: 'mdi:shield-check', label: 'Pre-screened sellers', desc: 'All listings are verified by our team' },
                  { icon: 'mdi:lock', label: 'Confidential', desc: 'Your enquiry is shared only with the seller' },
                  { icon: 'mdi:cash-multiple', label: 'No upfront fees', desc: '10% only on successful close' },
                  { icon: 'mdi:account-tie', label: 'Advisory support', desc: 'Help with valuation, due diligence & paperwork' },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <Icon icon={item.icon} className="text-accent flex-shrink-0 mt-0.5" style={{ width: 22, height: 22 }} />
                    <div>
                      <p className="font-semibold text-on-surface text-body-sm">{item.label}</p>
                      <p className="text-label-sm text-on-surface-variant">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Right column: enquiry sidebar ─── */}
          <aside>
            <div className="lg:sticky lg:top-24 space-y-4">
              <EnquiryForm
                listingId={listing._id}
                listingTitle={listing.title}
                defaultType={listing.availableFor.includes('buy') ? 'Buy' : 'Rent'}
                availableTypes={enquiryTypes.length ? enquiryTypes : ['Buy']}
              />

              {/* WhatsApp quick contact */}
              <div className="bg-white border border-outline-variant rounded-2xl p-5">
                <p className="text-label-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-3">
                  Or contact us directly
                </p>
                <div className="space-y-2">
                  {listing.availableFor.includes('buy') && (
                    <a
                      href={wabuilder('buy')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 h-10 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      <Icon icon="mdi:whatsapp" style={{ width: 18, height: 18 }} />
                      WhatsApp to buy
                    </a>
                  )}
                  {listing.availableFor.includes('rent') && (
                    <a
                      href={wabuilder('rent')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 h-10 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      <Icon icon="mdi:whatsapp" style={{ width: 18, height: 18 }} />
                      WhatsApp to rent
                    </a>
                  )}
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
