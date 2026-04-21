import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import Listing from '@/models/Listing';
import { enquirySchema } from '@/lib/validation';
import { withErrorHandler, ApiErrors, json, parseJson } from '@/lib/apiHandler';
import { requireAuth, isAdminRole } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const auth = requireAuth(req);
  if (!auth) throw ApiErrors.unauthorized();

  await connectDB();
  const url = new URL(req.url);
  const status = url.searchParams.get('status') ?? undefined;
  const mine = url.searchParams.get('mine') === 'true';
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') ?? 20)));

  const filter: Record<string, unknown> = {};
  if (status && ['new', 'contacted', 'closed'].includes(status)) filter.status = status;

  if (!isAdminRole(auth.role) || mine) {
    const myListings = await Listing.find({ createdBy: auth.sub }).select('_id').lean();
    const ids = myListings.map((l) => l._id);
    filter.listingId = { $in: ids };
  }

  const [items, total] = await Promise.all([
    Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Enquiry.countDocuments(filter),
  ]);

  return json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const ip = getClientIp(req);
  const rl = rateLimit(`enquiry:${ip}`, 10, 60 * 60 * 1000);
  if (!rl.allowed) throw ApiErrors.tooMany('Too many enquiries from this IP', rl.retryAfterSec);

  const body = await parseJson<unknown>(req);
  const input = enquirySchema.parse(body);

  await connectDB();

  const auth = requireAuth(req);
  let listingTitle = input.listingTitle ?? '';
  let listingObjectId: mongoose.Types.ObjectId | null = null;

  if (input.listingId && mongoose.isValidObjectId(input.listingId)) {
    const listing = await Listing.findById(input.listingId).select('title status');
    if (listing && listing.status === 'active') {
      listingObjectId = listing._id as mongoose.Types.ObjectId;
      listingTitle = listing.title;
    }
  }

  const enquiry = await Enquiry.create({
    name: input.name,
    email: input.email,
    phone: input.phone,
    type: input.type,
    listingId: listingObjectId,
    listingTitle,
    message: input.message ?? '',
    userId: auth ? new mongoose.Types.ObjectId(auth.sub) : null,
    ip,
  });

  await logAudit({
    action: 'enquiry.create',
    actor: auth,
    actorEmail: input.email,
    targetType: 'Enquiry',
    targetId: String(enquiry._id),
    ip,
    userAgent: req.headers.get('user-agent') ?? '',
  });

  return json({ enquiry }, { status: 201 });
});
