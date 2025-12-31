import api from "./axiosInstance";

/* ================================
   📂 SUBCATEGORY APIS
================================ */

/**
 * ✅ Get all subcategories
 * GET /api/subcategory
 */
export const getAllSubcategoriesApi = async () => {
  const { data } = await api.get("/subcategory");
  return data;
};

/**
 * ✅ Get subcategories by category id
 * GET /api/subcategory?category_id=4
 */
export const getSubcategoriesByCategoryIdApi = async (categoryId) => {
  const { data } = await api.get("/subcategory", {
    params: { category_id: categoryId }
  });
  return data;
};

/**
 * ✅ Get subcategory by id
 * GET /api/subcategory/5
 */
export const getSubcategoryByIdApi = async (subCategoryId) => {
  const { data } = await api.get(`/subcategory/${subCategoryId}`);
  return data;
};

/**
 * ✅ Create subcategory
 * POST /api/subcategory
 * FormData: category_id, name, image
 */
export const createSubcategoryApi = async (payload) => {
  const formData = new FormData();
  formData.append("category_id", payload.category_id);
  formData.append("name", payload.name);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const { data } = await api.post("/subcategory", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
};

/**
 * ✅ Update subcategory
 * PUT /api/subcategory/2
 * FormData: category_id, name, image
 */
export const updateSubcategoryApi = async (subCategoryId, payload) => {
  const formData = new FormData();
  formData.append("category_id", payload.category_id);
  formData.append("name", payload.name);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const { data } = await api.put(
    `/subcategory/${subCategoryId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return data;
};

/**
 * ✅ Delete subcategory
 * DELETE /api/subcategory/4
 */
export const deleteSubcategoryApi = async (subCategoryId) => {
  const { data } = await api.delete(`/subcategory/${subCategoryId}`);
  return data;
};
