const getApiBaseUrl = () => {
  const BACKEND_PORT = "5000";

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";

    // Mobile/LAN testing:
    // Frontend: http://10.47.91.234:5173
    // Backend:  http://10.47.91.234:5000/api
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
};

console.log("API BASE URL:", APP_CONFIG.API_BASE_URL);