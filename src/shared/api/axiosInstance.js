import axios from "axios";
import { APP_CONFIG } from "../../config/appConfig";

const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.REQUEST_TIMEOUT
});

// 🔐 Request Interceptor
api.interceptors.request.use(
  (config) => {
    // ✅ SUPPORT BOTH USER & EXPERT TOKENS
    const token =
      localStorage.getItem("expert_token") ||
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("expert_token");
      localStorage.removeItem("token");
      // optional redirect
      // window.location.href = "/login";
    }

    return Promise.reject(
      error?.response?.data?.message || "Server error"
    );
  }
);

export default api;
