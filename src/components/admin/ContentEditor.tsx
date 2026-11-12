"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronDown, ExternalLink, Plus, RotateCcw, Trash2 } from "lucide-react";
import { AdminButton, AdminCard } from "@/components/admin/AdminUI";
import { ImageValueField, type ImageValue } from "@/components/admin/ImageValueField";
import { useAdminToast } from "@/components/admin/AdminToast";
import type { FieldDef, PageSchema } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

type Json = Record<string, unknown>;

function blankFor(fields: FieldDef[]): Json {
  const out: Json = {};
  for (const f of fields) {
    if (f.type === "image") out[f.key] = { url: "", alt: "" };
    else if (f.type === "list") out[f.key] = [];
    else out[f.key] = "";
  }
  return out;
}

function setIn<T>(obj: T, path: (string | number)[], value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  const clone: unknown = Array.isArray(obj) ? [...obj] : { ...(obj as object) };
  (clone as Record<string | number, unknown>)[head] = setIn(
    (obj as Record<string | number, unknown> | undefined)?.[head],
    rest,
    value
  );
  return clone as T;
}

interface FieldProps {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}

function FieldInput({ field, value, onChange }: FieldProps) {
  if (field.type === "image") {
    return (
      <ImageValueField
        label={field.label}
        help={field.help}
        value={value as ImageValue}
        onChange={onChange}
      />
    );
  }

  if (field.type === "list") {
    const items = Array.isArray(value) ? (value as Json[]) : [];
    const move = (from: number, to: number) => {
      if (to < 0 || to >= items.length) return;
      const next = [...items];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      onChange(next);
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-deep-aubergine">
            {field.label} <span className="text-luxury-ink/40">({items.length})</span>
          </p>
        </div>
        {field.help && <p className="text-xs text-luxury-ink/50">{field.help}</p>}

        {items.map((item, index) => (
          <div key={index} className="rounded-lg border border-warm-sand/70 bg-warm-sand/10 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-luxury-ink/50">
                {field.itemLabel} {index + 1}
              </p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  className="rounded p-1 text-luxury-ink/60 hover:bg-warm-sand/50 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, index + 1)}
                  disabled={index === items.length - 1}
                  className="rounded p-1 text-luxury-ink/60 hover:bg-warm-sand/50 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                  className="rounded p-1 text-rich-berry hover:bg-rich-berry/10"
                  aria-label={`Remove ${field.itemLabel}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {field.fields.map((sub) => (
                <FieldInput
                  key={sub.key}
                  field={sub}
                  value={item?.[sub.key]}
                  onChange={(v) => onChange(setIn(items, [index, sub.key], v))}
                />
              ))}
            </div>
          </div>
        ))}

        <AdminButton variant="secondary" onClick={() => onChange([...items, blankFor(field.fields)])}>
          <Plus className="mr-1 h-4 w-4" />
          Add {field.itemLabel.toLowerCase()}
        </AdminButton>
      </div>
    );
  }

  const stringValue = typeof value === "string" ? value : "";
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-deep-aubergine">{field.label}</label>
      {field.type === "textarea" ? (
        <textarea
          value={stringValue}
          rows={field.rows ?? 3}
          onChange={(e) => onChange(e.target.value)}
          className="admin-input"
        />
      ) : (
        <input
          type="text"
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.type === "url" ? "/trips or https://..." : undefined}
          className="admin-input"
        />
      )}
      {field.help && <p className="mt-1 text-xs text-luxury-ink/50">{field.help}</p>}
    </div>
  );
}

interface ContentEditorProps {
  schema: PageSchema;
  initial: Json;
}

export function ContentEditor({ schema, initial }: ContentEditorProps) {
  const { showToast } = useAdminToast();
  const [content, setContent] = useState<Json>(initial);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [openId, setOpenId] = useState<string | null>(schema.sections[0]?.id ?? null);

  function update(path: (string | number)[], value: unknown) {
    setContent((prev) => setIn(prev, path, value));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${schema.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      setDirty(false);
      showToast("Saved. The live site is updated.", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!window.confirm("Reset this whole page back to the original text and pictures? Your edits will be lost.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${schema.key}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to reset");
      showToast("Page reset to defaults. Reloading…", "success");
      window.location.reload();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to reset", "error");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 pb-24">
      {schema.sections.map((section) => {
        const open = openId === section.id;
        const sectionData = (content[section.id] ?? {}) as Json;
        return (
          <AdminCard key={section.id} className="overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : section.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-warm-sand/20"
              aria-expanded={open}
            >
              <div>
                <h2 className="font-display text-lg text-deep-aubergine">{section.title}</h2>
                {section.description && (
                  <p className="mt-0.5 text-xs text-luxury-ink/50">{section.description}</p>
                )}
              </div>
              <ChevronDown className={cn("h-5 w-5 shrink-0 text-luxury-ink/50 transition-transform", open && "rotate-180")} />
            </button>

            {open && (
              <div className="space-y-5 border-t border-warm-sand/60 px-6 py-5">
                {section.fields.map((field) => (
                  <FieldInput
                    key={field.key}
                    field={field}
                    value={sectionData[field.key]}
                    onChange={(v) => update([section.id, field.key], v)}
                  />
                ))}
              </div>
            )}
          </AdminCard>
        );
      })}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-warm-sand/60 bg-soft-ivory/95 px-4 py-3 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <p className={cn("text-sm", dirty ? "font-medium text-burnt-orange" : "text-luxury-ink/50")}>
            {dirty ? "You have unsaved changes" : "All changes saved"}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={schema.path}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-warm-sand bg-white px-4 py-2 text-sm font-medium text-deep-aubergine hover:bg-warm-sand/30"
            >
              <ExternalLink className="h-4 w-4" />
              View page
            </Link>
            <AdminButton variant="secondary" onClick={reset} disabled={saving}>
              <RotateCcw className="mr-1 h-4 w-4" />
              Reset to defaults
            </AdminButton>
            <AdminButton onClick={save} disabled={saving || !dirty}>
              {saving ? "Saving…" : "Save changes"}
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}
