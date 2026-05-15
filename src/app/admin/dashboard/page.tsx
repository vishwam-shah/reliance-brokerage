'use client';

import { useCallback, useEffect, useState } from 'react';
import { CIcon } from '@coreui/icons-react';
import {
  cilBriefcase,
  cilTask,
  cilX,
  cilEnvelopeLetter,
  cilPeople,
  cilSpeedometer,
} from '@coreui/icons';
import { StatCard } from '@/components/ui/StatCard';
import { StatsLoading } from '@/components/ui/LoadingState';

type Stats = {
  listings: { total: number; active: number; pending: number; rejected: number };
  enquiries: { total: number; new: number };
  users: { total: number; sellers: number; buyers: number };
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  const loadStats = useCallback(async () => {
    const res = await fetch('/api/stats', { credentials: 'include', cache: 'no-store' });
    if (res.ok) setStats(await res.json());
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {!stats ? (
        <StatsLoading />
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
  );
}
