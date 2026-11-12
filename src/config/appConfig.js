const BACKEND_PORT = "5000";
const DEFAULT_BACKEND_IP = "localhost";

export const PRODUCTION_API_URL = "https://api.g9expert.com/api";
export const PRODUCTION_SOCKET_URL = "https://api.g9expert.com";
export const PRODUCTION_FRONTEND_URL = "https://g9expert.com";

const normalizeApiUrl = (url) => {
  if (!url) return "";
  const clean = url.trim().replace(/\/+$/, "");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
};

const normalizeSocketUrl = (url) => {
  if (!url) return "";
  return url.trim().replace(/\/+$/, "").replace(/\/api\/?$/, "");
};

const getApiBaseUrl = () => {
  // If .env provides an API URL, always use it first.
  if (import.meta.env.VITE_API_BASE_URL) {
    return normalizeApiUrl(import.meta.env.VITE_API_BASE_URL);
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname, port } = window.location;

    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";

    // Running on live server or remote domain (e.g. g9expert.com, softmaxs.com, guidexa.in, vercel, etc.)
    if (!isLocalhost) {
      // If accessed directly via raw IP with dev port (e.g. 10.x.x.x:5173), use BACKEND_PORT
      if (port && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
        return `${protocol}//${hostname}:${BACKEND_PORT}/api`;
      }
      // Standard production web deployment -> route to dedicated production API domain
      return PRODUCTION_API_URL;
    }
  }

  // Fallback for local development
  return `http://localhost:${BACKEND_PORT}/api`;
};

const getSocketUrl = () => {
  // Allow override from .env
  if (import.meta.env.VITE_SOCKET_URL) {
    return normalizeSocketUrl(import.meta.env.VITE_SOCKET_URL);
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname, port } = window.location;

    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";

    if (!isLocalhost) {
      if (port && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
        return `${protocol}//${hostname}:${BACKEND_PORT}`;
      }
      return PRODUCTION_SOCKET_URL;
    }
  }

  return `http://localhost:${BACKEND_PORT}`;
};

const getFrontendBaseUrl = () => {
  if (import.meta.env.VITE_FRONTEND_BASE_URL) {
    return import.meta.env.VITE_FRONTEND_BASE_URL.replace(/\/+$/, "");
  }
  if (import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }
  return PRODUCTION_FRONTEND_URL;
};

const getUploadBaseUrl = () => {
  const apiBase = getApiBaseUrl();
  const root = apiBase ? apiBase.replace(/\/api\/?$/, "") : PRODUCTION_SOCKET_URL;
  return `${root}/uploads`;
};

export const APP_CONFIG = {
  APP_NAME: import.meta.env.VITE_APP_NAME || "G9Expert",
  APP_TYPE: import.meta.env.VITE_APP_TYPE || "web",
  API_BASE_URL: getApiBaseUrl(),
  SOCKET_URL: getSocketUrl(),
  FRONTEND_BASE_URL: getFrontendBaseUrl(),
  UPLOAD_BASE_URL: getUploadBaseUrl(),
  REQUEST_TIMEOUT: Number(import.meta.env.VITE_REQUEST_TIMEOUT || 30000),
  DEFAULT_BACKEND_IP,
  BACKEND_PORT,
};

/**
 * Builds absolute API URL from relative or full path, ensuring no duplicate /api segments.
 */
export const buildApiUrl = (path = "") => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const base = APP_CONFIG.API_BASE_URL.replace(/\/+$/, "");
  if (cleanPath.startsWith("/api/")) {
    return `${base.replace(/\/api\/?$/, "")}${cleanPath}`;
  }
  if (cleanPath === "/api") {
    return base;
  }
  return `${base}${cleanPath}`;
};

/**
 * Centralized fetch helper targeting the active API base URL.
 */
export const apiFetch = async (path, options = {}) => {
  return await fetch(buildApiUrl(path), options);
};

/**
 * Builds absolute upload / media URL from relative path.
 * Avoids duplicate slashes and duplicate uploads/ segments.
 */
export const buildUploadUrl = (filePath) => {
  if (!filePath) return "";
  const str = String(filePath).trim();
  if (!str) return "";
  if (/^(https?:|data:|blob:)/i.test(str)) {
    return str;
  }
  let clean = str.replace(/^\/+/, "");
  while (clean.startsWith("uploads/uploads/")) {
    clean = clean.replace(/^uploads\//, "");
  }
  const base = APP_CONFIG.API_BASE_URL
    ? APP_CONFIG.API_BASE_URL.replace(/\/api\/?$/, "")
    : PRODUCTION_SOCKET_URL;

  if (clean.startsWith("uploads/")) {
    return `${base}/${clean}`;
  }
  return `${base}/uploads/${clean}`;
};

export default APP_CONFIG;