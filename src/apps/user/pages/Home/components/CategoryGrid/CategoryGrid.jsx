import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Scale,
  Sparkles,
  Wallet,
  Briefcase,
  HeartPulse,
  Building2,
  Home as HomeIcon,
  Cpu,
  GraduationCap,
  Grid3X3,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import "./CategoryGrid.css";

// Keyword icon mapping for categories without custom image
const ICON_MAP = [
  { keywords: ["legal", "law", "advocate"], icon: Scale, gradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", color: "#ffffff" },
  { keywords: ["tax", "ca", "finance", "account", "gst"], icon: Wallet, gradient: "linear-gradient(135deg, #065f46 0%, #10b981 100%)", color: "#ffffff" },
  { keywords: ["doctor", "health", "medical", "clinic"], icon: HeartPulse, gradient: "linear-gradient(135deg, #991b1b 0%, #ef4444 100%)", color: "#ffffff" },
  { keywords: ["astro", "kundli", "horoscope"], icon: Sparkles, gradient: "linear-gradient(135deg, #854d0e 0%, #f59e0b 100%)", color: "#ffffff" },
  { keywords: ["property", "real estate", "land"], icon: HomeIcon, gradient: "linear-gradient(135deg, #5b21b6 0%, #8b5cf6 100%)", color: "#ffffff" },
  { keywords: ["business", "company", "startup"], icon: Building2, gradient: "linear-gradient(135deg, #1e293b 0%, #475569 100%)", color: "#ffffff" },
  { keywords: ["career", "job", "hr", "interview"], icon: Briefcase, gradient: "linear-gradient(135deg, #075985 0%, #0ea5e9 100%)", color: "#ffffff" },
  { keywords: ["it", "tech", "software", "developer"], icon: Cpu, gradient: "linear-gradient(135deg, #3730a3 0%, #6366f1 100%)", color: "#ffffff" },
  { keywords: ["education", "study", "tutor"], icon: GraduationCap, gradient: "linear-gradient(135deg, #9d174d 0%, #ec4899 100%)", color: "#ffffff" },
];

const DEFAULT_GRADIENTS = [
  "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
  "linear-gradient(135deg, #047857 0%, #10b981 100%)",
  "linear-gradient(135deg, #b45309 0%, #f59e0b 100%)",
  "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)",
  "linear-gradient(135deg, #be185d 0%, #ec4899 100%)",
];

const resolveCategoryPresentation = (cat, index = 0) => {
  const name = String(cat?.name || "").toLowerCase();
  const matched = ICON_MAP.find((m) => m.keywords.some((k) => name.includes(k)));
  if (matched) {
    return {
      Icon: matched.icon,
      gradient: matched.gradient,
      color: matched.color,
    };
  }

  const grad = DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length];
  return {
    Icon: Grid3X3,
    gradient: grad,
    color: "#ffffff",
  };
};

export default function CategoryGrid({
  categories = [],
  selectedCategoryId,
  onSelectCategory,
  loading = false,
}) {
  const sortedCategories = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];
    return [...list].sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0));
  }, [categories]);

  // Show top 8 categories on mobile (4 cols x 2 rows)
  const mobileDisplayCategories = useMemo(() => {
    return sortedCategories.slice(0, 8);
  }, [sortedCategories]);

  // Show up to 12 categories on desktop
  const desktopDisplayCategories = useMemo(() => {
    return sortedCategories.slice(0, 12);
  }, [sortedCategories]);

  if (loading && (!categories || categories.length === 0)) {
    return (
      <section className="g9-category-grid-section" aria-label="Loading categories">
        <div className="g9-category-grid-header">
          <div className="cat-skeleton-title" />
          <div className="cat-skeleton-link" />
        </div>
        <div className="g9-category-grid mobile-4x2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="g9-category-card-skeleton">
              <div className="cat-icon-skeleton" />
              <div className="cat-text-skeleton" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!sortedCategories.length) {
    return null;
  }

  return (
    <section className="g9-category-grid-section" aria-label="Browse services by category">
      {/* SECTION HEADER */}
      <div className="g9-category-grid-header">
        <div>
          <h2 className="g9-category-grid-title">Browse by Category</h2>
          <p className="g9-category-grid-subtitle">
            Find verified consultants &amp; services across top domains
          </p>
        </div>
        <Link
          to="/user/categories"
          className="g9-category-view-all-link"
          aria-label="View all categories"
        >
          <span>View All</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* MOBILE 4-COLUMN x 2-ROW GRID (Shown on <= 767px) */}
      <div className="g9-category-grid-wrapper mobile-only-grid">
        <div className="g9-category-grid mobile-4x2">
          {mobileDisplayCategories.map((cat, idx) => {
            const isActive = String(selectedCategoryId || "") === String(cat.id || "");
            const { Icon, gradient, color } = resolveCategoryPresentation(cat, idx);
            const imageSrc = cat.image_url || cat.image;

            return (
              <button
                type="button"
                key={cat.id || cat.slug || idx}
                className={`g9-category-item-card ${isActive ? "is-active" : ""}`}
                onClick={() => onSelectCategory && onSelectCategory(cat)}
                aria-label={`Category: ${cat.name}`}
              >
                <div
                  className="g9-category-icon-box"
                  style={{ background: imageSrc ? "#f8fafc" : gradient }}
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={cat.name}
                      className="cat-thumb-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling && (e.target.nextSibling.style.display = "flex");
                      }}
                    />
                  ) : null}
                  <span
                    className="cat-fallback-icon"
                    style={{
                      display: imageSrc ? "none" : "flex",
                      color,
                    }}
                  >
                    <Icon size={24} strokeWidth={2} />
                  </span>
                </div>
                <span className="g9-category-item-name">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DESKTOP RESPONSIVE GRID (Shown on > 767px) */}
      <div className="g9-category-grid-wrapper desktop-only-grid">
        <div className="g9-category-grid desktop-grid">
          {desktopDisplayCategories.map((cat, idx) => {
            const isActive = String(selectedCategoryId || "") === String(cat.id || "");
            const { Icon, gradient, color } = resolveCategoryPresentation(cat, idx);
            const imageSrc = cat.image_url || cat.image;

            return (
              <button
                type="button"
                key={cat.id || cat.slug || idx}
                className={`g9-category-item-card desktop-card ${isActive ? "is-active" : ""}`}
                onClick={() => onSelectCategory && onSelectCategory(cat)}
                aria-label={`Category: ${cat.name}`}
              >
                <div
                  className="g9-category-icon-box"
                  style={{ background: imageSrc ? "#f8fafc" : gradient }}
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={cat.name}
                      className="cat-thumb-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling && (e.target.nextSibling.style.display = "flex");
                      }}
                    />
                  ) : null}
                  <span
                    className="cat-fallback-icon"
                    style={{
                      display: imageSrc ? "none" : "flex",
                      color,
                    }}
                  >
                    <Icon size={26} strokeWidth={2} />
                  </span>
                </div>
                <span className="g9-category-item-name">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
