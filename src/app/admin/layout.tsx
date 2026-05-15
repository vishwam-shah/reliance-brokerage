'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CIcon } from '@coreui/icons-react';
import {
  cilSpeedometer,
  cilBriefcase,
  cilTask,
  cilEnvelopeLetter,
  cilPeople,
  cilHistory,
} from '@coreui/icons';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useSession } from '@/hooks/useSession';

const navItems = [
  { label: 'Overview', icon: cilSpeedometer, value: 'dashboard' },
  { label: 'Listings', icon: cilBriefcase, value: 'listings' },
  { label: 'Approvals', icon: cilTask, value: 'approvals' },
  { label: 'Enquiries', icon: cilEnvelopeLetter, value: 'enquiries' },
  { label: 'Users', icon: cilPeople, value: 'users' },
  { label: 'Audit Log', icon: cilHistory, value: 'audit' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useSession();

  useEffect(() => {
    if (!loading && !user) router.push('/sign-in?redirect=/admin');
    if (!loading && user && user.role !== 'admin' && user.role !== 'superadmin') {
      router.push('/dashboard');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Determine active nav item based on pathname
  const activeValue = pathname === '/admin' || pathname === '/admin/dashboard' ? 'dashboard' : 
                     pathname.includes('/approvals') ? 'approvals' :
                     pathname.includes('/listings') ? 'listings' :
                     pathname.includes('/enquiries') ? 'enquiries' :
                     pathname.includes('/users') ? 'users' :
                     pathname.includes('/audit') ? 'audit' : 'dashboard';

  const handleNavSelect = (value: string) => {
    if (value === 'dashboard') {
      router.push('/admin/dashboard');
    } else {
      router.push(`/admin/${value}`);
    }
  };

  return (
    <DashboardShell 
      user={user} 
      title="Admin Panel" 
      items={navItems} 
      activeValue={activeValue}
      onSelect={handleNavSelect}
    >
      {children}
    </DashboardShell>
  );
}
