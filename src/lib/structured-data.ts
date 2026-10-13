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
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Plans",
    itemListElement: content.pricing.plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      description: plan.audience,
      // Enterprise is quote-only, so it carries no priceSpecification.
      ...(plan.id === "startup"
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: 100,
              priceCurrency: "USD",
              unitCode: "MON",
              description: "$999 one-time setup, then $100 per month",
            },
          }
        : {}),
      ...(plan.id === "growing"
        ? {
            priceSpecification: {
              // Quoted as a ceiling rather than a flat rate, so the
              // schema states a maximum instead of a fixed price.
              "@type": "UnitPriceSpecification",
              maxPrice: 5000,
              priceCurrency: "USD",
              unitCode: "MON",
              description: "Up to $5,000 per month",
            },
          }
        : {}),
      itemOffered: {
        "@type": "Service",
        name: plan.name,
        description: plan.features.join(". "),
      },
    })),
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
