import { connectDB } from "@/lib/db/connect";
import { AuditLog } from "@/lib/models";

/** Best-effort audit trail; never throws, so it cannot break a save. */
export async function logAdminAction(
  adminId: string | undefined,
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, unknown>
) {
  if (!adminId) return;
  try {
    await connectDB();
    await AuditLog.create({ adminId, action, entityType, entityId, details });
  } catch (err) {
    console.error("[audit] failed to write log", err);
  }
}
