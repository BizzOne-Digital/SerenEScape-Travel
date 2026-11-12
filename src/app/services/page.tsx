import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero, heroProps } from "@/components/shared/PageHero";
import { CustomGroupForm } from "@/components/services/CustomGroupForm";
import { getPageContent, getPageSeo } from "@/lib/content/get";
import { Compass, Users, Sparkles } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo("services");
}

const SERVICE_ICONS = [Compass, Users, Sparkles];

export default async function ServicesPage() {
  const content = await getPageContent("services");

  return (
    <>
      <PageHero {...heroProps(content.hero, "dark")} />

      <section className="bg-soft-ivory py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            {content.list.items.map((service, index) => {
              const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
              return (
                <article
                  key={`${service.title}-${index}`}
                  className="flex flex-col rounded-2xl border border-muted-gold/20 bg-warm-sand/10 p-8"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-rich-berry/10 text-rich-berry">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="font-display text-2xl text-deep-aubergine">{service.title}</h2>
                  <p className="mt-4 flex-1 font-sans text-sm leading-relaxed text-luxury-ink/75">
                    {service.description}
                  </p>
                  {service.highlights.length > 0 && (
                    <ul className="mt-6 space-y-2 border-t border-warm-sand pt-6">
                      {service.highlights.map((item, i) => (
                        <li key={i} className="font-sans text-sm text-luxury-ink/70">
                          · {item.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-warm-sand/20 py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <SectionHeading
              eyebrow={content.custom.eyebrow}
              title={content.custom.title}
              description={content.custom.description}
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
