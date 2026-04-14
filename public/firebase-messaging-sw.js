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

/* ================= ADDED CACHE & FETCH LOGIC ================= */

const CACHE_NAME = "expert-yard-v1";
const API_CACHE = "api-cache-v1";

/* ================= INSTALL ================= */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/logo-192.png",
        "/logo-512.png"
      ]);
    })
  );
  // Force waiting service worker to become active
  self.skipWaiting();
});

/* ================= ACTIVATE ================= */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

/* ================= FETCH (MAIN FIX) ================= */

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // 👉 IMAGE CACHE (TOP PRIORITY - handled first)
  if (event.request.destination === "image") {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;

        return fetch(event.request)
          .then((res) => {
            // Allow opaque responses as well
            if (res && (res.status === 200 || res.type === "opaque")) {
              const clone = res.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, clone);
              });
            }
            return res;
          })
          .catch(() => {
            return new Response("", { status: 404 });
          });
      })
    );
    return;
  }

  // 👉 API caching for softmaxs.com domain (only pure API calls, not images)
  if (
    url.hostname.includes("softmaxs.com") && 
    event.request.destination === ""
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const networkFetch = fetch(event.request)
          .then((res) => {
            // Allow opaque responses as well
            if (res && (res.status === 200 || res.type === "opaque")) {
              const clone = res.clone();
              caches.open(API_CACHE).then((cache) => {
                cache.put(event.request, clone);
              });
            }
            return res;
          })
          .catch(() => cached);

        return cached || networkFetch;
      })
    );
    return;
  }

  // 👉 Static files caching (HTML, CSS, JS, fonts, etc.)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      
      return fetch(event.request)
        .then((response) => {
          // Cache valid responses for static assets (allow opaque)
          if (response && (response.status === 200 || response.type === "opaque")) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to index.html for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline content not available', {
            status: 404,
            statusText: 'Not Found'
          });
        });
    })
  );
});