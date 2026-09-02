import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/shared/PageHero";
import { cn } from "@/lib/utils";

interface LegalPageLayoutProps {
  title: string;
  content?: string;
  draftContent: string;
  isDraft?: boolean;
}

export function LegalPageLayout({
  title,
  content,
  draftContent,
  isDraft = !content,
}: LegalPageLayoutProps) {
  const displayContent = content || draftContent;

  return (
    <>
      <PageHero
        variant="light"
        title={title}
        compact
        watermark="SerenEScape Travel"
      />

      <section className="bg-soft-ivory py-12 sm:py-16">
        <Container>
          <article className="prose prose-lg mx-auto max-w-3xl">
            {isDraft && (
              <div
                className="mb-8 rounded-xl border border-burnt-orange/30 bg-burnt-orange/10 px-5 py-4 font-sans text-sm text-burnt-orange"
                role="note"
              >
                <strong>Draft:</strong> This content is a placeholder until finalized by SerenEScape
                Travel. Please contact us with any questions.
              </div>
            )}
            <div
              className={cn(
                "space-y-4 font-sans text-base leading-relaxed text-luxury-ink/85",
                isDraft && "opacity-90"
              )}
            >
              {displayContent.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </article>
        </Container>
      </section>
    </>
  );
}
