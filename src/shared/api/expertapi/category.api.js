import api from "./axiosInstance";

/* ===========================
   GET CATEGORIES
=========================== */
export const getCategoriesApi = () =>
  api.get("/category/list");

/* ===========================
   GET SUBCATEGORIES
=========================== */
export const getSubCategoriesApi = (categoryId) =>
  api.get(`/subcategory?category_id=${categoryId}`);

/* ===========================
   CREATE CATEGORY
   API: /api/category/create?name&image
   (FormData required)
=========================== */
export const createCategoryApi = (formData) => {
  return api.post("/category/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ===========================
   UPDATE CATEGORY
   API: /api/category/update/:id
   (FormData: id, name, image)
=========================== */
export const updateCategoryApi = ({ id, name, file }) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("name", name);
  if (file) formData.append("image", file);
  return api.put(`/category/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

/* ===========================
   DELETE CATEGORY
   API: /api/category/delete/:id
=========================== */
export const deleteCategoryApi = (id) =>
  api.delete(`/category/delete/${id}`);
