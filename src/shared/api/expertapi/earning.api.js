import api from "./axiosInstance";

// SUMMARY
export const getEarningSummaryApi = () =>
  api.get("/earnings/summary");

// HISTORY
export const getEarningHistoryApi = () =>
  api.get("/earnings/history");