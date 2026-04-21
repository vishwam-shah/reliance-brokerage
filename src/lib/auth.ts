import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be defined in production');
  }
  console.warn('[auth] JWT_SECRET not set — using insecure fallback for dev only');
}
const SECRET = JWT_SECRET || 'dev-only-insecure-fallback-do-not-use-in-prod';

export const SESSION_COOKIE = 'rb_session';
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

export type UserRole = 'buyer' | 'seller' | 'admin' | 'superadmin';

export type JWTPayload = {
  sub: string;
  email: string;
  role: UserRole;
  name: string;
};

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: SESSION_MAX_AGE_SEC });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET);
    if (typeof decoded === 'string') return null;
    const { sub, email, role, name } = decoded as JWTPayload;
    if (!sub || !email || !role) return null;
    return { sub, email, role, name };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (cookie) return cookie;
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export function requireAuth(req: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

export function requireRole(req: NextRequest, roles: UserRole[]): JWTPayload | null {
  const payload = requireAuth(req);
  if (!payload) return null;
  return roles.includes(payload.role) ? payload : null;
}

export function isAdminRole(role: UserRole): boolean {
  return role === 'admin' || role === 'superadmin';
}

export function setSessionCookie(res: NextResponse, token: string) {
  res.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function getServerSession(): Promise<JWTPayload | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
