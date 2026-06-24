import { postLeadEventApi } from "../api/userApi/lead.api";

const SESSION_KEY = "g9_lead_session_id";

export const getLeadSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `g9_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

export const getDeviceType = () => {
  if (typeof window === "undefined") return "unknown";
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
};

export const getUserSnapshot = (user) => ({
  user_id: user?.id || null,
  user_name:
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.name ||
    "",
  user_phone: user?.phone || "",
  user_email: user?.email || "",
  city: user?.city || "",
  area: user?.area || "",
});

export const buildTrackingPayload = ({ user, sourcePage, actionLabel, extra = {} }) => ({
  ...getUserSnapshot(user),
  ...extra,
  source_page: sourcePage,
  source_url: window.location.href,
  referrer_url: document.referrer || "",
  page_title: document.title,
  action_label: actionLabel,
  device_type: getDeviceType(),
  session_id: getLeadSessionId(),
});

export const trackLeadEvent = async (eventPath, payload) => {
  try {
    await postLeadEventApi(eventPath, payload);
  } catch (error) {
    if (import.meta.env?.MODE !== "production") {
      console.debug("Lead tracking skipped:", eventPath, error?.message);
    }
  }
};
