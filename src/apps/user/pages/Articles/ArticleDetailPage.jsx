import React, { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiClock, FiUserCheck, FiArrowLeft, FiCheckCircle, FiPhoneCall, FiAward, FiStar } from "react-icons/fi";
import { SUCCESS_STORIES } from "../../../../data/articles/successStories";
import { useSeo } from "../../../../shared/seo/useSeo";
import { SITE_CONFIG, toAbsoluteUrl } from "../../../../shared/seo/siteConfig";
import SEOHead from "../../../../shared/components/SEO/SEOHead";
import StateBlock from "../../../../shared/components/StateBlock/StateBlock";
import "./Articles.css";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const story = useMemo(() => {
    return SUCCESS_STORIES.find((item) => item.slug === slug || item.id === slug);
  }, [slug]);

  const canonicalUrl = toAbsoluteUrl(`/articles/${story?.slug || slug}`);

  const structuredData = useMemo(() => {
    if (!story) return [];

    return [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: story.title,
        description: story.excerpt,
        image: [story.featuredImage],
        datePublished: `${story.publishedAt}T08:00:00+05:30`,
        publisher: {
          "@type": "Organization",
          name: SITE_CONFIG.siteName,
          logo: {
            "@type": "ImageObject",
            url: toAbsoluteUrl(SITE_CONFIG.defaultOgImage),
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
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
            item: toAbsoluteUrl("/articles"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: story.title,
            item: canonicalUrl,
          },
        ],
      },
    ];
  }, [story, canonicalUrl]);

  useSeo({
    title: story ? `${story.title} | G9Expert Success Stories` : "Success Story | G9Expert",
    description: story?.excerpt || "Read verified consultation case studies on G9Expert.",
    canonicalPath: `/articles/${story?.slug || slug}`,
    og: {
      title: story?.title,
      description: story?.excerpt,
      image: story?.featuredImage,
      type: "article",
    },
    structuredData,
  });

  if (!story) {
    return (
      <div className="g9-stories-container">
        <StateBlock
          title="Story Not Found"
          description="The requested success story could not be found."
          actionText="Back to Success Stories"
          onAction={() => navigate("/articles")}
        />
      </div>
    );
  }

  const expertTargetUrl = story.expert?.expertSlug
    ? `/user/experts/${story.expert.expertSlug}`
    : "/user/call-chat?page=1";

  const categoryTargetUrl = story.relatedCategorySlug
    ? `/user/category/${story.relatedCategorySlug}`
    : "/user/categories";

  return (
    <div className="g9-stories-container">
      <SEOHead
        title={`${story.title} | G9Expert Success Stories`}
        description={story.excerpt}
        canonicalUrl={canonicalUrl}
        ogTitle={story.title}
        ogDescription={story.excerpt}
        ogImage={story.featuredImage}
        schemaJson={structuredData}
      />

      {/* Breadcrumb Navigation */}
      <nav className="g9-blog-breadcrumb" aria-label="Breadcrumb">
        <Link to="/user">Home</Link>
        <span>/</span>
        <Link to="/articles">Success Stories</Link>
        <span>/</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>{story.category}</span>
      </nav>

      {/* Header */}
      <header className="g9-blog-detail-header">
        <span className="g9-blog-category-tag" style={{ background: "#fef3c7", color: "#b45309" }}>{story.category}</span>
        <h1 className="g9-blog-detail-title">{story.title}</h1>
        
        <div className="g9-blog-card-meta" style={{ fontSize: "0.9rem" }}>
          <span>Client: <strong>{story.userLabel}</strong></span>
          <span>•</span>
          <span>Published: {story.publishedAt}</span>
          <span>•</span>
          <span><FiClock style={{ verticalAlign: "middle" }} /> {story.readingTime}</span>
        </div>
      </header>

      {/* Featured Banner Image */}
      <img
        src={story.featuredImage}
        alt={story.imageAlt || story.title}
        className="g9-blog-detail-featured-img"
        loading="eager"
      />

      {/* Main Story Content Layout */}
      <main className="g9-blog-detail-layout">
        <div className="g9-blog-content-body">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <FiAward color="#f59e0b" /> The Client Journey
          </h2>

          {/* 5-Step Journey Visual Timeline */}
          <div className="g9-journey-timeline">
            <div className="g9-journey-step">
              <div className="g9-journey-badge">1</div>
              <div className="g9-journey-card">
                <h3 className="g9-journey-step-title">The Challenge</h3>
                <p className="g9-journey-step-desc">{story.journey.challenge}</p>
              </div>
            </div>

            <div className="g9-journey-step">
              <div className="g9-journey-badge">2</div>
              <div className="g9-journey-card">
                <h3 className="g9-journey-step-title">Discovering G9Expert</h3>
                <p className="g9-journey-step-desc">{story.journey.discovery}</p>
              </div>
            </div>

            <div className="g9-journey-step">
              <div className="g9-journey-badge">3</div>
              <div className="g9-journey-card">
                <h3 className="g9-journey-step-title">The Expert Consultation</h3>
                <p className="g9-journey-step-desc">{story.journey.consultation}</p>
              </div>
            </div>

            <div className="g9-journey-step">
              <div className="g9-journey-badge">4</div>
              <div className="g9-journey-card">
                <h3 className="g9-journey-step-title">Professional Guidance Provided</h3>
                <p className="g9-journey-step-desc">{story.journey.guidance}</p>
              </div>
            </div>

            <div className="g9-journey-step">
              <div className="g9-journey-badge" style={{ background: "#16a34a" }}>✓</div>
              <div className="g9-journey-card" style={{ borderColor: "#bbf7d0", background: "#f0fdf4" }}>
                <h3 className="g9-journey-step-title" style={{ color: "#166534" }}>The Final Outcome</h3>
                <p className="g9-journey-step-desc" style={{ color: "#15803d" }}>{story.journey.outcome}</p>
              </div>
            </div>
          </div>

          {/* Key Takeaways Section */}
          {story.keyTakeaways && story.keyTakeaways.length > 0 && (
            <div className="g9-takeaways-box">
              <h3 className="g9-takeaways-title">
                <FiCheckCircle /> Key Takeaways
              </h3>
              <ul className="g9-takeaways-list">
                {story.keyTakeaways.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Expert Spotlight Card */}
          {story.expert && (
            <section aria-label="Expert Spotlight">
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                Verified Expert Involved
              </h3>
              <div className="g9-expert-spotlight-card">
                <img
                  src={story.expert.profilePhoto}
                  alt={story.expert.name}
                  className="g9-expert-spotlight-avatar"
                />
                <div className="g9-expert-spotlight-info">
                  <div className="g9-expert-spotlight-name">{story.expert.name}</div>
                  <div className="g9-expert-spotlight-cat">{story.expert.category}</div>
                  <div className="g9-expert-spotlight-meta">
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#b45309" }}>
                      <FiStar fill="#f59e0b" color="#f59e0b" size={14} /> {story.expert.rating} ({story.expert.totalReviews} Reviews)
                    </span>
                    <span>•</span>
                    <span>Rate: {story.expert.callRate}</span>
                  </div>
                </div>
                <Link to={expertTargetUrl} className="g9-expert-consult-btn">
                  Consult {story.expert.name}
                </Link>
              </div>
            </section>
          )}

          {/* Bottom Consultation CTA Banner */}
          <div className="g9-blog-cta-widget" style={{ marginTop: 40, textAlign: "left", background: "linear-gradient(135deg, #0b132b, #000080)", borderRadius: 16, padding: "28px" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1.35rem", fontWeight: 700 }}>
              Facing a Similar Situation in {story.category}?
            </h3>
            <p style={{ margin: "0 0 16px 0", color: "#e2e8f0", fontSize: "0.95rem" }}>
              Get private 1-on-1 guidance from top verified experts on G9Expert today.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/user/call-chat?page=1" className="g9-blog-cta-btn" style={{ margin: 0, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <FiPhoneCall /> Connect With an Expert Now
              </Link>
              <Link to={categoryTargetUrl} className="g9-blog-cta-btn" style={{ margin: 0, background: "rgba(255,255,255,0.15)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.3)" }}>
                Explore Services
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="g9-blog-sidebar">
          <div className="g9-blog-cta-widget">
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.15rem", fontWeight: 700 }}>
              Need Expert Advice?
            </h3>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#cbd5e1", lineHeight: 1.5 }}>
              Talk directly with verified professionals for instant guidance.
            </p>
            <Link to="/user/call-chat?page=1" className="g9-blog-cta-btn" style={{ width: "100%", boxSizing: "border-box" }}>
              Browse Experts
            </Link>
          </div>

          <div className="g9-blog-widget">
            <div className="g9-blog-widget-title">Why Users Trust G9Expert</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: "0.88rem", color: "#475569" }}>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle color="#16a34a" /> Verified Expert Profiles
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle color="#16a34a" /> Private Voice & Chat Sessions
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle color="#16a34a" /> Pay-per-minute Transparency
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
