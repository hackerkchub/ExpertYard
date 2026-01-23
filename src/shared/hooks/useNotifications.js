import { useEffect, useState } from "react";
import { socket } from "../api/socket";
import {
  fetchNotifications,
  getUnreadCount,
} from "../api/notification.api";

export const useNotifications = (panel) => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  // 1️⃣ history load
  useEffect(() => {
    const load = async () => {
      const res = await fetchNotifications(panel);
      setNotifications(res.data);

      const count = await getUnreadCount();
      setUnread(count.data.count);
    };

    load();
  }, [panel]);

  // 2️⃣ realtime socket
  useEffect(() => {
    const handler = (notif) => {
      if (notif.panel !== panel) return;

      setNotifications((prev) => [notif, ...prev]);
      setUnread((c) => c + 1);
    };

    socket.on("notification:new", handler);

    return () => socket.off("notification:new", handler);
  }, [panel]);

  return {
    notifications,
    unread,
    setUnread,
    setNotifications,
  };
};
