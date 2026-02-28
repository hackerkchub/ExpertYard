import api from "./axiosInstance";

/* REQUEST */
export const requestWithdrawalApi = async (data) => {
  try {
    const res = await api.post("/expert/withdrawal/request", data);
    return res;
  } catch (error) {
    // 🔥 pass full backend error forward
    throw error?.response?.data || error;
  }
};
/* HISTORY */
export const getWithdrawalHistoryApi = () =>
  api.get("/expert/withdrawal/history");

export const getExpertAllWithdrawalsApi = () =>
  api.get("/expert/withdrawal/all");