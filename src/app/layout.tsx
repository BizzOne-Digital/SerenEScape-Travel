import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { PublicLayout } from "@/components/public/PublicLayout";
import { PageLoader } from "@/components/animations/PageLoader";

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

export const metadata: Metadata = {
  title: {
    default: "SerenEScape Travel | Belong Everywhere.",
    template: "%s | SerenEScape Travel",
  },
  description:
    "Luxury group travel for Black LGBTQIA+ women. Curated journeys with safety, community, and queer joy. Come for the destination. Stay for the community.",
  keywords: [
    "Black LGBTQIA+ group travel",
    "Black women group trips",
    "inclusive luxury travel",
    "LGBTQIA+ women travel groups",
    "BIPOC travel experiences",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SerenEScape Travel",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <PageLoader />
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
