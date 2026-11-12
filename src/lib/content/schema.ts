/**
 * Editor schema: describes, for every page, which sections and fields the
 * admin can edit. The generic <ContentEditor /> renders forms from this.
 *
 * Data shape: data[sectionId][fieldKey]
 *  - text/textarea/url  -> string
 *  - image              -> { url, alt }
 *  - list               -> array of objects (fields) ; `strings: true` lists use { text }
 */

import type { ContentPageKey } from "@/lib/content/defaults";

export type FieldDef =
  | { key: string; label: string; type: "text" | "url"; help?: string }
  | { key: string; label: string; type: "textarea"; rows?: number; help?: string }
  | { key: string; label: string; type: "image"; help?: string }
  | { key: string; label: string; type: "list"; itemLabel: string; fields: FieldDef[]; help?: string };

export type SectionDef = {
  id: string;
  title: string;
  description?: string;
  fields: FieldDef[];
};

export type PageSchema = {
  key: ContentPageKey;
  title: string;
  description: string;
  /** Public URL, used for the "View page" link. */
  path: string;
  sections: SectionDef[];
};

const seo = (): SectionDef => ({
  id: "seo",
  title: "Search / browser title (SEO)",
  description: "Shown in Google results and the browser tab.",
  fields: [
    { key: "title", label: "Page title", type: "text" },
    { key: "description", label: "Meta description", type: "textarea", rows: 3 },
  ],
});

const pageHero = (opts: { withImageHelp?: string } = {}): SectionDef => ({
  id: "hero",
  title: "Page banner (top of page)",
  fields: [
    { key: "eyebrow", label: "Small heading above title", type: "text" },
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea", rows: 3 },
    { key: "watermark", label: "Watermark text", type: "text" },
    {
      key: "image",
      label: "Banner background image (optional)",
      type: "image",
      help: opts.withImageHelp ?? "Leave empty to use the plain colour banner.",
    },
  ],
});

const headingFields = (): FieldDef[] => [
  { key: "eyebrow", label: "Small heading", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "description", label: "Description", type: "textarea", rows: 3 },
];

export const CONTENT_SCHEMAS: PageSchema[] = [
  {
    key: "home",
    title: "Home page",
    description: "Every section of the homepage — text, buttons and pictures.",
    path: "/",
    sections: [
      seo(),
      {
        id: "hero",
        title: "1. Hero (top banner)",
        fields: [
          { key: "image", label: "Background picture", type: "image" },
          { key: "eyebrow", label: "Small line above headline", type: "text" },
          { key: "headlineLine1", label: "Headline - line 1", type: "text" },
          { key: "headlineLine2", label: "Headline - line 2 (highlighted)", type: "text" },
          { key: "supporting", label: "Supporting paragraph", type: "textarea", rows: 3 },
          { key: "primaryCtaLabel", label: "Main button text", type: "text" },
          { key: "primaryCtaHref", label: "Main button link", type: "url" },
          { key: "secondaryCtaLabel", label: "Second button text", type: "text" },
          { key: "secondaryCtaHref", label: "Second button link", type: "url" },
          { key: "featuredLabel", label: "Featured trip card label", type: "text" },
          {
            key: "pills",
            label: "Floating tags",
            type: "list",
            itemLabel: "Tag",
            fields: [{ key: "text", label: "Text", type: "text" }],
          },
          {
            key: "watermarks",
            label: "Watermark stamps",
            type: "list",
            itemLabel: "Stamp",
            fields: [{ key: "text", label: "Text", type: "text" }],
          },
        ],
      },
      {
        id: "belong",
        title: "2. Our Story / Belong Everywhere",
        fields: [
          ...headingFields(),
          {
            key: "paragraphs",
            label: "Paragraphs",
            type: "list",
            itemLabel: "Paragraph",
            fields: [{ key: "text", label: "Text", type: "textarea", rows: 4 }],
          },
          { key: "note", label: "Italic note at the bottom", type: "text" },
        ],
      },
      {
        id: "featured",
        title: "3. Featured trips heading",
        description: "Which trips appear here is controlled from Trips -> Featured.",
        fields: headingFields(),
      },
      {
        id: "why",
        title: "4. Why SerenEScape",
        fields: [
          ...headingFields(),
          {
            key: "items",
            label: "Cards",
            type: "list",
            itemLabel: "Card",
            fields: [
              { key: "title", label: "Title", type: "text" },
              { key: "description", label: "Description", type: "textarea", rows: 3 },
            ],
          },
        ],
      },
      {
        id: "experience",
        title: "5. The SerenEScape Experience",
        fields: [
          ...headingFields(),
          { key: "imageDesktop", label: "Picture (desktop)", type: "image" },
          { key: "imageMobile", label: "Picture (mobile)", type: "image" },
          {
            key: "items",
            label: "Highlights",
            type: "list",
            itemLabel: "Highlight",
            fields: [
              { key: "title", label: "Title", type: "text" },
              { key: "description", label: "Description", type: "textarea", rows: 2 },
            ],
          },
        ],
      },
      {
        id: "destinations",
        title: "6. Destination story",
        fields: [
          ...headingFields(),
          {
            key: "items",
            label: "Destinations",
            type: "list",
            itemLabel: "Destination",
            fields: [
              { key: "image", label: "Picture", type: "image" },
              { key: "city", label: "City / title", type: "text" },
              { key: "region", label: "Region", type: "text" },
              { key: "theme", label: "Theme tag", type: "text" },
              { key: "copy", label: "Description", type: "textarea", rows: 4 },
            ],
          },
        ],
      },
      {
        id: "how",
        title: "7. How it works",
        fields: [
          ...headingFields(),
          {
            key: "steps",
            label: "Steps",
            type: "list",
            itemLabel: "Step",
            fields: [
              { key: "title", label: "Title", type: "text" },
              { key: "description", label: "Description", type: "textarea", rows: 2 },
            ],
          },
        ],
      },
      {
        id: "founders",
        title: "8. Founders heading",
        description: "Founder profiles themselves are managed in Founders.",
        fields: [...headingFields(), { key: "emptyNote", label: "Text when no founders are published", type: "textarea", rows: 2 }],
      },
      {
        id: "testimonials",
        title: "9. Testimonials heading",
        description: "Testimonials themselves are managed in Testimonials.",
        fields: [
          { key: "eyebrow", label: "Small heading", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "emptyTitle", label: "Text when no testimonials", type: "text" },
          { key: "emptyText", label: "Sub-text when no testimonials", type: "text" },
        ],
      },
      {
        id: "payment",
        title: "10. Payment flexibility",
        fields: [
          ...headingFields(),
          {
            key: "items",
            label: "Payment features",
            type: "list",
            itemLabel: "Feature",
            fields: [
              { key: "title", label: "Title", type: "text" },
              { key: "description", label: "Description", type: "textarea", rows: 2 },
            ],
          },
          { key: "disclaimer", label: "Small print", type: "textarea", rows: 2 },
        ],
      },
      {
        id: "faq",
        title: "11. FAQ preview heading",
        description: "Questions themselves are managed in FAQs.",
        fields: [
          ...headingFields(),
          { key: "buttonLabel", label: "Button text", type: "text" },
          { key: "emptyText", label: "Text when no FAQs", type: "text" },
        ],
      },
      {
        id: "cta",
        title: "12. Final call-to-action",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "text", label: "Text", type: "textarea", rows: 2 },
          { key: "primaryLabel", label: "Main button text", type: "text" },
          { key: "primaryHref", label: "Main button link", type: "url" },
          { key: "secondaryLabel", label: "Second button text", type: "text" },
          { key: "secondaryHref", label: "Second button link", type: "url" },
        ],
      },
    ],
  },
  {
    key: "about",
    title: "About page",
    description: "Founder story, what we stand for, page banner.",
    path: "/about",
    sections: [
      seo(),
      pageHero(),
      {
        id: "story",
        title: "Founder story",
        fields: [
          ...headingFields(),
          {
            key: "paragraphs",
            label: "Paragraphs",
            type: "list",
            itemLabel: "Paragraph",
            fields: [{ key: "text", label: "Text", type: "textarea", rows: 4 }],
          },
          { key: "quote", label: "Highlighted closing line", type: "textarea", rows: 2 },
        ],
      },
      {
        id: "founders",
        title: "Founders heading",
        description: "Founder profiles themselves are managed in Founders.",
        fields: [...headingFields(), { key: "emptyNote", label: "Text when no founders are published", type: "textarea", rows: 2 }],
      },
      {
        id: "pillars",
        title: "What we stand for",
        fields: [
          { key: "eyebrow", label: "Small heading", type: "text" },
          { key: "title", label: "Title", type: "text" },
          {
            key: "items",
            label: "Pillars",
            type: "list",
            itemLabel: "Pillar",
            fields: [
              { key: "title", label: "Title", type: "text" },
              { key: "description", label: "Description", type: "textarea", rows: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "services",
    title: "Services page",
    description: "Service cards and the custom-group section.",
    path: "/services",
    sections: [
      seo(),
      pageHero(),
      {
        id: "list",
        title: "Services",
        fields: [
          {
            key: "items",
            label: "Service cards",
            type: "list",
            itemLabel: "Service",
            fields: [
              { key: "title", label: "Title", type: "text" },
              { key: "description", label: "Description", type: "textarea", rows: 4 },
              {
                key: "highlights",
                label: "Bullet points",
                type: "list",
                itemLabel: "Bullet",
                fields: [{ key: "text", label: "Text", type: "text" }],
              },
            ],
          },
        ],
      },
      { id: "custom", title: "Custom group section", fields: headingFields() },
    ],
  },
  {
    key: "contact",
    title: "Contact page",
    description: "Banner and intro text. Email, phone and social link are in Settings.",
    path: "/contact",
    sections: [
      seo(),
      pageHero(),
      {
        id: "info",
        title: "Contact information block",
        fields: [
          { key: "title", label: "Heading", type: "text" },
          { key: "text", label: "Text", type: "textarea", rows: 3 },
          { key: "formTitle", label: "Form heading", type: "text" },
        ],
      },
    ],
  },
  {
    key: "faq",
    title: "FAQ page",
    description: "Banner and help box. Questions are managed in FAQs.",
    path: "/faq",
    sections: [
      seo(),
      pageHero(),
      {
        id: "help",
        title: "'Still have questions?' box",
        fields: [
          { key: "title", label: "Heading", type: "text" },
          { key: "text", label: "Text", type: "textarea", rows: 2 },
        ],
      },
    ],
  },
  {
    key: "testimonials",
    title: "Testimonials page",
    description: "Banner and closing line. Stories are managed in Testimonials.",
    path: "/testimonials",
    sections: [
      seo(),
      pageHero(),
      {
        id: "cta",
        title: "Closing line",
        fields: [
          { key: "text", label: "Text before link", type: "text" },
          { key: "linkLabel", label: "Link text", type: "text" },
          { key: "after", label: "Text after link", type: "text" },
        ],
      },
    ],
  },
  {
    key: "trips",
    title: "Trips listing page",
    description: "Banner of the /trips page. Individual trips are managed in Trips.",
    path: "/trips",
    sections: [seo(), pageHero()],
  },
  {
    key: "global",
    title: "Footer & site-wide text",
    description: "Footer wording and the promotion banner label.",
    path: "/",
    sections: [
      {
        id: "footer",
        title: "Footer",
        fields: [
          { key: "description", label: "Footer description", type: "textarea", rows: 3 },
          { key: "quickLinksTitle", label: "Quick links heading", type: "text" },
          { key: "contactTitle", label: "Contact heading", type: "text" },
          { key: "policiesTitle", label: "Policies heading", type: "text" },
          { key: "newsletterTitle", label: "Newsletter heading", type: "text" },
          { key: "newsletterText", label: "Newsletter text", type: "textarea", rows: 2 },
          { key: "newsletterSuccess", label: "Newsletter success message", type: "text" },
          { key: "builtFor", label: "Bottom line", type: "text" },
          { key: "paymentNote", label: "Payment providers line", type: "text" },
        ],
      },
      {
        id: "promoBanner",
        title: "Promotion banner (top of homepage)",
        description: "Promotions themselves are managed in Promo Codes.",
        fields: [
          { key: "label", label: "Badge text", type: "text" },
          { key: "linkLabel", label: "Link text", type: "text" },
        ],
      },
    ],
  },
];

export function getPageSchema(key: string): PageSchema | undefined {
  return CONTENT_SCHEMAS.find((s) => s.key === key);
}
