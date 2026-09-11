"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Globe, Mail, Phone, Send } from "lucide-react";
import { BRAND } from "@/config/brand";
import { IMAGES } from "@/config/images";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Trips", href: "/trips" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Book", href: "/booking" },
  { label: "FAQ", href: "/faq" },
] as const;

const policyLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cancellation Policy", href: "/cancellation-policy" },
] as const;

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleNewsletter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/inquiries/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Subscription failed");

      setStatus("success");
      setMessage("Welcome to the journey — you're on the list.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <footer className="relative mt-auto overflow-hidden bg-deep-aubergine text-soft-ivory">
      <div className="absolute inset-0 opacity-30" aria-hidden>
        <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-rich-berry/40 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-burnt-orange/30 blur-[100px]" />
      </div>

      <Container className="relative py-16 lg:py-20">
        <div className="grid min-w-0 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-4">
            <Link href="/" className="inline-block">
              <Image
                src={IMAGES.logo.src}
                alt={IMAGES.logo.alt}
                width={260}
                height={104}
                className="h-16 w-auto sm:h-20 md:h-24"
              />
            </Link>
            <p className="mt-4 font-display text-2xl text-muted-gold">{BRAND.tagline}</p>
            <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-soft-ivory/70">
              Luxury group travel curated for Black LGBTQIA+ women — where safety,
              community, and queer joy meet the world.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-muted-gold">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-soft-ivory/75 transition-colors hover:text-marigold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-muted-gold">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="inline-flex min-w-0 items-center gap-2 break-all font-sans text-sm text-soft-ivory/75 transition-colors hover:text-marigold sm:break-normal"
                >
                  <Mail className="h-4 w-4 shrink-0 text-muted-gold" />
                  {BRAND.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${BRAND.phone.replace(/-/g, "")}`}
                  className="inline-flex min-w-0 items-center gap-2 break-all font-sans text-sm text-soft-ivory/75 transition-colors hover:text-marigold sm:break-normal"
                >
                  <Phone className="h-4 w-4 shrink-0 text-muted-gold" />
                  {BRAND.phone}
                </a>
              </li>
              <li>
                <a
                  href={BRAND.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-0 items-center gap-2 break-all font-sans text-sm text-soft-ivory/75 transition-colors hover:text-marigold sm:break-normal"
                >
                  <Globe className="h-4 w-4 shrink-0 text-muted-gold" />
                  {BRAND.facebook}
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-muted-gold">
                Policies
              </h4>
              <ul className="space-y-2">
                {policyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-soft-ivory/60 transition-colors hover:text-soft-ivory"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-muted-gold">
              Newsletter
            </h3>
            <p className="mb-4 font-sans text-sm text-soft-ivory/70">
              Be first to know about new journeys, early access, and community events.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-3">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={status === "loading"}
                  className="min-w-0 flex-1 rounded-full border border-muted-gold/30 bg-soft-ivory/10 px-4 py-2.5 font-sans text-sm text-soft-ivory placeholder:text-soft-ivory/40 focus:border-muted-gold focus:outline-none focus:ring-2 focus:ring-muted-gold/30 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full bg-burnt-orange px-5 py-2.5 font-sans text-sm font-medium text-soft-ivory transition-colors hover:bg-marigold hover:text-luxury-ink disabled:opacity-60"
                  )}
                >
                  <Send className="h-4 w-4" />
                  Join
                </button>
              </div>
              {message && (
                <p
                  className={cn(
                    "font-sans text-xs",
                    status === "success" ? "text-emerald" : "text-marigold"
                  )}
                  role="status"
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="gold-line my-10" aria-hidden />

        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="space-y-1">
            <p className="font-sans text-xs text-soft-ivory/50">
              &copy; {new Date().getFullYear()} SerenEScape Travel. All rights reserved.
            </p>
            <p className="font-sans text-xs text-muted-gold/80">Built for belonging</p>
          </div>
          <p className="font-sans text-xs tracking-wide text-soft-ivory/50">
            PayPal · Square
          </p>
        </div>
      </Container>
    </footer>
  );
}
