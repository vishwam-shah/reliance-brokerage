'use client';

import { useCallback, useEffect, useState } from 'react';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin' | 'superadmin';
};

type State = {
  user: SessionUser | null;
  loading: boolean;
};

export function useSession() {
  const [state, setState] = useState<State>({ user: null, loading: true });

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' });
      if (!res.ok) {
        setState({ user: null, loading: false });
        return;
      }
      const data = await res.json();
      setState({ user: data.user, loading: false });
    } catch {
      setState({ user: null, loading: false });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setState({ user: null, loading: false });
  }, []);

  return { ...state, refresh, logout };
}

export function redirectForRole(role: SessionUser['role']): string {
  if (role === 'admin' || role === 'superadmin') return '/admin';
  return '/dashboard';
}
