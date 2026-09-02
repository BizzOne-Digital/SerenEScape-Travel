import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IAdminUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "super_admin" | "admin" | "editor";
  active: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["super_admin", "admin", "editor"], default: "admin" },
    active: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

export const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser ?? mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);
