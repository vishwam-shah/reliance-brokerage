import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { loginSchema } from '@/lib/validation';
import { withErrorHandler, ApiErrors, json, parseJson } from '@/lib/apiHandler';
import { signToken, setSessionCookie } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

const MAX_FAILED = 10;
const LOCKOUT_MS = 15 * 60 * 1000;

export const POST = withErrorHandler(async (req: NextRequest) => {
  const ip = getClientIp(req);

  const rlIp = rateLimit(`login:ip:${ip}`, 20, 5 * 60 * 1000);
  if (!rlIp.allowed) throw ApiErrors.tooMany('Too many login attempts from this IP', rlIp.retryAfterSec);

  const body = await parseJson<unknown>(req);
  const input = loginSchema.parse(body);

  const rlEmail = rateLimit(`login:email:${input.email}`, 8, 15 * 60 * 1000);
  if (!rlEmail.allowed) throw ApiErrors.tooMany('Too many login attempts for this account', rlEmail.retryAfterSec);

  await connectDB();

  const user = await User.findOne({ email: input.email }).select(
    '+password name email role password failedLoginAttempts lockedUntil'
  );

  const genericError = () => ApiErrors.unauthorized('Invalid email or password');

  if (!user) {
    await logAudit({
      action: 'auth.login_failed',
      actorEmail: input.email,
      ip,
      userAgent: req.headers.get('user-agent') ?? '',
      meta: { reason: 'no_user' },
    });
    throw genericError();
  }

  if (user.isLocked()) {
    throw ApiErrors.tooMany(
      'Account temporarily locked due to repeated failed attempts',
      Math.ceil((user.lockedUntil!.getTime() - Date.now()) / 1000)
    );
  }

  const ok = await user.comparePassword(input.password);
  if (!ok) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= MAX_FAILED) {
      user.lockedUntil = new Date(Date.now() + LOCKOUT_MS);
      user.failedLoginAttempts = 0;
    }
    await user.save();

    await logAudit({
      action: 'auth.login_failed',
      actorEmail: input.email,
      ip,
      userAgent: req.headers.get('user-agent') ?? '',
      meta: { reason: 'bad_password', attempts: user.failedLoginAttempts },
    });
    throw genericError();
  }

  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken({
    sub: String(user._id),
    email: user.email,
    role: user.role,
    name: user.name,
  });

  await logAudit({
    action: 'auth.login',
    actor: { sub: String(user._id), email: user.email, role: user.role, name: user.name },
    ip,
    userAgent: req.headers.get('user-agent') ?? '',
  });

  const res = json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
  setSessionCookie(res as NextResponse, token);
  return res;
});
