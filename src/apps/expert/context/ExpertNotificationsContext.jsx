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
import { saveNotification, getNotifications, deleteNotification } from "../../../shared/api/notification.api";
import { soundManager } from "../../../shared/services/sound/soundManager";
import { SOUNDS } from "../../../shared/services/sound/soundRegistry";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../../firebase/firebase";

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

/* =====================================================
   🔧 UTILITIES
===================================================== */
const normalizeCallPayload = (data) => ({
  callId: data.callId,
  fromUserId: data.fromUserId,
  user_name: data.userName || data.user_name,
  pricePerMinute: data.pricePerMinute,
  status: data.status || "ringing",
});

export function ExpertNotificationsProvider({ children }) {
  const { expertData } = useExpert();
  const expertId = expertData?.expertId || null;
  
  // Use Map for timers
  const timers = useRef(new Map());
  
  // ✅ REF for accessing latest notifications in callbacks
  const notificationsRef = useRef([]);
  
  // ✅ BroadcastChannel for multi-tab communication
  const broadcastChannel = useRef(null);
  
  // Track if history has loaded
  const [historyLoaded, setHistoryLoaded] = useState(false);
  
  // const navigate = useNavigate();

  /* ---------------------------------- STATE ---------------------------------- */
  const [notifications, setNotifications] = useState([]);

  /* ---------------------------------- SYNC REF WITH STATE ---------------------------------- */
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  /* ---------------------------------- AUTO STOP SOUND ON TAB HIDE (PRO IMPROVEMENT 2) ---------------------------------- */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        soundManager.stopAll();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  /* ---------------------------------- TIMER CLEANUP ---------------------------------- */
  useEffect(() => {
    return () => {
      // Clear all pending timeouts on unmount
      timers.current.forEach((timerId) => clearTimeout(timerId));
      timers.current.clear();
      
      // Close broadcast channel
      if (broadcastChannel.current) {
        broadcastChannel.current.close();
      }
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
     📢 BROADCAST CHANNEL (ONCE ONLY - ISSUE 4 FIXED)
  ===================================================== */
  useEffect(() => {
    // Create broadcast channel once
    broadcastChannel.current = new BroadcastChannel("expert_notifications");

    return () => {
      if (broadcastChannel.current) {
        broadcastChannel.current.close();
      }
    };
  }, []); // Empty dependency array = once only

  /* =====================================================
     🔥 REUSABLE FUNCTION FOR INCOMING CALLS (SOCKET + FCM + BROADCAST)
     FIXED: fromBroadcast flag to prevent loops (ISSUE 1)
     OPTIMIZED: Sound only for ringing status (MICRO OPTIMIZATION 2)
  ===================================================== */
  const createIncomingCallNotification = useCallback(
    async (data, { fromBroadcast = false } = {}) => {
      const { callId, fromUserId, user_name, pricePerMinute, status } = data;
      
      // Prevent duplicate notifications for same callId
      if (notificationsRef.current.some((n) => n.id === callId)) {
        console.log(`⚠️ Call ${callId} notification already exists, skipping`);
        return;
      }

      const safeName = getSafeUserName(user_name, fromUserId);
      const isRinging = status === "ringing";

      const newNotif = {
        id: callId,
        type: "voice_call",
        status: status || "ringing",
        title: `Incoming call from ${safeName}`,
        meta: pricePerMinute ? `₹${pricePerMinute}/min` : "Tap to answer",
        unread: isRinging,
        payload: { callId },
        createdAt: Date.now(),
      };

      // ✅ Save to DB
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

          if (res?.data?.data?.id) {
            newNotif.dbId = res.data.data.id;
          }
        } catch (err) {
          console.log("❌ Failed to save call notification to DB:", err);
        }
      }

      // ✅ Broadcast to other tabs ONLY if this is the origin tab (ISSUE 1 FIX)
      if (!fromBroadcast && broadcastChannel.current) {
        broadcastChannel.current.postMessage({
          type: "INCOMING_CALL",
          data: { callId, fromUserId, user_name, pricePerMinute, status }
        });
      }

      setNotifications((prev) => {
        if (prev.some((n) => n.id === callId)) return prev;
        return [newNotif, ...prev];
      });

      // 🔊 Play sound for incoming call ONLY if:
      // 1. Status is "ringing" (MICRO OPTIMIZATION 2)
      // 2. Tab is visible (ISSUE 2 FIX)
      if (isRinging && document.visibilityState === "visible") {
        soundManager.play(SOUNDS.INCOMING_CALL, { loop: true, volume: 1 });
      }
    },
    [expertId]
  );

  /* =====================================================
     📢 BROADCAST LISTENER (receives from other tabs)
     FIXED: Memory leak with cleanup (REAL BUG 2)
  ===================================================== */
  useEffect(() => {
    const channel = broadcastChannel.current;
    if (!channel) return;

    const handleBroadcastMessage = (event) => {
      console.log("📢 Broadcast message received:", event.data);

      if (event.data?.type === "INCOMING_CALL") {
        // Pass fromBroadcast: true to prevent re-broadcasting (ISSUE 1 FIX)
        createIncomingCallNotification(event.data.data, { fromBroadcast: true });
      }
      
      if (event.data?.type === "NOTIFICATION_REMOVED") {
        setNotifications((prev) => 
          prev.filter((n) => n.id !== event.data.notificationId)
        );
        // Stop sound on other tabs when notification is removed (PRO IMPROVEMENT 3)
        soundManager.stopAll();
      }

      if (event.data?.type === "CALL_ACCEPTED" || event.data?.type === "CALL_REJECTED") {
        // Stop sound on other tabs when call is accepted/rejected
        soundManager.stopAll();
      }
    };

    channel.onmessage = handleBroadcastMessage;

    // ✅ IMPORTANT: Cleanup to prevent memory leak
    return () => {
      channel.onmessage = null;
    };
  }, [createIncomingCallNotification]);

  /* =====================================================
     📡 SOCKET LISTENER FOR INCOMING CALLS
     FIXED: Proper handler reference (REAL BUG 1)
  ===================================================== */
  useEffect(() => {
    const handleIncomingCall = (data) => {
      createIncomingCallNotification(normalizeCallPayload(data));
    };

    socket.on("call:incoming", handleIncomingCall);

    return () => {
      socket.off("call:incoming", handleIncomingCall);
    };
  }, [createIncomingCallNotification]);

  /* =====================================================
     🔥 FCM LISTENER FOR INCOMING CALLS (PRO IMPROVEMENT 1)
  ===================================================== */
  useEffect(() => {
    if (!messaging || !expertId) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📱 FCM message received:", payload);

      if (payload.data?.type === "CALL") {
        createIncomingCallNotification(normalizeCallPayload(payload.data));
      }
    });

    return () => unsubscribe();
  }, [expertId, createIncomingCallNotification]);

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

       if (document.visibilityState === "visible") {
    soundManager.play(SOUNDS.NOTIFICATION);
  }

      // ✅ Save to DB
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
          console.log("❌ Failed to save chat request to DB", err);
        }
      }

      // ✅ Broadcast to other tabs
      if (broadcastChannel.current) {
        broadcastChannel.current.postMessage({
          type: "NEW_CHAT_REQUEST",
          data: { request_id, user_id, user_name }
        });
      }

      setNotifications((prev) => {
        if (prev.some((n) => n.id === request_id)) return prev;
        return [newNotif, ...prev];
      });
    };

    socket.on("incoming_chat_request", onIncomingChat);
    return () => socket.off("incoming_chat_request", onIncomingChat);
  }, [expertId]);

  /* =====================================================
     🗑️ REMOVE NOTIFICATION BY ID
  ===================================================== */
  const removeById = useCallback(
    async (notification) => {
      if (!notification?.id) return;
      
      try {
        // Clear timer for this notification first
        const timer = timers.current.get(notification.id);
        if (timer) {
          clearTimeout(timer);
          timers.current.delete(notification.id);
        }

        // UI instant remove
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));

        // Stop sound
        soundManager.stopAll();

        // Broadcast to other tabs
        if (broadcastChannel.current) {
          broadcastChannel.current.postMessage({
            type: "NOTIFICATION_REMOVED",
            notificationId: notification.id
          });
        }

        // DB delete using dbId
        if (expertId && notification.dbId) {
          try {
            await deleteNotification(notification.dbId, expertId);
          } catch (err) {
            console.log("❌ DB delete failed", err);
          }
        }
      } catch (err) {
        console.log("❌ Delete notification failed", err);
      }
    },
    [expertId]
  );

  // ✅ Helper to get full notification from ref
  const getNotification = useCallback((id) => {
    return notificationsRef.current.find(n => n.id === id);
  }, []);

  /* =====================================================
     📞 CALL STATUS EVENTS
  ===================================================== */
  useEffect(() => {
    const handleMissed = ({ callId, status }) => {
      const notif = getNotification(callId);
      if (notif) {
        updateStatus(notif, status || "missed");
      }
    };

    const handleCancelled = ({ callId, status }) => {
      const notif = getNotification(callId);
      if (notif) {
        updateStatus(notif, status || "cancelled");
      }
    };

    const handleRejected = ({ callId, status }) => {
      const notif = getNotification(callId);
      if (notif) {
        updateStatus(notif, status || "rejected");
        
        // Broadcast to other tabs
        if (broadcastChannel.current) {
          broadcastChannel.current.postMessage({
            type: "CALL_REJECTED",
            callId
          });
        }
      }
    };

    const handleTaken = ({ callId }) => {
      const notif = getNotification(callId);
      if (notif) {
        removeById(notif);
        
        // Broadcast to other tabs
        if (broadcastChannel.current) {
          broadcastChannel.current.postMessage({
            type: "CALL_ACCEPTED",
            callId
          });
        }
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
        // Stop ringing sound when call is connected
        soundManager.stopAll();
        removeById(notif);
        
        // Broadcast to other tabs
        if (broadcastChannel.current) {
          broadcastChannel.current.postMessage({
            type: "CALL_ACCEPTED",
            callId
          });
        }
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
        // Stop ringing sound for final states
        soundManager.stopAll();
        
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
    socket.on("call:cancelled", handleCancelled);
    socket.on("call:rejected", handleRejected);
    socket.on("call:taken", handleTaken);
    socket.on("call:ended", handleEnded);
    socket.on("call:connected", handleConnected);

    return () => {
      socket.off("call:missed", handleMissed);
      socket.off("call:cancelled", handleCancelled);
      socket.off("call:rejected", handleRejected);
      socket.off("call:taken", handleTaken);
      socket.off("call:ended", handleEnded);
      socket.off("call:connected", handleConnected);
    };
  }, [getNotification, removeById]);

  /* =====================================================
     💬 CHAT STATUS EVENTS
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
     📜 LOAD HISTORY FROM DB (merge with live)
     OPTIMIZED: Prevent live notifications from being overwritten (MICRO OPTIMIZATION 3)
  ===================================================== */
  useEffect(() => {
    if (!expertId) return;

    const loadHistory = async () => {
      try {
        const res = await getNotifications({
          userId: expertId,
          panel: "expert",
        });

        // ✅ Smart ID mapping to prevent duplicates
        const mapped = (res.data || []).map((n) => {
          const meta = n.meta || {};
          // Use request_id or callId from meta as local ID, fallback to DB ID
          const localId = meta.request_id || meta.callId || n.id;

          return {
            id: localId,                    // Local ID for UI matching
            dbId: n.id,                      // DB ID for delete
            type: n.type,
            status: n.status || "missed",
            title: n.title,
            meta: n.message,
            unread: !n.is_read,
            payload: meta,
            createdAt: new Date(n.created_at).getTime(),
          };
        });

        // Merge with live notifications (MICRO OPTIMIZATION 3)
        setNotifications((prev) => {
          const liveMap = new Map(prev.map((n) => [n.id, n]));

          mapped.forEach((n) => {
            // ✅ Only add if not already in live notifications
            // This prevents live ringing from being overwritten by DB "missed"
            if (!liveMap.has(n.id)) {
              liveMap.set(n.id, n);
            } else {
              // Optional: Update DB fields without overwriting live status
              const existing = liveMap.get(n.id);
              if (existing && existing.status === "ringing") {
                // Keep live ringing, don't overwrite with DB missed
                return;
              }
              liveMap.set(n.id, { ...existing, ...n, unread: existing.unread });
            }
          });

          return Array.from(liveMap.values()).sort((a, b) => b.createdAt - a.createdAt);
        });

        // Clear localStorage if DB empty
        if (mapped.length === 0) {
          localStorage.removeItem(getStorageKey(expertId));
        }

        setHistoryLoaded(true);

      } catch (err) {
        console.log("❌ History load failed", err);
        setHistoryLoaded(true);
      }
    };

    loadHistory();
  }, [expertId]);

  /* ---------------------------------- ACCEPT / REJECT ---------------------------------- */
  const acceptNotification = useCallback((notification) => {
    if (!notification) return;

    if (notification.type === "voice_call") {
      soundManager.stopAll();
      
      // Broadcast to other tabs
      if (broadcastChannel.current) {
        broadcastChannel.current.postMessage({
          type: "CALL_ACCEPTED",
          callId: notification.payload.callId
        });
      }
      
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
      soundManager.stopAll();
      
      // Broadcast to other tabs
      if (broadcastChannel.current) {
        broadcastChannel.current.postMessage({
          type: "CALL_REJECTED",
          callId: notification.payload.callId
        });
      }
      
      socket.emit("call:reject", {
        callId: notification.payload.callId,
      });
    }

    removeById(notification);
  }, [removeById]);

  /* ---------------------------------- MARK AS READ ---------------------------------- */
  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, unread: false } : n
      )
    );
  }, []);

  /* ---------------------------------- MARK ALL AS READ ---------------------------------- */
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, unread: false }))
    );
  }, []);

  /* ---------------------------------- CLEAR ALL ---------------------------------- */
  const clearAll = useCallback(async () => {
    // Clear all timers
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    
    // Stop all sounds
    soundManager.stopAll();
    
    // Remove all from UI
    setNotifications([]);
    
    // Clear from localStorage
    if (expertId) {
      localStorage.removeItem(getStorageKey(expertId));
    }
    
    // TODO: Optionally delete from DB
  }, [expertId]);

  /* ---------------------------------- CONTEXT ---------------------------------- */
  const value = useMemo(() => ({
    notifications,
    unreadCount,
    chatUnreadCount,
    callUnreadCount,
    acceptNotification,
    rejectNotification,
    removeById,
    markAsRead,
    markAllAsRead,
    clearAll,
    historyLoaded,
  }), [
    notifications, 
    unreadCount, 
    chatUnreadCount, 
    callUnreadCount, 
    acceptNotification, 
    rejectNotification, 
    removeById,
    markAsRead,
    markAllAsRead,
    clearAll,
    historyLoaded
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useExpertNotifications() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useExpertNotifications must be used within provider");
  return ctx;
}