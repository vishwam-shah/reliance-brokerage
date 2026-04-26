import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, 'Email is too short')
  .max(254, 'Email is too long')
  .email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .refine((v) => /[a-z]/.test(v), 'Must contain a lowercase letter')
  .refine((v) => /[A-Z]/.test(v), 'Must contain an uppercase letter')
  .refine((v) => /[0-9]/.test(v), 'Must contain a number');

export const nameSchema = z.string().trim().min(2, 'Name is too short').max(100);
export const phoneSchema = z
  .string()
  .trim()
  .min(7, 'Phone is too short')
  .max(20, 'Phone is too long')
  .regex(/^[+0-9\s()-]+$/, 'Invalid phone format');

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema.optional(),
  company: z.string().trim().max(200).optional(),
  role: z.enum(['buyer', 'seller']),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const listingSchema = z.object({
  title: z.string().trim().min(3).max(200),
  sector: z.string().trim().min(2).max(100),
  location: z.string().trim().min(2).max(100),
  description: z.string().trim().max(5000).optional().default(''),
  valuation: z.string().trim().max(50).optional().default(''),
  valuationNum: z.number().nonnegative().default(0),
  revenue: z.string().trim().max(50).optional().default(''),
  revenueNum: z.number().nonnegative().default(0),
  rentPrice: z.string().trim().max(50).optional().default(''),
  availableFor: z.array(z.enum(['buy', 'rent'])).min(1).default(['buy']),
  images: z.array(z.string().max(2_500_000)).max(8).optional().default([]),
});
export type ListingInput = z.infer<typeof listingSchema>;

export const listingUpdateSchema = listingSchema.partial().extend({
  status: z.enum(['draft', 'pending_approval', 'active', 'rejected', 'closed']).optional(),
  featured: z.boolean().optional(),
  rejectionReason: z.string().trim().max(500).optional(),
});

export const enquirySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  type: z.enum(['Buy', 'Rent', 'Sell']),
  listingId: z.string().trim().optional(),
  listingTitle: z.string().trim().max(200).optional().default(''),
  message: z.string().trim().max(2000).optional().default(''),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;

export const listingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  sector: z.string().trim().optional(),
  availability: z.enum(['all', 'buy', 'rent']).optional().default('all'),
  sort: z.enum(['default', 'valuation_asc', 'valuation_desc', 'revenue_desc', 'newest']).optional().default('default'),
  search: z.string().trim().optional(),
  status: z.enum(['draft', 'pending_approval', 'active', 'rejected', 'closed', 'all']).optional(),
  mine: z.coerce.boolean().optional(),
});
