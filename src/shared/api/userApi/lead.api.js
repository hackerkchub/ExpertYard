import api from "./axiosInstance";

export const postLeadEventApi = (eventPath, payload) =>
  api.post(`/lead-events/${eventPath}`, payload, { skipLoader: true });

export const submitNeedHelpApi = (payload) =>
  api.post("/leads/need-help", payload, { skipLoader: true });
