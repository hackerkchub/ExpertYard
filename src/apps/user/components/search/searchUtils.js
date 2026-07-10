import { getCategoryPath } from "../../../../shared/utils/categoryRoutes";

export const SEARCH_GROUPS = [
  { key: "experts", label: "Experts" },
  { key: "categories", label: "Categories" },
  { key: "services", label: "Services" },
  { key: "locations", label: "Locations" },
  { key: "subcategories", label: "Subcategories" },
];

export const getPayload = (response) => response?.data?.data || response?.data || {};

export const normalizeSearchTerm = (value = "") => String(value || "").trim().replace(/\s+/g, " ");

export const buildUserSearchPath = (value = "", paramName = "q") => {
  const query = normalizeSearchTerm(value);
  if (!query) return "/user/search";

  const params = new URLSearchParams();
  params.set(paramName, query);
  return `/user/search?${params.toString()}`;
};

export const getStoredLocation = () => {
  try {
    const saved = localStorage.getItem("last_selected_location");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const getLocationDisplayName = (location = {}) =>
  normalizeSearchTerm(
    location.search_text ||
      location.displayName ||
      [location.area, location.city, location.pincode, location.state].filter(Boolean).join(", ")
  );

export const getStoredLocationQuery = () => {
  const location = getStoredLocation();
  if (!location || location.type === "global") return "";
  return getLocationDisplayName(location);
};

export const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.experts)) return value.experts;
  if (Array.isArray(value?.categories)) return value.categories;
  if (Array.isArray(value?.subcategories)) return value.subcategories;
  if (Array.isArray(value?.services)) return value.services;
  return [];
};

export const normalizeGlobalResults = (response) => {
  const payload = getPayload(response);

  return {
    experts: asArray(payload.experts || payload.expert || payload.users),
    categories: asArray(payload.categories || payload.category),
    services: asArray(payload.services || payload.service),
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
  if (group === "services") return `/user/service-details/${item?.slug || item?.service_slug || item?.id}`;
  if (group === "locations") return buildUserSearchPath(getLocationDisplayName(item), "location");
  return getSubcategoryResultPath(item);
};
