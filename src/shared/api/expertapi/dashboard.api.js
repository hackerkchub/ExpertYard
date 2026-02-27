import api from "./axiosInstance";

export const getExpertDashboardApi = () =>
  api.get("/expert/dashboard");