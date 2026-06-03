import adminApi from "./axiosInstance";

/* ================= DASHBOARD ================= */

export const getAdminDashboardApi = () =>
  adminApi.get("/admin/dashboard");

/* ================= FINANCE DASHBOARD ================= */

export const getDashboardSummaryApi = () =>
  adminApi.get("/finance/dashboard-summary");

export const getRevenueReportApi = (range = "monthly") =>
  adminApi.get(`/finance/revenue-report?range=${range}`);

export const getExpenseReportApi = () =>
  adminApi.get("/finance/expense-report");

export const getWalletAnalyticsApi = () =>
  adminApi.get("/finance/wallet-analytics");

export const getRevenueGraphApi = () =>
  adminApi.get("/finance/revenue-graph");

/* ================= AI ANALYTICS ================= */

export const getAiRevenueApi = () =>
  adminApi.get("/finance/ai-revenue");

export const getAiOrdersApi = () =>
  adminApi.get("/finance/ai-orders");

export const getAiProfitApi = () =>
  adminApi.get("/finance/ai-profit");

/* ================= GST ================= */

export const getTodayGstApi = () =>
  adminApi.get("/finance/gst/today");

export const getMonthlyGstApi = () =>
  adminApi.get("/finance/gst/month");

export const getYearlyGstApi = () =>
  adminApi.get("/finance/gst/year");

/* ================= PROFIT ================= */

export const getProfitSummaryApi = () =>
  adminApi.get("/finance/profit-summary");

export const getNetProfitApi = () =>
  adminApi.get("/finance/net-profit");

export const getProfitExpenseApi = () =>
  adminApi.get("/finance/profit-expense");

/* ================= WITHDRAWAL ================= */

export const getWithdrawalPayoutDetailsApi = (withdrawalId) =>
  adminApi.get(
    `/finance/withdrawal/payout-details/${withdrawalId}`
  );

/* ================= WALLET AUDIT ================= */

export const getWalletAuditApi = (expertId) =>
  adminApi.get(
    `/finance/wallet-audit/${expertId}`
  );