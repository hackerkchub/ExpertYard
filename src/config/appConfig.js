export const APP_CONFIG = {
  APP_TYPE: import.meta.env.VITE_APP_TYPE || "web",

  APP_NAME: import.meta.env.VITE_APP_NAME || "G9Expert",

  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "https://softmaxs.com/api",

  REQUEST_TIMEOUT: Number(import.meta.env.VITE_REQUEST_TIMEOUT || 30000),
};