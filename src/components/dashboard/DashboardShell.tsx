'use client';

import { useState, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';
import * as Tooltip from '@radix-ui/react-tooltip';
import { CIcon } from '@coreui/icons-react';
import {
  cilMenu,
  cilChevronLeft,
  cilChevronRight,
  cilChevronBottom,
  cilAccountLogout,
} from '@coreui/icons';
import { cn } from '@/lib/utils';
import type { SessionUser } from '@/hooks/useSession';

export type NavItem = { label: string; icon: string | string[]; value: string };

interface DashboardShellProps {
  user: SessionUser;
  title: string;
  items: NavItem[];
  activeValue: string;
  onSelect: (value: string) => void;
  children: React.ReactNode;
}

const STORAGE_KEY = 'rb_sidebar_collapsed';

export default function DashboardShell({
  user,
  title,
  items,
  activeValue,
  onSelect,
  children,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setCollapsed(stored === 'true');
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sidebarW = collapsed ? 'lg:w-[72px]' : 'lg:w-64';
  const contentPad = collapsed ? 'lg:pl-[72px]' : 'lg:pl-64';

  return (
    <Tooltip.Provider delayDuration={250}>
      <div className="min-h-screen bg-slate-50 flex">

        {/* Mobile overlay */}
        {mobileOpen && (
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}

        {/* ── Sidebar ────────────────────────────────────── */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 flex flex-col',
            'bg-slate-900 text-white',
            'transition-all duration-200 ease-out',
            'w-64',                              // always 256px wide (mobile full)
            sidebarW,                            // collapse on desktop
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
            'lg:translate-x-0',
          )}
        >
          {/* Logo */}
          <div className={cn(
            'h-16 flex items-center shrink-0 border-b border-white/[0.06]',
            collapsed ? 'justify-center px-4' : 'px-5 gap-3',
          )}>
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shrink-0">
              <span className="font-headline font-bold text-white text-sm leading-none">R</span>
            </div>
            {(!collapsed || !mounted) && (
              <div className="min-w-0 overflow-hidden">
                <p className="font-headline font-bold text-white text-sm leading-none truncate">Reliance</p>
                <p className="text-white/40 text-[11px] leading-none mt-0.5">Brokerage</p>
              </div>
            )}
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
            {items.map(item => {
              const active = item.value === activeValue;

              if (collapsed && mounted) {
                return (
                  <Tooltip.Root key={item.value}>
                    <Tooltip.Trigger asChild>
                      <button
                        onClick={() => { onSelect(item.value); setMobileOpen(false); }}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'w-full flex items-center justify-center h-10 rounded-xl',
                          'transition-all duration-150',
                          active
                            ? 'bg-accent/[0.18] text-accent'
                            : 'text-white/45 hover:text-white hover:bg-white/[0.07]',
                        )}
                      >
                        <CIcon icon={item.icon} style={{ width: 18, height: 18, flexShrink: 0 }} />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="right"
                        sideOffset={10}
                        className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg z-50"
                      >
                        {item.label}
                        <Tooltip.Arrow className="fill-slate-800" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                );
              }

              return (
                <button
                  key={item.value}
                  onClick={() => { onSelect(item.value); setMobileOpen(false); }}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 h-10 rounded-xl text-left',
                    'transition-all duration-150 text-sm font-medium',
                    active
                      ? 'bg-accent/[0.18] text-accent'
                      : 'text-white/45 hover:text-white hover:bg-white/[0.07]',
                  )}
                >
                  <CIcon icon={item.icon} style={{ width: 18, height: 18, flexShrink: 0 }} />
                  <span className="truncate flex-1">{item.label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="shrink-0 border-t border-white/[0.06] p-3 space-y-1">
            {/* Collapse toggle (desktop only) */}
            <button
              onClick={toggleCollapsed}
              className={cn(
                'hidden lg:flex w-full items-center gap-3 px-3 h-9 rounded-xl',
                'text-white/30 hover:text-white/60 hover:bg-white/[0.06]',
                'transition-all duration-150 text-xs',
                collapsed ? 'justify-center' : '',
              )}
            >
              <CIcon
                icon={collapsed ? cilChevronRight : cilChevronLeft}
                style={{ width: 14, height: 14 }}
              />
              {!collapsed && mounted && <span>Collapse sidebar</span>}
            </button>

            {/* User dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className={cn(
                    'w-full flex items-center gap-3 px-3 h-11 rounded-xl',
                    'hover:bg-white/[0.07] transition-all duration-150 text-left',
                    collapsed ? 'justify-center' : '',
                  )}
                >
                  <Avatar.Root className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-accent/20 flex items-center justify-center">
                    <Avatar.Fallback className="text-accent font-bold text-[11px]">{initials}</Avatar.Fallback>
                  </Avatar.Root>
                  {(!collapsed || !mounted) && (
                    <>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-xs font-semibold truncate leading-none">{user.name}</p>
                        <p className="text-white/40 text-[11px] capitalize leading-none mt-0.5">{user.role}</p>
                      </div>
                      <CIcon icon={cilChevronBottom} style={{ width: 13, height: 13 }} className="text-white/25 shrink-0" />
                    </>
                  )}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  side="top"
                  align={collapsed ? 'start' : 'end'}
                  sideOffset={8}
                  className={cn(
                    'bg-white rounded-2xl shadow-modal border border-outline-variant/30 p-2',
                    'min-w-[200px] z-50',
                    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                  )}
                >
                  <div className="px-3 py-2.5 mb-1">
                    <p className="text-sm font-semibold text-on-surface leading-none">{user.name}</p>
                    <p className="text-xs text-on-surface-variant capitalize mt-0.5">{user.role} account</p>
                  </div>
                  <DropdownMenu.Separator className="h-px bg-outline-variant/30 my-1" />
                  <DropdownMenu.Item
                    onSelect={async () => {
                      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                      window.location.href = '/sign-in';
                    }}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2.5 rounded-xl',
                      'text-sm text-error cursor-pointer outline-none',
                      'hover:bg-red-50 transition-colors',
                    )}
                  >
                    <CIcon icon={cilAccountLogout} style={{ width: 15, height: 15 }} />
                    Sign out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </aside>

        {/* ── Content ────────────────────────────────────── */}
        <div className={cn('flex-1 flex flex-col min-h-screen transition-all duration-200', contentPad)}>
          {/* Topbar */}
          <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-black/[0.06] flex items-center px-5 gap-4 shrink-0">
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden h-9 w-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <CIcon icon={cilMenu} style={{ width: 20, height: 20 }} />
            </button>

            <div className="flex-1">
              <h1 className="font-headline font-semibold text-on-surface text-[15px]">{title}</h1>
            </div>

            {/* Avatar (topbar) */}
            <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden bg-accent/15 flex items-center justify-center">
              <Avatar.Fallback className="text-accent font-bold text-xs">{initials}</Avatar.Fallback>
            </Avatar.Root>
          </header>

          {/* Page body */}
          <main className="flex-1 p-5 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
