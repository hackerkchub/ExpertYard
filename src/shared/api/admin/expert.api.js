import adminApi from "./axiosInstance";

// LIST
export const getAllExpertsApi = () =>
  adminApi.get("/admin/experts");

// STATUS UPDATE
export const updateExpertStatusApi = (id, data) =>
  adminApi.put(`/admin/expert/status/${id}`, data);