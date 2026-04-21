import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import Enquiry from '@/models/Enquiry';
import User from '@/models/User';
import { withErrorHandler, ApiErrors, json } from '@/lib/apiHandler';
import { requireRole } from '@/lib/auth';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const auth = requireRole(req, ['admin', 'superadmin']);
  if (!auth) throw ApiErrors.forbidden();

  await connectDB();

  const [
    totalListings,
    activeListings,
    pendingListings,
    rejectedListings,
    totalEnquiries,
    newEnquiries,
    totalUsers,
    sellerCount,
    buyerCount,
  ] = await Promise.all([
    Listing.countDocuments({}),
    Listing.countDocuments({ status: 'active' }),
    Listing.countDocuments({ status: 'pending_approval' }),
    Listing.countDocuments({ status: 'rejected' }),
    Enquiry.countDocuments({}),
    Enquiry.countDocuments({ status: 'new' }),
    User.countDocuments({}),
    User.countDocuments({ role: 'seller' }),
    User.countDocuments({ role: 'buyer' }),
  ]);

  return json({
    listings: {
      total: totalListings,
      active: activeListings,
      pending: pendingListings,
      rejected: rejectedListings,
    },
    enquiries: { total: totalEnquiries, new: newEnquiries },
    users: { total: totalUsers, sellers: sellerCount, buyers: buyerCount },
  });
});
