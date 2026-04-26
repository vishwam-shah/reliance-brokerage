import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import { withErrorHandler, ApiErrors, json } from '@/lib/apiHandler';
import { requireAuth, isAdminRole } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { getClientIp } from '@/lib/rateLimit';

export const POST = withErrorHandler(async (req: NextRequest, ctx) => {
  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) throw ApiErrors.badRequest('Invalid listing id');

  const auth = requireAuth(req);
  if (!auth) throw ApiErrors.unauthorized();

  await connectDB();
  const listing = await Listing.findById(id);
  if (!listing) throw ApiErrors.notFound('Listing not found');

  const isAdmin = isAdminRole(auth.role);
  const isOwner = String(listing.createdBy) === auth.sub;
  if (!isAdmin && !isOwner) throw ApiErrors.forbidden();

  if (listing.status === 'closed') {
    return json({ error: { message: 'Listing is already closed' } }, { status: 400 });
  }

  listing.status = 'closed';
  await listing.save();

  await logAudit({
    action: 'listing.status_change',
    actor: auth,
    targetType: 'Listing',
    targetId: String(listing._id),
    ip: getClientIp(req),
    userAgent: req.headers.get('user-agent') ?? '',
    meta: { from: listing.status, to: 'closed' },
  });

  return json({ ok: true });
});
