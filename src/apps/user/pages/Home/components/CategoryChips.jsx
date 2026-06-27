import React from "react";

const CategoryChips = React.memo(function CategoryChips({
  categories,
  selectedCategoryId,
  onSelect,
  loading,
}) {
  const getInitials = (name) => {
    return String(name || "C").trim().charAt(0).toUpperCase();
  };

  const gradients = [
    "linear-gradient(135deg, #ffd54a 0%, #f59e0b 100%)",
    "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
  ];

  const getGradient = (id) => {
    const idx = (Number(id) || 0) % gradients.length;
    return gradients[idx];
  };

  if (loading && !categories.length) {
    return (
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0 10px", padding: "0 4px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 850, color: "var(--g9-blue)", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Browse by Category
          </h2>
          <span style={{ fontSize: "11px", color: "var(--g9-muted)", fontWeight: 700 }}>Loading...</span>
        </div>
        <div className="home-category-chips">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="category-skeleton-item" key={index}>
              <div className="category-skeleton-circle" />
              <div className="category-skeleton-text" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0 10px", padding: "0 4px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 850, color: "var(--g9-blue)", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Browse by Category
        </h2>
        <span style={{ fontSize: "11px", color: "var(--g9-muted)", fontWeight: 700 }}>Scroll &rarr;</span>
      </div>
      
      <nav className="home-category-chips" aria-label="Categories">
        <button
          type="button"
          className={`category-item-btn ${!selectedCategoryId ? "active" : ""}`}
          onClick={() => onSelect(null)}
        >
          <div className="category-circle-wrapper">
            <div className="category-circle-ring">
              <div className="category-circle" style={{ background: "linear-gradient(135deg, #000080 0%, #1d4ed8 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", borderRadius: "50%", fontWeight: 800 }}>
                All
              </div>
            </div>
          </div>
          <span className="category-label">All</span>
        </button>
        
        {categories.slice(0, 18).map((category, idx) => {
          const isActive = String(selectedCategoryId || "") === String(category.id || "");
          const fallbackGradient = getGradient(category.id || idx);
          
          return (
            <button
              type="button"
              key={category.id || category.slug || category.name}
              className={`category-item-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelect(category)}
            >
              <div className="category-circle-wrapper">
                <div className="category-circle-ring">
                  {category.image_url ? (
                    <img src={category.image_url} alt="" loading="lazy" />
                  ) : (
                    <div className="category-circle-fallback" style={{ background: fallbackGradient }}>
                      {getInitials(category.name)}
                    </div>
                  )}
                </div>
              </div>
              <span className="category-label">{category.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
});

export default CategoryChips;
