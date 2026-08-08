import api from "./axiosInstance";

export const askG9Api = async (prompt, conversation_id = null) => {
  const response = await api.post("/ai/ask-g9", {
    prompt,
    conversation_id,
  }, { skipLoader: true });
  return response.data;
};

export const getAIHistoryApi = async (conversation_id) => {
  const response = await api.get(`/ai/history?conversation_id=${conversation_id}`, { skipLoader: true });
  return response.data;
};
