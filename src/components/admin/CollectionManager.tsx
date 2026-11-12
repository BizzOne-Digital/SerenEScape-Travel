"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { AdminButton, AdminCard, AdminTable } from "@/components/admin/AdminUI";
import { ImageValueField, type ImageValue } from "@/components/admin/ImageValueField";
import { useAdminToast } from "@/components/admin/AdminToast";
import type { UploadFolder } from "@/lib/uploads/constants";

export type FormField =
  | { key: string; label: string; type: "text" | "textarea" | "number" | "checkbox"; help?: string; rows?: number; required?: boolean }
  | { key: string; label: string; type: "select"; options: { value: string; label: string }[]; help?: string }
  | { key: string; label: string; type: "image"; folder?: UploadFolder; help?: string };

export type Column = {
  header: string;
  render: (item: Record<string, unknown>) => ReactNode;
};

interface CollectionManagerProps {
  /** API collection name: faqs | founders | testimonials */
  name: string;
  singular: string;
  fields: FormField[];
  columns: Column[];
  defaults: Record<string, unknown>;
  emptyMessage: string;
}

type Item = Record<string, unknown> & { _id: string };

export function CollectionManager({ name, singular, fields, columns, defaults, emptyMessage }: CollectionManagerProps) {
  const { showToast } = useAdminToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);
  const load = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(`/api/admin/collections/${name}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load");
        if (!cancelled) setItems(data.items ?? []);
      } catch (err) {
        if (!cancelled) showToast(err instanceof Error ? err.message : "Failed to load", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [name, showToast, reloadKey]);

  function openNew() {
    setForm({ ...defaults });
    setEditing("new");
  }

  function openEdit(item: Item) {
    setForm({ ...defaults, ...item });
    setEditing(item);
  }

  async function save() {
    if (!editing) return;
    for (const f of fields) {
      if ("required" in f && f.required && !String(form[f.key] ?? "").trim()) {
        showToast(`${f.label} is required`, "error");
        return;
      }
    }

    setSaving(true);
    try {
      const isNew = editing === "new";
      const res = await fetch(isNew ? `/api/admin/collections/${name}` : `/api/admin/collections/${name}/${editing._id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      showToast(`${singular} saved`, "success");
      setEditing(null);
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: Item) {
    if (!window.confirm(`Delete this ${singular.toLowerCase()}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/collections/${name}/${item._id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to delete");
      showToast(`${singular} deleted`, "success");
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete", "error");
    }
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <AdminButton onClick={openNew}>
          <Plus className="mr-1 h-4 w-4" />
          Add {singular.toLowerCase()}
        </AdminButton>
      </div>

      <AdminCard>
        {loading ? (
          <p className="p-8 text-center text-sm text-luxury-ink/50">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-sm text-luxury-ink/50">{emptyMessage}</p>
        ) : (
          <AdminTable headers={[...columns.map((c) => c.header), "Actions"]}>
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-warm-sand/10">
                {columns.map((c) => (
                  <td key={c.header} className="px-4 py-3 align-top">
                    {c.render(item)}
                  </td>
                ))}
                <td className="whitespace-nowrap px-4 py-3">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="mr-2 inline-flex items-center gap-1 rounded-lg border border-warm-sand px-2.5 py-1 text-xs font-medium text-deep-aubergine hover:bg-warm-sand/30"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    className="inline-flex items-center gap-1 rounded-lg border border-rich-berry/20 px-2.5 py-1 text-xs font-medium text-rich-berry hover:bg-rich-berry/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-luxury-ink/50 p-4 sm:p-8">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl text-deep-aubergine">
                {editing === "new" ? `Add ${singular.toLowerCase()}` : `Edit ${singular.toLowerCase()}`}
              </h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="text-luxury-ink/50 hover:text-luxury-ink">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((f) => {
                if (f.type === "image") {
                  return (
                    <ImageValueField
                      key={f.key}
                      label={f.label}
                      help={f.help}
                      folder={f.folder ?? "pages"}
                      value={form[f.key] as ImageValue}
                      onChange={(v) => setForm((p) => ({ ...p, [f.key]: v }))}
                    />
                  );
                }
                if (f.type === "checkbox") {
                  return (
                    <label key={f.key} className="flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(form[f.key])}
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.checked }))}
                        className="mt-0.5 h-4 w-4"
                      />
                      <span>
                        <span className="font-medium text-deep-aubergine">{f.label}</span>
                        {f.help && <span className="block text-xs text-luxury-ink/50">{f.help}</span>}
                      </span>
                    </label>
                  );
                }
                return (
                  <div key={f.key}>
                    <label className="mb-1 block text-sm font-medium text-deep-aubergine">
                      {f.label}
                      {"required" in f && f.required && <span className="text-rich-berry"> *</span>}
                    </label>
                    {f.type === "textarea" ? (
                      <textarea
                        rows={f.rows ?? 4}
                        value={String(form[f.key] ?? "")}
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                        className="admin-input"
                      />
                    ) : f.type === "select" ? (
                      <select
                        value={String(form[f.key] ?? "")}
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                        className="admin-input"
                      >
                        {f.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={f.type === "number" ? "number" : "text"}
                        value={String(form[f.key] ?? "")}
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                        className="admin-input"
                      />
                    )}
                    {f.help && <p className="mt-1 text-xs text-luxury-ink/50">{f.help}</p>}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <AdminButton variant="secondary" onClick={() => setEditing(null)} disabled={saving}>
                Cancel
              </AdminButton>
              <AdminButton onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

