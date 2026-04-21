'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';
import DashboardShell from '@/components/dashboard/DashboardShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useSession } from '@/hooks/useSession';

type Listing = {
  _id: string;
  title: string;
  sector: string;
  location: string;
  valuation: string;
  revenue: string;
  status: string;
  availableFor: string[];
  views: number;
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
    if (!res.ok) {
      toast.error(data?.error?.message ?? 'Approve failed');
      return;
    }
    toast.success('Listing approved');
    loadListings();
    loadStats();
  };

  const rejectListing = async () => {
    if (!rejecting) return;
    const reason = rejectReason.trim();
    if (reason.length < 3) {
      toast.error('Reason must be at least 3 characters');
      return;
    }
    const res = await fetch(`/api/listings/${rejecting._id}/reject`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error?.message ?? 'Reject failed');
      return;
    }
    toast.success('Listing rejected');
    setRejecting(null);
    setRejectReason('');
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
    if (!res.ok) {
      toast.error(data?.error?.message ?? 'Update failed');
      return;
    }
    toast.success('Enquiry updated');
    loadEnquiries();
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Icon icon="mdi:loading" className="animate-spin text-primary" style={{ width: '32px', height: '32px' }} />
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', icon: 'mdi:view-dashboard', value: 'overview' },
    { label: 'Listings', icon: 'mdi:briefcase', value: 'listings' },
    { label: 'Approvals', icon: 'mdi:check-decagram', value: 'approvals' },
    { label: 'Enquiries', icon: 'mdi:email', value: 'enquiries' },
    { label: 'Users', icon: 'mdi:account-group', value: 'users' },
    { label: 'Audit Log', icon: 'mdi:history', value: 'audit' },
  ];

  return (
    <DashboardShell
      user={user}
      title="Admin Panel"
      items={navItems}
      activeValue={tab}
      onSelect={setTab}
    >
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!stats ? (
            <div className="col-span-full text-center py-16 text-on-surface-variant">Loading…</div>
          ) : (
            <>
              <StatCard icon="mdi:briefcase" label="Active Listings" value={stats.listings.active} secondary={`${stats.listings.total} total`} />
              <StatCard icon="mdi:clock" label="Pending Approvals" value={stats.listings.pending} accent />
              <StatCard icon="mdi:close-octagon" label="Rejected" value={stats.listings.rejected} />
              <StatCard icon="mdi:email" label="New Enquiries" value={stats.enquiries.new} secondary={`${stats.enquiries.total} total`} accent />
              <StatCard icon="mdi:account-group" label="Users" value={stats.users.total} secondary={`${stats.users.sellers} sellers · ${stats.users.buyers} buyers`} />
              <StatCard icon="mdi:storefront" label="Sellers" value={stats.users.sellers} />
            </>
          )}
        </div>
      )}

      {(tab === 'listings' || tab === 'approvals') && (
        <div>
          {tab === 'listings' && (
            <div className="flex justify-end mb-6">
              <select
                className="form-input w-auto"
                value={listingFilter}
                onChange={(e) => setListingFilter(e.target.value as typeof listingFilter)}
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="pending_approval">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}

          {loadingData ? (
            <div className="text-center py-16 text-on-surface-variant">Loading…</div>
          ) : listings.length === 0 ? (
            <div className="bg-surface p-12 text-center border border-outline-variant">
              <p className="text-body-sm text-on-surface-variant">No listings found.</p>
            </div>
          ) : (
            <div className="bg-surface border border-outline-variant overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead className="bg-surface-container text-label-xs uppercase text-on-surface-variant">
                  <tr>
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">Sector</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Avail.</th>
                    <th className="text-left p-3">Created</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l) => (
                    <tr key={l._id} className="border-t border-outline-variant align-top">
                      <td className="p-3">
                        <div className="font-semibold text-on-surface">{l.title}</div>
                        <div className="text-label-xs text-on-surface-variant">{l.location}</div>
                        {l.rejectionReason && (
                          <div className="text-label-xs text-error mt-1">Rejected: {l.rejectionReason}</div>
                        )}
                      </td>
                      <td className="p-3 text-on-surface-variant">{l.sector}</td>
                      <td className="p-3">
                        <StatusBadge status={l.status} />
                      </td>
                      <td className="p-3 text-label-xs">{l.availableFor.join(', ')}</td>
                      <td className="p-3 text-label-xs text-on-surface-variant">
                        {new Date(l.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex gap-2 flex-wrap justify-end">
                          {l.status !== 'active' && (
                            <button onClick={() => approveListing(l._id)} className="btn btn-ghost btn-sm text-green-700">
                              <Icon icon="mdi:check" style={{ width: '16px', height: '16px' }} className="mr-1" />
                              Approve
                            </button>
                          )}
                          {l.status !== 'rejected' && (
                            <button onClick={() => setRejecting(l)} className="btn btn-ghost btn-sm text-error">
                              <Icon icon="mdi:close" style={{ width: '16px', height: '16px' }} className="mr-1" />
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Dialog.Root open={!!rejecting} onOpenChange={(o) => !o && setRejecting(null)}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface p-6 max-w-md w-full z-50 shadow-card">
                <Dialog.Title className="font-headline text-title-lg font-bold text-on-surface mb-2">
                  Reject listing
                </Dialog.Title>
                <Dialog.Description className="text-body-sm text-on-surface-variant mb-4">
                  Provide a reason. The seller will see this message.
                </Dialog.Description>
                <textarea
                  className="form-input"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Insufficient financial documentation"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Dialog.Close className="btn btn-ghost">Cancel</Dialog.Close>
                  <button onClick={rejectListing} className="btn btn-primary bg-error">
                    Reject listing
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      )}

      {tab === 'enquiries' && (
        <div>
          {loadingData ? (
            <div className="text-center py-16 text-on-surface-variant">Loading…</div>
          ) : enquiries.length === 0 ? (
            <div className="bg-surface p-12 text-center border border-outline-variant">
              <p className="text-body-sm text-on-surface-variant">No enquiries yet.</p>
            </div>
          ) : (
            <div className="bg-surface border border-outline-variant overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead className="bg-surface-container text-label-xs uppercase text-on-surface-variant">
                  <tr>
                    <th className="text-left p-3">Contact</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Listing</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((e) => (
                    <tr key={e._id} className="border-t border-outline-variant align-top">
                      <td className="p-3">
                        <div className="font-semibold text-on-surface">{e.name}</div>
                        <div className="text-label-xs text-on-surface-variant">{e.email}</div>
                        <div className="text-label-xs text-on-surface-variant">{e.phone}</div>
                      </td>
                      <td className="p-3 font-semibold">{e.type}</td>
                      <td className="p-3 text-on-surface-variant">{e.listingTitle || '—'}</td>
                      <td className="p-3">
                        <StatusBadge status={e.status} />
                      </td>
                      <td className="p-3 text-label-xs text-on-surface-variant">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <select
                          className="form-input text-label-xs w-auto"
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
          )}
        </div>
      )}

      {tab === 'users' && (
        <div>
          {loadingData ? (
            <div className="text-center py-16 text-on-surface-variant">Loading…</div>
          ) : (
            <div className="bg-surface border border-outline-variant overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead className="bg-surface-container text-label-xs uppercase text-on-surface-variant">
                  <tr>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Joined</th>
                    <th className="text-left p-3">Last login</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t border-outline-variant">
                      <td className="p-3 font-semibold">{u.name}</td>
                      <td className="p-3 text-on-surface-variant">{u.email}</td>
                      <td className="p-3 capitalize">
                        <span className="px-2 py-0.5 bg-surface-container text-label-xs font-semibold">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-label-xs text-on-surface-variant">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-label-xs text-on-surface-variant">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'audit' && (
        <div>
          {loadingData ? (
            <div className="text-center py-16 text-on-surface-variant">Loading…</div>
          ) : audit.length === 0 ? (
            <div className="bg-surface p-12 text-center border border-outline-variant">
              <p className="text-body-sm text-on-surface-variant">No audit events yet.</p>
            </div>
          ) : (
            <div className="bg-surface border border-outline-variant overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead className="bg-surface-container text-label-xs uppercase text-on-surface-variant">
                  <tr>
                    <th className="text-left p-3">Action</th>
                    <th className="text-left p-3">Actor</th>
                    <th className="text-left p-3">Target</th>
                    <th className="text-left p-3">IP</th>
                    <th className="text-left p-3">When</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.map((a) => (
                    <tr key={a._id} className="border-t border-outline-variant">
                      <td className="p-3 font-mono text-label-xs">{a.action}</td>
                      <td className="p-3">
                        <div>{a.actorEmail || '—'}</div>
                        <div className="text-label-xs text-on-surface-variant capitalize">{a.actorRole}</div>
                      </td>
                      <td className="p-3 text-label-xs">
                        {a.targetType} {a.targetId ? `#${a.targetId.slice(-6)}` : ''}
                      </td>
                      <td className="p-3 text-label-xs font-mono">{a.ip}</td>
                      <td className="p-3 text-label-xs text-on-surface-variant">
                        {new Date(a.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  secondary,
  accent,
}: {
  icon: string;
  label: string;
  value: number;
  secondary?: string;
  accent?: boolean;
}) {
  return (
    <div className={`bg-surface border p-6 ${accent ? 'border-accent' : 'border-outline-variant'}`}>
      <div className="flex items-center justify-between mb-3">
        <Icon icon={icon} className={accent ? 'text-accent' : 'text-primary'} style={{ width: '28px', height: '28px' }} />
        <span className="text-label-xs uppercase tracking-widest text-on-surface-variant">{label}</span>
      </div>
      <div className="font-headline text-4xl font-bold text-on-surface">{value.toLocaleString()}</div>
      {secondary && <div className="text-label-xs text-on-surface-variant mt-1">{secondary}</div>}
    </div>
  );
}
