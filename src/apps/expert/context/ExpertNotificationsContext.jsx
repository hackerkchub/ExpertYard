import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { socket } from "../../../shared/api/socket";

const Ctx = createContext(null);
const STORAGE_KEY = "expert_notifications_v2";

/* ----------------------------------
   Helper
---------------------------------- */
const getSafeUserName = (user_name, user_id) => {
  if (typeof user_name === "string" && user_name.trim()) {
    return user_name.trim();
  }
  return `User #${user_id}`;
};

export function ExpertNotificationsProvider({ children }) {
  /* ----------------------------------
     STATE
  ---------------------------------- */
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* ----------------------------------
     PERSIST
  ---------------------------------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  /* ----------------------------------
     UNREAD COUNT
  ---------------------------------- */
  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (n) =>
          n.unread &&
          !["cancelled", "rejected", "ended"].includes(n.status)
      ).length,
    [notifications]
  );

  /* =====================================================
     🔔 CHAT REQUEST
  ===================================================== */
  useEffect(() => {
    const onIncomingChat = ({ request_id, user_id, user_name }) => {
      const safeName = getSafeUserName(user_name, user_id);

      setNotifications((prev) => {
        if (prev.some((n) => n.id === request_id)) return prev;

        return [
          {
            id: request_id,
            type: "chat_request",
            status: "pending",
            title: `Chat request from ${safeName}`,
            meta: "Tap to open",
            unread: true,
            payload: { request_id },
            createdAt: Date.now(),
          },
          ...prev,
        ];
      });
    };

    socket.on("incoming_chat_request", onIncomingChat);
    return () => socket.off("incoming_chat_request", onIncomingChat);
  }, []);

  /* =====================================================
     📞 VOICE CALL (NOTIFICATION ONLY)
  ===================================================== */
  useEffect(() => {
    const onIncomingCall = ({ callId, user_id, user_name }) => {
      const safeName = getSafeUserName(user_name, user_id);

      setNotifications((prev) => {
        if (prev.some((n) => n.id === callId)) return prev;

        return [
          {
            id: callId,
            type: "voice_call",
            status: "incoming",
            title: `Incoming call from ${safeName}`,
            meta: "Tap to answer",
            unread: true,
            payload: { callId },
            createdAt: Date.now(),
          },
          ...prev,
        ];
      });
    };
    socket.off("call:incoming");
    socket.on("call:incoming", onIncomingCall);
    return () => socket.off("call:incoming", onIncomingCall);
  }, []);

  /* =====================================================
     🔚 CHAT + CALL STATUS UPDATES
  ===================================================== */
 /* =====================================================
   🔚 CHAT + CALL STATUS UPDATES (AUTO REMOVE)
===================================================== */
useEffect(() => {
  const markDone = (id, status) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status, unread: false } : n
      )
    );

    // ✅ AUTO REMOVE after 1 minute
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 60000);
  };

  socket.on("chat_cancelled", ({ request_id }) =>
    markDone(request_id, "cancelled")
  );
  socket.on("chat_rejected", ({ request_id }) =>
    markDone(request_id, "rejected")
  );
  socket.on("chat_ended", ({ request_id }) =>
    markDone(request_id, "ended")
  );
  socket.on("call:ended", ({ callId }) =>
    markDone(callId, "ended")
  );

  return () => {
    socket.off("chat_cancelled");
    socket.off("chat_rejected");
    socket.off("chat_ended");
    socket.off("call:ended");
  };
}, []);

  /* =====================================================
     HELPERS
  ===================================================== */
  const removeById = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /* =====================================================
     👉 TAP HANDLER
  ===================================================== */
  const onNotificationTap = useCallback(
    (notification) => {
      if (!notification) return;

      // CHAT
      if (notification.type === "chat_request") {
        socket.emit("accept_chat", {
          request_id: notification.payload.request_id,
        });
        removeById(notification.id);
      }

      // VOICE CALL
      if (notification.type === "voice_call") {
        removeById(notification.id);
        window.location.href = `/expert/voice-call/${notification.payload.callId}`;
      }
    },
    [removeById]
  );

  /* =====================================================
     CONTEXT VALUE
  ===================================================== */
 const value = useMemo(
  () => ({
    notifications,
    unreadCount,
    onNotificationTap,
    removeById, // 👈 expose this
  }),
  [notifications, unreadCount, onNotificationTap, removeById]
);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useExpertNotifications() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error(
      "useExpertNotifications must be used within ExpertNotificationsProvider"
    );
  }
  return ctx;
}
