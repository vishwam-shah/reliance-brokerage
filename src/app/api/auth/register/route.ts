import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { registerSchema } from '@/lib/validation';
import { withErrorHandler, ApiErrors, json, parseJson } from '@/lib/apiHandler';
import { signToken, setSessionCookie } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const ip = getClientIp(req);

  const rl = rateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) throw ApiErrors.tooMany('Too many registration attempts. Try later.', rl.retryAfterSec);

  const body = await parseJson<unknown>(req);
  const input = registerSchema.parse(body);

  await connectDB();

  const existing = await User.findOne({ email: input.email });
  if (existing) throw ApiErrors.conflict('An account with this email already exists');

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: input.password,
    phone: input.phone ?? '',
    company: input.company ?? '',
    role: input.role,
  });

  const token = signToken({
    sub: String(user._id),
    email: user.email,
    role: user.role,
    name: user.name,
  });

  await logAudit({
    action: 'auth.register',
    actor: { sub: String(user._id), email: user.email, role: user.role, name: user.name },
    ip,
    userAgent: req.headers.get('user-agent') ?? '',
  });

  const res = json(
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    { status: 201 }
  );
  setSessionCookie(res as NextResponse, token);
  return res;
});
