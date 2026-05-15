import { NextRequest } from 'next/server';
import sharp from 'sharp';
import { withErrorHandler, ApiErrors, json } from '@/lib/apiHandler';
import { requireAuth } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';

const MAX_INPUT_BYTES = 5 * 1024 * 1024; // 5MB max input
const MAX_OUTPUT_BYTES = 500 * 1024; // 500KB max output
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1440;
const JPEG_QUALITY = 80;

/**
 * Image upload endpoint with automatic compression.
 * Compresses images to reduce storage, enforces size/dimension limits,
 * returns a data URL for development/small deployments.
 * For production, swap with real storage backend (Cloudinary / S3 / R2).
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const auth = requireAuth(req);
  if (!auth) throw ApiErrors.unauthorized();

  const rl = rateLimit(`upload:${auth.sub}`, 50, 60 * 60 * 1000);
  if (!rl.allowed) throw ApiErrors.tooMany('Too many uploads', rl.retryAfterSec);

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) throw ApiErrors.badRequest('No file uploaded');
  if (!ALLOWED.includes(file.type)) throw ApiErrors.badRequest('Only JPEG, PNG and WebP are allowed');
  if (file.size > MAX_INPUT_BYTES) throw ApiErrors.badRequest(`File must be under ${MAX_INPUT_BYTES / (1024 * 1024)}MB`);

  const buf = Buffer.from(await file.arrayBuffer());

  // Compress and resize image
  let compressed: Buffer;
  try {
    compressed = await sharp(buf)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: JPEG_QUALITY, progressive: true })
      .toBuffer();
  } catch (err) {
    throw ApiErrors.badRequest('Invalid or corrupted image file');
  }

  if (compressed.length > MAX_OUTPUT_BYTES) {
    throw ApiErrors.badRequest(`Compressed image exceeds ${MAX_OUTPUT_BYTES / 1024}KB limit`);
  }

  const url = `data:image/jpeg;base64,${compressed.toString('base64')}`;

  return json({
    url,
    originalSize: file.size,
    compressedSize: compressed.length,
    savings: Math.round(((file.size - compressed.length) / file.size) * 100),
  });
});
