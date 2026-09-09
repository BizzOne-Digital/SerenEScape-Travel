/**
 * Centralized image manifest — replace paths here for site-wide updates.
 * Hero homepage image is unchanged; all other sections use client assets from /public.
 */

import { publicSrc } from "@/config/public-images";

export type ImageEntry = {
  src: string;
  alt: string;
  category: "hero" | "destination" | "founder" | "brand" | "cultural" | "placeholder" | "trip";
  containsPeople: boolean;
};

export const IMAGES = {
  logo: {
    src: "/brand/serenescape-logo.png",
    alt: "SerenEScape Travel logo — colorful heart mark with handwritten wordmark",
    category: "brand" as const,
    containsPeople: false,
  },
  hero: {
    src: "/images/hero-background.jpg",
    alt: "Misty karst mountains at sunrise with luxury infinity pool and traditional pavilion architecture",
    category: "destination" as const,
    containsPeople: false,
  },
  heroCollage: {
    src: publicSrc("realisticGroup"),
    alt: "Black lesbian and queer women travelers enjoying a luxury group journey together",
    category: "cultural" as const,
    containsPeople: true,
  },
  destinationChina: {
    src: publicSrc("internationalAdventure"),
    alt: "Black lesbian and queer women on an adventurous international group journey",
    category: "destination" as const,
    containsPeople: true,
  },
  chinaOdysseyCommunity: {
    src: publicSrc("culturalExperience"),
    alt: "Black women travelers sharing a respectful cultural experience abroad",
    category: "cultural" as const,
    containsPeople: true,
  },
  destinationChengdu: {
    src: publicSrc("culturalExperience"),
    alt: "Black lesbian and queer women participating together in a respectful cultural experience",
    category: "destination" as const,
    containsPeople: true,
  },
  destinationGuangzhou: {
    src: publicSrc("privateGathering"),
    alt: "Black lesbian and queer women gathered for a private luxury travel experience",
    category: "destination" as const,
    containsPeople: true,
  },
  culturalFood: {
    src: publicSrc("diningTable"),
    alt: "Black women travelers sharing a celebratory meal together at a luxury dining table",
    category: "cultural" as const,
    containsPeople: true,
  },
  founderPrimary: {
    src: "/images/founders-duo.jpg",
    alt: "SerenEScape Travel founders smiling together at a warm gathering",
    category: "founder" as const,
    containsPeople: true,
  },
  founderSecondary: {
    src: publicSrc("diverseGroup"),
    alt: "Diverse Black lesbian and queer women travelers celebrating together",
    category: "founder" as const,
    containsPeople: true,
  },
  founderPlaceholder: {
    src: "/images/founders-duo.jpg",
    alt: "SerenEScape Travel founders",
    category: "founder" as const,
    containsPeople: true,
  },
  experienceLuxury: {
    src: publicSrc("luxuryTravelCard"),
    alt: "Ultra-realistic luxury travel experience curated for Black LGBTQIA+ women",
    category: "destination" as const,
    containsPeople: true,
  },
  experienceCommunity: {
    src: publicSrc("largeTravelGroup"),
    alt: "Large organized travel group of Black lesbian and queer women exploring together",
    category: "cultural" as const,
    containsPeople: true,
  },
  tripChinaOdyssey: {
    src: publicSrc("largeTravelGroup"),
    alt: "Organized travel group of Black lesbian and queer women on a curated journey",
    category: "trip" as const,
    containsPeople: true,
  },
  tripCartagena: {
    src: publicSrc("catamaran"),
    alt: "Black lesbian and queer women enjoying a private luxury catamaran experience",
    category: "trip" as const,
    containsPeople: true,
  },
  tripTulum: {
    src: publicSrc("catamaranAlt"),
    alt: "Black lesbian and queer women celebrating on a luxury Caribbean catamaran",
    category: "trip" as const,
    containsPeople: true,
  },
  tripCapeTown: {
    src: publicSrc("largeTravelGroup"),
    alt: "Organized travel group of Black lesbian and queer women on a curated journey",
    category: "trip" as const,
    containsPeople: true,
  },
  pageHeroTrips: {
    src: publicSrc("realisticGroup"),
    alt: "Black lesbian and queer women on a curated SerenEScape group journey",
    category: "cultural" as const,
    containsPeople: true,
  },
  pageHeroTestimonials: {
    src: publicSrc("groupCelebration"),
    alt: "Black lesbian and queer women celebrating their travel experience together",
    category: "cultural" as const,
    containsPeople: true,
  },
} as const satisfies Record<string, ImageEntry>;

export function shouldUnoptimizeImage(src: string): boolean {
  return src.includes("Firefly_") || src.includes("%20Firefly") || src.endsWith(".svg");
}

/** Default trip card hero by slug when DB image is missing */
export const TRIP_HERO_BY_SLUG: Record<string, keyof typeof IMAGES> = {
  "2027-china-odyssey": "tripChinaOdyssey",
  "cartagena-caribbean-coast": "tripCartagena",
  "tulum-riviera-maya": "tripTulum",
  "cape-town-winelands": "tripCapeTown",
};

export function getTripHeroImage(slug: string): ImageEntry {
  const key = TRIP_HERO_BY_SLUG[slug] ?? "tripChinaOdyssey";
  return IMAGES[key];
}
