import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { withErrorHandler, ApiErrors, json } from '@/lib/apiHandler';
import { requireRole } from '@/lib/auth';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const auth = requireRole(req, ['admin', 'superadmin']);
  if (!auth) throw ApiErrors.forbidden();

  await connectDB();
  const url = new URL(req.url);
  const role = url.searchParams.get('role') ?? undefined;
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') ?? 20)));

  const filter: Record<string, unknown> = {};
  if (role && ['buyer', 'seller', 'admin', 'superadmin'].includes(role)) filter.role = role;

  const [items, total] = await Promise.all([
    User.find(filter)
      .select('name email role phone company createdAt lastLoginAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
});
