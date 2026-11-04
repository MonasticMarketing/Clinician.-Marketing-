/**
 * Every word on the site lives here.
 *
 * Edit this file to change copy — no component needs to be touched. Items
 * marked REVIEW in DECISIONS.md are drafts awaiting sign-off (guarantee
 * terms, the Plan 3 price, the founders' story, contact details).
 */

export type NavItem = { label: string; href: string };

/** One line of the price: a one-time setup and a monthly retainer. */
export type PriceLine = {
  id: string;
  amount: string;
  unit: string;
  body: string;
};

/**
 * Scheduling provider embed (GoHighLevel). Used both as the dialog's
 * iframe source and as the href on every "Let's chat" link, so those
 * links still work if JavaScript never runs.
 */
const SCHEDULER_URL =
  "https://link.bemonastic.com/widget/booking/dYHqgRAxyhgJUOb2XPle";

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

  /** Exposed for the booking dialog's iframe. */
  scheduler: {
    embedUrl: SCHEDULER_URL,
    title: "Book a call with Clinician Marketing",
  },

  meta: {
    title: "Behavioral Health Marketing | Clinician Marketing",
    description:
      "Behavioral health marketing from operators who have owned and scaled practices and treatment centers. SEO, ads and CRM, done for you.",
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
      { label: "Services", href: "/#services" },
      { label: "Who We Serve", href: "/#who-we-serve" },
      { label: "Pricing", href: "/#pricing" },
      { label: "About", href: "/#about" },
    ] satisfies NavItem[],
    cta: { label: "Let's chat", href: SCHEDULER_URL },
  },

  hero: {
    eyebrow: "Behavioral health marketing and business consulting",
    headline:
      "The blueprint we’ve used as owners to operate, scale and sell behavioral health practices.",
    subhead:
      "Clinician Marketing is behavioral health marketing and business consulting from operators who have owned therapy practices and licensed treatment facilities. Not a generalist agency learning your field on your budget.",
    primaryCta: { label: "Let's chat", href: SCHEDULER_URL },
    secondaryCta: { label: "See Plans", href: "/#pricing" },
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
        body: "Our founders have built, staffed and scaled outpatient therapy practices. Not consulted on them. Run them."
      },
      {
        title: "We have owned the facilities",
        body: "Licensed treatment centers we operate day to day: census and admissions through staffing, surveys and payer mix."
      },
      {
        title: "Guarantees, in writing",
        body: "A 4.25x return on ad spend on paid campaigns, or page-one Google ranking on the keywords we agree together.",
      },
      {
        title: "Done for you, end to end",
        body: "We help practices like yours grow without adding to your workload. Website, CRM, tracking, automations and campaigns are built, launched and maintained by us."
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
    eyebrow: "What you get",
    heading: "A complete marketing system, done for you.",
    intro:
      "Built for clinicians who own their practice. HIPAA compliant, trauma informed, and priced so it pays for itself with a single new client.",
    items: [
      {
        title: "Website",
        body: "Designed, written and built for you. No Google tags, no trackers, no PHI leaks.",
      },
      {
        title: "Text and email campaigns",
        body: "Automated follow-up with booking links or secure fill forms on your site, so inquiries become appointments.",
      },
      {
        title: "Local SEO",
        body: "Show up when people in your area search for the care you provide.",
      },
      {
        title: "Google or Meta ads",
        body: "Managed campaigns that reach ideal-fit clients without crossing compliance lines.",
      },
      {
        title: "Psychology Today optimization",
        body: "A profile rewritten to be found and chosen, not scrolled past.",
      },
      {
        title: "HIPAA compliant, trauma informed",
        body: "Every page, form, message and ad. Built by people who have owned practices and treatment centers.",
      },
    ],
  },

  pricing: {
    id: "pricing",
    eyebrow: "Simple pricing",
    heading: "Marketing that fits a therapist’s budget, not an agency’s.",
    intro:
      "Most agencies price for medical groups and hospitals. We built this for the solo and small practice owner who needs a steady flow of right-fit clients without a five-figure retainer.",
    /** The two lines of the price, rendered one above the other. */
    priceLines: [
      {
        id: "setup",
        amount: "$1,500",
        unit: "one-time",
        body: "Setup: website, automations, SEO foundation, ad accounts and Psychology Today profile.",
      },
      {
        id: "retainer",
        amount: "$700",
        unit: "per month",
        body: "Ongoing retainer: campaigns, SEO, ads management and optimization.",
      },
    ] satisfies PriceLine[],
    reasonsHeading: "Why it works",
    reasons: [
      "One new weekly client covers the retainer. Everything after that is growth.",
      "No hiring, no learning a dozen tools. We run the whole system.",
      "You stay focused on clients. We keep the schedule full.",
    ],
    cta: "Let’s chat",
    /** Rendered directly beneath the price; the lead is set in white. */
    footnoteLead: "Ad spend is not included.",
    footnote:
      "You set and control your own Google or Meta ad budget, and no long-term contract is required.",
    guaranteeTermsLabel: "See guarantee terms",
    guaranteeTermsHref: "/terms#guarantees",
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
        body: "Campaigns go live, follow-up runs itself, and reporting ties spend to booked appointments rather than impressions. We keep optimizing month to month.",
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
      "What you get is the blueprint we used to operate, scale and eventually sell those businesses: the systems, the campaigns and the judgment calls that moved census. We run it for your practice instead of ours.",
    ],
  },

  faq: {
    id: "faq",
    eyebrow: "Questions",
    heading: "What practice owners ask us first.",
    items: [
      {
        question: "Is ad spend included?",
        answer:
          "No. The retainer covers strategy, campaign management, SEO and optimization. Media budget is paid directly to Google or Meta, so you set your own budget, own the ad accounts and see exactly what was spent.",
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
          "The retainer runs month to month and no long-term contract is required. Where a guarantee is part of your agreement it needs a measurement window to mean anything, so that window is stated plainly before you sign. We do not use multi-year lock-ins.",
      },
      {
        question: "Is your marketing HIPAA-aware?",
        answer:
          "We build on the assumption that anything touching a prospective patient can become protected health information. In practice that means contact forms collect contact details and never clinical detail, advertising and analytics tags are kept off patient portal and clinical pages, call tracking and CRM vendors are engaged under a business associate agreement where one is required, and no clinical information is sent to advertising platforms. We are a marketing company rather than your compliance counsel, so your privacy officer should review anything that touches patient data.",
      },
      {
        question: "Will a new website lose the SEO we already have?",
        answer:
          "That is the risk we design against. Before anything changes we crawl and archive the existing site, map every URL to its replacement, keep the pages that are earning rankings, and put permanent redirects in place at launch. Rankings and traffic are monitored through the transition so a drop gets caught in days rather than quarters. Preserving the rankings you already have is part of the build, not an add-on.",
      },
      {
        question: "How quickly does this go live?",
        answer:
          "The site is typically live within a few weeks of the kickoff call. A build that has to migrate an existing site takes longer, because the migration is the part worth being careful about. Campaigns can start as soon as tracking is verified. Search compounds, so local SEO is the slowest of the five to show its full effect.",
      },
    ],
  },

  /** Copy for the booking dialog that the "Let's chat" buttons open. */
  booking: {
    heading: "Book a call",
    body: "Pick a time that suits you. We will come to the call prepared.",
    footnote: "Prefer to talk now?",
  },

  footer: {
    tagline:
      "Behavioral health marketing and business consulting, built by people who have owned practices and treatment centers.",
    columns: [
      {
        heading: "Company",
        links: [
          { label: "Our services", href: "/#services" },
          { label: "Who we serve", href: "/#who-we-serve" },
          { label: "Plans and pricing", href: "/#pricing" },
          { label: "About us", href: "/#about" },
        ],
      },
      {
        heading: "Resources",
        links: [
          { label: "Blog", href: "/blog" },
          { label: "Psychology Today guide", href: "/psychology-today-optimization-guide" },
          { label: "Common questions", href: "/#faq" },
          { label: "Privacy notice", href: "/privacy" },
          { label: "Terms and guarantees", href: "/terms" },
        ],
      },
    ],
  },
} as const;

export type Content = typeof content;
