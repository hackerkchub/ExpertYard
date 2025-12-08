import { useEffect, useState } from "react";

const MOCK_DATA = [
  {
    id: 1,
    type: "request",
    title: "New call request from Rahul Verma",
    meta: "Carer Advice · 5 min ago",
    unread: true,
  },
  {
    id: 2,
    type: "activity",
    title: "Your post “Future of AI” got 24 new likes",
    meta: "10 min ago",
    unread: true,
  },
  {
    id: 3,
    type: "session",
    title: "Today’s session with Nihar is confirmed",
    meta: "30 min ago",
    unread: false,
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState(MOCK_DATA);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    // 👇 Correct Vite env var usage
    const url = import.meta.env.VITE_WS_NOTIF_URL;
    if (!url) return;

    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setNotifications(prev => [
          { ...data, unread: true },
          ...prev,
        ]);
      } catch (e) {
        console.error("Invalid notification payload", e);
      }
    };

    return () => ws.close();
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const acceptRequest = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const declineRequest = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return {
    notifications,
    unreadCount,
    markAllRead,
    acceptRequest,
    declineRequest,
  };
}
