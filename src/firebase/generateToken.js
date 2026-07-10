import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

import expertApi from "../shared/api/expertapi/axiosInstance";
import userApi from "../shared/api/userApi/axiosInstance";
import { getMessagingClient } from "../shared/utils/lazyFirebase";

const VAPID_KEY =
  "BCDEGMMYpD9F3BqYGjhkJvKvI_bd2kGVrmO6pProsTxPLLzRED3jqgHN_hr_6UeGLH4yX49mnwsRYt8cZicH030";

export const generateToken = async (role) => {
  try {
    const api = role === "expert" ? expertApi : userApi;
    const storageKey = role === "expert" ? "expertFcmToken" : "userFcmToken";
    const ownerKey = `${storageKey}:owner`;
    const getAccountId = () => {
      try {
        if (role === "expert") {
          const session = JSON.parse(localStorage.getItem("expert_session") || "{}");
          return session.expertId || session.expert_id || session.id || "";
        }
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user.id || user.user_id || "";
      } catch {
        return "";
      }
    };

    /* ================= ANDROID / NATIVE ================= */
    if (Capacitor.isNativePlatform()) {
      await PushNotifications.createChannel({
        id: "default",
        name: "Default Notifications",
        importance: 5,
        visibility: 1,
      });

      let perm = await PushNotifications.checkPermissions();

      if (perm.receive !== "granted") {
        perm = await PushNotifications.requestPermissions();
      }

      if (perm.receive !== "granted") {
        console.log("Notification permission denied");
        return;
      }

      return new Promise((resolve) => {
        PushNotifications.addListener("registration", async (token) => {
          try {
            console.log("ANDROID FCM:", token.value);

            const existingToken = localStorage.getItem(storageKey);
            const existingOwner = localStorage.getItem(ownerKey);
            const accountId = String(getAccountId() || "");

            if (existingToken === token.value && existingOwner === accountId) {
              resolve();
              return;
            }

            await api.post(`/fcm/${role}/save-token`, {
              token: token.value,
              deviceType: "android",
              deviceId: "android-device",
            });

            localStorage.setItem(storageKey, token.value);
            localStorage.setItem(ownerKey, accountId);

            console.log("Android FCM token saved");
            resolve();
          } catch (err) {
            console.error("Android FCM save failed:", err);
            resolve();
          }
        });

        PushNotifications.addListener("registrationError", (err) => {
          console.error("Push registration error:", err);
          resolve();
        });

        PushNotifications.register();
      });
    }

    /* ================= WEB ================= */
    if (!("Notification" in window)) return;
    if (Notification.permission === "denied") return;

    const permission =
      Notification.permission === "granted"
        ? "granted"
        : await Notification.requestPermission();

    if (permission !== "granted") return;

    const firebase = await getMessagingClient();
    if (!firebase?.messaging) return;

    const registration = await navigator.serviceWorker.ready;

    const token = await firebase.getToken(firebase.messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) return;

    const existingToken = localStorage.getItem(storageKey);
    const existingOwner = localStorage.getItem(ownerKey);
    const accountId = String(getAccountId() || "");

    if (existingToken === token && existingOwner === accountId) return;

    await api.post(`/fcm/${role}/save-token`, {
      token,
      deviceType: "web",
    });

    localStorage.setItem(storageKey, token);
    localStorage.setItem(ownerKey, accountId);

    console.log("Web FCM token saved");
  } catch (error) {
    console.error(`${role} FCM error:`, error);
  }
};
