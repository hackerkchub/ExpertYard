import axios from "axios";
import { APP_CONFIG } from "../../config/appConfig";

const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.REQUEST_TIMEOUT
});

/* ===============================
   REQUEST INTERCEPTOR
================================ */
api.interceptors.request.use(
  (config) => {

    const expertToken = localStorage.getItem("expert_token");
    const userToken = localStorage.getItem("user_token");

    const token = expertToken || userToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    /* OPTIONAL ROLE HEADER */
    if (expertToken) {
      config.headers["x-client-role"] = "expert";
    } else if (userToken) {
      config.headers["x-client-role"] = "user";
    }

    return config;

  },
  (error) => Promise.reject(error)
);

/* ===============================
   RESPONSE INTERCEPTOR
================================ */
api.interceptors.response.use(

  (response) => response,

  (error) => {

    const status = error?.response?.status;

    /* TOKEN EXPIRED */
    if (status === 401) {

      localStorage.removeItem("expert_token");
      localStorage.removeItem("user_token");

      // optional redirect
      // window.location.href = "/login";

    }

    return Promise.reject(
      error?.response?.data?.message ||
      error?.message ||
      "Server error"
    );

  }
);

export default api;