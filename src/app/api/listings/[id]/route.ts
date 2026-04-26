import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import { listingUpdateSchema } from '@/lib/validation';
import { withErrorHandler, ApiErrors, json, parseJson } from '@/lib/apiHandler';
import { requireAuth, isAdminRole } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { getClientIp } from '@/lib/rateLimit';

function ensureValidId(id: string) {
  if (!mongoose.isValidObjectId(id)) throw ApiErrors.badRequest('Invalid listing id');
}

export const GET = withErrorHandler(async (req: NextRequest, ctx) => {
  const { id } = await ctx.params;

  await connectDB();
  const auth = requireAuth(req);
  const isAdmin = auth && isAdminRole(auth.role);

  const listing = mongoose.isValidObjectId(id)
    ? await Listing.findById(id).lean()
    : await Listing.findOne({ slug: id }).lean();

  if (!listing) throw ApiErrors.notFound('Listing not found');

  const isOwner = auth && String(listing.createdBy) === auth.sub;
  if (listing.status !== 'active' && !isAdmin && !isOwner) {
    throw ApiErrors.notFound('Listing not found');
  }

  if (!isAdmin && !isOwner) {
    await Listing.updateOne({ _id: listing._id }, { $inc: { views: 1 } });
  }

  return json({ listing });
});

export const PATCH = withErrorHandler(async (req: NextRequest, ctx) => {
  const { id } = await ctx.params;
  ensureValidId(id);

  const auth = requireAuth(req);
  if (!auth) throw ApiErrors.unauthorized();

  await connectDB();
  const listing = await Listing.findById(id);
  if (!listing) throw ApiErrors.notFound('Listing not found');

  const isAdmin = isAdminRole(auth.role);
  const isOwner = String(listing.createdBy) === auth.sub;
  if (!isAdmin && !isOwner) throw ApiErrors.forbidden();

  const body = await parseJson<unknown>(req);
  const patch = listingUpdateSchema.parse(body);

  if (!isAdmin) {
    delete patch.status;
    delete patch.featured;
    delete patch.rejectionReason;
    if (listing.status === 'active') {
      listing.status = 'pending_approval';
      listing.approvedBy = null;
      listing.approvedAt = null;
    }
  }

  Object.assign(listing, patch);
  await listing.save();

  await logAudit({
    action: 'listing.update',
    actor: auth,
    targetType: 'Listing',
    targetId: String(listing._id),
    ip: getClientIp(req),
    userAgent: req.headers.get('user-agent') ?? '',
    meta: { fields: Object.keys(patch) },
  });

  return json({ listing });
});

export const DELETE = withErrorHandler(async (req: NextRequest, ctx) => {
  const { id } = await ctx.params;
  ensureValidId(id);

  const auth = requireAuth(req);
  if (!auth) throw ApiErrors.unauthorized();

  await connectDB();
  const listing = await Listing.findById(id);
  if (!listing) throw ApiErrors.notFound('Listing not found');

  const isAdmin = isAdminRole(auth.role);
  const isOwner = String(listing.createdBy) === auth.sub;
  if (!isAdmin && !isOwner) throw ApiErrors.forbidden();

  await listing.deleteOne();

  await logAudit({
    action: 'listing.delete',
    actor: auth,
    targetType: 'Listing',
    targetId: id,
    ip: getClientIp(req),
    userAgent: req.headers.get('user-agent') ?? '',
  });

  return json({ ok: true });
});
