// shared/api/expertapi/filter.api.js
import api from "./axiosInstance";

export const filterExpertsApi = (params) => {
  // params: { price, rating, mode, sort_price }
  return api.get("/experts/filter", { params });
};

export const getTopRatedExpertsApi = (limit = 5) => {
  return api.get("/experts/top-rated", { params: { limit } });
};
