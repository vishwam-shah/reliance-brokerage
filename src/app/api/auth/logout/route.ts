import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler, json } from '@/lib/apiHandler';
import { clearSessionCookie, requireAuth } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { getClientIp } from '@/lib/rateLimit';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const payload = requireAuth(req);
  const res = json({ ok: true });
  clearSessionCookie(res as NextResponse);
  if (payload) {
    await logAudit({
      action: 'auth.logout',
      actor: payload,
      ip: getClientIp(req),
      userAgent: req.headers.get('user-agent') ?? '',
    });
  }
  return res;
});
