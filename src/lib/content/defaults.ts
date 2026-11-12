/**
 * Default site copy + images for every editable page.
 *
 * These are the fallback values used when the admin has not saved an override
 * in MongoDB (PageContent collection). The admin editor starts from
 * `defaults + saved overrides`, so nothing the visitor sees today is lost.
 */

import { IMAGES } from "@/config/images";

export type ImageValue = { url: string; alt: string };

const img = (e: { src: string; alt: string }): ImageValue => ({ url: e.src, alt: e.alt });

export const CONTENT_DEFAULTS = {
  global: {
    footer: {
      description:
        "Luxury group travel curated for Black LGBTQIA+ women — where safety, community, and queer joy meet the world.",
      quickLinksTitle: "Quick Links",
      contactTitle: "Contact",
      policiesTitle: "Policies",
      newsletterTitle: "Newsletter",
      newsletterText: "Be first to know about new journeys, early access, and community events.",
      newsletterSuccess: "Welcome to the journey — you're on the list.",
      builtFor: "Built for belonging",
      paymentNote: "PayPal · Square",
    },
    promoBanner: {
      label: "Limited Offer",
      linkLabel: "Explore trips",
    },
  },

  home: {
    seo: {
      title: "SerenEScape Travel | Belong Everywhere.",
      description:
        "Luxury group travel for Black LGBTQIA+ women. Curated journeys with safety, community, and queer joy. Come for the destination. Stay for the community.",
    },
    hero: {
      eyebrow: "Luxury group travel for Black LGBTQIA+ women",
      headlineLine1: "Come for the Destination.",
      headlineLine2: "Stay for the Community.",
      supporting:
        "Curated journeys created for Black women and LGBTQIA+ travelers who want to explore boldly, experience deeply, and belong everywhere.",
      primaryCtaLabel: "Explore Upcoming Trips",
      primaryCtaHref: "/trips",
      secondaryCtaLabel: "Discover Our Story",
      secondaryCtaHref: "/about",
      featuredLabel: "Featured Journey",
      image: img(IMAGES.hero),
      pills: [{ text: "Asia" }, { text: "Culture" }, { text: "Adventure" }],
      watermarks: [
        { text: "Adventure Awaits" },
        { text: "Explore Boldly" },
        { text: "Journeys That Connect · Est. 2021" },
      ],
    },
    belong: {
      eyebrow: "Our Story",
      title: "Belong Everywhere.",
      description:
        "Founded by two Black LGBTQIA+ women who believe travel should be a celebration of who we are, not a compromise.",
      paragraphs: [
        {
          text: "SerenEScape Travel creates spaces where Black women and LGBTQIA+ travelers can explore the world on our terms—with safety, luxury, and sisters who get it by our side.",
        },
        {
          text: "We curate transformative journeys that honor all your intersections. You get the freedom to explore independently while being held by a community where your full self is celebrated. No explanations needed. No shrinking. Just authentic adventure, queer joy, and genuine belonging.",
        },
      ],
      note: "Women allies who share our values are welcome too.",
    },
    featured: {
      eyebrow: "Upcoming Journeys",
      title: "Featured Escapes",
      description:
        "Handpicked group experiences designed for connection, culture, and uncompromising comfort.",
    },
    why: {
      eyebrow: "Why SerenEScape",
      title: "Travel That Understands You",
      description: "We built something different because we needed something different.",
      items: [
        {
          title: "Created for Us",
          description:
            "Every journey is designed with Black LGBTQIA+ women at the center—not as an afterthought, but as the heart of the experience.",
        },
        {
          title: "Culturally Intentional",
          description:
            "We honor the cultures we visit with respect, depth, and curiosity—connecting you to authentic local experiences beyond the tourist trail.",
        },
        {
          title: "Luxury Without Pretension",
          description:
            "Quality accommodations and curated experiences that feel elevated yet approachable—never stuffy, never performative.",
        },
        {
          title: "Freedom With Community",
          description:
            "Explore on your own terms while knowing your sisters have your back. Solo freedom, collective warmth.",
        },
        {
          title: "Thoughtfully Curated",
          description:
            "Every detail—from pacing to excursions to group dynamics—is intentionally designed for how we actually travel.",
        },
      ],
    },
    experience: {
      eyebrow: "The SerenEScape Experience",
      title: "Every Detail, Intentionally Designed",
      description:
        "From where you rest your head to how you pay, we handle the details so you can focus on belonging.",
      imageMobile: img(IMAGES.experienceCommunity),
      imageDesktop: img(IMAGES.experienceLuxury),
      items: [
        {
          title: "Quality Accommodations",
          description: "Hand-selected hotels and stays that balance comfort, location, and character.",
        },
        {
          title: "Cultural Excursions",
          description: "Immersive experiences that connect you to local history, art, and traditions.",
        },
        {
          title: "Welcoming Group Environment",
          description:
            "Travel with inspiring women who celebrate life together—your community from day one.",
        },
        {
          title: "Thoughtfully Paced Itineraries",
          description:
            "Enough structure to feel supported, enough breathing room to savor each moment.",
        },
        {
          title: "Independent Exploration",
          description:
            "Optional free time built in so you can wander, rest, or discover on your own terms.",
        },
        {
          title: "Payment Plan Options",
          description:
            "Reserve your spot with a deposit and spread the rest across scheduled installments.",
        },
        {
          title: "Dedicated Trip Communication",
          description:
            "Clear updates, pre-trip guidance, and support from booking through your return home.",
        },
      ],
    },
    destinations: {
      eyebrow: "Destination Story",
      title: "China, Layer by Layer",
      description:
        "Scroll through the landscapes, flavors, and architecture that define our China odyssey—no stock travelers, just the destinations themselves telling their stories.",
      items: [
        {
          image: img(IMAGES.destinationChina),
          city: "Zhangjiajie",
          region: "Hunan Province",
          theme: "Nature & Wonder",
          copy: "Sandstone pillars rise through morning mist like ancient sentinels. Hike forest trails, ride the Bailong Elevator, and stand where sky meets stone at Hallelujah Peak.",
        },
        {
          image: img(IMAGES.destinationChengdu),
          city: "Chengdu",
          region: "Sichuan Province",
          theme: "Culture & Cuisine",
          copy: "Giant pandas, Sichuan hot pot, and centuries-old tea houses. Wander Kuanzhai Alley's lantern-lit lanes and feel the unhurried rhythm of the city.",
        },
        {
          image: img(IMAGES.destinationGuangzhou),
          city: "Guangzhou",
          region: "Guangdong Province",
          theme: "Architecture & Heritage",
          copy: "Colonial charm on Shamian Island, intricate Chen Clan ancestral halls, and the Pearl River glittering beneath Canton Tower. A city where tradition meets the future.",
        },
        {
          image: img(IMAGES.culturalFood),
          city: "Culinary Journey",
          region: "Across China",
          theme: "Food & Flavor",
          copy: "From spice markets in Chongqing to dim sum in Guangzhou—every meal is a doorway into culture. Taste the regions that shape each day's adventure.",
        },
      ],
    },
    how: {
      eyebrow: "How It Works",
      title: "Your Journey Starts Here",
      description: "From discovery to departure, we've made every step clear and supported.",
      steps: [
        {
          title: "Find Your Escape",
          description: "Browse upcoming journeys and discover the destination that calls to you.",
        },
        {
          title: "Reserve Your Place",
          description: "Secure your spot with a deposit and complete your traveler details.",
        },
        {
          title: "Choose Your Payment Option",
          description:
            "Pay in full for 5% off, or spread payments across a flexible installment plan.",
        },
        {
          title: "Meet Your Community",
          description:
            "Connect with fellow travelers before departure through our trip communication.",
        },
        {
          title: "Travel and Belong Everywhere",
          description: "Embark on your journey—explore boldly, experience deeply, belong fully.",
        },
      ],
    },
    founders: {
      eyebrow: "Meet the Founders",
      title: "Built by Women Who Get It",
      description: "The visionaries behind SerenEScape Travel—creating spaces where we all belong.",
      emptyNote:
        "Founder content pending — photographs and biographies will appear here once supplied.",
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "Voices From the Journey",
      emptyTitle: "Stories from our community coming soon",
      emptyText: "Real traveler stories will appear here once approved.",
    },
    payment: {
      eyebrow: "Payment Flexibility",
      title: "Invest in Your Journey, Your Way",
      description:
        "We believe extraordinary travel should be accessible—not locked behind a single payment deadline.",
      items: [
        {
          title: "Reserve with a Deposit",
          description:
            "Secure your spot with a required deposit—your journey begins the moment you commit.",
        },
        {
          title: "Scheduled Installments",
          description:
            "Spread remaining payments across a clear schedule with due dates you can plan around.",
        },
        {
          title: "Secure Booking Link",
          description: "Pay your balance anytime through your personal, secure traveler portal.",
        },
        {
          title: "5% Pay-in-Full Discount",
          description:
            "Choose to pay in full at booking and receive an automatic 5% discount on your trip total.",
        },
        {
          title: "PayPal & Square",
          description: "Trusted payment providers—never store card details on our servers.",
        },
      ],
      disclaimer:
        "Installment payments are made through secure links when due—not automatically charged unless you have explicitly opted into a configured auto-pay program.",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Questions? We've Got Answers.",
      description:
        "The essentials before you book. For everything else, our full FAQ has you covered.",
      buttonLabel: "View All FAQs",
      emptyText: "FAQs will appear here once published.",
    },
    cta: {
      title: "Your next journey should feel like freedom.",
      text: "Come for the destination. Stay for the community.",
      primaryLabel: "Explore Trips",
      primaryHref: "/trips",
      secondaryLabel: "Plan a Custom Group Experience",
      secondaryHref: "/contact?type=custom-group",
    },
  },

  about: {
    seo: {
      title: "About the Experience",
      description:
        "Belong Everywhere. Learn about SerenEScape Travel's mission, founders, and commitment to safe, inclusive luxury travel for Black LGBTQIA+ women.",
    },
    hero: {
      eyebrow: "Our Story",
      title: "Belong Everywhere.",
      description:
        "Founded by two Black LGBTQIA+ women who believe travel should be a celebration of who we are—not a compromise.",
      watermark: "Built for Belonging",
      image: { url: "", alt: "" },
    },
    story: {
      eyebrow: "Founder Story",
      title: "Built by Women Who Get It",
      description:
        "SerenEScape Travel was born from a simple truth: the travel industry wasn't built for us. So we built something better.",
      paragraphs: [
        {
          text: "After years of navigating travel spaces that demanded we shrink ourselves—code-switching, explaining our relationships, wondering if we'd be safe—we decided to create the journeys we wished existed.",
        },
        {
          text: "SerenEScape Travel creates spaces where Black women and LGBTQIA+ travelers can explore the world on our terms. You get the freedom to explore independently while being held by a community where your full self is celebrated.",
        },
      ],
      quote:
        "No explanations needed. No shrinking. Just authentic adventure, queer joy, and genuine belonging.",
    },
    founders: {
      eyebrow: "Meet the Founders",
      title: "Built by Women Who Get It",
      description: "The visionaries behind SerenEScape Travel—creating spaces where we all belong.",
      emptyNote:
        "Founder content pending — photographs and biographies will appear here once supplied.",
    },
    pillars: {
      eyebrow: "What We Stand For",
      title: "More Than a Trip",
      items: [
        {
          title: "Representation Matters",
          description:
            "Every journey is designed with Black LGBTQIA+ women at the center—not as an afterthought. Our itineraries, accommodations, and experiences reflect who we are.",
        },
        {
          title: "Safety First, Always",
          description:
            "We vet every destination, partner, and experience through a lens of cultural awareness and queer safety. Travel with confidence knowing your wellbeing is our priority.",
        },
        {
          title: "Community Philosophy",
          description:
            "Come for the destination, stay for the community. Our groups are intentionally small, curated, and designed to foster genuine connection and queer joy.",
        },
        {
          title: "Luxury Without Compromise",
          description:
            "Premium accommodations, curated experiences, and white-glove service—without asking you to leave any part of yourself at home.",
        },
      ],
    },
  },

  services: {
    seo: {
      title: "Services",
      description:
        "Curated group journeys, custom group travel planning, and concierge services for Black LGBTQIA+ women and allies.",
    },
    hero: {
      eyebrow: "What We Offer",
      title: "Travel, Your Way",
      description:
        "From signature group journeys to fully custom experiences—we meet you where you are.",
      watermark: "Curated For You",
      image: { url: "", alt: "" },
    },
    list: {
      items: [
        {
          title: "Curated Group Journeys",
          description:
            "Join one of our signature small-group trips—expertly designed itineraries with premium accommodations, cultural immersion, and a built-in community of sisters who get it.",
          highlights: [
            { text: "8–20 travelers per group" },
            { text: "All-inclusive pricing options" },
            { text: "Payment plans available" },
          ],
        },
        {
          title: "Custom Group Travel",
          description:
            "Planning a milestone celebration, corporate retreat, or friends' getaway? We'll design a bespoke journey tailored to your group's interests, budget, and accessibility needs.",
          highlights: [
            { text: "Personalized itineraries" },
            { text: "Flexible group sizes" },
            { text: "Dedicated trip coordinator" },
          ],
        },
        {
          title: "Travel Concierge",
          description:
            "Already booked? Our concierge team supports you from pre-departure through your return—visa guidance, packing tips, dietary accommodations, and on-trip support.",
          highlights: [
            { text: "Pre-trip preparation" },
            { text: "On-trip assistance" },
            { text: "Post-trip community" },
          ],
        },
      ],
    },
    custom: {
      eyebrow: "Custom Groups",
      title: "Plan Your Group Escape",
      description:
        "Tell us about your vision and we'll craft a journey that's uniquely yours. Perfect for celebrations, reunions, and organizational retreats.",
    },
  },

  contact: {
    seo: {
      title: "Contact",
      description:
        "Get in touch with SerenEScape Travel. We're here to help with bookings, questions, and custom group inquiries.",
    },
    hero: {
      eyebrow: "Get in Touch",
      title: "We'd Love to Hear From You",
      description:
        "Questions about a trip, booking support, or a custom group journey? Reach out—we're here for you.",
      watermark: "Let's Connect",
      image: { url: "", alt: "" },
    },
    info: {
      title: "Contact Information",
      text: "We typically respond within 1–2 business days. For urgent booking matters, please include your booking reference.",
      formTitle: "Send a Message",
    },
  },

  faq: {
    seo: {
      title: "FAQ",
      description:
        "Frequently asked questions about SerenEScape Travel bookings, payments, safety, and group travel.",
    },
    hero: {
      eyebrow: "Help Center",
      title: "Frequently Asked Questions",
      description: "Everything you need to know before booking your escape.",
      watermark: "Travel Confidently",
      image: { url: "", alt: "" },
    },
    help: {
      title: "Still have questions?",
      text: "Our team is here to help. Reach out and we'll get back to you.",
    },
  },

  testimonials: {
    seo: {
      title: "Testimonials",
      description:
        "Real stories from Black LGBTQIA+ women who traveled with SerenEScape. Hear from our community.",
    },
    hero: {
      eyebrow: "Community Voices",
      title: "Stories From the Journey",
      description: "Real experiences from travelers who chose belonging over compromise.",
      watermark: "Real Stories",
      image: img(IMAGES.pageHeroTestimonials),
    },
    cta: {
      text: "Want to share your story?",
      linkLabel: "Get in touch",
      after: "after your journey.",
    },
  },

  trips: {
    seo: {
      title: "Our Journeys",
      description:
        "Explore curated luxury group travel experiences for Black LGBTQIA+ women. Filter by destination, dates, and payment options.",
    },
    hero: {
      eyebrow: "Explore",
      title: "Our Journeys",
      description:
        "Curated adventures where safety, luxury, and community come together. Find your next escape.",
      watermark: "Adventure Awaits",
      image: img(IMAGES.pageHeroTrips),
    },
  },
} as const;

export type ContentDefaults = typeof CONTENT_DEFAULTS;
export type ContentPageKey = keyof ContentDefaults;
export const CONTENT_PAGE_KEYS = Object.keys(CONTENT_DEFAULTS) as ContentPageKey[];

export function isContentPageKey(value: string): value is ContentPageKey {
  return (CONTENT_PAGE_KEYS as string[]).includes(value);
}

/** Deeply widen readonly literal defaults into plain string/array shapes. */
export type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? Widen<U>[]
        : T extends object
          ? { -readonly [K in keyof T]: Widen<T[K]> }
          : T;

export type PageContent<K extends ContentPageKey> = Widen<ContentDefaults[K]>;
