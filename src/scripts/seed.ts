import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import {
  AdminUser,
  SiteSettings,
  Trip,
  FAQ,
  PromoCode,
  Founder,
  Testimonial,
} from "@/lib/models";
import { BRAND } from "@/config/brand";

const PUBLISHED_FAQS = [
  {
    category: "booking",
    question: "How do I book a trip?",
    answer:
      "Browse our upcoming journeys, open the trip page for full details, and click through to the booking flow. A deposit secures your spot; you will receive a confirmation email with your booking reference and next steps.",
    order: 1,
  },
  {
    category: "booking",
    question: "Can I join a waitlist if a trip is sold out?",
    answer:
      "Yes. If a journey is sold out or waitlist-only, you can submit your details on the trip page. We will contact you if a spot opens or when a similar trip is announced.",
    order: 2,
  },
  {
    category: "booking",
    question: "What is included in the trip price?",
    answer:
      "Each trip page lists inclusions and exclusions clearly—typically accommodations, curated excursions, group transportation between cities, and meals as noted in the itinerary. International flights, visas, travel insurance, and personal expenses are usually not included unless stated otherwise.",
    order: 3,
  },
  {
    category: "payment",
    question: "What payment options are available?",
    answer:
      "We accept PayPal and Square. Depending on the trip, you may pay a deposit to reserve your spot, pay in full at checkout, or enroll in a scheduled payment plan.",
    order: 1,
  },
  {
    category: "payment",
    question: "Do you offer payment plans?",
    answer:
      "Select trips include payment plan options so you can spread the balance across scheduled installments after your deposit. Available plans and due dates are shown during checkout.",
    order: 2,
  },
  {
    category: "payment",
    question: "Is there a discount for paying in full?",
    answer:
      "Yes—when available, paying your full balance upfront may qualify for a pay-in-full discount (currently 5% off eligible trips). The discount is applied at checkout when you select the pay-in-full option.",
    order: 3,
  },
  {
    category: "payment",
    question: "What is your cancellation and refund policy?",
    answer:
      "Cancellation terms vary by trip and are summarized on each journey page. For specific questions about your booking, contact our team before your departure date so we can review your options.",
    order: 4,
  },
  {
    category: "travel",
    question: "Is travel insurance required?",
    answer:
      "We strongly recommend comprehensive travel insurance for all international trips. Insurance can cover medical emergencies, trip interruptions, and lost baggage—protecting both you and your investment.",
    order: 1,
  },
  {
    category: "travel",
    question: "Do I need a visa for international trips?",
    answer:
      "Visa requirements depend on your passport and destination. Trip-specific guidance is shared in pre-departure communications. You are responsible for securing valid travel documents before departure.",
    order: 2,
  },
  {
    category: "travel",
    question: "Are flights included?",
    answer:
      "International flights are generally not included unless explicitly stated on a trip page. We provide recommended arrival and departure windows so you can coordinate flights that align with the group itinerary.",
    order: 3,
  },
  {
    category: "community",
    question: "Who travels with SerenEScape?",
    answer:
      "Our journeys are designed for Black LGBTQIA+ women seeking luxury group travel in a safe, affirming community. Women allies who share our values of inclusion, respect, and celebration are welcome too.",
    order: 1,
  },
  {
    category: "community",
    question: "Do I have to travel solo?",
    answer:
      "Many guests join on their own—and quickly find their people. Group sizes are intentionally curated so you can connect without feeling lost in a crowd, with enough free time to explore independently.",
    order: 2,
  },
  {
    category: "safety",
    question: "How do you support traveler safety?",
    answer:
      "We work with vetted local partners, quality accommodations, and English-speaking guides where applicable. Pre-trip briefings, clear communication, and thoughtful pacing help you feel supported from booking through your return home.",
    order: 1,
  },
  {
    category: "safety",
    question: "Can you accommodate dietary needs or accessibility requests?",
    answer:
      "Share dietary restrictions, mobility needs, or other accessibility requests during booking or before departure. We will do our best to accommodate you and will follow up if we need additional details.",
    order: 2,
  },
] as const;

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is required. Set it in .env.local");
    process.exit(1);
  }

  await connectDB();
  console.log("Connected to MongoDB");

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@serenescapetravel.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const existingAdmin = await AdminUser.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await AdminUser.create({
      name: "SerenEScape Admin",
      email: adminEmail,
      passwordHash,
      role: "super_admin",
      active: true,
    });
    console.log(`Created admin user: ${adminEmail}`);
    console.log(`Default password: ${adminPassword} (change immediately)`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  const settings = await SiteSettings.findOne();
  if (!settings) {
    await SiteSettings.create({
      businessName: BRAND.name,
      tagline: BRAND.tagline,
      heroHeadline: BRAND.heroHeadline,
      heroEyebrow: "Luxury group travel for Black LGBTQIA+ women",
      heroSupporting: "Curated journeys with safety, community, and queer joy.",
      email: BRAND.email,
      phone: BRAND.phone,
      facebookUrl: BRAND.facebookUrl,
      contactRecipientEmail: BRAND.email,
      footerTagline: "Built for belonging",
      paypalEnabled: true,
      squareEnabled: true,
      manualPaymentEnabled: false,
      maintenanceMode: false,
    });
    console.log("Created site settings");
  } else {
    console.log("Site settings already exist");
  }

  const chinaHeroImage = {
    url: "/images/trip-china-odyssey.jpg",
    alt: "Traditional Chinese pavilion overlooking Zhangjiajie pillar mountains at sunrise",
  };
  const chinaStartDate = new Date("2027-09-09T00:00:00.000Z");
  const chinaEndDate = new Date("2027-09-21T00:00:00.000Z");

  const chinaTrip = await Trip.findOne({ slug: "2027-china-odyssey" });
  if (!chinaTrip) {
    await Trip.create({
      title: "2027 China Odyssey",
      slug: "2027-china-odyssey",
      shortDescription: "Solo travel with a supportive group.",
      overview:
        "Embark on a 13-day journey through China's most captivating regions. From the serene beauty of giant pandas in Chengdu to the breathtaking landscapes of Zhangjiajie, this trip is designed for women who crave authentic cultural immersion, natural wonders, and unforgettable memories. Experience quality accommodations, carefully curated excursions, English-speaking guides, and the comfort of traveling with inspiring women who celebrate life together. This is luxury travel reimagined for us.",
      destination: "China — Chengdu, Chongqing, Zhangjiajie and Guangzhou",
      cities: ["Chengdu", "Chongqing", "Wulong", "Zhangjiajie", "Guangzhou"],
      durationDays: 13,
      groupMin: 8,
      groupMax: 20,
      capacity: 20,
      reservedCount: 0,
      priceFromCents: 213600,
      currency: "USD",
      depositCents: 0,
      payInFullDiscountPercent: 5,
      paymentPlanEnabled: false,
      status: "coming_soon",
      featured: true,
      isBookable: false,
      startDate: chinaStartDate,
      endDate: chinaEndDate,
      heroImage: chinaHeroImage,
      inclusions: [
        "Quality accommodations as listed in itinerary",
        "English-speaking local guides",
        "Curated cultural excursions",
        "Meals as specified per day",
        "Group transportation between cities",
      ],
      exclusions: [
        "International flights",
        "Travel insurance",
        "Personal expenses",
        "Visa fees",
        "Optional excursions",
        "Meals not specified in itinerary",
      ],
      roomOptions: [
        { id: "shared", name: "Shared Room", description: "Twin occupancy", supplementCents: 0 },
      ],
      excursions: [
        { id: "sichuan-opera", name: "Sichuan Opera Experience", description: "Optional evening cultural performance", priceCents: 4000, dayNumber: 2 },
      ],
      itinerary: [
        { dayNumber: 1, title: "Arrival in Chengdu", description: "Airport welcome, private transfer and check-in at Xizang Hotel Chengdu. Remaining time for rest and jet-lag recovery. No meals included.", city: "Chengdu", accommodation: "Xizang Hotel Chengdu", mealsIncluded: [], published: true },
        { dayNumber: 2, title: "Giant Pandas and Chengdu Local Life", description: "Visit the Chengdu Research Base of Giant Panda Breeding, enjoy hot pot, visit Wenshu Temple and explore Kuanzhai Alley.", city: "Chengdu", mealsIncluded: ["Breakfast", "Lunch"], optionalExcursions: [{ name: "Sichuan Opera experience", priceCents: 4000 }], published: true },
        { dayNumber: 3, title: "Dujiangyan Day Trip", description: "Visit Zhongshuge, the Dujiangyan Irrigation System, Yangtianwo Plaza and South Bridge. Return to Chengdu.", city: "Chengdu", mealsIncluded: ["Breakfast"], published: true },
        { dayNumber: 4, title: "Chengdu to Chongqing", description: "Explore a spice market, participate in a Sichuan cooking experience and travel to Chongqing by first-class bullet train.", city: "Chongqing", mealsIncluded: ["Breakfast", "Lunch"], transportation: "First-class bullet train", published: true },
        { dayNumber: 5, title: "Chongqing Highlights", description: "Experience Liziba Light Rail, Shancheng Walkway, Kuixing Tower, Jiefangbei Square, Hongya Cave and a Yangtze and Jialing River night cruise.", city: "Chongqing", mealsIncluded: ["Breakfast", "Dinner"], published: true },
        { dayNumber: 6, title: "Chongqing to Wulong", description: "Visit the Three Natural Bridges and Fairy Mountain National Forest Park. Overnight in Wulong.", city: "Wulong", mealsIncluded: ["Breakfast"], published: true },
        { dayNumber: 7, title: "Wulong to Zhangjiajie", description: "Explore Longshui Gorge and Furong Cave, then travel by bullet train to Zhangjiajie. Stay at Wyndham Zhangjiajie Wulingyuan.", city: "Zhangjiajie", accommodation: "Wyndham Zhangjiajie Wulingyuan", mealsIncluded: ["Breakfast"], transportation: "Bullet train", published: true },
        { dayNumber: 8, title: "Zhangjiajie National Forest Park", description: "Explore Wulingyuan Scenic Area, ride the Bailong Elevator, see First Bridge in the World and Hallelujah Peak, visit Tianzi Mountain and take the Ten-Mile Gallery train.", city: "Zhangjiajie", mealsIncluded: ["Breakfast", "Dinner"], published: true },
        { dayNumber: 9, title: "Golden Whip Stream and Glass Bridge", description: "Hike Golden Whip Stream and visit Zhangjiajie Grand Canyon Glass Bridge.", city: "Zhangjiajie", mealsIncluded: ["Breakfast"], published: true },
        { dayNumber: 10, title: "Tianmen Mountain and Guangzhou", description: "Visit Yellow Dragon Cave and Tianmen Mountain, then fly to Guangzhou. Check in at Holiday Inn Guangzhou Zhujiang New Town.", city: "Guangzhou", accommodation: "Holiday Inn Guangzhou Zhujiang New Town", mealsIncluded: ["Breakfast"], transportation: "Flight", published: true },
        { dayNumber: 11, title: "Guangzhou City Experience", description: "Visit Shamian Island, Yongqing Fang, Bruce Lee's Ancestral House, Chen Clan Ancestral Hall, Canton Tower and enjoy a Pearl River evening cruise.", city: "Guangzhou", mealsIncluded: ["Breakfast", "Lunch", "Dinner"], published: true },
        { dayNumber: 12, title: "Content Pending", description: "Day 12 itinerary details will be added by the admin team.", city: "TBD", published: false },
        { dayNumber: 13, title: "Content Pending", description: "Day 13 itinerary details will be added by the admin team.", city: "TBD", published: false },
      ],
      faqItems: [
        { question: "Do I need a visa for China?", answer: "[Draft — final visa policy to be confirmed by admin]" },
      ],
      cancellationSummary: "[Draft — cancellation policy to be confirmed by admin]",
    });
    console.log("Created 2027 China Odyssey trip draft (not bookable until admin completes required fields)");
  } else {
    await Trip.updateOne(
      { slug: "2027-china-odyssey" },
      {
        $set: {
          heroImage: chinaHeroImage,
          startDate: chinaStartDate,
          endDate: chinaEndDate,
          featured: true,
        },
      }
    );
    console.log("Updated China Odyssey trip image and dates");
  }

  const featuredTripHeroes = [
    {
      slug: "2027-china-odyssey",
      titlePattern: /china odyssey/i,
      heroImage: chinaHeroImage,
    },
    {
      slug: "cartagena-caribbean-coast",
      titlePattern: /cartagena/i,
      heroImage: {
        url: "/images/trip-cartagena.jpg",
        alt: "Colorful colonial street in Cartagena Old Town with bougainvillea and cobblestones",
      },
      create: {
        title: "Cartagena & Caribbean Coast",
        shortDescription: "Culture, rhythm, and Caribbean light in Colombia's jewel.",
        destination: "Cartagena, Colombia",
        cities: ["Cartagena"],
        startDate: new Date("2026-11-08T00:00:00.000Z"),
        endDate: new Date("2026-11-15T00:00:00.000Z"),
        durationDays: 8,
        priceFromCents: 289900,
      },
    },
    {
      slug: "tulum-riviera-maya",
      titlePattern: /tulum/i,
      heroImage: {
        url: "/images/trip-tulum.jpg",
        alt: "Turquoise Caribbean sea and white sand beach with Mayan ruins on the cliff at Tulum",
      },
      create: {
        title: "Tulum & Riviera Maya",
        shortDescription: "Turquoise water, white sand, and restorative beach-forward stays.",
        destination: "Tulum, Mexico",
        cities: ["Tulum", "Riviera Maya"],
        startDate: new Date("2027-01-18T00:00:00.000Z"),
        endDate: new Date("2027-01-25T00:00:00.000Z"),
        durationDays: 8,
        priceFromCents: 319900,
      },
    },
    {
      slug: "cape-town-winelands",
      titlePattern: /cape town|winelands/i,
      heroImage: {
        url: "/images/trip-cape-town.jpg",
        alt: "Cape Winelands vineyard rows at sunset with Table Mountain in the distance",
      },
      create: {
        title: "Cape Town & Winelands",
        shortDescription: "Table Mountain views, wine country, and coastal beauty.",
        destination: "Cape Town, South Africa",
        cities: ["Cape Town", "Stellenbosch", "Franschhoek"],
        startDate: new Date("2027-03-12T00:00:00.000Z"),
        endDate: new Date("2027-03-20T00:00:00.000Z"),
        durationDays: 9,
        priceFromCents: 349900,
      },
    },
  ];

  for (const tripSeed of featuredTripHeroes) {
    const existing =
      (await Trip.findOne({ slug: tripSeed.slug })) ??
      (await Trip.findOne({ title: tripSeed.titlePattern }));

    if (existing) {
      await Trip.updateOne(
        { _id: existing._id },
        {
          $set: {
            heroImage: tripSeed.heroImage,
            featured: true,
            status: existing.status === "draft" ? "coming_soon" : existing.status,
          },
        }
      );
      continue;
    }

    if ("create" in tripSeed && tripSeed.create) {
      await Trip.create({
        ...tripSeed.create,
        slug: tripSeed.slug,
        groupMin: 8,
        groupMax: 20,
        capacity: 20,
        reservedCount: 0,
        currency: "USD",
        depositCents: 0,
        payInFullDiscountPercent: 5,
        paymentPlanEnabled: false,
        status: "coming_soon",
        featured: true,
        isBookable: false,
        heroImage: tripSeed.heroImage,
        inclusions: ["Quality accommodations", "Curated excursions", "Group transportation"],
        exclusions: ["International flights", "Travel insurance", "Personal expenses"],
        roomOptions: [{ id: "shared", name: "Shared Room", description: "Twin occupancy", supplementCents: 0 }],
        excursions: [],
        itinerary: [],
        faqItems: [],
      });
    }
  }
  console.log("Synced featured trip hero images");

  const faqCount = await FAQ.countDocuments();
  if (faqCount === 0) {
    await FAQ.insertMany(
      PUBLISHED_FAQS.map((faq) => ({
        ...faq,
        published: true,
        isDraft: false,
      }))
    );
    console.log(`Created ${PUBLISHED_FAQS.length} published FAQs`);
  } else {
    for (const faq of PUBLISHED_FAQS) {
      await FAQ.findOneAndUpdate(
        { question: faq.question },
        {
          $set: {
            category: faq.category,
            answer: faq.answer,
            order: faq.order,
            published: true,
            isDraft: false,
          },
        },
        { upsert: true }
      );
    }
    await FAQ.updateMany(
      { published: false, isDraft: true },
      { $set: { published: true, isDraft: false } }
    );
    console.log(`Synced ${PUBLISHED_FAQS.length} published FAQs`);
  }

  const payInFullPromo = await PromoCode.findOne({ code: "PAYINFULL" });
  if (!payInFullPromo) {
    await PromoCode.create({
      code: "PAYINFULL",
      internalName: "Pay In Full 5% Discount",
      publicDescription: "Pay in full and receive 5% off your trip.",
      discountType: "percentage",
      discountValue: 5,
      active: true,
      publicDisplay: true,
      homepageBanner: true,
      stackable: false,
      perEmailLimit: 1,
      redemptionCount: 0,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2028-12-31"),
    });
    console.log("Created PAYINFULL promo (homepage banner)");
  } else {
    console.log("PAYINFULL promo already exists");
  }

  const founderCount = await Founder.countDocuments();
  if (founderCount === 0) {
    await Founder.insertMany([
      {
        name: undefined,
        title: "Founder",
        bio: "Biography pending — to be added through the admin portal.",
        welcomeNote: "A personal welcome note will appear here once founder content is provided.",
        image: { url: "/images/founder-placeholder.svg", alt: "Founder photograph pending — development placeholder" },
        order: 1,
        published: false,
        isPlaceholder: true,
      },
      {
        name: undefined,
        title: "Co-Founder",
        bio: "Biography pending — to be added through the admin portal.",
        welcomeNote: "A personal welcome note will appear here once founder content is provided.",
        image: { url: "/images/founder-placeholder.svg", alt: "Founder photograph pending — development placeholder" },
        order: 2,
        published: false,
        isPlaceholder: true,
      },
    ]);
    console.log("Created founder placeholders (no invented identities)");
  }

  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany([
      {
        name: "Danielle M.",
        location: "Atlanta, GA",
        tripTitle: "Group Travel Experience",
        content:
          "I showed up solo and left with sisters. Every detail felt intentional—from the hotel to the pace of the itinerary. For the first time on a group trip, I didn't have to explain who I am. I could just be.",
        rating: 5,
        approved: true,
        featured: true,
      },
      {
        name: "Keisha R.",
        location: "Houston, TX",
        tripTitle: "Luxury Cultural Journey",
        content:
          "SerenEScape nailed the balance between luxury and authenticity. The excursions were rich, the group was welcoming, and I always felt safe exploring boldly with women who get it.",
        rating: 5,
        approved: true,
        featured: true,
      },
      {
        name: "Aisha T.",
        location: "Oakland, CA",
        tripTitle: "Women's Group Escape",
        content:
          "The payment plan made it possible for me to commit without stress. The team communicated clearly, the community was incredible, and I came home already planning my next escape.",
        rating: 5,
        approved: true,
        featured: false,
      },
      {
        name: "Monique L.",
        location: "Chicago, IL",
        tripTitle: "Curated Group Trip",
        content:
          "From booking to boarding, everything felt personal and professional. I traveled with confidence, laughed until my cheeks hurt, and experienced a destination in a way I never would have alone.",
        rating: 5,
        approved: true,
        featured: false,
      },
      {
        name: "Jasmine W.",
        location: "Las Vegas, NV",
        tripTitle: "Community-Centered Travel",
        content:
          "Belong Everywhere isn't just a tagline here—it's how the trip actually feels. Thoughtful hosts, beautiful stays, and a room full of Black LGBTQIA+ women living out loud together.",
        rating: 5,
        approved: true,
        featured: false,
      },
    ]);
    console.log("Created demo testimonials (replace with approved traveler stories in admin)");
  } else {
    console.log("Testimonials already exist");
  }

  console.log("\nSeed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
