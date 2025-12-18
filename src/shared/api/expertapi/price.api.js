import api from "./axiosInstance";

export const setPriceApi = (data) =>
  api.post("/expert-price", data);

export const getExpertPriceById = (expertId) =>
  api.get(`/expert-price/${expertId}`);

export const updateExpertPriceApi = (data) =>
  api.post("/expert-price", data);
