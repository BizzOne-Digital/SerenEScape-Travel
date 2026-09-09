"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { IMAGES } from "@/config/images";
import { Button } from "@/components/ui/Button";
import { NAV_HEIGHT, useSiteChrome } from "@/components/public/SiteChrome";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Trips", href: "/trips" },
  { label: "About the Experience", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export function Navigation() {
  const pathname = usePathname();
  const { headerHeight } = useSiteChrome();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <header
        className={cn(
          "shrink-0 transition-all duration-300",
          isTransparent
            ? "bg-soft-ivory/90 backdrop-blur-md"
            : "glass-panel border-b border-muted-gold/20 shadow-sm shadow-luxury-ink/5"
        )}
        style={{ height: NAV_HEIGHT }}
      >
        <nav
          className="mx-auto flex h-full w-full min-w-0 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <Link href="/" className="relative z-50 shrink-0">
            <Image
              src={IMAGES.logo.src}
              alt={IMAGES.logo.alt}
              width={220}
              height={88}
              priority
              className="h-14 w-auto sm:h-16 md:h-[4.5rem]"
            />
          </Link>

          <ul className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "whitespace-nowrap rounded-full px-2 py-2 font-sans text-[12px] font-medium transition-colors duration-300 xl:px-2.5 xl:text-[13px]",
                      active
                        ? "text-rich-berry"
                        : "text-deep-aubergine/85 hover:text-rich-berry"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden shrink-0 lg:flex">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-full border-2 border-muted-gold/60 bg-gradient-to-r from-deep-aubergine via-rich-berry to-deep-aubergine px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-soft-ivory shadow-md shadow-deep-aubergine/15 transition hover:brightness-110 xl:px-5 xl:text-[11px]"
            >
              Book Your Escape
            </Link>
          </div>

          <button
            type="button"
            className="relative z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-deep-aubergine transition-colors hover:bg-warm-sand/60 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 overflow-x-clip lg:hidden"
            style={{ top: headerHeight }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-luxury-ink/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />

            <motion.div
              className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-soft-ivory shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              <div className="flex flex-1 flex-col overflow-y-auto px-8 pb-10 pt-8">
                <p className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-burnt-orange">
                  Navigate
                </p>

                <ul className="flex flex-col gap-1">
                  {navLinks.map((link, index) => {
                    const active = pathname === link.href;
                    return (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + index * 0.06, duration: 0.4 }}
                      >
                        <Link
                          href={link.href}
                          onClick={closeMobile}
                          className={cn(
                            "block rounded-xl px-4 py-3 font-display text-2xl transition-colors",
                            active
                              ? "text-rich-berry"
                              : "text-deep-aubergine hover:bg-warm-sand/50"
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                <motion.div
                  className="mt-10"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                >
                  <Button href="/booking" variant="primary" size="lg" className="w-full">
                    Book Your Escape
                  </Button>
                </motion.div>

                <motion.p
                  className="mt-auto pt-10 font-sans text-sm text-luxury-ink/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                >
                  Belong Everywhere.
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
