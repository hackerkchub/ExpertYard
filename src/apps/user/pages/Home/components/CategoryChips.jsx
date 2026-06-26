import React from "react";

const CategoryChips = React.memo(function CategoryChips({
  categories,
  selectedCategoryId,
  onSelect,
  loading,
}) {
  if (loading && !categories.length) {
    return (
      <div className="home-category-chips">
        {Array.from({ length: 8 }).map((_, index) => (
          <span className="home-chip home-chip--skeleton" key={index} />
        ))}
      </div>
    );
  }

  return (
    <nav className="home-category-chips" aria-label="Categories">
      <button
        type="button"
        className={!selectedCategoryId ? "active" : ""}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.slice(0, 18).map((category) => (
        <button
          type="button"
          key={category.id || category.slug || category.name}
          className={String(selectedCategoryId || "") === String(category.id || "") ? "active" : ""}
          onClick={() => onSelect(category)}
        >
          {category.image_url ? <img src={category.image_url} alt="" loading="lazy" /> : null}
          {category.name}
        </button>
      ))}
    </nav>
  );
});

export default CategoryChips;
