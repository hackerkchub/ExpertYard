import adminApi from "./axiosInstance";

/* =========================
   MEMBERSHIP PLANS
========================= */

export const createMembershipPlanApi =
  (data) =>
    adminApi.post(
      "/membership-plans",
      data
    );

export const getAllMembershipPlansApi =
  () =>
    adminApi.get(
      "/membership-plans"
    );

export const getMembershipPlanByIdApi =
  (id) =>
    adminApi.get(
      `/membership-plans/${id}`
    );

export const updateMembershipPlanApi =
  (id, data) =>
    adminApi.put(
      `/membership-plans/${id}`,
      data
    );

export const updateMembershipPlanStatusApi =
  (id, data) =>
    adminApi.patch(
      `/membership-plans/${id}/status`,
      data
    );