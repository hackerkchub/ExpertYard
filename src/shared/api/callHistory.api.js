import api from "./axiosInstance";

/* ===============================
   USER CALL HISTORY
================================ */

export const getUserCallHistoryApi = (params = {}) => {
  return api.get("/voice-call/user/history", { params });
};


/* ===============================
   EXPERT CALL HISTORY
================================ */

export const getExpertCallHistoryApi = (params = {}) => {
  return api.get("/voice-call/expert/history", { params });
};


/* ===============================
   COMMON HISTORY AUTO ROLE
================================ */

export const getCallHistoryApi = () => {

  const expertToken = localStorage.getItem("expert_token");

  if (expertToken) {
    return getExpertCallHistoryApi();
  }

  return getUserCallHistoryApi();

};