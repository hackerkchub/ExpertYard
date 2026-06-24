import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { getCategoryPath } from "../../../../shared/utils/categoryRoutes";
import { buildTrackingPayload, trackLeadEvent } from "../../../../shared/utils/leadTracking";

const DEFAULT_CATEGORY_IMAGE = "/default-category.png";

const Categories = () => {
  const { categories: apiCategories, loading } = useCategory();
  const { user } = useAuth();
  const [categories, setCategories] = useState(() => {
    const cached = localStorage.getItem("cached_categories");
    return cached ? JSON.parse(cached) : [];
  });

  useEffect(() => {
    if (apiCategories && apiCategories.length > 0) {
      setCategories(apiCategories);
      localStorage.setItem("cached_categories", JSON.stringify(apiCategories));
    }
  }, [apiCategories]);

  const showLoading = loading && categories.length === 0;

  if (showLoading) {
    return (
      <section className="section">
        <div className="category-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="skeleton-card" key={index}>
              <div className="skeleton-circle" />
              <div className="skeleton-text" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const handleCategoryClick = (cat) => {
    trackLeadEvent(
      "category-view",
      buildTrackingPayload({
        user,
        sourcePage: "home_category_card",
        actionLabel: "Home Category Card",
        extra: { category_id: cat.id },
      })
    );
  };

  return (
    <section className="section">
      <div className="category-grid">
        {categories.map((cat, index) => (
          <Link
            className="category-item"
            key={cat.id}
            to={getCategoryPath(cat)}
            onClick={() => handleCategoryClick(cat)}
            aria-label={`Browse ${cat.name} experts`}
          >
            <div className="category-image-wrapper">
              <span className="category-initial" aria-hidden="true">
                {cat.name?.charAt(0)}
              </span>
              <img
                src={cat.image_url || DEFAULT_CATEGORY_IMAGE}
                alt={cat.name}
                loading={index < 4 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index < 2 ? "high" : "auto"}
                onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.opacity = "0";
                  e.currentTarget.src = DEFAULT_CATEGORY_IMAGE;
                }}
              />
            </div>

            <div className="category-copy">
              <p className="category-label">{cat.name}</p>
              <span className="category-meta">Verified experts</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
