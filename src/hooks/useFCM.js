import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../firebase/firebase";
import { soundManager } from "../shared/services/sound/soundManager";
import { SOUNDS } from "../shared/services/sound/soundRegistry";

const useFCM = (openCallPopup) => {

  useEffect(() => {

    if (!messaging) return;

    let channel;

    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel("call_channel");
    }

    const unsubscribe = onMessage(messaging, async (payload) => {

      console.log("🔔 FCM FULL PAYLOAD:", payload);

      const type = payload.data?.type;
      const title = payload.data?.title || "Notification";
      const body = payload.data?.body || "";

      /* ================= CALL ================= */

      if (type === "VOICE_CALL") {

        openCallPopup(payload.data);

        if (channel) {
          channel.postMessage(payload.data);
        }

        return;
      }

      /* ================= CHAT ================= */

      if (
        type === "CHAT_REQUEST" ||
        type === "CHAT_REJECTED" ||
        type === "CHAT_TIMEOUT"
      ) {

        soundManager.play(SOUNDS.NOTIFICATION);

       if (Notification.permission === "granted") {

  const registration = await navigator.serviceWorker.ready;

  registration.showNotification(title, {
    body,
    icon: "/logo-192.png",
    requireInteraction: true,
    tag: payload.data?.request_id,
    data: payload.data
  });

}
      }

    });

    return () => {
      unsubscribe();
      if (channel) channel.close();
    };

  }, [openCallPopup]);

};

export default useFCM;