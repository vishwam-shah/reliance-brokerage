'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

type EnquiryType = 'Buy' | 'Rent' | 'Sell';

interface EnquiryFormProps {
  listingId?: string;
  listingTitle?: string;
  defaultType?: EnquiryType;
  availableTypes?: EnquiryType[];
  variant?: 'card' | 'inline';
  onSubmitted?: () => void;
}

export default function EnquiryForm({
  listingId,
  listingTitle,
  defaultType = 'Buy',
  availableTypes = ['Buy', 'Rent', 'Sell'],
  variant = 'card',
  onSubmitted,
}: EnquiryFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<EnquiryType>(defaultType);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error('Name, email and phone are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, type,
          listingId, listingTitle,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error?.message ?? 'Failed to submit enquiry');
        return;
      }
      toast.success('Thanks! Our team will be in touch within 24 hours.');
      setSubmitted(true);
      setName(''); setEmail(''); setPhone(''); setMessage('');
      onSubmitted?.();
    } catch {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={variant === 'card' ? 'bg-white border border-outline-variant rounded-2xl p-8 text-center' : 'text-center py-8'}>
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <Icon icon="mdi:check-circle" className="text-green-600" style={{ width: 32, height: 32 }} />
        </div>
        <h3 className="font-headline font-bold text-on-surface text-title-lg mb-2">Enquiry received</h3>
        <p className="text-body-sm text-on-surface-variant mb-4">
          Our team will reach out to you within 24 hours via email or WhatsApp.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn btn-ghost btn-sm">
          Submit another enquiry
        </button>
      </div>
    );
  }

  const wrapperClass = variant === 'card'
    ? 'bg-white border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-card'
    : '';

  return (
    <form onSubmit={submit} className={wrapperClass}>
      {variant === 'card' && (
        <div className="mb-5">
          <h3 className="font-headline font-bold text-on-surface text-title-lg">Enquire about this listing</h3>
          <p className="text-body-sm text-on-surface-variant mt-1">
            We&apos;ll connect you with the seller within 24 hours.
          </p>
        </div>
      )}

      {availableTypes.length > 1 && (
        <div className="mb-4">
          <label className="form-label mb-2 block">I want to</label>
          <div className="grid grid-cols-3 gap-2">
            {availableTypes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`h-10 rounded-xl text-sm font-semibold transition-colors ${
                  type === t
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="form-label">Full Name*</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            placeholder="Your name"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="form-label">Email*</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="form-label">Phone*</label>
            <input
              type="tel"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+60 12-345 6789"
            />
          </div>
        </div>
        <div>
          <label className="form-label">Message</label>
          <textarea
            className="form-input"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
            placeholder={listingTitle ? `Tell us about your interest in "${listingTitle}"…` : 'Tell us a bit about what you\'re looking for…'}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full mt-5"
      >
        {submitting ? 'Submitting…' : 'Submit Enquiry'}
        {!submitting && <Icon icon="mdi:arrow-right" style={{ width: 18, height: 18 }} className="ml-1" />}
      </button>

      <p className="text-label-xs text-on-surface-variant mt-3 text-center">
        By submitting, you agree to our <a href="/legal-hub#terms" className="underline hover:text-on-surface">Terms</a> and <a href="/legal-hub#privacy" className="underline hover:text-on-surface">Privacy Policy</a>.
      </p>
    </form>
  );
}
