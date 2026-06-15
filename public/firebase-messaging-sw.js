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
  apiKey: "AIzaSyDSPw3lTarBu6X0rTqM8KLNVh7Av6XgKXI",
  authDomain: "expert-yard-f2d19.firebaseapp.com",
  projectId: "expert-yard-f2d19",
  storageBucket: "expert-yard-f2d19.firebasestorage.app",
  messagingSenderId: "172378612980",
  appId: "1:172378612980:web:2550393e0c0e155d76aaa1"
});

const messaging = firebase.messaging();

const normalizePayload = (payload = {}) => {
  const data = {
    ...(payload.data || {}),
    ...(payload.notification || {}),
  };

  if (!data.title) data.title = payload.title || "Notification";
  if (!data.body) data.body = payload.body || "";
  if (!data.type) data.type = "generic";

  return data;
};

const getNotificationUrl = (data = {}) => {
  if (data.target_url) return data.target_url;
  if (data.url) return data.url;
  if (data.click_action) return data.click_action;

  const type = String(data.type || "").toLowerCase();

  if (data.receiver_role === "expert") {
    if (type === "follow" || type === "like" || type === "comment") {
      return "/expert/notifications";
    }

    const chatRoomId = data.request_id || data.chat_id || data.room_id || data.related_id;
    if ((type.includes("chat") || type === "chat_request") && chatRoomId) {
      if (type === "chat_request") {
        return `/expert/home?from_notification=1&request_id=${encodeURIComponent(chatRoomId)}`;
      }
      return `/expert/chat/${encodeURIComponent(chatRoomId)}`;
    }

    const voiceCallId = data.callId || data.call_id || data.related_id;
    if ((type.includes("call") || type === "voice_call" || type === "incoming_call") && voiceCallId) {
      if (type === "missed_call" || type === "call_rejected" || type === "call_cancelled" || type === "call_ended") {
        return "/expert/notifications";
      }
      return `/expert/voice-call/${encodeURIComponent(voiceCallId)}`;
    }

    return "/expert/notifications";
  }

  if (data.receiver_role === "user") return "/user";
  return "/";
};

const getNotificationTag = (data = {}) => (
  data.tag ||
  data.request_id ||
  data.callId ||
  data.notification_id ||
  (
    (data.type === "follow" || data.type === "like" || data.type === "comment") &&
    `${data.type}_${data.related_id || data.post_id || "related"}_${data.sender_id || data.sender_name || "sender"}`
  ) ||
  `${data.type || "notification"}_${Date.now()}` ||
  "notification"
);

const buildNotificationOptions = (data = {}) => {
  const type = data.type;
  const isCall = type === "voice_call" || type === "incoming_call";

  return {
    body: data.body || "",
    icon: "/logo-192.png",
    badge: "/logo-192.png",
    tag: getNotificationTag(data),
    data: {
      ...data,
      target_url: getNotificationUrl(data),
      url: getNotificationUrl(data),
      click_action: getNotificationUrl(data),
    },
    requireInteraction: isCall || data.requireInteraction === "true" || data.requireInteraction === true,
    renotify: isCall || data.renotify === "true" || data.renotify === true,
    vibrate: isCall ? [200, 100, 200, 100, 400] : [80, 40, 80],
    actions: isCall
      ? [
          { action: "open", title: "Open" },
          { action: "dismiss", title: "Dismiss" },
        ]
      : [{ action: "open", title: "Open" }],
  };
};

const showDedupedNotification = async (title, options) => {
  const tag = options.tag || "notification";
  const existing = await self.registration.getNotifications({ tag });
  const type = options.data?.type;
  const allowReplace = type === "voice_call" || type === "incoming_call" || type === "chat_request";
  if (existing.length > 0 && !allowReplace) return;
  existing.forEach((notification) => notification.close());
  await self.registration.showNotification(title || "Notification", options);
};

/* ================= BACKGROUND MESSAGE HANDLER ================= */

messaging.onBackgroundMessage(async (payload) => {
  const data = normalizePayload(payload);
  const title = data.title || "Notification";
  await showDedupedNotification(title, buildNotificationOptions(data));
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  event.waitUntil((async () => {
    let payload = {};
    try {
      payload = event.data.json();
    } catch {
      payload = { title: "Notification", body: event.data.text() };
    }

    const data = normalizePayload(payload);
    const title = payload.title || data.title || "Notification";
    await showDedupedNotification(title, buildNotificationOptions(data));
  })());
});

/* ================= NOTIFICATION CLICK HANDLER ================= */

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification?.data || {};
  if (event.action === "dismiss") return;

  const targetUrl =
    data.target_url ||
    data.url ||
    data.click_action ||
    (data.receiver_role === "expert" ? "/expert/notifications" : "/");

  const finalUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            client.navigate(finalUrl);
            return client.focus();
          }
        }
        return clients.openWindow(finalUrl);
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
