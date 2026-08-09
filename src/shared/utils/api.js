import axios from "axios";
import APP_CONFIG from "../../config/appConfig";

const rawApiBase = import.meta.env?.VITE_API_BASE_URL || APP_CONFIG?.API_BASE_URL || "/api";
const apiBase = rawApiBase.endsWith("/api") ? rawApiBase : `${rawApiBase.replace(/\/$/, "")}/api`;

export const api = axios.create({
  baseURL: apiBase,
});
