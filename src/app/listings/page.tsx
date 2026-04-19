'use client';

import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { useLanguage } from '@/hooks/useLanguage';

const WHATSAPP_NUMBER = '60142642414';
const PAGE_SIZE = 6;

const ALL_LISTINGS = [
  { id: 1, title: 'Premium Manufacturing Facility', sector: 'Manufacturing', location: 'Klang Valley', valuation: 45, valuationLabel: 'RM 45M', revenue: 120, revenueLabel: 'RM 120M', rentPrice: 'RM 180K/mo', availableFor: ['buy', 'rent'] as ('buy'|'rent')[] },
  { id: 2, title: 'Tech Logistics Hub', sector: 'Logistics', location: 'Shah Alam', valuation: 28, valuationLabel: 'RM 28M', revenue: 85, revenueLabel: 'RM 85M', rentPrice: 'RM 95K/mo', availableFor: ['buy', 'rent'] as ('buy'|'rent')[] },
  { id: 3, title: 'Distribution Network', sector: 'Distribution', location: 'Petaling Jaya', valuation: 32, valuationLabel: 'RM 32M', revenue: 95, revenueLabel: 'RM 95M', rentPrice: '', availableFor: ['buy'] as ('buy'|'rent')[] },
  { id: 4, title: 'F&B Franchise Chain', sector: 'F&B', location: 'Klang Valley', valuation: 12, valuationLabel: 'RM 12M', revenue: 38, revenueLabel: 'RM 38M', rentPrice: 'RM 40K/mo', availableFor: ['buy', 'rent'] as ('buy'|'rent')[] },
  { id: 5, title: 'Retail Portfolio', sector: 'Retail', location: 'Kuala Lumpur', valuation: 18, valuationLabel: 'RM 18M', revenue: 55, revenueLabel: 'RM 55M', rentPrice: '', availableFor: ['buy'] as ('buy'|'rent')[] },
  { id: 6, title: 'Healthcare Clinic Group', sector: 'Healthcare', location: 'Shah Alam', valuation: 22, valuationLabel: 'RM 22M', revenue: 60, revenueLabel: 'RM 60M', rentPrice: 'RM 70K/mo', availableFor: ['buy', 'rent'] as ('buy'|'rent')[] },
  { id: 7, title: 'IT Services Company', sector: 'Technology', location: 'Cyberjaya', valuation: 15, valuationLabel: 'RM 15M', revenue: 42, revenueLabel: 'RM 42M', rentPrice: '', availableFor: ['buy'] as ('buy'|'rent')[] },
  { id: 8, title: 'Cold Chain Logistics', sector: 'Logistics', location: 'Port Klang', valuation: 38, valuationLabel: 'RM 38M', revenue: 110, revenueLabel: 'RM 110M', rentPrice: 'RM 130K/mo', availableFor: ['buy', 'rent'] as ('buy'|'rent')[] },
];

const SECTORS = ['All', ...Array.from(new Set(ALL_LISTINGS.map(l => l.sector)))];

export default function ListingsPage() {
  const { translate: t } = useLanguage();
  const [userType, setUserType] = useState<'buyer' | 'seller'>('buyer');
  const [sector, setSector] = useState('All');
  const [availability, setAvailability] = useState<'all' | 'buy' | 'rent'>('all');
  const [sort, setSort] = useState<'default' | 'valuation_asc' | 'valuation_desc' | 'revenue_desc'>('default');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = [...ALL_LISTINGS];
    if (search) list = list.filter(l => l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase()));
    if (sector !== 'All') list = list.filter(l => l.sector === sector);
    if (availability !== 'all') list = list.filter(l => l.availableFor.includes(availability));
    if (sort === 'valuation_asc') list.sort((a, b) => a.valuation - b.valuation);
    if (sort === 'valuation_desc') list.sort((a, b) => b.valuation - a.valuation);
    if (sort === 'revenue_desc') list.sort((a, b) => b.revenue - a.revenue);
    return list;
  }, [search, sector, availability, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = () => { setSector('All'); setAvailability('all'); setSort('default'); setSearch(''); setPage(1); };

  const buildWhatsAppMsg = (listing: typeof ALL_LISTINGS[0], intent: 'buy' | 'rent' | 'sell') => {
    const action = intent === 'buy' ? 'purchase' : intent === 'rent' ? 'rent' : 'list for sale/rent';
    const msg = `Hello Reliance Brokerage,\n\nI am interested to ${action}:\n\nListing: ${listing.title}\nSector: ${listing.sector}\nLocation: ${listing.location}\nValuation: ${listing.valuationLabel}\n\nPlease contact me.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="container">
        {/* Header */}
        <div className="mb-10">
          <span className="eyebrow">{t('listings.eyebrow')}</span>
          <h1 className="font-headline text-display-lg font-bold text-on-surface mt-5 mb-4">{t('listings.title')}</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">{t('listings.description')}</p>
        </div>

        {/* Buyer / Seller Toggle */}
        <div className="flex gap-2 mb-8 p-1 bg-surface-container-lowest border border-outline-variant rounded-lg w-fit">
          {(['buyer', 'seller'] as const).map(type => (
            <button key={type} onClick={() => setUserType(type)}
              className={`px-6 py-2 rounded-md font-label font-semibold text-label-sm uppercase tracking-widest transition-all ${userType === type ? 'bg-primary text-on-primary shadow-card' : 'text-on-surface-variant hover:text-on-surface'}`}>
              {type === 'buyer' ? t('listings.i_am_buyer') : t('listings.i_am_seller')}
            </button>
          ))}
        </div>

        {/* Seller CTA */}
        {userType === 'seller' && (
          <div className="mb-10 bg-surface-container-lowest border-l-4 border-accent p-8">
            <h3 className="font-headline text-title-lg font-bold text-on-surface mb-2">{t('listings.list_your_business')}</h3>
            <p className="text-body-sm text-on-surface-variant mb-6">{t('listings.list_desc')}</p>
            <div className="flex flex-wrap gap-3">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello,\n\nI would like to list my business for SALE.\n\nPlease contact me.')}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <Icon icon="mdi:storefront" style={{ width: '18px', height: '18px' }} className="mr-2" /> {t('listings.sell_my_business')}
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello,\n\nI would like to list my business for RENT.\n\nPlease contact me.')}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                <Icon icon="mdi:key-variant" style={{ width: '18px', height: '18px' }} className="mr-2" /> {t('listings.rent_my_business')}
              </a>
            </div>
          </div>
        )}

        {/* Filters + Search */}
        <div className="bg-surface-container-lowest border border-outline-variant p-5 mb-8 flex flex-wrap gap-4 items-end">
          {/* Search */}
          <div className="flex-1 min-w-[180px]">
            <label className="form-label mb-1">{t('listings.search_label')}</label>
            <div className="relative">
              <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ width: '18px', height: '18px' }} />
              <input type="text" className="form-input pl-9" placeholder={t('listings.search_placeholder')} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>

          {/* Sector */}
          <div className="min-w-[140px]">
            <label className="form-label mb-1">{t('listings.sector_label')}</label>
            <select className="form-input" value={sector} onChange={e => { setSector(e.target.value); setPage(1); }}>
              {SECTORS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Availability */}
          <div className="min-w-[140px]">
            <label className="form-label mb-1">{t('listings.availability_label')}</label>
            <select className="form-input" value={availability} onChange={e => { setAvailability(e.target.value as any); setPage(1); }}>
              <option value="all">{t('listings.avail_all')}</option>
              <option value="buy">{t('listings.avail_buy')}</option>
              <option value="rent">{t('listings.avail_rent')}</option>
            </select>
          </div>

          {/* Sort */}
          <div className="min-w-[160px]">
            <label className="form-label mb-1">{t('listings.sort_label')}</label>
            <select className="form-input" value={sort} onChange={e => { setSort(e.target.value as any); setPage(1); }}>
              <option value="default">{t('listings.sort_default')}</option>
              <option value="valuation_asc">{t('listings.sort_val_asc')}</option>
              <option value="valuation_desc">{t('listings.sort_val_desc')}</option>
              <option value="revenue_desc">{t('listings.sort_rev_desc')}</option>
            </select>
          </div>

          <button onClick={resetFilters} className="btn btn-ghost btn-sm self-end">
            <Icon icon="mdi:filter-remove" style={{ width: '16px', height: '16px' }} className="mr-1" /> {t('listings.reset')}
          </button>
        </div>

        {/* Results count */}
        <p className="text-body-sm text-on-surface-variant mb-6">
          {t('listings.showing')} {paginated.length} {t('listings.of')} {filtered.length} {t('listings.listings_label')}
        </p>

        {/* Grid */}
        {paginated.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <Icon icon="mdi:magnify" style={{ width: '48px', height: '48px' }} className="mx-auto mb-4 opacity-30" />
            <p className="text-body-lg">{t('listings.no_results')}</p>
            <button onClick={resetFilters} className="btn btn-ghost mt-4">{t('listings.clear_filters')}</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {paginated.map(listing => (
              <div key={listing.id} className="bg-surface-container-lowest border border-outline-variant hover:shadow-card transition-shadow flex flex-col h-full">
                <div className="p-8 flex-grow">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-primary text-on-primary text-label-xs font-semibold uppercase tracking-wider mb-3">{listing.sector}</span>
                    <h3 className="font-headline text-title-lg font-bold text-on-surface mb-2">{listing.title}</h3>
                    <p className="text-body-sm text-on-surface-variant flex items-center gap-1">
                      <Icon icon="mdi:map-marker" style={{ width: '14px', height: '14px' }} className="text-accent" />
                      {listing.location}
                    </p>
                  </div>

                  <div className="bg-surface-container py-4 px-4 space-y-3">
                    <div>
                      <p className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">{t('listings.enterprise_value')}</p>
                      <p className="text-title-lg font-bold text-on-surface">{listing.valuationLabel}</p>
                    </div>
                    <div>
                      <p className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">{t('listings.annual_revenue')}</p>
                      <p className="text-title-lg font-bold text-on-surface">{listing.revenueLabel}</p>
                    </div>
                    {listing.rentPrice && (
                      <div>
                        <p className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">{t('listings.rental_price')}</p>
                        <p className="text-title-lg font-bold text-on-surface">{listing.rentPrice}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    {listing.availableFor.includes('buy') && <span className="px-2 py-1 bg-surface-container text-label-xs font-semibold text-on-surface-variant uppercase rounded">{t('listings.for_sale')}</span>}
                    {listing.availableFor.includes('rent') && <span className="px-2 py-1 bg-accent bg-opacity-10 text-label-xs font-semibold text-accent uppercase rounded">{t('listings.for_rent')}</span>}
                  </div>
                </div>

                <div className="px-8 pb-8 flex gap-3">
                  {userType === 'buyer' ? (
                    <>
                      {listing.availableFor.includes('buy') && (
                        <a href={buildWhatsAppMsg(listing, 'buy')} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm flex-1 text-center">{t('listings.buy')}</a>
                      )}
                      {listing.availableFor.includes('rent') && (
                        <a href={buildWhatsAppMsg(listing, 'rent')} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm flex-1 text-center">{t('listings.rent')}</a>
                      )}
                    </>
                  ) : (
                    <>
                      <a href={buildWhatsAppMsg(listing, 'sell')} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm flex-1 text-center">{t('listings.sell')}</a>
                      <a href={buildWhatsAppMsg(listing, 'rent')} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm flex-1 text-center">{t('listings.rent')}</a>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-12">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-ghost btn-sm" aria-label="Previous page">
              <Icon icon="mdi:chevron-left" style={{ width: '18px', height: '18px' }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-10 h-10 font-label font-bold text-label-sm transition-colors ${page === p ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:border-accent'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-ghost btn-sm" aria-label="Next page">
              <Icon icon="mdi:chevron-right" style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        )}

        <div className="text-center">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Reliance Brokerage, I would like to enquire about your business listings.')}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
            <Icon icon="mdi:whatsapp" style={{ width: '20px', height: '20px' }} className="mr-2" />
            {t('listings.enquire_whatsapp')}
          </a>
        </div>
      </div>
    </div>
  );
}
