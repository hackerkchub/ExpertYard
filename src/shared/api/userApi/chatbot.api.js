import api from "./axiosInstance";

/* ========================= */
/* 🤖 CHATBOT APIS (GIA PLATFORM ASSISTANT) */
/* ========================= */

const getOrCreateSessionToken = () => {
  try {
    let token = localStorage.getItem("chat_session");
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      token = "sess_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem("chat_session", token);
    }
    return token;
  } catch {
    return "sess_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }
};

export const sendChatbotMessageApi = async ({
  message,
  conversation_id = null,
}) => {
  const sessionToken = getOrCreateSessionToken();

  const { data } = await api.post(
    "/chatbot/message",
    {
      message,
      conversation_id,
    },
    {
      headers: {
        "x-session-token": sessionToken,
      },
    }
  );

  return data;
};