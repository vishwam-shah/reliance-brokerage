'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CIcon } from '@coreui/icons-react';
import { cilX, cilCheck, cilImagePlus, cilTrash } from '@coreui/icons';
import { toast } from 'sonner';

type Values = {
  title: string;
  sector: string;
  location: string;
  description: string;
  valuationNum: number;
  revenueNum: number;
  rentPrice: string;
  availableFor: ('buy' | 'rent')[];
  images: string[];
};

const MAX_IMAGES = 8;

const SECTORS = [
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

const EMPTY: Values = {
  title: '',
  sector: '',
  location: '',
  description: '',
  valuationNum: 0,
  revenueNum: 0,
  rentPrice: '',
  availableFor: ['buy'],
  images: [],
};

function formatRMLabel(millions: number): string {
  if (!millions || millions <= 0) return '';
  if (millions >= 1000) {
    const b = millions / 1000;
    return `RM ${Number.isInteger(b) ? b : b.toFixed(2)}B`;
  }
  if (millions >= 1) {
    return `RM ${Number.isInteger(millions) ? millions : millions.toFixed(2)}M`;
  }
  const k = millions * 1000;
  return `RM ${Number.isInteger(k) ? k : k.toFixed(0)}K`;
}

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
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = MAX_IMAGES - values.images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images`);
      return;
    }
    const list = Array.from(files).slice(0, remaining);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of list) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          credentials: 'include',
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data?.error?.message ?? `Upload failed for ${file.name}`);
          continue;
        }
        uploaded.push(data.url as string);
      }
      if (uploaded.length) {
        setValues(s => ({ ...s, images: [...s.images, ...uploaded] }));
        toast.success(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded`);
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setValues(s => ({ ...s, images: s.images.filter((_, i) => i !== idx) }));
  };

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
        body: JSON.stringify({
          ...values,
          valuation: formatRMLabel(values.valuationNum),
          revenue: formatRMLabel(values.revenueNum),
        }),
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
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-8 z-50 shadow-modal">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="font-headline text-title-lg font-bold text-on-surface">
              {listingId ? 'Edit Listing' : 'New Listing'}
            </Dialog.Title>
            <Dialog.Close className="h-8 w-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
              <CIcon icon={cilX} style={{ width: '16px', height: '16px' }} />
            </Dialog.Close>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="form-label">Business Title*</label>
              <input
                className="form-input"
                value={values.title}
                onChange={(e) => setField('title', e.target.value)}
                required
                maxLength={200}
                placeholder="e.g. Profitable Café in Bangsar"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Sector*</label>
                <select
                  className="form-input"
                  value={values.sector}
                  onChange={(e) => setField('sector', e.target.value)}
                  required
                >
                  <option value="">Select sector…</option>
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Location*</label>
                <input
                  className="form-input"
                  value={values.location}
                  onChange={(e) => setField('location', e.target.value)}
                  required
                  maxLength={100}
                  placeholder="e.g. Kuala Lumpur"
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
                placeholder="Describe the business, what's included, reason for sale, staff count, lease terms, etc."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Asking Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold text-sm select-none">
                    RM
                  </span>
                  <input
                    type="number"
                    className="form-input pl-10"
                    min={0}
                    step={0.01}
                    value={values.valuationNum || ''}
                    onChange={(e) => setField('valuationNum', Number(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <p className="text-label-xs text-on-surface-variant mt-1">
                  {values.valuationNum > 0
                    ? <span className="text-accent font-semibold">{formatRMLabel(values.valuationNum)}</span>
                    : 'Enter amount in millions (e.g. 1.5 = RM 1.5M)'}
                </p>
              </div>
              <div>
                <label className="form-label">Annual Revenue</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold text-sm select-none">
                    RM
                  </span>
                  <input
                    type="number"
                    className="form-input pl-10"
                    min={0}
                    step={0.01}
                    value={values.revenueNum || ''}
                    onChange={(e) => setField('revenueNum', Number(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <p className="text-label-xs text-on-surface-variant mt-1">
                  {values.revenueNum > 0
                    ? <span className="text-accent font-semibold">{formatRMLabel(values.revenueNum)}</span>
                    : 'Enter amount in millions'}
                </p>
              </div>
            </div>

            <div>
              <label className="form-label">Monthly Rental (if applicable)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold text-sm select-none">
                  RM
                </span>
                <input
                  className="form-input pl-10"
                  value={values.rentPrice}
                  onChange={(e) => setField('rentPrice', e.target.value)}
                  placeholder="e.g. 5,000/mo"
                />
              </div>
            </div>

            <div>
              <label className="form-label mb-2 block">
                Photos <span className="text-on-surface-variant font-normal text-xs">({values.images.length}/{MAX_IMAGES})</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {values.images.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={src} alt={`Listing photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 h-7 w-7 rounded-lg bg-black/60 hover:bg-error text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove photo"
                    >
                      <CIcon icon={cilTrash} style={{ width: 13, height: 13 }} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-semibold">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
                {values.images.length < MAX_IMAGES && (
                  <label
                    className={`aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      onChange={(e) => { handleImageUpload(e.target.files); e.target.value = ''; }}
                    />
                    {uploading ? (
                      <span className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CIcon icon={cilImagePlus} style={{ width: 22, height: 22 }} className="text-slate-400" />
                        <span className="text-xs text-slate-500 mt-1">Add photo</span>
                      </>
                    )}
                  </label>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-2">JPG, PNG or WebP · max 2 MB each. First photo is the cover.</p>
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
                        <CIcon icon={cilCheck} className="text-on-primary" style={{ width: '13px', height: '13px' }} />
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
