import { getCategoryPath } from "../../../../shared/utils/categoryRoutes";

export const SEARCH_GROUPS = [
  { key: "experts", label: "Experts" },
  { key: "categories", label: "Categories" },
  { key: "locations", label: "Locations" },
  { key: "subcategories", label: "Subcategories" },
];

export const getPayload = (response) => response?.data?.data || response?.data || {};

export const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.experts)) return value.experts;
  if (Array.isArray(value?.categories)) return value.categories;
  if (Array.isArray(value?.subcategories)) return value.subcategories;
  return [];
};

export const normalizeGlobalResults = (response) => {
  const payload = getPayload(response);

  return {
    experts: asArray(payload.experts || payload.expert || payload.users),
    categories: asArray(payload.categories || payload.category),
    locations: asArray(payload.locations || payload.location_suggestions || payload.places),
    subcategories: asArray(payload.subcategories || payload.sub_categories || payload.subcategory),
  };
};

export const getInitials = (name = "") =>
  String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "GE";

export const getExpertId = (expert) =>
  expert?.slug || expert?.expert_slug || expert?.expert_id || expert?.id || expert?.user_id;

export const getCategoryId = (category) => category?.slug || category?.id || category?.category_id;

export const getSubcategoryId = (subcategory) =>
  subcategory?.slug || subcategory?.id || subcategory?.sub_category_id || subcategory?.subcategory_id;

export const getExpertPath = (expert) => {
  const id = getExpertId(expert);
  return id ? `/user/experts/${id}` : "/user/experts";
};

export const getCategoryResultPath = (category) =>
  getCategoryId(category) ? getCategoryPath(category) : "/user/categories";

export const getSubcategoryResultPath = (subcategory) => {
  const subcategoryId = getSubcategoryId(subcategory);
  const categoryId =
    subcategory?.category_id ||
    subcategory?.parent_category_id ||
    subcategory?.parent_id;

  if (categoryId && subcategoryId) {
    return `/user/experts?category=${encodeURIComponent(categoryId)}&sub_category=${encodeURIComponent(subcategoryId)}`;
  }

  if (subcategory?.category_slug || subcategory?.parent_category_slug) {
    return `/user/categories/${subcategory.category_slug || subcategory.parent_category_slug}`;
  }

  // The app routes subcategory expert lists by category/subcategory query params.
  // If the backend omits parent category identity, keep navigation on the stable expert list route.
  return subcategoryId
    ? `/user/experts?sub_category=${encodeURIComponent(subcategoryId)}`
    : "/user/categories";
};

export const flattenResults = (groups) =>
  SEARCH_GROUPS.flatMap((group) =>
    asArray(groups[group.key]).map((item, index) => ({
      group: group.key,
      key: `${group.key}-${item?.id || item?.slug || item?.expert_id || item?.subcategory_id || index}`,
      item,
    }))
  );

export const getResultPath = (group, item) => {
  if (group === "experts") return getExpertPath(item);
  if (group === "categories") return getCategoryResultPath(item);
  if (group === "locations") return `/user/search?location=${encodeURIComponent(item?.search_text || item?.displayName || item?.city || "")}`;
  return getSubcategoryResultPath(item);
};
