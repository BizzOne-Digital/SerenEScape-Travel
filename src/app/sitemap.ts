import type { MetadataRoute } from "next";
import { getAllTripSlugs } from "@/lib/trips/queries";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://serenescapetravel.com";

const staticRoutes = [
  "",
  "/trips",
  "/about",
  "/services",
  "/booking",
  "/testimonials",
  "/faq",
  "/contact",
  "/manage-booking",
  "/privacy",
  "/terms",
  "/cancellation-policy",
  "/accessibility",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tripSlugs = await getAllTripSlugs();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/trips" ? 0.9 : 0.7,
  }));

  const tripEntries: MetadataRoute.Sitemap = tripSlugs.map((slug) => ({
    url: `${BASE_URL}/trips/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...tripEntries];
}
