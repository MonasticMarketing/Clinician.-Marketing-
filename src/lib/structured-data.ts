import { content } from "@/content/content";
import { siteUrl } from "@/lib/site";

/**
 * JSON-LD emitted once in the document head.
 * Kept in sync with content.ts so copy edits do not desync the schema.
 */

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: content.brand.name,
  url: siteUrl,
  description: content.meta.description,
  slogan: content.hero.headline,
  email: content.brand.email,
  parentOrganization: {
    "@type": "Organization",
    name: "Monastic Marketing LLC",
  },
  knowsAbout: [...content.meta.keywords],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: content.brand.email,
      availableLanguage: ["English"],
    },
  ],
};

export const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${siteUrl}/#service`,
  name: "Behavioral health marketing and business consulting",
  serviceType: "Behavioral health marketing",
  description:
    "Marketing and business consulting for therapists, psychiatrists, PMHNPs, psychologists, group practices, IOP and PHP programs, and residential treatment centers.",
  provider: { "@id": `${siteUrl}/#organization` },
  areaServed: { "@type": "Country", name: "United States" },
  audience: content.whoWeServe.cards.map((card) => ({
    "@type": "Audience",
    audienceType: card.title,
  })),
  // One productized offer: a one-time setup fee plus a monthly retainer,
  // so the Offer carries both as separate price components rather than a
  // catalog of plans.
  offers: {
    "@type": "Offer",
    name: "Done-for-you behavioral health marketing",
    description:
      "Website, text and email campaigns, local SEO, Google or Meta ads, and Psychology Today optimization, built and run for you.",
    priceCurrency: "USD",
    priceSpecification: [
      {
        "@type": "UnitPriceSpecification",
        price: 1500,
        priceCurrency: "USD",
        priceType: "https://schema.org/InvoicePrice",
        description: "One-time setup",
      },
      {
        "@type": "UnitPriceSpecification",
        price: 700,
        priceCurrency: "USD",
        unitCode: "MON",
        description: "Ongoing monthly retainer",
      },
    ],
    // Media budget is paid to the ad platforms, not to us.
    itemOffered: {
      "@type": "Service",
      name: "Done-for-you behavioral health marketing",
      description: content.services.items
        .map((item) => item.title)
        .join(". "),
    },
  },
};

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: content.faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};
