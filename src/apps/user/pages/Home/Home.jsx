import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiClock,
  FiMic,
  FiPhoneCall,
  FiPlayCircle,
  FiSearch,
  FiShield,
  FiStar,
  FiUserCheck,
  FiVideo,
  FiZap,
} from "react-icons/fi";

import "./Home.css";
import HowItWorks from "../../components/howItWorks/HowItWorks";
import PopularServices from "./PopularServices";
import PopularQuestions from "../../components/faq/PopularQuestions";
import TestimonialsSection from "../../components/testimonials/TestimonialsSection";
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

const QUICK_ACTIONS = [
  {
    title: "Chat",
    subtitle: "Instant Reply",
    icon: FiZap,
    to: "/user/call-chat?page=1&mode=chat",
  },
  {
    title: "Call",
    subtitle: "Talk to Expert",
    icon: FiPhoneCall,
    to: "/user/call-chat?page=1&mode=call",
  },
  {
    title: "Video Call",
    subtitle: "Face to Face",
    icon: FiVideo,
    disabled: true,
  },
  {
    title: "Consult Again",
    subtitle: "Continue",
    icon: FiClock,
    to: "/user/chat-history",
  },
];

const HERO_CHIPS = [
  "Legal Help",
  "Health Advice",
  "Business Services",
  "Career Guidance",
  "Astrology",
];

const TRUST_ITEMS = [
  { title: "Verified Experts", icon: FiUserCheck },
  { title: "Secure & Safe", icon: FiShield },
  { title: "Affordable Pricing", icon: FiStar },
];

const FINAL_STATS = [
  { value: "50+", label: "Categories" },
  { value: "1000+", label: "Experts" },
  { value: "1L+", label: "Consultations" },
  { value: "20K+", label: "Reviews" },
];

const FALLBACK_EXPERT = {
  id: "featured",
  name: "Aarav Mehta",
  position: "Legal Consultant",
  profile_photo: "",
  chat: 19,
  call: 29,
  session: { price: 199 },
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, loading: categoriesLoading } = useCategory();
  const { experts, expertsLoading } = usePublicExpert();
  const [searchTerm, setSearchTerm] = useState("");

  useWebPush({
    panel: "user",
    userId: user?.id,
  });

  const homeStructuredData = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "G9Experts",
        url: toAbsoluteUrl("/user"),
        logo: toAbsoluteUrl("/logo-512.webp"),
        description:
          "G9Experts is an online consultation platform that helps users connect with verified experts across high-intent categories.",
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
        "@type": "WebPage",
        name: "G9Experts Homepage",
        url: toAbsoluteUrl("/user"),
        description:
          "Connect with verified experts online through chat, call, and trust-focused consultations on G9Experts.",
      },
    ],
    []
  );

  useSeo({
    title: "Verified Experts for Online Consultation | G9Experts",
    description:
      "Connect with verified experts online for legal, health, finance, career, property, and more. G9Experts offers secure payments, real user ratings, and instant chat or call access.",
    canonicalPath: "/user",
    keywords:
      "verified experts online, online consultation platform, secure expert advice, expert chat and call, legal consultation online, health consultation online, finance experts online, trusted professional advice",
    og: {
      title: "Verified Experts for Online Consultation | G9Experts",
      description:
        "Connect with verified experts online for legal, health, finance, career, property, and more with secure payments and real user ratings.",
    },
    structuredData: homeStructuredData,
  });

  const topCategories = categories.slice(0, 8);
  const visibleExperts = experts.slice(0, 6);
  const expertOfTheDay = visibleExperts[0] || FALLBACK_EXPERT;
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

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "GE";

  const formatPrice = (value, fallback = "Ask") =>
    Number(value) > 0 ? `₹${Math.floor(value)}` : fallback;

  return (
    <div className="home-page">
      <div className="home-page__container">
        <HeroSection>
          <HeroBackdrop />
          <HeroInner>
            <HeroCopy>
              <HeroBadge>G9 Experts Online Consultation & Services</HeroBadge>
              <HeroTitle>
                <HeroTitleLine $delay="0.08s">
                  Instant Expert Help | <HeroGradientWord $delay="0.08s">Online Services</HeroGradientWord>
                </HeroTitleLine>
              </HeroTitle>
              <HeroTitleAccent aria-hidden="true" />
              <HeroSubtitle>
                Connect with trusted professionals, book online services, and get real
                solutions anytime through secure chat and call support.
              </HeroSubtitle>
              <HeroHighlight>
                Verified Professionals • Instant Chat & Call • Trusted Online Services
              </HeroHighlight>
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
                  placeholder="Search experts or online services"
                  aria-label="Search expert help"
                />
                <SearchButton type="submit" aria-label="Search help">
                  <FiMic />
                  <SearchButtonText>Search</SearchButtonText>
                </SearchButton>
              </SearchForm>

              <PillRow aria-label="Popular searches">
                <HeroPopularLabel>Popular searches:</HeroPopularLabel>
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

            if (item.disabled) {
              return (
                <button key={item.title} type="button" className="quick-action quick-action--muted">
                  <span className="quick-action__icon">
                    <Icon />
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.subtitle}</small>
                  </span>
                </button>
              );
            }

            return (
              <Link key={item.title} to={item.to} className="quick-action">
                <span className="quick-action__icon">
                  <Icon />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </span>
              </Link>
            );
          })}
        </section>

        <section className="home-section-card">
          <div className="section-topline">
            <div>
              <span className="section-kicker">Discover</span>
              <h2>Top Categories</h2>
            </div>
            <button type="button" className="section-link" onClick={() => navigate("/user/categories")}>
              View All
            </button>
          </div>

          <div className="category-grid-app">
            {categoriesLoading && topCategories.length === 0
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div className="category-card category-card--placeholder" key={index}>
                    <div className="category-card__media" />
                    <div className="category-card__line" />
                  </div>
                ))
              : topCategories.map((category) => (
                  <Link key={category.id} to={getCategoryPath(category)} className="category-card">
                    <div className="category-card__media">
                      {category.image_url ? (
                        <img src={category.image_url} alt={category.name} loading="lazy" />
                      ) : (
                        <span>{category.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="category-card__copy">
                      <strong>{category.name}</strong>
                      <small>Verified experts</small>
                    </div>
                  </Link>
                ))}
          </div>
        </section>

        <PopularServices />

        <section className="trust-banner">
          <div className="trust-banner__lead">
            <span className="trust-banner__icon">
              <FiShield />
            </span>
            <div>
              <strong>Trusted by 20,000+ Users</strong>
              <p>Built for safe, simple, and quick expert consultations.</p>
            </div>
          </div>
          <div className="trust-banner__items">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="trust-banner__item">
                  <Icon />
                  <span>{item.title}</span>
                </div>
              );
            })}
          </div>
        </section>

        <HowItWorks />

        <section className="home-section-card">
          <div className="section-topline">
            <div>
              <span className="section-kicker">Experts</span>
              <h2>Recently Active Experts</h2>
            </div>
            <button type="button" className="section-link" onClick={() => navigate("/user/call-chat?page=1")}>
              View All
            </button>
          </div>

          <div className="experts-list">
            {expertsLoading && visibleExperts.length === 0 ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div className="expert-card-app expert-card-app--placeholder" key={index} />
              ))
            ) : (
              visibleExperts.map((expert) => (
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
                    <small>{expert.position || "Verified Expert"}</small>
                    <div className="expert-card-app__meta">
                      <span className="expert-rating">{renderStars(5)} 4.8</span>
                      <span className="expert-online">Online</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        <WhyChoose />

        <section className="rating-panel">
          <div>
            <span className="section-kicker section-kicker--gold">User Ratings</span>
            <h2  style={{ color: "#ffffff" }} >Rated 4.8/5 by Users</h2>
            <div className="rating-panel__stars">{renderStars(5)}</div>
            <p>20K+ Happy Users</p>
          </div>
          <div className="rating-panel__aside">
            <div className="avatar-stack">
              {avatarExperts.length > 0
                ? avatarExperts.map((expert) => (
                    <span key={expert.id}>{getInitials(expert.name)}</span>
                  ))
                : ["A", "B", "C"].map((item) => <span key={item}>{item}</span>)}
            </div>
            <strong>98% Positive Feedback</strong>
            <small>Trusted support across legal, health, finance, and career topics.</small>
          </div>
        </section>

        <PopularQuestions onTalkToExpert={() => navigate("/user/call-chat?page=1&mode=chat")} />

      

        <TestimonialsSection onViewAll={() => navigate("/user/reviews")} />

        <section className="support-banner">
          <div>
            <span className="section-kicker section-kicker--gold">Support</span>
            <h2  style={{ color: "#ffffff" }} >Have a Question?</h2>
            <p>We are here to help you!</p>
          </div>
          <button type="button" className="support-banner__button" onClick={() => navigate("/user/contact")}>
            Contact Support
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
