import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../firebase/firebase";
import { soundManager } from "../shared/services/sound/soundManager";
import { SOUNDS } from "../shared/services/sound/soundRegistry";

const useFCM = (openCallPopup, expertId = null, setNotifications = null) => {

  useEffect(() => {

    if (!messaging) return;

    let channel;

    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel("call_channel");
    }

    const unsubscribe = onMessage(messaging, async (payload) => {

      console.log("🔔 FCM FULL PAYLOAD:", payload);
      console.log("🔔 Current expertId:", expertId);

      const type = payload.data?.type;
      const title = payload.data?.title || "Notification";
      const body = payload.data?.body || "";

      /* ================= 🚫 IGNORE REAL CALL ================= */
      if (type === "voice_call") {
        console.log("Voice call handled by socket");
        return;
      }

      /* ================= 📞 CALL ATTEMPT ================= */
      if (type === "call_attempt") {
        console.log("📞 CALL ATTEMPT received");

        const { user_name, userId, expertId: targetExpertId } = payload.data;
        
        // Check if this is for current expert
        if (expertId && targetExpertId && Number(targetExpertId) === Number(expertId)) {
          console.log(`✅ Call attempt for expert ${expertId} from user ${userId}`);

          const safeName = user_name || `User #${userId}`;

          // Play notification sound
          soundManager.play(SOUNDS.NOTIFICATION);

          // Show browser notification
          if (Notification.permission === "granted") {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification(title || "Missed Opportunity 📞", {
              body: body || `${safeName} tried to call you`,
              icon: "/logo-192.png",
              badge: "/logo-192.png",
              data: payload.data,
              requireInteraction: true,
              tag: `call_attempt_${userId}_${Date.now()}`
            });
          }

          // Update in-app notifications if setNotifications provided
          if (setNotifications) {
            setNotifications(prev => [
              {
                id: Date.now(),
                type: "call_attempt",
                status: "info",
                title: `${safeName} tried to call you`,
                meta: "You were offline",
                unread: true,
                createdAt: Date.now(),
                data: payload.data
              },
              ...prev,
            ]);
          }

          // Broadcast to other tabs if channel exists
          if (channel) {
            channel.postMessage({
              type: "call_attempt",
              data: payload.data
            });
          }
        } else {
          console.log(`⏭️ Ignoring call attempt for different expert: ${targetExpertId}`);
        }
        return;
      }

      /* ================= 🟢 EXPERT ONLINE ================= */
      if (type === "expert_online") {
        console.log("🟢 EXPERT ONLINE notification received");

        const { expertId: onlineExpertId } = payload.data;
        
        // Only show if it's for the current user (as user)
        if (!expertId) { // If no expertId prop, assume this is user side
          soundManager.play(SOUNDS.NOTIFICATION);

          if (Notification.permission === "granted") {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification(title || "Expert Available ✅", {
              body: body || "An expert you were waiting for is now online",
              icon: "/logo-192.png",
              badge: "/logo-192.png",
              data: payload.data,
              requireInteraction: true,
              tag: `expert_online_${onlineExpertId}`
            });
          }

          // Update in-app notifications for user
          if (setNotifications) {
            setNotifications(prev => [
              {
                id: Date.now(),
                type: "expert_online",
                status: "success",
                title: title || "Expert Available ✅",
                message: body || "An expert you were waiting for is now online",
                unread: true,
                createdAt: Date.now(),
                data: payload.data
              },
              ...prev,
            ]);
          }

          if (channel) {
            channel.postMessage({
              type: "expert_online",
              data: payload.data
            });
          }
        }
        return;
      }

      /* ================= ❌ CALL REJECTED ================= */
      if (type === "call_rejected") {
        console.log("❌ CALL REJECTED received");

        const { callId, expertId: rejectingExpertId } = payload.data;

        // This is for user side
        if (!expertId) {
          soundManager.play(SOUNDS.NOTIFICATION);

          if (Notification.permission === "granted") {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification(title || "Call Rejected ❌", {
              body: body || "Your call was rejected",
              icon: "/logo-192.png",
              badge: "/logo-192.png",
              data: payload.data,
              tag: `call_rejected_${callId}`
            });
          }

          if (setNotifications) {
            setNotifications(prev => [
              {
                id: Date.now(),
                type: "call_rejected",
                status: "error",
                title: title || "Call Rejected ❌",
                message: body || "Your call was rejected",
                unread: true,
                createdAt: Date.now(),
                data: payload.data
              },
              ...prev,
            ]);
          }

          if (channel) {
            channel.postMessage({
              type: "call_rejected",
              data: payload.data
            });
          }
        }
        return;
      }

      /* ================= 📵 MISSED CALL ================= */
      if (type === "missed_call") {
        console.log("📵 MISSED CALL received");

        const { callId, userId, user_name } = payload.data;

        // Check if this is for current expert
        if (expertId) {
          const safeName = user_name || `User #${userId}`;

          soundManager.play(SOUNDS.NOTIFICATION);

          if (Notification.permission === "granted") {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification(title || "Missed Call 📵", {
              body: body || `${safeName} tried to call you but you missed it`,
              icon: "/logo-192.png",
              badge: "/logo-192.png",
              data: payload.data,
              requireInteraction: true,
              tag: `missed_call_${callId}`
            });
          }

          if (setNotifications) {
            setNotifications(prev => [
              {
                id: Date.now(),
                type: "missed_call",
                status: "warning",
                title: title || "Missed Call 📵",
                message: body || `${safeName} tried to call you`,
                unread: true,
                createdAt: Date.now(),
                data: payload.data
              },
              ...prev,
            ]);
          }

          if (channel) {
            channel.postMessage({
              type: "missed_call",
              data: payload.data
            });
          }
        }
        return;
      }

      /* ================= 💬 CHAT / GENERAL ================= */
      if (
        type === "chat_request" ||
        type === "chat_rejected" ||
        type === "chat_timeout" ||
        type === "chat_cancelled" ||
        type === "chat_accepted"
      ) {
        console.log(`💬 CHAT notification: ${type}`);

        soundManager.play(SOUNDS.NOTIFICATION);

        if (Notification.permission === "granted") {
          const registration = await navigator.serviceWorker.ready;

          const tag =
            payload.data?.request_id ||
            payload.data?.callId ||
            payload.data?.type;

          registration.showNotification(title, {
            body,
            icon: "/logo-192.png",
            badge: "/logo-192.png",
            requireInteraction: true,
            tag,
            data: payload.data
          });
        }

        // Update in-app notifications if setNotifications provided
        if (setNotifications) {
          let status = "info";
          if (type.includes("rejected") || type.includes("cancelled")) status = "error";
          if (type.includes("accepted")) status = "success";
          if (type.includes("timeout")) status = "warning";

          setNotifications(prev => [
            {
              id: Date.now(),
              type,
              status,
              title,
              message: body,
              unread: true,
              createdAt: Date.now(),
              data: payload.data
            },
            ...prev,
          ]);
        }

        if (channel) {
          channel.postMessage({
            type,
            data: payload.data
          });
        }
      }

      /* ================= 🔔 DEFAULT NOTIFICATION ================= */
      if (type && ![
        "voice_call",
        "call_attempt",
        "expert_online",
        "call_rejected",
        "missed_call",
        "chat_request",
        "chat_rejected",
        "chat_timeout",
        "chat_cancelled",
        "chat_accepted"
      ].includes(type)) {
        console.log("🔔 Default notification type:", type);

        soundManager.play(SOUNDS.NOTIFICATION);

        if (Notification.permission === "granted") {
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification(title, {
            body,
            icon: "/logo-192.png",
            badge: "/logo-192.png",
            data: payload.data,
            tag: `notification_${Date.now()}`
          });
        }

        if (setNotifications) {
          setNotifications(prev => [
            {
              id: Date.now(),
              type: type || "notification",
              status: "info",
              title,
              message: body,
              unread: true,
              createdAt: Date.now(),
              data: payload.data
            },
            ...prev,
          ]);
        }
      }
    });

    // Listen for broadcast channel messages from other tabs
    if (channel) {
      channel.onmessage = (event) => {
        console.log("📡 Broadcast channel message:", event.data);
        
        if (event.data.type === "call_attempt" && setNotifications) {
          const { user_name, userId } = event.data.data;
          const safeName = user_name || `User #${userId}`;
          
          setNotifications(prev => [
            {
              id: Date.now(),
              type: "call_attempt",
              status: "info",
              title: `${safeName} tried to call you`,
              meta: "You were offline",
              unread: true,
              createdAt: Date.now(),
              data: event.data.data
            },
            ...prev,
          ]);
        }
      };
    }

    return () => {
      unsubscribe();
      if (channel) channel.close();
    };

  }, [openCallPopup, expertId, setNotifications]);

};

export default useFCM;