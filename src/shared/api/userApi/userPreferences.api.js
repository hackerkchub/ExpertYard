import { APP_CONFIG } from "../../../config/appConfig";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("user_token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("user_token") ||
    sessionStorage.getItem("userToken") ||
    sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getUserPreferencesApi = async () => {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/user/preferences`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getUserPreferencesApi Error:", error);
    return { success: false, message: error.message };
  }
};

export const updateUserPreferencesApi = async (preferencesData) => {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/user/preferences`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(preferencesData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("updateUserPreferencesApi Error:", error);
    return { success: false, message: error.message };
  }
};

export const fetchCatalogCategoriesApi = async () => {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/category/list`, { method: "GET" });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error("fetchCatalogCategoriesApi Error:", err);
    return [];
  }
};

export const fetchCatalogSubcategoriesApi = async (categoryIds = "") => {
  try {
    let queryParam = "";
    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      queryParam = `?category_id=${categoryIds.join(",")}`;
    } else if (categoryIds) {
      queryParam = `?category_id=${categoryIds}`;
    }
    const url = `${APP_CONFIG.API_BASE_URL}/subcategory${queryParam}`;
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error("fetchCatalogSubcategoriesApi Error:", err);
    return [];
  }
};

export const fetchCatalogServicesApi = async (subcategoryIds = [], categoryIds = []) => {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/master-services/public`, { method: "GET" });
    const data = await response.json();
    if (!data.success || !Array.isArray(data.data)) return [];
    
    let services = data.data;

    // Filter by subcategory or category IDs if provided
    const subIds = (Array.isArray(subcategoryIds) ? subcategoryIds : [subcategoryIds])
      .map(Number)
      .filter((n) => n > 0);
    const catIds = (Array.isArray(categoryIds) ? categoryIds : [categoryIds])
      .map(Number)
      .filter((n) => n > 0);

    if (subIds.length > 0) {
      services = services.filter((s) => subIds.includes(Number(s.subcategory_id)));
    } else if (catIds.length > 0) {
      services = services.filter((s) => catIds.includes(Number(s.category_id)));
    }

    return services;
  } catch (err) {
    console.error("fetchCatalogServicesApi Error:", err);
    return [];
  }
};
