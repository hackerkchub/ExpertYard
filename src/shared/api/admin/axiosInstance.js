import axios from "axios";
import { APP_CONFIG } from "../../../config/appConfig";

const adminApi = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.REQUEST_TIMEOUT,
});

// 🔐 REQUEST INTERCEPTOR
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ RESPONSE INTERCEPTOR
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");

      // optional
      // window.location.href = "/admin/login";
    }

    const message =
      error?.response?.data?.message || "Server error";

    return Promise.reject(message);
  }
);

export default adminApi;