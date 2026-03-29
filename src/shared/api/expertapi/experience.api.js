import api from "./axiosInstance";

/* ================= ADD EXPERIENCE ================= */
export const addExperienceApi = async (formData) => {
  const { data } = await api.post("/experience/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};


/* ================= GET EXPERIENCE BY EXPERT ================= */
export const getExpertExperienceApi = async (expertId) => {
  const { data } = await api.get(`/experience/expert/${expertId}`, {
    skipLoader: false, // optional (default false)
  });
  return data;
};


/* ================= UPDATE EXPERIENCE ================= */
export const updateExperienceApi = async (id, formData) => {
  const { data } = await api.put(`/experience/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};


/* ================= DELETE EXPERIENCE ================= */
export const deleteExperienceApi = async (id) => {
  const { data } = await api.delete(`/experience/delete/${id}`);
  return data;
};