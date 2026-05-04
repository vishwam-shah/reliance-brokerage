'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { formatListingRmAmount } from '@/lib/utils';

type Listing = {
  _id: string;
  slug: string;
  title: string;
  sector: string;
  location: string;
  valuation: string;
  valuationNum: number;
  rentPrice: string;
  availableFor: ('buy' | 'rent')[];
  images?: string[];
  featured?: boolean;
};

export default function LatestListingsSection() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/listings?limit=6&sort=newest')
      .then((r) => r.json())
      .then((data) => setListings(data.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && listings.length === 0) return null;

  return (
    <section className="py-20 bg-surface">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="eyebrow">Latest Opportunities</span>
            <h2 className="font-headline text-display-sm sm:text-display-md font-bold text-on-surface mt-3">
              Featured Businesses for Sale
            </h2>
            <p className="text-body-md text-on-surface-variant mt-3 max-w-xl">
              Hand-picked opportunities from our verified seller network across Malaysia.
            </p>
          </div>
          <Link
            href="/listings"
            className="hidden sm:inline-flex items-center gap-2 font-label font-semibold text-label-md text-on-surface hover:text-accent transition-colors group"
          >
            View all listings
            <Icon
              icon="mdi:arrow-right"
              style={{ width: 18, height: 18 }}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-outline-variant rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-[16/10] bg-surface-container" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-surface-container rounded" />
                  <div className="h-5 w-3/4 bg-surface-container rounded" />
                  <div className="h-4 w-1/2 bg-surface-container rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {listings.map((listing) => {
              const valuationDisplay = formatListingRmAmount(listing.valuationNum, listing.valuation);

              return (
              <Link
                key={listing._id}
                href={`/listings/${listing.slug || listing._id}`}
                className="bg-white border border-outline-variant rounded-2xl overflow-hidden hover:shadow-modal hover:border-accent hover:-translate-y-1 transition-all duration-200 flex flex-col group"
              >
                <div className="relative aspect-[16/10] bg-surface-container overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon
                        icon="mdi:storefront-outline"
                        className="text-on-surface-variant opacity-30"
                        style={{ width: 48, height: 48 }}
                      />
                    </div>
                  )}
                  {listing.featured && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wider shadow-card">
                      ★ Featured
                    </span>
                  )}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    {listing.availableFor.includes('buy') && (
                      <span className="px-2 py-0.5 rounded-full bg-white/95 text-on-surface text-[10px] font-bold uppercase tracking-wider">
                        Sale
                      </span>
                    )}
                    {listing.availableFor.includes('rent') && (
                      <span className="px-2 py-0.5 rounded-full bg-white/95 text-on-surface text-[10px] font-bold uppercase tracking-wider">
                        Rent
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  <p className="text-label-xs font-semibold text-accent uppercase tracking-wider mb-2">
                    {listing.sector}
                  </p>
                  <h3 className="font-headline font-bold text-on-surface text-title-md mb-2 group-hover:text-accent transition-colors">
                    {listing.title}
                  </h3>
                  <p className="flex items-center gap-1 text-body-sm text-on-surface-variant mb-4">
                    <Icon icon="mdi:map-marker" style={{ width: 14, height: 14 }} />
                    {listing.location}
                  </p>

                  <div className="mt-auto pt-4 border-t border-outline-variant flex items-end justify-between gap-2">
                    <div>
                      <p className="text-label-xs text-on-surface-variant">
                        {valuationDisplay ? 'Asking Price' : listing.rentPrice ? 'Monthly Rent' : ''}
                      </p>
                      <p className="font-headline font-bold text-on-surface text-title-md">
                        {valuationDisplay || listing.rentPrice || '—'}
                      </p>
                    </div>
                    <Icon
                      icon="mdi:arrow-top-right"
                      className="text-on-surface-variant group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                      style={{ width: 22, height: 22 }}
                    />
                  </div>
                </div>
              </Link>
              );
            })}
          </motion.div>
        )}

        {/* Bottom CTA — works on all sizes */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/listings"
            style={{ color: '#ffffff' }}
            className="group inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-primary hover:bg-primary-dim font-semibold text-sm shadow-card hover:shadow-modal transition-all w-full sm:w-auto"
          >
            <span style={{ color: '#ffffff' }}>Browse All Listings</span>
            <Icon icon="mdi:arrow-right" style={{ width: 18, height: 18, color: '#ffffff' }} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
