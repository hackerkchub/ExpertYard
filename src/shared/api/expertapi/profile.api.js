import api from "./axiosInstance";

export const createProfileApi = (data) =>
  api.post("/expert-profile/create", data);

export const getExpertProfileApi = (expertId) =>
  api.get(`/expert-profile/expert/${expertId}`);

export const updateExpertProfileApi = (expertId, data) => {
  if (!expertId) {
    throw new Error("expertId is required to update profile");
  }

  const formData = new FormData();

  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });

  return api.put(
    `/expert-profile/expert/${expertId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};

export const getExpertsProfileListApi = () => {
  return api.get("/expert-profile/list");
};
