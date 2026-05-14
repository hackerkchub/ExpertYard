import api from "./axiosInstance";

export const getEarningSummaryApi = () =>
  api.get("/earnings/summary");

export const getEarningHistoryApi = () =>
  api.get("/earnings/history");

export const getWalletHistoryApi = () =>
  api.get("/earnings/wallet-history");