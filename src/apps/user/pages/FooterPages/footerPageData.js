const actions = {
  talkToExpert: { labelKey: "common.talkToExpert", to: "/user/call-chat?page=1&mode=chat" },
  exploreCategories: { labelKey: "common.categories", to: "/user/categories", variant: "secondary" },
  becomeExpert: { labelKey: "footer.becomeExpert", to: "/expert/register" },
  howItWorks: { labelKey: "footer.howItWorks", to: "/user/how-it-works", variant: "secondary" },
  support: { labelKey: "common.support", to: "/user/support" },
  expertGuidelines: { labelKey: "footer.expertGuidelines", to: "/user/guidelines", variant: "secondary" },
};

const commonBadges = ["verifiedExperts", "secureChatCall", "walletPayments", "multipleCategories"];

export const footerPages = {
  about: {
    path: "/user/about",
    key: "about",
    ctas: ["talkToExpert", "exploreCategories"],
    badgeIds: commonBadges,
    stats: ["usersGuided", "verifiedProfessionals", "serviceCategories", "onlineAccess"],
    sections: [
      { id: "mission", type: "cards", items: [{ id: "instantAccess", icon: "zap" }, { id: "verifiedProfessionals", icon: "shield" }, { id: "oneMarketplace", icon: "grid" }] },
      { id: "offer", type: "list", items: ["categories", "secureConsultation", "trustSignals", "fastResponse"] },
      { id: "trust", type: "cards", items: [{ id: "privateConsultations", icon: "lock" }, { id: "transparentWallet", icon: "wallet" }, { id: "reviewTrust", icon: "star" }] },
    ],
    links: [
      { id: "findExperts", to: "/user/find-experts" },
      { id: "howItWorks", to: "/user/how-it-works" },
      { id: "reviews", to: "/user/reviews" },
      { id: "careers", to: "/user/careers" },
    ],
    cta: { id: "main", action: "talkToExpert" },
  },
  careers: {
    path: "/user/careers",
    key: "careers",
    ctas: [{ labelId: "viewRoles", to: "#open-roles" }, { labelId: "contactSupport", to: "/user/support", variant: "secondary" }],
    badgeIds: ["remoteFriendly", "fresherExperienced", "productCulture", "growth"],
    stats: ["hybrid", "fastHiring", "growthCulture", "userImpact"],
    sections: [
      { id: "whyJoin", type: "cards", items: [{ id: "userImpact", icon: "users" }, { id: "growthMindset", icon: "trending" }, { id: "flexibleWork", icon: "globe" }] },
      { id: "openRoles", type: "cards", items: [{ id: "supportAssociate", icon: "briefcase" }, { id: "marketingExecutive", icon: "briefcase" }, { id: "operationsCoordinator", icon: "briefcase" }, { id: "frontendDeveloper", icon: "briefcase" }, { id: "seoWriter", icon: "briefcase" }, { id: "bdExecutive", icon: "briefcase" }] },
      { id: "process", type: "steps", items: ["apply", "screening", "interview", "offer"] },
    ],
    cta: { id: "main", action: "support" },
  },
  privacy: {
    path: "/user/privacy",
    key: "privacy",
    legal: true,
    badgeIds: ["transparentData", "securePayments", "privateWorkflows"],
    sections: [
      { id: "information", type: "legal", items: ["accountDetails", "consultationActivity", "deviceUsage"] },
      { id: "use", type: "legal", items: ["serviceDelivery", "trustSafety", "communication"] },
      { id: "rights", type: "legal", items: ["accountUpdates", "supportRequests"] },
    ],
    links: [
      { id: "terms", to: "/user/terms" },
      { id: "support", to: "/user/support" },
      { id: "faq", to: "/user/faq" },
    ],
  },
  terms: {
    path: "/user/terms",
    key: "terms",
    legal: true,
    badgeIds: ["userResponsibilities", "marketplaceRules", "paymentClarity"],
    sections: [
      { id: "usage", type: "legal", items: ["eligibility", "expertGuidance", "accountSafety"] },
      { id: "payments", type: "legal", items: ["walletBilling", "rechargeTransactions", "refundReview"] },
      { id: "conduct", type: "legal", items: ["respectfulCommunication", "noMisuse"] },
    ],
    links: [
      { id: "privacy", to: "/user/privacy" },
      { id: "guidelines", to: "/user/guidelines" },
      { id: "support", to: "/user/support" },
    ],
  },
  findExperts: {
    path: "/user/find-experts",
    key: "findExperts",
    ctas: ["talkToExpert", "exploreCategories"],
    badgeIds: ["profileRatings", "instantChat", "secureCall", "categoryDiscovery"],
    stats: ["categories", "experts", "availability", "secureConsultation"],
    search: true,
    sections: [
      { id: "popular", type: "cards", items: [{ id: "career", icon: "briefcase" }, { id: "legal", icon: "shield" }, { id: "business", icon: "trending" }, { id: "finance", icon: "wallet" }, { id: "astrology", icon: "star" }, { id: "health", icon: "heart" }] },
      { id: "why", type: "list", items: ["profiles", "secureOptions", "walletPayments", "oneMarketplace"] },
    ],
    links: [
      { id: "allCategories", to: "/user/categories" },
      { id: "allServices", to: "/user/all-services" },
      { id: "popularQuestions", to: "/user/faq" },
    ],
    cta: { id: "main", action: "talkToExpert" },
  },
  reviews: {
    path: "/user/reviews",
    key: "reviews",
    ctas: ["talkToExpert", "howItWorks"],
    badgeIds: ["fiveStar", "verifiedUsers", "fastResponse", "trustedServices"],
    stats: ["average", "usersServed", "response", "secure"],
    sections: [
      { id: "testimonials", type: "cards", items: [{ id: "career", icon: "star" }, { id: "legal", icon: "star" }, { id: "business", icon: "star" }, { id: "astrology", icon: "star" }, { id: "finance", icon: "star" }, { id: "service", icon: "star" }] },
      { id: "trust", type: "cards", items: [{ id: "verified", icon: "shield" }, { id: "secureChat", icon: "message" }, { id: "billing", icon: "wallet" }] },
    ],
    cta: { id: "main", action: "talkToExpert" },
  },
  howItWorks: {
    path: "/user/how-it-works",
    key: "howItWorks",
    ctas: ["talkToExpert", "exploreCategories"],
    badgeIds: ["chooseCategory", "selectExpert", "chatCall", "paySecurely"],
    sections: [
      { id: "journey", type: "steps", items: ["choose", "select", "connect", "pay"] },
      { id: "benefits", type: "cards", items: [{ id: "fastResponse", icon: "zap" }, { id: "trustSignals", icon: "shield" }, { id: "onlineServices", icon: "grid" }] },
    ],
    cta: { id: "main", action: "talkToExpert" },
  },
  faq: {
    path: "/user/faq",
    key: "faq",
    badgeIds: ["userHelp", "expertHelp", "paymentHelp", "technicalHelp"],
    search: true,
    sections: [
      { id: "faqs", type: "faq", items: ["instantExpert", "perMinute", "chooseCategory", "privateChat", "rechargeWallet", "lowBalance", "expertsJoin", "contactSupport"] },
    ],
    links: [
      { id: "support", to: "/user/support" },
      { id: "wallet", to: "/user/wallet" },
      { id: "guidelines", to: "/user/guidelines" },
      { id: "terms", to: "/user/terms" },
    ],
  },
  becomeExpert: {
    path: "/user/become-expert",
    key: "becomeExpert",
    ctas: ["becomeExpert", { labelId: "earningsModel", to: "/user/earnings-model", variant: "secondary" }],
    badgeIds: ["flexibleConsultation", "onlineServices", "profileVisibility", "securePayouts"],
    stats: ["online", "flexible", "multiple", "growth"],
    sections: [
      { id: "benefits", type: "cards", items: [{ id: "chatCall", icon: "message" }, { id: "earning", icon: "wallet" }, { id: "reputation", icon: "star" }] },
      { id: "process", type: "steps", items: ["create", "profile", "review", "consulting"] },
    ],
    links: [
      { id: "guidelines", to: "/user/guidelines" },
      { id: "earnings", to: "/user/earnings-model" },
      { id: "support", to: "/user/support" },
    ],
    cta: { id: "main", action: "becomeExpert" },
  },
  guidelines: {
    path: "/user/guidelines",
    key: "guidelines",
    badgeIds: ["conduct", "profileQuality", "userTrust", "clearPricing"],
    sections: [
      { id: "conduct", type: "list", items: ["respect", "expertise", "noOffPlatform", "professional"] },
      { id: "profile", type: "list", items: ["photo", "summary", "pricing", "availability"] },
      { id: "trust", type: "cards", items: [{ id: "accuracy", icon: "shield" }, { id: "communication", icon: "message" }, { id: "quality", icon: "star" }] },
    ],
    links: [
      { id: "becomeExpert", to: "/user/become-expert" },
      { id: "earnings", to: "/user/earnings-model" },
      { id: "support", to: "/user/support" },
    ],
  },
  earningsModel: {
    path: "/user/earnings-model",
    key: "earningsModel",
    ctas: ["becomeExpert", "expertGuidelines"],
    badgeIds: ["chatEarnings", "callEarnings", "serviceIncome", "walletFlow"],
    sections: [
      { id: "earn", type: "cards", items: [{ id: "chat", icon: "message" }, { id: "call", icon: "phone" }, { id: "services", icon: "grid" }, { id: "growth", icon: "trending" }] },
      { id: "examples", type: "cards", items: [{ id: "starter", icon: "wallet" }, { id: "growing", icon: "wallet" }, { id: "service", icon: "wallet" }] },
      { id: "payments", type: "list", items: ["usersPay", "records", "payout", "details"] },
    ],
    cta: { id: "main", action: "becomeExpert" },
  },
  support: {
    path: "/user/support",
    key: "support",
    badgeIds: ["userHelp", "expertHelp", "paymentHelp", "technicalSupport"],
    search: true,
    sections: [
      { id: "contact", type: "cards", items: [{ id: "user", icon: "users" }, { id: "expert", icon: "briefcase" }, { id: "payment", icon: "wallet" }, { id: "chatCall", icon: "message" }, { id: "account", icon: "lock" }, { id: "technical", icon: "settings" }] },
      { id: "common", type: "faq", items: ["walletRecharge", "cannotStart", "reportIssue", "onboarding"] },
    ],
    links: [
      { id: "faq", to: "/user/faq" },
      { id: "wallet", to: "/user/wallet" },
      { id: "privacy", to: "/user/privacy" },
      { id: "terms", to: "/user/terms" },
    ],
    cta: { id: "main", action: "talkToExpert" },
  },
};

export const getFooterPage = (pageKey) => footerPages[pageKey];
export const getFooterPageAction = (action) =>
  typeof action === "string" ? actions[action] : action;
