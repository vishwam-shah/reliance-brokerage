import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import { withErrorHandler, ApiErrors, json } from '@/lib/apiHandler';
import { requireRole } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { getClientIp } from '@/lib/rateLimit';

export const POST = withErrorHandler(async (req: NextRequest, ctx) => {
  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) throw ApiErrors.badRequest('Invalid listing id');

  const auth = requireRole(req, ['admin', 'superadmin']);
  if (!auth) throw ApiErrors.forbidden('Only admins may reopen listings');

  await connectDB();
  const listing = await Listing.findById(id);
  if (!listing) throw ApiErrors.notFound('Listing not found');

  const previousStatus = listing.status;
  listing.status = 'active';
  listing.approvedBy = new mongoose.Types.ObjectId(auth.sub);
  listing.approvedAt = new Date();
  await listing.save();

  await logAudit({
    action: 'listing.status_change',
    actor: auth,
    targetType: 'Listing',
    targetId: String(listing._id),
    ip: getClientIp(req),
    userAgent: req.headers.get('user-agent') ?? '',
    meta: { from: previousStatus, to: 'active', reopened: true },
  });

  return json({ ok: true });
});
