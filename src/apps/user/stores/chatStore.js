// stores/chatStore.js
import { create } from 'zustand';
import { sendChatbotMessageApi } from '../../../shared/api/userApi/chatbot.api';
import {
  getCategoriesApi,
  getSubCategoriesApi,
} from '../../../shared/api/expertapi/category.api';
import {
  getExpertsApi,
  getExpertsBySubCategoryApi,
} from '../../../shared/api/expertapi/expert.api';
import { getCategoryPath } from '../../../shared/utils/categoryRoutes';

const inFlightIntentRequests = new Map();

const normalizeText = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const extractList = (response) => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.experts)) return payload.experts;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const findByKeywords = (items, keywords = []) => {
  if (!Array.isArray(items) || !keywords.length) return null;
  const normalizedKeywords = keywords.map(normalizeText).filter(Boolean);

  for (const keyword of normalizedKeywords) {
    const match = items.find((item) => {
      const haystack = normalizeText(`${item?.name || ''} ${item?.slug || ''} ${item?.title || ''}`);
      if (!haystack) return false;
      return haystack === keyword || haystack.includes(keyword) || keyword.includes(haystack);
    });

    if (match) return match;
  }

  return null;
};

const getExpertRouteId = (expert) =>
  expert?.slug || expert?.expert_id || expert?.id || expert?.user_id;

const buildIntentResult = ({
  intent,
  category,
  subCategory,
  experts,
  errorType,
}) => {
  const limitedExperts = experts.slice(0, 5);
  const categoryPath = category ? getCategoryPath(category) : '/user/categories';
  const expertListPath =
    category?.id && subCategory?.id
      ? `/user/experts?category=${category.id}&sub_category=${subCategory.id}`
      : categoryPath;

  if (errorType === 'category') {
    return {
      messages: [
        {
          role: 'assistant',
          type: 'cta',
          content: 'Sorry, I could not find the exact category. You can browse all categories.',
          cta: { label: 'Browse Categories', path: '/user/categories' },
        },
      ],
    };
  }

  if (!limitedExperts.length) {
    return {
      messages: [
        {
          role: 'assistant',
          type: 'cta',
          content: 'No experts are available right now for this topic. You can view this category.',
          cta: { label: 'View Category', path: categoryPath },
        },
      ],
    };
  }

  return {
    messages: [
      {
        role: 'assistant',
        type: 'cta',
        content: `I found some verified experts who can help with ${intent.value.toLowerCase()}. You can view their profile or start consultation.`,
        cta: { label: 'View Category', path: categoryPath },
      },
      {
        role: 'assistant',
        type: 'experts',
        experts: limitedExperts.filter(getExpertRouteId),
        categoryPath: expertListPath,
      },
    ],
  };
};

const useChatStore = create((set, get) => ({
  messages: [],
  conversationId: null,
  isOpen: false,
  isTyping: false,
  isLoading: false,
  categoryCache: [],
  subCategoryCache: {},
  intentResultCache: {},

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

  sendIntentSuggestion: async (intent) => {
    const { messages, isLoading, intentResultCache } = get();
    if (!intent?.key || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      type: 'text',
      content: intent.value,
      timestamp: new Date().toISOString(),
    };

    const cachedResult = intentResultCache[intent.key];
    if (cachedResult) {
      set({
        messages: [
          ...messages,
          userMessage,
          ...cachedResult.messages.map((message, index) => ({
            ...message,
            id: Date.now() + index + 1,
            timestamp: new Date().toISOString(),
          })),
        ],
      });
      return;
    }

    set({
      messages: [...messages, userMessage],
      isLoading: true,
      isTyping: true,
    });

    try {
      let request = inFlightIntentRequests.get(intent.key);

      if (!request) {
        request = (async () => {
          let categories = get().categoryCache;
          if (!categories.length) {
            categories = extractList(await getCategoriesApi());
            set({ categoryCache: categories });
          }

          const category = findByKeywords(categories, intent.categoryKeywords);
          if (!category?.id) {
            return buildIntentResult({ intent, category: null, subCategory: null, experts: [], errorType: 'category' });
          }

          const categoryId = String(category.id);
          let subCategories = get().subCategoryCache[categoryId];
          if (!subCategories) {
            subCategories = extractList(await getSubCategoriesApi(category.id));
            set((state) => ({
              subCategoryCache: {
                ...state.subCategoryCache,
                [categoryId]: subCategories,
              },
            }));
          }

          const subCategory =
            findByKeywords(subCategories, intent.subCategoryKeywords) ||
            subCategories[0] ||
            null;

          let experts = [];
          if (subCategory?.id) {
            experts = extractList(await getExpertsBySubCategoryApi(subCategory.id));
          }

          if (!experts.length) {
            experts = extractList(
              await getExpertsApi({
                page: 1,
                limit: 5,
                category: category.id,
                subcategory: subCategory?.id,
              })
            );
          }

          return buildIntentResult({ intent, category, subCategory, experts });
        })();

        inFlightIntentRequests.set(intent.key, request);
      }

      const result = await request;
      inFlightIntentRequests.delete(intent.key);

      set((state) => ({
        messages: [
          ...state.messages,
          ...result.messages.map((message, index) => ({
            ...message,
            id: Date.now() + index + 1,
            timestamp: new Date().toISOString(),
          })),
        ],
        intentResultCache: {
          ...state.intentResultCache,
          [intent.key]: result,
        },
        isLoading: false,
        isTyping: false,
      }));
    } catch (error) {
      console.error('Intent suggestion error:', error);
      inFlightIntentRequests.delete(intent.key);

      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: Date.now(),
            role: 'assistant',
            type: 'cta',
            content: 'Something went wrong while finding experts. Please try again.',
            cta: { label: 'Retry', intent },
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
      intentResultCache: {},
    });
  },

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
}));

export default useChatStore;
