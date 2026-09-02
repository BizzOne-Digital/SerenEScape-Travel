"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  CalendarCheck,
  CreditCard,
  CalendarClock,
  Tag,
  MessageSquare,
  Users,
  Star,
  HelpCircle,
  UserCircle,
  Image,
  Settings,
  ScrollText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/config/brand";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/trips", label: "Trips", icon: Map },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/payment-plans", label: "Payment Plans", icon: CalendarClock },
  { href: "/admin/promo-codes", label: "Promo Codes", icon: Tag },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/waitlist", label: "Waitlist", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/founders", label: "Founders", icon: UserCircle },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/audit-log", label: "Audit Log", icon: ScrollText },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-warm-sand/60 bg-soft-ivory">
      <div className="border-b border-warm-sand/60 px-5 py-6">
        <Link href="/admin" className="block" onClick={() => setMobileOpen(false)}>
          <p className="font-display text-xl font-semibold text-deep-aubergine">{BRAND.name}</p>
          <p className="text-xs text-luxury-ink/60">Admin Portal</p>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-deep-aubergine text-soft-ivory"
                      : "text-luxury-ink/80 hover:bg-warm-sand/50 hover:text-deep-aubergine"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-warm-sand/60 p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-luxury-ink/70 transition-colors hover:bg-warm-sand/50 hover:text-rich-berry"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-deep-aubergine p-2 text-soft-ivory lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block">{sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-luxury-ink/40" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-64 shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 rounded-lg p-1 text-luxury-ink/60 hover:text-luxury-ink"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </div>
        </div>
      )}
    </>
  );
}
