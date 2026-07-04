import api from "./axiosInstance";

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
  return api.post("/expert/reels", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// Get all expert's reels
export const getExpertReelsApi = async () => {
  return api.get("/expert/reels");
};

// Get single reel detail for expert
export const getExpertReelByIdApi = async (id) => {
  return api.get(`/expert/reels/${id}`);
};

// Update reel (Multipart Form Data)
export const updateExpertReelApi = async (id, formData) => {
  return api.put(`/expert/reels/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// Delete reel
export const deleteExpertReelApi = async (id) => {
  return api.delete(`/expert/reels/${id}`);
};

// Submit reel for admin approval
export const submitExpertReelApi = async (id) => {
  return api.post(`/expert/reels/${id}/submit`);
};

/* =====================================================
   📌 ADMIN APIS
   ===================================================== */

// Get all reels
export const getAdminReelsApi = async () => {
  return api.get("/reels/admin/list");
};

// Get pending reels
export const getPendingReelsApi = async () => {
  return api.get("/reels/admin/pending");
};

// Approve reel
export const approveReelApi = async (id) => {
  return api.put(`/reels/admin/${id}/approve`);
};

// Reject reel
export const rejectReelApi = async (id, data) => {
  return api.put(`/reels/admin/${id}/reject`, data);
};

// Block reel
export const blockReelApi = async (id) => {
  return api.put(`/reels/admin/${id}/block`);
};

// Get reported reels
export const getReportedReelsApi = async () => {
  return api.get("/reels/admin/reports/list");
};

// Resolve report
export const resolveReportApi = async (id) => {
  return api.put(`/reels/admin/reports/${id}/resolve`);
};
