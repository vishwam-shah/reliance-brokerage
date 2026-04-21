import AuditLog from '@/models/AuditLog';
import type { JWTPayload } from '@/lib/auth';

export type AuditAction =
  | 'auth.register'
  | 'auth.login'
  | 'auth.login_failed'
  | 'auth.logout'
  | 'listing.create'
  | 'listing.update'
  | 'listing.delete'
  | 'listing.approve'
  | 'listing.reject'
  | 'listing.status_change'
  | 'enquiry.create'
  | 'enquiry.update'
  | 'user.update'
  | 'user.delete';

export async function logAudit(params: {
  action: AuditAction;
  actor?: JWTPayload | null;
  actorEmail?: string;
  targetType?: string;
  targetId?: string;
  ip?: string;
  userAgent?: string;
  meta?: Record<string, unknown>;
}) {
  try {
    await AuditLog.create({
      action: params.action,
      actorId: params.actor?.sub,
      actorEmail: params.actor?.email ?? params.actorEmail,
      actorRole: params.actor?.role,
      targetType: params.targetType,
      targetId: params.targetId,
      ip: params.ip,
      userAgent: params.userAgent,
      meta: params.meta,
    });
  } catch (err) {
    console.error('[audit] failed to record event:', err);
  }
}
