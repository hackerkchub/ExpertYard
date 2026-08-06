import { useEffect, useState } from "react";
import { socket } from "../api/socket";
import {
  getNotifications,
  getUnreadCount,
} from "../api/notification.api";
import { presenceService } from "../services/presence/presenceService";
import { deduplicationService } from "../services/notification/deduplicationService";

const normalizeNotification = (notification) => {
  let meta = notification?.meta || {};
  if (typeof meta === "string") {
    try {
      meta = JSON.parse(meta);
    } catch {
      meta = {};
    }
  }

  return {
    ...notification,
    meta,
    time: notification?.time || notification?.createdAt || notification?.created_at,
  };
};

export const useNotifications = ({ panel, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        const res = await getNotifications({
          userId,
          panel,
        });

        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : [];

        const terminalChatTypes = new Set([
          "chat_cancelled",
          "chat_rejected",
          "chat_timeout",
          "chat_ended",
          "chat_missed"
        ]);

        const filteredList = list.filter((n) => !terminalChatTypes.has(String(n.type || "").toLowerCase()));

        setNotifications(filteredList.map(normalizeNotification));

        const count = await getUnreadCount({ userId });
        setUnread(Number(count.data?.count || 0));
      } catch (err) {
        console.log("notif load error", err);
      }
    };

    load();
  }, [panel, userId]);

  useEffect(() => {
    if (!userId) return undefined;

    const handler = (notif) => {
      if (notif.panel !== panel) return;
      if (Number(notif.user_id) !== Number(userId)) return;

      // 🟢 1. Server/Client Notification Deduplication Check
      if (deduplicationService.isDuplicate(notif)) {
        return;
      }

      // 🟢 2. Online Presence & Room Visibility Check (Paid Chat & Free Master Service Workspace Chat)
      const notifType = String(notif.type || "").toLowerCase();
      const isChatNotif = notifType === "chat_message" || notifType === "chat_request" || notifType.includes("chat");
      let meta = notif.meta || {};
      if (typeof meta === "string") {
        try { meta = JSON.parse(meta); } catch { meta = {}; }
      }
      const roomId =
        meta.room_id ||
        meta.roomId ||
        meta.request_id ||
        meta.requestId ||
        meta.chat_id ||
        meta.booking_id ||
        notif.related_id ||
        notif.relatedId;

      if (isChatNotif) {
        const currentPath = window.location.pathname;
        const isChatOrWorkspacePage =
          currentPath.includes("/user/chat") ||
          currentPath.includes("/user/workspace") ||
          currentPath.includes("/expert/chat") ||
          currentPath.includes("/expert/workspace");

        if (isChatOrWorkspacePage && document.visibilityState === "visible") {
          const activeRoom = presenceService.activeRoomId;
          const isSameRoom =
            !roomId ||
            (activeRoom && String(activeRoom) === String(roomId)) ||
            currentPath.includes(String(roomId)) ||
            (meta.booking_id && currentPath.includes(String(meta.booking_id)));

          if (isSameRoom || presenceService.isRecipientActiveInRoom(roomId, userId)) {
            console.log("🔕 [useNotifications] Active in chat/workspace room. Suppressing duplicate notification popup.");
            return;
          }
        }
      }

      setNotifications((prev) => [normalizeNotification(notif), ...prev]);
      setUnread((c) => c + 1);
    };

    const handleUpdate = (data = {}) => {
      if (data.batch_id) {
        setNotifications((prev) =>
          prev.map((item) => {
            if (item.related_id === data.batch_id || item.meta?.batch_id === data.batch_id) {
              return {
                ...item,
                title: data.title || item.title,
                message: data.message || item.message,
                body: data.description || data.message || item.body,
              };
            }
            return item;
          })
        );
      }
    };

    const handleDeleteNotif = (data = {}) => {
      if (data.batch_id) {
        setNotifications((prev) =>
          prev.filter(
            (item) => item.related_id !== data.batch_id && item.meta?.batch_id !== data.batch_id
          )
        );
      }
    };

    socket.on("notification:new", handler);
    socket.on("notification:updated", handleUpdate);
    socket.on("notification:deleted", handleDeleteNotif);

    return () => {
      socket.off("notification:new", handler);
      socket.off("notification:updated", handleUpdate);
      socket.off("notification:deleted", handleDeleteNotif);
    };
  }, [panel, userId]);

  return {
    notifications,
    unread,
    setUnread,
    setNotifications,
  };
};
