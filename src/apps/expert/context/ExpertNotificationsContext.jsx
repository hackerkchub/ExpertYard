// src/apps/expert/context/ExpertNotificationsContext.jsx
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
const STORAGE_KEY = "expert_notifications_v1";

export function ExpertNotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.warn("Failed to persist notifications", e);
    }
  }, [notifications]);

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (n) => n.unread && n.status !== "cancelled"
      ).length,
    [notifications]
  );

  // MAIN REQUEST LISTENER
  useEffect(() => {
    const onIncoming = ({ request_id, user_id, expert_id }) => {
      console.log("🔔 🎉 GLOBAL: Expert GOT REQUEST:", {
        request_id,
        user_id,
        expert_id,
      });

      setNotifications((prev) => {
        if (prev.some((n) => n.id === request_id)) return prev;
        return [
          {
            id: request_id,
            type: "chat_request",
            status: "pending",
            title: `New chat request from User #${user_id}`,
            meta: "Tap to accept or decline",
            unread: true,
            payload: { request_id, user_id, expert_id },
            createdAt: Date.now(),
          },
          ...prev,
        ];
      });
    };

    socket.on("incoming_chat_request", onIncoming);
    return () => socket.off("incoming_chat_request", onIncoming);
  }, []);

  // STATUS UPDATE LISTENER
  useEffect(() => {
    const handleRequestStatusUpdate = ({ request_id, status }) => {
      console.log("📤 EXPERT: Request status update:", {
        request_id,
        status,
      });

      setNotifications((prev) =>
        prev.map((notification) => {
          if (notification.id === request_id) {
            const updatedNotification = {
              ...notification,
              status,
              unread:
                status === "cancelled"
                  ? false
                  : notification.unread,
            };

            console.log("🔄 EXPERT: Updated notification status:", {
              request_id,
              oldStatus: notification.status,
              newStatus: status,
            });

            return updatedNotification;
          }
          return notification;
        })
      );
    };

    socket.on("request_status_update", handleRequestStatusUpdate);
    return () =>
      socket.off("request_status_update", handleRequestStatusUpdate);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        unread: false,
      }))
    );
  }, []);

  const removeById = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      console.log("🗑️ EXPERT: Manual remove notification:", id);
      return updated;
    });
  }, []);

  const acceptRequest = useCallback(
    (requestId) => {
      console.log("✅ CONTEXT ACCEPT:", requestId);
      socket.emit("accept_chat", { request_id: requestId });
      // remove local notification (server will also send updates)
      removeById(requestId);
    },
    [removeById]
  );

  const declineRequest = useCallback((requestId) => {
    console.log("❌ CONTEXT DECLINE:", requestId);
    socket.emit("reject_chat", { request_id: requestId });
    // keep notification; status update will reflect
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAllRead,
      acceptRequest,
      declineRequest,
      removeById,
    }),
    [
      notifications,
      unreadCount,
      markAllRead,
      acceptRequest,
      declineRequest,
      removeById,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useExpertNotifications() {
  const v = useContext(Ctx);
  if (!v)
    throw new Error(
      "useExpertNotifications must be used inside ExpertNotificationsProvider"
    );
  return v;
}
