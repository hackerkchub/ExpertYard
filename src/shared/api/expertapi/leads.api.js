import api from "./axiosInstance";

export const getExpertLeadStatsApi = () => api.get("/expert/leads/stats");
export const getExpertLeadsApi = (tab = "all") => api.get("/expert/leads", { params: { tab } });
export const getExpertLeadApi = (id) => api.get(`/expert/leads/${id}`);
export const acceptExpertLeadApi = (id) => api.patch(`/expert/leads/${id}/accept`);
export const updateExpertLeadStatusApi = (id, status) =>
  api.patch(`/expert/leads/${id}/status`, { status });
export const addExpertLeadNoteApi = (id, note) =>
  api.post(`/expert/leads/${id}/notes`, { note });
export const getExpertLeadTimelineApi = (id) => api.get(`/expert/leads/${id}/timeline`);
export const getExpertProfileVisitsApi = () => api.get("/expert/lead-events/profile-visits");
export const getExpertCategoryInterestApi = () => api.get("/expert/lead-events/category-interest");
