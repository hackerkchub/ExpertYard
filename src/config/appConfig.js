const BACKEND_PORT = "5000";
const DEFAULT_BACKEND_IP = "localhost";

const getApiBaseUrl = () => {
  // If .env provides an API URL, always use it first.
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname, port } = window.location;

    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";

    // Running on live server or remote domain (e.g. softmaxs.com, g9expert.com, guidexa.in, vercel, etc.)
    if (!isLocalhost) {
      // If accessed directly via raw IP with dev port (e.g. 10.x.x.x:5173), use BACKEND_PORT
      if (port && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
        return `${protocol}//${hostname}:${BACKEND_PORT}/api`;
      }
      // Standard domain deployment -> relative /api route (e.g. https://domain.com/api)
      return `${protocol}//${hostname}/api`;
    }
  }

  // Fallback for local development
  return `http://localhost:${BACKEND_PORT}/api`;
};

const getSocketUrl = () => {
  // Allow override from .env
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
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
      return `${protocol}//${hostname}`;
    }
  }

  return `http://localhost:${BACKEND_PORT}`;
};

export const APP_CONFIG = {
  APP_NAME: import.meta.env.VITE_APP_NAME || "G9Expert",
  APP_TYPE: import.meta.env.VITE_APP_TYPE || "web",
  API_BASE_URL: getApiBaseUrl(),
  SOCKET_URL: getSocketUrl(),
  REQUEST_TIMEOUT: Number(import.meta.env.VITE_REQUEST_TIMEOUT || 30000),
  DEFAULT_BACKEND_IP,
  BACKEND_PORT,
};

export default APP_CONFIG;