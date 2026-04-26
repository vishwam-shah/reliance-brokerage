'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CIcon } from '@coreui/icons-react';
import {
  cilBriefcase,
  cilEnvelopeLetter,
  cilUser,
  cilMagnifyingGlass,
  cilPlus,
  cilPencil,
  cilTrash,
  cilUserFollow,
  cilX,
  cilLockLocked,
} from '@coreui/icons';
import { toast } from 'sonner';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ListingForm from '@/components/dashboard/ListingForm';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

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
  images?: string[];
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
  const { user, loading, refresh } = useSession();
  const [tab, setTab] = useState<string>('listings');
  const [listings, setListings] = useState<Listing[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Listing | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Listing | null>(null);
  const [switchingRole, setSwitchingRole] = useState(false);
  const [confirmRoleSwitch, setConfirmRoleSwitch] = useState(false);

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

  const handleRoleSwitch = async () => {
    setSwitchingRole(true);
    try {
      const res = await fetch('/api/auth/role', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: 'seller' }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error?.message ?? 'Failed to switch role');
        return;
      }
      toast.success('You are now a seller!');
      await refresh();
      setTab('listings');
    } catch {
      toast.error('Network error');
    } finally {
      setSwitchingRole(false);
      setConfirmRoleSwitch(false);
    }
  };

  const handleClose = async (id: string) => {
    const res = await fetch(`/api/listings/${id}/close`, { method: 'POST', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) { toast.error(data?.error?.message ?? 'Close failed'); return; }
    toast.success('Listing marked as closed');
    loadListings();
  };

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isSeller = user.role === 'seller';

  const navItems = [
    ...(isSeller
      ? [
          { label: 'My Listings', icon: cilBriefcase, value: 'listings' },
          { label: 'Enquiries', icon: cilEnvelopeLetter, value: 'enquiries' },
        ]
      : [{ label: 'Browse', icon: cilMagnifyingGlass, value: 'browse' }]),
    { label: 'Profile', icon: cilUser, value: 'profile' },
  ];

  return (
    <DashboardShell
      user={user}
      title={isSeller ? 'Seller Dashboard' : 'Buyer Dashboard'}
      items={navItems}
      activeValue={tab}
      onSelect={setTab}
    >
      {/* ── My Listings ── */}
      {tab === 'listings' && isSeller && (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-on-surface-variant">
              New listings require admin approval before going live.
            </p>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className={cn(
                'inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-medium',
                'bg-primary text-on-primary hover:bg-primary/90 shadow-sm transition-all duration-150'
              )}
            >
              <CIcon icon={cilPlus} style={{ width: 15, height: 15 }} />
              New Listing
            </button>
          </div>

          {loadingData ? (
            <div className="flex justify-center py-16">
              <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : listings.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-4">
                  <CIcon icon={cilBriefcase} style={{ width: 26, height: 26 }} className="text-on-surface-variant" />
                </div>
                <p className="font-semibold text-on-surface mb-1">No listings yet</p>
                <p className="text-sm text-on-surface-variant mb-5">Add your first business listing to get started.</p>
                <button
                  onClick={() => { setEditing(null); setShowForm(true); }}
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary/90 shadow-sm transition-all"
                >
                  <CIcon icon={cilPlus} style={{ width: 15, height: 15 }} />
                  Add Listing
                </button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/30">
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-on-surface-variant">Business</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-on-surface-variant">Sector</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-on-surface-variant">Status</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-on-surface-variant">Views</th>
                      <th className="text-right px-6 py-3.5 text-xs font-semibold text-on-surface-variant">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((l, i) => (
                      <tr
                        key={l._id}
                        className={cn(
                          'transition-colors hover:bg-surface-container/40',
                          i < listings.length - 1 && 'border-b border-outline-variant/20'
                        )}
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-on-surface leading-none">{l.title}</p>
                          <p className="text-xs text-on-surface-variant mt-1">{l.location}</p>
                          {l.status === 'rejected' && l.rejectionReason && (
                            <p className="text-xs text-error mt-1">Reason: {l.rejectionReason}</p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-on-surface-variant text-sm">{l.sector}</td>
                        <td className="px-4 py-4">
                          <StatusBadge status={l.status} />
                        </td>
                        <td className="px-4 py-4 text-on-surface-variant text-sm">{l.views}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-1 justify-end">
                            <button
                              onClick={() => { setEditing(l); setShowForm(true); }}
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                              title="Edit"
                            >
                              <CIcon icon={cilPencil} style={{ width: 15, height: 15 }} />
                            </button>
                            {l.status === 'active' && (
                              <button
                                onClick={() => handleClose(l._id)}
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-slate-100 hover:text-slate-800 transition-colors"
                                title="Mark as sold / close listing"
                              >
                                <CIcon icon={cilLockLocked} style={{ width: 15, height: 15 }} />
                              </button>
                            )}
                            <button
                              onClick={() => setConfirmDelete(l)}
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-red-50 hover:text-error transition-colors"
                              title="Delete"
                            >
                              <CIcon icon={cilTrash} style={{ width: 15, height: 15 }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <ListingForm
            open={showForm}
            onOpenChange={(o) => { setShowForm(o); if (!o) setEditing(null); }}
            initial={
              editing
                ? {
                    title: editing.title,
                    sector: editing.sector,
                    location: editing.location,
                    description: editing.description ?? '',
                    valuationNum: editing.valuationNum,
                    revenueNum: editing.revenueNum,
                    rentPrice: editing.rentPrice,
                    availableFor: editing.availableFor,
                    images: editing.images ?? [],
                  }
                : null
            }
            listingId={editing?._id ?? null}
            onSaved={loadListings}
          />

          <AlertDialog.Root open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
              <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 max-w-sm w-full z-50 shadow-modal">
                <AlertDialog.Title className="font-headline text-lg font-bold text-on-surface mb-2">
                  Delete listing?
                </AlertDialog.Title>
                <AlertDialog.Description className="text-sm text-on-surface-variant mb-6">
                  This will permanently remove &quot;{confirmDelete?.title}&quot;. This cannot be undone.
                </AlertDialog.Description>
                <div className="flex justify-end gap-2">
                  <AlertDialog.Cancel className="h-10 px-4 rounded-xl text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container transition-colors">
                    Cancel
                  </AlertDialog.Cancel>
                  <AlertDialog.Action
                    onClick={handleDelete}
                    className="h-10 px-4 rounded-xl text-sm font-medium bg-error text-white hover:bg-error/90 transition-colors"
                  >
                    Delete
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      )}

      {/* ── Enquiries ── */}
      {tab === 'enquiries' && isSeller && (
        <div className="space-y-3">
          {loadingData ? (
            <div className="flex justify-center py-16">
              <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : enquiries.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-4">
                  <CIcon icon={cilEnvelopeLetter} style={{ width: 26, height: 26 }} className="text-on-surface-variant" />
                </div>
                <p className="text-sm text-on-surface-variant">No enquiries yet.</p>
              </CardContent>
            </Card>
          ) : (
            enquiries.map((e) => (
              <Card key={e._id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-on-surface text-sm">{e.name}</p>
                        <StatusBadge status={e.status} />
                      </div>
                      <p className="text-xs text-on-surface-variant">{e.email} · {e.phone}</p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        <span className="font-medium text-on-surface">{e.type}</span> · {e.listingTitle}
                      </p>
                      {e.message && <p className="text-sm text-on-surface mt-2 line-clamp-2">{e.message}</p>}
                    </div>
                    <p className="text-xs text-on-surface-variant shrink-0">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* ── Browse (buyer) ── */}
      {tab === 'browse' && !isSeller && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <CIcon icon={cilMagnifyingGlass} style={{ width: 26, height: 26 }} className="text-accent" />
            </div>
            <h3 className="font-headline font-bold text-on-surface text-lg mb-2">Browse Listings</h3>
            <p className="text-sm text-on-surface-variant mb-5 max-w-xs mx-auto">
              Explore verified, pre-screened business opportunities across Malaysia.
            </p>
            <a
              href="/listings"
              className="inline-flex h-10 px-5 items-center rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary/90 shadow-sm transition-all"
            >
              Go to Listings
            </a>
          </CardContent>
        </Card>
      )}

      {/* ── Profile ── */}
      {tab === 'profile' && (
        <div className="max-w-lg space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                {[
                  { label: 'Full name', value: user.name },
                  { label: 'Email address', value: user.email },
                  { label: 'Account type', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-outline-variant/20 last:border-0">
                    <dt className="text-sm text-on-surface-variant">{label}</dt>
                    <dd className="text-sm font-semibold text-on-surface">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {user.role === 'buyer' && (
            <Card>
              <CardContent className="py-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CIcon icon={cilUserFollow} style={{ width: 20, height: 20 }} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-on-surface text-sm mb-1">Want to list your business?</h4>
                    <p className="text-xs text-on-surface-variant mb-4">
                      Switch to a seller account to post listings and connect with buyers — no new account needed.
                    </p>
                    <button
                      onClick={() => setConfirmRoleSwitch(true)}
                      className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary/90 shadow-sm transition-all"
                    >
                      <CIcon icon={cilUserFollow} style={{ width: 14, height: 14 }} />
                      Become a Seller
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Role switch confirmation */}
      <AlertDialog.Root open={confirmRoleSwitch} onOpenChange={(o) => !switchingRole && setConfirmRoleSwitch(o)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 max-w-sm w-full z-50 shadow-modal">
            <AlertDialog.Title className="font-headline text-lg font-bold text-on-surface mb-2">
              Switch to Seller?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-on-surface-variant mb-6">
              Your account will be upgraded to a seller account. You&apos;ll be able to post listings and receive enquiries.
            </AlertDialog.Description>
            <div className="flex justify-end gap-2">
              <AlertDialog.Cancel
                disabled={switchingRole}
                className="h-10 px-4 rounded-xl text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
              >
                Cancel
              </AlertDialog.Cancel>
              <AlertDialog.Action
                onClick={handleRoleSwitch}
                disabled={switchingRole}
                className="h-10 px-4 rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {switchingRole && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {switchingRole ? 'Switching…' : 'Yes, become a seller'}
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </DashboardShell>
  );
}
