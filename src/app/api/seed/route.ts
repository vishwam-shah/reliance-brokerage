import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { withErrorHandler, ApiErrors, json, parseJson } from '@/lib/apiHandler';
import { z } from 'zod';

const seedSchema = z.object({
  secret: z.string().min(1),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(12),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await parseJson<unknown>(req);
  const parsed = seedSchema.parse(body);

  const expected = process.env.SEED_SECRET;
  if (!expected) throw ApiErrors.forbidden('Seeding is disabled: SEED_SECRET is not set');
  if (parsed.secret !== expected) throw ApiErrors.forbidden('Invalid seed secret');

  await connectDB();

  const existingSuperadmin = await User.findOne({ role: 'superadmin' });
  if (existingSuperadmin) {
    throw ApiErrors.conflict('A superadmin already exists. Remove it from DB to re-seed.');
  }

  const user = await User.create({
    name: parsed.name,
    email: parsed.email,
    password: parsed.password,
    role: 'superadmin',
  });

  return json(
    {
      ok: true,
      user: { id: user._id, email: user.email, role: user.role },
    },
    { status: 201 }
  );
});
