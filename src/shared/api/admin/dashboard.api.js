import adminApi from "./axiosInstance";

export const getAdminDashboardApi = () =>
  adminApi.get("/admin/dashboard");