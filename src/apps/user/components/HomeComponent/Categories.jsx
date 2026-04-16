import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../../../../shared/context/CategoryContext";

const DEFAULT_CATEGORY_IMAGE = "/default-category.png";

const Categories = () => {
  const navigate = useNavigate();
  const { categories: apiCategories, loading } = useCategory();
  const [categories, setCategories] = useState(() => {
    // Initial load from cache for instant display
    const cached = localStorage.getItem("cached_categories");
    return cached ? JSON.parse(cached) : [];
  });

  // Sync state with API and update cache
  useEffect(() => {
    if (apiCategories && apiCategories.length > 0) {
      setCategories(apiCategories);
      localStorage.setItem("cached_categories", JSON.stringify(apiCategories));
    }
  }, [apiCategories]);

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/user/subcategories/${categoryId}`, {
      state: { categoryName: categoryName }
    });
  };

  // Prevent UI flickering if we have cached data
  const showLoading = loading && categories.length === 0;

  if (showLoading) {
    return (
      <section className="section">
        <div className="category-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="skeleton-card" key={index}>
              <div className="skeleton-circle"></div>
              <div className="skeleton-text"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="category-grid">
        {categories.map((cat) => (
          <div 
            className="category-item"
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id, cat.name)}
          >
            <div className="category-image-wrapper">
              <img 
                src={cat.image_url || DEFAULT_CATEGORY_IMAGE} 
                alt={cat.name}
                loading="eager" // Important for fast reload
                onLoad={(e) => e.target.classList.add('is-loaded')}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  parent.classList.add('fallback-mode');
                  parent.textContent = cat.name.charAt(0);
                }}
              />
            </div>
            <p className="category-label">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;