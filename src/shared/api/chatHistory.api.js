import api from "./axiosInstance";

/* =========================
   EXPERT CHAT HISTORY
========================= */
export const getExpertChatHistoryApi = async (expertId) => {
  if (!expertId) {
    throw new Error("Expert ID is required");
  }

  const { data } = await api.get("/chat-history/expert-history", {
    params: { expert_id: expertId },
  });

  return data;
};

/* =========================
   USER CHAT HISTORY
========================= */
export const getUserChatHistoryApi = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data } = await api.get("/chat-history/user-history", {
    params: { user_id: userId },
  });

  return data;
};

/* =========================
   CHAT HISTORY DETAILS (MESSAGES)
========================= */
export const getChatHistoryMessagesApi = async (roomId) => {
  if (!roomId) {
    throw new Error("Room ID is required");
  }

  const { data } = await api.get(`/chat-history/history/${roomId}`);

  return data;
};


// src/shared/api/chatHistory.api.js
export const getExpertUserSessionsApi = async (expertId, userId) => {
  const { data } = await api.get(
    "/chat-history/expert-user-sessions",
    {
      params: { expert_id: expertId, user_id: userId }
    }
  );
  return data;
};
