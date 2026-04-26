import { NextRequest } from 'next/server';
import { requireAuth, signToken, setSessionCookie } from '@/lib/auth';
import { withErrorHandler, json, ApiErrors } from '@/lib/apiHandler';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { logAudit } from '@/lib/audit';

export const PATCH = withErrorHandler(async (req: NextRequest) => {
  const session = requireAuth(req);
  if (!session) throw ApiErrors.unauthorized();

  const body = await req.json().catch(() => ({}));
  if (body?.role !== 'seller') throw ApiErrors.forbidden();
  if (session.role !== 'buyer') {
    return json({ error: { message: 'Only buyers can switch to seller' } }, { status: 400 });
  }

  await connectDB();
  const user = await User.findByIdAndUpdate(session.sub, { role: 'seller' }, { new: true });
  if (!user) throw ApiErrors.notFound();

  const newToken = signToken({ sub: user._id.toString(), email: user.email, role: 'seller', name: user.name });
  const res = json({ ok: true });
  setSessionCookie(res, newToken);

  await logAudit({
    action: 'user.role_switch',
    actor: session,
    targetType: 'User',
    targetId: session.sub,
    ip: req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown',
    userAgent: req.headers.get('user-agent') ?? '',
    meta: { from: 'buyer', to: 'seller' },
  });

  return res;
});
