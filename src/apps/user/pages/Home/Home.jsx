import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiPhoneCall,
  FiCreditCard,
  FiGrid,
  FiHeadphones,
  FiHome,
  FiLayers,
  FiLogIn,
  FiLogOut,
  FiLock,
  FiMenu,
  FiMessageCircle,
  FiMonitor,
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
import { APP_CONFIG } from "../../../../config/appConfig";
import HowItWorks from "../../components/howItWorks/HowItWorks";
import PopularServices from "./PopularServices";
import PopularQuestions from "../../components/faq/PopularQuestions";
import TestimonialsSection from "../../components/testimonials/TestimonialsSection";
import TrustStats from "../../components/trustStats/TrustStats";
import WhyChoose from "../../components/whyChoose/WhyChoose";
import BannerSlider from "../../components/BannerSlider/BannerSlider";
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
import { LocationSelector } from "../../../../shared/components";
import { getBannersApi } from "../../../../shared/api/admin/banner.api";

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
    subtitle: "Talk now",
    icon: FiPhoneCall,
    to: "/user/call-chat?page=1&mode=call",
  },
  {
    label: "Chat",
    subtitle: "Instant reply",
    icon: FiMessageCircle,
    to: "/user/call-chat?page=1&mode=chat",
  },
  {
    label: "Services",
    subtitle: "Book help",
    icon: FiGrid,
    to: "/user/all-services",
  },
];

const TRUST_STRIP_ITEMS = [
  { title: "100% Secure", description: "Protected payments", icon: FiShield },
  { title: "24/7 Support", description: "Always available", icon: FiHeadphones },
  { title: "Verified Experts", description: "Trusted profiles", icon: FiCheckCircle },
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

const BACKEND_ASSET_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || APP_CONFIG.API_BASE_URL || "";

function resolveAssetUrl(value = "") {
  const url = String(value || "").trim();
  if (!url) return "";

  if (/^(https?:|data:|blob:)/i.test(url)) {
    return url;
  }

  const base = BACKEND_ASSET_BASE_URL.replace(/\/+$/, "");
  const path = url.replace(/^\/+/, "");
  return base ? `${base}/${path}` : `/${path}`;
}

function getUserDisplayName(user) {
  return (
    user?.name ||
    user?.full_name ||
    user?.fullName ||
    user?.first_name ||
    user?.username ||
    "User"
  );
}

function getUserProfileImage(user) {
  return resolveAssetUrl(
    user?.profile_photo ||
      user?.profile_image ||
      user?.avatar ||
      user?.image ||
      user?.photo ||
      ""
  );
}

function getCategoryName(category) {
  return category?.name || category?.title || category?.category_name || "Category";
}

function getCategoryImage(category) {
  return resolveAssetUrl(
    category?.image_url ||
      category?.image ||
      category?.icon ||
      category?.category_image ||
      category?.thumbnail ||
      ""
  );
}

function getServicePrice(service) {
  const value =
    service?.price ??
    service?.amount ??
    service?.service_price ??
    service?.session_price ??
    service?.charges ??
    null;

  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0
    ? `Rs ${Math.floor(numericValue)}`
    : "View price";
}

function ImageWithFallback({ src, alt, className, fallbackIcon: FallbackIcon = FiGrid }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className={`${className || ""} premium-mobile-image-fallback`.trim()} aria-hidden="true">
        <FallbackIcon />
      </span>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function Header({
  logo,
  onMenuOpen,
}) {
  return (
    <header className="premium-mobile-header">
      <button type="button" className="premium-mobile-icon-button" onClick={onMenuOpen} aria-label="Open menu">
        <FiMenu />
      </button>
      <Link className="premium-mobile-logo" to="/user" aria-label="G9 Expert home">
        <img src={logo} alt="G9 Expert" />
      </Link>
      <div className="premium-mobile-location">
        <LocationSelector />
      </div>
    </header>
  );
}

function WelcomeSection({ isLoggedIn, loading, onLogin, user }) {
  if (loading) {
    return (
      <section className="premium-mobile-welcome" aria-label="Welcome">
        <span className="premium-mobile-text-skeleton" />
        <h1 className="premium-mobile-title-skeleton" />
      </section>
    );
  }

  return (
    <section className="premium-mobile-welcome" aria-label="Welcome">
      {isLoggedIn ? (
        <h1 className="premium-mobile-welcome-line">
          <span>Welcome back,</span>
          <strong>{getUserDisplayName(user)}</strong>
        </h1>
      ) : (
        <>
          <h1>Welcome to G9 Expert</h1>
          <button type="button" onClick={onLogin}>
            Login / Register
          </button>
        </>
      )}
    </section>
  );
}

function HeroBanner({ onExplore }) {
  return (
    <section className="premium-mobile-hero" aria-label="Trusted advice">
      <div className="premium-mobile-hero__copy">
        <h2>Trusted Advice, Expert Solutions</h2>
        <p>Connect with verified experts and get the right solution.</p>
        <button type="button" onClick={onExplore}>
          Explore Now
        </button>
      </div>
      <div className="premium-mobile-hero__visual" aria-hidden="true">
        <div className="premium-mobile-consultant">
          <FiUser />
        </div>
      </div>
    </section>
  );
}

function SearchBar({ onOpen }) {
  return (
    <button
      type="button"
      className="premium-mobile-search premium-mobile-search--trigger"
      onClick={onOpen}
      aria-label="Open search"
    >
      <FiSearch aria-hidden="true" />
      <span>Search experts, services, categories</span>
      <span className="premium-mobile-search__chip">Search</span>
    </button>
  );
}

function QuickActions({ actions }) {
  return (
    <section className="premium-mobile-quick-actions" aria-label="Quick actions">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.label} to={action.to} className="premium-mobile-action-card">
            <span className="premium-mobile-action-card__icon">
              <Icon />
            </span>
            <span>
              <strong>{action.label}</strong>
              <small>{action.subtitle}</small>
            </span>
            <FiArrowRight className="premium-mobile-action-card__arrow" />
          </Link>
        );
      })}
    </section>
  );
}

function MobileSectionHeading({ title, onViewAll }) {
  return (
    <div className="premium-mobile-section-heading">
      <h2>{title}</h2>
      {onViewAll ? (
        <button type="button" onClick={onViewAll}>
          View all <FiArrowRight />
        </button>
      ) : null}
    </div>
  );
}

function CategorySection({ categories, error, loading, onViewAll }) {
  return (
    <section className="premium-mobile-section">
      <MobileSectionHeading title="Categories" onViewAll={onViewAll} />
      <div className="premium-mobile-category-row">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="premium-mobile-category-card premium-mobile-card-skeleton" />
          ))
        ) : error ? (
          <div className="premium-mobile-state-card">Unable to load categories</div>
        ) : categories.length === 0 ? (
          <div className="premium-mobile-state-card">No categories found</div>
        ) : (
          categories.map((category) => {
            const categoryName = getCategoryName(category);
            const categoryImage = getCategoryImage(category);
            return (
              <Link
                key={category?.id || category?.slug || categoryName}
                to={getCategoryPath(category)}
                className="premium-mobile-category-card"
              >
                <span>
                  <ImageWithFallback src={categoryImage} alt={categoryName} fallbackIcon={FiGrid} />
                </span>
                <strong>{categoryName}</strong>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}

function ConsultationCard({ onBook }) {
  return (
    <section className="premium-mobile-consultation-card">
      <div className="premium-mobile-consultation-card__icon">
        <FiMonitor />
      </div>
      <div>
        <span>Need Digital Help?</span>
        <h2>Book Digital Services</h2>
       <p>
Explore verified services from Lawyers, Astrologers, Doctors, Business Experts, and more.
Book the service you need and connect with trusted professionals instantly.
</p>
        <button type="button" onClick={onBook}>
          Book Now <FiArrowRight />
        </button>
      </div>
    </section>
  );
}

function ServicesSection({ error, loading, onViewAll, services }) {
  return (
    <section className="premium-mobile-section">
      <MobileSectionHeading title="Services" onViewAll={onViewAll} />
      <div className="premium-mobile-services-row">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="premium-mobile-service-card premium-mobile-card-skeleton" />
          ))
        ) : error ? (
          <div className="premium-mobile-state-card">Unable to load services</div>
        ) : services.length === 0 ? (
          <div className="premium-mobile-state-card">No services found</div>
        ) : (
          services.map((service) => {
            const serviceName = getServiceName(service);
            const serviceImage = resolveAssetUrl(getServiceImage(service));
            return (
            <Link
              key={service?.id || service?.slug || serviceName}
              to={getServicePath(service)}
              className="premium-mobile-service-card"
            >
              <span className="premium-mobile-service-card__image">
                <ImageWithFallback src={serviceImage} alt={serviceName} fallbackIcon={FiHeadphones} />
              </span>
              <strong>{serviceName}</strong>
              <div>
                <em>{getServicePrice(service)}</em>
                <span className="premium-mobile-service-card__button">Book Now</span>
              </div>
            </Link>
            );
          })
        )}
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="premium-mobile-trust-strip" aria-label="Trust and safety">
      {TRUST_STRIP_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title}>
            <Icon />
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </div>
        );
      })}
    </section>
  );
}

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isLoggedIn, user, logout } = useAuth();
  const { balance } = useWallet();
  const {
    categories,
    error: categoriesError,
    loading: categoriesLoading,
  } = useCategory();
  const { experts, expertsLoading } = usePublicExpert();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem("popular_services_cache");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [banners, setBanners] = useState([]);
const [bannerLoading, setBannerLoading] =
  useState(true);


  const [servicesLoading, setServicesLoading] = useState(services.length === 0);
  const [servicesError, setServicesError] = useState(null);
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
        setServicesError(null);
        const res = await getAllServices();
        const data = res?.data?.data || res?.data || [];
        const list = Array.isArray(data) ? data : [];

        if (!isMounted) return;

        setServices(list);
        localStorage.setItem("popular_services_cache", JSON.stringify(list));
      } catch (err) {
        console.error("Service load failed", err);
        setServicesError(err);
        setServices([]);
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

  useEffect(() => {
  const loadBanners = async () => {
    try {
      const res =
        await getBannersApi(
          "home_hero"
        );

      setBanners(
        res?.data || []
      );
    } catch (err) {
      console.error(
        "Banner load failed",
        err
      );
    } finally {
      setBannerLoading(false);
    }
  };

  loadBanners();
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
  const mobileCategories = Array.isArray(categories) ? categories.slice(0, 12) : [];
  const mobileServices = Array.isArray(services) ? services.slice(0, 10) : [];
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

  return (
    <div className="home-page">
      <div className="mobile-home-app">
        <Header
          logo={logo}
          onMenuOpen={() => setMobileMenuOpen(true)}
        />

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

        <WelcomeSection
          isLoggedIn={isLoggedIn}
          loading={Boolean(isLoggedIn && !user)}
          onLogin={() => navigate("/user/auth")}
          user={user}
        />
       <SearchBar
  onOpen={() =>
    navigate("/user/search")
  }
/>

{banners.length > 0 && (
  <BannerSlider
    banners={banners}
  />
)}

<HeroBanner
  onExplore={() =>
    navigate(
      "/user/call-chat?page=1"
    )
  }
/>
        <QuickActions actions={MOBILE_QUICK_ACTIONS} />
        <CategorySection
          categories={mobileCategories}
          error={categoriesError}
          loading={categoriesLoading}
          onViewAll={() => navigate("/user/categories")}
        />
        <ConsultationCard onBook={() => navigate("/user/all-services")} />
        <ServicesSection
          error={servicesError}
          loading={servicesLoading}
          onViewAll={() => navigate("/user/all-services")}
          services={mobileServices}
        />
        <TestimonialsSection
          onViewAll={() => navigate("/user/reviews")}
          titleOverride="Ratings & Reviews"
        />
        <TrustStrip />
      </div>

      <div className="home-page__container">

         {banners.length > 0 && (
    <BannerSlider
      banners={banners}
    />
  )}
  
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
