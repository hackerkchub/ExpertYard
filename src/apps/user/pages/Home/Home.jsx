import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import Categories from "../../components/HomeComponent/Categories";
import Hero from "../../components/HomeComponent/Hero";
import HowItWorks from "../../components/HomeComponent/HowItWorks";
import Testimonials from "../../components/HomeComponent/Testimonials";
import "./Home.css";

import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWebPush } from "../../../../shared/hooks/useWebPush";
import PopularServices from "./PopularServices";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { useSeo } from "../../../../shared/seo/useSeo";
import { toAbsoluteUrl } from "../../../../shared/seo/siteConfig";
import { getCategoryPath } from "../../../../shared/utils/categoryRoutes";

const TRUST_PILLARS = [
  {
    title: "Verified Experts",
    description:
      "Profiles are built around verified professionals so users can review expertise before starting a consultation.",
  },
  {
    title: "Secure Payments",
    description:
      "Clear payment flows and wallet support help users book expert advice with confidence.",
  },
  {
    title: "Real User Ratings",
    description:
      "Ratings and review signals make it easier to compare experts and choose the right fit.",
  },
  {
    title: "Instant Connect",
    description:
      "Users can move from discovery to a private chat or call without unnecessary steps.",
  },
];

const TRUST_STATS = [
  { value: "10k+", label: "happy users" },
  { value: "20+", label: "expert categories" },
  { value: "Private", label: "chat and call sessions" },
  { value: "4.9/5", label: "average user-rated experience" },
];

const CTA_REASSURANCE = [
  "Private conversations and account protection",
  "Secure payments before expert sessions",
  "Clear ratings, pricing, and category context",
];

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories } = useCategory();

  useWebPush({
    panel: "user",
    userId: user?.id,
  });

  const featuredCategories = categories.slice(0, 8);
  const homeStructuredData = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ExpertYard",
        url: toAbsoluteUrl("/user"),
        logo: toAbsoluteUrl("/logo-512.webp"),
        description:
          "ExpertYard is an online consultation platform that helps users connect with verified experts across high-intent categories.",
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "ExpertYard",
        url: toAbsoluteUrl("/user"),
        potentialAction: {
          "@type": "SearchAction",
          target: `${toAbsoluteUrl("/user/experts")}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "ExpertYard Homepage",
        url: toAbsoluteUrl("/user"),
        description:
          "Connect with verified experts online through fast, secure, and trust-focused consultations on ExpertYard.",
        isPartOf: {
          "@type": "WebSite",
          name: "ExpertYard",
          url: toAbsoluteUrl("/user"),
        },
      },
    ],
    []
  );

  useSeo({
    title: "Verified Experts for Online Consultation | ExpertYard",
    description:
      "Connect with verified experts online for legal, health, finance, career, astrology, property, and more. ExpertYard offers secure payments, real user ratings, and instant chat or call access.",
    canonicalPath: "/user",
    keywords:
      "verified experts online, online consultation platform, secure expert advice, expert chat and call, legal consultation online, health consultation online, finance experts online, trusted professional advice",
    og: {
      title: "Verified Experts for Online Consultation | ExpertYard",
      description:
        "Connect with verified experts online for legal, health, finance, career, astrology, property, and more with secure payments and real user ratings.",
    },
    structuredData: homeStructuredData,
  });

  return (
    <>
      <Hero />

      <div className="section-wrapper">

         <section className="home-panel home-panel-categories" aria-labelledby="home-categories-heading">
          <div className="section-header">
            <div className="section-heading-block">
              <span className="section-kicker">Browse with confidence</span>
              <h2 id="home-categories-heading">Explore expert categories with clearer trust signals</h2>
              <p>
                Stronger browsing and easier discovery across high-intent consultation categories
                on ExpertYard.
              </p>
            </div>
            <button className="view-all-btn" onClick={() => navigate("/user/categories")}>
              View All Categories
            </button>
          </div>
          <Categories />
        </section>

        <section className="home-seo-intro" aria-labelledby="home-seo-heading">
          <div className="home-seo-copy">
            <span className="home-seo-eyebrow">Fast, trustworthy expert discovery</span>
            <h2 id="home-seo-heading">Find verified experts online and connect with confidence</h2>
            <p>
              ExpertYard is a trust-first online consultation platform where users can discover
              verified experts, compare real user ratings, review service categories, and start a
              secure chat or call without delay. The homepage is built to clearly explain the
              business, strengthen confidence, and surface important service keywords naturally.
            </p>
          </div>

          {featuredCategories.length > 0 && (
            <div className="home-seo-links" aria-label="Popular expert categories">
              {featuredCategories.map((category) => (
                <Link key={category.id} to={getCategoryPath(category)} className="home-seo-link">
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </section>

         <section className="home-panel home-panel-services" aria-labelledby="home-services-heading">
          <div className="section-header section-header-services">
            <div className="section-heading-block">
              <span className="section-kicker">Ready-to-book offers</span>
              <h2 id="home-services-heading">Popular services from verified professionals</h2>
              <p>
                Browse service-led entry points that support category intent, clearer internal
                linking, and stronger crawlable relevance for online consultation keywords.
              </p>
            </div>
          </div>
          <PopularServices />
        </section>


        <section className="home-trust-section" aria-labelledby="home-trust-heading">
          <div className="section-header">
            <div className="section-heading-block">
              <span className="section-kicker">Why users trust ExpertYard</span>
              <h2 id="home-trust-heading">Trust signals that matter before a user connects</h2>
              <p>
                These sections reinforce business identity, service quality, and trust without
                adding heavy media, extra requests, or client-side complexity.
              </p>
            </div>
          </div>



          <div className="trust-grid">
            {TRUST_PILLARS.map((item) => (
              <article key={item.title} className="trust-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        

        <section className="home-stats-section" aria-label="Platform trust stats">
          <div className="stats-grid">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

       

        <HowItWorks />

       
        <Testimonials />

        <section className="home-cta-panel" aria-labelledby="home-cta-heading">
          <div className="home-cta-copy">
            <span className="section-kicker">Private, secure, and easy to understand</span>
            <h2 id="home-cta-heading">Connect with the right expert without second-guessing trust</h2>
            <p>
              Users should understand who the business serves, why the platform is trustworthy,
              and what happens next. This section reinforces secure payments, private sessions,
              and clear service expectations close to the primary call to action.
            </p>
            <div className="home-cta-actions">
              <button className="btn-solid" onClick={() => navigate("/user/categories")}>
                Explore categories
              </button>
              <button className="btn-outline-blue" onClick={() => navigate("/user/privacy")}>
                Review privacy policy
              </button>
            </div>
          </div>

          <div className="home-cta-aside">
            <div className="cta-reassurance-list">
              {CTA_REASSURANCE.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div className="cta-support-links">
              <Link to="/user/terms">Terms</Link>
              <Link to="/user/privacy">Privacy</Link>
              <Link to="/user/faq">FAQ</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
