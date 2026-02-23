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
   deleteNotification} from "../../../shared/api/notification.api";
   import { soundManager } from "../../../shared/services/sound/soundManager";
import { SOUNDS } from "../../../shared/services/sound/soundRegistry";

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
  
  // ✅ REF for accessing latest notifications in callbacks
  const notificationsRef = useRef([]);
  
  // Track if history has loaded
  const [historyLoaded, setHistoryLoaded] = useState(false);
  
  // const navigate = useNavigate();

  /* ---------------------------------- STATE ---------------------------------- */
  const [notifications, setNotifications] = useState([]);

  /* ---------------------------------- SYNC REF WITH STATE ---------------------------------- */
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

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
          !FINAL_STATES.includes(n.status)
      ).length,
    [notifications]
  );

  const chatUnreadCount = useMemo(
  () =>
    notifications.filter(
      (n) =>
        n.type === "chat_request" &&
        n.unread &&
        !FINAL_STATES.includes(n.status)
    ).length,
  [notifications]
);

const callUnreadCount = useMemo(
  () =>
    notifications.filter(
      (n) =>
        n.type === "voice_call" &&
        n.unread &&
        !FINAL_STATES.includes(n.status)
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
        id: request_id,                    // Local ID (request_id)
        type: "chat_request",
        status: "pending",
        title: `Chat request from ${safeName}`,
        meta: "Tap to open",
        unread: true,
        payload: { request_id },
        createdAt: Date.now(),
      };

      // ✅ FIXED: Remove document.hidden check - always save to DB
      if (expertId != null) {
        try {
          const res = await saveNotification({
            userId: expertId,
            panel: "expert",
            title: newNotif.title,
            message: "Tap to open",
            type: "chat_request",
            meta: { request_id },
          });
          
          // ✅ Store DB ID in notification
          if (res?.data?.data?.id) {
            newNotif.dbId = res.data.data.id;
          }
        } catch (err) {
          console.log("Failed to save chat request to DB", err);
        }
      }

      // ✅ Now add to state with dbId
      setNotifications((prev) => {
        if (prev.some((n) => n.id === request_id)) return prev;
        return [newNotif, ...prev];
      });
     
    };

    socket.on("incoming_chat_request", onIncomingChat);
    return () => socket.off("incoming_chat_request", onIncomingChat);
  }, [expertId]);

  /* =====================================================
     📞 VOICE CALL
  ===================================================== */
  useEffect(() => {
    const onIncomingCall = async ({
      callId,
      fromUserId,
      user_name,
      pricePerMinute,
      status
    }) => {
      const safeName = getSafeUserName(user_name, fromUserId);

      const newNotif = {
        id: callId,                         // Local ID (callId)
        type: "voice_call",
        status: status || "ringing",
        title: `Incoming call from ${safeName}`,
        meta: pricePerMinute ? `₹${pricePerMinute}/min` : "Tap to answer",
        unread: true,
        payload: { callId },
        createdAt: Date.now(),
      };

      // ✅ FIXED: Remove document.hidden check - always save to DB
      if (expertId != null) {
        try {
          const res = await saveNotification({
            userId: expertId,
            panel: "expert",
            title: newNotif.title,
            message: newNotif.meta,
            type: "voice_call",
            meta: { callId },
          });
          
          // ✅ Store DB ID
          if (res?.data?.data?.id) {
            newNotif.dbId = res.data.data.id;
          }
        } catch (err) {
          console.log("Failed to save voice call to DB", err);
        }
      }

      setNotifications((prev) => {
      if (prev.some(n => n.id === callId)) return prev;
        return [newNotif, ...prev.filter((n) => n.id !== callId)];
      });
      //  soundManager.play(SOUNDS.INCOMING_CALL, { loop: true, volume: 1 });
    };

    socket.on("call:incoming", onIncomingCall);
    return () => socket.off("call:incoming", onIncomingCall);
  }, [expertId]);

  /* =====================================================
     STATUS EVENTS
  ===================================================== */
  const removeById = useCallback(
    async (notification) => {
      if (!notification?.id) return;
      // soundManager.stopAll();
      try {
        // Clear timer for this notification first
        const timer = timers.current.get(notification.id);
        if (timer) {
          clearTimeout(timer);
          timers.current.delete(notification.id);
        }

        // UI instant remove
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));

        // DB delete using dbId
        if (expertId && notification.dbId) {
          try {
            await deleteNotification(notification.dbId, expertId);
          } catch (err) {
            console.log("DB delete failed", err);
          }
        }
      } catch (err) {
        console.log("delete notification failed", err);
      }
    },
    [expertId]
  );

  // ✅ Helper to get full notification from ref
  const getNotification = useCallback((id) => {
    return notificationsRef.current.find(n => n.id === id);
  }, []);

  useEffect(() => {
    const handleMissed = ({ callId, status }) => {
      const notif = getNotification(callId);
      if (notif) {
        updateStatus(notif, status || "missed");
      }
    };

    const handleRejected = ({ callId, status }) => {
      const notif = getNotification(callId);
      if (notif) {
        updateStatus(notif, status || "rejected");
      }
    };

    const handleTaken = ({ callId }) => {
      const notif = getNotification(callId);
      if (notif) {
        removeById(notif);
      }
    };

    const handleEnded = ({ callId, status }) => {
      const notif = getNotification(callId);
      if (notif) {
        updateStatus(notif, status || "ended");
      }
    };

    const handleConnected = ({ callId }) => {
      const notif = getNotification(callId);
      if (notif) {
        removeById(notif);
      }
    };

    // ✅ Timer overwrite protection with full notification
    const updateStatus = (notification, status) => {
      if (!notification?.id) return;
      
      setNotifications((prev) => {
        if (!prev.some((n) => n.id === notification.id)) {
          console.log(`⚠️ Notification ${notification.id} not found, skipping status update`);
          return prev;
        }

        return prev.map((n) =>
          n.id === notification.id 
            ? { 
                ...n, 
                status, 
                unread: status === "ringing" ? true : false 
              } 
            : n
        );
      });

      if (FINAL_STATES.includes(status)) {
        // Clear existing timer if any
        const existing = timers.current.get(notification.id);
        if (existing) {
          clearTimeout(existing);
          console.log(`⏰ Cleared existing timer for ${notification.id}`);
        }

        const timerId = setTimeout(() => {
          const notif = getNotification(notification.id);
          if (notif) {
            removeById(notif);
            timers.current.delete(notification.id);
          }
        }, 60000);
        
        timers.current.set(notification.id, timerId);
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
  }, [getNotification, removeById]);

  /* =====================================================
     LEGACY STATUS UPDATES (for chat)
  ===================================================== */
  useEffect(() => {
    const handleChatCancelled = ({ request_id }) => {
      const notif = getNotification(request_id);
      if (notif) markDone(notif, "cancelled");
    };
    
    const handleChatRejected = ({ request_id }) => {
      const notif = getNotification(request_id);
      if (notif) markDone(notif, "rejected");
    };
    
    const handleChatEnded = ({ request_id }) => {
      const notif = getNotification(request_id);
      if (notif) markDone(notif, "ended");
    };

    // ✅ Added guard and timer overwrite protection
    const markDone = (notification, status) => {
      if (!notification?.id) return;
      
      setNotifications((prev) => {
        if (!prev.some((n) => n.id === notification.id)) return prev;

        return prev.map((n) =>
          n.id === notification.id ? { ...n, status, unread: false } : n
        );
      });

      if (FINAL_STATES.includes(status)) {
        // Clear existing timer if any
        const existing = timers.current.get(notification.id);
        if (existing) {
          clearTimeout(existing);
          console.log(`⏰ Cleared existing chat timer for ${notification.id}`);
        }

        const timerId = setTimeout(() => {
          const notif = getNotification(notification.id);
          if (notif) {
            removeById(notif);
            timers.current.delete(notification.id);
          }
        }, 60000);
        
        timers.current.set(notification.id, timerId);
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
  }, [getNotification, removeById]);

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

        // ✅ FIXED: Smart ID mapping to prevent duplicates
        const mapped = (res.data || []).map((n) => {
          const meta = n.meta || {};
          // Use request_id or callId from meta as local ID, fallback to DB ID
          const localId = meta.request_id || meta.callId || n.id;

          return {
            id: localId,                    // Local ID for UI matching
            dbId: n.id,                      // DB ID for delete
            type: n.type,
           status: FINAL_STATES.includes(n.status) ? n.status : "missed",
            title: n.title,
            meta: n.message,
            unread: !n.is_read,
            payload: meta,
            createdAt: new Date(n.created_at).getTime(),
          };
        });

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

        // ✅ Get unread count (optional - remove if not needed)
        
      } catch (err) {
        console.log("history load failed", err);
        setHistoryLoaded(true);
      }
    };

    loadHistory();
  }, [expertId]);

  /* ---------------------------------- ACCEPT / REJECT ---------------------------------- */
  const acceptNotification = useCallback((notification) => {
    if (!notification) return;

    if (notification.type === "voice_call") {
      // soundManager.stopAll();
      window.dispatchEvent(
        new CustomEvent("go_to_call_page", {
          detail: notification.payload.callId,
        })
      );
      // ✅ Remove notification after dispatch
      removeById(notification);
      return;
    }

    if (notification.type === "chat_request") {
      socket.emit("accept_chat", {
        request_id: notification.payload.request_id,
      });
    }

    removeById(notification);
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

    removeById(notification);
  }, [removeById]);

  /* ---------------------------------- CONTEXT ---------------------------------- */
  const value = useMemo(() => ({
    notifications,
    unreadCount,
    chatUnreadCount,   // ⭐ add
  callUnreadCount,   // ⭐ add
    acceptNotification,
    rejectNotification,
    removeById,
    historyLoaded,
  }), [notifications, unreadCount, chatUnreadCount, callUnreadCount, acceptNotification, rejectNotification, removeById, historyLoaded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useExpertNotifications() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useExpertNotifications must be used within provider");
  return ctx;
}