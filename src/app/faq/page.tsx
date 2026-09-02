import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/shared/PageHero";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { getPublishedFAQs } from "@/lib/site/queries";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about SerenEScape Travel bookings, payments, safety, and group travel.",
};

export default async function FAQPage() {
  const faqs = await getPublishedFAQs();

  return (
    <>
      <PageHero
        variant="dark"
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        description="Everything you need to know before booking your escape."
        watermark="Travel Confidently"
      />

      <section className="bg-soft-ivory py-12 sm:py-16">
        <Container>
          <FAQAccordion faqs={faqs} />

          <div className="mt-12 rounded-2xl border border-muted-gold/20 bg-warm-sand/20 p-8 text-center">
            <p className="font-display text-xl text-deep-aubergine">Still have questions?</p>
            <p className="mt-2 font-sans text-sm text-luxury-ink/70">
              Our team is here to help. Reach out at{" "}
              <a href={`mailto:${BRAND.email}`} className="text-rich-berry underline">
                {BRAND.email}
              </a>{" "}
              or{" "}
              <Link href="/contact" className="text-rich-berry underline">
                send us a message
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
