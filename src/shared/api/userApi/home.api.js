import axios from "./axiosInstance";

/* =========================
   Home Dashboard
========================= */

export const getHomeDashboardApi = () => {
  return axios.get("/home");
};

/* =========================
   Home Feed
========================= */

export const getHomeFeedApi = ({
  city = "",
  category_id = "",
  cursor = "",
  limit = 12,
} = {}) => {
  const params = new URLSearchParams();

  if (city) params.set("city", city);

  if (category_id) {
    params.set("category_id", category_id);
  }

  if (cursor) {
    params.set("cursor", cursor);
  }

  if (limit) {
    params.set("limit", String(limit));
  }

  return axios.get(`/home/feed?${params.toString()}`, {
    skipLoader: true,
  });
};

export const getExpertTipsApi = ({ limit = "", user_id = "" } = {}) => {
  const params = new URLSearchParams();
  if (limit) params.set("limit", String(limit));
  if (user_id) params.set("user_id", String(user_id));

  const query = params.toString();
  return axios.get(`/expert-post${query ? `?${query}` : ""}`, {
    skipLoader: true,
  });
};
