/* ================= FIREBASE IMPORTS ================= */

importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

/* ================= WORKBOX IMPORTS ================= */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js");

// Disable Workbox logs in production
self.__WB_DISABLE_DEV_LOGS = true;

/* ================= IMMEDIATE ACTIVATION (CRITICAL) ================= */
// ⚡ BOTH are required for instant updates
workbox.core.skipWaiting();      // Forces waiting SW to activate
workbox.core.clientsClaim();      // Takes control of all clients immediately

/* ================= CACHE VERSIONING ================= */

const IMAGE_CACHE = 'images-cache-v2';
const API_CACHE = 'api-cache-v2';
const STATIC_CACHE = 'static-cache-v2';
const PRECACHE_VERSION = 'v2';  // ⚡ Increment on every deploy (v1 → v2 → v3)

/* ================= PRECACHING (NO DUPLICATION) ================= */
// ⚡ Only cache index.html, not root (prevents duplicate cache entries)

workbox.precaching.precacheAndRoute([
  { url: '/index.html', revision: PRECACHE_VERSION },
  { url: '/logo-192.png', revision: PRECACHE_VERSION },
  { url: '/logo-512.png', revision: PRECACHE_VERSION },
  { url: '/manifest.json', revision: PRECACHE_VERSION },
]);

/* ================= FIREBASE INITIALIZATION ================= */

firebase.initializeApp({
  apiKey: "AIzaSyDSP...",            // Replace with your full key
  authDomain: "expert-yard-f2d19.firebaseapp.com",
  projectId: "expert-yard-f2d19",
  storageBucket: "expert-yard-f2d19.firebasestorage.app",
  messagingSenderId: "172378612980",
  appId: "1:172378612980:web:2550393e0c0e155d76aaa1"
});

const messaging = firebase.messaging();

/* ================= BACKGROUND MESSAGE HANDLER ================= */

messaging.onBackgroundMessage(async (payload) => {
  const type = payload.data?.type;
  const title = payload.data?.title || "Notification";
  const body = payload.data?.body || "";
  const tag =
    payload.data?.request_id ||
    payload.data?.callId ||
    payload.data?.type;

  // Avoid duplicate notifications using tag
  const existing = await self.registration.getNotifications({ tag });
  if (existing.length > 0) return;

  // Ignore voice call notifications (handled by your app UI)
  if (type === "voice_call") return;

  self.registration.showNotification(title, {
    body,
    icon: "/logo-192.png",
    badge: "/logo-192.png",
    tag,
    data: payload.data
  });
});

/* ================= NOTIFICATION CLICK HANDLER ================= */

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification?.data || {};
  const url = data.url || data.click_action || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            client.navigate(url);
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});

/* ================= SMART CACHE CLEANUP ON ACTIVATE ================= */
// ⚡ Never delete Workbox precache (regardless of version naming)

self.addEventListener('activate', (event) => {
  const keepCaches = [IMAGE_CACHE, API_CACHE, STATIC_CACHE];

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          // ⚡ CRITICAL: Keep ANY cache that includes 'workbox-precache'
          if (!keepCaches.includes(key) && !key.includes('workbox-precache')) {
            console.log(`[SW] Deleting old cache: ${key}`);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

/* ================= WORKBOX CACHING STRATEGIES ================= */

// ---------- IMAGES (StaleWhileRevalidate + Expiration) ----------
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: IMAGE_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// ---------- API CALLS (NetworkFirst – ONLY /api/* endpoints) ----------
// ⚡ Supports both same-origin AND custom domain
workbox.routing.registerRoute(
  ({ url }) =>
    (url.origin === self.location.origin || url.hostname.includes("softmaxs.com")) &&
    url.pathname.startsWith("/api"),
  new workbox.strategies.NetworkFirst({
    cacheName: API_CACHE,
    networkTimeoutSeconds: 5,  // ⚡ 5 seconds for weak networks
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// ---------- STATIC FILES (JS, CSS, HTML) – exclude dev files ----------
workbox.routing.registerRoute(
  ({ request, url }) => {
    // Ignore development files (Vite, source maps, etc.)
    if (
      url.pathname.startsWith('/src') ||
      url.pathname.startsWith('/@vite') ||
      url.pathname.startsWith('/node_modules')
    ) {
      return false;
    }
    return (
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'document'
    );
  },
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: STATIC_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);

/* ================= NAVIGATION ROUTE FIX (REACT ROUTER) ================= */
// ⚡ Whitelist navigation, exclude API & dev routes

workbox.routing.registerRoute(
  new workbox.routing.NavigationRoute(
    workbox.precaching.createHandlerBoundToURL('/index.html'),
    {
      denylist: [
        /^\/api/,
        /^\/_vite/,
        /^\/src/,
        /^\/node_modules/,
        /.*\.(?:js|css|png|jpg|jpeg|svg)$/
      ],
    }
  )
);
/* ================= STRONG OFFLINE FALLBACKS ================= */
// ⚡ Handles missing cache scenarios gracefully

workbox.routing.setCatchHandler(async ({ event }) => {
  // Fallback for images: try cache first, then use default
  if (event.request.destination === 'image') {
    const cachedFallback = await caches.match('/logo-192.png');
    return cachedFallback || Response.error();
  }

  // Fallback for navigation requests: serve the app shell (index.html)
  if (event.request.mode === 'navigate') {
    const cachedIndex = await caches.match('/index.html');
    return cachedIndex || Response.error();
  }

  // For everything else, return a generic error
  return Response.error();
});