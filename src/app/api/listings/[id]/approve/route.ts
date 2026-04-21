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
  if (!auth) throw ApiErrors.forbidden();

  await connectDB();
  const listing = await Listing.findById(id);
  if (!listing) throw ApiErrors.notFound('Listing not found');

  listing.status = 'active';
  listing.approvedBy = new mongoose.Types.ObjectId(auth.sub);
  listing.approvedAt = new Date();
  listing.rejectionReason = '';
  await listing.save();

  await logAudit({
    action: 'listing.approve',
    actor: auth,
    targetType: 'Listing',
    targetId: id,
    ip: getClientIp(req),
    userAgent: req.headers.get('user-agent') ?? '',
  });

  return json({ listing });
});
