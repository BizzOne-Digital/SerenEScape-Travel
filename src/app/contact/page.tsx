import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero, heroProps } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { getPageContent, getPageSeo } from "@/lib/content/get";
import { getSiteSettings } from "@/lib/site/queries";
import { Mail, Phone, Globe } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo("contact");
}

export default async function ContactPage() {
  const [content, settings] = await Promise.all([getPageContent("contact"), getSiteSettings()]);

  return (
    <>
      <PageHero {...heroProps(content.hero, "light")} />

      <section className="bg-soft-ivory py-12 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl text-deep-aubergine">{content.info.title}</h2>
              <p className="mt-3 font-sans text-sm leading-relaxed text-luxury-ink/75">{content.info.text}</p>

              <ul className="mt-8 space-y-5">
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex min-w-0 items-center gap-3 break-all font-sans text-sm text-luxury-ink/80 hover:text-rich-berry sm:break-normal"
                  >
                    <Mail className="h-5 w-5 text-muted-gold" />
                    {settings.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                    className="flex items-center gap-3 font-sans text-sm text-luxury-ink/80 hover:text-rich-berry"
                  >
                    <Phone className="h-5 w-5 text-muted-gold" />
                    {settings.phone}
                  </a>
                </li>
                {settings.facebookUrl && (
                  <li>
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 font-sans text-sm text-luxury-ink/80 hover:text-rich-berry"
                    >
                      <Globe className="h-5 w-5 text-muted-gold" />
                      {settings.facebookLabel}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-muted-gold/20 bg-warm-sand/10 p-6 sm:p-8">
                <h2 className="mb-6 font-display text-2xl text-deep-aubergine">{content.info.formTitle}</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
