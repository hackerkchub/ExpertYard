import axios from "./axiosInstance";

/* =====================================================
   📦 SERVICE API (USER / EXPERT / ADMIN COMMON)
===================================================== */

/* 🟢 GET ALL SERVICES */
export const getAllServices = () => {
  return axios.get("/services");
};

/* 🟢 GET SERVICE BY ID */
export const getServiceById = (id) => {
  return axios.get(`/services/${id}`);
};

/* 🟢 GET SERVICE BY SLUG */
export const getServiceBySlug = (slug) => {
  return axios.get(`/services/s/${slug}`);
};

/* 🟢 GET SERVICES BY EXPERT */
export const getServicesByExpert = (expertId) => {
  return axios.get(`/services/expert/${expertId}`);
};

/* 🟢 GET SERVICES BY CATEGORY (WITH PAGINATION) */
export const getServicesByCategory = ({
  categoryId,
  page = 1,
  limit = 10,
}) => {
  return axios.get(
    `/services/category/${categoryId}?page=${page}&limit=${limit}`
  );
};

/* 🟢 GET SERVICES BY SUBCATEGORY */
export const getServicesBySubCategory = (subCatId) => {
  return axios.get(`/services/subcategory/${subCatId}`);
};

/* =====================================================
   ✏️ CREATE SERVICE (FORM DATA)
===================================================== */
export const createService = (formData) => {
  return axios.post("/services", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* =====================================================
   ✏️ UPDATE SERVICE
===================================================== */
export const updateService = (id, formData) => {
  return axios.put(`/services/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* =====================================================
   ❌ DELETE SERVICE
===================================================== */
export const deleteService = (id) => {
  return axios.delete(`/services/${id}`);
};