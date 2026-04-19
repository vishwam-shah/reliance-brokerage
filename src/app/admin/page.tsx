'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';

const WHATSAPP_NUMBER = '60142642414';

type Listing = {
  id: number;
  title: string;
  sector: string;
  location: string;
  valuation: string;
  revenue: string;
  rentPrice: string;
  availableFor: ('buy' | 'rent')[];
  status: 'active' | 'pending' | 'closed';
  createdAt: string;
};

const initialListings: Listing[] = [
  { id: 1, title: 'Premium Manufacturing Facility', sector: 'Manufacturing', location: 'Klang Valley', valuation: 'RM 45M', revenue: 'RM 120M', rentPrice: 'RM 180K/mo', availableFor: ['buy', 'rent'], status: 'active', createdAt: '2024-01-10' },
  { id: 2, title: 'Tech Logistics Hub', sector: 'Logistics', location: 'Shah Alam', valuation: 'RM 28M', revenue: 'RM 85M', rentPrice: 'RM 95K/mo', availableFor: ['buy', 'rent'], status: 'active', createdAt: '2024-01-15' },
  { id: 3, title: 'Distribution Network', sector: 'Distribution', location: 'Petaling Jaya', valuation: 'RM 32M', revenue: 'RM 95M', rentPrice: '', availableFor: ['buy'], status: 'pending', createdAt: '2024-01-20' },
];

const enquiries = [
  { id: 1, name: 'Ahmad Rashid', type: 'Buy', listing: 'Premium Manufacturing Facility', date: '2024-01-22', status: 'new' },
  { id: 2, name: 'Tan Wei Ming', type: 'Rent', listing: 'Tech Logistics Hub', date: '2024-01-21', status: 'contacted' },
  { id: 3, name: 'Priya Nair', type: 'Sell', listing: 'New Listing', date: '2024-01-20', status: 'new' },
];

const emptyListing: Omit<Listing, 'id' | 'createdAt'> = {
  title: '', sector: '', location: '', valuation: '', revenue: '', rentPrice: '', availableFor: ['buy'], status: 'pending',
};

export default function AdminPage() {
  const [tab, setTab] = useState<'listings' | 'enquiries'>('listings');
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<typeof emptyListing>(emptyListing);
  const [editId, setEditId] = useState<number | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [authError, setAuthError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'reliance2024') {
      setAuthenticated(true);
    } else {
      setAuthError('Invalid password');
    }
  };

  const handleSave = () => {
    if (editId !== null) {
      setListings(prev => prev.map(l => l.id === editId ? { ...formData, id: editId, createdAt: l.createdAt } : l));
    } else {
      const newListing: Listing = { ...formData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
      setListings(prev => [...prev, newListing]);
      const msg = `New Listing Added:\n\nTitle: ${formData.title}\nSector: ${formData.sector}\nLocation: ${formData.location}\nValuation: ${formData.valuation}\nAvailable For: ${formData.availableFor.join(', ')}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    }
    setShowForm(false);
    setEditId(null);
    setFormData(emptyListing);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this listing?')) setListings(prev => prev.filter(l => l.id !== id));
  };

  const handleEdit = (listing: Listing) => {
    setEditId(listing.id);
    setFormData({ title: listing.title, sector: listing.sector, location: listing.location, valuation: listing.valuation, revenue: listing.revenue, rentPrice: listing.rentPrice, availableFor: listing.availableFor, status: listing.status });
    setShowForm(true);
  };

  const forwardEnquiry = (enq: typeof enquiries[0]) => {
    const msg = `Enquiry Follow-up:\n\nName: ${enq.name}\nInterest: ${enq.type}\nListing: ${enq.listing}\nDate: ${enq.date}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center pt-20">
        <div className="bg-surface-container-lowest p-12 w-full max-w-md border border-outline-variant">
          <h1 className="font-headline text-headline-md font-bold text-on-surface mb-8 text-center">Admin Login</h1>
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter admin password"
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
              />
              {authError && <p className="text-error text-label-sm mt-1">{authError}</p>}
            </div>
            <button type="submit" className="btn btn-primary w-full">Enter Admin</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-headline text-display-sm font-bold text-on-surface">Admin Panel</h1>
            <p className="text-body-sm text-on-surface-variant mt-1">Manage listings and enquiries</p>
          </div>
          <button onClick={() => setAuthenticated(false)} className="btn btn-ghost btn-sm">
            <Icon icon="mdi:logout" style={{ width: '16px', height: '16px' }} className="mr-2" />
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Listings', value: listings.length, icon: 'mdi:storefront' },
            { label: 'Active', value: listings.filter(l => l.status === 'active').length, icon: 'mdi:check-circle' },
            { label: 'Pending', value: listings.filter(l => l.status === 'pending').length, icon: 'mdi:clock' },
            { label: 'Enquiries', value: enquiries.length, icon: 'mdi:message' },
          ].map(stat => (
            <div key={stat.label} className="bg-surface-container-lowest p-6 border border-outline-variant">
              <Icon icon={stat.icon} className="text-accent mb-3" style={{ width: '28px', height: '28px' }} />
              <p className="font-headline text-2xl font-bold text-on-surface">{stat.value}</p>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-outline-variant">
          {(['listings', 'enquiries'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 font-label font-semibold text-label-sm uppercase tracking-widest transition-colors border-b-2 -mb-px ${tab === t ? 'border-accent text-on-surface' : 'border-transparent text-on-surface-variant'}`}
            >
              {t === 'listings' ? 'Listings' : 'Enquiries'}
            </button>
          ))}
        </div>

        {tab === 'listings' && (
          <div>
            <div className="flex justify-end mb-6">
              <button onClick={() => { setShowForm(true); setEditId(null); setFormData(emptyListing); }} className="btn btn-primary">
                <Icon icon="mdi:plus" style={{ width: '18px', height: '18px' }} className="mr-2" />
                Add Listing
              </button>
            </div>

            {showForm && (
              <div className="bg-surface-container-lowest border border-outline-variant p-8 mb-8">
                <h3 className="font-headline text-title-lg font-bold text-on-surface mb-6">{editId ? 'Edit Listing' : 'New Listing'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { key: 'title', label: 'Title', placeholder: 'Business name' },
                    { key: 'sector', label: 'Sector', placeholder: 'e.g. Manufacturing' },
                    { key: 'location', label: 'Location', placeholder: 'e.g. Klang Valley' },
                    { key: 'valuation', label: 'Valuation', placeholder: 'e.g. RM 10M' },
                    { key: 'revenue', label: 'Annual Revenue', placeholder: 'e.g. RM 30M' },
                    { key: 'rentPrice', label: 'Rent Price (optional)', placeholder: 'e.g. RM 50K/mo' },
                  ].map(field => (
                    <div key={field.key} className="form-group">
                      <label className="form-label">{field.label}</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder={field.placeholder}
                        value={(formData as any)[field.key]}
                        onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div className="form-group">
                    <label className="form-label">Available For</label>
                    <div className="flex gap-4 mt-2">
                      {(['buy', 'rent'] as const).map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.availableFor.includes(opt)}
                            onChange={e => setFormData(prev => ({ ...prev, availableFor: e.target.checked ? [...prev.availableFor, opt] : prev.availableFor.filter(v => v !== opt) }))}
                          />
                          <span className="text-body-sm capitalize">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-input" value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as Listing['status'] }))}>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={handleSave} className="btn btn-primary">Save Listing</button>
                  <button onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container">
                    <th className="p-4 font-label text-label-sm text-on-surface-variant uppercase tracking-widest">Title</th>
                    <th className="p-4 font-label text-label-sm text-on-surface-variant uppercase tracking-widest hidden md:table-cell">Sector</th>
                    <th className="p-4 font-label text-label-sm text-on-surface-variant uppercase tracking-widest hidden md:table-cell">Valuation</th>
                    <th className="p-4 font-label text-label-sm text-on-surface-variant uppercase tracking-widest">Available</th>
                    <th className="p-4 font-label text-label-sm text-on-surface-variant uppercase tracking-widest">Status</th>
                    <th className="p-4 font-label text-label-sm text-on-surface-variant uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(listing => (
                    <tr key={listing.id} className="border-t border-outline-variant hover:bg-surface-container-low">
                      <td className="p-4 font-body text-body-sm text-on-surface font-semibold">{listing.title}</td>
                      <td className="p-4 font-body text-body-sm text-on-surface-variant hidden md:table-cell">{listing.sector}</td>
                      <td className="p-4 font-body text-body-sm text-on-surface-variant hidden md:table-cell">{listing.valuation}</td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          {listing.availableFor.map(a => (
                            <span key={a} className="px-2 py-0.5 bg-surface-container text-label-xs uppercase tracking-wider text-on-surface-variant">{a}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-label-xs font-bold uppercase tracking-wider ${listing.status === 'active' ? 'bg-success text-white' : listing.status === 'pending' ? 'bg-warning text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(listing)} className="p-2 text-on-surface-variant hover:text-accent transition-colors">
                            <Icon icon="mdi:pencil" style={{ width: '18px', height: '18px' }} />
                          </button>
                          <button onClick={() => handleDelete(listing.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors">
                            <Icon icon="mdi:delete" style={{ width: '18px', height: '18px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'enquiries' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container">
                  <th className="p-4 font-label text-label-sm text-on-surface-variant uppercase tracking-widest">Name</th>
                  <th className="p-4 font-label text-label-sm text-on-surface-variant uppercase tracking-widest">Type</th>
                  <th className="p-4 font-label text-label-sm text-on-surface-variant uppercase tracking-widest hidden md:table-cell">Listing</th>
                  <th className="p-4 font-label text-label-sm text-on-surface-variant uppercase tracking-widest">Date</th>
                  <th className="p-4 font-label text-label-sm text-on-surface-variant uppercase tracking-widest">Status</th>
                  <th className="p-4 font-label text-label-sm text-on-surface-variant uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map(enq => (
                  <tr key={enq.id} className="border-t border-outline-variant hover:bg-surface-container-low">
                    <td className="p-4 font-body text-body-sm text-on-surface font-semibold">{enq.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-label-xs font-bold uppercase ${enq.type === 'Buy' ? 'bg-primary text-on-primary' : enq.type === 'Rent' ? 'bg-accent text-on-accent' : 'bg-secondary text-on-secondary'}`}>
                        {enq.type}
                      </span>
                    </td>
                    <td className="p-4 text-body-sm text-on-surface-variant hidden md:table-cell">{enq.listing}</td>
                    <td className="p-4 text-body-sm text-on-surface-variant">{enq.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-label-xs font-bold uppercase ${enq.status === 'new' ? 'bg-error text-on-error' : 'bg-surface-container text-on-surface-variant'}`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => forwardEnquiry(enq)} className="flex items-center gap-2 text-label-xs font-bold text-[#25D366] uppercase tracking-widest hover:opacity-80">
                        <Icon icon="mdi:whatsapp" style={{ width: '16px', height: '16px' }} />
                        Forward
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
