'use client';

import { useCallback, useEffect, useState } from 'react';
import Pagination from '@/components/ui/Pagination';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

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

export default function AuditPage() {
  const [audit, setAudit] = useState<AuditItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [auditPage, setAuditPage] = useState(1);
  const [auditLimit, setAuditLimit] = useState(20);
  const [auditTotal, setAuditTotal] = useState(0);

  const loadAudit = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`/api/audit?page=${auditPage}&limit=${auditLimit}`, { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setAudit(data.items ?? []);
        setAuditTotal(data.total ?? 0);
      }
    } finally {
      setLoadingData(false);
    }
  }, [auditPage, auditLimit]);

  useEffect(() => {
    loadAudit();
  }, [auditPage, auditLimit, loadAudit]);

  return (
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
          <Pagination
            page={auditPage}
            limit={auditLimit}
            total={auditTotal}
            onPageChange={setAuditPage}
            onLimitChange={setAuditLimit}
          />
        </Card>
      )}
    </div>
  );
}
