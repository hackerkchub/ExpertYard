import axios from "axios";
import { APP_CONFIG } from "../../config/appConfig";

const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.REQUEST_TIMEOUT
  // ❌ DO NOT SET CONTENT-TYPE HERE
});

// 🔐 Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🟢 IMPORTANT: Let axios decide content-type
    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // optional redirect
      // window.location.href = "/login";
    }

    const message =
      error?.response?.data?.message ||
      "Server error";

    return Promise.reject(message);
  }
);

export default api;
