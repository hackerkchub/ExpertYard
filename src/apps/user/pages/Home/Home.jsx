import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiPhoneCall,
  FiCreditCard,
  FiFilter,
  FiGlobe,
  FiGrid,
  FiHeadphones,
  FiHome,
  FiLayers,
  FiLogIn,
  FiLogOut,
  FiLock,
  FiMenu,
  FiMessageCircle,
  FiSearch,
  FiShare2,
  FiShield,
  FiStar,
  FiUser,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { FaWallet } from "react-icons/fa";

import "./Home.css";
import HowItWorks from "../../components/howItWorks/HowItWorks";
import PopularServices from "./PopularServices";
import PopularQuestions from "../../components/faq/PopularQuestions";
import TestimonialsSection from "../../components/testimonials/TestimonialsSection";
import TrustStats from "../../components/trustStats/TrustStats";
import WhyChoose from "../../components/whyChoose/WhyChoose";
import {
  HeroBackdrop,
  HeroBadge,
  HeroCopy,
  HeroGradientWord,
  HeroHighlight,
  HeroImage,
  HeroInner,
  HeroSection,
  HeroSubtitle,
  HeroTitle,
  HeroTitleAccent,
  HeroTitleLine,
  HeroVisual,
  ImageShell,
} from "./Home.styles";

import heroExpertImage from "../../../../assets/hero.webp";
import logo from "../../../../assets/logo.webp";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { useWebPush } from "../../../../shared/hooks/useWebPush";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { usePublicExpert } from "../../context/PublicExpertContext";
import { useSeo } from "../../../../shared/seo/useSeo";
import { toAbsoluteUrl } from "../../../../shared/seo/siteConfig";
import { getCategoryPath } from "../../../../shared/utils/categoryRoutes";
import { getAllServices } from "../../../../shared/api/service.api";

const QUICK_ACTIONS = [
  {
    titleKey: "home.quickChat",
    subtitleKey: "home.instantReply",
    icon: FiZap,
    to: "/user/call-chat?page=1&mode=chat",
  },
  {
    titleKey: "home.quickCall",
    subtitleKey: "home.talkToExpert",
    icon: FiPhoneCall,
    to: "/user/call-chat?page=1&mode=call",
  },
  {
    titleKey: "home.consultAgain",
    subtitleKey: "home.continue",
    icon: FiClock,
    to: "/user/all-services",
  },
];

const MOBILE_QUICK_ACTIONS = [
  {
    label: "Call",
    icon: FiPhoneCall,
    to: "/user/call-chat?page=1&mode=call",
  },
  {
    label: "Chat",
    icon: FiMessageCircle,
    to: "/user/call-chat?page=1&mode=chat",
  },
  {
    label: "Services",
    icon: FiGrid,
    to: "/user/all-services",
  },
];

const FINAL_STATS = [
  { value: "50+", labelKey: "home.finalStats.categories" },
  { value: "1000+", labelKey: "home.finalStats.experts" },
  { value: "1L+", labelKey: "home.finalStats.consultations" },
  { value: "20K+", labelKey: "home.finalStats.reviews" },
];

const FALLBACK_CATEGORIES = [
  { id: "legal", name: "Legal", slug: "legal", meta_desc: "Talk to verified legal experts online for quick guidance." },
  { id: "health", name: "Health", slug: "health", meta_desc: "Get instant health advice from trusted professionals." },
  { id: "astrology", name: "Astrology", slug: "astrology", meta_desc: "Consult astrologers online for personal guidance." },
  { id: "fitness", name: "Fitness", slug: "fitness", meta_desc: "Connect with fitness experts for practical advice." },
  { id: "career", name: "Career Guidance", slug: "career-guidance", meta_desc: "Find career guidance experts online." },
  { id: "business", name: "Business", slug: "business", meta_desc: "Speak with business consultants online." },
  { id: "finance", name: "Finance", slug: "finance", meta_desc: "Get financial advisor support online." },
  { id: "property", name: "Property", slug: "property", meta_desc: "Consult property experts for real estate decisions." },
  { id: "relationship", name: "Relationship", slug: "relationship", meta_desc: "Talk to relationship advice experts online." },
  { id: "education", name: "Education", slug: "education", meta_desc: "Connect with education consultants online." },
];

const FALLBACK_SERVICES = [
  { id: "lawyer-consultation", title: "Lawyer Consultation Online", slug: "lawyer-consultation-online" },
  { id: "doctor-consultation", title: "Doctor Consultation Online", slug: "doctor-consultation-online" },
  { id: "astrologer-consultation", title: "Astrologer Consultation Online", slug: "astrologer-consultation-online" },
  { id: "fitness-consultation", title: "Fitness Expert Consultation", slug: "fitness-expert-consultation" },
  { id: "career-guidance", title: "Career Guidance Expert", slug: "career-guidance-expert" },
  { id: "business-consultant", title: "Business Consultant Online", slug: "business-consultant-online" },
  { id: "property-consultant", title: "Property Consultant Online", slug: "property-consultant-online" },
  { id: "financial-advisor", title: "Financial Advisor Online", slug: "financial-advisor-online" },
];

const STATIC_SEO_KEYWORDS = [
  "online expert consultation",
  "talk to verified experts",
  "chat with experts online",
  "instant expert advice",
  "lawyer consultation online",
  "doctor consultation online",
  "astrologer consultation online",
  "fitness expert consultation",
  "career guidance expert",
  "business consultant online",
  "property consultant online",
  "relationship advice expert",
  "financial advisor online",
  "parenting expert advice",
  "education consultant online",
];

const FAQ_ITEMS = [
  {
    questionKey: "home.homeFaq.whatIs.question",
    answerKey: "home.homeFaq.whatIs.answer",
  },
  {
    questionKey: "home.homeFaq.talkOnline.question",
    answerKey: "home.homeFaq.talkOnline.answer",
  },
  {
    questionKey: "home.homeFaq.verified.question",
    answerKey: "home.homeFaq.verified.answer",
  },
  {
    questionKey: "home.homeFaq.instant.question",
    answerKey: "home.homeFaq.instant.answer",
  },
  {
    questionKey: "home.homeFaq.wallet.question",
    answerKey: "home.homeFaq.wallet.answer",
  },
  {
    questionKey: "home.homeFaq.categories.question",
    answerKey: "home.homeFaq.categories.answer",
  },
  {
    questionKey: "home.homeFaq.availability.question",
    answerKey: "home.homeFaq.availability.answer",
  },
  {
    questionKey: "home.homeFaq.choose.question",
    answerKey: "home.homeFaq.choose.answer",
  },
];

const TRUST_POINTS = [
  { titleKey: "home.trustPoints.verifiedExperts", icon: FiShield },
  { titleKey: "home.trustPoints.instantChatCall", icon: FiHeadphones },
  { titleKey: "home.trustPoints.secureWalletPayment", icon: FiLock },
  { titleKey: "home.trustPoints.multipleCategories", icon: FiLayers },
  { titleKey: "home.trustPoints.affordableConsultation", icon: FiCreditCard },
  { titleKey: "home.trustPoints.expertAvailability", icon: FiZap },
  { titleKey: "home.trustPoints.transparentProfiles", icon: FiUsers },
  { titleKey: "home.trustPoints.ratingsReviews", icon: FiStar },
];

const HERO_SERVICE_CHIPS = ["Legal", "Health", "Astrology", "Business", "Finance", "Education", "More"];

const INTERNAL_LINKS = [
  { labelKey: "home.internalLinks.categories", to: "/user/categories" },
  { labelKey: "home.internalLinks.callChat", to: "/user/call-chat?page=1" },
  { labelKey: "home.internalLinks.services", to: "/user/all-services" },
  { labelKey: "home.internalLinks.about", to: "/user/about" },
  { labelKey: "home.internalLinks.contact", to: "/user/contact" },
  { labelKey: "home.internalLinks.privacy", to: "/user/privacy" },
  { labelKey: "home.internalLinks.terms", to: "/user/terms" },
  { labelKey: "home.internalLinks.faq", to: "/user/faq" },
];

function toSeoSlug(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getServiceName(service) {
  return service?.title || service?.name || service?.service_name || "Expert Service";
}

function getServiceSlug(service) {
  return service?.slug?.trim() || toSeoSlug(getServiceName(service)) || String(service?.id || "");
}

function getServicePath(service) {
  const slug = getServiceSlug(service);
  return slug ? `/user/service-details/${slug}` : "/user/all-services";
}

function getServiceImage(service) {
  return service?.image || service?.image_url || service?.service_image || service?.thumbnail || "";
}

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isLoggedIn, user, logout } = useAuth();
  const { balance } = useWallet();
  const { categories, loading: categoriesLoading } = useCategory();
  const { experts, expertsLoading } = usePublicExpert();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLanguageOpen, setMobileLanguageOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem("popular_services_cache");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [servicesLoading, setServicesLoading] = useState(services.length === 0);
  const topCategoriesRowRef = useRef(null);
  const [categoryScrollState, setCategoryScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  useWebPush({
    panel: "user",
    userId: user?.id,
  });

  useEffect(() => {
    document.body.classList.add("g9-home-route");

    return () => {
      document.body.classList.remove("g9-home-route");
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        setServicesLoading(true);
        const res = await getAllServices();
        const data = res?.data?.data || res?.data || [];
        const list = Array.isArray(data) ? data : [];

        if (!isMounted) return;

        setServices(list);
        localStorage.setItem("popular_services_cache", JSON.stringify(list));
      } catch (err) {
        console.error("Service load failed", err);
      } finally {
        if (isMounted) {
          setServicesLoading(false);
        }
      }
    };

    const hasIdleCallback = typeof window !== "undefined" && "requestIdleCallback" in window;
    const scheduledTask = hasIdleCallback
      ? window.requestIdleCallback(loadServices, { timeout: 1200 })
      : window.setTimeout(loadServices, 180);

    return () => {
      isMounted = false;

      if (hasIdleCallback) {
        window.cancelIdleCallback(scheduledTask);
      } else {
        window.clearTimeout(scheduledTask);
      }
    };
  }, []);

  const seoCategories = useMemo(
    () => (categories.length > 0 ? categories : !categoriesLoading ? FALLBACK_CATEGORIES : []),
    [categories, categoriesLoading]
  );

  const seoServices = useMemo(
    () => (services.length > 0 ? services : !servicesLoading ? FALLBACK_SERVICES : []),
    [services, servicesLoading]
  );

  const dynamicKeywords = useMemo(() => {
    const categoryKeywords = seoCategories.flatMap((category) => {
      const name = category.name;
      if (!name) return [];

      return [
        `${name} expert consultation`,
        `talk to verified ${name} experts online`,
        `best online consultation for ${name} services`,
      ];
    });

    const serviceKeywords = seoServices.flatMap((service) => {
      const name = getServiceName(service);
      if (!name) return [];

      return [
        `${name} advice`,
        `get instant ${name} advice from trusted professionals`,
      ];
    });

    return [...new Set([...STATIC_SEO_KEYWORDS, ...categoryKeywords, ...serviceKeywords])]
      .slice(0, 80)
      .join(", ");
  }, [seoCategories, seoServices]);

  const homeStructuredData = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "G9Experts",
        url: toAbsoluteUrl("/user"),
        logo: toAbsoluteUrl("/logo-512.webp"),
        description:
          "G9Experts is an online expert consultation platform that helps users connect with verified professionals by chat and call.",
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "G9Experts",
        url: toAbsoluteUrl("/user"),
        potentialAction: {
          "@type": "SearchAction",
          target: `${toAbsoluteUrl("/user/call-chat")}?page=1&mode=chat&q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: toAbsoluteUrl("/user"),
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: t(item.questionKey),
          acceptedAnswer: {
            "@type": "Answer",
            text: t(item.answerKey),
          },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Explore Expert Categories",
        url: toAbsoluteUrl("/user"),
        itemListElement: seoCategories.slice(0, 50).map((category, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: category.name,
          url: toAbsoluteUrl(getCategoryPath(category)),
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Popular Expert Services",
        url: toAbsoluteUrl("/user/all-services"),
        itemListElement: seoServices.slice(0, 50).map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: getServiceName(service),
          url: toAbsoluteUrl(getServicePath(service)),
        })),
      },
    ],
    [seoCategories, seoServices, t]
  );

  useSeo({
    title: t("home.seoMeta.title"),
    description: t("home.seoMeta.description"),
    canonicalPath: "/user",
    keywords: dynamicKeywords,
    og: {
      title: t("home.seoMeta.ogTitle"),
      description: t("home.seoMeta.ogDescription"),
      image: toAbsoluteUrl("/logo-512.webp"),
    },
    twitter: {
      title: t("home.seoMeta.twitterTitle"),
      description: t("home.seoMeta.twitterDescription"),
      image: toAbsoluteUrl("/logo-512.webp"),
    },
    structuredData: homeStructuredData,
  });

  const topCategories = seoCategories.slice(0, 15);
  const topServices = seoServices.slice(0, 16);
  const visibleExperts = experts.slice(0, 5);
  const mobileCategories = topCategories.slice(0, 5);
  const mobileServices = topServices.slice(0, 8);
  const mobileMenuItems = [
    { label: t("common.home"), to: "/user", icon: FiHome },
    { label: t("common.offers"), to: "/user/all-services", icon: FiGrid },
    { label: t("common.categories"), to: "/user/categories", icon: FiLayers },
    { label: t("common.history"), to: "/user/chat-history", icon: FiClock },
  ];

  const navigateFromMobileMenu = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const openLoginFromMobileMenu = () => {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;
    setMobileMenuOpen(false);
    navigate(`/user/auth?redirect=${encodeURIComponent(redirectPath)}`, {
      state: { from: location },
    });
  };

  const handleMobileLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const renderStars = (count = 5) =>
    Array.from({ length: count }).map((_, index) => (
      <FiStar key={index} className="star-icon" aria-hidden="true" />
    ));

  useEffect(() => {
    const row = topCategoriesRowRef.current;
    if (!row) return undefined;

    const updateScrollState = () => {
      const maxScroll = row.scrollWidth - row.clientWidth;
      setCategoryScrollState({
        canScrollLeft: row.scrollLeft > 2,
        canScrollRight: maxScroll > 2 && row.scrollLeft < maxScroll - 2,
      });
    };

    updateScrollState();
    row.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      row.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [categoriesLoading, topCategories.length]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const scrollTopCategories = (direction) => {
    const row = topCategoriesRowRef.current;
    if (!row) return;

    const card = row.querySelector(".category-card");
    const gap = Number.parseFloat(window.getComputedStyle(row).columnGap || "0") || 0;
    const cardWidth = card?.getBoundingClientRect().width || row.clientWidth / 2;

    row.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) * 2 : (cardWidth + gap) * 2,
      behavior: "smooth",
    });
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "GE";

  const submitMobileSearch = (event) => {
    event.preventDefault();
    const query = mobileSearch.trim();
    navigate(query ? `/user/search?q=${encodeURIComponent(query)}` : "/user/search");
  };

  const changeMobileLanguage = (language) => {
    i18n.changeLanguage(language);
    setMobileLanguageOpen(false);
  };

  return (
    <div className="home-page">
      <div className="mobile-home-app">
        <header className="mobile-home-header">
          <button
            type="button"
            className="mobile-icon-button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu />
          </button>
          <Link className="mobile-home-logo" to="/user" aria-label="G9Expert home">
            <img src={logo} alt="G9Expert" />
          </Link>
          <button type="button" className="mobile-wallet-card" onClick={() => navigate("/user/wallet")}>
            <FaWallet />
            <span>Rs {Math.floor(Number(balance || 0))}</span>
          </button>
          <button type="button" className="mobile-icon-button" onClick={() => navigate("/user/search")} aria-label="Search">
            <FiSearch />
          </button>
          <div className="mobile-language-wrap">
            <button
              type="button"
              className="mobile-language-button"
              onClick={() => setMobileLanguageOpen((prev) => !prev)}
              aria-label={t("common.language")}
              aria-expanded={mobileLanguageOpen}
            >
              <FiGlobe />
              <span>{i18n.language === "hi" ? "HI" : "EN"}</span>
            </button>
            {mobileLanguageOpen && (
              <div className="mobile-language-popover">
                <button type="button" onClick={() => changeMobileLanguage("en")} className={i18n.language === "en" ? "active" : ""}>
                  EN
                </button>
                <button type="button" onClick={() => changeMobileLanguage("hi")} className={i18n.language === "hi" ? "active" : ""}>
                  Hindi
                </button>
              </div>
            )}
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="mobile-home-menu-layer">
            <button
              type="button"
              className="mobile-home-menu-backdrop"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            />
            <aside className="mobile-home-menu" aria-label="Mobile menu">
              <div className="mobile-home-menu__brand">
                <img src={logo} alt="G9Expert" />
                <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  x
                </button>
              </div>
              {mobileMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                <button
                  key={item.to}
                  type="button"
                  className="mobile-home-menu__item"
                  onClick={() => navigateFromMobileMenu(item.to)}
                >
                  <Icon />
                  {item.label}
                </button>
                );
              })}
              <button
                type="button"
                className="mobile-home-menu__item"
                onClick={() => navigateFromMobileMenu("/user/wallet")}
              >
                <FaWallet />
                {t("common.wallet")}
                {isLoggedIn && balance > 0 && <span>Rs {Math.floor(balance)}</span>}
              </button>
              {isLoggedIn ? (
                <>
                  <button type="button" className="mobile-home-menu__item" onClick={() => navigateFromMobileMenu("/user")}>
                    <FiShare2 />
                    {t("Share")}
                  </button>
                  <button type="button" className="mobile-home-menu__item" onClick={() => navigateFromMobileMenu("/user")}>
                    <FiUser />
                    {t("nav.profile")}
                  </button>
                  <button type="button" className="mobile-home-menu__item" onClick={handleMobileLogout}>
                    <FiLogOut />
                    {t("common.logout")}
                  </button>
                </>
              ) : (
                <button type="button" className="mobile-home-menu__item" onClick={openLoginFromMobileMenu}>
                  <FiLogIn />
                  Login
                </button>
              )}
            </aside>
          </div>
        )}

        <form className="mobile-search-bar" onSubmit={submitMobileSearch}>
          <FiSearch aria-hidden="true" />
          <input
            type="search"
            value={mobileSearch}
            onChange={(event) => setMobileSearch(event.target.value)}
            placeholder="Search experts, services"
            aria-label="Search experts and services"
          />
          <button type="submit" aria-label="Search filters">
            <FiFilter />
          </button>
        </form>

        <section className="mobile-quick-actions" aria-label={t("home.quickActionsLabel")}>
          {MOBILE_QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} to={action.to} className="mobile-quick-action">
                <span>
                  <Icon />
                </span>
                <strong>{action.label}</strong>
              </Link>
            );
          })}
        </section>

        <section className="mobile-home-section">
          <div className="mobile-section-title">
            <h2>Categories</h2>
          </div>
          <div className="mobile-category-grid">
            {categoriesLoading && mobileCategories.length === 0
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div className="mobile-category-card mobile-category-card--loading" key={index} />
                ))
              : (
                  <>
                    {mobileCategories.map((category) => (
                      <Link key={category.id} to={getCategoryPath(category)} className="mobile-category-card">
                        <span className="mobile-category-media">
                          {category.image_url ? (
                            <img src={category.image_url} alt={category.name} loading="lazy" decoding="async" />
                          ) : (
                            category.name?.charAt(0)
                          )}
                        </span>
                        <strong>{category.name}</strong>
                      </Link>
                    ))}
                    <button type="button" className="mobile-category-card mobile-category-card--more" onClick={() => navigate("/user/categories")}>
                      <span className="mobile-category-media">+</span>
                      <strong>View More</strong>
                    </button>
                  </>
                )}
          </div>
        </section>

        <section className="mobile-home-section">
          <div className="mobile-section-title">
            <h2>Services</h2>
            <button type="button" onClick={() => navigate("/user/all-services")}>View all</button>
          </div>
          <div className="mobile-services-row">
            {(servicesLoading && mobileServices.length === 0 ? FALLBACK_SERVICES.slice(0, 4) : mobileServices).map((service) => {
              const serviceName = getServiceName(service);
              const serviceImage = getServiceImage(service);

              return (
                <Link key={service.id || getServiceSlug(service)} to={getServicePath(service)} className="mobile-service-card">
                  <div className="mobile-service-icon">
                    {serviceImage ? (
                      <img src={serviceImage} alt={serviceName} loading="lazy" decoding="async" />
                    ) : (
                      <FiHeadphones />
                    )}
                  </div>
                  <strong>{serviceName}</strong>
                  <span>Book now</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mobile-home-section">
          <div className="mobile-section-title">
            <h2>Experts</h2>
            <button type="button" onClick={() => navigate("/user/call-chat?page=1")}>View all</button>
          </div>
          <div className="mobile-experts-row">
            {expertsLoading && visibleExperts.length === 0
              ? Array.from({ length: 4 }).map((_, index) => <div className="mobile-expert-card mobile-expert-card--loading" key={index} />)
              : visibleExperts.map((expert) => (
                  <article key={expert.id} className="mobile-expert-card">
                    <button type="button" className="mobile-expert-main" onClick={() => navigate(`/user/experts/${expert.id}`)}>
                      <span className="mobile-expert-avatar">
                        {expert.profile_photo ? (
                          <img src={expert.profile_photo} alt={expert.name} loading="lazy" />
                        ) : (
                          getInitials(expert.name)
                        )}
                      </span>
                      <span className="mobile-expert-copy">
                        <strong>{expert.name}</strong>
                        <small>{expert.position || "Verified Expert"}</small>
                        <em><FiStar /> 4.8</em>
                      </span>
                    </button>
                    <div className="mobile-expert-actions">
                      <Link to={`/user/call-chat?page=1&mode=call&expert=${expert.id}`}>Call</Link>
                      <Link to={`/user/call-chat?page=1&mode=chat&expert=${expert.id}`}>Chat</Link>
                    </div>
                  </article>
                ))}
          </div>
        </section>

        <TestimonialsSection onViewAll={() => navigate("/user/reviews")} />
      </div>

      <div className="home-page__container">
        <HeroSection>
          <HeroBackdrop />
          <HeroInner>
            <HeroCopy>
              <HeroBadge>{t("home.heroBadge")}</HeroBadge>
              <HeroTitle>
                <HeroTitleLine $delay="0.08s">
                  {t("home.heroTitleLine1")}
                </HeroTitleLine>
                <HeroTitleLine $delay="0.14s">
                  <HeroGradientWord $delay="0.14s">{t("home.heroTitleLine2")}</HeroGradientWord>
                </HeroTitleLine>
              </HeroTitle>
              <HeroTitleAccent aria-hidden="true" />
              <HeroSubtitle>
                {t("home.heroSubtitleLong")}
              </HeroSubtitle>
              <HeroHighlight>{t("home.heroTrust")}</HeroHighlight>
              <div className="hero-chip-row hero-chip-row--services" aria-label="Popular service categories">
                {HERO_SERVICE_CHIPS.map((chip) => (
                  <span key={chip} className="hero-chip hero-chip--static">
                    {chip}
                  </span>
                ))}
              </div>
              <div className="hero-cta-row" aria-label={t("home.heroActionsLabel")}>
                <Link className="hero-primary-cta" to="/user/call-chat?page=1&mode=chat">
                  {t("common.talkToExpert")}
                </Link>
                <Link className="hero-secondary-cta" to="/user/all-services">
                  Explore Services
                </Link>
              </div>
            </HeroCopy>

            <HeroVisual>
              <ImageShell>
                <HeroImage src={heroExpertImage} alt={t("home.heroImageAlt")} />
              </ImageShell>
            </HeroVisual>

          </HeroInner>
        </HeroSection>

        <section className="quick-actions" aria-label={t("home.quickActionsLabel")}>
          {QUICK_ACTIONS.map((item) => {
            const Icon = item.icon;
            const title = t(item.titleKey);
            const subtitle = t(item.subtitleKey);

            if (item.disabled) {
              return (
                <button key={item.titleKey} type="button" className="quick-action quick-action--muted">
                  <span className="quick-action__icon">
                    <Icon />
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <small>{subtitle}</small>
                  </span>
                </button>
              );
            }

            return (
              <Link key={item.titleKey} to={item.to} className="quick-action">
                <span className="quick-action__icon">
                  <Icon />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{subtitle}</small>
                </span>
              </Link>
            );
          })}
        </section>

        <section className="home-section-card home-section-card--categories">
          <div className="section-topline">
            <div>
              <span className="section-kicker">{t("home.categoriesKicker")}</span>
              <h2>{t("home.categoriesTitle")}</h2>
            
            </div>
            <button type="button" className="section-link" onClick={() => navigate("/user/categories")}>
              {t("common.viewAll")}
            </button>
          </div>

          <div className="top-categories-scroll-shell">
            <button
              type="button"
              className={`top-categories-arrow top-categories-arrow--left${categoryScrollState.canScrollLeft ? "" : " top-categories-arrow--hidden"}`}
              onClick={() => scrollTopCategories("left")}
              aria-label={t("home.scrollCategoriesLeft")}
              disabled={!categoryScrollState.canScrollLeft}
            >
              <FiChevronLeft aria-hidden="true" />
            </button>

            <div className="category-grid-app top-categories-row" ref={topCategoriesRowRef}>
              {categoriesLoading && topCategories.length === 0
                ? Array.from({ length: 10 }).map((_, index) => (
                    <div className="category-card category-card--placeholder" key={index}>
                      <div className="category-card__media" />
                      <div className="category-card__line" />
                    </div>
                  ))
                : topCategories.map((category) => (
                    <Link key={category.id} to={getCategoryPath(category)} className="category-card">
                      <div className="category-card__media">
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt={t("home.categoryImageAlt", { category: category.name })}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span>{category.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="category-card__copy">
                        <strong>{category.name}</strong>
                      </div>
                    </Link>
                  ))}
            </div>

            <button
              type="button"
              className={`top-categories-arrow top-categories-arrow--right${categoryScrollState.canScrollRight ? "" : " top-categories-arrow--hidden"}`}
              onClick={() => scrollTopCategories("right")}
              aria-label={t("home.scrollCategoriesRight")}
              disabled={!categoryScrollState.canScrollRight}
            >
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
        </section>

        <PopularServices services={services} loading={servicesLoading} />

        <section className="home-section-card home-section-card--seo-text" aria-labelledby="home-seo-heading">
          <span className="section-kicker">{t("home.seoKicker")}</span>
          <h2 id="home-seo-heading">{t("home.seoTitle")}</h2>
          <div className="seo-keyword-grid" aria-label={t("home.popularConsultationSearches")}>
            {topCategories.slice(0, 8).map((category) => (
              <Link key={`seo-category-${category.id}`} to={getCategoryPath(category)}>
                {t("home.categorySeoLink", { category: category.name })}
              </Link>
            ))}
            {topServices.slice(0, 8).map((service) => (
              <Link key={`seo-service-${service.id || getServiceSlug(service)}`} to={getServicePath(service)}>
                {t("home.serviceSeoLink", { service: getServiceName(service) })}
              </Link>
            ))}
          </div>
        </section>

        <TrustStats />

        <HowItWorks />

        <section className="home-section-card home-section-card--experts">
          <div className="section-topline">
            <div>
              <span className="section-kicker">{t("home.expertsKicker")}</span>
              <h2>{t("home.recentlyActiveExperts")}</h2>
            </div>
            <button type="button" className="section-link" onClick={() => navigate("/user/call-chat?page=1")}>
              {t("common.viewAll")}
            </button>
          </div>

          <div className="experts-list">
            {expertsLoading && visibleExperts.length === 0 ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div className="expert-card-app expert-card-app--placeholder" key={index} />
              ))
            ) : (
              visibleExperts.map((expert) => {
                const expertPosition =
                  expert.position && expert.position !== "Verified Expert"
                    ? expert.position
                    : "";

                return (
                  <button
                    key={expert.id}
                    type="button"
                    className="expert-card-app"
                    onClick={() => navigate(`/user/experts/${expert.id}`)}
                  >
                    <div className="expert-card-app__avatar">
                      {expert.profile_photo ? (
                        <img src={expert.profile_photo} alt={expert.name} loading="lazy" />
                      ) : (
                        <span>{getInitials(expert.name)}</span>
                      )}
                      <i />
                    </div>
                    <div className="expert-card-app__info">
                      <strong>{expert.name}</strong>
                      {expertPosition && <small>{expertPosition}</small>}
                      <div className="expert-card-app__meta">
                        <span className="expert-rating">{renderStars(5)} 4.8</span>
                        <span className="expert-online">{t("home.online")}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <WhyChoose />
        
        <PopularQuestions onTalkToExpert={() => navigate("/user/call-chat?page=1&mode=chat")} />

        <section className="home-section-card home-section-card--links" aria-labelledby="internal-links-heading">
          <div className="section-topline section-topline--stack">
            <span className="section-kicker">{t("home.helpfulLinksKicker")}</span>
            <h2 id="internal-links-heading">{t("home.helpfulLinksTitle")}</h2>
          </div>
          <nav className="internal-link-grid" aria-label={t("home.importantPagesAria")}>
            {INTERNAL_LINKS.map((item) => (
              <Link key={item.to} to={item.to}>
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
        </section>

      

        <TestimonialsSection onViewAll={() => navigate("/user/reviews")} />

        <section className="support-banner">
          <div>
            <span className="section-kicker section-kicker--gold">{t("common.support")}</span>
            <h2  style={{ color: "#ffffff" }} >{t("home.haveQuestion")}</h2>
            <p>{t("home.helpText")}</p>
          </div>
          <button type="button" className="support-banner__button" onClick={() => navigate("/user/contact")}>
            {t("home.contactSupport")}
          </button>
        </section>

        <section className="stats-row-app" aria-label={t("home.platformStatsAria")}>
          {FINAL_STATS.map((item) => (
            <article key={item.labelKey} className="stats-row-app__item">
              <strong>{item.value}</strong>
              <span>{t(item.labelKey)}</span>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
