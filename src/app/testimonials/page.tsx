import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/shared/PageHero";
import { IMAGES } from "@/config/images";
import { TestimonialsSection } from "@/components/public/home/TestimonialsSection";
import { getApprovedTestimonials } from "@/lib/site/queries";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Real stories from Black LGBTQIA+ women who traveled with SerenEScape. Hear from our community.",
};

export default async function TestimonialsPage() {
  const testimonials = await getApprovedTestimonials();

  return (
    <>
      <PageHero
        variant="image"
        imageSrc={IMAGES.pageHeroTestimonials.src}
        imageAlt={IMAGES.pageHeroTestimonials.alt}
        eyebrow="Community Voices"
        title="Stories From the Journey"
        description="Real experiences from travelers who chose belonging over compromise."
        watermark="Real Stories"
      />
      <TestimonialsSection testimonials={testimonials} />
      <section className="bg-soft-ivory pb-20">
        <Container>
          <p className="text-center font-sans text-sm text-luxury-ink/60">
            Want to share your story?{" "}
            <a href="/contact" className="text-rich-berry underline hover:text-deep-aubergine">
              Get in touch
            </a>{" "}
            after your journey.
          </p>
        </Container>
      </section>
    </>
  );
}
