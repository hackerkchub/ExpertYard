import axios from "./axiosInstance";

export const getHomeFeedApi = ({ city = "", category_id = "", cursor = "", limit = 12 } = {}) => {
  const params = new URLSearchParams();

  if (city) params.set("city", city);
  if (category_id) params.set("category_id", category_id);
  if (cursor) params.set("cursor", cursor);
  if (limit) params.set("limit", String(limit));

  return axios.get(`/home/feed?${params.toString()}`, { skipLoader: true });
};
