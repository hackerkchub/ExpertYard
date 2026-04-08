import api from "./axiosInstance";

// ✅ Expert only APIs

export const createPlanApi = (data) => 
  api.post("/subscription/plan", data);

export const getPlansApi = (expertId) =>
  api.get(`/subscription/plans/${expertId}`);

export const updatePlanApi = (planId, data) =>
  api.put(`/subscription/plan/${planId}`, data);

export const deletePlanApi = (planId) =>
  api.delete(`/subscription/plan/${planId}`);

// export const getPlansApi = (expertId) =>
  // api.get(`/subscription/plans/${expertId}`);