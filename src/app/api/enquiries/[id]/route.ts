import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import Listing from '@/models/Listing';
import { withErrorHandler, ApiErrors, json, parseJson } from '@/lib/apiHandler';
import { requireAuth, isAdminRole } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { getClientIp } from '@/lib/rateLimit';

const patchSchema = z.object({
  status: z.enum(['new', 'contacted', 'closed']).optional(),
  notes: z.string().trim().max(2000).optional(),
});

function assertValid(id: string) {
  if (!mongoose.isValidObjectId(id)) throw ApiErrors.badRequest('Invalid id');
}

async function loadWithAuth(id: string, req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) throw ApiErrors.unauthorized();

  await connectDB();
  const enquiry = await Enquiry.findById(id);
  if (!enquiry) throw ApiErrors.notFound('Enquiry not found');

  let authorized = isAdminRole(auth.role);
  if (!authorized && enquiry.listingId) {
    const listing = await Listing.findById(enquiry.listingId).select('createdBy');
    authorized = listing?.createdBy?.toString() === auth.sub;
  }
  if (!authorized) throw ApiErrors.forbidden();

  return { auth, enquiry };
}

export const GET = withErrorHandler(async (req: NextRequest, ctx) => {
  const { id } = await ctx.params;
  assertValid(id);
  const { enquiry } = await loadWithAuth(id, req);
  return json({ enquiry });
});

export const PATCH = withErrorHandler(async (req: NextRequest, ctx) => {
  const { id } = await ctx.params;
  assertValid(id);
  const { auth, enquiry } = await loadWithAuth(id, req);

  const body = await parseJson<unknown>(req);
  const patch = patchSchema.parse(body);
  Object.assign(enquiry, patch);
  await enquiry.save();

  await logAudit({
    action: 'enquiry.update',
    actor: auth,
    targetType: 'Enquiry',
    targetId: id,
    ip: getClientIp(req),
    userAgent: req.headers.get('user-agent') ?? '',
    meta: patch,
  });

  return json({ enquiry });
});

export const DELETE = withErrorHandler(async (req: NextRequest, ctx) => {
  const { id } = await ctx.params;
  assertValid(id);
  const auth = requireAuth(req);
  if (!auth || !isAdminRole(auth.role)) throw ApiErrors.forbidden();

  await connectDB();
  const deleted = await Enquiry.findByIdAndDelete(id);
  if (!deleted) throw ApiErrors.notFound('Enquiry not found');

  return json({ ok: true });
});
