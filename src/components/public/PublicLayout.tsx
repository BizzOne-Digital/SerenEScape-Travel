"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { Footer } from "./Footer";
import { SiteChromeProvider, useSiteChrome } from "./SiteChrome";

interface PublicLayoutProps {
  children: React.ReactNode;
}

function PublicLayoutInner({ children }: PublicLayoutProps) {
  const { headerHeight } = useSiteChrome();

  return (
    <div className="site-shell flex min-h-screen w-full min-w-0 flex-col overflow-x-clip">
      <SiteHeader />
      <main
        id="main-content"
        className="w-full min-w-0 flex-1 overflow-x-clip"
        style={{ paddingTop: headerHeight }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <SiteChromeProvider>
      <PublicLayoutInner>{children}</PublicLayoutInner>
    </SiteChromeProvider>
  );
}
