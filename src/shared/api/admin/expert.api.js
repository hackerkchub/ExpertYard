import adminApi from "./axiosInstance";

// EXISTING APIs
export const getAllExpertsApi = () =>
  adminApi.get("/admin/experts");

export const updateExpertStatusApi = (id, data) =>
  adminApi.put(`/expert/status/${id}`, data);

export const getFullExpertApi = (id) =>
  adminApi.get(`/expert/full/${id}`);

export const getExpertAccessSettingsApi = (id) =>
  adminApi.get(`/expert/${id}/access-settings`);

export const updateExpertAccessSettingsApi = (id, data) =>
  adminApi.put(`/expert/${id}/access-settings`, data);

export const deleteExpertApi = (id) =>
  adminApi.delete(`/admin/experts/${id}/delete`);

export const updateExpertRankApi = (id, data) =>
  adminApi.put(`/admin/experts/${id}/rank`, data);

export const getDeletedExpertsApi = ({ page = 1, limit = 20 } = {}) =>
  adminApi.get(`/admin/deleted-experts?page=${page}&limit=${limit}`);

export const getDeletedExpertDetailApi = (id) =>
  adminApi.get(`/admin/deleted-experts/${id}`);

export const restoreDeletedExpertApi = (id) =>
  adminApi.post(`/admin/deleted-experts/${id}/restore`);

export const permanentDeleteDeletedExpertApi = (id) =>
  adminApi.delete(`/admin/deleted-experts/${id}/permanent`);

export const deleteReviewApi = (id) =>
  adminApi.delete(`/expert/review/${id}`);

export const deleteCommentApi = (id) =>
  adminApi.delete(`/expert/comment/${id}`);

export const deletePostApi = (id) =>
  adminApi.delete(`/expert/post/${id}`);

export const deleteExperienceApi = (id) =>
  adminApi.delete(`/expert/experience/${id}`);

export const updateManagedExpertProfileApi = (id, formData) =>
  adminApi.put(`/admin/experts/${id}/profile`, formData);

export const createManagedExpertPostApi = (id, formData) =>
  adminApi.post(`/admin/experts/${id}/posts`, formData);

export const updateManagedExpertPostApi = (id, postId, formData) =>
  adminApi.put(`/admin/experts/${id}/posts/${postId}`, formData);

export const createManagedExpertServiceApi = (id, formData) =>
  adminApi.post(`/admin/experts/${id}/services`, formData);

export const updateManagedExpertServiceApi = (id, serviceId, formData) =>
  adminApi.put(`/admin/experts/${id}/services/${serviceId}`, formData);

export const deleteManagedExpertServiceApi = (id, serviceId) =>
  adminApi.delete(`/admin/experts/${id}/services/${serviceId}`);

export const updateManagedExpertPricingApi = (id, data) =>
  adminApi.put(`/admin/experts/${id}/pricing`, data);

export const createManagedExpertPlanApi = (id, data) =>
  adminApi.post(`/admin/experts/${id}/plans`, data);

export const updateManagedExpertPlanApi = (id, planId, data) =>
  adminApi.put(`/admin/experts/${id}/plans/${planId}`, data);

export const deleteManagedExpertPlanApi = (id, planId) =>
  adminApi.delete(`/admin/experts/${id}/plans/${planId}`);

export const createManagedExpertExperienceApi = (id, formData) =>
  adminApi.post(`/admin/experts/${id}/experience`, formData);

export const updateManagedExpertExperienceApi = (id, experienceId, formData) =>
  adminApi.put(`/admin/experts/${id}/experience/${experienceId}`, formData);

export const updateManagedExpertPasswordApi = (id, data) =>
  adminApi.put(`/admin/experts/${id}/password`, data);

export const createManagedExpertReelApi = (id, formData) =>
  adminApi.post(`/admin/reels/expert/${id}`, formData);

export const updateManagedExpertReelApi = (reelId, formData) =>
  adminApi.put(`/admin/reels/${reelId}`, formData);

export const deleteManagedExpertReelApi = (reelId) =>
  adminApi.delete(`/admin/reels/${reelId}`);


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
