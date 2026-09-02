import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Trip, Testimonial, Founder, FAQ } from "@/lib/models";
import type { TripCardData } from "@/components/trips/TripCard";
import type { FounderData } from "@/components/public/home/FoundersSection";
import type { TestimonialData } from "@/components/public/home/TestimonialsSection";
import type { FAQData } from "@/components/public/home/FAQPreview";
import { HeroSection, type HeroFeaturedTrip } from "@/components/public/home/HeroSection";
import { BelongSection } from "@/components/public/home/BelongSection";
import { FeaturedTrips } from "@/components/public/home/FeaturedTrips";
import { WhyDifferent } from "@/components/public/home/WhyDifferent";
import { ExperienceSection } from "@/components/public/home/ExperienceSection";
import { DestinationStory } from "@/components/public/home/DestinationStory";
import { HowItWorks } from "@/components/public/home/HowItWorks";
import { FoundersSection } from "@/components/public/home/FoundersSection";
import { TestimonialsSection } from "@/components/public/home/TestimonialsSection";
import { PaymentFlexibility } from "@/components/public/home/PaymentFlexibility";
import { FAQPreview } from "@/components/public/home/FAQPreview";
import { FinalCTA } from "@/components/public/home/FinalCTA";

interface HomePageData {
  trips: TripCardData[];
  testimonials: TestimonialData[];
  founders: FounderData[];
  faqs: FAQData[];
}

async function getHomePageData(): Promise<HomePageData> {
  const empty: HomePageData = {
    trips: [],
    testimonials: [],
    founders: [],
    faqs: [],
  };

  if (!isDBConfigured()) {
    return empty;
  }

  try {
    await connectDB();

    const [tripDocs, testimonialDocs, founderDocs, faqDocs] = await Promise.all([
      Trip.find({
        featured: true,
        status: { $ne: "draft" },
      })
        .sort({ startDate: 1 })
        .limit(6)
        .lean(),
      Testimonial.find({ approved: true })
        .sort({ featured: -1, createdAt: -1 })
        .limit(8)
        .lean(),
      Founder.find({ published: true }).sort({ order: 1 }).lean(),
      FAQ.find({ published: true, isDraft: false })
        .sort({ order: 1 })
        .limit(8)
        .lean(),
    ]);

    const trips: TripCardData[] = tripDocs.map((trip) => ({
      slug: trip.slug,
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate?.toISOString() ?? null,
      endDate: trip.endDate?.toISOString() ?? null,
      durationDays: trip.durationDays,
      groupMin: trip.groupMin,
      groupMax: trip.groupMax,
      capacity: trip.capacity,
      reservedCount: trip.reservedCount,
      priceFromCents: trip.priceFromCents,
      salePriceCents: trip.salePriceCents ?? null,
      currency: trip.currency,
      depositCents: trip.depositCents,
      paymentPlanEnabled: trip.paymentPlanEnabled,
      status: trip.status,
      heroImage: trip.heroImage ?? null,
      shortDescription: trip.shortDescription ?? null,
    }));

    const testimonials: TestimonialData[] = testimonialDocs.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      location: item.location,
      tripTitle: item.tripTitle,
      content: item.content,
      rating: item.rating,
    }));

    const founders: FounderData[] = founderDocs.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      title: item.title,
      bio: item.bio,
      welcomeNote: item.welcomeNote,
      image: item.image,
      order: item.order,
      isPlaceholder: item.isPlaceholder,
    }));

    const faqs: FAQData[] = faqDocs.map((item) => ({
      _id: item._id.toString(),
      category: item.category,
      question: item.question,
      answer: item.answer,
      order: item.order,
    }));

    return { trips, testimonials, founders, faqs };
  } catch {
    return empty;
  }
}

export default async function HomePage() {
  const { trips, testimonials, founders, faqs } = await getHomePageData();

  const heroTrip: HeroFeaturedTrip | null = trips[0]
    ? {
        slug: trips[0].slug,
        title: trips[0].title,
        durationDays: trips[0].durationDays,
        groupMin: trips[0].groupMin,
        groupMax: trips[0].groupMax,
        priceFromCents: trips[0].salePriceCents ?? trips[0].priceFromCents,
        currency: trips[0].currency,
      }
    : null;

  return (
    <>
      <HeroSection featuredTrip={heroTrip} />
      <BelongSection />
      <FeaturedTrips trips={trips} />
      <WhyDifferent />
      <ExperienceSection />
      <DestinationStory />
      <HowItWorks />
      <FoundersSection founders={founders} />
      <TestimonialsSection testimonials={testimonials} />
      <PaymentFlexibility />
      <FAQPreview faqs={faqs} />
      <FinalCTA />
    </>
  );
}
