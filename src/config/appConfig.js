const getApiBaseUrl = () => {
  const BACKEND_PORT = "5000";

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";

    if (!isLocalhost) {
      return `${protocol}//${hostname}:${BACKEND_PORT}/api`;
    }
  }

  // Laptop/local fallback
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
};

export const APP_CONFIG = {
  API_BASE_URL: getApiBaseUrl(),
  REQUEST_TIMEOUT: 30000,

  APP_TYPE: import.meta.env.VITE_APP_TYPE || "web",

  APP_NAME: import.meta.env.VITE_APP_NAME || "G9Expert",

  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "https://softmaxs.com/api",

  REQUEST_TIMEOUT: Number(import.meta.env.VITE_REQUEST_TIMEOUT || 30000),
};
