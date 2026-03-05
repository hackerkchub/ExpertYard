import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

import expertApi from "../shared/api/expertapi/axiosInstance";
import userApi from "../shared/api/userApi/axiosInstance";

const VAPID_KEY =
  "BNIOigy0BfLG3gvoS4-MbUCVaSQG9DmTuKNjuGNTr8BwOf1zDoeemF4PgcbMSq7VZ24R8uN-EqK7tNId1KbwxyU";

export const generateToken = async (role) => {
  try {
    if (!messaging) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (!token) return;

    console.log(`Generated ${role} FCM token:`, token);

    const storageKey =
      role === "expert" ? "expertFcmToken" : "userFcmToken";

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