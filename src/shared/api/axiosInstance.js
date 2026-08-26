import axios from "axios";
import { APP_CONFIG } from "../../config/appConfig";

let loader = null;

export const injectLoader = (_loader) => {
  loader = _loader;
};

const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.REQUEST_TIMEOUT,
  headers: {
    Accept: "application/json; charset=utf-8",
  },
});

const getRoleFromRoute = () => {
  const path = window.location.pathname;

  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/user")) return "user";
  if (path.startsWith("/expert")) return "expert";

  return null;
};

const cleanConflictingTokens = (activeRole) => {
  if (activeRole === "admin") {
    localStorage.removeItem("user_token");
    localStorage.removeItem("expert_token");
  } else if (activeRole === "user") {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("expert_token");
  } else if (activeRole === "expert") {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("user_token");
  }
};

/* REQUEST INTERCEPTOR */
api.interceptors.request.use(
  (config) => {
    // Only trigger global loader if explicitly requested via showGlobalLoader or useGlobalLoader
    if (config?.showGlobalLoader || config?.useGlobalLoader) {
      config._loaderActive = true;
      loader?.showLoader();
    }

    const adminToken = localStorage.getItem("admin_token");
    const expertToken = localStorage.getItem("expert_token");
    const userToken = localStorage.getItem("user_token");

    const routeRole = getRoleFromRoute();

    let token = null;
    let role = null;

    if (routeRole === "admin" && adminToken) {
      token = adminToken;
      role = "admin";
      cleanConflictingTokens("admin");
    } else if (routeRole === "user" && userToken) {
      token = userToken;
      role = "user";
      cleanConflictingTokens("user");
    } else if (routeRole === "expert" && expertToken) {
      token = expertToken;
      role = "expert";
      cleanConflictingTokens("expert");
    } else {
      if (adminToken) {
        token = adminToken;
        role = "admin";
        cleanConflictingTokens("admin");
      } else if (userToken) {
        token = userToken;
        role = "user";
        cleanConflictingTokens("user");
      } else if (expertToken) {
        token = expertToken;
        role = "expert";
        cleanConflictingTokens("expert");
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["x-client-role"] = role;
    }

    return config;
  },
  (error) => {
    if (error?.config?._loaderActive) {
      error.config._loaderActive = false;
      loader?.hideLoader();
    }
    return Promise.reject(error);
  }
);

/* RESPONSE INTERCEPTOR */
api.interceptors.response.use(
  (response) => {
    if (response?.config?._loaderActive) {
      response.config._loaderActive = false;
      loader?.hideLoader();
    }
    return response;
  },
  (error) => {
    if (error?.config?._loaderActive) {
      error.config._loaderActive = false;
      loader?.hideLoader();
    }

    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("expert_token");
      localStorage.removeItem("user_token");
    }

    return Promise.reject(
      error?.response?.data?.message ||
      error?.message ||
      "Server error"
    );
  }
);

export default api;