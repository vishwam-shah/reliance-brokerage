'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { formatListingRmAmount } from '@/lib/utils';

const PAGE_SIZE = 9;

type Listing = {
  _id: string;
  slug: string;
  title: string;
  sector: string;
  location: string;
  valuation: string;
  valuationNum: number;
  revenue: string;
  revenueNum: number;
  rentPrice: string;
  availableFor: ('buy' | 'rent')[];
  images?: string[];
  featured?: boolean;
};

const SECTOR_OPTIONS = [
  'All',
  'F&B / Restaurant',
  'Retail',
  'Manufacturing',
  'Technology',
  'Healthcare',
  'Education',
  'Property / Real Estate',
  'Logistics / Transport',
  'Beauty / Wellness',
  'Services',
  'Agriculture',
  'Other',
];

export default function ListingsPage() {
  const { translate: t } = useLanguage();
  const { user } = useSession();
  const [sector, setSector] = useState('All');
  const [availability, setAvailability] = useState<'all' | 'buy' | 'rent'>('all');
  const [sort, setSort] = useState<'default' | 'valuation_asc' | 'valuation_desc' | 'revenue_desc'>('default');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    const ctrl = new AbortController();
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
      availability,
      sort,
    });
    if (search) params.set('search', search);
    if (sector && sector !== 'All') params.set('sector', sector);

    setLoading(true);
    fetch(`/api/listings?${params.toString()}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data) => {
        setListings(data.items ?? []);
        setTotal(data.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [page, sector, availability, sort, search]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (sector !== 'All') n++;
    if (availability !== 'all') n++;
    if (sort !== 'default') n++;
    return n;
  }, [sector, availability, sort]);

  const resetFilters = () => {
    setSector('All');
    setAvailability('all');
    setSort('default');
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const isSeller = user?.role === 'seller';

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* ── Hero header ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-on-surface via-on-surface to-[#3a302a] text-white">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="container relative py-12 sm:py-16">
          <span className="inline-block text-accent font-label font-semibold text-label-sm uppercase tracking-widest mb-3">
            {t('listings.eyebrow')}
          </span>
          <h1 className="font-headline text-display-md sm:text-display-lg font-bold leading-tight mb-4">
            Businesses For Sale
          </h1>
          <p className="text-body-md sm:text-body-lg text-white/70 max-w-2xl">
            Browse pre-screened business opportunities across Malaysia. Verified listings, transparent pricing,
            and no upfront fees.
          </p>

          {/* Search bar — prominent */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <Icon icon="mdi:magnify" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ width: 22, height: 22 }} />
              <input
                type="text"
                placeholder="Search by business name, sector, or location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-14 pl-12 pr-4 sm:pr-12 rounded-2xl bg-white text-on-surface text-body-md placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-accent shadow-modal"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
                  aria-label="Clear search"
                >
                  <Icon icon="mdi:close" style={{ width: 18, height: 18 }} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container">

        {/* ── Seller banner (only for non-sellers) ── */}
        {!isSeller && (
          <div className="mt-8 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border border-accent/20 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center flex-shrink-0">
              <Icon icon="mdi:storefront" className="text-accent" style={{ width: 24, height: 24 }} />
            </div>
            <div className="flex-1">
              <h3 className="font-headline font-bold text-on-surface text-title-md mb-0.5">Selling a business?</h3>
              <p className="text-body-sm text-on-surface-variant">
                List for free and reach thousands of verified buyers. Pay only 10% on successful close.
              </p>
            </div>
            <Link href="/sell-your-business" className="btn btn-primary btn-sm w-full sm:w-auto whitespace-nowrap">
              Start Selling
              <Icon icon="mdi:arrow-right" style={{ width: 16, height: 16 }} className="ml-1" />
            </Link>
          </div>
        )}

        {/* ── Filter bar ── */}
        <div className="mt-8">
          {/* Mobile filter toggle */}
          <div className="sm:hidden flex items-center justify-between mb-4">
            <p className="text-body-sm text-on-surface-variant">
              <span className="font-semibold text-on-surface">{total}</span> listings
            </p>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white border border-outline-variant text-sm font-medium text-on-surface"
            >
              <Icon icon="mdi:tune-vertical" style={{ width: 18, height: 18 }} />
              Filters
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-accent text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter panel — collapsible on mobile */}
          <div className={`bg-white border border-outline-variant rounded-2xl p-4 sm:p-5 mb-6 ${filtersOpen || 'hidden sm:block'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-label-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Sector
                </label>
                <div className="relative">
                  <select
                    className="w-full h-11 pl-3 pr-9 rounded-xl border border-outline-variant bg-white text-sm text-on-surface outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
                    value={sector}
                    onChange={(e) => { setSector(e.target.value); setPage(1); }}
                  >
                    {SECTOR_OPTIONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <Icon icon="mdi:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ width: 18, height: 18 }} />
                </div>
              </div>

              <div>
                <label className="block text-label-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Availability
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-surface-container">
                  {([
                    { v: 'all', label: 'All' },
                    { v: 'buy', label: 'Sale' },
                    { v: 'rent', label: 'Rent' },
                  ] as const).map(({ v, label }) => (
                    <button
                      key={v}
                      onClick={() => { setAvailability(v); setPage(1); }}
                      className={`h-9 rounded-lg text-xs font-semibold transition-colors ${
                        availability === v
                          ? 'bg-white text-on-surface shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-label-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Sort by
                </label>
                <div className="relative">
                  <select
                    className="w-full h-11 pl-3 pr-9 rounded-xl border border-outline-variant bg-white text-sm text-on-surface outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
                    value={sort}
                    onChange={(e) => { setSort(e.target.value as typeof sort); setPage(1); }}
                  >
                    <option value="default">Featured first</option>
                    <option value="valuation_asc">Price: Low to High</option>
                    <option value="valuation_desc">Price: High to Low</option>
                    <option value="revenue_desc">Highest Revenue</option>
                  </select>
                  <Icon icon="mdi:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ width: 18, height: 18 }} />
                </div>
              </div>
            </div>

            {(activeFilterCount > 0 || search) && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant">
                <p className="text-body-sm text-on-surface-variant">
                  <span className="font-semibold text-on-surface">{total}</span> result{total !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 text-label-sm font-semibold text-on-surface-variant hover:text-error transition-colors"
                >
                  <Icon icon="mdi:close-circle-outline" style={{ width: 16, height: 16 }} />
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Results header (desktop) ── */}
        {!loading && !filtersOpen && (
          <p className="hidden sm:block text-body-sm text-on-surface-variant mb-5">
            Showing <span className="font-semibold text-on-surface">{listings.length}</span> of{' '}
            <span className="font-semibold text-on-surface">{total}</span> listings
            {search && <> for &quot;<span className="font-semibold text-on-surface">{search}</span>&quot;</>}
          </p>
        )}

        {/* ── Results ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-outline-variant rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-surface-container" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-surface-container rounded" />
                  <div className="h-5 w-3/4 bg-surface-container rounded" />
                  <div className="h-4 w-1/2 bg-surface-container rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white border border-outline-variant rounded-2xl py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:magnify" className="text-on-surface-variant" style={{ width: 32, height: 32 }} />
            </div>
            <h3 className="font-headline font-bold text-on-surface text-title-lg mb-2">No listings found</h3>
            <p className="text-body-sm text-on-surface-variant mb-6 max-w-sm mx-auto">
              We couldn&apos;t find any listings matching your filters. Try adjusting your search or clearing filters.
            </p>
            <button onClick={resetFilters} className="btn btn-primary">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {listings.map((listing) => {
              const valuationDisplay = formatListingRmAmount(listing.valuationNum, listing.valuation);
              const revenueDisplay = formatListingRmAmount(listing.revenueNum, listing.revenue);

              return (
              <Link
                href={`/listings/${listing.slug || listing._id}`}
                key={listing._id}
                className="bg-white border border-outline-variant rounded-2xl overflow-hidden hover:shadow-modal hover:border-accent hover:-translate-y-1 transition-all duration-200 flex flex-col group"
              >
                {/* Image */}
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
                      <Icon icon="mdi:storefront-outline" className="text-on-surface-variant opacity-30" style={{ width: 48, height: 48 }} />
                    </div>
                  )}
                  {listing.featured && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wider shadow-card">
                      <Icon icon="mdi:star" style={{ width: 11, height: 11 }} />
                      Featured
                    </span>
                  )}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    {listing.availableFor.includes('buy') && (
                      <span className="px-2 py-0.5 rounded-full bg-white/95 text-on-surface text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        Sale
                      </span>
                    )}
                    {listing.availableFor.includes('rent') && (
                      <span className="px-2 py-0.5 rounded-full bg-white/95 text-on-surface text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        Rent
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-grow flex flex-col">
                  <p className="text-label-xs font-semibold text-accent uppercase tracking-wider mb-2">
                    {listing.sector}
                  </p>
                  <h3 className="font-headline font-bold text-on-surface text-title-md mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                    {listing.title}
                  </h3>
                  <p className="flex items-center gap-1 text-body-sm text-on-surface-variant mb-4">
                    <Icon icon="mdi:map-marker" style={{ width: 14, height: 14 }} />
                    {listing.location}
                  </p>

                  {/* Financials */}
                  <div className="space-y-2 mb-4">
                    {valuationDisplay && (
                      <div className="flex justify-between items-center text-body-sm">
                        <span className="text-on-surface-variant">Asking Price</span>
                        <span className="font-headline font-bold text-on-surface">{valuationDisplay}</span>
                      </div>
                    )}
                    {revenueDisplay && (
                      <div className="flex justify-between items-center text-body-sm">
                        <span className="text-on-surface-variant">Revenue</span>
                        <span className="font-semibold text-on-surface">{revenueDisplay}</span>
                      </div>
                    )}
                    {listing.rentPrice && (
                      <div className="flex justify-between items-center text-body-sm">
                        <span className="text-on-surface-variant">Monthly Rent</span>
                        <span className="font-semibold text-on-surface">{listing.rentPrice}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer CTA */}
                  <div className="mt-auto pt-4 border-t border-outline-variant flex items-center justify-between">
                    <span className="text-label-sm font-semibold text-on-surface group-hover:text-accent transition-colors">
                      View Details
                    </span>
                    <Icon
                      icon="mdi:arrow-right"
                      className="text-on-surface-variant group-hover:text-accent group-hover:translate-x-1 transition-all"
                      style={{ width: 18, height: 18 }}
                    />
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && !loading && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-10 w-10 rounded-xl flex items-center justify-center bg-white border border-outline-variant text-on-surface hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <Icon icon="mdi:chevron-left" style={{ width: 18, height: 18 }} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, i, arr) => (
                  <span key={p} className="contents">
                    {i > 0 && p - arr[i - 1] > 1 && (
                      <span className="px-1 text-on-surface-variant">…</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`h-10 min-w-[40px] px-3 rounded-xl font-label font-semibold text-sm transition-colors ${
                        page === p
                          ? 'bg-on-surface text-white shadow-card'
                          : 'bg-white border border-outline-variant text-on-surface hover:border-accent'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-10 w-10 rounded-xl flex items-center justify-center bg-white border border-outline-variant text-on-surface hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <Icon icon="mdi:chevron-right" style={{ width: 18, height: 18 }} />
            </button>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#1e293b] to-[#334155] p-8 sm:p-12 text-center">
          {/* Decorative accent glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <h2 className="font-headline text-headline-lg sm:text-display-sm font-bold text-white mb-3">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="text-body-md text-white/70 mb-8 max-w-xl mx-auto">
              Tell us what kind of business you&apos;re looking for and we&apos;ll match you with off-market opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white text-primary font-semibold text-sm hover:bg-white/90 shadow-lg transition-all"
              >
                <Icon icon="mdi:email-fast" style={{ width: 18, height: 18 }} />
                <span>Contact Our Team</span>
              </Link>
              <a
                href="https://wa.me/60142642414?text=Hello%20Reliance%20Brokerage%2C%20I%27m%20looking%20for%20a%20business%20to%20acquire."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#25D366]/90 shadow-lg transition-all"
              >
                <Icon icon="mdi:whatsapp" style={{ width: 18, height: 18 }} />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
