import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { PublicLayout } from "@/components/public/PublicLayout";
import { PageLoader } from "@/components/animations/PageLoader";
import { getSiteSettings } from "@/lib/site/queries";
import { getPageContent } from "@/lib/content/get";
import { resolveImageSrc } from "@/lib/images/resolve";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [settings, home] = await Promise.all([getSiteSettings(), getPageContent("home")]);
  const title = settings.defaultSeo?.title || `${settings.businessName} | ${settings.tagline}`;
  const description = settings.defaultSeo?.description || home.seo.description;

  return {
    title: {
      default: title,
      template: `%s | ${settings.businessName}`,
    },
    description,
    keywords: [
      "Black LGBTQIA+ group travel",
      "Black women group trips",
      "inclusive luxury travel",
      "LGBTQIA+ women travel groups",
      "BIPOC travel experiences",
    ],
    icons: { icon: resolveImageSrc(settings.faviconUrl) },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: settings.businessName,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, global] = await Promise.all([getSiteSettings(), getPageContent("global")]);

  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <PageLoader />
        <PublicLayout
          site={{
            businessName: settings.businessName,
            tagline: settings.tagline,
            email: settings.email,
            phone: settings.phone,
            facebookUrl: settings.facebookUrl,
            facebookLabel: settings.facebookLabel,
            logoUrl: settings.logoUrl,
          }}
          footer={global.footer}
          promoLabel={global.promoBanner.label}
          promoLinkLabel={global.promoBanner.linkLabel}
        >
          {children}
        </PublicLayout>
      </body>
    </html>
  );
}
