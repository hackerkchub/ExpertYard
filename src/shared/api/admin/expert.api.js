import adminApi from "./axiosInstance";

// EXISTING APIs
export const getAllExpertsApi = () =>
  adminApi.get("/admin/experts");

export const updateExpertStatusApi = (id, data) =>
  adminApi.put(`/expert/status/${id}`, data);

export const getFullExpertApi = (id) =>
  adminApi.get(`/expert/full/${id}`);

export const deleteExpertApi = (id) =>
  adminApi.delete(`/expert/${id}`);

export const deleteReviewApi = (id) =>
  adminApi.delete(`/expert/review/${id}`);

export const deleteCommentApi = (id) =>
  adminApi.delete(`/expert/comment/${id}`);

export const deletePostApi = (id) =>
  adminApi.delete(`/expert/post/${id}`);

export const deleteExperienceApi = (id) =>
  adminApi.delete(`/expert/experience/${id}`);


// =========================
// EXPERT REGISTRATIONS
// =========================

// List all registrations
export const getExpertRegistrationsApi = (status = "") =>
  adminApi.get(
    `/expert-detail/expert-registration${
      status ? `?status=${status}` : ""
    }`
  );

// Single registration detail
export const getExpertRegistrationDetailApi = (id) =>
  adminApi.get(`/expert-detail/expert-registration/${id}`);

// Update registration status + note
export const updateExpertRegistrationStatusApi = (
  id,
  status,
  adminNote = ""
) =>
  adminApi.patch(
    `/expert-detail/expert-registration/${id}/status`,
    {
      status,
      adminNote,
    }
  );

// Dashboard stats
export const getExpertRegistrationStatsApi = () =>
  adminApi.get("/expert-detail/expert-registration-stats");