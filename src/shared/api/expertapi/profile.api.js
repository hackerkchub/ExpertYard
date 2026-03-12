import api from "./axiosInstance";

export const createProfileApi = (data) =>
  api.post("/expert-profile/create", data);

export const getExpertProfileApi = (expertId) =>
  api.get(`/expert-profile/expert/${expertId}`);

export const updateExpertProfileApi = (expertId, data) => {
  const formData = new FormData();

  for (const key in data) {
    if (data[key] instanceof File) {
      formData.append(key, data[key]);
    } else if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  }

  return api.put(`/expert-profile/expert/${expertId}`, formData);
};

export const getExpertsProfileListApi = () => {
  return api.get("/expert-profile/list");
};


export const getMyProfileApi = () =>
  api.get("/expert/me");