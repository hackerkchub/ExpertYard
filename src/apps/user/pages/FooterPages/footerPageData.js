const talkToExpert = { label: "Talk to Expert", to: "/user/call-chat?page=1&mode=chat" };
const exploreCategories = { label: "Explore Categories", to: "/user/categories", variant: "secondary" };
const becomeExpert = { label: "Become an Expert", to: "/expert/register" };

const commonBadges = ["Verified experts", "Secure chat and call", "Wallet-based payments", "Multiple categories"];

export const footerPages = {
  about: {
    path: "/user/about",
    label: "Company",
    title: "About G9 Experts",
    subtitle:
      "G9 Experts connects users with verified professionals for instant guidance, online services, and trusted solutions across everyday and specialist needs.",
    description:
      "Learn about G9 Experts, a trusted platform for instant expert consultation, secure chat and call support, online services, and verified professional guidance.",
    keywords: "about G9 Experts, verified experts, online consultation platform, instant expert help",
    badges: commonBadges,
    ctas: [talkToExpert, exploreCategories],
    stats: [
      { value: "20K+", label: "Users guided" },
      { value: "5K+", label: "Verified professionals" },
      { value: "50+", label: "Service categories" },
      { value: "24/7", label: "Online access" },
    ],
    sections: [
      {
        id: "mission",
        title: "Our Mission",
        text: "Our mission is to make professional guidance easier to access. Users can connect with experts online, ask questions, book services, and get practical direction without long waiting cycles.",
        type: "cards",
        items: [
          { icon: "zap", title: "Instant Access", text: "Start a secure chat or call with available professionals in minutes." },
          { icon: "shield", title: "Verified Professionals", text: "Profiles, ratings, and platform checks help users choose with confidence." },
          { icon: "grid", title: "One Marketplace", text: "Consultation and online services are available across many useful categories." },
        ],
      },
      {
        id: "offer",
        title: "What We Offer",
        text: "G9 Experts brings category discovery, expert profiles, chat and call support, wallet payments, reviews, and service booking into one clean user experience.",
        type: "list",
        items: [
          "Career, legal, business, finance, health, astrology, freelancing, and service guidance.",
          "Secure chat and call consultation with transparent per-minute or service pricing.",
          "Expert ratings, profile details, followers, and reviews to support informed decisions.",
          "Fast response options for users who need practical help right away.",
        ],
      },
      {
        id: "trust",
        title: "Trust & Security",
        text: "Every product decision is built around user trust, payment clarity, and safe communication with professionals.",
        type: "cards",
        items: [
          { icon: "lock", title: "Private Consultations", text: "User conversations are designed to stay within secure platform workflows." },
          { icon: "wallet", title: "Transparent Wallet", text: "Wallet-based payments make consultation spending easier to track." },
          { icon: "star", title: "Review-led Trust", text: "Ratings and reviews help users identify reliable professionals faster." },
        ],
      },
    ],
    linksTitle: "Explore G9 Experts",
    links: [
      { label: "Find verified experts", to: "/user/find-experts" },
      { label: "How it works", to: "/user/how-it-works" },
      { label: "Read reviews", to: "/user/reviews" },
      { label: "Join our team", to: "/user/careers" },
    ],
    cta: {
      title: "Need expert guidance today?",
      text: "Choose a category and connect with a verified professional through secure chat or call.",
      action: talkToExpert,
    },
  },

  careers: {
    path: "/user/careers",
    label: "Careers",
    title: "Build the Future of Online Expert Guidance",
    subtitle:
      "Join a growing marketplace team building trusted consultation and online service experiences for users and professionals.",
    description:
      "Explore careers at G9 Experts, including remote and onsite opportunities for freshers and experienced professionals building an expert marketplace.",
    keywords: "G9 Experts careers, startup jobs, remote jobs, marketplace careers, fresher hiring",
    badges: ["Remote friendly", "Fresher and experienced roles", "Product-led culture", "Growth opportunities"],
    ctas: [{ label: "View Open Roles", to: "#open-roles" }, { label: "Contact Support", to: "/user/support", variant: "secondary" }],
    stats: [
      { value: "Hybrid", label: "Work options" },
      { value: "Fast", label: "Hiring cycles" },
      { value: "Growth", label: "Learning culture" },
      { value: "Impact", label: "User-first work" },
    ],
    sections: [
      {
        id: "why-join",
        title: "Why Join G9 Experts",
        text: "You will work on real marketplace problems: trust, payments, expert discovery, communication, and conversion-focused user experiences.",
        type: "cards",
        items: [
          { icon: "users", title: "User Impact", text: "Help people find trusted professional guidance when they need it most." },
          { icon: "trending", title: "Growth Mindset", text: "Work in an environment that values ownership, learning, and clear execution." },
          { icon: "globe", title: "Flexible Work", text: "Role-based remote, hybrid, and onsite flexibility for the right candidates." },
        ],
      },
      {
        id: "open-roles",
        title: "Open Roles",
        text: "We hire for product, operations, content, marketing, support, and technology roles as the platform grows.",
        type: "cards",
        items: [
          { icon: "briefcase", title: "Customer Support Associate", text: "Support users and experts with clear, empathetic platform guidance." },
          { icon: "briefcase", title: "Digital Marketing Executive", text: "Drive category discovery, SEO content, and campaign performance." },
          { icon: "briefcase", title: "Operations Coordinator", text: "Support expert onboarding, profile quality, and service workflows." },
          { icon: "briefcase", title: "Frontend Developer", text: "Build responsive, conversion-focused React experiences." },
          { icon: "briefcase", title: "Content & SEO Writer", text: "Create helpful pages for expert discovery, services, FAQs, and guides." },
          { icon: "briefcase", title: "Business Development Executive", text: "Grow category supply and partnerships with professionals." },
        ],
      },
      {
        id: "process",
        title: "Hiring Process",
        text: "Our hiring process is structured, respectful, and focused on practical skills.",
        type: "steps",
        items: [
          { title: "Apply", text: "Share your profile, role interest, and relevant experience." },
          { title: "Screening", text: "We review fit, communication, and role expectations." },
          { title: "Interview", text: "Discuss practical work, problem solving, and team alignment." },
          { title: "Offer", text: "Selected candidates receive role details, compensation, and joining plan." },
        ],
      },
    ],
    cta: {
      title: "Ready to work on a trusted expert marketplace?",
      text: "Send your profile and role interest to the G9 Experts team.",
      action: { label: "Contact Careers", to: "/user/support" },
    },
  },

  privacy: {
    path: "/user/privacy",
    label: "Legal",
    title: "Privacy Policy",
    subtitle:
      "A clear overview of how G9 Experts handles user information, consultation data, payments, account activity, and platform security.",
    description:
      "Read the G9 Experts Privacy Policy covering personal data, account information, consultation privacy, payments, cookies, and user rights.",
    keywords: "G9 Experts privacy policy, data protection, consultation privacy, user data",
    legal: true,
    badges: ["Transparent data use", "Secure payments", "Private consultation workflows"],
    sections: [
      {
        id: "information",
        title: "Information We Collect",
        type: "legal",
        items: [
          { title: "Account details", text: "We may collect name, mobile number, email address, profile details, and login information needed to operate your account." },
          { title: "Consultation activity", text: "We process consultation, booking, chat, call, wallet, and transaction information required to deliver platform services." },
          { title: "Device and usage data", text: "We may collect browser, device, page, and performance information to protect the platform and improve the user experience." },
        ],
      },
      {
        id: "use",
        title: "How We Use Information",
        type: "legal",
        items: [
          { title: "Service delivery", text: "Information is used to connect users with experts, manage profiles, process wallet activity, support bookings, and provide customer support." },
          { title: "Trust and safety", text: "We use relevant data to prevent misuse, review support issues, maintain security, and improve expert and user reliability." },
          { title: "Communication", text: "We may send service updates, support messages, transaction notices, and important account information." },
        ],
      },
      {
        id: "rights",
        title: "Your Choices",
        type: "legal",
        items: [
          { title: "Account updates", text: "Users can update account information through available profile settings or by contacting support." },
          { title: "Support requests", text: "For privacy questions, correction requests, or account concerns, contact the support team through the help center." },
        ],
      },
    ],
    linksTitle: "Related Legal Pages",
    links: [
      { label: "Terms & Conditions", to: "/user/terms" },
      { label: "Support Center", to: "/user/support" },
      { label: "FAQ", to: "/user/faq" },
    ],
  },

  terms: {
    path: "/user/terms",
    label: "Legal",
    title: "Terms & Conditions",
    subtitle:
      "These terms explain the basic rules for using G9 Experts, connecting with professionals, paying through wallet flows, and using online services.",
    description:
      "Read G9 Experts Terms and Conditions for consultation usage, wallet payments, expert services, account responsibilities, and platform rules.",
    keywords: "G9 Experts terms, user terms, consultation terms, expert marketplace rules",
    legal: true,
    badges: ["User responsibilities", "Expert marketplace rules", "Payment clarity"],
    sections: [
      {
        id: "usage",
        title: "Platform Usage",
        type: "legal",
        items: [
          { title: "Eligibility", text: "Users must provide accurate information and use G9 Experts only for lawful consultation, booking, and online service purposes." },
          { title: "Expert guidance", text: "Experts provide professional guidance based on the information shared by users. Users remain responsible for final decisions." },
          { title: "Account safety", text: "Users are responsible for keeping login details secure and reporting suspicious activity promptly." },
        ],
      },
      {
        id: "payments",
        title: "Payments and Wallet",
        type: "legal",
        items: [
          { title: "Wallet billing", text: "Chat, call, and service payments may use wallet balances, per-minute charges, service prices, or other displayed payment methods." },
          { title: "Recharge and transactions", text: "Users should review wallet balance, pricing, and transaction details before starting paid consultations or bookings." },
          { title: "Refund review", text: "Refund or dispute requests are reviewed according to service status, consultation usage, payment records, and platform policies." },
        ],
      },
      {
        id: "conduct",
        title: "Conduct and Restrictions",
        type: "legal",
        items: [
          { title: "Respectful communication", text: "Users and experts must communicate professionally and avoid abusive, misleading, illegal, or harmful behavior." },
          { title: "No misuse", text: "Do not attempt to bypass platform payments, misuse chat or call systems, scrape data, or disrupt service availability." },
        ],
      },
    ],
    linksTitle: "Related Pages",
    links: [
      { label: "Privacy Policy", to: "/user/privacy" },
      { label: "Expert Guidelines", to: "/user/guidelines" },
      { label: "Support Center", to: "/user/support" },
    ],
  },

  findExperts: {
    path: "/user/find-experts",
    label: "For Customers",
    title: "Find Verified Experts Online",
    subtitle:
      "Search categories, compare expert profiles, and start secure chat or call consultation with trusted professionals.",
    description:
      "Find verified experts on G9 Experts for career, legal, business, health, finance, astrology, freelancing, and online services.",
    keywords: "find experts online, verified experts, instant chat consultation, call consultation, online services",
    badges: ["Profile ratings", "Instant chat", "Secure call", "Category discovery"],
    ctas: [talkToExpert, exploreCategories],
    stats: [
      { value: "50+", label: "Categories" },
      { value: "5K+", label: "Experts" },
      { value: "24/7", label: "Availability" },
      { value: "Secure", label: "Consultation" },
    ],
    searchPlaceholder: "Search legal, career, finance, astrology, business...",
    sections: [
      {
        id: "popular",
        title: "Popular Expert Categories",
        text: "Browse high-intent categories and connect with professionals based on your current need.",
        type: "cards",
        items: [
          { icon: "briefcase", title: "Career Guidance", text: "Interview preparation, career direction, resume advice, and job planning." },
          { icon: "shield", title: "Legal Advice", text: "General legal guidance, documentation direction, and practical next steps." },
          { icon: "trending", title: "Business Consulting", text: "Startup, growth, operations, marketing, and business decision support." },
          { icon: "wallet", title: "Financial Guidance", text: "Budgeting, planning, investment awareness, and money management basics." },
          { icon: "star", title: "Astrology", text: "Personal guidance, compatibility, timing, and life direction consultations." },
          { icon: "heart", title: "Health & Wellness", text: "Fitness, wellness, lifestyle, and general health guidance from professionals." },
        ],
      },
      {
        id: "why",
        title: "Why Users Choose G9 Experts",
        type: "list",
        items: [
          "Verified expert profiles with ratings and category details.",
          "Secure chat and call options for instant consultation.",
          "Wallet-based payments that keep spending transparent.",
          "Online services and professional guidance in one marketplace.",
        ],
      },
    ],
    linksTitle: "Start with a category",
    links: [
      { label: "All categories", to: "/user/categories" },
      { label: "All services", to: "/user/all-services" },
      { label: "Popular questions", to: "/user/faq" },
    ],
    cta: {
      title: "Find the right expert faster",
      text: "Start with a category or connect instantly with available professionals.",
      action: talkToExpert,
    },
  },

  reviews: {
    path: "/user/reviews",
    label: "Trust",
    title: "Reviews from G9 Experts Users",
    subtitle:
      "Realistic stories from users who needed fast guidance, verified professionals, and convenient online consultation.",
    description:
      "Read G9 Experts reviews and testimonials from users who connected with verified experts for chat, call, career, legal, business, and online services.",
    keywords: "G9 Experts reviews, expert consultation testimonials, verified expert ratings",
    badges: ["5-star experiences", "Verified users", "Fast response", "Trusted services"],
    ctas: [talkToExpert, { label: "How It Works", to: "/user/how-it-works", variant: "secondary" }],
    stats: [
      { value: "4.8/5", label: "Average experience" },
      { value: "20K+", label: "Users served" },
      { value: "Fast", label: "Response times" },
      { value: "Secure", label: "Consultations" },
    ],
    sections: [
      {
        id: "testimonials",
        title: "What Users Say",
        text: "Users rely on G9 Experts for practical answers, convenient consultations, and professional support.",
        type: "cards",
        items: [
          { icon: "star", title: "Career consultation", text: "I connected with a career expert within minutes and got clear interview guidance. The experience felt professional and easy." },
          { icon: "star", title: "Legal guidance", text: "The lawyer consultation saved a lot of time. The response was fast, simple, and useful for understanding my next steps." },
          { icon: "star", title: "Business support", text: "I needed quick feedback on a business decision. The expert gave practical suggestions I could use immediately." },
          { icon: "star", title: "Astrology session", text: "The consultation was convenient, respectful, and clearly explained. I liked being able to choose the expert myself." },
          { icon: "star", title: "Finance help", text: "The advisor explained budgeting and planning in simple language. Wallet billing was transparent and easy to follow." },
          { icon: "star", title: "Service booking", text: "Finding a verified professional online was smooth. The service details and consultation options were clear." },
        ],
      },
      {
        id: "trust",
        title: "Trust Indicators",
        text: "Ratings, expert profiles, verified badges, and secure payment flows help users make confident decisions.",
        type: "cards",
        items: [
          { icon: "shield", title: "Verified Professionals", text: "Profile quality and visible trust signals support safer expert selection." },
          { icon: "message", title: "Secure Chat & Call", text: "Users can get help online without sharing unnecessary personal information." },
          { icon: "wallet", title: "Transparent Billing", text: "Wallet and pricing details make paid consultations easier to understand." },
        ],
      },
    ],
    cta: {
      title: "Ready to get guidance from a verified expert?",
      text: "Choose chat or call and connect with a professional online.",
      action: talkToExpert,
    },
  },

  howItWorks: {
    path: "/user/how-it-works",
    label: "For Customers",
    title: "How G9 Experts Works",
    subtitle:
      "A simple online flow to search your need, choose a verified professional, consult securely, and get practical guidance.",
    description:
      "Learn how G9 Experts works: choose a category, select an expert, start chat or call, pay securely, and get professional guidance online.",
    keywords: "how G9 Experts works, online expert consultation process, chat call consultation",
    badges: ["Choose category", "Select expert", "Chat or call", "Pay securely"],
    ctas: [talkToExpert, exploreCategories],
    sections: [
      {
        id: "journey",
        title: "Your Expert Consultation Journey",
        text: "G9 Experts is designed to help users move from problem to solution without unnecessary complexity.",
        type: "steps",
        items: [
          { title: "Choose a Category", text: "Search or browse categories like legal, career, business, health, astrology, finance, and more." },
          { title: "Select an Expert", text: "Review profiles, ratings, pricing, and availability before you connect." },
          { title: "Chat or Call Instantly", text: "Start secure online consultation through chat or call based on your preference." },
          { title: "Pay Securely", text: "Use wallet-based payments and pay for the consultation or service you use." },
        ],
      },
      {
        id: "benefits",
        title: "Built for Convenience",
        type: "cards",
        items: [
          { icon: "zap", title: "Fast Response", text: "Designed for users who need professional help without long appointment delays." },
          { icon: "shield", title: "Trust Signals", text: "Ratings, verified labels, and expert profiles help users choose better." },
          { icon: "grid", title: "Online Services", text: "Book online services or get consultation support from one marketplace." },
        ],
      },
    ],
    cta: {
      title: "Start your first consultation",
      text: "Find an expert, check the profile, and begin a secure chat or call.",
      action: talkToExpert,
    },
  },

  faq: {
    path: "/user/faq",
    label: "Help",
    title: "Frequently Asked Questions",
    subtitle:
      "Answers about users, experts, payments, refunds, wallet balance, chat, calls, accounts, and online services.",
    description:
      "Find answers to common G9 Experts questions about verified experts, chat and call consultation, wallet recharge, payments, refunds, and accounts.",
    keywords: "G9 Experts FAQ, expert consultation questions, wallet recharge help, chat call support",
    badges: ["User help", "Expert help", "Payment help", "Technical help"],
    searchPlaceholder: "Search FAQs about wallet, experts, chat, call, refunds...",
    sections: [
      {
        id: "faqs",
        title: "Common Questions",
        text: "Use these answers to understand the platform before connecting with a verified expert.",
        type: "faq",
        items: [
          { question: "Can I talk to a verified expert instantly?", answer: "Yes. Available experts can be contacted through secure chat or call depending on their status, pricing, and consultation mode." },
          { question: "How does per-minute chat or call consultation work?", answer: "The platform shows expert pricing and uses wallet-based billing where applicable. You can review balance and pricing before starting." },
          { question: "Can I choose an expert by category?", answer: "Yes. You can browse categories, compare expert profiles, and choose the professional who best matches your need." },
          { question: "Is my chat with the expert private and secure?", answer: "Consultations are designed to happen inside secure platform workflows. Avoid sharing unnecessary sensitive information unless required for your query." },
          { question: "How do I recharge my wallet before consultation?", answer: "Go to the wallet page, enter an amount or select a quick recharge option, and complete the payment through the available gateway." },
          { question: "What happens if my wallet balance is low?", answer: "You may be prompted to recharge before starting or continuing a paid consultation." },
          { question: "Can experts join G9 Experts?", answer: "Yes. Professionals can review the expert onboarding page, register, complete profile details, and follow platform guidelines." },
          { question: "How can I contact support?", answer: "Visit the support center for user, expert, payment, and technical help options." },
        ],
      },
    ],
    linksTitle: "Helpful Links",
    links: [
      { label: "Support Center", to: "/user/support" },
      { label: "Wallet", to: "/user/wallet" },
      { label: "Expert Guidelines", to: "/user/guidelines" },
      { label: "Terms & Conditions", to: "/user/terms" },
    ],
  },

  becomeExpert: {
    path: "/user/become-expert",
    label: "For Experts",
    title: "Become an Expert on G9 Experts",
    subtitle:
      "Share your professional knowledge, offer online consultation, build trust with users, and grow through a modern expert marketplace.",
    description:
      "Become an expert on G9 Experts. Offer chat and call consultation, online services, and professional guidance across trusted categories.",
    keywords: "become an expert, join G9 Experts, expert registration, online consultation earnings",
    badges: ["Flexible consultation", "Online services", "Profile visibility", "Secure payouts"],
    ctas: [becomeExpert, { label: "Earnings Model", to: "/user/earnings-model", variant: "secondary" }],
    stats: [
      { value: "Online", label: "Consultations" },
      { value: "Flexible", label: "Availability" },
      { value: "Multiple", label: "Categories" },
      { value: "Growth", label: "Profile building" },
    ],
    sections: [
      {
        id: "benefits",
        title: "Why Join G9 Experts",
        type: "cards",
        items: [
          { icon: "message", title: "Chat & Call Consultation", text: "Guide users through secure online conversations and real-time calls." },
          { icon: "wallet", title: "Earning Opportunities", text: "Earn through consultations, services, and category demand as your profile grows." },
          { icon: "star", title: "Build Your Reputation", text: "Ratings, reviews, and followers help trusted professionals stand out." },
        ],
      },
      {
        id: "process",
        title: "Registration Process",
        type: "steps",
        items: [
          { title: "Create Account", text: "Register with your basic professional details." },
          { title: "Complete Profile", text: "Add category, expertise, experience, education, pricing, and availability." },
          { title: "Review & Verification", text: "The platform reviews details for quality and trust signals." },
          { title: "Start Consulting", text: "Go live and begin helping users through chat, call, or online services." },
        ],
      },
    ],
    linksTitle: "Expert Resources",
    links: [
      { label: "Expert Guidelines", to: "/user/guidelines" },
      { label: "Earnings Model", to: "/user/earnings-model" },
      { label: "Support", to: "/user/support" },
    ],
    cta: {
      title: "Ready to grow as a verified professional?",
      text: "Create your expert profile and start building trust with users online.",
      action: becomeExpert,
    },
  },

  guidelines: {
    path: "/user/guidelines",
    label: "For Experts",
    title: "Expert Guidelines",
    subtitle:
      "Professional standards for expert profiles, communication, pricing, user trust, and platform conduct on G9 Experts.",
    description:
      "Read G9 Experts expert guidelines covering profile setup, communication standards, pricing guidance, user trust, and platform rules.",
    keywords: "G9 Experts expert guidelines, expert code of conduct, consultation rules, profile setup",
    badges: ["Code of conduct", "Profile quality", "User trust", "Clear pricing"],
    sections: [
      {
        id: "conduct",
        title: "Code of Conduct",
        text: "Experts should provide clear, respectful, honest, and category-appropriate guidance to every user.",
        type: "list",
        items: [
          "Use respectful language and avoid misleading claims.",
          "Stay within your expertise and explain limitations clearly.",
          "Do not request off-platform payments or unsafe personal information.",
          "Keep consultation communication professional and solution-focused.",
        ],
      },
      {
        id: "profile",
        title: "Profile Setup Checklist",
        type: "list",
        items: [
          "Add a clear profile photo, category, expertise, education, and experience.",
          "Write a simple professional summary users can understand quickly.",
          "Set transparent chat, call, and service pricing where available.",
          "Keep availability and language preferences accurate.",
        ],
      },
      {
        id: "trust",
        title: "User Trust Standards",
        type: "cards",
        items: [
          { icon: "shield", title: "Accuracy", text: "Keep your profile, pricing, and service details current." },
          { icon: "message", title: "Communication", text: "Respond clearly, avoid jargon, and summarize practical next steps." },
          { icon: "star", title: "Quality", text: "A consistent user experience improves ratings, reviews, and repeat consultations." },
        ],
      },
    ],
    linksTitle: "Expert Pages",
    links: [
      { label: "Become an Expert", to: "/user/become-expert" },
      { label: "Earnings Model", to: "/user/earnings-model" },
      { label: "Support", to: "/user/support" },
    ],
  },

  earningsModel: {
    path: "/user/earnings-model",
    label: "For Experts",
    title: "G9 Experts Earnings Model",
    subtitle:
      "Understand how experts can earn through chat, call, online services, repeat users, and profile growth opportunities.",
    description:
      "Learn how G9 Experts earnings work for professionals, including chat consultation, call consultation, services, wallet flow, and growth opportunities.",
    keywords: "G9 Experts earnings model, expert income, chat call earnings, online consultation payout",
    badges: ["Chat earnings", "Call earnings", "Service income", "Wallet flow"],
    ctas: [becomeExpert, { label: "Expert Guidelines", to: "/user/guidelines", variant: "secondary" }],
    sections: [
      {
        id: "earn",
        title: "How Experts Earn",
        text: "Experts can build income by offering timely, reliable, and valuable consultation experiences to users.",
        type: "cards",
        items: [
          { icon: "message", title: "Chat Consultation", text: "Earn from text-based consultation sessions where pricing is shown to users before starting." },
          { icon: "phone", title: "Call Consultation", text: "Offer real-time voice support for users who need faster, deeper discussion." },
          { icon: "grid", title: "Online Services", text: "Create service-style offerings where users can book defined professional help." },
          { icon: "trending", title: "Growth Opportunities", text: "Strong ratings, fast responses, and useful guidance can improve profile trust." },
        ],
      },
      {
        id: "examples",
        title: "Income Example Cards",
        text: "Actual earnings depend on availability, category demand, pricing, consultation quality, and platform policies.",
        type: "cards",
        items: [
          { icon: "wallet", title: "Starter Expert", text: "A new expert can focus on fast replies, profile completeness, and helpful short sessions." },
          { icon: "wallet", title: "Growing Expert", text: "Experts with reviews and repeat users can improve visibility and consultation volume." },
          { icon: "wallet", title: "Service Expert", text: "Experts can combine consultation with ready-to-book online services." },
        ],
      },
      {
        id: "payments",
        title: "Wallet and Payment Process",
        type: "list",
        items: [
          "Users pay through supported wallet or payment flows.",
          "Consultation and service records help track activity.",
          "Payout and settlement details follow platform rules and verification requirements.",
          "Experts should keep bank, identity, and tax-related information accurate where required.",
        ],
      },
    ],
    cta: {
      title: "Start building your expert income online",
      text: "Create a complete profile, follow guidelines, and offer professional guidance users can trust.",
      action: becomeExpert,
    },
  },

  support: {
    path: "/user/support",
    label: "Help Center",
    title: "G9 Experts Support Center",
    subtitle:
      "Find help for accounts, experts, payments, wallet recharge, chat, call, bookings, and technical issues.",
    description:
      "Contact G9 Experts support for help with users, experts, payments, wallet recharge, chat, call, bookings, refunds, and technical issues.",
    keywords: "G9 Experts support, help center, wallet help, chat call support, payment support",
    badges: ["User help", "Expert help", "Payment help", "Technical support"],
    searchPlaceholder: "Search help topics, wallet, chat, call, payment...",
    sections: [
      {
        id: "contact",
        title: "Contact Support",
        text: "Choose the support area closest to your issue so the team can respond with the right context.",
        type: "cards",
        items: [
          { icon: "users", title: "User Help", text: "Help with finding experts, consultation flow, reviews, accounts, and categories." },
          { icon: "briefcase", title: "Expert Help", text: "Help with onboarding, profile setup, availability, pricing, and platform rules." },
          { icon: "wallet", title: "Payment Help", text: "Wallet recharge, transaction status, billing questions, and refund review support." },
          { icon: "message", title: "Chat & Call Help", text: "Support for connection issues, session flow, and consultation experience." },
          { icon: "lock", title: "Account Safety", text: "Login concerns, suspicious activity, privacy requests, and account updates." },
          { icon: "settings", title: "Technical Help", text: "Page loading, mobile browser, notifications, and performance-related issues." },
        ],
      },
      {
        id: "common",
        title: "Common Issues",
        type: "faq",
        items: [
          { question: "My wallet recharge is not visible. What should I do?", answer: "Check transaction status and wait briefly for confirmation. If it still does not update, contact support with payment details." },
          { question: "I cannot start chat or call.", answer: "Confirm login status, wallet balance, internet connectivity, and expert availability. If the issue continues, contact support." },
          { question: "How do I report an expert or consultation issue?", answer: "Share the consultation details, expert profile, and issue summary through support so the team can review it." },
          { question: "Can experts get onboarding help?", answer: "Yes. Experts can use the guidelines, earnings model page, and support center for onboarding help." },
        ],
      },
    ],
    linksTitle: "Quick Help Links",
    links: [
      { label: "FAQ", to: "/user/faq" },
      { label: "Wallet", to: "/user/wallet" },
      { label: "Privacy Policy", to: "/user/privacy" },
      { label: "Terms & Conditions", to: "/user/terms" },
    ],
    cta: {
      title: "Still need help?",
      text: "Use the support center to get the right assistance for your account, payment, or consultation issue.",
      action: { label: "Start Expert Chat", to: "/user/call-chat?page=1&mode=chat" },
    },
  },
};

export const getFooterPage = (pageKey) => footerPages[pageKey];
