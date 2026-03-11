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

messaging.onBackgroundMessage(async (payload) => {

  const type = payload.data?.type;

  // if (type === "VOICE_CALL") return;

  const title = payload.data?.title;
  const body = payload.data?.body;

  const tag = payload.data?.request_id || payload.data?.type;

  /* 🔴 duplicate prevention */
  const existing = await self.registration.getNotifications({ tag });

  if (existing.length > 0) return;

  self.registration.showNotification(title, {
    body,
    icon: "/logo-192.png",
    badge: "/logo-192.png",
    tag,
    data: payload.data
  });

});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url =
    event.notification?.data?.click_action ||
    event.notification?.data?.url;

   event.waitUntil(
    clients.openWindow(url)
  );
});