import api from "./axiosInstance";

export const getCategoriesApi = () =>
  api.get("/category/list");



// get subcategories by category
export const getSubCategoriesApi = (categoryId) =>
  api.get(`/subcategory?category_id=${categoryId}`);
