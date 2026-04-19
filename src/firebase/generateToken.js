import expertApi from "../shared/api/expertapi/axiosInstance";
import userApi from "../shared/api/userApi/axiosInstance";
import { getMessagingClient } from "../shared/utils/lazyFirebase";

const VAPID_KEY =
  "BNIOigy0BfLG3gvoS4-MbUCVaSQG9DmTuKNjuGNTr8BwOf1zDoeemF4PgcbMSq7VZ24R8uN-EqK7tNId1KbwxyU";

export const generateToken = async (role) => {
  try {
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

    const storageKey = role === "expert" ? "expertFcmToken" : "userFcmToken";
    const existingToken = localStorage.getItem(storageKey);
    if (existingToken === token) return;

    const api = role === "expert" ? expertApi : userApi;
    await api.post(`/fcm/${role}/save-token`, {
      token,
      deviceType: "web",
    });

    localStorage.setItem(storageKey, token);
  } catch (error) {
    console.error(`${role} FCM error:`, error);
  }
};
