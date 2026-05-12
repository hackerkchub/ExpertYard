const CATEGORY_SEO_MAP = {
  legal: {
    label: "Legal",
    title: "Legal Consultation Online | Talk to Verified Lawyers - G9Experts",
    description:
      "Get online legal consultation from verified lawyers on G9Experts. Chat or call experts for property, family, business, documentation and legal advice.",
    focusAreas: "property, family, business, documentation, agreements, disputes, compliance, and general legal advice",
    experts: "lawyers and legal consultants",
  },
  health: {
    label: "Health",
    title: "Health Consultation Online | Talk to Verified Health Experts - G9Experts",
    description:
      "Connect with verified health experts online for instant chat and call consultation on fitness, wellness, diet, general health and lifestyle guidance.",
    focusAreas: "fitness, wellness, diet, general health, lifestyle habits, prevention, and everyday health decisions",
    experts: "health, wellness, diet, and lifestyle experts",
  },
  astrology: {
    label: "Astrology",
    title: "Astrology Consultation Online | Talk to Verified Astrologers - G9Experts",
    description:
      "Get online astrology consultation from verified astrologers for career, relationship, marriage, business, finance and personal guidance.",
    focusAreas: "career, relationship, marriage, business, finance, compatibility, timing, and personal guidance",
    experts: "astrologers and spiritual guidance experts",
  },
  business: {
    label: "Business",
    title: "Business Consultation Online | Talk to Verified Business Experts - G9Experts",
    description:
      "Talk to verified business experts online for startup, marketing, sales, finance, growth strategy and business planning consultation.",
    focusAreas: "startup planning, marketing, sales, finance, growth strategy, operations, and business planning",
    experts: "business consultants, startup advisors, and growth experts",
  },
  career: {
    label: "Career",
    title: "Career Consultation Online | Talk to Verified Career Experts - G9Experts",
    description:
      "Get career guidance online from verified experts for job, resume, interview, skills, education, freelancing and career growth.",
    focusAreas: "jobs, resumes, interviews, skills, education choices, freelancing, career change, and career growth",
    experts: "career coaches, education mentors, and professional advisors",
  },
  finance: {
    label: "Finance",
    title: "Finance Consultation Online | Talk to Verified Finance Experts - G9Experts",
    description:
      "Connect with verified finance experts online for budgeting, investment guidance, tax planning, business finance and money management advice.",
    focusAreas: "budgeting, investment guidance, tax planning, business finance, savings, debt, and money management",
    experts: "finance experts, money advisors, and business finance consultants",
  },
  property: {
    label: "Property",
    title: "Property Consultation Online | Talk to Verified Property Experts - G9Experts",
    description:
      "Get property consultation online from verified experts for buying, selling, rent, legal documents, valuation and real estate guidance.",
    focusAreas: "buying, selling, rent, legal documents, valuation, negotiation, loans, and real estate guidance",
    experts: "property consultants, real estate advisors, and documentation experts",
  },
  relationship: {
    label: "Relationship",
    title: "Relationship Consultation Online | Talk to Verified Experts - G9Experts",
    description:
      "Talk to verified relationship experts online for personal guidance, communication, marriage, family and relationship advice.",
    focusAreas: "personal guidance, communication, marriage, family matters, compatibility, conflict resolution, and relationship advice",
    experts: "relationship advisors, family guidance experts, and personal coaches",
  },
  education: {
    label: "Education",
    title: "Education Consultation Online | Talk to Verified Education Experts - G9Experts",
    description:
      "Get education consultation online from verified experts for courses, career path, exams, study planning and academic guidance.",
    focusAreas: "courses, career paths, exams, study planning, academic guidance, skills, and education decisions",
    experts: "education consultants, academic mentors, and career path advisors",
  },
};

const CATEGORY_ALIASES = {
  lawyer: "legal",
  law: "legal",
  "legal-advice": "legal",
  doctor: "health",
  wellness: "health",
  "diet-and-fitness": "health",
  fitness: "health",
  astrologer: "astrology",
  startup: "business",
  "business-consultant": "business",
  "career-roadmap": "career",
  "job-gateway": "career",
  "financial-advisor": "finance",
  "property-and-loan": "property",
  realestate: "property",
  "real-estate": "property",
  marriage: "relationship",
  matrimonial: "relationship",
  "soulmate-guide": "relationship",
  "heartbreak-and-move-on": "relationship",
  parenting: "education",
  "parenting-and-child-care": "education",
};

export function normalizeCategorySlug(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCategorySeoKey(categoryOrSlug) {
  const slug = normalizeCategorySlug(
    typeof categoryOrSlug === "string"
      ? categoryOrSlug
      : categoryOrSlug?.slug || categoryOrSlug?.name || ""
  );

  if (CATEGORY_SEO_MAP[slug]) return slug;
  if (CATEGORY_ALIASES[slug]) return CATEGORY_ALIASES[slug];

  return slug;
}

export function getCategorySeoData(categoryOrSlug) {
  const key = getCategorySeoKey(categoryOrSlug);
  const categoryName =
    typeof categoryOrSlug === "string"
      ? categoryOrSlug
      : categoryOrSlug?.name || "Expert";
  const fallbackLabel = String(categoryName || "Expert").replace(/\s+Experts?$/i, "").trim();

  if (CATEGORY_SEO_MAP[key]) {
    return {
      key,
      slug: normalizeCategorySlug(typeof categoryOrSlug === "string" ? categoryOrSlug : categoryOrSlug?.slug || key),
      ...CATEGORY_SEO_MAP[key],
    };
  }

  const label = fallbackLabel || "Expert";

  return {
    key,
    slug: normalizeCategorySlug(typeof categoryOrSlug === "string" ? categoryOrSlug : categoryOrSlug?.slug || label),
    label,
    title: `${label} Consultation Online | Talk to Verified Experts - G9Experts`,
    description: `Get online ${label.toLowerCase()} consultation from verified experts on G9Experts. Chat or call trusted professionals for instant advice and practical guidance.`,
    focusAreas: `${label.toLowerCase()} questions, planning, comparison, personal guidance, and practical decision support`,
    experts: `verified ${label.toLowerCase()} experts`,
  };
}

export function buildCategoryCanonicalPath(categoryOrSlug) {
  const seoData = getCategorySeoData(categoryOrSlug);
  return `/category/${seoData.slug}`;
}

export function buildCategoryLongFormContent(seoData) {
  const label = seoData.label;
  const lowerLabel = label.toLowerCase();

  return [
    `Online ${label} consultation on G9Experts helps users get practical, category-specific guidance without waiting for offline appointments or searching across scattered sources. This category is useful when you need help with ${seoData.focusAreas}. Whether the question is urgent, exploratory, personal, or professional, the page helps you discover verified experts who understand the topic and can guide you through the next step with more clarity.`,
    `G9Experts is designed for users who want to talk to verified experts online before making important decisions. Each ${lowerLabel} expert profile can be reviewed for relevant details, consultation options, pricing signals, ratings, and availability. Instead of guessing who to contact, users can compare professionals in one place and choose the expert whose background matches their requirement. This is especially useful for people who need quick answers, a second opinion, or structured guidance before taking action.`,
    `Chat and call consultation make the experience flexible. Chat is helpful when you want to explain your question clearly, share context, and keep a written reference. Call consultation is better when the matter needs a real-time conversation, follow-up questions, or faster explanation. G9Experts supports both consultation modes so users can choose the format that fits their comfort, urgency, and budget.`,
    `The focus of this ${lowerLabel} consultation page is to connect users with verified professionals while keeping the journey simple, secure, and transparent. You can browse subcategories, review available experts, compare consultation options, and start a conversation from the same page. For users searching Google for trusted online ${lowerLabel} advice, G9Experts provides a focused destination for expert discovery, instant chat or call access, and reliable guidance from professionals across India.`,
  ];
}

export function buildCategoryFaqItems(seoData) {
  const label = seoData.label;
  const lowerLabel = label.toLowerCase();

  return [
    {
      question: `What is online ${lowerLabel} consultation on G9Experts?`,
      answer: `Online ${lowerLabel} consultation on G9Experts lets users connect with verified experts by chat or call for guidance related to ${seoData.focusAreas}.`,
    },
    {
      question: `How can I talk to a verified ${lowerLabel} expert online?`,
      answer: `Open the ${label} category page, compare available expert profiles, choose a relevant professional, and start a chat or call consultation based on availability.`,
    },
    {
      question: `Are ${lowerLabel} experts on G9Experts verified?`,
      answer: `G9Experts highlights verified expert profiles so users can review professional details, ratings, consultation options, and pricing before connecting.`,
    },
    {
      question: `Can I use chat and call for ${lowerLabel} advice?`,
      answer: `Yes. Depending on expert availability, users can choose chat consultation for written guidance or call consultation for real-time discussion.`,
    },
    {
      question: `Why choose G9Experts for ${lowerLabel} consultation?`,
      answer: `G9Experts brings verified experts, multiple categories, transparent profiles, wallet-based payment, and instant chat or call access into one consultation platform.`,
    },
  ];
}

export const CATEGORY_SEO_MAP_EXPORT = CATEGORY_SEO_MAP;
