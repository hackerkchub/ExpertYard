import { useEffect, useState } from "react";
import { socket } from "../api/socket";
import {
  getNotifications,
  getUnreadCount,
} from "../api/notification.api";

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

        setNotifications(list.map(normalizeNotification));

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

      setNotifications((prev) => [normalizeNotification(notif), ...prev]);
      setUnread((c) => c + 1);
    };

    socket.on("notification:new", handler);

    return () => socket.off("notification:new", handler);
  }, [panel, userId]);

  return {
    notifications,
    unread,
    setUnread,
    setNotifications,
  };
};
