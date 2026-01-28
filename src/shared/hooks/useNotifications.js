import { useEffect, useState } from "react";
import { socket } from "../api/socket";
import {
  getNotifications,
  getUnreadCount,
} from "../api/notification.api";

export const useNotifications = ({ panel, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  /* ===============================
     1️⃣ HISTORY LOAD
  =============================== */
  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        const res = await getNotifications({
          userId,
          panel,
        });

        setNotifications(res.data);

        const count = await getUnreadCount({ userId });
        setUnread(count.data.count);
      } catch (err) {
        console.log("notif load error", err);
      }
    };

    load();
  }, [panel, userId]);

  /* ===============================
     2️⃣ REALTIME
  =============================== */
  useEffect(() => {
    const handler = (notif) => {
      if (notif.panel !== panel) return;
      if (notif.user_id !== userId) return; // ⭐ important

      setNotifications((prev) => [notif, ...prev]);
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
