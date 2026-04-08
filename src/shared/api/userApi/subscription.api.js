import api from "./axiosInstance";

// ✅ User only APIs

export const buySubscriptionApi = (plan_id) =>
  api.post("/subscription/buy", { plan_id });

export const getMySubscriptionApi = (expertId) =>
  api.get(`/subscription/my/${expertId}`);

export const getPlansApi = (expertId) =>
  api.get(`/subscription/plans/${expertId}`);