import { useEffect } from "react";

import { SOUNDS } from "../shared/services/sound/soundRegistry";
import { soundManager } from "../shared/services/sound/soundManager";
import { getMessagingClient } from "../shared/utils/lazyFirebase";

const getNotificationTag = (data = {}) => {
  if (data.tag) return data.tag;
  const type = String(data.type || "").toLowerCase();
  const conversationId = data.room_id || data.roomId || data.request_id || data.related_id || "default";
  const messageId = data.notification_id || data.id || "default";
  const callId = data.callId || data.call_id || data.related_id || "default";
  const postId = data.related_id || data.post_id || "default";
  const actorId = data.sender_id || "default";
  const commentId = data.comment_id || data.related_id || "default";
  const targetUserId = data.receiver_id || data.user_id || "default";

  if (type === "chat_message" || type === "chat_request") {
    return `chat:${conversationId}:${messageId}`;
  }
  if (type === "voice_call" || type === "incoming_call" || type === "video_call" || type === "video-call" || type === "missed_call") {
    return `call:${callId}`;
  }
  if (type === "like") {
    return `like:${postId}:${actorId}`;
  }
  if (type === "comment") {
    return `comment:${commentId}`;
  }
  if (type === "follow") {
    return `follow:${actorId}:${targetUserId}`;
  }
  return `${type}_${data.id || Date.now()}`;
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

        if (type === "voice_call" || type === "incoming_call" || type === "video_call" || type === "video-call") {
          if (window.__expertNotificationProviderActive) return;

          soundManager.play(SOUNDS.INCOMING_CALL, { loop: true, volume: 1 });
          window.setTimeout(() => soundManager.stopAll(), 30000);

          if (Notification.permission === "granted") {
            const registration = await navigator.serviceWorker.ready;
            const isVideo = type === "video_call" || type === "video-call";
            registration.showNotification(title || (isVideo ? "Incoming Video Call" : "Incoming Call"), {
              body: body || (isVideo ? "User is video calling you" : "User is calling you"),
              icon: "/logo-192.png",
              badge: "/logo-192.png",
              data: {
                ...payload.data,
                target_url: payload.data?.target_url || payload.data?.url || payload.data?.click_action || "/expert/home",
                url: payload.data?.target_url || payload.data?.url || payload.data?.click_action || "/expert/home",
                click_action: payload.data?.target_url || payload.data?.url || payload.data?.click_action || "/expert/home",
              },
              requireInteraction: true,
              renotify: true,
              tag,
              vibrate: [200, 100, 200, 100, 400],
            });
          }

          window.dispatchEvent(new CustomEvent("incoming_call", { detail: payload.data }));
          return;
        }

        if (type === "call_attempt") {
          const { user_name, userId, expertId: targetExpertId } = payload.data;

          if (expertId && targetExpertId && Number(targetExpertId) === Number(expertId)) {
            const safeName = user_name || `User #${userId}`;
            soundManager.play(SOUNDS.NOTIFICATION);

            if (Notification.permission === "granted") {
              const registration = await navigator.serviceWorker.ready;
              registration.showNotification(title || "Missed Opportunity", {
                body: body || `${safeName} tried to call you`,
                icon: "/logo-192.png",
                badge: "/logo-192.png",
                data: payload.data,
                requireInteraction: true,
                tag,
              });
            }

            if (setNotifications) {
              setNotifications((prev) => [
                {
                  id: Date.now(),
                  type: "call_attempt",
                  status: "info",
                  title: `${safeName} tried to call you`,
                  meta: "You were offline",
                  unread: true,
                  createdAt: Date.now(),
                  data: payload.data,
                },
                ...prev,
              ]);
            }

            if (channel) {
              channel.postMessage({
                type: "call_attempt",
                data: payload.data,
              });
            }
          }

          return;
        }

        if (type === "expert_online") {
          const { expertId: onlineExpertId } = payload.data;

          if (!expertId) {
            soundManager.play(SOUNDS.NOTIFICATION);

            if (Notification.permission === "granted") {
              const registration = await navigator.serviceWorker.ready;
              registration.showNotification(title || "Expert Available", {
                body: body || "An expert you were waiting for is now online",
                icon: "/logo-192.png",
                badge: "/logo-192.png",
                data: payload.data,
                requireInteraction: true,
                tag,
              });
            }

            if (setNotifications) {
              setNotifications((prev) => [
                {
                  id: Date.now(),
                  type: "expert_online",
                  status: "success",
                  title: title || "Expert Available",
                  message: body || "An expert you were waiting for is now online",
                  unread: true,
                  createdAt: Date.now(),
                  data: payload.data,
                },
                ...prev,
              ]);
            }

            if (channel) {
              channel.postMessage({
                type: "expert_online",
                data: payload.data,
              });
            }
          }

          return;
        }

        if (type === "call_rejected") {
          const { callId } = payload.data;

          if (!expertId) {
            soundManager.play(SOUNDS.NOTIFICATION);

            if (Notification.permission === "granted") {
              const registration = await navigator.serviceWorker.ready;
              registration.showNotification(title || "Call Rejected", {
                body: body || "Your call was rejected",
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
                  type: "call_rejected",
                  status: "error",
                  title: title || "Call Rejected",
                  message: body || "Your call was rejected",
                  unread: true,
                  createdAt: Date.now(),
                  data: payload.data,
                },
                ...prev,
              ]);
            }

            if (channel) {
              channel.postMessage({
                type: "call_rejected",
                data: payload.data,
              });
            }
          }

          return;
        }

        if (type === "missed_call") {
          const { callId, userId, user_name } = payload.data;

          if (expertId) {
            const safeName = user_name || `User #${userId}`;
            soundManager.play(SOUNDS.NOTIFICATION);

            if (Notification.permission === "granted") {
              const registration = await navigator.serviceWorker.ready;
              registration.showNotification(title || "Missed Call", {
                body: body || `${safeName} tried to call you but you missed it`,
                icon: "/logo-192.png",
                badge: "/logo-192.png",
                data: payload.data,
                requireInteraction: true,
                tag,
              });
            }

            if (setNotifications) {
              setNotifications((prev) => [
                {
                  id: Date.now(),
                  type: "missed_call",
                  status: "warning",
                  title: title || "Missed Call",
                  message: body || `${safeName} tried to call you`,
                  unread: true,
                  createdAt: Date.now(),
                  data: payload.data,
                },
                ...prev,
              ]);
            }

            if (channel) {
              channel.postMessage({
                type: "missed_call",
                data: payload.data,
              });
            }
          }

          return;
        }

        if (
          type === "chat_request" ||
          type === "chat_rejected" ||
          type === "chat_timeout" ||
          type === "chat_cancelled" ||
          type === "chat_accepted"
        ) {
          soundManager.play(SOUNDS.NOTIFICATION);

          if (Notification.permission === "granted") {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification(title, {
              body,
              icon: "/logo-192.png",
              badge: "/logo-192.png",
              requireInteraction: true,
              tag,
              data: payload.data,
            });
          }

          if (setNotifications) {
            let status = "info";
            if (type.includes("rejected") || type.includes("cancelled")) status = "error";
            if (type.includes("accepted")) status = "success";
            if (type.includes("timeout")) status = "warning";

            setNotifications((prev) => [
              {
                id: Date.now(),
                type,
                status,
                title,
                message: body,
                unread: true,
                createdAt: Date.now(),
                data: payload.data,
              },
              ...prev,
            ]);
          }

          if (channel) {
            channel.postMessage({
              type,
              data: payload.data,
            });
          }
        }

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
