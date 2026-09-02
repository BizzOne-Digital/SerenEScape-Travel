/**
 * Centralized image manifest — replace paths here for site-wide updates.
 * People imagery: Black/BIPOC LGBTQIA+ women only when approved assets are added.
 */

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
    src: "/images/hero-collage.svg",
    alt: "Editorial collage of Chinese architecture, cuisine, and natural wonders",
    category: "cultural" as const,
    containsPeople: false,
  },
  destinationChina: {
    src: "/images/china-zhangjiajie.jpg",
    alt: "Sandstone pillars of Zhangjiajie National Forest Park rising through golden morning mist",
    category: "destination" as const,
    containsPeople: false,
  },
  chinaOdysseyCommunity: {
    src: "/images/china-odyssey-community.jpg",
    alt: "Three Black women travelers laughing together beneath red lanterns at a traditional Chinese temple courtyard",
    category: "cultural" as const,
    containsPeople: true,
  },
  destinationChengdu: {
    src: "/images/china-chengdu.jpg",
    alt: "Traditional Sichuan tea house courtyard in Chengdu with red lanterns and steaming tea at golden hour",
    category: "destination" as const,
    containsPeople: false,
  },
  destinationGuangzhou: {
    src: "/images/china-guangzhou.jpg",
    alt: "Canton Tower and Pearl River skyline reflecting on calm water at blue hour, Guangzhou",
    category: "destination" as const,
    containsPeople: false,
  },
  culturalFood: {
    src: "/images/cultural-food.jpg",
    alt: "Overhead spread of authentic Sichuan hot pot with fresh ingredients and dipping sauces",
    category: "cultural" as const,
    containsPeople: false,
  },
  founderPlaceholder: {
    src: "/images/founder-placeholder.svg",
    alt: "Founder photograph pending — development placeholder",
    category: "placeholder" as const,
    containsPeople: false,
  },
  experienceLuxury: {
    src: "/images/experience-luxury.jpg",
    alt: "Elegant boutique hotel suite at dusk with floor-to-ceiling windows overlooking misty mountains",
    category: "destination" as const,
    containsPeople: false,
  },
  experienceCommunity: {
    src: "/images/experience-community.svg",
    alt: "Warm gathering space with travel maps and cultural artifacts",
    category: "cultural" as const,
    containsPeople: false,
  },
  tripChinaOdyssey: {
    src: "/images/trip-china-odyssey.jpg",
    alt: "Traditional Chinese pavilion overlooking Zhangjiajie pillar mountains at sunrise",
    category: "trip" as const,
    containsPeople: false,
  },
  tripCartagena: {
    src: "/images/trip-cartagena.jpg",
    alt: "Colorful colonial street in Cartagena Old Town with bougainvillea and cobblestones",
    category: "trip" as const,
    containsPeople: false,
  },
  tripTulum: {
    src: "/images/trip-tulum.jpg",
    alt: "Turquoise Caribbean sea and white sand beach with Mayan ruins on the cliff at Tulum",
    category: "trip" as const,
    containsPeople: false,
  },
  tripCapeTown: {
    src: "/images/trip-cape-town.jpg",
    alt: "Cape Winelands vineyard rows at sunset with Table Mountain in the distance",
    category: "trip" as const,
    containsPeople: false,
  },
} as const satisfies Record<string, ImageEntry>;

export function getImage(key: keyof typeof IMAGES): ImageEntry {
  return IMAGES[key];
}
