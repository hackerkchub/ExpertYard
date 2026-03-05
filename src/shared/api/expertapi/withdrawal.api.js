import api from "./axiosInstance";

/* REQUEST */
export const requestWithdrawalApi = async (data) => {
  try {
    const res = await api.post("/expert/withdrawal/request", {
      amount: data.amount,
      method_id: data.method_id
    });
    return res;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

/* HISTORY */
export const getWithdrawalHistoryApi = () =>
  api.get("/expert/withdrawal/history");

export const getExpertAllWithdrawalsApi = () =>
  api.get("/expert/withdrawal/all");

export const addPayoutMethodApi = (data) =>
  api.post("/payout/payout-method", data);

export const getPayoutMethodsApi = () =>
  api.get("/payout/payout-methods");

export const setPrimaryPayoutMethodApi = (method_id) =>
  api.put("/payout/payout-method/primary", { method_id });