import { useEffect } from "react";

import { SOUNDS } from "../shared/services/sound/soundRegistry";
import { soundManager } from "../shared/services/sound/soundManager";
import { getMessagingClient } from "../shared/utils/lazyFirebase";

const getNotificationTag = (data = {}) => {
  // ... (same as original)
};

const useFCM = (openCallPopup, expertId = null, setNotifications = null) => {
  useEffect(() => {
    let channel;
    let unsubscribe = () => {};
    let isActive = true;

    const bootstrapMessaging = async () => {
      const firebase = await getMessagingClient().catch(() => null);
      if (!firebase?.messaging || !isActive) return;

      if ("BroadcastChannel" in window) {
        channel = new BroadcastChannel("call_channel");
      }

      unsubscribe = firebase.onMessage(firebase.messaging, async (payload) => {
        if (!isActive) return;

        console.log("FCM FULL PAYLOAD:", payload);
        console.log("Current expertId:", expertId);

        const type = String(payload.data?.type || "").toLowerCase();
        const title = payload.data?.title || "Notification";
        const body = payload.data?.body || "";
        const tag = getNotificationTag(payload.data);

        // Suppress notifications/sounds if receiver is viewing the active chat thread
        const roomId = payload.data?.room_id || payload.data?.roomId;
        if (type === "chat_message" && roomId && window.location.pathname.includes(`/chat/${roomId}`)) {
          console.log("Receiver is viewing the active chat thread, skipping foreground notification");
          return;
        }

        // Deduplicate: check if a notification with this tag is already visible
        if (Notification.permission === "granted") {
          const registration = await navigator.serviceWorker.ready;
          const existing = await registration.getNotifications({ tag });
          if (existing.length > 0) {
            console.log(`Notification with tag ${tag} already visible, skipping foreground show`);
            return;
          }
        }

        // ✅ NEW: Terminal chat states – skip adding a new notification
        const terminalChatStates = new Set([
          "chat_cancelled",
          "chat_rejected",
          "chat_timeout",
          "chat_ended",
          "chat_missed"
        ]);

        if (terminalChatStates.has(type)) {
          console.log(`FCM: Terminal chat state (${type}), skipping to avoid duplicate`);
          return; // ✅ Do nothing – socket listener already updates the existing notification
        }

        // --- rest of the original code (unchanged) ---

        if (type === "voice_call" || type === "incoming_call" || type === "video_call" || type === "video-call") {
          // ... same as original
          return;
        }

        if (type === "call_attempt") {
          // ... same as original
          return;
        }

        if (type === "expert_online") {
          // ... same as original
          return;
        }

        if (type === "call_rejected") {
          // ... same as original
          return;
        }

        if (type === "missed_call") {
          // ... same as original
          return;
        }

        if (
          type === "chat_request" ||
          type === "chat_rejected" ||
          type === "chat_timeout" ||
          type === "chat_cancelled" ||
          type === "chat_accepted"
        ) {
          // Foreground FCM payload: Socket.IO handles in-app notifications and sound.
          // Suppress duplicate system OS notification popup and duplicate state insertions.
          console.log("🔕 [useFCM] Foreground FCM payload received. Socket.IO manages in-app alerts.");

          if (channel) {
            channel.postMessage({
              type,
              data: payload.data,
            });
          }
          return;
        }

        // Generic notification for other types
        if (
          type &&
          ![
            "voice_call",
            "incoming_call",
            "call_attempt",
            "expert_online",
            "call_rejected",
            "missed_call",
            "chat_request",
            "chat_rejected",
            "chat_timeout",
            "chat_cancelled",
            "chat_accepted",
          ].includes(type)
        ) {
          soundManager.play(SOUNDS.NOTIFICATION);

          if (Notification.permission === "granted") {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification(title, {
              body,
              icon: "/logo-192.png",
              badge: "/logo-192.png",
              data: payload.data,
              tag,
            });
          }

          if (setNotifications) {
            setNotifications((prev) => [
              {
                id: Date.now(),
                type: type || "notification",
                status: "info",
                title,
                message: body,
                unread: true,
                createdAt: Date.now(),
                data: payload.data,
              },
              ...prev,
            ]);
          }
        }
      });

      if (channel) {
        channel.onmessage = (event) => {
          console.log("Broadcast channel message:", event.data);

          if (event.data.type === "call_attempt" && setNotifications) {
            const { user_name, userId } = event.data.data;
            const safeName = user_name || `User #${userId}`;

            setNotifications((prev) => [
              {
                id: Date.now(),
                type: "call_attempt",
                status: "info",
                title: `${safeName} tried to call you`,
                meta: "You were offline",
                unread: true,
                createdAt: Date.now(),
                data: event.data.data,
              },
              ...prev,
            ]);
          }
        };
      }
    };

    bootstrapMessaging();

    return () => {
      isActive = false;
      unsubscribe();
      if (channel) channel.close();
    };
  }, [openCallPopup, expertId, setNotifications]);
};

export default useFCM;