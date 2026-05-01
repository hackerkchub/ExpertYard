import api from "./axiosInstance";

/* ===========================
   GET SUBCATEGORIES
   API: /api/subcategory?category_id= (optional)
=========================== */
export const getAllSubcategoriesApi = async (categoryId = null) => {
  const url = categoryId 
    ? `/subcategory?category_id=${categoryId}` 
    : "/subcategory";
  const { data } = await api.get(url);
  return data;
};

/* ===========================
   GET SINGLE SUBCATEGORY
   API: /api/subcategory/:id
=========================== */
export const getSubCategoryByIdApi = async (id) => {
  const { data } = await api.get(`/subcategory/${id}`);
  return data;
};

/* ===========================
   CREATE SUBCATEGORY
   API: /api/subcategory
   (FormData required: category_id, name, image)
=========================== */
export const createSubcategoryApi = (formData) => {
  return api.post("/subcategory", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ===========================
   UPDATE SUBCATEGORY
   API: /api/subcategory/:id
   (FormData: category_id, name, image)
=========================== */
export const updateSubcategoryApi = ({ id, category_id, name, file }) => {
  const formData = new FormData();
  formData.append("category_id", category_id);
  formData.append("name", name);
  if (file) formData.append("image", file);
  
  return api.put(`/subcategory/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

/* ===========================
   DELETE SUBCATEGORY
   API: /api/subcategory/:id
=========================== */
export const deleteSubcategoryApi = (id) =>
  api.delete(`/subcategory/${id}`);

/* ===========================
   SAVE SUBCATEGORY (Expert)
   API: /expert/subcategory
=========================== */
export const saveSubCategoryApi = (data) =>
  api.post("/expert/subcategory", data);