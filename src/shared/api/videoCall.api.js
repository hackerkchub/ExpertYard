import api from "./axiosInstance";

export const getVideoCallStatusApi = (expertId) =>
  api.get(`/experts/${expertId}/video-call-status`, { skipLoader: true });

export const initiateVideoCallApi = (payload) =>
  api.post("/video-calls/initiate", payload);

export const acceptVideoCallApi = (callId) =>
  api.post(`/video-calls/${callId}/accept`);

export const declineVideoCallApi = (callId) =>
  api.post(`/video-calls/${callId}/decline`);

export const cancelVideoCallApi = (callId) =>
  api.post(`/video-calls/${callId}/cancel`);

export const endVideoCallApi = (callId, payload = {}) =>
  api.post(`/video-calls/${callId}/end`, payload);

export const heartbeatVideoCallApi = (callId, payload = {}) =>
  api.post(`/video-calls/${callId}/heartbeat`, payload, { skipLoader: true });

export const getVideoCallDetailApi = (callId) =>
  api.get(`/video-calls/${callId}`, { skipLoader: true });

export const getVideoCallHistoryApi = () =>
  api.get("/video-calls/history", { skipLoader: true });
