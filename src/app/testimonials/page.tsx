import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero, heroProps } from "@/components/shared/PageHero";
import { TestimonialsSection } from "@/components/public/home/TestimonialsSection";
import { getApprovedTestimonials } from "@/lib/site/queries";
import { getPageContent, getPageSeo } from "@/lib/content/get";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo("testimonials");
}

export default async function TestimonialsPage() {
  const [testimonials, content, home] = await Promise.all([
    getApprovedTestimonials(),
    getPageContent("testimonials"),
    getPageContent("home"),
  ]);

  return (
    <>
      <PageHero {...heroProps(content.hero, "dark")} />
      <TestimonialsSection testimonials={testimonials} content={home.testimonials} />
      <section className="bg-soft-ivory pb-20">
        <Container>
          <p className="text-center font-sans text-sm text-luxury-ink/60">
            {content.cta.text}{" "}
            <a href="/contact" className="text-rich-berry underline hover:text-deep-aubergine">
              {content.cta.linkLabel}
            </a>{" "}
            {content.cta.after}
          </p>
        </Container>
      </section>
    </>
  );
}
