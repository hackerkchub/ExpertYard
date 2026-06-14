import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { socket } from "../../../shared/api/socket";
import { useExpert } from "../../../shared/context/ExpertContext";
import {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  updateNotificationStatus,
} from "../../../shared/api/notification.api";
import { soundManager } from "../../../shared/services/sound/soundManager";
import { SOUNDS } from "../../../shared/services/sound/soundRegistry";
import { getMessagingClient } from "../../../shared/utils/lazyFirebase";

const Ctx = createContext(null);

const FINAL_STATES = ["missed", "rejected", "ended", "low_balance", "cancelled"];
const CALL_TYPES = new Set(["voice_call", "incoming_call"]);
const CHAT_TYPES = new Set(["chat_request", "chat_message", "chat_accepted", "chat_rejected", "chat_cancelled", "chat_timeout"]);

const parseMeta = (meta) => {
  if (!meta) return {};
  if (typeof meta === "string") {
    try {
      return JSON.parse(meta);
    } catch {
      return {};
    }
  }
  return meta;
};

const asTime = (value) => {
  const time = value ? new Date(value).getTime() : Date.now();
  return Number.isFinite(time) ? time : Date.now();
};

const getExpertId = (expertData) =>
  expertData?.expertId ||
  expertData?.expert_id ||
  expertData?.id ||
  expertData?.expert?.id ||
  expertData?.profile?.expert_id ||
  null;

const getSenderName = (n, meta) =>
  n.sender_name ||
  meta.sender_name ||
  meta.user_name ||
  meta.userName ||
  (meta.user_id || n.sender_id ? `User #${meta.user_id || n.sender_id}` : "Someone");

const buildTargetUrl = (n, meta) => {
  if (n.target_url) return n.target_url;
  if (meta.target_url) return meta.target_url;
  if (meta.url) return meta.url;
  if (meta.click_action) return meta.click_action;
  if ((n.type === "voice_call" || n.type === "incoming_call") && (meta.callId || n.related_id)) {
    return `/expert?from_notification=1&callId=${encodeURIComponent(meta.callId || n.related_id)}`;
  }
  if (n.type === "chat_request" && (meta.request_id || n.related_id)) {
    return `/expert?from_notification=1&request_id=${encodeURIComponent(meta.request_id || n.related_id)}`;
  }
  if ((n.type === "like" || n.type === "comment") && (meta.post_id || n.related_id)) {
    return `/expert/posts/${encodeURIComponent(meta.post_id || n.related_id)}`;
  }
  return "/expert/notifications";
};

const localKeyFor = (n, meta) => {
  const type = n.type || meta.type || "system";
  if ((type === "voice_call" || type === "incoming_call" || type === "missed_call") && (meta.callId || meta.call_id || n.related_id)) {
    return `call:${meta.callId || meta.call_id || n.related_id}`;
  }
  if (CHAT_TYPES.has(type) && (meta.request_id || meta.chat_id || n.related_id)) {
    return `chat:${meta.request_id || meta.chat_id || n.related_id}:${type}`;
  }
  return n.notification_id || n.id || meta.notification_id || `${type}:${n.related_id || meta.related_id || Date.now()}`;
};

const normalizeNotification = (raw = {}) => {
  const meta = parseMeta(raw.meta || raw.data || {});
  const type = String(raw.type || meta.type || "system").toLowerCase();
  const senderName = getSenderName(raw, meta);
  const targetUrl = buildTargetUrl({ ...raw, type }, meta);
  const notificationId = raw.notification_id || meta.notification_id || raw.id || `${type}:${Date.now()}`;
  const status = raw.status || (type === "chat_request" ? "pending" : type === "voice_call" ? "ringing" : "info");

  const defaultMessage =
    type === "follow" ? `${senderName} started following you` :
    type === "like" ? `${senderName} liked your post` :
    type === "comment" ? `${senderName} commented on your post` :
    type === "voice_call" ? `${senderName} is calling you` :
    type === "missed_call" ? `${senderName} called you. You missed the call.` :
    raw.message || raw.body || meta.body || "";

  return {
    id: localKeyFor({ ...raw, type, notification_id: notificationId }, meta),
    dbId: raw.id || notificationId,
    notificationId,
    type,
    status,
    title: raw.title || meta.title || "Notification",
    message: raw.message || raw.body || meta.body || defaultMessage,
    meta: raw.message || raw.body || meta.body || defaultMessage,
    unread: !(raw.is_read === 1 || raw.is_read === true),
    is_read: raw.is_read,
    senderName,
    senderAvatar: raw.sender_avatar || meta.sender_avatar || "",
    targetUrl,
    relatedId: raw.related_id || meta.related_id || meta.post_id || meta.request_id || meta.callId || "",
    relatedType: raw.related_type || meta.related_type || "",
    payload: {
      ...meta,
      callId: meta.callId || meta.call_id || (type.includes("call") ? raw.related_id : undefined),
      request_id: meta.request_id || (type.includes("chat") ? raw.related_id : undefined),
      user_name: meta.user_name || raw.sender_name || senderName,
      targetUrl,
      url: targetUrl,
    },
    createdAt: asTime(raw.created_at || raw.createdAt || meta.created_at),
  };
};

const normalizeForegroundPayload = (payload = {}) => {
  const data = payload.data || {};
  return normalizeNotification({
    id: data.notification_id || data.id,
    notification_id: data.notification_id,
    type: data.type,
    title: data.title || payload.notification?.title,
    body: data.body || payload.notification?.body,
    message: data.body || payload.notification?.body,
    target_url: data.url || data.click_action,
    related_id: data.related_id || data.request_id || data.callId,
    related_type: data.related_type,
    sender_name: data.sender_name,
    sender_avatar: data.sender_avatar,
    meta: data,
    is_read: false,
    created_at: new Date().toISOString(),
  });
};

const upsertById = (items, incoming) => {
  const next = new Map(items.map((item) => [item.id, item]));
  const existing = next.get(incoming.id);
  next.set(incoming.id, existing ? { ...existing, ...incoming, unread: existing.unread || incoming.unread } : incoming);
  return Array.from(next.values()).sort((a, b) => b.createdAt - a.createdAt);
};

export function ExpertNotificationsProvider({ children }) {
  const navigate = useNavigate();
  const { expertData } = useExpert();
  const expertId = getExpertId(expertData);
  const notificationsRef = useRef([]);
  const [notifications, setNotifications] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    window.__expertNotificationProviderActive = true;
    return () => {
      window.__expertNotificationProviderActive = false;
    };
  }, []);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  useEffect(() => {
    setNotifications([]);
    setHistoryLoaded(false);
    soundManager.stopAll();
  }, [expertId]);

  const addNotification = useCallback((notification, { playSound = true, showSystem = false } = {}) => {
    if (!notification?.id) return;

    setNotifications((prev) => upsertById(prev, notification));

    if (playSound && document.visibilityState === "visible") {
      if (notification.type === "voice_call" && notification.status === "ringing") {
        soundManager.play(SOUNDS.INCOMING_CALL, { loop: true, volume: 1 });
      } else {
        soundManager.play(SOUNDS.NOTIFICATION);
      }
    }

    if (
      showSystem &&
      document.visibilityState === "visible" &&
      "Notification" in window &&
      Notification.permission === "granted" &&
      navigator.serviceWorker
    ) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(notification.title || "Notification", {
          body: notification.message || "",
          icon: notification.senderAvatar || "/logo-192.png",
          badge: "/logo-192.png",
          tag: notification.notificationId || notification.id,
          data: { ...notification.payload, url: notification.targetUrl },
          requireInteraction: notification.type === "voice_call",
          renotify: notification.type === "voice_call",
          vibrate: notification.type === "voice_call" ? [200, 100, 200, 100, 400] : [80, 40, 80],
        });
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!expertId) return;

    let active = true;
    getNotifications({
      receiverId: expertId,
      receiverRole: "expert",
      page: 1,
      limit: 50,
    })
      .then((res) => {
        if (!active) return;
        const rows = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : [];
        const mapped = rows.map(normalizeNotification);
        setNotifications((prev) => {
          let next = prev;
          mapped.forEach((n) => {
            next = upsertById(next, n);
          });
          return next;
        });
      })
      .catch((err) => console.log("Expert notification history load failed", err))
      .finally(() => active && setHistoryLoaded(true));

    return () => {
      active = false;
    };
  }, [expertId]);

  useEffect(() => {
    const handleNotification = (raw) => {
      const notification = normalizeNotification(raw);
      addNotification(notification, { showSystem: true });
    };

    socket.on("notification:new", handleNotification);
    return () => socket.off("notification:new", handleNotification);
  }, [addNotification]);

  useEffect(() => {
    const handleIncomingCall = (data = {}) => {
      const notification = normalizeNotification({
        id: data.notification_id || data.callId,
        notification_id: data.notification_id || `call:${data.callId}`,
        type: "voice_call",
        title: `Incoming call from ${data.user_name || `User #${data.fromUserId || data.userId || ""}`}`,
        message: data.pricePerMinute ? `Rs ${data.pricePerMinute}/min` : "Tap to answer",
        related_id: data.callId,
        related_type: "voice_call",
        target_url: `/expert?from_notification=1&callId=${data.callId}`,
        status: data.status || "ringing",
        meta: {
          ...data,
          callId: data.callId,
          user_name: data.user_name,
        },
      });
      addNotification(notification, { showSystem: true });
    };

    const handleIncomingChat = (data = {}) => {
      const notification = normalizeNotification({
        id: data.notification_id || data.request_id,
        notification_id: data.notification_id || `chat:${data.request_id}`,
        type: "chat_request",
        title: `Chat request from ${data.user_name || `User #${data.user_id || ""}`}`,
        message: "Tap to respond",
        related_id: data.request_id,
        related_type: "chat",
        target_url: `/expert?from_notification=1&request_id=${data.request_id}`,
        status: "pending",
        meta: data,
      });
      addNotification(notification, { showSystem: false });
    };

    const handleIncomingChatEvent = (event) => handleIncomingChat(event.detail || {});

    socket.on("call:incoming", handleIncomingCall);
    socket.on("incoming_chat_request", handleIncomingChat);
    window.addEventListener("incoming_chat_request", handleIncomingChatEvent);

    return () => {
      socket.off("call:incoming", handleIncomingCall);
      socket.off("incoming_chat_request", handleIncomingChat);
      window.removeEventListener("incoming_chat_request", handleIncomingChatEvent);
    };
  }, [addNotification]);

  useEffect(() => {
    if (!expertId) return;

    let unsubscribe = () => {};
    let active = true;

    getMessagingClient()
      .then((firebase) => {
        if (!active || !firebase?.messaging) return;

        unsubscribe = firebase.onMessage(firebase.messaging, (payload) => {
          const notification = normalizeForegroundPayload(payload);
          addNotification(notification, { showSystem: true });

          if (CALL_TYPES.has(notification.type)) {
            window.dispatchEvent(new CustomEvent("incoming_call", { detail: notification.payload }));
          }
          if (notification.type === "chat_request") {
            window.dispatchEvent(new CustomEvent("incoming_chat_request", { detail: notification.payload }));
          }
        });
      })
      .catch(() => {});

    return () => {
      active = false;
      unsubscribe();
    };
  }, [expertId, addNotification]);

  const updateLocalStatus = useCallback((matcher, status) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (!matcher(n)) return n;
        return { ...n, status, unread: false };
      })
    );
    if (FINAL_STATES.includes(status)) soundManager.stopAll();
  }, []);

  useEffect(() => {
    const byCallId = (callId) => (n) => n.payload?.callId && String(n.payload.callId) === String(callId);
    const byRequestId = (requestId) => (n) => n.payload?.request_id && String(n.payload.request_id) === String(requestId);

    const missed = ({ callId }) => updateLocalStatus(byCallId(callId), "missed");
    const rejected = ({ callId }) => updateLocalStatus(byCallId(callId), "rejected");
    const ended = ({ callId }) => updateLocalStatus(byCallId(callId), "ended");
    const cancelled = ({ callId }) => updateLocalStatus(byCallId(callId), "cancelled");
    const connected = ({ callId }) => updateLocalStatus(byCallId(callId), "accepted");
    const chatCancelled = ({ request_id }) => updateLocalStatus(byRequestId(request_id), "cancelled");
    const chatRejected = ({ request_id }) => updateLocalStatus(byRequestId(request_id), "rejected");
    const chatEnded = ({ request_id }) => updateLocalStatus(byRequestId(request_id), "ended");

    socket.on("call:missed", missed);
    socket.on("call:rejected", rejected);
    socket.on("call:ended", ended);
    socket.on("call:cancelled", cancelled);
    socket.on("call:connected", connected);
    socket.on("chat_cancelled", chatCancelled);
    socket.on("chat_rejected", chatRejected);
    socket.on("chat_ended", chatEnded);

    return () => {
      socket.off("call:missed", missed);
      socket.off("call:rejected", rejected);
      socket.off("call:ended", ended);
      socket.off("call:cancelled", cancelled);
      socket.off("call:connected", connected);
      socket.off("chat_cancelled", chatCancelled);
      socket.off("chat_rejected", chatRejected);
      socket.off("chat_ended", chatEnded);
    };
  }, [updateLocalStatus]);

  const markNotificationAsRead = useCallback(async (notificationId) => {
    const notification = notificationsRef.current.find((n) => n.id === notificationId || n.dbId === notificationId);
    setNotifications((prev) => prev.map((n) => n.id === notificationId || n.dbId === notificationId ? { ...n, unread: false, is_read: true } : n));
    if (expertId && notification?.dbId) {
      await markRead({ receiverId: expertId, receiverRole: "expert", id: notification.dbId }).catch(() => {});
    }
  }, [expertId]);

  const onNotificationTap = useCallback(async (notification) => {
    if (!notification) return;
    await markNotificationAsRead(notification.id);

    if (notification.type === "voice_call" && notification.payload?.callId && notification.status === "ringing") {
      navigate(`/expert/voice-call/${notification.payload.callId}`);
      return;
    }

    navigate(notification.targetUrl || "/expert/notifications");
  }, [markNotificationAsRead, navigate]);

  const acceptNotification = useCallback((notification) => {
    if (!notification) return;

    if (notification.type === "voice_call") {
      soundManager.stopAll();
      window.dispatchEvent(new CustomEvent("go_to_call_page", { detail: notification.payload?.callId }));
      markNotificationAsRead(notification.id);
      return;
    }

    if (notification.type === "chat_request") {
      updateNotificationStatus({
        requestId: notification.payload?.request_id,
        type: "chat_request",
        status: "accepted",
      }).catch(() => {});
      socket.emit("accept_chat", { request_id: notification.payload?.request_id });
      markNotificationAsRead(notification.id);
    }
  }, [markNotificationAsRead]);

  const rejectNotification = useCallback((notification) => {
    if (!notification) return;

    if (notification.type === "voice_call") {
      soundManager.stopAll();
      updateNotificationStatus({
        requestId: notification.payload?.callId,
        type: "voice_call",
        status: "rejected",
      }).catch(() => {});
      socket.emit("call:reject", { callId: notification.payload?.callId });
      updateLocalStatus((n) => n.id === notification.id, "rejected");
    }

    if (notification.type === "chat_request") {
      updateNotificationStatus({
        requestId: notification.payload?.request_id,
        type: "chat_request",
        status: "rejected",
      }).catch(() => {});
      socket.emit("reject_chat", { request_id: notification.payload?.request_id });
      updateLocalStatus((n) => n.id === notification.id, "rejected");
    }
  }, [updateLocalStatus]);

  const removeById = useCallback(async (notification) => {
    if (!notification?.id) return;
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    soundManager.stopAll();
    if (expertId && notification.dbId) {
      await deleteNotification(notification.dbId, expertId, "expert").catch(() => {});
    }
  }, [expertId]);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false, is_read: true })));
    if (expertId) {
      await markAllRead({ receiverId: expertId, receiverRole: "expert" }).catch(() => {});
    }
  }, [expertId]);

  const clearAll = useCallback(() => {
    soundManager.stopAll();
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread && !FINAL_STATES.includes(n.status)).length,
    [notifications]
  );
  const chatUnreadCount = useMemo(
    () => notifications.filter((n) => n.type === "chat_request" && n.unread && !FINAL_STATES.includes(n.status)).length,
    [notifications]
  );
  const callUnreadCount = useMemo(
    () => notifications.filter((n) => n.type === "voice_call" && n.unread && !FINAL_STATES.includes(n.status)).length,
    [notifications]
  );

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    chatUnreadCount,
    callUnreadCount,
    acceptNotification,
    rejectNotification,
    removeById,
    markAsRead: markNotificationAsRead,
    markAllAsRead,
    markAllRead: markAllAsRead,
    clearAll,
    onNotificationTap,
    historyLoaded,
  }), [
    notifications,
    unreadCount,
    chatUnreadCount,
    callUnreadCount,
    acceptNotification,
    rejectNotification,
    removeById,
    markNotificationAsRead,
    markAllAsRead,
    clearAll,
    onNotificationTap,
    historyLoaded,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useExpertNotifications() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useExpertNotifications must be used within provider");
  return ctx;
}
