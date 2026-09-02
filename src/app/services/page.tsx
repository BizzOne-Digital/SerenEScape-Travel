import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { CustomGroupForm } from "@/components/services/CustomGroupForm";
import { Compass, Users, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Curated group journeys, custom group travel planning, and concierge services for Black LGBTQIA+ women and allies.",
};

const services = [
  {
    icon: Compass,
    title: "Curated Group Journeys",
    description:
      "Join one of our signature small-group trips—expertly designed itineraries with premium accommodations, cultural immersion, and a built-in community of sisters who get it.",
    highlights: ["8–20 travelers per group", "All-inclusive pricing options", "Payment plans available"],
  },
  {
    icon: Users,
    title: "Custom Group Travel",
    description:
      "Planning a milestone celebration, corporate retreat, or friends' getaway? We'll design a bespoke journey tailored to your group's interests, budget, and accessibility needs.",
    highlights: ["Personalized itineraries", "Flexible group sizes", "Dedicated trip coordinator"],
  },
  {
    icon: Sparkles,
    title: "Travel Concierge",
    description:
      "Already booked? Our concierge team supports you from pre-departure through your return—visa guidance, packing tips, dietary accommodations, and on-trip support.",
    highlights: ["Pre-trip preparation", "On-trip assistance", "Post-trip community"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        variant="dark"
        eyebrow="What We Offer"
        title="Travel, Your Way"
        description="From signature group journeys to fully custom experiences—we meet you where you are."
        watermark="Curated For You"
      />

      <section className="bg-soft-ivory py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="flex flex-col rounded-2xl border border-muted-gold/20 bg-warm-sand/10 p-8"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-rich-berry/10 text-rich-berry">
                  <service.icon className="h-6 w-6" />
                </div>
                <h2 className="font-display text-2xl text-deep-aubergine">{service.title}</h2>
                <p className="mt-4 flex-1 font-sans text-sm leading-relaxed text-luxury-ink/75">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-2 border-t border-warm-sand pt-6">
                  {service.highlights.map((item) => (
                    <li key={item} className="font-sans text-sm text-luxury-ink/70">
                      · {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-warm-sand/20 py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <SectionHeading
              eyebrow="Custom Groups"
              title="Plan Your Group Escape"
              description="Tell us about your vision and we'll craft a journey that's uniquely yours. Perfect for celebrations, reunions, and organizational retreats."
            />
            <div className="rounded-2xl border border-muted-gold/20 bg-soft-ivory p-6 sm:p-8">
              <CustomGroupForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
