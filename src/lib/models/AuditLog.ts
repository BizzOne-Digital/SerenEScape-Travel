import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IAuditLog extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: String,
    details: Schema.Types.Mixed,
    ipAddress: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });

export const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog ?? mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
