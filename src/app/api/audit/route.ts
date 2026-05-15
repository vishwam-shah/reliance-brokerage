import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';
import { withErrorHandler, ApiErrors, json } from '@/lib/apiHandler';
import { requireRole } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const auth = requireRole(req, ['admin', 'superadmin']);
  if (!auth) throw ApiErrors.forbidden();

  const ip = getClientIp(req);
  const rl = rateLimit(`audit:read:${ip}`, 30, 60 * 1000);
  if (!rl.allowed) throw ApiErrors.tooMany('Too many requests', rl.retryAfterSec);

  await connectDB();
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') ?? 50)));
  const action = url.searchParams.get('action') ?? undefined;

  const filter: Record<string, unknown> = {};
  if (action) filter.action = action;

  const [items, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .allowDiskUse(true)
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  return json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
});
