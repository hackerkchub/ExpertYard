import api from "./axiosInstance";

/* 🔍 MAIN EXPERT SEARCH */
export const searchExpertsApi = async (params) => {
  const { data } = await api.get("/search/experts", { params });
  return data;
};


// ✅ Expert name se ID get karne ke liye
export const searchExpertsByNameApi = (name) => {
  return fetch(`/api/user/experts/search?q=${encodeURIComponent(name)}&limit=1`)
    .then(res => res.json());
};
