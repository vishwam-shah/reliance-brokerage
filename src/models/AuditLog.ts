import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  actorId: mongoose.Types.ObjectId | null;
  actorEmail: string;
  actorRole: string;
  targetType: string;
  targetId: string;
  ip: string;
  userAgent: string;
  meta: Record<string, unknown>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true, index: true },
    actorId: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    actorEmail: { type: String, default: '' },
    actorRole: { type: String, default: '' },
    targetType: { type: String, default: '' },
    targetId: { type: String, default: '' },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ createdAt: -1 });

export default (mongoose.models.AuditLog as mongoose.Model<IAuditLog>) ||
  mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
