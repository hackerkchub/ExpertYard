/* ================= FIREBASE IMPORTS ================= */

importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

/* ================= WORKBOX IMPORTS ================= */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js");

// Disable Workbox logs in production
self.__WB_DISABLE_DEV_LOGS = true;

/* ================= IMMEDIATE ACTIVATION (CRITICAL) ================= */
workbox.core.skipWaiting();
workbox.core.clientsClaim();

// Automatically remove old Workbox precaches
workbox.precaching.cleanupOutdatedCaches();

/* ================= CACHE VERSIONING ================= */

const IMAGE_CACHE = 'images-cache-v2';
const API_CACHE = 'api-cache-v2';
const STATIC_CACHE = 'static-cache-v2';
const PAGE_CACHE = 'page-cache-v2';

/* ================= PRECACHING (AUTO-REVISION) ================= */
// ✅ No manual BUILD_ID needed - Workbox auto-generates revisions
// ✅ Assets rarely change, and SW update triggers cache refresh
workbox.precaching.precacheAndRoute([
  { url: '/logo-192.png' },
  { url: '/logo-512.png' },
  { url: '/manifest.json' },
]);

/* ================= FIREBASE INITIALIZATION ================= */

firebase.initializeApp({
  apiKey: "AIzaSyAeA1BsApn__fDctrvmmzloJqYrNvyBf3Y",
  authDomain: "g9expert-852f3.firebaseapp.com",
  projectId: "g9expert-852f3",
  storageBucket: "g9expert-852f3.firebasestorage.app",
  messagingSenderId: "769544907226",
  appId: "1:769544907226:web:8913137a1827d58d34b8e3"
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
    if (type === "video_call" && voiceCallId) {
      return `/expert/video-call/${encodeURIComponent(voiceCallId)}`;
    }

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
  if (type === "video_call") {
    return `video-call:${callId}`;
  }
  if (type === "voice_call" || type === "incoming_call" || type === "missed_call") {
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

const buildNotificationOptions = (data = {}) => {
  const type = data.type;
  const isCall = type === "voice_call" || type === "incoming_call" || type === "video_call";

  return {
    body: data.body || "",
    icon: data.icon || "/logo-192.png",
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

self.addEventListener('activate', (event) => {
  const keepCaches = [
    IMAGE_CACHE,
    API_CACHE,
    STATIC_CACHE,
    PAGE_CACHE
  ];

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (
            !keepCaches.includes(key) &&
            !key.startsWith('workbox-precache')
          ) {
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

// ---------- API CALLS (NetworkFirst) ----------
workbox.routing.registerRoute(
  ({ url }) =>
    (url.origin === self.location.origin || url.hostname.includes("softmaxs.com")) &&
    url.pathname.startsWith("/api"),
  new workbox.strategies.NetworkFirst({
    cacheName: API_CACHE,
    networkTimeoutSeconds: 5,
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

// ---------- STATIC FILES (JS, CSS) ----------
workbox.routing.registerRoute(
  ({ request, url }) => {
    if (
      url.pathname.startsWith('/src') ||
      url.pathname.startsWith('/@vite') ||
      url.pathname.startsWith('/node_modules')
    ) {
      return false;
    }
    return (
      request.destination === 'script' ||
      request.destination === 'style'
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

/* ================= NAVIGATION ROUTE (INDEX.HTML) ================= */
workbox.routing.registerRoute(
  ({ request }) => request.mode === "navigate",
  new workbox.strategies.NetworkFirst({
    cacheName: PAGE_CACHE,
    networkTimeoutSeconds: 3,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 2,
        maxAgeSeconds: 60 * 60, // 1 hour
      }),
    ],
  })
);

/* ================= OFFLINE FALLBACKS ================= */

workbox.routing.setCatchHandler(async ({ event }) => {
  // Fallback for images
  if (event.request.destination === 'image') {
    const cachedFallback = await caches.match('/logo-192.png');
    return cachedFallback || Response.error();
  }

  // Fallback for navigation
  if (event.request.mode === 'navigate') {
    try {
      const cachedIndex = await caches.match('/index.html');
      if (cachedIndex) {
        return cachedIndex;
      }
      
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head><title>Offline</title></head>
          <body>
            <h1>You're Offline</h1>
            <p>Please check your internet connection.</p>
          </body>
        </html>`,
        {
          status: 503,
          headers: { 'Content-Type': 'text/html' }
        }
      );
    } catch {
      return Response.error();
    }
  }

  return Response.error();
});

/* ================= SKIP WAITING MESSAGE HANDLER ================= */

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});