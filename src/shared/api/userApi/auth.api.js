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

// GET USER PROFILE
export const getUserProfileApi = async (user_id) => {
  const { data } = await api.get(`/user/${user_id}`);
  return data;
};

// UPDATE USER PROFILE
export const updateUserProfileApi = async (user_id, payload) => {
  const { data } = await api.put(`/user/${user_id}`, payload);
  return data;
};
