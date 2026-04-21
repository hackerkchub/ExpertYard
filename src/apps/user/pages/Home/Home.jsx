import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import Categories from "../../components/HomeComponent/Categories";
import Hero from "../../components/HomeComponent/Hero";
import HowItWorks from "../../components/HomeComponent/HowItWorks";
import "./Home.css";

import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWebPush } from "../../../../shared/hooks/useWebPush";
import PopularServices from "./PopularServices";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { useSeo } from "../../../../shared/seo/useSeo";
import { toAbsoluteUrl } from "../../../../shared/seo/siteConfig";
import { getCategoryPath } from "../../../../shared/utils/categoryRoutes";

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
        logo: toAbsoluteUrl("/logo-512.png"),
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
    ],
    []
  );

  useSeo({
    title: "Verified Experts Online Across 20+ Categories | ExpertYard",
    description:
      "Discover verified lawyers, doctors, astrologers, gym dietitians, property advisors, investment experts, and more on ExpertYard. Connect instantly by category.",
    canonicalPath: "/user",
    keywords:
      "verified experts, online lawyer consultation, online doctor advice, astrologer online, dietitian consultation, property guidance, investment experts",
    og: {
      title: "Verified Experts Online Across 20+ Categories | ExpertYard",
      description:
        "Discover verified lawyers, doctors, astrologers, gym dietitians, property advisors, investment experts, and more on ExpertYard. Connect instantly by category.",
    },
    structuredData: homeStructuredData,
  });

  return (
    <>
      <Hero />

      <div className="section-wrapper">
        <section className="home-seo-intro" aria-labelledby="home-seo-heading">
          <div className="home-seo-copy">
            <span className="home-seo-eyebrow">Instant access to verified experts</span>
            <h2 id="home-seo-heading">Find the right expert category and connect in minutes</h2>
            <p>
              ExpertYard helps people discover trusted professionals across legal, health,
              astrology, fitness, property, investment, and other high-intent categories.
              Browse category pages, compare specialists, and start a chat or call without delay.
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

        <section className="home-panel home-panel-categories" aria-labelledby="home-categories-heading">
          <div className="section-header">
            <div className="section-heading-block">
              <span className="section-kicker">Browse with confidence</span>
              <h2 id="home-categories-heading">Explore premium expert categories</h2>
              <p>
                Clearer browsing, stronger visuals, and easier discovery across the most
                in-demand consultation categories on ExpertYard.
              </p>
            </div>
            <button className="view-all-btn" onClick={() => navigate("/user/categories")}>
              View All Categories
            </button>
          </div>
          <Categories />
        </section>

        <section className="home-panel home-panel-services" aria-labelledby="home-services-heading">
          <div className="section-header section-header-services">
            <div className="section-heading-block">
              <span className="section-kicker">Ready-to-book offers</span>
              <h2 id="home-services-heading">Popular services from verified professionals</h2>
              <p>
                Production-grade service cards with stronger readability, better spacing,
                and faster perceived loading on every screen size.
              </p>
            </div>
          </div>
          <PopularServices />
        </section>
      </div>
      
     
      <HowItWorks />
    </>
  );
};

export default HomePage;
