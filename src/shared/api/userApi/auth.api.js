import api from "./axiosInstance";

/* ========================= */
/* 🔐 USER AUTH APIS */
/* ========================= */

// LOGIN
export const loginUserApi = async (payload) => {
  const { data } = await api.post("/user/login", payload);
  return data;
};

// REGISTER
export const registerUserApi = async (payload) => {
  const { data } = await api.post("/user/register", payload);
  return data;
};

/* ========================= */
/* 👤 USER PROFILE APIS */
/* ========================= */

// GET PROFILE
export const getUserProfileApi = async () => {
  const { data } = await api.get("/user/profile");
  return data;
};

export const getUserPublicProfileApi = async (id) => {
  const { data } = await api.get(`/user/public/${id}`);
  return data;
};

// UPDATE PROFILE
export const updateUserProfileApi = async (payload) => {
  const { data } = await api.put("/user/profile", payload);
  return data;
};

/* ========================= */
/* ❌ DELETE PROFILE */
/* ========================= */

export const deleteUserProfileApi = async () => {
  const { data } = await api.delete("/user/profile");
  return data;
};