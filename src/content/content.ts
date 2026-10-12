/**
 * Every word on the site lives here.
 *
 * Edit this file to change copy — no component needs to be touched. Items
 * marked REVIEW in DECISIONS.md are drafts awaiting sign-off (guarantee
 * terms, the Plan 3 price, the founders' story, contact details).
 */

export type NavItem = { label: string; href: string };

export type Plan = {
  id: string;
  name: string;
  audience: string;
  features: string[];
  price: string;
  priceNote?: string;
  cta: string;
  featured?: boolean;
};

export const content = {
  brand: {
    name: "Clinician Marketing",
    /** Shown in the footer small print, and nowhere else on the site. */
    parentCompanyLine: "Clinician Marketing is a Monastic Marketing LLC company.",
    email: "Team@bemonastic.com",
    phone: "(972) 366-4899",
    /** Digits only, for the tel: link. */
    phoneHref: "+19723664899",
    tagline: "Behavioral health marketing and business consulting",
  },

  /**
   * Scheduling provider embed (Calendly, SavvyCal, HubSpot, Cal.com …).
   * Paste the provider's embed URL here and the booking iframe replaces
   * the placeholder in the contact section automatically. Leave it empty
   * to keep showing the placeholder.
   */
  scheduler: {
    embedUrl: "https://link.bemonastic.com/widget/booking/dVVauiWwgIOGGnY719c2",
    title: "Book a call with Clinician Marketing",
  },

  meta: {
    title:
      "Clinician Marketing — Behavioral Health Marketing Built by Practice Owners",
    description:
      "Behavioral health marketing and business consulting from operators who have owned therapy practices and treatment centers. Therapist marketing, psychiatry practice marketing, IOP and PHP marketing, SEO and ads with guarantees.",
    keywords: [
      "behavioral health marketing",
      "therapist marketing",
      "psychiatry practice marketing",
      "IOP marketing",
      "PHP marketing",
      "treatment center marketing",
      "Psychology Today optimization",
      "practice consulting for therapists",
      "mental health practice growth",
      "PMHNP marketing",
    ],
    ogAlt:
      "Clinician Marketing — behavioral health marketing built by practice owners, shown as a glowing point-cloud brain on deep navy",
  },

  nav: {
    items: [
      { label: "Services", href: "#services" },
      { label: "Who We Serve", href: "#who-we-serve" },
      { label: "Pricing", href: "#pricing" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ] satisfies NavItem[],
    cta: { label: "Let's chat", href: "#contact" },
  },

  hero: {
    eyebrow: "Behavioral health marketing and business consulting",
    headline:
      "We’ve owned, run and scaled practices and treatment centers, and now we help yours grow.",
    subhead:
      "Clinician Marketing is behavioral health marketing and business consulting from operators who have owned therapy practices and licensed treatment facilities. Not a generalist agency learning your field on your budget.",
    primaryCta: { label: "Let's chat", href: "#contact" },
    secondaryCta: { label: "See Plans", href: "#pricing" },
    /** Monospace labels floating near the point cloud. Keep to three or four. */
    telemetry: [
      { value: "4.25x", label: "ad spend return guarantee" },
      { value: "Page 1", label: "Google ranking guarantee" },
      { value: "Operator-led", label: "built by practice owners" },
      { value: "Done for you", label: "build, launch and manage" },
    ],
  },

  credibility: {
    heading: "Why practice owners work with us",
    items: [
      {
        title: "We have owned the practices",
        body: "Our founders have built, staffed and run outpatient therapy practices. Not consulted on them. Run them.",
      },
      {
        title: "We have owned the facilities",
        body: "Licensed treatment center operations, from census and admissions through staffing, surveys and payer mix.",
      },
      {
        title: "Guarantees, in writing",
        body: "A 4.25x return on ad spend on paid campaigns, or page-one Google ranking on the keywords we agree together.",
      },
      {
        title: "Done for you, end to end",
        body: "Website, CRM, tracking, automations and campaigns are built, launched and maintained by us. No homework queue.",
      },
    ],
  },

  whoWeServe: {
    id: "who-we-serve",
    eyebrow: "Who we serve",
    heading: "One field. Four very different growth problems.",
    intro:
      "A solo therapist filling a caseload and a residential program protecting census are not running the same business. The offering changes accordingly.",
    cards: [
      {
        title: "Therapists & Psychologists",
        body: "Fill a caseload with clients who fit your specialty and stay. Psychology Today optimization, a website that converts on mobile, and intake handling that stops eating your evenings.",
      },
      {
        title: "Psychiatrists & PMHNPs",
        body: "Prescriber demand behaves differently from therapy demand. We build around how patients actually search for med management and specialty panels, and we sell single services when that is all you need.",
      },
      {
        title: "Group Practices & IOP/PHP Programs",
        body: "Referral-grade visibility plus the operations to absorb it. Team-wide profile optimization, automated intake and follow-up, and a steady flow of qualified admissions your clinical team can carry.",
      },
      {
        title: "Multi-location & Residential (RTC)",
        body: "Search and paid media across every location without the sites competing against each other, a dedicated marketing director, and a rebuild that protects the rankings you already have.",
      },
    ],
  },

  services: {
    id: "services",
    eyebrow: "What we do",
    heading: "The whole growth function, not a channel.",
    intro:
      "Most practices do not need another vendor to manage. They need the marketing and the business systems behind it handled together, by people who understand the clinical side.",
    items: [
      {
        title: "Search (SEO)",
        body: "Local and multi-location search built around how patients and referrers actually look for care, with a page-one ranking guarantee on agreed keywords.",
      },
      {
        title: "Paid advertising",
        body: "Search and social campaigns managed against a 4.25x return on ad spend guarantee, with tracking tied to admissions rather than form fills.",
      },
      {
        title: "Websites",
        body: "Fast, accessible sites that convert, built to preserve the search equity of whatever you are replacing.",
      },
      {
        title: "CRM and automations",
        body: "Branded email, document signing, payments, and automation across marketing, sales and internal operations so nothing falls between intake and first session.",
      },
      {
        title: "Psychology Today optimization",
        body: "Profiles rewritten and structured to rank and convert, for one clinician or for an entire team.",
      },
      {
        title: "Business consulting",
        body: "Standing hours with operators who have run practices and facilities: pricing, payer mix, hiring, capacity, second locations, OP-to-IOP expansion.",
      },
    ],
  },

  pricing: {
    id: "pricing",
    eyebrow: "Plans",
    heading: "Straightforward plans. No percentage of spend.",
    intro:
      "Pick the plan that matches the size of the practice. Everything is done for you, and every plan includes the monthly mastermind.",
    plans: [
      {
        id: "startup",
        name: "Startup / New Practice",
        audience: "For clinicians launching a new practice.",
        features: [
          "Website",
          "CRM included: branded email, document signer, payment processor",
          "Psychology Today profile optimization",
          "One monthly Grow Your Practice mastermind",
          "One 1-hour consulting call per quarter",
        ],
        price: "$600 one-time setup",
        priceNote: "then $100/month for website hosting and CRM",
        cta: "Let's chat",
      },
      {
        id: "growing",
        name: "Growing Practice",
        audience: "For 5–10 clinician practices and IOP/PHP clinical teams.",
        features: [
          "Choose one: SEO or Ads",
          "Ads: 4.25x return on ad spend guarantee",
          "SEO: page-one Google ranking guarantee on your chosen keywords",
          "Psychology Today optimization for the whole team",
          "2026 website update",
          "A-to-Z automations across marketing, sales and internal operations",
          "2 hours of consulting per month",
          "One monthly mastermind",
        ],
        price: "$4,500",
        priceNote: "per month",
        cta: "Let's chat",
        featured: true,
      },
      {
        id: "enterprise",
        name: "Enterprise / Multi-location",
        audience:
          "For 20+ clinician practices, multi-location practices, 50+ IOP/PHP clients, or residential treatment centers.",
        features: [
          "SEO and Ads for all locations, up to 5",
          "Dedicated marketing director",
          "CRM and a new website that preserves your current SEO",
          "4 hours of consulting per month",
          "One monthly mastermind",
        ],
        price: "$7,000",
        priceNote: "per month",
        cta: "Let’s chat",
      },
    ] satisfies Plan[],
    /** Rendered directly beneath the plan grid. */
    footnote: "Ad spend is not included in any plan.",
    guaranteeTermsLabel: "See guarantee terms",
    guaranteeTermsHref: "/terms#guarantees",
    alaCarte: {
      heading: "Custom and à la carte",
      items: [
        {
          title: "Solo psychiatrists and PMHNPs",
          body: "Single services, Ads or SEO, as needed.",
          price: "Call for quote",
        },
        {
          title: "Custom consulting packages",
          body: "Built around the problem you are actually solving.",
          price: "Call for quote",
        },
        {
          title: "Done-for-you OP-to-IOP program build",
          body: "Full program build including curriculum.",
          price: "$20,000",
        },
      ],
    },
  },

  howItWorks: {
    id: "how-it-works",
    eyebrow: "How it works",
    heading: "Call. Build. Grow.",
    steps: [
      {
        number: "01",
        title: "Call",
        body: "A working call, not a pitch. We go through your capacity, your current referral sources and what an admission is actually worth to you, then tell you what we would do and what it would cost.",
      },
      {
        number: "02",
        title: "Build",
        body: "We build the asset: website, CRM, tracking, automations and campaign structure. You approve, we ship. The work stays on our side of the line.",
      },
      {
        number: "03",
        title: "Grow",
        body: "Campaigns go live against the guarantee, consulting hours go on the calendar, and reporting ties spend to admissions rather than impressions.",
      },
    ],
  },

  about: {
    id: "about",
    eyebrow: "About",
    heading: "Built by operators, for operators.",
    paragraphs: [
      "Clinician Marketing exists because our founders got tired of explaining behavioral health to marketers.",
      "They have owned outpatient therapy practices and licensed treatment facilities. They have hired clinicians and lost them, carried payroll through a slow quarter, prepared for surveys, and watched a strong month of admissions evaporate because an intake line went unanswered on a Friday afternoon.",
      "That is the perspective we bring to marketing. We know what an admission is worth, what your clinicians will and will not tolerate, and which growth is worth having. We are not a generalist agency with a behavioral health page on the website. This is the only field we work in.",
    ],
  },

  faq: {
    id: "faq",
    eyebrow: "Questions",
    heading: "What practice owners ask us first.",
    items: [
      {
        question: "Is ad spend included in the plans?",
        answer:
          "No. Ad spend is not included in any plan. Your plan fee covers strategy, build, campaign management and consulting. Media budget is paid directly to the advertising platforms, so you own the ad accounts and see exactly what was spent.",
      },
      {
        question: "How does the 4.25x return on ad spend guarantee work?",
        answer:
          "We measure revenue attributed to the campaigns we manage against the ad spend in the same period, over a defined measurement window that starts after an agreed ramp-up. If we do not reach 4.25x, we keep managing the account without our management fee until we do. It depends on tracking and CRM being configured the way we specify, which is part of the build. The full terms set out what is measured and over what period.",
      },
      {
        question: "How does the page-one ranking guarantee work?",
        answer:
          "We agree a keyword list with you before the work starts. If those keywords are not ranking on page one of Google within the period set out in the terms, you stop paying the SEO management fee until they are. The guarantee covers the keywords we agree together, not every phrase someone might type.",
      },
      {
        question: "How long is the contract?",
        answer:
          "There is an initial term so the guarantees have a measurement window that means something, and the agreement continues month to month after that. We do not use multi-year lock-ins. The exact term is stated plainly in your agreement before you sign anything.",
      },
      {
        question: "Is your marketing HIPAA-aware?",
        answer:
          "We build on the assumption that anything touching a prospective patient can become protected health information. In practice that means contact forms collect contact details and never clinical detail, advertising and analytics tags are kept off patient portal and clinical pages, call tracking and CRM vendors are engaged under a business associate agreement where one is required, and no clinical information is sent to advertising platforms. We are a marketing company rather than your compliance counsel, so your privacy officer should review anything that touches patient data.",
      },
      {
        question: "What is the monthly mastermind?",
        answer:
          "A monthly group call for the practice owners we work with. One topic worked through properly — pricing, payer mix, hiring, intake conversion, opening a second location — plus time for your own questions. It is included in every plan.",
      },
      {
        question: "Will a new website lose the SEO we already have?",
        answer:
          "That is the risk we design against. Before anything changes we crawl and archive the existing site, map every URL to its replacement, keep the pages that are earning rankings, and put permanent redirects in place at launch. Rankings and traffic are monitored through the transition so a drop gets caught in days rather than quarters. On the enterprise plan, preserving current SEO is an explicit part of the build.",
      },
      {
        question: "How quickly does this go live?",
        answer:
          "A new-practice site is typically live within a few weeks of the kickoff call. Larger builds involving a CRM, automations and a site migration take longer because the migration is the part worth being careful about. Paid campaigns can start as soon as tracking is verified. Search is a compounding channel, which is why the ranking guarantee runs over the window set out in the terms.",
      },
    ],
  },

  contact: {
    id: "contact",
    eyebrow: "Book a call",
    heading: "Tell us what you are running.",
    intro:
      "A short form, then a working call. We will come prepared with a view on what we would do and what it would cost.",
    privacyNote:
      "Please do not include any patient or clinical information in this form. We do not collect protected health information here.",
    schedulerPlaceholder: {
      heading: "Prefer to book directly?",
      body: "Pick a time that suits you and we will come to the call prepared.",
    },
    fields: {
      name: "Your name",
      practice: "Practice or organization",
      role: "Your role",
      size: "Practice size",
      email: "Email",
      phone: "Phone",
      message: "What are you trying to solve?",
    },
    roleOptions: [
      "Therapist or psychologist",
      "Psychiatrist or PMHNP",
      "Practice owner or partner",
      "Executive or administrator",
      "Marketing lead",
      "Other",
    ],
    sizeOptions: [
      "Solo practitioner",
      "2–4 clinicians",
      "5–10 clinicians",
      "11–19 clinicians",
      "20+ clinicians",
      "IOP or PHP program",
      "Multi-location or residential",
    ],
    submitLabel: "Request a call",
    submittingLabel: "Sending",
    successHeading: "Request received.",
    successBody:
      "We will reply within one business day with times for a call.",
    errorBody:
      "That did not send. Email us directly and we will pick it up from there.",
  },

  footer: {
    tagline:
      "Behavioral health marketing and business consulting, built by people who have owned practices and treatment centers.",
    columns: [
      {
        heading: "Company",
        links: [
          { label: "Services", href: "/#services" },
          { label: "Who We Serve", href: "/#who-we-serve" },
          { label: "Pricing", href: "/#pricing" },
          { label: "About", href: "/#about" },
        ],
      },
      {
        heading: "Support",
        links: [
          { label: "FAQ", href: "/#faq" },
          { label: "Let's chat", href: "/#contact" },
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ],
      },
    ],
  },
} as const;

export type Content = typeof content;
