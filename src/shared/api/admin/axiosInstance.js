import axios from "axios";
import { APP_CONFIG } from "../../../config/appConfig";

let loader = null;

export const injectAdminLoader = (_loader) => {
  loader = _loader;
};

const adminApi = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.REQUEST_TIMEOUT
});

/* REQUEST */
adminApi.interceptors.request.use(
  (config) => {

    if (!config.skipLoader) {
      loader?.showLoader();
    }

    const token = localStorage.getItem("admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {

    loader?.hideLoader();

    return Promise.reject(error);
  }
);

/* RESPONSE */
adminApi.interceptors.response.use(
  (response) => {

    if (!response.config.skipLoader) {
      loader?.hideLoader();
    }

    return response;
  },
  (error) => {

    if (!error.config?.skipLoader) {
      loader?.hideLoader();
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
    }

    const message =
      error?.response?.data?.message ||
      "Server error";

    return Promise.reject(message);
  }
);

export default adminApi;