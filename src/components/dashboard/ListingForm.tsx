'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

type Values = {
  title: string;
  sector: string;
  location: string;
  description: string;
  valuation: string;
  valuationNum: number;
  revenue: string;
  revenueNum: number;
  rentPrice: string;
  availableFor: ('buy' | 'rent')[];
};

const EMPTY: Values = {
  title: '',
  sector: '',
  location: '',
  description: '',
  valuation: '',
  valuationNum: 0,
  revenue: '',
  revenueNum: 0,
  rentPrice: '',
  availableFor: ['buy'],
};

export default function ListingForm({
  open,
  onOpenChange,
  initial,
  listingId,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<Values> | null;
  listingId?: string | null;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<Values>({ ...EMPTY, ...initial });
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof Values>(k: K, v: Values[K]) =>
    setValues((s) => ({ ...s, [k]: v }));

  const toggleAvail = (kind: 'buy' | 'rent') => {
    setValues((s) => {
      const set = new Set(s.availableFor);
      if (set.has(kind)) set.delete(kind);
      else set.add(kind);
      const next = Array.from(set);
      return { ...s, availableFor: next.length ? next : ['buy'] };
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.title.trim() || !values.sector.trim() || !values.location.trim()) {
      toast.error('Title, sector and location are required');
      return;
    }
    setSubmitting(true);
    try {
      const url = listingId ? `/api/listings/${listingId}` : '/api/listings';
      const method = listingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error?.message ?? 'Failed to save listing');
        return;
      }
      toast.success(listingId ? 'Listing updated' : 'Listing submitted — awaiting approval');
      setValues(EMPTY);
      onSaved();
      onOpenChange(false);
    } catch {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface p-8 z-50 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="font-headline text-title-lg font-bold text-on-surface">
              {listingId ? 'Edit Listing' : 'New Listing'}
            </Dialog.Title>
            <Dialog.Close className="text-on-surface-variant hover:text-on-surface">
              <Icon icon="mdi:close" style={{ width: '20px', height: '20px' }} />
            </Dialog.Close>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="form-label">Title*</label>
              <input
                className="form-input"
                value={values.title}
                onChange={(e) => setField('title', e.target.value)}
                required
                maxLength={200}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Sector*</label>
                <input
                  className="form-input"
                  value={values.sector}
                  onChange={(e) => setField('sector', e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label className="form-label">Location*</label>
                <input
                  className="form-input"
                  value={values.location}
                  onChange={(e) => setField('location', e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows={4}
                value={values.description}
                onChange={(e) => setField('description', e.target.value)}
                maxLength={5000}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Valuation (label)</label>
                <input
                  className="form-input"
                  value={values.valuation}
                  onChange={(e) => setField('valuation', e.target.value)}
                  placeholder="RM 45M"
                />
              </div>
              <div>
                <label className="form-label">Valuation (numeric, in millions)</label>
                <input
                  type="number"
                  className="form-input"
                  min={0}
                  value={values.valuationNum}
                  onChange={(e) => setField('valuationNum', Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Revenue (label)</label>
                <input
                  className="form-input"
                  value={values.revenue}
                  onChange={(e) => setField('revenue', e.target.value)}
                  placeholder="RM 120M"
                />
              </div>
              <div>
                <label className="form-label">Revenue (numeric, in millions)</label>
                <input
                  type="number"
                  className="form-input"
                  min={0}
                  value={values.revenueNum}
                  onChange={(e) => setField('revenueNum', Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Rental Price (if applicable)</label>
              <input
                className="form-input"
                value={values.rentPrice}
                onChange={(e) => setField('rentPrice', e.target.value)}
                placeholder="RM 180K/mo"
              />
            </div>

            <div>
              <label className="form-label mb-2 block">Available for</label>
              <div className="flex gap-6">
                {(['buy', 'rent'] as const).map((a) => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox.Root
                      checked={values.availableFor.includes(a)}
                      onCheckedChange={() => toggleAvail(a)}
                      className="w-5 h-5 border-2 border-outline-variant bg-surface data-[state=checked]:bg-primary data-[state=checked]:border-primary flex items-center justify-center"
                    >
                      <Checkbox.Indicator>
                        <Icon icon="mdi:check" className="text-on-primary" style={{ width: '14px', height: '14px' }} />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <span className="capitalize">{a}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
              <Dialog.Close asChild>
                <button type="button" className="btn btn-ghost">
                  Cancel
                </button>
              </Dialog.Close>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? 'Saving…' : listingId ? 'Save Changes' : 'Submit Listing'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
