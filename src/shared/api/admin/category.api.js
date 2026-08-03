import api from "./axiosInstance";

/* ===========================
   GET CATEGORIES
=========================== */
export const getCategoriesApi = async () => {
  const { data } = await api.get("/category/list?admin=true");
  return data;
};
/* ===========================
   GET SUBCATEGORIES
=========================== */
export const getSubCategoriesApi = (categoryId) =>
  api.get(`/subcategory?category_id=${categoryId}&admin=true`);

/* ===========================
   UPDATE CATEGORY STATUS
=========================== */
export const updateCategoryStatusApi = (categoryId, is_active) =>
  api.patch(`/category/${categoryId}/status`, { is_active });

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
export const updateCategoryApi = ({ id, name, file, show_experts, show_master_services, display_order }) => {
  const formData = new FormData();
  formData.append("id", id);
  if (name !== undefined) formData.append("name", name);
  if (show_experts !== undefined) {
    const isExpTrue = show_experts === true || show_experts === 1 || show_experts === "1" || show_experts === "true" || show_experts === "yes";
    formData.append("show_experts", isExpTrue ? "1" : "0");
  }
  if (show_master_services !== undefined) {
    const isMSTrue = show_master_services === true || show_master_services === 1 || show_master_services === "1" || show_master_services === "true" || show_master_services === "yes";
    formData.append("show_master_services", isMSTrue ? "1" : "0");
  }
  if (display_order !== undefined) formData.append("display_order", String(display_order));
  if (file) formData.append("image", file);
  return api.put(`/category/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const saveCategoryApi = (data) =>
  api.post("/expert/category", data);


export const saveSubCategoryApi = (data) =>
  api.post("/expert/subcategory", data);
/* ===========================
   DELETE CATEGORY
   API: /api/category/delete/:id
=========================== */
export const deleteCategoryApi = (id) =>
  api.delete(`/category/delete/${id}`);
