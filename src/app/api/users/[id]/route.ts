import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { withErrorHandler, ApiErrors, json, parseJson } from '@/lib/apiHandler';
import { requireRole, requireAuth } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { getClientIp } from '@/lib/rateLimit';

const patchSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().max(20).optional(),
  company: z.string().trim().max(200).optional(),
  role: z.enum(['buyer', 'seller', 'admin', 'superadmin']).optional(),
});

function assertValid(id: string) {
  if (!mongoose.isValidObjectId(id)) throw ApiErrors.badRequest('Invalid id');
}

export const PATCH = withErrorHandler(async (req: NextRequest, ctx) => {
  const { id } = await ctx.params;
  assertValid(id);

  const auth = requireAuth(req);
  if (!auth) throw ApiErrors.unauthorized();

  const body = await parseJson<unknown>(req);
  const patch = patchSchema.parse(body);

  const isSelf = auth.sub === id;
  const isAdmin = auth.role === 'admin' || auth.role === 'superadmin';
  const isSuper = auth.role === 'superadmin';

  if (!isSelf && !isAdmin) throw ApiErrors.forbidden();
  if (patch.role && !isSuper) throw ApiErrors.forbidden('Only superadmin may change roles');

  await connectDB();
  const user = await User.findById(id);
  if (!user) throw ApiErrors.notFound('User not found');

  Object.assign(user, patch);
  await user.save();

  await logAudit({
    action: 'user.update',
    actor: auth,
    targetType: 'User',
    targetId: id,
    ip: getClientIp(req),
    userAgent: req.headers.get('user-agent') ?? '',
    meta: patch,
  });

  return json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      company: user.company,
    },
  });
});

export const DELETE = withErrorHandler(async (req: NextRequest, ctx) => {
  const { id } = await ctx.params;
  assertValid(id);

  const auth = requireRole(req, ['superadmin']);
  if (!auth) throw ApiErrors.forbidden('Only superadmin may delete users');

  if (auth.sub === id) throw ApiErrors.badRequest('Cannot delete your own account');

  await connectDB();
  const user = await User.findById(id);
  if (!user) throw ApiErrors.notFound('User not found');
  await user.deleteOne();

  await logAudit({
    action: 'user.delete',
    actor: auth,
    targetType: 'User',
    targetId: id,
    ip: getClientIp(req),
    userAgent: req.headers.get('user-agent') ?? '',
  });

  return json({ ok: true });
});
