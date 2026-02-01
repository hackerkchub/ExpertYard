import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../../../../shared/context/CategoryContext";

const DEFAULT_CATEGORY_IMAGE = "/default-category.png";

const Categories = () => {
  const navigate = useNavigate();
  const { categories, loading } = useCategory(); // Get loading state from context
  const [activeCategory, setActiveCategory] = useState(null);

  // Set default category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/user/subcategories/${categoryId}`, {
      state: { categoryName: categoryName }
    });
  };

  // Show skeleton loading while categories are loading
  if (loading) {
    return (
      <section className="section">
        <div className="category-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="category-card skeleton" key={index}>
              <div className="category-icon skeleton-shimmer"></div>
              <p className="skeleton-text"></p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Show empty state if no categories
  if (!loading && categories.length === 0) {
    return (
      <section className="section">
       
        <div className="empty-state">
          <p>No categories available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      
      <div className="category-grid">
        {categories.map((cat) => (
          <div 
            className={`category-card ${cat.id === activeCategory ? 'active' : ''}`}
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id, cat.name)}
          >
            <div className="category-icon">
              <img 
                src={cat.image_url || DEFAULT_CATEGORY_IMAGE} 
                alt={cat.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.textContent = cat.name.charAt(0);
                }}
              />
            </div>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;