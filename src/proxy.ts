import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'rb_session';

function decodeUnverifiedRole(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const b64 = padded.replace(/-/g, '+').replace(/_/g, '/');
    const json = globalThis.atob(b64);
    const data = JSON.parse(json) as { role?: string; exp?: number };
    if (data.exp && data.exp * 1000 < Date.now()) return null;
    return data.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const role = token ? decodeUnverifiedRole(token) : null;

  const isAdminPath = pathname.startsWith('/admin');
  const isDashboardPath = pathname.startsWith('/dashboard');

  if (isAdminPath) {
    if (role !== 'admin' && role !== 'superadmin') {
      const signIn = req.nextUrl.clone();
      signIn.pathname = '/sign-in';
      signIn.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signIn);
    }
  }

  if (isDashboardPath) {
    if (!role) {
      const signIn = req.nextUrl.clone();
      signIn.pathname = '/sign-in';
      signIn.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signIn);
    }
  }

  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
