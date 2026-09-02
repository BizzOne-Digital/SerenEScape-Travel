"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2 } from "lucide-react";
import { customGroupSchema } from "@/lib/validation/schemas";
import type { z } from "zod";
import { cn } from "@/lib/utils";

type CustomGroupFormData = z.infer<typeof customGroupSchema>;

const inputClass =
  "w-full rounded-xl border border-muted-gold/30 bg-soft-ivory px-4 py-3 font-sans text-sm text-luxury-ink focus:border-rich-berry focus:outline-none focus:ring-2 focus:ring-rich-berry/20";

export function CustomGroupForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomGroupFormData>({
    resolver: zodResolver(customGroupSchema),
  });

  async function onSubmit(data: CustomGroupFormData) {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/inquiries/custom-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to submit inquiry");
      }

      setStatus("success");
      setMessage("Thank you! Our team will reach out within 2 business days to discuss your custom journey.");
      reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="org-name" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
            Organization / Group Name *
          </label>
          <input id="org-name" type="text" className={inputClass} {...register("organizationName")} />
          {errors.organizationName && (
            <p className="mt-1 font-sans text-xs text-rich-berry">{errors.organizationName.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
            Contact Name *
          </label>
          <input id="contact-name" type="text" className={inputClass} {...register("contactName")} />
          {errors.contactName && (
            <p className="mt-1 font-sans text-xs text-rich-berry">{errors.contactName.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cg-email" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
            Email *
          </label>
          <input id="cg-email" type="email" className={inputClass} {...register("email")} />
          {errors.email && (
            <p className="mt-1 font-sans text-xs text-rich-berry">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="cg-phone" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
            Phone *
          </label>
          <input id="cg-phone" type="tel" className={inputClass} {...register("phone")} />
          {errors.phone && (
            <p className="mt-1 font-sans text-xs text-rich-berry">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="destination" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
            Destination
          </label>
          <input id="destination" type="text" className={inputClass} {...register("destination")} />
        </div>
        <div>
          <label htmlFor="group-size" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
            Group Size
          </label>
          <input
            id="group-size"
            type="number"
            min={2}
            className={inputClass}
            {...register("groupSize", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="preferred-dates" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
            Preferred Dates
          </label>
          <input id="preferred-dates" type="text" className={inputClass} {...register("preferredDates")} />
        </div>
        <div>
          <label htmlFor="budget" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
            Budget Range
          </label>
          <input id="budget" type="text" className={inputClass} placeholder="e.g. $5,000–$8,000 per person" {...register("budget")} />
        </div>
      </div>

      <div>
        <label htmlFor="activities" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
          Activities & Interests
        </label>
        <textarea id="activities" rows={3} className={cn(inputClass, "resize-y")} {...register("activities")} />
      </div>

      <div>
        <label htmlFor="accessibility" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
          Accessibility Needs
        </label>
        <textarea id="accessibility" rows={2} className={cn(inputClass, "resize-y")} {...register("accessibility")} />
      </div>

      <div>
        <label htmlFor="notes" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
          Additional Notes
        </label>
        <textarea id="notes" rows={3} className={cn(inputClass, "resize-y")} {...register("notes")} />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 rounded-full bg-burnt-orange px-8 py-3 font-sans text-sm font-medium text-soft-ivory transition-colors hover:bg-marigold hover:text-luxury-ink disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Submit Inquiry
      </button>

      {message && (
        <p
          className={cn(
            "font-sans text-sm",
            status === "success" ? "text-emerald" : "text-rich-berry"
          )}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
