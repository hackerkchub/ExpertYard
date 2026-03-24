import api from "./axiosInstance";

/* ================= SAVE / UPDATE PRICE ================= */
export const savePriceApi = async (data) => {
  const { data: res } = await api.post("/expert-price", data);
  return res;
};

/* ================= GET MY PRICE (LOGGED-IN) ================= */
export const getMyPriceApi = async () => {
  const { data } = await api.get("/expert-price/me");
  return data;
};

/* ================= GET PRICE BY EXPERT ID (PUBLIC / ADMIN) ================= */
export const getExpertPriceByIdApi = async (expertId) => {
  const { data } = await api.get(`/expert-price/expert/${expertId}`);
  return data;
};

/* ================= DELETE MY PRICE ================= */
export const deleteMyPriceApi = async () => {
  const { data } = await api.delete("/expert-price/me");
  return data;
};