import mongoose, { Schema, Document } from 'mongoose';

export type ListingStatus = 'draft' | 'pending_approval' | 'active' | 'rejected' | 'closed';

export interface IListing extends Document {
  title: string;
  slug: string;
  sector: string;
  location: string;
  valuation: string;
  valuationNum: number;
  revenue: string;
  revenueNum: number;
  rentPrice: string;
  availableFor: ('buy' | 'rent')[];
  status: ListingStatus;
  description: string;
  images: string[];
  featured: boolean;
  views: number;
  rejectionReason: string;
  createdBy: mongoose.Types.ObjectId;
  approvedBy: mongoose.Types.ObjectId | null;
  approvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const ListingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, default: '', index: true },
    sector: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, required: true, trim: true, maxlength: 100 },
    valuation: { type: String, default: '' },
    valuationNum: { type: Number, default: 0, min: 0 },
    revenue: { type: String, default: '' },
    revenueNum: { type: Number, default: 0, min: 0 },
    rentPrice: { type: String, default: '' },
    availableFor: {
      type: [{ type: String, enum: ['buy', 'rent'] }],
      default: ['buy'],
    },
    status: {
      type: String,
      enum: ['draft', 'pending_approval', 'active', 'rejected', 'closed'],
      default: 'pending_approval',
      index: true,
    },
    description: { type: String, default: '', maxlength: 5000 },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    rejectionReason: { type: String, default: '', maxlength: 500 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

ListingSchema.pre('validate', function () {
  if (!this.slug && this.title) {
    this.slug = `${slugify(this.title)}-${Date.now().toString(36)}`;
  }
});

ListingSchema.index({ status: 1, createdAt: -1 });
ListingSchema.index({ sector: 1, status: 1 });
ListingSchema.index({ createdBy: 1, status: 1 });
ListingSchema.index({ title: 'text', description: 'text', location: 'text' });

export default (mongoose.models.Listing as mongoose.Model<IListing>) ||
  mongoose.model<IListing>('Listing', ListingSchema);
