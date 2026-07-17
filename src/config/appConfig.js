const BACKEND_PORT = "5000";
const DEFAULT_BACKEND_IP = "10.117.35.234";

const getApiBaseUrl = () => {
  // If .env provides an API URL, always use it first.
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;

    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";

    // Running from LAN IP (e.g. http://10.117.35.234:5173)
    if (!isLocalhost) {
      return `${protocol}//${hostname}:${BACKEND_PORT}/api`;
    }
  }

  // Fallback for local development / Capacitor
  return `http://${DEFAULT_BACKEND_IP}:${BACKEND_PORT}/api`;
};

const getSocketUrl = () => {
  // Allow override from .env
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;

    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";

    if (!isLocalhost) {
      return `${protocol}//${hostname}:${BACKEND_PORT}`;
    }
  }

  return `http://${DEFAULT_BACKEND_IP}:${BACKEND_PORT}`;
};

export const APP_CONFIG = {
  APP_NAME: import.meta.env.VITE_APP_NAME || "G9Expert",

  APP_TYPE: import.meta.env.VITE_APP_TYPE || "web",

  API_BASE_URL: getApiBaseUrl(),

  SOCKET_URL: getSocketUrl(),

  REQUEST_TIMEOUT: Number(
    import.meta.env.VITE_REQUEST_TIMEOUT || 30000
  ),

  DEFAULT_BACKEND_IP,
  BACKEND_PORT,
};

export default APP_CONFIG;