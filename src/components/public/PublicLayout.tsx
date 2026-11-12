"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { Footer, type FooterContent } from "./Footer";
import { SiteChromeProvider, useSiteChrome } from "./SiteChrome";

export interface SiteInfo {
  businessName: string;
  tagline: string;
  email: string;
  phone: string;
  facebookUrl: string;
  facebookLabel: string;
  logoUrl: string;
}

interface PublicLayoutProps {
  children: React.ReactNode;
  site: SiteInfo;
  footer: FooterContent;
  promoLabel: string;
  promoLinkLabel: string;
}

function PublicLayoutInner({ children, site, footer, promoLabel, promoLinkLabel }: PublicLayoutProps) {
  const { headerHeight } = useSiteChrome();

  return (
    <div className="site-shell flex min-h-screen w-full min-w-0 flex-col overflow-x-clip">
      <SiteHeader
        logoUrl={site.logoUrl}
        logoAlt={`${site.businessName} logo`}
        promoLabel={promoLabel}
        promoLinkLabel={promoLinkLabel}
      />
      <main
        id="main-content"
        className="w-full min-w-0 flex-1 overflow-x-clip"
        style={{ paddingTop: headerHeight }}
      >
        {children}
      </main>
      <Footer site={site} content={footer} />
    </div>
  );
}

export function PublicLayout({ children, ...rest }: PublicLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <SiteChromeProvider>
      <PublicLayoutInner {...rest}>{children}</PublicLayoutInner>
    </SiteChromeProvider>
  );
}
