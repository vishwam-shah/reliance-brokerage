import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import { withErrorHandler, ApiErrors, json, parseJson } from '@/lib/apiHandler';
import { requireRole } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { getClientIp } from '@/lib/rateLimit';

const bodySchema = z.object({ reason: z.string().trim().min(3).max(500) });

export const POST = withErrorHandler(async (req: NextRequest, ctx) => {
  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) throw ApiErrors.badRequest('Invalid listing id');

  const auth = requireRole(req, ['admin', 'superadmin']);
  if (!auth) throw ApiErrors.forbidden();

  const body = await parseJson<unknown>(req);
  const { reason } = bodySchema.parse(body);

  await connectDB();
  const listing = await Listing.findById(id);
  if (!listing) throw ApiErrors.notFound('Listing not found');

  listing.status = 'rejected';
  listing.rejectionReason = reason;
  listing.approvedBy = null;
  listing.approvedAt = null;
  await listing.save();

  await logAudit({
    action: 'listing.reject',
    actor: auth,
    targetType: 'Listing',
    targetId: id,
    ip: getClientIp(req),
    userAgent: req.headers.get('user-agent') ?? '',
    meta: { reason },
  });

  return json({ listing });
});
