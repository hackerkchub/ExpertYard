const USER_CATEGORY_BASE_PATH = "/user/categories";
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
  return `${categoryName} Experts Online | Instant Advice on ExpertYard`;
}

export function buildCategorySeoDescription(category) {
  const categoryName = category?.name || "Verified";

  if (category?.meta_desc?.trim()) {
    return category.meta_desc.trim();
  }

  return `Connect instantly with verified ${categoryName.toLowerCase()} experts on ExpertYard. Get trusted guidance, quick answers, and real-time support online.`;
}

export function buildCategorySeoHeadline(categoryName) {
  return `Connect instantly with verified ${categoryName.toLowerCase()} experts`;
}
