import React from "react";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../../../../shared/context/CategoryContext";

const Categories = () => {
  const navigate = useNavigate();
  const { categories, loading } = useCategory();

  const handleCategoryClick = (category) => {
    // Exact requirement path: /user/subcategories/:id
    const targetUrl = `/user/subcategories/${category.id}`;
    
    console.log("Navigating to:", targetUrl);

    navigate(targetUrl, {
      state: { categoryName: category.name }
    });
  };

  if (loading) return <div className="skeleton-loader">Loading Categories...</div>;

  return (
    <section className="category-section">
      <div className="category-grid">
        {categories.map((cat) => (
          <div 
            className="category-card" 
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
          >
            <div className="category-icon">
              <img 
                src={cat.image_url || "/default-category.png"} 
                alt={cat.name} 
                onError={(e) => { e.target.src = "/fallback.png" }}
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