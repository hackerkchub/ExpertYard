import adminApi from "./axiosInstance";

/**
 * Frontend API helper for AI Discovery Analytics endpoints
 */

export const getAIAnalyticsOverview = async (params = {}) => {
  const response = await adminApi.get("/admin/ai-analytics/overview", { params });
  return response.data;
};

export const getAIAnalyticsTimeseries = async (params = {}) => {
  const response = await adminApi.get("/admin/ai-analytics/timeseries", { params });
  return response.data;
};

export const getAIAnalyticsRankPerformance = async (params = {}) => {
  const response = await adminApi.get("/admin/ai-analytics/rank-performance", { params });
  return response.data;
};

export const getAIAnalyticsExperiments = async (params = {}) => {
  const response = await adminApi.get("/admin/ai-analytics/ab-experiments", { params });
  return response.data;
};

export const getAIAnalyticsConversionFunnel = async (params = {}) => {
  const response = await adminApi.get("/admin/ai-analytics/conversion-funnel", { params });
  return response.data;
};
