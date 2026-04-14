import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Listings | Reliance Brokerage',
  description: 'Browse verified institutional business listings across Malaysia',
};

export default function ListingsPage() {
  const mockListings = [
    {
      id: 1,
      title: 'Premium Manufacturing Facility',
      sector: 'Manufacturing',
      location: 'Klang Valley',
      valuation: 'RM 45M',
      revenue: 'RM 120M',
    },
    {
      id: 2,
      title: 'Tech Logistics Hub',
      sector: 'Logistics',
      location: 'Shah Alam',
      valuation: 'RM 28M',
      revenue: 'RM 85M',
    },
    {
      id: 3,
      title: 'Distribution Network',
      sector: 'Distribution',
      location: 'Petaling Jaya',
      valuation: 'RM 32M',
      revenue: 'RM 95M',
    },
  ];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="container">
        <div className="mb-16">
          <span className="eyebrow">Verified Opportunities</span>
          <h1 className="font-headline text-display-lg font-bold text-on-surface mt-5 mb-4">
            Active Business Listings
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            Curated institutional-grade opportunities pre-screened for institutional buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {mockListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-surface-container-lowest p-8 border border-outline-variant hover:shadow-card transition-shadow flex flex-col h-full"
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary text-on-primary text-label-xs font-semibold uppercase tracking-wider mb-3">
                  {listing.sector}
                </span>
                <h3 className="font-headline text-title-lg font-bold text-on-surface mb-2">
                  {listing.title}
                </h3>
                <p className="text-body-sm text-on-surface-variant">{listing.location}</p>
              </div>

              <div className="bg-surface-container py-4 px-4 mb-6 space-y-3 flex-grow">
                <div>
                  <p className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                    Enterprise Value
                  </p>
                  <p className="text-title-lg font-bold text-on-surface">{listing.valuation}</p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                    Annual Revenue
                  </p>
                  <p className="text-title-lg font-bold text-on-surface">{listing.revenue}</p>
                </div>
              </div>

              <Button href={`/listings/${listing.id}`} variant="secondary" size="sm">
                View Details
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button href="/register" variant="primary" size="lg">
            Request Access
          </Button>
        </div>
      </div>
    </div>
  );
}
