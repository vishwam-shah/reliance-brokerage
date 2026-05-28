import { NextRequest } from 'next/server';
import type { PipelineStage } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import { listingSchema, listingQuerySchema } from '@/lib/validation';
import { withErrorHandler, ApiErrors, json, parseJson } from '@/lib/apiHandler';
import { requireAuth, isAdminRole } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const ip = getClientIp(req);
  const rl = rateLimit(`listing:read:${ip}`, 100, 60 * 1000);
  if (!rl.allowed) throw ApiErrors.tooMany('Too many requests', rl.retryAfterSec);

  await connectDB();

  const url = new URL(req.url);
  const query = listingQuerySchema.parse(Object.fromEntries(url.searchParams.entries()));

  const auth = requireAuth(req);
  const isAdmin = auth && isAdminRole(auth.role);

  const filter: Record<string, unknown> = {};

  if (query.mine && auth) {
    filter.createdBy = auth.sub;
    if (query.status && query.status !== 'all') filter.status = query.status;
  } else if (isAdmin) {
    if (query.status && query.status !== 'all') filter.status = query.status;
  } else {
    filter.status = 'active';
  }

  if (query.sector && query.sector !== 'All') filter.sector = query.sector;
  if (query.availability && query.availability !== 'all') filter.availableFor = query.availability;
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { location: { $regex: query.search, $options: 'i' } },
      { sector: { $regex: query.search, $options: 'i' } },
    ];
  }

  // Deterministic sort: every branch ends with `_id` as the final tie-breaker
  // so skip/limit pagination cannot drop or duplicate rows across pages.
  // We use an aggregation so we can coerce legacy docs missing `featured`
  // (stored as `null`) to a real boolean — otherwise null/false/true form
  // three buckets and the boundary between pages shuffles on every query.
  const sort: Record<string, 1 | -1> = {};
  if (query.sort === 'valuation_asc') { sort.valuationNum = 1; sort.createdAt = -1; }
  else if (query.sort === 'valuation_desc') { sort.valuationNum = -1; sort.createdAt = -1; }
  else if (query.sort === 'revenue_desc') { sort.revenueNum = -1; sort.createdAt = -1; }
  else if (query.sort === 'newest') { sort.createdAt = -1; }
  else { sort._featuredSort = -1; sort.createdAt = -1; } // default: featured first
  sort._id = -1;

  const skip = (query.page - 1) * query.limit;

  const usesFeaturedSort = query.sort !== 'valuation_asc'
    && query.sort !== 'valuation_desc'
    && query.sort !== 'revenue_desc'
    && query.sort !== 'newest';

  const pipeline: PipelineStage[] = [{ $match: filter }];
  if (usesFeaturedSort) {
    pipeline.push({
      $addFields: {
        _featuredSort: { $cond: [{ $eq: ['$featured', true] }, 1, 0] },
      },
    });
  }
  pipeline.push({ $sort: sort });
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: query.limit });
  if (usesFeaturedSort) {
    pipeline.push({ $project: { _featuredSort: 0 } });
  }

  const [items, total] = await Promise.all([
    Listing.aggregate(pipeline)
      .option({ maxTimeMS: 15000, allowDiskUse: true }),
    Listing.countDocuments(filter).maxTimeMS(15000),
  ]);

  return json({
    items,
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit),
  });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const auth = requireAuth(req);
  if (!auth) throw ApiErrors.unauthorized();

  const rl = rateLimit(`listing:create:${auth.sub}`, 20, 60 * 60 * 1000);
  if (!rl.allowed) throw ApiErrors.tooMany('Too many listings submitted', rl.retryAfterSec);

  const body = await parseJson<unknown>(req);
  const input = listingSchema.parse(body);

  await connectDB();

  const isAdmin = isAdminRole(auth.role);
  const status = isAdmin ? 'active' : 'pending_approval';

  const listing = await Listing.create({
    ...input,
    status,
    createdBy: auth.sub,
    approvedBy: isAdmin ? auth.sub : null,
    approvedAt: isAdmin ? new Date() : null,
  });

  await logAudit({
    action: 'listing.create',
    actor: auth,
    targetType: 'Listing',
    targetId: String(listing._id),
    ip: getClientIp(req),
    userAgent: req.headers.get('user-agent') ?? '',
    meta: { status },
  });

  return json({ listing }, { status: 201 });
});
