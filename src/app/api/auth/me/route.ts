import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { withErrorHandler, ApiErrors, json } from '@/lib/apiHandler';
import { requireAuth } from '@/lib/auth';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const payload = requireAuth(req);
  if (!payload) throw ApiErrors.unauthorized();

  await connectDB();
  const user = await User.findById(payload.sub).select('name email role phone company createdAt');
  if (!user) throw ApiErrors.unauthorized();

  return json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      company: user.company,
      createdAt: user.createdAt,
    },
  });
});
