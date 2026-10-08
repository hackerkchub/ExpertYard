import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiAward, FiClock, FiUserCheck, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { STORY_CATEGORIES, SUCCESS_STORIES } from "../../../../data/articles/successStories";
import { useSeo } from "../../../../shared/seo/useSeo";
import { SITE_CONFIG, toAbsoluteUrl } from "../../../../shared/seo/siteConfig";
import SEOHead from "../../../../shared/components/SEO/SEOHead";
import StateBlock from "../../../../shared/components/StateBlock/StateBlock";
import "./Articles.css";

export default function ArticleListingPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredStories = useMemo(() => {
    return SUCCESS_STORIES.filter((story) => {
      return selectedCategory === "all" || story.categorySlug === selectedCategory;
    });
  }, [selectedCategory]);

  const featuredStory = useMemo(() => {
    return SUCCESS_STORIES.find((story) => story.featured) || SUCCESS_STORIES[0];
  }, []);

  const canonicalUrl = toAbsoluteUrl("/articles");

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "G9Expert Success Stories & Real Case Studies",
      description: "Real stories of how users resolved legal property disputes, gained career clarity, and made informed life choices using G9Expert.",
      url: canonicalUrl,
      publisher: {
        "@type": "Organization",
        name: SITE_CONFIG.siteName,
        logo: {
          "@type": "ImageObject",
          url: toAbsoluteUrl(SITE_CONFIG.defaultOgImage),
        },
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
        {
          "@type": "ListItem",
          position: 2,
          name: "Success Stories",
          item: canonicalUrl,
        },
      ],
    },
  ];

  useSeo({
    title: "G9Expert Success Stories | Real Client Journeys & Outcomes",
    description: "Explore real success stories from G9Expert users who resolved legal disputes, achieved career progression, and received expert astrological advice.",
    canonicalPath: "/articles",
    keywords: "g9expert success stories, legal resolution case studies, career advice success, verified expert outcomes",
    structuredData,
  });

  return (
    <div className="g9-stories-container">
      <SEOHead
        title="G9Expert Success Stories | Real Client Journeys & Outcomes"
        description="Explore real success stories from G9Expert users who resolved legal disputes, achieved career progression, and received expert astrological advice."
        canonicalUrl={canonicalUrl}
        schemaJson={structuredData}
      />

      {/* Hero Banner */}
      <header className="g9-stories-hero">
        <div className="g9-stories-hero-badge">
          <FiAward size={14} /> Verified Client Journeys
        </div>
        <h1 className="g9-stories-hero-title">Real Stories. Real Guidance. Real Outcomes.</h1>
        <p className="g9-stories-hero-desc">
          Discover how everyday individuals and professionals resolved complex challenges by consulting verified experts on G9Expert.
        </p>
      </header>

      {/* Category Filters */}
      <nav className="g9-blog-filters" aria-label="Story domain filters">
        {STORY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`g9-blog-filter-btn ${selectedCategory === cat.slug ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </nav>

      {/* Featured Success Story Card */}
      {selectedCategory === "all" && featuredStory && (
        <section aria-label="Featured success story">
          <div className="g9-blog-featured-card">
            <img
              src={featuredStory.featuredImage}
              alt={featuredStory.imageAlt || featuredStory.title}
              className="g9-blog-featured-img"
              loading="eager"
            />
            <div className="g9-blog-featured-body">
              <div className="g9-blog-card-meta">
                <span className="g9-blog-category-tag" style={{ background: "#fef3c7", color: "#b45309" }}>
                  {featuredStory.category}
                </span>
                <span>•</span>
                <span>{featuredStory.userLabel}</span>
              </div>

              <Link to={`/articles/${featuredStory.slug}`} className="g9-blog-card-title">
                {featuredStory.title}
              </Link>

              <p className="g9-blog-card-excerpt">{featuredStory.excerpt}</p>

              <div style={{ background: "#f8fafc", borderRadius: 12, padding: 12, marginBottom: 20, fontSize: "0.88rem", color: "#334155" }}>
                <strong>Scenario:</strong> {featuredStory.userScenario}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Consulted: <strong>{featuredStory.expert.name}</strong></span>
                <Link to={`/articles/${featuredStory.slug}`} className="g9-blog-cta-btn" style={{ margin: 0, padding: "8px 16px", fontSize: "0.85rem" }}>
                  Read Full Journey <FiArrowRight style={{ verticalAlign: "middle" }} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Story Grid */}
      {filteredStories.length > 0 ? (
        <section aria-label="Success stories grid">
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>
            {selectedCategory === "all" ? "All Success Stories" : `${STORY_CATEGORIES.find(c => c.slug === selectedCategory)?.name || "Category"} Stories`}
          </h2>
          <div className="g9-blog-grid">
            {filteredStories.map((story) => (
              <article key={story.id} className="g9-blog-card">
                <div className="g9-blog-card-img-wrapper">
                  <img
                    src={story.featuredImage}
                    alt={story.imageAlt || story.title}
                    className="g9-blog-card-img"
                    loading="lazy"
                  />
                </div>
                <div className="g9-blog-card-body">
                  <div className="g9-blog-card-meta">
                    <span className="g9-blog-category-tag" style={{ background: "#fef3c7", color: "#b45309" }}>{story.category}</span>
                    <span>•</span>
                    <span>{story.readingTime}</span>
                  </div>

                  <Link to={`/articles/${story.slug}`} className="g9-blog-card-title" style={{ fontSize: "1.1rem", marginBottom: 8 }}>
                    {story.title}
                  </Link>

                  <p className="g9-blog-card-excerpt" style={{ fontSize: "0.88rem", marginBottom: 16 }}>
                    {story.excerpt}
                  </p>

                  <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: 600 }}>{story.userLabel}</span>
                    <Link to={`/articles/${story.slug}`} style={{ fontSize: "0.85rem", fontWeight: 700, color: "#000080", textDecoration: "none" }}>
                      Read Journey →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <StateBlock
          title="No Stories Found"
          description="We couldn't find any success stories matching the selected category."
          actionText="View All Stories"
          onAction={() => setSelectedCategory("all")}
        />
      )}
    </div>
  );
}
