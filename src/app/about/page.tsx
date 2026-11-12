import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero, heroProps } from "@/components/shared/PageHero";
import { FoundersSection } from "@/components/public/home/FoundersSection";
import { getPublishedFounders } from "@/lib/site/queries";
import { getPageContent, getPageSeo } from "@/lib/content/get";
import { Shield, Heart, Users, Sparkles } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo("about");
}

const PILLAR_ICONS = [Heart, Shield, Users, Sparkles];

export default async function AboutPage() {
  const [founders, content] = await Promise.all([getPublishedFounders(), getPageContent("about")]);

  return (
    <>
      <PageHero {...heroProps(content.hero, "dark")} />

      <section className="bg-soft-ivory py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow={content.story.eyebrow}
              title={content.story.title}
              description={content.story.description}
            />
            <div className="space-y-5 font-sans text-base leading-relaxed text-luxury-ink/85">
              {content.story.paragraphs.map((p, i) => (
                <p key={i}>{p.text}</p>
              ))}
              {content.story.quote && (
                <p className="font-display text-lg italic text-deep-aubergine/80">{content.story.quote}</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-warm-sand/20 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow={content.pillars.eyebrow}
            title={content.pillars.title}
            align="center"
            className="mb-14"
          />
          <div className="grid gap-8 sm:grid-cols-2">
            {content.pillars.items.map((pillar, index) => {
              const Icon = PILLAR_ICONS[index % PILLAR_ICONS.length];
              return (
                <article
                  key={`${pillar.title}-${index}`}
                  className="rounded-2xl border border-muted-gold/20 bg-soft-ivory p-8"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-deep-aubergine/5 text-rich-berry">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl text-deep-aubergine">{pillar.title}</h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-luxury-ink/75">
                    {pillar.description}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <FoundersSection founders={founders} content={content.founders} />
    </>
  );
}
