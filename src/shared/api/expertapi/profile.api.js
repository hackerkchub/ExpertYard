import api from "./axiosInstance";

/* ================= PROFILE CREATE ================= */
export const createProfileApi = (formData) => {
  return api.post("/expert-profile/create", formData);
};

/* ================= PROFILE UPDATE ================= */
export const updateExpertProfileApi = (formData) => {
  return api.put("/expert-profile/expert", formData);
};

/* ================= ALL PROFILES ================= */
export const getExpertsProfileListApi = async (options = {}) => {
  const { data } = await api.get("/expert-profile/list", { showGlobalLoader: true, ...options });
  return data;
};

/* ================= GET BY EXPERT ID ================= */
export const getExpertProfileApi = (expertId, options = {}) => {
  return api.get(`/expert-profile/expert/${expertId}`, { showGlobalLoader: true, ...options });
};

export const getExpertBySlugApi = (slug, options = {}) => {
  return api.get(`/expert-profile/slug/${slug}`, { showGlobalLoader: true, ...options });
};