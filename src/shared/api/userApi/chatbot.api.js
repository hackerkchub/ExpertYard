import api from "./axiosInstance";

/* ========================= */
/* 🤖 CHATBOT APIS */
/* ========================= */

// 💬 SEND MESSAGE
export const sendChatbotMessageApi = async ({
  message,
  conversation_id = null,
}) => {
  const { data } = await api.post("/chatbot/message", {
    message,
    conversation_id,
  });

  return data;
};