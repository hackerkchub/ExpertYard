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

const isFileLike = (value) =>
  value &&
  typeof value === "object" &&
  typeof value.name === "string" &&
  typeof value.size === "number" &&
  typeof value.type === "string";

const createSubcategoryFormData = ({ category_id, name, image }) => {
  const formData = new FormData();
  formData.append("category_id", category_id);
  formData.append("name", name);
  if (isFileLike(image)) {
    formData.append("image", image);
  }
  return formData;
};

/* ===========================
   CREATE SUBCATEGORY
   API: /api/subcategory
   category_id + name required, image optional
=========================== */
export const createSubcategoryApi = (payload) => {
  if (payload instanceof FormData) {
    return api.post("/subcategory", payload);
  }

  const cleanPayload = {
    category_id: payload.category_id,
    name: payload.name,
  };

  if (!isFileLike(payload.image)) {
    return api.post("/subcategory", cleanPayload);
  }

  return api.post("/subcategory", createSubcategoryFormData(payload));
};

/* ===========================
   UPDATE SUBCATEGORY
   API: /api/subcategory/:id
   (FormData: category_id, name, image)
=========================== */
export const updateSubcategoryApi = ({ id, category_id, name, file }) => {
  if (!isFileLike(file)) {
    return api.put(`/subcategory/${id}`, { category_id, name });
  }

  return api.put(
    `/subcategory/${id}`,
    createSubcategoryFormData({ category_id, name, image: file })
  );
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
