import api from "./axiosInstance";

/* ========================= */
/* 💰 WALLET APIS */
/* ========================= */

// 🔍 GET WALLET BALANCE
export const getWalletApi = async () => {
  const { data } = await api.get(`/wallet`);
  return data;
};

// ➕ ADD MONEY
export const addMoneyApi = async (amount) => {
  const { data } = await api.post("/wallet/add", { amount });
  return data;
};



