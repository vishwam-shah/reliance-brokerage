'use client';

import { useCallback, useEffect, useState } from 'react';
import Pagination from '@/components/ui/Pagination';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

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

const TABLE_HEAD = 'text-xs font-semibold text-on-surface-variant px-5 py-3.5 text-left';
const TABLE_CELL = 'px-5 py-4 text-sm';
const ROW_CLASS = 'border-b border-outline-variant/20 hover:bg-surface-container/30 transition-colors last:border-0';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [enquiryPage, setEnquiryPage] = useState(1);
  const [enquiryLimit, setEnquiryLimit] = useState(20);
  const [enquiryTotal, setEnquiryTotal] = useState(0);

  const loadEnquiries = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`/api/enquiries?page=${enquiryPage}&limit=${enquiryLimit}`, { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setEnquiries(data.items ?? []);
        setEnquiryTotal(data.total ?? 0);
      }
    } finally {
      setLoadingData(false);
    }
  }, [enquiryPage, enquiryLimit]);

  useEffect(() => {
    loadEnquiries();
  }, [enquiryPage, enquiryLimit, loadEnquiries]);

  const updateEnquiry = async (id: string, status: string) => {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) return;
    loadEnquiries();
  };

  return (
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
                    <td className={TABLE_CELL}>
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                        e.status === 'new' ? 'bg-blue-50 text-blue-700' :
                        e.status === 'contacted' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      )}>
                        {e.status}
                      </span>
                    </td>
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
          <Pagination
            page={enquiryPage}
            limit={enquiryLimit}
            total={enquiryTotal}
            onPageChange={setEnquiryPage}
            onLimitChange={setEnquiryLimit}
          />
        </Card>
      )}
    </div>
  );
}
