import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiMic,
  FiPhoneCall,
  FiCreditCard,
  FiHeadphones,
  FiLayers,
  FiLock,
  FiSearch,
  FiShield,
  FiStar,
  FiUsers,
  FiZap,
} from "react-icons/fi";

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
  HeroPopularLabel,
  HeroSearchArea,
  HeroSection,
  HeroSubtitle,
  HeroTitle,
  HeroTitleAccent,
  HeroTitleLine,
  HeroVisual,
  ImageShell,
  PillButton,
  PillRow,
  SearchButton,
  SearchButtonText,
  SearchForm,
  SearchIconWrap,
  SearchInput,
} from "./Home.styles";

import heroExpertImage from "../../../../assets/hero.webp";
import { useAuth } from "../../../../shared/context/UserAuthContext";
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

const HERO_CHIPS = [
  "Legal Help",
  "Health Advice",
  "Business Services",
  "Career Guidance",
  "Astrology",
];

const FINAL_STATS = [
  { value: "50+", label: "Categories" },
  { value: "1000+", label: "Experts" },
  { value: "1L+", label: "Consultations" },
  { value: "20K+", label: "Reviews" },
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
    question: "What is G9Experts?",
    answer:
      "G9Experts is an online expert consultation platform where users can connect with verified professionals for advice across personal, professional, business, legal, health, education, finance, property, astrology, relationship, and lifestyle topics.",
  },
  {
    question: "How can I talk to an expert online?",
    answer:
      "Choose a category, browse verified expert profiles, and start an online consultation by chat or call from the G9Experts user app.",
  },
  {
    question: "Are experts on G9Experts verified?",
    answer:
      "G9Experts highlights verified expert profiles so users can review professional details, ratings, and consultation options before connecting.",
  },
  {
    question: "Can I chat or call experts instantly?",
    answer:
      "Yes. Available experts can be reached through instant chat or call consultation, depending on their current availability and pricing setup.",
  },
  {
    question: "How does wallet payment work?",
    answer:
      "Users can add balance to the secure G9Experts wallet and pay for eligible chat, call, or service consultations through wallet deduction.",
  },
  {
    question: "Which categories are available on G9Experts?",
    answer:
      "G9Experts supports multiple consultation categories including legal, health, astrology, fitness, business, career, finance, property, relationship, education, parenting, and more as available on the platform.",
  },
  {
    question: "Is G9Experts available 24/7?",
    answer:
      "Users can browse the platform anytime. Expert availability for chat or call depends on each verified professional's live status and schedule.",
  },
  {
    question: "How do I choose the right expert?",
    answer:
      "Compare expert profiles, categories, services, ratings, reviews, pricing, and availability to choose the professional who best matches your consultation need.",
  },
];

const TRUST_POINTS = [
  { title: "Verified Experts", icon: FiShield },
  { title: "Instant Chat & Call", icon: FiHeadphones },
  { title: "Secure Wallet Payment", icon: FiLock },
  { title: "Multiple Categories", icon: FiLayers },
  { title: "Affordable Per-Minute Consultation", icon: FiCreditCard },
  { title: "24/7 Expert Availability", icon: FiZap },
  { title: "Transparent Expert Profiles", icon: FiUsers },
  { title: "Ratings & Reviews", icon: FiStar },
];

const INTERNAL_LINKS = [
  { label: "Browse verified expert categories", to: "/user/categories" },
  { label: "Find online experts for chat or call", to: "/user/call-chat?page=1" },
  { label: "Book popular expert services", to: "/user/all-services" },
  { label: "Learn about G9Experts", to: "/user/about" },
  { label: "Contact G9Experts support", to: "/user/contact" },
  { label: "Read G9Experts privacy policy", to: "/user/privacy" },
  { label: "View G9Experts terms and conditions", to: "/user/terms" },
  { label: "Read expert consultation FAQs", to: "/user/faq" },
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

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { categories, loading: categoriesLoading } = useCategory();
  const { experts, expertsLoading } = usePublicExpert();
  const [searchTerm, setSearchTerm] = useState("");
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
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
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
    [seoCategories, seoServices]
  );

  useSeo({
    title: "G9Experts - Talk to Verified Experts Online | Instant Chat & Call Consultation",
    description:
      "Connect with verified experts online on G9Experts. Get instant chat and call consultation for legal, health, astrology, fitness, business, career, finance, property, relationship, education and more.",
    canonicalPath: "/user",
    keywords: dynamicKeywords,
    og: {
      title: "G9Experts - Talk to Verified Experts Online",
      description:
        "Get instant chat and call consultation from verified experts across legal, health, astrology, fitness, business, career, finance, property, relationship, education and more.",
      image: toAbsoluteUrl("/logo-512.webp"),
    },
    twitter: {
      title: "G9Experts - Talk to Verified Experts Online",
      description:
        "Connect with trusted professionals online for instant expert advice by chat or call.",
      image: toAbsoluteUrl("/logo-512.webp"),
    },
    structuredData: homeStructuredData,
  });

  const topCategories = seoCategories.slice(0, 15);
  const topServices = seoServices.slice(0, 16);
  const visibleExperts = experts.slice(0, 5);
  const avatarExperts = visibleExperts.slice(0, 3);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    const target = query
      ? `/user/call-chat?page=1&mode=chat&q=${encodeURIComponent(query)}`
      : "/user/call-chat?page=1&mode=chat";
    navigate(target);
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
      <div className="home-page__container">
        <HeroSection>
          <HeroBackdrop />
          <HeroInner>
            <HeroCopy>
              <HeroBadge>{t("home.heroBadge")}</HeroBadge>
              <HeroTitle>
                <HeroTitleLine $delay="0.08s">
                  Talk to Verified Experts Online
                </HeroTitleLine>
                <HeroTitleLine $delay="0.14s">
                  <HeroGradientWord $delay="0.14s">Get Instant Advice Anytime</HeroGradientWord>
                </HeroTitleLine>
              </HeroTitle>
              <HeroTitleAccent aria-hidden="true" />
              <HeroSubtitle>
                G9Experts connects you with trusted professionals across multiple categories like legal, health, astrology, fitness, business, career, finance, property, relationship, education and more.
              </HeroSubtitle>
              <HeroHighlight>{t("home.heroTrust")}</HeroHighlight>
              <div className="hero-cta-row" aria-label="Home page expert consultation actions">
                <Link className="hero-primary-cta" to="/user/call-chat?page=1&mode=chat">
                  Talk to Expert
                </Link>
                <Link className="hero-secondary-cta" to="/user/categories">
                  Explore Categories
                </Link>
              </div>
            </HeroCopy>

            <HeroVisual>
              <ImageShell>
                <HeroImage src={heroExpertImage} alt="G9Experts expert panel with lawyer, doctor, astrologer, and business professionals" />
              </ImageShell>
            </HeroVisual>

            <HeroSearchArea>
              <SearchForm onSubmit={handleSearch}>
                <SearchIconWrap aria-hidden="true">
                  <FiSearch />
                </SearchIconWrap>
                <SearchInput
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t("home.searchPlaceholder")}
                  aria-label={t("home.searchAria")}
                />
                <SearchButton type="submit" aria-label={t("home.searchAria")}>
                  <FiMic />
                  <SearchButtonText>{t("common.search")}</SearchButtonText>
                </SearchButton>
              </SearchForm>

              <PillRow aria-label={t("home.popularSearches")}>
                <HeroPopularLabel>{t("home.popularSearches")}</HeroPopularLabel>
                {HERO_CHIPS.map((chip) => (
                  <PillButton
                    key={chip}
                    type="button"
                    onClick={() => navigate("/user/categories")}
                  >
                    {chip}
                  </PillButton>
                ))}
              </PillRow>
            </HeroSearchArea>
          </HeroInner>
        </HeroSection>

        <section className="quick-actions" aria-label="Quick actions">
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
              <span className="section-kicker">Expert Categories</span>
              <h2>Explore Expert Categories</h2>
              <p className="section-copy">
                Find verified experts across multiple professional categories and get instant consultation by chat or call.
              </p>
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
              aria-label="Scroll categories left"
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
                            alt={`Talk to verified ${category.name} experts online`}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span>{category.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="category-card__copy">
                        <strong>{category.name}</strong>
                        <small>Talk to verified {category.name} experts online</small>
                      </div>
                    </Link>
                  ))}
            </div>

            <button
              type="button"
              className={`top-categories-arrow top-categories-arrow--right${categoryScrollState.canScrollRight ? "" : " top-categories-arrow--hidden"}`}
              onClick={() => scrollTopCategories("right")}
              aria-label="Scroll categories right"
              disabled={!categoryScrollState.canScrollRight}
            >
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
        </section>

        <PopularServices services={services} loading={servicesLoading} />

        <section className="home-section-card home-section-card--seo-text" aria-labelledby="home-seo-heading">
          <span className="section-kicker">Online Expert Consultation</span>
          <h2 id="home-seo-heading">Instant expert advice from trusted professionals</h2>
          <p>
            G9Experts is an online expert consultation platform where users can instantly connect with verified professionals for personal, professional, business, legal, health, education, relationship, astrology, finance, property and lifestyle advice. Whether you need quick guidance, detailed consultation, or expert support, G9Experts helps you find the right expert anytime.
          </p>
          <div className="seo-keyword-grid" aria-label="Popular consultation searches">
            {topCategories.slice(0, 8).map((category) => (
              <Link key={`seo-category-${category.id}`} to={getCategoryPath(category)}>
                Best online consultation for {category.name} services
              </Link>
            ))}
            {topServices.slice(0, 8).map((service) => (
              <Link key={`seo-service-${service.id || getServiceSlug(service)}`} to={getServicePath(service)}>
                Get instant {getServiceName(service)} advice from trusted professionals
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

        <section className="home-section-card home-section-card--trust" aria-labelledby="why-g9experts-heading">
          <div className="section-topline section-topline--stack">
            <span className="section-kicker">Why Choose G9Experts</span>
            <h2 id="why-g9experts-heading">Trusted online consultation built for fast decisions</h2>
            <p className="section-copy">
              Compare experts, review pricing, and start secure chat or call consultations across multiple categories.
            </p>
          </div>
          <div className="trust-points-grid">
            {TRUST_POINTS.map((point) => {
              const Icon = point.icon;

              return (
                <article key={point.title} className="trust-point-card">
                  <span aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{point.title}</h3>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rating-panel">
          <div>
            <span className="section-kicker section-kicker--gold">{t("home.userRatings")}</span>
            <h2  style={{ color: "#ffffff" }} >{t("home.ratedByUsers")}</h2>
            <div className="rating-panel__stars">{renderStars(5)}</div>
            <p>{t("home.happyUsers")}</p>
          </div>
          <div className="rating-panel__aside">
            <div className="avatar-stack">
              {avatarExperts.length > 0
                ? avatarExperts.map((expert) => (
                    <span key={expert.id}>{getInitials(expert.name)}</span>
                  ))
                : ["A", "B", "C"].map((item) => <span key={item}>{item}</span>)}
            </div>
            <strong>{t("home.positiveFeedback")}</strong>
            <small>{t("home.trustedTopics")}</small>
          </div>
        </section>

        <section className="home-section-card home-section-card--faq" aria-labelledby="home-faq-heading">
          <div className="section-topline section-topline--stack">
            <span className="section-kicker">FAQ</span>
            <h2 id="home-faq-heading">Expert consultation questions</h2>
            <p className="section-copy">
              Answers for users comparing online expert consultation, wallet payment, chat, call, and category availability.
            </p>
          </div>
          <div className="home-faq-list">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="home-faq-item">
                <summary>
                  <h3>{item.question}</h3>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <PopularQuestions onTalkToExpert={() => navigate("/user/call-chat?page=1&mode=chat")} />

        <section className="home-section-card home-section-card--links" aria-labelledby="internal-links-heading">
          <div className="section-topline section-topline--stack">
            <span className="section-kicker">Helpful Links</span>
            <h2 id="internal-links-heading">Find expert consultation pages faster</h2>
          </div>
          <nav className="internal-link-grid" aria-label="G9Experts important pages">
            {INTERNAL_LINKS.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
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

        <section className="stats-row-app" aria-label="Platform stats">
          {FINAL_STATS.map((item) => (
            <article key={item.label} className="stats-row-app__item">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
