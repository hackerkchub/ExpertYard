import { useEffect, useState, useCallback } from "react";
import { socket } from "../../../shared/api/socket";

/*
 Notification object shape:
 {
   id: request_id,
   type: "chat_request",
   title: string,
   meta: string,
   unread: boolean,
   payload: { request_id, user_id }
 }
*/

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  /* =========================
     DERIVED STATE
  ========================= */
  const unreadCount = notifications.filter(n => n.unread).length;

  /* =========================
     SOCKET LISTENERS
  ========================= */
  useEffect(() => {
    if (!socket) return;

    // 🔔 Incoming chat request (USER → EXPERT)
    const handleIncomingRequest = ({ request_id, user_id }) => {
      setNotifications(prev => {
        // 🛑 duplicate guard
        if (prev.some(n => n.id === request_id)) return prev;

        return [
          {
            id: request_id,
            type: "chat_request",
            title: "New chat request",
            meta: `User #${user_id} wants to chat`,
            unread: true,
            payload: { request_id, user_id }
          },
          ...prev
        ];
      });
    };

    socket.on("incoming_chat_request", handleIncomingRequest);

    return () => {
      socket.off("incoming_chat_request", handleIncomingRequest);
    };
  }, []);

  /* =========================
     ACTIONS
  ========================= */

  // ✅ Mark all notifications read
  const markAllRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    );
  }, []);

  // ✅ Expert ACCEPT chat request
  const acceptRequest = useCallback((requestId) => {
    if (!requestId) return;

    // backend notify
    socket.emit("accept_chat", { request_id: requestId });

    // ❌ remove notification completely (better UX)
    setNotifications(prev =>
      prev.filter(n => n.id !== requestId)
    );
  }, []);

  // ✅ Expert DECLINE chat request
  const declineRequest = useCallback((requestId) => {
    if (!requestId) return;

    socket.emit("reject_chat", { request_id: requestId });

    setNotifications(prev =>
      prev.filter(n => n.id !== requestId)
    );
  }, []);

  return {
    notifications,
    unreadCount,
    markAllRead,
    acceptRequest,
    declineRequest
  };
}
