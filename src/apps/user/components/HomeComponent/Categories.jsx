import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../../../../shared/context/CategoryContext";

const DEFAULT_CATEGORY_IMAGE = "/default-category.png";

const Categories = () => {
  const navigate = useNavigate();
  const { categories, loading } = useCategory();
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (categoryId, categoryName) => {
    setActiveCategory(categoryId);
    navigate(`/user/subcategories/${categoryId}`, {
      state: { categoryName: categoryName }
    });
  };

  if (loading) {
    return (
      <section className="section">
        <div className="category-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="skeleton-card" key={index}>
              <div className="skeleton-box">
                <div className="shimmer"></div>
              </div>
              <div style={{ height: '12px', width: '60%', background: '#e5e7eb', marginTop: '10px', borderRadius: '4px' }}></div>
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
            className="category-card"
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id, cat.name)}
          >
            <div className="category-icon">
              <img 
                src={cat.image_url || DEFAULT_CATEGORY_IMAGE} 
                alt={cat.name}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  parent.style.background = '#f0edff';
                  parent.style.fontSize = '32px';
                  parent.style.color = '#000080';
                  parent.textContent = cat.name.charAt(0);
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