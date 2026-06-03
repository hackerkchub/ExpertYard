import api from "./axiosInstance";

/* ========================= */
/* 💰 WALLET APIS */
/* ========================= */

// 🔍 GET WALLET BALANCE
export const getWalletApi = async () => {
  const { data } = await api.get("/wallet");
  return data;
};

// ➕ ADD MONEY
export const addMoneyApi = async (
  paymentData
) => {

  const { data } =
    await api.post(
      "/wallet/add",
      paymentData
    );

  return data;
};
// 📜 WALLET HISTORY (NEW)
export const getWalletHistoryApi = async () => {
  const { data } = await api.get("/wallet/history");
  return data;
}; 

export const createWalletOrderApi = async (amount) => {
  const { data } = await api.post("/wallet/create-order", {
    amount,
  });

  return data;
};

// 💸 DEDUCT MONEY FOR SERVICE
export const deductWalletApi = async ({
  amount,
  expert_id,
  service_type
}) => {
  const { data } = await api.post(
    "/wallet/deduct",
    {
      amount,
      expert_id,
      service_type
    }
  );

  return data;
};