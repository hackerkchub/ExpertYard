importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDSPw3lTarBu6X0rTqM8KLNVh7Av6XgKXI",
  authDomain: "expert-yard-f2d19.firebaseapp.com",
  projectId: "expert-yard-f2d19",
  storageBucket: "expert-yard-f2d19.firebasestorage.app",
  messagingSenderId: "172378612980",
  appId: "1:172378612980:web:2550393e0c0e155d76aaa1",
  measurementId: "G-2XTQD0S6XD"
});

const messaging = firebase.messaging();

/* ================= BACKGROUND MESSAGE ================= */

messaging.onBackgroundMessage(async (payload) => {

  console.log("📩 Background FCM:", payload);

  const type = payload.data?.type;

  const title = payload.data?.title || "Notification";
  const body = payload.data?.body || "";

  const tag =
    payload.data?.request_id ||
    payload.data?.callId ||
    payload.data?.type;

  const existing = await self.registration.getNotifications({ tag });

if (existing.length > 0) return;
// ❌ DO NOT show popup for real call
if (type === "voice_call") return;

// ✅ show for everything else
self.registration.showNotification(title, {
  body,
  icon: "/logo-192.png",
  badge: "/logo-192.png",
  tag,
  data: payload.data
});
});



/* ================= NOTIFICATION CLICK ================= */

self.addEventListener("notificationclick", (event) => {

  event.notification.close();

  const data = event.notification?.data || {};

  const url =
    data.url ||
    data.click_action ||
    "/";

  event.waitUntil(

    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {

        for (const client of clientList) {

          if (client.url.includes(self.location.origin) && "focus" in client) {

            client.navigate(url);
            return client.focus();

          }

        }

        return clients.openWindow(url);

      })

  );

});