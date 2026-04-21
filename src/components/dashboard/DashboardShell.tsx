'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Avatar from '@radix-ui/react-avatar';
import { toast } from 'sonner';
import type { SessionUser } from '@/hooks/useSession';

type NavItem = {
  label: string;
  icon: string;
  value: string;
};

const COLLAPSE_KEY = 'rb_sidebar_collapsed';

export default function DashboardShell({
  user,
  title,
  items,
  activeValue,
  onSelect,
  children,
}: {
  user: SessionUser;
  title: string;
  items: NavItem[];
  activeValue: string;
  onSelect: (v: string) => void;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === '1');
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      } catch {}
      return next;
    });
  };

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    toast.success('Signed out');
    router.push('/sign-in');
    router.refresh();
  };

  const activePageLabel = items.find((i) => i.value === activeValue)?.label ?? title;

  const sidebarWidth = collapsed ? 'w-20' : 'w-64';

  const renderNavButton = (item: NavItem) => {
    const active = activeValue === item.value;
    const btn = (
      <button
        onClick={() => {
          onSelect(item.value);
          setMobileOpen(false);
        }}
        aria-current={active ? 'page' : undefined}
        className={`relative w-full flex items-center gap-3 px-4 py-3 text-left font-label text-label-sm uppercase tracking-wider transition-colors ${
          active
            ? 'bg-accent bg-opacity-15 text-accent'
            : 'text-white text-opacity-70 hover:text-white hover:bg-white hover:bg-opacity-5'
        } ${collapsed ? 'justify-center' : ''}`}
      >
        {active && <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent" aria-hidden />}
        <Icon icon={item.icon} style={{ width: '20px', height: '20px' }} className="flex-shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </button>
    );
    if (!collapsed) return btn;
    return (
      <Tooltip.Root key={item.value}>
        <Tooltip.Trigger asChild>{btn}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            sideOffset={8}
            className="bg-on-surface text-white px-3 py-1.5 text-label-xs font-semibold uppercase tracking-wider shadow-card z-50"
          >
            {item.label}
            <Tooltip.Arrow className="fill-on-surface" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="min-h-screen bg-surface-container flex">
        {/* Mobile overlay */}
        {mobileOpen && (
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 bg-on-surface text-white flex flex-col transition-all duration-200 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 ${sidebarWidth}`}
        >
          {/* Brand */}
          <div
            className={`h-20 flex items-center border-b border-white border-opacity-10 ${
              collapsed ? 'justify-center px-0' : 'px-5'
            }`}
          >
            <Link href="/" className="flex items-center gap-2 min-w-0" title="Reliance Brokerage">
              <Image
                src="/logo.jpeg"
                alt="Reliance"
                width={36}
                height={36}
                className="rounded-md flex-shrink-0"
              />
              {!collapsed && (
                <span className="font-headline font-bold text-title-lg truncate">Reliance</span>
              )}
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
            {items.map((item) => renderNavButton(item))}
          </nav>

          {/* Footer (collapse toggle + context) */}
          <div className="border-t border-white border-opacity-10 p-3 space-y-1">
            {!collapsed && (
              <div className="px-2 pb-2 text-label-xs text-white text-opacity-50 truncate">
                {title}
              </div>
            )}
            <button
              onClick={toggleCollapsed}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={`w-full flex items-center gap-3 px-3 py-2 text-white text-opacity-60 hover:text-white hover:bg-white hover:bg-opacity-5 ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <Icon
                icon={collapsed ? 'mdi:chevron-double-right' : 'mdi:chevron-double-left'}
                style={{ width: '20px', height: '20px' }}
              />
              {!collapsed && (
                <span className="text-label-xs font-semibold uppercase tracking-wider">Collapse</span>
              )}
            </button>
          </div>
        </aside>

        {/* Main */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-out ${
            collapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
        >
          {/* Topbar */}
          <header className="bg-surface border-b border-outline-variant sticky top-0 z-20">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                  className="lg:hidden p-1 text-on-surface"
                >
                  <Icon icon="mdi:menu" style={{ width: '24px', height: '24px' }} />
                </button>
                <h1 className="font-headline text-title-lg font-bold text-on-surface truncate">
                  {activePageLabel}
                </h1>
              </div>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="flex items-center gap-3 px-2 py-1 hover:bg-surface-container rounded outline-none">
                  <Avatar.Root className="w-9 h-9 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold">
                    <Avatar.Fallback>{initials || '?'}</Avatar.Fallback>
                  </Avatar.Root>
                  <div className="hidden sm:block text-left">
                    <div className="text-body-sm font-semibold text-on-surface leading-tight">
                      {user.name}
                    </div>
                    <div className="text-label-xs text-on-surface-variant capitalize leading-tight">
                      {user.role}
                    </div>
                  </div>
                  <Icon icon="mdi:chevron-down" style={{ width: '16px', height: '16px' }} />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={6}
                    className="bg-surface border border-outline-variant shadow-card py-2 min-w-[220px] z-50"
                  >
                    <div className="px-4 py-2 border-b border-outline-variant">
                      <div className="text-body-sm font-semibold text-on-surface">{user.name}</div>
                      <div className="text-label-xs text-on-surface-variant">{user.email}</div>
                    </div>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/"
                        className="block px-4 py-2 text-body-sm hover:bg-surface-container cursor-pointer outline-none"
                      >
                        <Icon
                          icon="mdi:home"
                          className="inline mr-2"
                          style={{ width: '16px', height: '16px' }}
                        />
                        Back to site
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={logout}
                      className="px-4 py-2 text-body-sm text-error hover:bg-error hover:bg-opacity-10 cursor-pointer outline-none"
                    >
                      <Icon
                        icon="mdi:logout"
                        className="inline mr-2"
                        style={{ width: '16px', height: '16px' }}
                      />
                      Sign out
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </header>

          <main className="flex-1 p-6 max-w-7xl w-full">{children}</main>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
