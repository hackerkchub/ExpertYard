import api from "./axiosInstance";

/* =========================
   MEMBERSHIP PLANS
========================= */

export const getActiveMembershipPlansApi =
  () => api.get("/membership-plans/active");

/* =========================
   EXPERT PLAN PURCHASE
========================= */

export const createExpertPlanOrderApi =
  (data) =>
    api.post("/expert-plan/create-order", data);

export const verifyExpertPlanPaymentApi =
  (data) =>
    api.post("/expert-plan/verify-payment", data);

export const getExpertCurrentPlanApi =
  (expertId) =>
    api.get(`/expert-plan/expert/${expertId}`);

/* =========================
   ADMIN REPORTING
========================= */

export const getAllExpertPlansApi =
  () =>
    api.get("/expert-plan/all");