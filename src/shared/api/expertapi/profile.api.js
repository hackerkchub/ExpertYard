import api from "./axiosInstance";

export const createProfileApi = (data) =>
  api.post("/expert-profile/create", data);

export const getExpertProfileApi = (expertId) =>
  api.get(`/expert-profile/expert/${expertId}`);

export const updateExpertProfileApi = (expertId, data) => {
  if (!expertId) {
    throw new Error("expertId is required to update profile");
  }

  return api.put(
    `/expert-profile/expert/${expertId}`,
    data
  );
};

export const getExpertsProfileListApi = () => {
  return api.get("/expert-profile/list");
};
