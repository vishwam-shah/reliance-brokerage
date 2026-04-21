import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone: string;
  type: 'Buy' | 'Rent' | 'Sell';
  listingId: mongoose.Types.ObjectId | null;
  listingTitle: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  notes: string;
  userId: mongoose.Types.ObjectId | null;
  ip: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '', trim: true, maxlength: 20 },
    type: { type: String, enum: ['Buy', 'Rent', 'Sell'], required: true },
    listingId: { type: Schema.Types.ObjectId, ref: 'Listing', default: null, index: true },
    listingTitle: { type: String, default: '', maxlength: 200 },
    message: { type: String, default: '', maxlength: 2000 },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new', index: true },
    notes: { type: String, default: '', maxlength: 2000 },
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    ip: { type: String, default: '' },
  },
  { timestamps: true }
);

EnquirySchema.index({ status: 1, createdAt: -1 });

export default (mongoose.models.Enquiry as mongoose.Model<IEnquiry>) ||
  mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
