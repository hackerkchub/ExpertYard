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
export const getExpertsProfileListApi = async () => {
  const { data } = await api.get("/expert-profile/list");
  return data;
};

/* ================= GET BY EXPERT ID ================= */
export const getExpertProfileApi = (expertId) => {
  return api.get(`/expert-profile/expert/${expertId}`);
};

export const getExpertBySlugApi = (slug) => {
  return api.get(`/expert-profile/slug/${slug}`);
};