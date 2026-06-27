const USER_CATEGORY_BASE_PATH = "/user/category";
const USER_LEGACY_CATEGORY_BASE_PATH = "/user/subcategories";

export function toCategorySlug(category) {
  if (!category) return "";

  if (typeof category.slug === "string" && category.slug.trim()) {
    return category.slug.trim();
  }

  return String(category.name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCategoryPath(category) {
  const slug = toCategorySlug(category);
  return slug ? `${USER_CATEGORY_BASE_PATH}/${slug}` : USER_CATEGORY_BASE_PATH;
}

export function getCategoryExpertsPath(category) {
  const slug = toCategorySlug(category);
  return slug ? `${USER_CATEGORY_BASE_PATH}/${slug}/experts` : USER_CATEGORY_BASE_PATH;
}

export function toSlug(text) {
  if (!text) return "";
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCategorySubcategoriesPath(category) {
  const slug = toCategorySlug(category);
  if (slug && isNaN(slug)) {
    return `${USER_CATEGORY_BASE_PATH}/${slug}`;
  }
  const categoryId = category?.id || category?.category_id || slug;
  return categoryId ? `${USER_CATEGORY_BASE_PATH}/${categoryId}/subcategories` : USER_CATEGORY_BASE_PATH;
}

export function getSubcategoryExpertsPath(category, subcategory, params = {}) {
  const query = new URLSearchParams(params);
  const queryString = query.toString();

  const categorySlug = category?.slug || toCategorySlug(category) || (typeof category === "string" ? category : "");
  const subcategorySlug = subcategory?.slug || 
    (subcategory?.name ? toSlug(subcategory.name) : (typeof subcategory === "string" ? subcategory : ""));

  let path;
  if (categorySlug && subcategorySlug && isNaN(categorySlug) && isNaN(subcategorySlug)) {
    path = `${USER_CATEGORY_BASE_PATH}/${categorySlug}/${subcategorySlug}`;
  } else {
    const categoryId = category?.id || category;
    const subcategoryId = subcategory?.id || subcategory;
    path = `${USER_CATEGORY_BASE_PATH}/${categoryId}/subcategory/${subcategoryId}/experts`;
  }

  return queryString ? `${path}?${queryString}` : path;
}

export function getLegacyCategoryPath(categoryId) {
  return `${USER_LEGACY_CATEGORY_BASE_PATH}/${categoryId}`;
}

export function findCategoryBySlug(categories, slug) {
  if (!Array.isArray(categories) || !slug) return null;

  return (
    categories.find((category) => toCategorySlug(category) === slug) || null
  );
}

export function findCategoryById(categories, categoryId) {
  if (!Array.isArray(categories) || categoryId == null) return null;

  return (
    categories.find((category) => String(category.id) === String(categoryId)) || null
  );
}

export function buildCategorySeoTitle(categoryName) {
  return `${categoryName} Experts Online | Instant Advice on G9Expert`;
}

export function buildCategorySeoDescription(category) {
  const categoryName = category?.name || "Verified";

  if (category?.meta_desc?.trim()) {
    return category.meta_desc.trim();
  }

  return `Connect instantly with verified ${categoryName.toLowerCase()} experts on G9Expert. Get trusted guidance, quick answers, and real-time support online.`;
}

export function buildCategorySeoHeadline(categoryName) {
  return `Connect instantly with verified ${categoryName.toLowerCase()} experts`;
}
