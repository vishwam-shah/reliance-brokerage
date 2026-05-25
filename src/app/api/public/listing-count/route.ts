import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import { withErrorHandler, json } from '@/lib/apiHandler';

const BASE_COUNT = 215;

export const GET = withErrorHandler(async (_req: NextRequest) => {
  await connectDB();
  const activeListings = await Listing.countDocuments({ status: 'active' });
  return json({ count: BASE_COUNT + activeListings });
});
