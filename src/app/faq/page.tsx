import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero, heroProps } from "@/components/shared/PageHero";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { getPublishedFAQs, getSiteSettings } from "@/lib/site/queries";
import { getPageContent, getPageSeo } from "@/lib/content/get";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo("faq");
}

export default async function FAQPage() {
  const [faqs, content, settings] = await Promise.all([
    getPublishedFAQs(),
    getPageContent("faq"),
    getSiteSettings(),
  ]);

  return (
    <>
      <PageHero {...heroProps(content.hero, "dark")} />

      <section className="bg-soft-ivory py-12 sm:py-16">
        <Container>
          <FAQAccordion faqs={faqs} />

          <div className="mt-12 rounded-2xl border border-muted-gold/20 bg-warm-sand/20 p-8 text-center">
            <p className="font-display text-xl text-deep-aubergine">{content.help.title}</p>
            <p className="mt-2 font-sans text-sm text-luxury-ink/70">
              {content.help.text}{" "}
              <a href={`mailto:${settings.email}`} className="text-rich-berry underline">
                {settings.email}
              </a>{" "}
              ·{" "}
              <Link href="/contact" className="text-rich-berry underline">
                Send us a message
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
