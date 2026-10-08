import React, { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiClock, FiUser, FiArrowLeft, FiCheckCircle, FiShare2, FiMessageSquare, FiPhoneCall } from "react-icons/fi";
import { BLOG_POSTS } from "../../../../data/blog/blogPosts";
import { useSeo } from "../../../../shared/seo/useSeo";
import { SITE_CONFIG, toAbsoluteUrl } from "../../../../shared/seo/siteConfig";
import SEOHead from "../../../../shared/components/SEO/SEOHead";
import StateBlock from "../../../../shared/components/StateBlock/StateBlock";
import "./Blog.css";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = useMemo(() => {
    return BLOG_POSTS.find((item) => item.slug === slug || item.id === slug);
  }, [slug]);

  const canonicalUrl = toAbsoluteUrl(`/blog/${post?.slug || slug}`);

  const structuredData = useMemo(() => {
    if (!post) return [];

    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: [post.featuredImage],
        datePublished: `${post.publishedAt}T08:00:00+05:30`,
        dateModified: `${post.updatedAt || post.publishedAt}T10:00:00+05:30`,
        author: {
          "@type": "Person",
          name: post.author.name,
          jobTitle: post.author.role,
        },
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
            name: "Blog",
            item: toAbsoluteUrl("/blog"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: canonicalUrl,
          },
        ],
      },
    ];

    if (post.faqs && post.faqs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      });
    }

    return schemas;
  }, [post, canonicalUrl]);

  useSeo({
    title: post ? `${post.title} | G9Expert Blog` : "Blog Article | G9Expert",
    description: post?.excerpt || "Read verified expert advice on G9Expert.",
    canonicalPath: `/blog/${post?.slug || slug}`,
    keywords: post?.tags?.join(", "),
    og: {
      title: post?.title,
      description: post?.excerpt,
      image: post?.featuredImage,
      type: "article",
    },
    structuredData,
  });

  if (!post) {
    return (
      <div className="g9-blog-detail-container">
        <StateBlock
          title="Article Not Found"
          description="The requested blog post could not be found or may have been moved."
          actionText="Back to Blog"
          onAction={() => navigate("/blog")}
        />
      </div>
    );
  }

  const categoryTargetUrl = post.relatedCategorySlug
    ? `/user/category/${post.relatedCategorySlug}`
    : "/user/categories";

  const expertTargetUrl = post.relatedExpertSlug
    ? `/user/experts/${post.relatedExpertSlug}`
    : "/user/call-chat?page=1";

  return (
    <div className="g9-blog-detail-container">
      <SEOHead
        title={`${post.title} | G9Expert Blog`}
        description={post.excerpt}
        canonicalUrl={canonicalUrl}
        ogTitle={post.title}
        ogDescription={post.excerpt}
        ogImage={post.featuredImage}
        schemaJson={structuredData}
      />

      {/* Breadcrumb Navigation */}
      <nav className="g9-blog-breadcrumb" aria-label="Breadcrumb">
        <Link to="/user">Home</Link>
        <span>/</span>
        <Link to="/blog">Blog</Link>
        <span>/</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>{post.category}</span>
      </nav>

      {/* Article Header */}
      <header className="g9-blog-detail-header">
        <span className="g9-blog-category-tag">{post.category}</span>
        <h1 className="g9-blog-detail-title">{post.title}</h1>
        
        <div className="g9-blog-card-meta" style={{ fontSize: "0.9rem" }}>
          <span>Published on {post.publishedAt}</span>
          <span>•</span>
          <span><FiClock style={{ verticalAlign: "middle" }} /> {post.readingTime}</span>
        </div>

        {/* Author Badge */}
        <div className="g9-blog-author-row" style={{ marginTop: 16 }}>
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="g9-blog-author-avatar"
            style={{ width: 44, height: 44 }}
          />
          <div>
            <div className="g9-blog-author-name" style={{ fontSize: "1rem" }}>{post.author.name}</div>
            <div style={{ color: "#64748b", fontSize: "0.82rem" }}>{post.author.role}</div>
          </div>
        </div>
      </header>

      {/* Featured Banner Image */}
      <img
        src={post.featuredImage}
        alt={post.imageAlt || post.title}
        className="g9-blog-detail-featured-img"
        loading="eager"
      />

      {/* 2-Column Desktop Grid Layout */}
      <div className="g9-blog-detail-layout">
        {/* Main Article Body */}
        <main className="g9-blog-content-body">
          <article dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* FAQ Accordions Section */}
          {post.faqs && post.faqs.length > 0 && (
            <section className="g9-blog-faq-section" aria-label="Frequently Asked Questions">
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>
                Frequently Asked Questions
              </h2>
              {post.faqs.map((faq, index) => (
                <div key={index} className="g9-blog-faq-item">
                  <div className="g9-blog-faq-question">{faq.question}</div>
                  <div className="g9-blog-faq-answer">{faq.answer}</div>
                </div>
              ))}
            </section>
          )}

          {/* Bottom Consultation CTA Banner */}
          <div className="g9-blog-cta-widget" style={{ marginTop: 40, textAlign: "left", background: "linear-gradient(135deg, #0f172a, #000080)", borderRadius: 16, padding: "28px" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1.35rem", fontWeight: 700 }}>
              Need Personal Guidance for {post.category}?
            </h3>
            <p style={{ margin: "0 0 16px 0", color: "#e2e8f0", fontSize: "0.95rem" }}>
              Connect directly with verified {post.category} professionals on G9Expert for instant chat or voice consultation.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to={expertTargetUrl} className="g9-blog-cta-btn" style={{ margin: 0, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <FiPhoneCall /> Consult Verified Experts
              </Link>
              <Link to={categoryTargetUrl} className="g9-blog-cta-btn" style={{ margin: 0, background: "rgba(255,255,255,0.15)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.3)" }}>
                Browse {post.category} Category
              </Link>
            </div>
          </div>
        </main>

        {/* Sticky Desktop Sidebar */}
        <aside className="g9-blog-sidebar">
          {/* Consult Expert Widget */}
          <div className="g9-blog-cta-widget">
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.15rem", fontWeight: 700 }}>
              Talk to a {post.category} Specialist
            </h3>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#cbd5e1", lineHeight: 1.5 }}>
              Get answers tailored to your specific situation with 100% private consultation.
            </p>
            <Link to={expertTargetUrl} className="g9-blog-cta-btn" style={{ width: "100%", boxSizing: "border-box" }}>
              Find Expert Now
            </Link>
          </div>

          {/* Verified Guarantee Widget */}
          <div className="g9-blog-widget">
            <div className="g9-blog-widget-title">Why Choose G9Expert?</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: "0.88rem", color: "#475569" }}>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle color="#16a34a" /> 100% Verified Professionals
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle color="#16a34a" /> Instant Voice & Chat Access
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle color="#16a34a" /> Transparent Per-Minute Rates
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle color="#16a34a" /> Safe & Confidential Sessions
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
