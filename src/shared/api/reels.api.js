import api from "./axiosInstance";
import expertApi from "./expertapi/axiosInstance";
import adminApi from "./admin/axiosInstance";

/* =====================================================
   📌 USER APIS
   ===================================================== */

// Get Reels public feed
export const getReelsFeedApi = async (params) => {
  return api.get("/reels/feed", { params });
};

// Get single reel by ID
export const getReelByIdApi = async (id) => {
  return api.get(`/reels/${id}`);
};

// Get single reel by slug
export const getReelBySlugApi = async (slug, params) => {
  return api.get(`/reels/slug/${slug}`, { params });
};

// Log view
export const logReelViewApi = async (id, data) => {
  return api.post(`/reels/${id}/view`, data);
};

// Like reel
export const likeReelApi = async (id, data) => {
  return api.post(`/reels/${id}/like`, data);
};

// Unlike reel
export const unlikeReelApi = async (id, data) => {
  return api.delete(`/reels/${id}/like`, { data });
};

// Add comment
export const addCommentApi = async (id, data) => {
  return api.post(`/reels/${id}/comment`, data);
};

// Get comments
export const getReelCommentsApi = async (id) => {
  return api.get(`/reels/${id}/comments`);
};

// Delete comment
export const deleteReelCommentApi = async (id, commentId) => {
  return api.delete(`/reels/${id}/comments/${commentId}`);
};

// Save reel
export const saveReelApi = async (id, data) => {
  return api.post(`/reels/${id}/save`, data);
};

// Unsave reel
export const unsaveReelApi = async (id, data) => {
  return api.delete(`/reels/${id}/save`, { data });
};

// Log share
export const logReelShareApi = async (id, data) => {
  return api.post(`/reels/${id}/share`, data);
};

// Report reel
export const reportReelApi = async (id, data) => {
  return api.post(`/reels/${id}/report`, data);
};

/* =====================================================
   📌 EXPERT APIS
   ===================================================== */

// Create new reel (Multipart Form Data)
export const createExpertReelApi = async (formData) => {
  return expertApi.post("/expert/reels", formData);
};

// Get all expert's reels
export const getExpertReelsApi = async () => {
  return expertApi.get("/expert/reels");
};

// Get single reel detail for expert
export const getExpertReelByIdApi = async (id) => {
  return expertApi.get(`/expert/reels/${id}`);
};

// Update reel (Multipart Form Data)
export const updateExpertReelApi = async (id, formData) => {
  return expertApi.put(`/expert/reels/${id}`, formData);
};

// Delete reel
export const deleteExpertReelApi = async (id) => {
  return expertApi.delete(`/expert/reels/${id}`);
};

// Submit reel for admin approval
export const submitExpertReelApi = async (id) => {
  return expertApi.post(`/expert/reels/${id}/submit`);
};

/* =====================================================
   📌 ADMIN APIS
   ===================================================== */

// Get all reels
export const getAdminReelsApi = async (params) => {
  return adminApi.get("/admin/reels", { params });
};

// Get pending reels
export const getPendingReelsApi = async () => {
  return adminApi.get("/admin/reels/pending");
};

// Get single reel detail for admin
export const getAdminReelByIdApi = async (id) => {
  return adminApi.get(`/admin/reels/${id}`);
};

// Approve reel
export const approveReelApi = async (id) => {
  return adminApi.put(`/admin/reels/${id}/approve`);
};

// Reject reel
export const rejectReelApi = async (id, data) => {
  return adminApi.put(`/admin/reels/${id}/reject`, data);
};

// Block reel
export const blockReelApi = async (id) => {
  return adminApi.put(`/admin/reels/${id}/block`);
};
