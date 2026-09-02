import { connectDB } from "@/lib/db/connect";
import { AuditLog } from "@/lib/models";
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
} from "@/components/admin/AdminUI";

export default async function AdminAuditLogPage() {
  let logs: {
    _id: string;
    action: string;
    entityType: string;
    entityId?: string;
    createdAt: Date;
    adminId?: { name: string; email: string };
  }[] = [];

  try {
    await connectDB();
    const raw = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("adminId", "name email")
      .lean();
    logs = raw as unknown as typeof logs;
  } catch {
    // DB not configured
  }

  return (
    <>
      <AdminPageHeader title="Audit Log" description="Admin activity history" />

      <AdminCard>
        {logs.length === 0 ? (
          <p className="p-8 text-center text-sm text-luxury-ink/50">No audit log entries yet</p>
        ) : (
          <AdminTable headers={["Admin", "Action", "Entity", "Entity ID", "Date"]}>
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-warm-sand/10">
                <td className="px-4 py-3">
                  {(log.adminId as { name?: string })?.name ?? "—"}
                </td>
                <td className="px-4 py-3">{log.action}</td>
                <td className="px-4 py-3">{log.entityType}</td>
                <td className="px-4 py-3 font-mono text-xs">{log.entityId ?? "—"}</td>
                <td className="px-4 py-3 text-luxury-ink/60">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </>
  );
}
