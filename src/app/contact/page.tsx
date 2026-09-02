import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { BRAND } from "@/config/brand";
import { Mail, Phone, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with SerenEScape Travel. We're here to help with bookings, questions, and custom group inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        variant="light"
        eyebrow="Get in Touch"
        title="We'd Love to Hear From You"
        description="Questions about a trip, booking support, or a custom group journey? Reach out—we're here for you."
        watermark="Let's Connect"
      />

      <section className="bg-soft-ivory py-12 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl text-deep-aubergine">Contact Information</h2>
              <p className="mt-3 font-sans text-sm leading-relaxed text-luxury-ink/75">
                We typically respond within 1–2 business days. For urgent booking matters,
                please include your booking reference.
              </p>

              <ul className="mt-8 space-y-5">
                <li>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="flex min-w-0 items-center gap-3 break-all font-sans text-sm text-luxury-ink/80 hover:text-rich-berry sm:break-normal"
                  >
                    <Mail className="h-5 w-5 text-muted-gold" />
                    {BRAND.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${BRAND.phone.replace(/-/g, "")}`}
                    className="flex items-center gap-3 font-sans text-sm text-luxury-ink/80 hover:text-rich-berry"
                  >
                    <Phone className="h-5 w-5 text-muted-gold" />
                    {BRAND.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={BRAND.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 font-sans text-sm text-luxury-ink/80 hover:text-rich-berry"
                  >
                    <Globe className="h-5 w-5 text-muted-gold" />
                    {BRAND.facebook}
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-muted-gold/20 bg-warm-sand/10 p-6 sm:p-8">
                <h2 className="mb-6 font-display text-2xl text-deep-aubergine">Send a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
