import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiBookOpen, FiClock, FiUser, FiArrowRight, FiSearch, FiCheckCircle } from "react-icons/fi";
import { BLOG_CATEGORIES, BLOG_POSTS } from "../../../../data/blog/blogPosts";
import { useSeo } from "../../../../shared/seo/useSeo";
import { SITE_CONFIG, toAbsoluteUrl } from "../../../../shared/seo/siteConfig";
import SEOHead from "../../../../shared/components/SEO/SEOHead";
import StateBlock from "../../../../shared/components/StateBlock/StateBlock";
import "./Blog.css";

export default function BlogListingPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.categorySlug === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return BLOG_POSTS.find((post) => post.featured) || BLOG_POSTS[0];
  }, []);

  const canonicalUrl = toAbsoluteUrl("/blog");

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: `G9Expert Knowledge Hub & Blog`,
      description: "Explore legal guidance, astrology insights, career tips, finance advice, and expert knowledge on G9Expert.",
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
          name: "Blog",
          item: canonicalUrl,
        },
      ],
    },
  ];

  useSeo({
    title: "G9Expert Blog | Expert Legal, Astrology, Career & Health Insights",
    description: "Explore verified articles, practical legal guides, astrology Kundli tips, career roadmaps, and finance advice on G9Expert.",
    canonicalPath: "/blog",
    keywords: "online legal advice, career guidance blog, astrology kundli tips, property law guide, g9expert blog",
    structuredData,
  });

  return (
    <div className="g9-blog-container">
      <SEOHead
        title="G9Expert Blog | Expert Legal, Astrology, Career & Health Insights"
        description="Explore verified articles, practical legal guides, astrology Kundli tips, career roadmaps, and finance advice on G9Expert."
        canonicalUrl={canonicalUrl}
        schemaJson={structuredData}
      />

      {/* Hero Header */}
      <header className="g9-blog-hero">
        <div className="g9-blog-hero-badge">
          <FiBookOpen size={14} /> G9Expert Knowledge Hub
        </div>
        <h1 className="g9-blog-hero-title">Expert Insights & Practical Guides</h1>
        <p className="g9-blog-hero-desc">
          Verified advice, actionable legal insights, astrology tips, career strategies, and financial guidance from trusted professionals.
        </p>
      </header>

      {/* Category Filter Bar */}
      <nav className="g9-blog-filters" aria-label="Blog categories">
        {BLOG_CATEGORIES.map((cat) => (
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

      {/* Featured Article - Shown when viewing 'all' and no active search */}
      {selectedCategory === "all" && !searchQuery && featuredPost && (
        <section aria-label="Featured article">
          <div className="g9-blog-featured-card">
            <img
              src={featuredPost.featuredImage}
              alt={featuredPost.imageAlt || featuredPost.title}
              className="g9-blog-featured-img"
              loading="eager"
            />
            <div className="g9-blog-featured-body">
              <div className="g9-blog-card-meta">
                <span className="g9-blog-category-tag">{featuredPost.category}</span>
                <span>•</span>
                <span>{featuredPost.publishedAt}</span>
                <span>•</span>
                <span><FiClock style={{ verticalAlign: "middle" }} /> {featuredPost.readingTime}</span>
              </div>

              <Link to={`/blog/${featuredPost.slug}`} className="g9-blog-card-title">
                {featuredPost.title}
              </Link>

              <p className="g9-blog-card-excerpt">{featuredPost.excerpt}</p>

              <div className="g9-blog-author-row" style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    className="g9-blog-author-avatar"
                  />
                  <div>
                    <div className="g9-blog-author-name">{featuredPost.author.name}</div>
                    <small style={{ color: "#64748b", fontSize: "0.78rem" }}>{featuredPost.author.role}</small>
                  </div>
                </div>

                <Link to={`/blog/${featuredPost.slug}`} className="g9-blog-cta-btn" style={{ margin: 0, padding: "8px 16px", fontSize: "0.85rem" }}>
                  Read Guide <FiArrowRight style={{ verticalAlign: "middle" }} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Grid */}
      {filteredPosts.length > 0 ? (
        <section aria-label="All articles">
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>
            {selectedCategory === "all" ? "Latest Articles" : `${BLOG_CATEGORIES.find(c => c.slug === selectedCategory)?.name || "Category"} Articles`}
          </h2>
          <div className="g9-blog-grid">
            {filteredPosts.map((post) => (
              <article key={post.id} className="g9-blog-card">
                <div className="g9-blog-card-img-wrapper">
                  <img
                    src={post.featuredImage}
                    alt={post.imageAlt || post.title}
                    className="g9-blog-card-img"
                    loading="lazy"
                  />
                </div>
                <div className="g9-blog-card-body">
                  <div className="g9-blog-card-meta">
                    <span className="g9-blog-category-tag">{post.category}</span>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </div>

                  <Link to={`/blog/${post.slug}`} className="g9-blog-card-title" style={{ fontSize: "1.15rem", marginBottom: 8 }}>
                    {post.title}
                  </Link>

                  <p className="g9-blog-card-excerpt" style={{ fontSize: "0.88rem", marginBottom: 16 }}>
                    {post.excerpt}
                  </p>

                  <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.82rem", color: "#64748b" }}>By {post.author.name}</span>
                    <Link to={`/blog/${post.slug}`} style={{ fontSize: "0.85rem", fontWeight: 700, color: "#000080", textDecoration: "none" }}>
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <StateBlock
          title="No Articles Found"
          description="We couldn't find any articles matching your search or category filter."
          actionText="View All Articles"
          onAction={() => {
            setSelectedCategory("all");
            setSearchQuery("");
          }}
        />
      )}
    </div>
  );
}
