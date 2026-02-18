import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
// import { useNavigate } from "react-router-dom"; // ⚠️ 2️⃣ Added for SPA navigation

import { socket } from "../../../shared/api/socket";
import { useExpert } from "../../../shared/context/ExpertContext";
import { saveNotification, getNotifications,
  getUnreadCount, deleteNotification} from "../../../shared/api/notification.api";

const Ctx = createContext(null);
const getStorageKey = (expertId) =>
  expertId ? `expert_notifications_${expertId}` : "expert_notifications_guest";

const getSafeUserName = (user_name, user_id) => {
  if (typeof user_name === "string" && user_name.trim()) {
    return user_name.trim();
  }
  return `User #${user_id}`;
};

const FINAL_STATES = ["missed", "rejected", "ended", "low_balance", "cancelled"];

export function ExpertNotificationsProvider({ children }) {
  const { expertData } = useExpert();
  const expertId = expertData?.expertId || null;
  
  // Use Map for timers
  const timers = useRef(new Map());
  
  // Track if history has loaded
  const [historyLoaded, setHistoryLoaded] = useState(false);
  
  // const navigate = useNavigate();

  /* ---------------------------------- STATE ---------------------------------- */
  const [notifications, setNotifications] = useState([]);

  /* ---------------------------------- TIMER CLEANUP ---------------------------------- */
  useEffect(() => {
    return () => {
      // Clear all pending timeouts on unmount
      timers.current.forEach((timerId) => clearTimeout(timerId));
      timers.current.clear();
    };
  }, []);

  /* ---------------------------------- RESET ON EXPERT CHANGE ---------------------------------- */
  useEffect(() => {
    console.log("🔄 Expert changed, resetting notifications state");
    setNotifications([]);
    setHistoryLoaded(false);
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, [expertId]);

  /* ---------------------------------- LOAD FROM STORAGE (temporary until DB loads) ---------------------------------- */
  useEffect(() => {
    if (!expertId) return;
    
    if (historyLoaded) return;
    
    const key = getStorageKey(expertId);

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, [expertId, historyLoaded]);

  /* ---------------------------------- PERSIST TO STORAGE ---------------------------------- */
  useEffect(() => {
    if (!expertId) return;
    
    if (!historyLoaded) return;
    
    const key = getStorageKey(expertId);
    localStorage.setItem(key, JSON.stringify(notifications));
  }, [notifications, expertId, historyLoaded]);

  /* ---------------------------------- UNREAD ---------------------------------- */
  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (n) =>
          n.unread &&
          !["cancelled", "rejected", "ended", "read", "missed", "low_balance"].includes(n.status)
      ).length,
    [notifications]
  );

  /* =====================================================
     🔔 CHAT REQUEST
  ===================================================== */
  useEffect(() => {
    const onIncomingChat = ({ request_id, user_id, user_name }) => {
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

      // 🟢 OPTIONAL: Performance optimization - avoid re-render if same notification
      setNotifications((prev) => {
        if (prev.some((n) => n.id === request_id)) return prev;
        return [newNotif, ...prev];
      });

      if (expertId != null && !document.hidden) {
        saveNotification({
          userId: expertId,
          panel: "expert",
          title: newNotif.title,
          message: "Tap to open",
          type: "chat_request",
          meta: { request_id },
        }).catch((err) => console.log("Failed to save chat request to DB", err));
      }
    };

    socket.on("incoming_chat_request", onIncomingChat);
    return () => socket.off("incoming_chat_request", onIncomingChat);
  }, [expertId]);

  /* =====================================================
     📞 VOICE CALL
  ===================================================== */
  useEffect(() => {
    const onIncomingCall = ({
      callId,
      fromUserId,
      user_name,
      pricePerMinute,
      status
    }) => {
      const safeName = getSafeUserName(user_name, fromUserId);

      const newNotif = {
        id: callId,
        type: "voice_call",
        status: status || "ringing",
        title: `Incoming call from ${safeName}`,
        meta: pricePerMinute ? `₹${pricePerMinute}/min` : "Tap to answer",
        unread: true,
        payload: { callId },
        createdAt: Date.now(),
      };

      // 🟢 OPTIONAL: Performance optimization - avoid re-render if latest notification is same
      setNotifications((prev) => {
        if (prev[0]?.id === callId) return prev;
        return [newNotif, ...prev.filter((n) => n.id !== callId)];
      });
    };

    socket.on("call:incoming", onIncomingCall);
    return () => socket.off("call:incoming", onIncomingCall);
  }, []);

  /* =====================================================
     STATUS EVENTS
  ===================================================== */
  useEffect(() => {
    const handleMissed = ({ callId, status }) => {
      updateStatus(callId, status || "missed");
    };

    const handleRejected = ({ callId, status }) => {
      updateStatus(callId, status || "rejected");
    };

    const handleTaken = ({ callId }) => {
      setNotifications((prev) => prev.filter((n) => n.id !== callId));
    };

    const handleEnded = ({ callId, status }) => {
      updateStatus(callId, status || "ended");
    };

    const handleConnected = ({ callId }) => {
      setNotifications((prev) => prev.filter((n) => n.id !== callId));
    };

    // 1️⃣ FIXED: Timer overwrite protection
    const updateStatus = (id, status) => {
      setNotifications((prev) => {
        if (!prev.some((n) => n.id === id)) {
          console.log(`⚠️ Notification ${id} not found, skipping status update`);
          return prev;
        }

        return prev.map((n) =>
          n.id === id 
            ? { 
                ...n, 
                status, 
                unread: status === "ringing" ? true : false 
              } 
            : n
        );
      });

      if (FINAL_STATES.includes(status)) {
        // 1️⃣ Clear existing timer if any
        const existing = timers.current.get(id);
        if (existing) {
          clearTimeout(existing);
          console.log(`⏰ Cleared existing timer for ${id}`);
        }

        const timerId = setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
          timers.current.delete(id);
        }, 60000);
        
        timers.current.set(id, timerId);
      }
    };

    socket.on("call:missed", handleMissed);
    socket.on("call:rejected", handleRejected);
    socket.on("call:taken", handleTaken);
    socket.on("call:ended", handleEnded);
    socket.on("call:connected", handleConnected);

    return () => {
      socket.off("call:missed", handleMissed);
      socket.off("call:rejected", handleRejected);
      socket.off("call:taken", handleTaken);
      socket.off("call:ended", handleEnded);
      socket.off("call:connected", handleConnected);
    };
  }, []);

  /* =====================================================
     LEGACY STATUS UPDATES (for chat)
  ===================================================== */
  useEffect(() => {
    const handleChatCancelled = ({ request_id }) => markDone(request_id, "cancelled");
    const handleChatRejected = ({ request_id }) => markDone(request_id, "rejected");
    const handleChatEnded = ({ request_id }) => markDone(request_id, "ended");

    // 2️⃣ FIXED: Added guard and timer overwrite protection
    const markDone = (id, status) => {
      setNotifications((prev) => {
        if (!prev.some((n) => n.id === id)) return prev;

        return prev.map((n) =>
          n.id === id ? { ...n, status, unread: false } : n
        );
      });

      if (FINAL_STATES.includes(status)) {
        // 1️⃣ Clear existing timer if any
        const existing = timers.current.get(id);
        if (existing) {
          clearTimeout(existing);
          console.log(`⏰ Cleared existing chat timer for ${id}`);
        }

        const timerId = setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
          timers.current.delete(id);
        }, 60000);
        
        timers.current.set(id, timerId);
      }
    };

    socket.on("chat_cancelled", handleChatCancelled);
    socket.on("chat_rejected", handleChatRejected);
    socket.on("chat_ended", handleChatEnded);

    return () => {
      socket.off("chat_cancelled", handleChatCancelled);
      socket.off("chat_rejected", handleChatRejected);
      socket.off("chat_ended", handleChatEnded);
    };
  }, []);

  /* =====================================================
     LOAD HISTORY FROM DB (merge with live)
  ===================================================== */
  useEffect(() => {
    if (!expertId) return;

    const loadHistory = async () => {
      try {
        const res = await getNotifications({
          userId: expertId,
          panel: "expert",
        });

        const mapped = (res.data || []).map((n) => ({
          id: n.id,
          type: n.type,
          status: n.status || "pending",
          title: n.title,
          meta: n.message,
          unread: !n.is_read,
          payload: n.meta || {},
          createdAt: new Date(n.created_at).getTime(),
        }));

        // Merge with live notifications
        setNotifications((prev) => {
          const liveMap = new Map(prev.map((n) => [n.id, n]));

          mapped.forEach((n) => {
            liveMap.set(n.id, n);
          });

          return Array.from(liveMap.values()).sort((a, b) => b.createdAt - a.createdAt);
        });

        // Clear localStorage if DB empty
        if (mapped.length === 0) {
          localStorage.removeItem(getStorageKey(expertId));
        }

        setHistoryLoaded(true);

        await getUnreadCount({ userId: expertId });
      } catch (err) {
        console.log("history load failed", err);
        setHistoryLoaded(true);
      }
    };

    loadHistory();
  }, [expertId]);

  /* ---------------------------------- HELPERS ---------------------------------- */
  const removeById = useCallback(
    async (id) => {
      try {
        if (expertId) {
          try {
            await deleteNotification(id, expertId);
          } catch (err) {
            console.log("DB delete failed", err);
          }
        }

        // Clear timer for this notification
        const timer = timers.current.get(id);
        if (timer) {
          clearTimeout(timer);
          timers.current.delete(id);
        }

        setNotifications((prev) => prev.filter((n) => n.id !== id));
      } catch (err) {
        console.log("delete notification failed", err);
      }
    },
    [expertId]
  );

  const acceptNotification = useCallback((notification) => {
    if (!notification) return;

    if (notification.type === "voice_call") {
      window.dispatchEvent(
        new CustomEvent("go_to_call_page", {
          detail: notification.payload.callId,
        })
      );
      return;
    }

    if (notification.type === "chat_request") {
      socket.emit("accept_chat", {
        request_id: notification.payload.request_id,
      });
    }

    removeById(notification.id);
  }, [removeById]);

  const rejectNotification = useCallback((notification) => {
    if (!notification) return;

    if (notification.type === "chat_request") {
      socket.emit("reject_chat", {
        request_id: notification.payload.request_id,
      });
    }

    if (notification.type === "voice_call") {
      socket.emit("call:reject", {
        callId: notification.payload.callId,
      });
    }

    removeById(notification.id);
  }, [removeById]);

  /* ---------------------------------- CONTEXT ---------------------------------- */
  const value = useMemo(() => ({
    notifications,
    unreadCount,
    acceptNotification,
    rejectNotification,
    removeById,
    historyLoaded,
  }), [notifications, unreadCount, acceptNotification, rejectNotification, removeById, historyLoaded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useExpertNotifications() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useExpertNotifications must be used within provider");
  return ctx;
}