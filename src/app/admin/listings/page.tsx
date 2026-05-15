'use client';

import { useCallback, useEffect, useState } from 'react';
import { CIcon } from '@coreui/icons-react';
import {
  cilBriefcase,
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
import StatusBadge from '@/components/dashboard/StatusBadge';
import ListingForm from '@/components/dashboard/ListingForm';
import Pagination from '@/components/ui/Pagination';
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

const TABLE_HEAD = 'text-xs font-semibold text-on-surface-variant px-5 py-3.5 text-left';
const TABLE_CELL = 'px-5 py-4 text-sm';
const ROW_CLASS = 'border-b border-outline-variant/20 hover:bg-surface-container/30 transition-colors last:border-0';

export default function ListingsPage() {
  const { user } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [listingFilter, setListingFilter] = useState<'all' | 'active' | 'pending_approval' | 'rejected'>('all');

  const [listingPage, setListingPage] = useState(1);
  const [listingLimit, setListingLimit] = useState(20);
  const [listingTotal, setListingTotal] = useState(0);

  const [rejecting, setRejecting] = useState<Listing | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showListingForm, setShowListingForm] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deletingListing, setDeletingListing] = useState<Listing | null>(null);

  const loadListings = useCallback(async () => {
    setLoadingData(true);
    try {
      const statusParam = listingFilter === 'all' ? '' : `&status=${listingFilter}`;
      const res = await fetch(`/api/listings?page=${listingPage}&limit=${listingLimit}${statusParam}`, {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await res.json();
      if (res.ok) {
        setListings(data.items ?? []);
        setListingTotal(data.total ?? 0);
      }
    } finally {
      setLoadingData(false);
    }
  }, [listingPage, listingLimit, listingFilter]);

  useEffect(() => {
    loadListings();
  }, [listingPage, listingLimit, listingFilter, loadListings]);

  const approveListing = async (id: string) => {
    const res = await fetch(`/api/listings/${id}/approve`, { method: 'POST', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) { toast.error(data?.error?.message ?? 'Approve failed'); return; }
    toast.success('Listing approved');
    loadListings();
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
  };

  const reopenListing = async (id: string) => {
    const res = await fetch(`/api/listings/${id}/reopen`, { method: 'POST', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) { toast.error(data?.error?.message ?? 'Reopen failed'); return; }
    toast.success('Listing reopened');
    loadListings();
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
  };

  return (
    <div className="space-y-4">
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
          <Pagination
            page={listingPage}
            limit={listingLimit}
            total={listingTotal}
            onPageChange={setListingPage}
            onLimitChange={setListingLimit}
          />
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
        onSaved={loadListings}
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
  );
}
