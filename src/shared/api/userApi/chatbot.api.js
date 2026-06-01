import api from "./axiosInstance";

/* ========================= */
/* 🤖 CHATBOT APIS */
/* ========================= */

export const sendChatbotMessageApi = async ({
  message,
  conversation_id = null,
}) => {
  const sessionToken = localStorage.getItem("chat_session");

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