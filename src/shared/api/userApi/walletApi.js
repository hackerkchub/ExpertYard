import api from "./axiosInstance";

/* ========================= */
/* 💰 WALLET APIS */
/* ========================= */

// 🔍 GET WALLET BALANCE
export const getWalletApi = async (userId) => {
  const { data } = await api.get(`/wallet/${userId}`);
  return data;
};

// ➕ ADD MONEY
export const addMoneyApi = async ({ user_id, amount }) => {
  const { data } = await api.post("/wallet/add", {
    user_id,
    amount
  });
  return data;
};

// ➖ DEDUCT MONEY
export const deductMoneyApi = async ({ user_id, amount }) => {
  const { data } = await api.post("/wallet/deduct", {
    user_id,
    amount
  });
  return data;
};
