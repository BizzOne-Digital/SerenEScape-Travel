import mongoose, { Schema, type Model, type Document } from "mongoose";

/**
 * One document per editable page (key = "home", "about", ...).
 * `data` holds only what the admin saved; defaults live in code.
 */
export interface IPageContent extends Document {
  key: string;
  data: Record<string, unknown>;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PageContentSchema = new Schema<IPageContent>(
  {
    key: { type: String, required: true, unique: true },
    data: { type: Schema.Types.Mixed, default: {} },
    updatedBy: String,
  },
  // Own collection name: the Atlas database already has a legacy "pagecontents"
  // collection (page/section schema + unique index) that must not be reused.
  { timestamps: true, minimize: false, collection: "site_content" }
);

export const PageContent: Model<IPageContent> =
  mongoose.models.PageContent ?? mongoose.model<IPageContent>("PageContent", PageContentSchema);
