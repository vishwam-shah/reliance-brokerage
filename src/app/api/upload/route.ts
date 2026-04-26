import { NextRequest } from 'next/server';
import { withErrorHandler, ApiErrors, json } from '@/lib/apiHandler';
import { requireAuth } from '@/lib/auth';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Placeholder image upload endpoint.
 * Returns a data URL — fine for development / small images.
 * Swap the body of this handler when a real storage backend
 * (Cloudinary / S3 / Cloudflare R2) is chosen.
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const auth = requireAuth(req);
  if (!auth) throw ApiErrors.unauthorized();

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) throw ApiErrors.badRequest('No file uploaded');
  if (!ALLOWED.includes(file.type)) throw ApiErrors.badRequest('Only JPEG, PNG and WebP are allowed');
  if (file.size > MAX_BYTES) throw ApiErrors.badRequest('File must be under 2 MB');

  const buf = Buffer.from(await file.arrayBuffer());
  const url = `data:${file.type};base64,${buf.toString('base64')}`;

  return json({ url });
});
