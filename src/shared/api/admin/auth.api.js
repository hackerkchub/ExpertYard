import adminApi from "./axiosInstance";

export const adminLoginApi = (data) =>
  adminApi.post("/admin/login", data);