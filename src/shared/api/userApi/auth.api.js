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

// SEND OTP (email / phone)
export const sendOtpApi = async (payload) => {
  const { data } = await api.post("/user/send-otp", payload);
  return data;
};

// VERIFY OTP
export const verifyOtpApi = async (payload) => {
  const { data } = await api.post("/user/verify-otp", payload);
  return data;
};
