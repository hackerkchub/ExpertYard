import { APP_CONFIG } from "../../config/appConfig";

const pages = import.meta.glob("../../apps/**/routes/index.jsx");

export function getUserRoutes() {
  if (APP_CONFIG.APP_TYPE === "expert") return null;

  return pages["../../apps/user/routes/index.jsx"];
}

export function getExpertRoutes() {
  if (APP_CONFIG.APP_TYPE === "user") return null;

  return pages["../../apps/expert/routes/index.jsx"];
}

export function getAdminRoutes() {
  if (APP_CONFIG.APP_TYPE !== "web") return null;

  return pages["../../apps/admin/routes/index.jsx"];
}