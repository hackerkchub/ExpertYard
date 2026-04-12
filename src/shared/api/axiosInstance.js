import axios from "axios";
import { APP_CONFIG } from "../../config/appConfig";

let loader = null;

/* ===============================
   INJECT GLOBAL LOADER
================================ */
export const injectLoader = (_loader) => {
  loader = _loader;
};

const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.REQUEST_TIMEOUT
});

/* ===============================
   HELPER: GET ROLE FROM ROUTE
================================ */
const getRoleFromRoute = () => {
  const path = window.location.pathname;

  if (path.startsWith("/user")) return "user";
  if (path.startsWith("/expert")) return "expert";

  return null; // fallback
};

/* ===============================
   HELPER: CLEAN CONFLICT TOKENS
================================ */
const cleanConflictingTokens = (activeRole) => {
  if (activeRole === "user") {
    localStorage.removeItem("expert_token");
  } else if (activeRole === "expert") {
    localStorage.removeItem("user_token");
  }
};

/* ===============================
   REQUEST INTERCEPTOR
================================ */
api.interceptors.request.use(
  (config) => {

    /* GLOBAL LOADER START */
    if (!config.skipLoader) {
      loader?.showLoader();
    }

    const expertToken = localStorage.getItem("expert_token");
    const userToken = localStorage.getItem("user_token");

    const routeRole = getRoleFromRoute();

    let token = null;
    let role = null;

    /* ===============================
       ROUTE BASED TOKEN SELECTION
    ============================== */

    if (routeRole === "user" && userToken) {
      token = userToken;
      role = "user";
      cleanConflictingTokens("user"); // ✅ auto clean
    } 
    else if (routeRole === "expert" && expertToken) {
      token = expertToken;
      role = "expert";
      cleanConflictingTokens("expert"); // ✅ auto clean
    } 
    else {
      /* ===============================
         FALLBACK (SAFE MODE)
      ============================== */
      if (userToken) {
        token = userToken;
        role = "user";
        cleanConflictingTokens("user");
      } else if (expertToken) {
        token = expertToken;
        role = "expert";
        cleanConflictingTokens("expert");
      }
    }

    /* ===============================
       ATTACH HEADERS
    ============================== */
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["x-client-role"] = role;
    }

    return config;

  },
  (error) => {
    loader?.hideLoader();
    return Promise.reject(error);
  }
);

/* ===============================
   RESPONSE INTERCEPTOR
================================ */
api.interceptors.response.use(

  (response) => {

    /* GLOBAL LOADER STOP */
    if (!response.config.skipLoader) {
      loader?.hideLoader();
    }

    return response;
  },

  (error) => {

    if (!error.config?.skipLoader) {
      loader?.hideLoader();
    }

    const status = error?.response?.status;

    /* ===============================
       TOKEN EXPIRED / UNAUTHORIZED
    ============================== */
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