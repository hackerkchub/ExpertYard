import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import { socket } from "../../../shared/api/socket";
import { useExpert } from "../../../shared/context/ExpertContext";
import { saveNotification, getNotifications,
  getUnreadCount, deleteNotification} from "../../../shared/api/notification.api"; // ⭐ NEW

const Ctx = createContext(null);
const STORAGE_KEY = "expert_notifications_v2";

const getSafeUserName = (user_name, user_id) => {
  if (typeof user_name === "string" && user_name.trim()) {
    return user_name.trim();
  }
  return `User #${user_id}`;
};

export function ExpertNotificationsProvider({ children }) {
  const { expertData } = useExpert();
  const expertId = expertData?.expertId || null; // ⭐ important

  /* ---------------------------------- STATE ---------------------------------- */
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* ---------------------------------- PERSIST ---------------------------------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  /* ---------------------------------- UNREAD ---------------------------------- */
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
    const onIncomingChat = async ({ request_id, user_id, user_name }) => {
      const safeName = getSafeUserName(user_name, user_id);

      const newNotif = {
        id: request_id,
        type: "chat_request",
        status: "pending",
        title: `Chat request from ${safeName}`,
        meta: "Tap to open",
        unread: true,
        payload: { request_id },
        createdAt: Date.now(),
      };

      setNotifications((prev) => {
        if (prev.some((n) => n.id === request_id)) return prev;
        return [newNotif, ...prev];
      });

      // ⭐⭐ SAVE TO DB (HYBRID)
     if (expertId != null) {
  console.log("Saving notif for expert:", expertId);

      await saveNotification({
          userId: expertId,
          panel: "expert",
          title: newNotif.title,
          message: "Tap to open",
          type: "chat_request",
          meta: { request_id },
        });
      }
    };

    socket.on("incoming_chat_request", onIncomingChat);
    return () => socket.off("incoming_chat_request", onIncomingChat);
  }, [expertId]);

  /* =====================================================
     📞 VOICE CALL
  ===================================================== */
  useEffect(() => {
    const onIncomingCall = async ({ callId, user_id, user_name }) => {
      const safeName = getSafeUserName(user_name, user_id);

      const newNotif = {
        id: callId,
        type: "voice_call",
        status: "incoming",
        title: `Incoming call from ${safeName}`,
        meta: "Tap to answer",
        unread: true,
        payload: { callId },
        createdAt: Date.now(),
      };

      setNotifications((prev) => {
        if (prev.some((n) => n.id === callId)) return prev;
        return [newNotif, ...prev];
      });

      // ⭐⭐ SAVE TO DB
      if (expertId) {
        saveNotification({
          userId: expertId,
          panel: "expert",
          title: newNotif.title,
          message: "Tap to answer",
          type: "voice_call",
          meta: { callId },
        });
      }
    };

    socket.off("call:incoming");
    socket.on("call:incoming", onIncomingCall);

    return () => socket.off("call:incoming", onIncomingCall);
  }, [expertId]);

  /* =====================================================
     STATUS UPDATES
  ===================================================== */
  useEffect(() => {
    const markDone = (id, status) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status, unread: false } : n
        )
      );

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
   🆕 LOAD HISTORY FROM DB (on mount)
===================================================== */
useEffect(() => {
  if (!expertId) return;

  const loadHistory = async () => {
    try {
      const res = await getNotifications({
        userId: expertId,
        panel: "expert",
      });

      const dbData = res.data || [];

      // DB format → UI format map
      const mapped = dbData.map((n) => ({
        id: n.id,
        type: n.type,
        status: n.is_read ? "read" : "pending",
        title: n.title,
        meta: n.message,
        unread: !n.is_read,
        payload: n.meta || {},
        createdAt: new Date(n.created_at).getTime(),
      }));

      // merge (avoid duplicates)
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const merged = [
          ...mapped.filter((n) => !existingIds.has(n.id)),
          ...prev,
        ];
        return merged;
      });

      // unread count
      const countRes = await getUnreadCount({ userId: expertId });
      // optional if you want backend count sync
      // setUnreadCount(countRes.data.count);
    } catch (err) {
      console.log("history load failed", err);
    }
  };

  loadHistory();
}, [expertId]);

  /* ---------------------------------- HELPERS ---------------------------------- */
 const removeById = useCallback(
  async (id) => {
    try {
      // 👉 DB se delete
      if (expertId) {
        await deleteNotification(id, expertId);
      }

      // 👉 local state clean
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.log("delete notification failed", err);
    }
  },
  [expertId]
);


  /* ---------------------------------- TAP ---------------------------------- */
  const onNotificationTap = useCallback(
    (notification) => {
      if (!notification) return;

      if (notification.type === "chat_request") {
        socket.emit("accept_chat", {
          request_id: notification.payload.request_id,
        });
        removeById(notification.id);
      }

      if (notification.type === "voice_call") {
        removeById(notification.id);
        window.location.href = `/expert/voice-call/${notification.payload.callId}`;
      }
    },
    [removeById]
  );

  /* ---------------------------------- CONTEXT ---------------------------------- */
  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      onNotificationTap,
      removeById,
    }),
    [notifications, unreadCount, onNotificationTap, removeById]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useExpertNotifications() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useExpertNotifications must be used within provider");
  return ctx;
}