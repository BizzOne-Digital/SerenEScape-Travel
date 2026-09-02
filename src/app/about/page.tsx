import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { FoundersSection } from "@/components/public/home/FoundersSection";
import { getPublishedFounders } from "@/lib/site/queries";
import { Shield, Heart, Users, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About the Experience",
  description:
    "Belong Everywhere. Learn about SerenEScape Travel's mission, founders, and commitment to safe, inclusive luxury travel for Black LGBTQIA+ women.",
};

const pillars = [
  {
    icon: Heart,
    title: "Representation Matters",
    description:
      "Every journey is designed with Black LGBTQIA+ women at the center—not as an afterthought. Our itineraries, accommodations, and experiences reflect who we are.",
  },
  {
    icon: Shield,
    title: "Safety First, Always",
    description:
      "We vet every destination, partner, and experience through a lens of cultural awareness and queer safety. Travel with confidence knowing your wellbeing is our priority.",
  },
  {
    icon: Users,
    title: "Community Philosophy",
    description:
      "Come for the destination, stay for the community. Our groups are intentionally small, curated, and designed to foster genuine connection and queer joy.",
  },
  {
    icon: Sparkles,
    title: "Luxury Without Compromise",
    description:
      "Premium accommodations, curated experiences, and white-glove service—without asking you to leave any part of yourself at home.",
  },
];

export default async function AboutPage() {
  const founders = await getPublishedFounders();

  return (
    <>
      <PageHero
        variant="dark"
        eyebrow="Our Story"
        title="Belong Everywhere."
        description="Founded by two Black LGBTQIA+ women who believe travel should be a celebration of who we are—not a compromise."
        watermark="Built for Belonging"
      />

      <section className="bg-soft-ivory py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Founder Story"
              title="Built by Women Who Get It"
              description="SerenEScape Travel was born from a simple truth: the travel industry wasn't built for us. So we built something better."
            />
            <div className="space-y-5 font-sans text-base leading-relaxed text-luxury-ink/85">
              <p>
                After years of navigating travel spaces that demanded we shrink ourselves—code-switching,
                explaining our relationships, wondering if we&apos;d be safe—we decided to create the journeys
                we wished existed.
              </p>
              <p>
                SerenEScape Travel creates spaces where Black women and LGBTQIA+ travelers can explore the
                world on our terms. You get the freedom to explore independently while being held by a
                community where your full self is celebrated.
              </p>
              <p className="font-display text-lg italic text-deep-aubergine/80">
                No explanations needed. No shrinking. Just authentic adventure, queer joy, and genuine belonging.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-warm-sand/20 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="What We Stand For"
            title="More Than a Trip"
            align="center"
            className="mb-14"
          />
          <div className="grid gap-8 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-muted-gold/20 bg-soft-ivory p-8"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-deep-aubergine/5 text-rich-berry">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl text-deep-aubergine">{pillar.title}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-luxury-ink/75">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <FoundersSection founders={founders} />
    </>
  );
}
