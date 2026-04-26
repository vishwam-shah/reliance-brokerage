'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CIcon } from '@coreui/icons-react';
import {
  cilSpeedometer,
  cilBriefcase,
  cilTask,
  cilEnvelopeLetter,
  cilPeople,
  cilHistory,
  cilCheck,
  cilX,
  cilPencil,
  cilTrash,
  cilPlus,
  cilStar,
  cilLockLocked,
  cilReload,
} from '@coreui/icons';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';
import DashboardShell from '@/components/dashboard/DashboardShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import ListingForm from '@/components/dashboard/ListingForm';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

type Listing = {
  _id: string;
  title: string;
  sector: string;
  location: string;
  valuation: string;
  valuationNum: number;
  revenue: string;
  revenueNum: number;
  rentPrice: string;
  status: string;
  availableFor: ('buy' | 'rent')[];
  views: number;
  featured?: boolean;
  description?: string;
  images?: string[];
  createdAt: string;
  rejectionReason?: string;
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
  notes?: string;
  createdAt: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  company: string;
  createdAt: string;
  lastLoginAt?: string;
};

type Stats = {
  listings: { total: number; active: number; pending: number; rejected: number };
  enquiries: { total: number; new: number };
  users: { total: number; sellers: number; buyers: number };
};

type AuditItem = {
  _id: string;
  action: string;
  actorEmail: string;
  actorRole: string;
  targetType: string;
  targetId: string;
  ip: string;
  meta: Record<string, unknown>;
  createdAt: string;
};

const TABLE_HEAD = 'text-xs font-semibold text-on-surface-variant px-5 py-3.5 text-left';
const TABLE_CELL = 'px-5 py-4 text-sm';
const ROW_CLASS = 'border-b border-outline-variant/20 hover:bg-surface-container/30 transition-colors last:border-0';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useSession();
  const [tab, setTab] = useState('overview');

  const [stats, setStats] = useState<Stats | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [audit, setAudit] = useState<AuditItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [listingFilter, setListingFilter] = useState<'all' | 'active' | 'pending_approval' | 'rejected'>('all');

  const [rejecting, setRejecting] = useState<Listing | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserRole, setEditUserRole] = useState('');
  const [savingUser, setSavingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [showListingForm, setShowListingForm] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deletingListing, setDeletingListing] = useState<Listing | null>(null);

  const loadStats = useCallback(async () => {
    const res = await fetch('/api/stats', { credentials: 'include', cache: 'no-store' });
    if (res.ok) setStats(await res.json());
  }, []);

  const loadListings = useCallback(async () => {
    setLoadingData(true);
    try {
      const statusParam = listingFilter === 'all' ? '' : `&status=${listingFilter}`;
      const res = await fetch(`/api/listings?limit=100${statusParam}`, {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await res.json();
      if (res.ok) setListings(data.items ?? []);
    } finally {
      setLoadingData(false);
    }
  }, [listingFilter]);

  const loadEnquiries = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/enquiries?limit=100', { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setEnquiries(data.items ?? []);
    } finally {
      setLoadingData(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/users?limit=100', { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setUsers(data.items ?? []);
    } finally {
      setLoadingData(false);
    }
  }, []);

  const loadAudit = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/audit?limit=100', { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setAudit(data.items ?? []);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/sign-in?redirect=/admin');
    if (!loading && user && user.role !== 'admin' && user.role !== 'superadmin') {
      router.push('/dashboard');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    if (tab === 'overview') loadStats();
    if (tab === 'listings' || tab === 'approvals') loadListings();
    if (tab === 'enquiries') loadEnquiries();
    if (tab === 'users') loadUsers();
    if (tab === 'audit') loadAudit();
  }, [user, tab, loadStats, loadListings, loadEnquiries, loadUsers, loadAudit]);

  useEffect(() => {
    if (tab === 'approvals') setListingFilter('pending_approval');
  }, [tab]);

  const approveListing = async (id: string) => {
    const res = await fetch(`/api/listings/${id}/approve`, { method: 'POST', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) { toast.error(data?.error?.message ?? 'Approve failed'); return; }
    toast.success('Listing approved');
    loadListings();
    loadStats();
  };

  const rejectListing = async () => {
    if (!rejecting) return;
    const reason = rejectReason.trim();
    if (reason.length < 3) { toast.error('Reason must be at least 3 characters'); return; }
    const res = await fetch(`/api/listings/${rejecting._id}/reject`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    if (!res.ok) { toast.error(data?.error?.message ?? 'Reject failed'); return; }
    toast.success('Listing rejected');
    setRejecting(null);
    setRejectReason('');
    loadListings();
    loadStats();
  };

  const saveUserRole = async () => {
    if (!editingUser) return;
    setSavingUser(true);
    try {
      const res = await fetch(`/api/users/${editingUser._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: editUserRole }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data?.error?.message ?? 'Update failed'); return; }
      toast.success('User role updated');
      setEditingUser(null);
      loadUsers();
    } catch { toast.error('Network error'); }
    finally { setSavingUser(false); }
  };

  const deleteUser = async () => {
    if (!deletingUser) return;
    const id = deletingUser._id;
    setDeletingUser(null);
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) { toast.error(data?.error?.message ?? 'Delete failed'); return; }
    toast.success('User deleted');
    loadUsers();
  };

  const toggleFeature = async (l: Listing) => {
    const res = await fetch(`/api/listings/${l._id}/feature`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !l.featured }),
    });
    const data = await res.json();
    if (!res.ok) { toast.error(data?.error?.message ?? 'Update failed'); return; }
    toast.success(l.featured ? 'Removed from featured' : 'Marked as featured');
    loadListings();
  };

  const closeListing = async (id: string) => {
    const res = await fetch(`/api/listings/${id}/close`, { method: 'POST', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) { toast.error(data?.error?.message ?? 'Close failed'); return; }
    toast.success('Listing closed');
    loadListings();
    loadStats();
  };

  const reopenListing = async (id: string) => {
    const res = await fetch(`/api/listings/${id}/reopen`, { method: 'POST', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) { toast.error(data?.error?.message ?? 'Reopen failed'); return; }
    toast.success('Listing reopened');
    loadListings();
    loadStats();
  };

  const deleteListing = async () => {
    if (!deletingListing) return;
    const id = deletingListing._id;
    setDeletingListing(null);
    const res = await fetch(`/api/listings/${id}`, { method: 'DELETE', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) { toast.error(data?.error?.message ?? 'Delete failed'); return; }
    toast.success('Listing deleted');
    loadListings();
    loadStats();
  };

  const updateEnquiry = async (id: string, status: string) => {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) { toast.error(data?.error?.message ?? 'Update failed'); return; }
    toast.success('Enquiry updated');
    loadEnquiries();
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', icon: cilSpeedometer, value: 'overview' },
    { label: 'Listings', icon: cilBriefcase, value: 'listings' },
    { label: 'Approvals', icon: cilTask, value: 'approvals' },
    { label: 'Enquiries', icon: cilEnvelopeLetter, value: 'enquiries' },
    { label: 'Users', icon: cilPeople, value: 'users' },
    { label: 'Audit Log', icon: cilHistory, value: 'audit' },
  ];

  return (
    <DashboardShell user={user} title="Admin Panel" items={navItems} activeValue={tab} onSelect={setTab}>

      {/* ── Overview ── */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {!stats ? (
            <div className="col-span-full flex justify-center py-16">
              <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <StatCard icon={cilBriefcase} label="Active Listings" value={stats.listings.active} secondary={`${stats.listings.total} total`} color="neutral" />
              <StatCard icon={cilTask} label="Pending Approvals" value={stats.listings.pending} color="gold" />
              <StatCard icon={cilX} label="Rejected" value={stats.listings.rejected} color="red" />
              <StatCard icon={cilEnvelopeLetter} label="New Enquiries" value={stats.enquiries.new} secondary={`${stats.enquiries.total} total`} color="blue" />
              <StatCard icon={cilPeople} label="Total Users" value={stats.users.total} secondary={`${stats.users.sellers} sellers · ${stats.users.buyers} buyers`} color="neutral" />
              <StatCard icon={cilSpeedometer} label="Sellers" value={stats.users.sellers} color="green" />
            </>
          )}
        </div>
      )}

      {/* ── Listings / Approvals ── */}
      {(tab === 'listings' || tab === 'approvals') && (
        <div className="space-y-4">
          {tab === 'listings' && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <select
                className="h-10 px-3 pr-8 rounded-xl border border-slate-200 bg-white text-sm text-on-surface outline-none focus:ring-2 focus:ring-accent/30"
                value={listingFilter}
                onChange={(e) => setListingFilter(e.target.value as typeof listingFilter)}
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="pending_approval">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={() => { setEditingListing(null); setShowListingForm(true); }}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary/90 shadow-sm transition-all"
              >
                <CIcon icon={cilPlus} style={{ width: 15, height: 15 }} />
                New Listing
              </button>
            </div>
          )}

          {loadingData ? (
            <div className="flex justify-center py-16">
              <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : listings.length === 0 ? (
            <Card><div className="py-16 text-center text-sm text-on-surface-variant">No listings found.</div></Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-outline-variant/30">
                    <tr>
                      <th className={TABLE_HEAD}>Business</th>
                      <th className={TABLE_HEAD}>Sector</th>
                      <th className={TABLE_HEAD}>Status</th>
                      <th className={TABLE_HEAD}>Available</th>
                      <th className={TABLE_HEAD}>Created</th>
                      <th className={cn(TABLE_HEAD, 'text-right')}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((l) => (
                      <tr key={l._id} className={ROW_CLASS}>
                        <td className={TABLE_CELL}>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-on-surface leading-none">{l.title}</p>
                            {l.featured && (
                              <CIcon icon={cilStar} className="text-amber-500" style={{ width: 13, height: 13 }} />
                            )}
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1">{l.location}</p>
                          {l.rejectionReason && (
                            <p className="text-xs text-error mt-1">Rejected: {l.rejectionReason}</p>
                          )}
                        </td>
                        <td className={cn(TABLE_CELL, 'text-on-surface-variant')}>{l.sector}</td>
                        <td className={TABLE_CELL}><StatusBadge status={l.status} /></td>
                        <td className={cn(TABLE_CELL, 'text-xs text-on-surface-variant')}>{l.availableFor.join(', ')}</td>
                        <td className={cn(TABLE_CELL, 'text-xs text-on-surface-variant')}>
                          {new Date(l.createdAt).toLocaleDateString()}
                        </td>
                        <td className={cn(TABLE_CELL, 'text-right')}>
                          <div className="inline-flex gap-1 flex-wrap justify-end">
                            {l.status === 'pending_approval' && (
                              <>
                                <button
                                  onClick={() => approveListing(l._id)}
                                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                                  title="Approve"
                                >
                                  <CIcon icon={cilCheck} style={{ width: 13, height: 13 }} />
                                  Approve
                                </button>
                                <button
                                  onClick={() => setRejecting(l)}
                                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-error hover:bg-red-50 transition-colors"
                                  title="Reject"
                                >
                                  <CIcon icon={cilX} style={{ width: 13, height: 13 }} />
                                  Reject
                                </button>
                              </>
                            )}
                            {l.status === 'active' && (
                              <button
                                onClick={() => toggleFeature(l)}
                                className={cn(
                                  'h-8 w-8 rounded-lg flex items-center justify-center transition-colors',
                                  l.featured
                                    ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-amber-600'
                                )}
                                title={l.featured ? 'Unfeature' : 'Mark as featured'}
                              >
                                <CIcon icon={cilStar} style={{ width: 14, height: 14 }} />
                              </button>
                            )}
                            {(l.status === 'active' || l.status === 'pending_approval') && (
                              <button
                                onClick={() => closeListing(l._id)}
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                                title="Close listing"
                              >
                                <CIcon icon={cilLockLocked} style={{ width: 14, height: 14 }} />
                              </button>
                            )}
                            {(l.status === 'closed' || l.status === 'rejected') && (
                              <button
                                onClick={() => reopenListing(l._id)}
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors"
                                title="Reopen as active"
                              >
                                <CIcon icon={cilReload} style={{ width: 13, height: 13 }} />
                                Reopen
                              </button>
                            )}
                            <button
                              onClick={() => { setEditingListing(l); setShowListingForm(true); }}
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                              title="Edit"
                            >
                              <CIcon icon={cilPencil} style={{ width: 14, height: 14 }} />
                            </button>
                            <button
                              onClick={() => setDeletingListing(l)}
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-error transition-colors"
                              title="Delete"
                            >
                              <CIcon icon={cilTrash} style={{ width: 14, height: 14 }} />
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

          {/* Listing create/edit form (admin) */}
          <ListingForm
            open={showListingForm}
            onOpenChange={(o) => { setShowListingForm(o); if (!o) setEditingListing(null); }}
            initial={
              editingListing
                ? {
                    title: editingListing.title,
                    sector: editingListing.sector,
                    location: editingListing.location,
                    description: editingListing.description ?? '',
                    valuationNum: editingListing.valuationNum,
                    revenueNum: editingListing.revenueNum,
                    rentPrice: editingListing.rentPrice,
                    availableFor: editingListing.availableFor,
                    images: editingListing.images ?? [],
                  }
                : null
            }
            listingId={editingListing?._id ?? null}
            onSaved={() => { loadListings(); loadStats(); }}
          />

          {/* Delete confirmation */}
          {deletingListing && (
            <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-modal">
                <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Delete listing?</h3>
                <p className="text-sm text-on-surface-variant mb-6">
                  This will permanently remove <span className="font-semibold text-on-surface">&quot;{deletingListing.title}&quot;</span>. This cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setDeletingListing(null)}
                    className="h-10 px-4 rounded-xl text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteListing}
                    className="h-10 px-4 rounded-xl text-sm font-medium bg-error text-white hover:bg-error/90 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reject dialog */}
          <Dialog.Root open={!!rejecting} onOpenChange={(o) => !o && setRejecting(null)}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 max-w-md w-full z-50 shadow-modal">
                <Dialog.Title className="font-headline text-lg font-bold text-on-surface mb-1">
                  Reject listing
                </Dialog.Title>
                <Dialog.Description className="text-sm text-on-surface-variant mb-4">
                  Provide a reason — the seller will see this message.
                </Dialog.Description>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Insufficient financial documentation"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Dialog.Close className="h-10 px-4 rounded-xl text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container transition-colors">
                    Cancel
                  </Dialog.Close>
                  <button
                    onClick={rejectListing}
                    className="h-10 px-4 rounded-xl text-sm font-medium bg-error text-white hover:bg-error/90 transition-colors"
                  >
                    Reject listing
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      )}

      {/* ── Enquiries ── */}
      {tab === 'enquiries' && (
        <div>
          {loadingData ? (
            <div className="flex justify-center py-16">
              <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : enquiries.length === 0 ? (
            <Card><div className="py-16 text-center text-sm text-on-surface-variant">No enquiries yet.</div></Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-outline-variant/30">
                    <tr>
                      <th className={TABLE_HEAD}>Contact</th>
                      <th className={TABLE_HEAD}>Type</th>
                      <th className={TABLE_HEAD}>Listing</th>
                      <th className={TABLE_HEAD}>Status</th>
                      <th className={TABLE_HEAD}>Date</th>
                      <th className={cn(TABLE_HEAD, 'text-right')}>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((e) => (
                      <tr key={e._id} className={ROW_CLASS}>
                        <td className={TABLE_CELL}>
                          <p className="font-semibold text-on-surface leading-none">{e.name}</p>
                          <p className="text-xs text-on-surface-variant mt-1">{e.email}</p>
                          <p className="text-xs text-on-surface-variant">{e.phone}</p>
                        </td>
                        <td className={cn(TABLE_CELL, 'font-medium')}>{e.type}</td>
                        <td className={cn(TABLE_CELL, 'text-on-surface-variant text-xs max-w-[160px] truncate')}>{e.listingTitle || '—'}</td>
                        <td className={TABLE_CELL}><StatusBadge status={e.status} /></td>
                        <td className={cn(TABLE_CELL, 'text-xs text-on-surface-variant')}>
                          {new Date(e.createdAt).toLocaleDateString()}
                        </td>
                        <td className={cn(TABLE_CELL, 'text-right')}>
                          <select
                            className="h-8 px-2 pr-6 rounded-lg border border-outline-variant bg-white text-xs text-on-surface outline-none focus:ring-2 focus:ring-accent/30"
                            value={e.status}
                            onChange={(ev) => updateEnquiry(e._id, ev.target.value)}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── Users ── */}
      {tab === 'users' && (
        <div className="space-y-4">
          {loadingData ? (
            <div className="flex justify-center py-16">
              <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-100">
                    <tr>
                      <th className={TABLE_HEAD}>Name</th>
                      <th className={TABLE_HEAD}>Email</th>
                      <th className={TABLE_HEAD}>Role</th>
                      <th className={TABLE_HEAD}>Joined</th>
                      <th className={TABLE_HEAD}>Last login</th>
                      {user.role === 'superadmin' && <th className={cn(TABLE_HEAD, 'text-right')}>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className={ROW_CLASS}>
                        <td className={cn(TABLE_CELL, 'font-semibold text-on-surface')}>{u.name}</td>
                        <td className={cn(TABLE_CELL, 'text-on-surface-variant text-xs')}>{u.email}</td>
                        <td className={TABLE_CELL}>
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize',
                            u.role === 'superadmin' ? 'bg-purple-50 text-purple-700' :
                            u.role === 'admin' ? 'bg-blue-50 text-blue-700' :
                            u.role === 'seller' ? 'bg-emerald-50 text-emerald-700' :
                            'bg-slate-100 text-slate-600'
                          )}>
                            {u.role}
                          </span>
                        </td>
                        <td className={cn(TABLE_CELL, 'text-xs text-on-surface-variant')}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className={cn(TABLE_CELL, 'text-xs text-on-surface-variant')}>
                          {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : '—'}
                        </td>
                        {user.role === 'superadmin' && (
                          <td className={cn(TABLE_CELL, 'text-right')}>
                            <div className="inline-flex gap-1">
                              <button
                                onClick={() => { setEditingUser(u); setEditUserRole(u.role); }}
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                                title="Edit role"
                                disabled={u._id === user.id}
                              >
                                <CIcon icon={cilPencil} style={{ width: 14, height: 14 }} />
                              </button>
                              <button
                                onClick={() => setDeletingUser(u)}
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-error transition-colors"
                                title="Delete user"
                                disabled={u._id === user.id}
                              >
                                <CIcon icon={cilTrash} style={{ width: 14, height: 14 }} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Edit user role dialog */}
          <Dialog.Root open={!!editingUser} onOpenChange={(o) => !o && setEditingUser(null)}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 max-w-sm w-full z-50 shadow-modal">
                <Dialog.Title className="font-headline text-lg font-bold text-on-surface mb-1">
                  Edit User Role
                </Dialog.Title>
                <Dialog.Description className="text-sm text-on-surface-variant mb-5">
                  Change the role for <span className="font-semibold text-on-surface">{editingUser?.name}</span>.
                </Dialog.Description>
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Role</label>
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-white text-sm text-on-surface outline-none focus:ring-2 focus:ring-accent/30"
                    value={editUserRole}
                    onChange={(e) => setEditUserRole(e.target.value)}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Dialog.Close className="h-10 px-4 rounded-xl text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container transition-colors">
                    Cancel
                  </Dialog.Close>
                  <button
                    onClick={saveUserRole}
                    disabled={savingUser}
                    className="h-10 px-4 rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {savingUser && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {/* Delete user confirmation */}
          {deletingUser && (
            <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-modal">
                <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Delete user?</h3>
                <p className="text-sm text-on-surface-variant mb-6">
                  This will permanently delete <span className="font-semibold text-on-surface">{deletingUser.name}</span> ({deletingUser.email}). This cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setDeletingUser(null)}
                    className="h-10 px-4 rounded-xl text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteUser}
                    className="h-10 px-4 rounded-xl text-sm font-medium bg-error text-white hover:bg-error/90 transition-colors"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Audit Log ── */}
      {tab === 'audit' && (
        <div>
          {loadingData ? (
            <div className="flex justify-center py-16">
              <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : audit.length === 0 ? (
            <Card><div className="py-16 text-center text-sm text-on-surface-variant">No audit events yet.</div></Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-outline-variant/30">
                    <tr>
                      <th className={TABLE_HEAD}>Action</th>
                      <th className={TABLE_HEAD}>Actor</th>
                      <th className={TABLE_HEAD}>Target</th>
                      <th className={TABLE_HEAD}>IP</th>
                      <th className={TABLE_HEAD}>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audit.map((a) => (
                      <tr key={a._id} className={ROW_CLASS}>
                        <td className={cn(TABLE_CELL, 'font-mono text-xs')}>{a.action}</td>
                        <td className={TABLE_CELL}>
                          <p className="text-sm text-on-surface">{a.actorEmail || '—'}</p>
                          <p className="text-xs text-on-surface-variant capitalize">{a.actorRole}</p>
                        </td>
                        <td className={cn(TABLE_CELL, 'text-xs text-on-surface-variant')}>
                          {a.targetType} {a.targetId ? `#${a.targetId.slice(-6)}` : ''}
                        </td>
                        <td className={cn(TABLE_CELL, 'text-xs font-mono')}>{a.ip}</td>
                        <td className={cn(TABLE_CELL, 'text-xs text-on-surface-variant')}>
                          {new Date(a.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
