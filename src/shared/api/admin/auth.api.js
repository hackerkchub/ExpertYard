import adminApi from "./axiosInstance";

export const adminLoginApi = (data) =>
  adminApi.post("/admin/login", data);

export const adminVerifyMfaApi = (data) =>
  adminApi.post("/admin/mfa/verify", data);

export const adminResendMfaApi = (data) =>
  adminApi.post("/admin/mfa/resend", data);