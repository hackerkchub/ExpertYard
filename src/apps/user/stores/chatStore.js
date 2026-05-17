// stores/chatStore.js
import { create } from 'zustand';
import { sendChatbotMessageApi } from '../../../shared/api/userApi/chatbot.api';

const useChatStore = create((set, get) => ({
  messages: [],
  conversationId: null,
  isOpen: false,
  isTyping: false,
  isLoading: false,

  sendMessage: async (message) => {
    const { messages, conversationId, isLoading } = get();
    if (isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      type: 'text',
      content: message,
      timestamp: new Date().toISOString(),
    };

    set({
      messages: [...messages, userMessage],
      isLoading: true,
      isTyping: true,
    });

    try {
      const response = await sendChatbotMessageApi({
        message,
        conversation_id: conversationId,
      });

      const payload = response?.data;

      const assistantMessages = [];

      if (payload?.message) {
        assistantMessages.push({
          id: Date.now() + 1,
          role: 'assistant',
          type: 'text',
          content: payload.message,
          timestamp: new Date().toISOString(),
        });
      }

      if (payload?.experts?.length > 0) {
        assistantMessages.push({
          id: Date.now() + 2,
          role: 'assistant',
          type: 'experts',
          experts: payload.experts,
          timestamp: new Date().toISOString(),
        });
      }

      set((state) => ({
        messages: [...state.messages, ...assistantMessages],
        conversationId: payload?.conversation_id || state.conversationId,
        isLoading: false,
        isTyping: false,
      }));
    } catch (error) {
      console.error('Chat error:', error);

      if (error?.response?.status === 401) {
        window.location.href = "/user/auth";
        return;
      }

      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: Date.now(),
            role: 'assistant',
            type: 'text',
            content: 'Sorry, something went wrong. Please try again.',
            timestamp: new Date().toISOString(),
          },
        ],
        isLoading: false,
        isTyping: false,
      }));
    }
  },

  clearChat: () => {
    set({
      messages: [],
      conversationId: null,
      isOpen: false,
      isTyping: false,
      isLoading: false,
    });
  },

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
}));

export default useChatStore;