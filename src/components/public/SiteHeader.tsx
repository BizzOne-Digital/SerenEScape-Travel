"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnnouncementBanner } from "@/components/public/home/AnnouncementBanner";
import { Navigation } from "@/components/public/Navigation";
import { useSiteChrome, NAV_HEIGHT } from "@/components/public/SiteChrome";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const headerRef = useRef<HTMLDivElement>(null);
  const { setHeaderHeight } = useSiteChrome();

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const measure = () => {
      setHeaderHeight(el.offsetHeight || NAV_HEIGHT);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, [setHeaderHeight, isHome]);

  return (
    <div
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 flex w-full max-w-[100vw] flex-col overflow-x-clip"
    >
      {isHome && <AnnouncementBanner />}
      <Navigation />
    </div>
  );
}
