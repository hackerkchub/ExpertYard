import adminApi from "./axiosInstance";

// LIST
export const getAllExpertsApi = () =>
  adminApi.get("/admin/experts");

// STATUS UPDATE
export const updateExpertStatusApi = (id, data) =>
  adminApi.put(`/admin/expert/status/${id}`, data);
// GET FULL EXPERT DETAILS
export const getFullExpertApi = (id) =>
  adminApi.get(`/expert/full/${id}`);

// DELETE EXPERT
export const deleteExpertApi = (id) =>
  adminApi.delete(`/expert/${id}`);

// DELETE REVIEW
export const deleteReviewApi = (id) =>
  adminApi.delete(`/expert/review/${id}`);

// DELETE COMMENT
export const deleteCommentApi = (id) =>
  adminApi.delete(`/expert/comment/${id}`);

// DELETE POST
export const deletePostApi = (id) =>
  adminApi.delete(`/expert/post/${id}`);

// DELETE EXPERIENCE
export const deleteExperienceApi = (id) =>
  adminApi.delete(`/expert/experience/${id}`);