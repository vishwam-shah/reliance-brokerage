'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ListingForm from '@/components/dashboard/ListingForm';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useSession } from '@/hooks/useSession';

type Listing = {
  _id: string;
  title: string;
  sector: string;
  location: string;
  valuation: string;
  revenue: string;
  rentPrice: string;
  availableFor: ('buy' | 'rent')[];
  status: string;
  rejectionReason?: string;
  views: number;
  description?: string;
  valuationNum: number;
  revenueNum: number;
  createdAt: string;
};

type Enquiry = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  listingTitle: string;
  message: string;
  status: string;
  createdAt: string;
};

export default function UserDashboard() {
  const router = useRouter();
  const { user, loading } = useSession();
  const [tab, setTab] = useState<string>('listings');
  const [listings, setListings] = useState<Listing[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Listing | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Listing | null>(null);

  const loadListings = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/listings?mine=true&status=all&limit=50', {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await res.json();
      if (res.ok) setListings(data.items ?? []);
    } finally {
      setLoadingData(false);
    }
  }, []);

  const loadEnquiries = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/enquiries?mine=true', { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setEnquiries(data.items ?? []);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/sign-in?redirect=/dashboard');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'admin' || user.role === 'superadmin') {
      router.push('/admin');
      return;
    }
    if (tab === 'listings') loadListings();
    if (tab === 'enquiries') loadEnquiries();
  }, [user, tab, loadListings, loadEnquiries, router]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const id = confirmDelete._id;
    setConfirmDelete(null);
    const res = await fetch(`/api/listings/${id}`, { method: 'DELETE', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error?.message ?? 'Delete failed');
      return;
    }
    toast.success('Listing deleted');
    loadListings();
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Icon icon="mdi:loading" className="animate-spin text-primary" style={{ width: '32px', height: '32px' }} />
      </div>
    );
  }

  const isSeller = user.role === 'seller';

  const navItems = [
    ...(isSeller
      ? [
          { label: 'My Listings', icon: 'mdi:briefcase', value: 'listings' },
          { label: 'Enquiries', icon: 'mdi:email-outline', value: 'enquiries' },
        ]
      : [{ label: 'Browse', icon: 'mdi:magnify', value: 'browse' }]),
    { label: 'Profile', icon: 'mdi:account-circle', value: 'profile' },
  ];

  return (
    <DashboardShell
      user={user}
      title={isSeller ? 'Seller Dashboard' : 'Buyer Dashboard'}
      items={navItems}
      activeValue={tab}
      onSelect={setTab}
    >
      {tab === 'listings' && isSeller && (
        <div>
          <div className="flex items-center justify-between mb-6 gap-4">
            <p className="text-body-sm text-on-surface-variant">
              New listings require admin approval before going live.
            </p>
            <button
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="btn btn-primary flex-shrink-0"
            >
              <Icon icon="mdi:plus" style={{ width: '18px', height: '18px' }} className="mr-1" />
              New Listing
            </button>
          </div>

          {loadingData ? (
            <div className="text-center py-16 text-on-surface-variant">Loading…</div>
          ) : listings.length === 0 ? (
            <div className="bg-surface p-12 text-center border border-outline-variant">
              <Icon icon="mdi:briefcase-outline" className="text-on-surface-variant mx-auto mb-3" style={{ width: '48px', height: '48px' }} />
              <p className="text-body-lg text-on-surface mb-2">No listings yet</p>
              <p className="text-body-sm text-on-surface-variant mb-4">Get started by adding your first business listing.</p>
              <button
                onClick={() => {
                  setEditing(null);
                  setShowForm(true);
                }}
                className="btn btn-primary"
              >
                Add Listing
              </button>
            </div>
          ) : (
            <div className="bg-surface border border-outline-variant overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead className="bg-surface-container text-label-xs uppercase text-on-surface-variant">
                  <tr>
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">Sector</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Views</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l) => (
                    <tr key={l._id} className="border-t border-outline-variant">
                      <td className="p-3">
                        <div className="font-semibold text-on-surface">{l.title}</div>
                        <div className="text-label-xs text-on-surface-variant">{l.location}</div>
                        {l.status === 'rejected' && l.rejectionReason && (
                          <div className="text-label-xs text-error mt-1">Reason: {l.rejectionReason}</div>
                        )}
                      </td>
                      <td className="p-3 text-on-surface-variant">{l.sector}</td>
                      <td className="p-3">
                        <StatusBadge status={l.status} />
                      </td>
                      <td className="p-3 text-on-surface-variant">{l.views}</td>
                      <td className="p-3 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => {
                              setEditing(l);
                              setShowForm(true);
                            }}
                            className="btn btn-ghost btn-sm"
                          >
                            <Icon icon="mdi:pencil" style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button onClick={() => setConfirmDelete(l)} className="btn btn-ghost btn-sm text-error">
                            <Icon icon="mdi:delete" style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <ListingForm
            open={showForm}
            onOpenChange={(o) => {
              setShowForm(o);
              if (!o) setEditing(null);
            }}
            initial={
              editing
                ? {
                    title: editing.title,
                    sector: editing.sector,
                    location: editing.location,
                    description: editing.description ?? '',
                    valuation: editing.valuation,
                    valuationNum: editing.valuationNum,
                    revenue: editing.revenue,
                    revenueNum: editing.revenueNum,
                    rentPrice: editing.rentPrice,
                    availableFor: editing.availableFor,
                  }
                : null
            }
            listingId={editing?._id ?? null}
            onSaved={loadListings}
          />

          <AlertDialog.Root open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
              <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface p-6 max-w-sm w-full z-50 shadow-card">
                <AlertDialog.Title className="font-headline text-title-lg font-bold text-on-surface mb-2">
                  Delete listing?
                </AlertDialog.Title>
                <AlertDialog.Description className="text-body-sm text-on-surface-variant mb-6">
                  This will permanently remove "{confirmDelete?.title}". This action cannot be undone.
                </AlertDialog.Description>
                <div className="flex justify-end gap-2">
                  <AlertDialog.Cancel className="btn btn-ghost">Cancel</AlertDialog.Cancel>
                  <AlertDialog.Action onClick={handleDelete} className="btn btn-primary bg-error">
                    Delete
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      )}

      {tab === 'enquiries' && isSeller && (
        <div>
          {loadingData ? (
            <div className="text-center py-16 text-on-surface-variant">Loading…</div>
          ) : enquiries.length === 0 ? (
            <div className="bg-surface p-12 text-center border border-outline-variant">
              <Icon icon="mdi:email-outline" className="text-on-surface-variant mx-auto mb-3" style={{ width: '48px', height: '48px' }} />
              <p className="text-body-sm text-on-surface-variant">No enquiries yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((e) => (
                <div key={e._id} className="bg-surface border border-outline-variant p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-on-surface">{e.name}</div>
                      <div className="text-label-xs text-on-surface-variant">
                        {e.email} · {e.phone}
                      </div>
                    </div>
                    <StatusBadge status={e.status} />
                  </div>
                  <div className="text-body-sm text-on-surface-variant mb-1">
                    <span className="font-semibold">{e.type}</span> · {e.listingTitle}
                  </div>
                  {e.message && <p className="text-body-sm text-on-surface">{e.message}</p>}
                  <div className="text-label-xs text-on-surface-variant mt-2">
                    {new Date(e.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'browse' && !isSeller && (
        <div className="bg-surface border border-outline-variant p-10 text-center">
          <Icon icon="mdi:magnify" className="text-primary mx-auto mb-3" style={{ width: '48px', height: '48px' }} />
          <h3 className="font-headline text-title-lg font-bold text-on-surface mb-2">Browse Listings</h3>
          <p className="text-body-sm text-on-surface-variant mb-4">
            Explore verified, pre-screened business opportunities across Malaysia.
          </p>
          <a href="/listings" className="btn btn-primary">
            Go to Listings
          </a>
        </div>
      )}

      {tab === 'profile' && (
        <div className="bg-surface border border-outline-variant p-6 max-w-xl">
          <dl className="space-y-3 text-body-sm">
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">Name</dt>
              <dd className="font-semibold">{user.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">Email</dt>
              <dd className="font-semibold">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">Role</dt>
              <dd className="font-semibold capitalize">{user.role}</dd>
            </div>
          </dl>
        </div>
      )}
    </DashboardShell>
  );
}
