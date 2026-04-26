import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import { withErrorHandler, ApiErrors, json, parseJson } from '@/lib/apiHandler';
import { requireRole } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { getClientIp } from '@/lib/rateLimit';

export const POST = withErrorHandler(async (req: NextRequest, ctx) => {
  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) throw ApiErrors.badRequest('Invalid listing id');

  const auth = requireRole(req, ['admin', 'superadmin']);
  if (!auth) throw ApiErrors.forbidden('Only admins may feature listings');

  const body = await parseJson<{ featured?: boolean }>(req);
  const featured = Boolean(body.featured);

  await connectDB();
  const listing = await Listing.findById(id);
  if (!listing) throw ApiErrors.notFound('Listing not found');

  listing.featured = featured;
  await listing.save();

  await logAudit({
    action: 'listing.update',
    actor: auth,
    targetType: 'Listing',
    targetId: String(listing._id),
    ip: getClientIp(req),
    userAgent: req.headers.get('user-agent') ?? '',
    meta: { featured },
  });

  return json({ ok: true, featured });
});
