import api from "../axiosInstance";

export const adminLoginApi = (data) =>
  api.post("/admin/login", data);