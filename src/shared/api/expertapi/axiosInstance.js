import axios from "axios";
import { APP_CONFIG } from "../../../config/appConfig";

let loader = null;

export const injectExpertLoader = (_loader) => {
  loader = _loader;
};

const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.REQUEST_TIMEOUT
});

/* REQUEST */
api.interceptors.request.use(
  (config) => {

    if (!config.skipLoader) {
      loader?.showLoader();
    }

    const token = localStorage.getItem("expert_token");

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
api.interceptors.response.use(
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
      localStorage.removeItem("expert_token");
    }

    return Promise.reject(error);
  }
);

export default api;