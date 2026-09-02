"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2 } from "lucide-react";
import { contactSchema } from "@/lib/validation/schemas";
import type { z } from "zod";
import { cn } from "@/lib/utils";

type ContactFormData = z.infer<typeof contactSchema>;

const subjectOptions = [
  { value: "general", label: "General Inquiry" },
  { value: "trip_inquiry", label: "Trip Inquiry" },
  { value: "booking_support", label: "Booking Support" },
  { value: "payment", label: "Payment Question" },
  { value: "custom_group", label: "Custom Group Travel" },
  { value: "partnership", label: "Partnership" },
] as const;

const inputClass =
  "w-full rounded-xl border border-muted-gold/30 bg-soft-ivory px-4 py-3 font-sans text-sm text-luxury-ink focus:border-rich-berry focus:outline-none focus:ring-2 focus:ring-rich-berry/20";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: "general" },
  });

  async function onSubmit(data: ContactFormData) {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/inquiries/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to send message");
      }

      setStatus("success");
      setMessage("Thank you! We'll be in touch within 1–2 business days.");
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
          <label htmlFor="contact-name" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
            Name *
          </label>
          <input id="contact-name" type="text" className={inputClass} {...register("name")} />
          {errors.name && (
            <p className="mt-1 font-sans text-xs text-rich-berry">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
            Email *
          </label>
          <input id="contact-email" type="email" className={inputClass} {...register("email")} />
          {errors.email && (
            <p className="mt-1 font-sans text-xs text-rich-berry">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
            Phone
          </label>
          <input id="contact-phone" type="tel" className={inputClass} {...register("phone")} />
        </div>
        <div>
          <label htmlFor="contact-subject" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
            Subject *
          </label>
          <select id="contact-subject" className={inputClass} {...register("subject")}>
            {subjectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.subject && (
            <p className="mt-1 font-sans text-xs text-rich-berry">{errors.subject.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
          Message *
        </label>
        <textarea
          id="contact-message"
          rows={5}
          className={cn(inputClass, "resize-y")}
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 font-sans text-xs text-rich-berry">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 rounded-full bg-rich-berry px-8 py-3 font-sans text-sm font-medium text-soft-ivory transition-colors hover:bg-deep-aubergine disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Send Message
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
