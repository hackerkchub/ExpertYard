import api from "./axiosInstance";

export const askG9Api = async (prompt, conversation_id = null, options = {}) => {
  const response = await api.post(
    "/ai/ask-g9",
    {
      prompt,
      conversation_id,
      remove_filter: options.remove_filter || null,
      reset_context: options.reset_context || false,
    },
    { skipLoader: true, signal: options.signal }
  );
  return response.data;
};

export const getAIHistoryApi = async (conversation_id) => {
  const response = await api.get(`/ai/history?conversation_id=${conversation_id}`, { skipLoader: true });
  return response.data;
};

export const trackAIClickApi = async (message_id, expert_id = null, master_service_id = null, rank_position = null) => {
  try {
    const response = await api.post("/ai/track-click", {
      message_id,
      expert_id,
      master_service_id,
      rank_position,
    }, { skipLoader: true });
    return response.data;
  } catch (err) {
    console.warn("[ASK_G9][WARN] Click tracking failed silently:", err?.message || err);
    return null;
  }
};
