// src/shared/api/expertapi/auth.api.js
import api from "./axiosInstance";

// REGISTER
export const registerApi = (data) =>
  api.post("/expert/register", data);

// LOGIN
export const loginApi = (data) =>
  api.post("/expert/login", data);

// OTP VERIFY (agar use ho raha hai)
// export const verifyOtpApi = (data) =>
//   api.post("/expert/verify-otp", data);
/**
 * GET EXPERTS BY SUB CATEGORY
 * @param {number|string} subCategoryId
 */
export const getExpertsBySubCategoryApi = (subCategoryId) => {
  return api.get(`/expert-profile/subcategory/${subCategoryId}`);
};