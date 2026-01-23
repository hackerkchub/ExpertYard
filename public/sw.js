// public/sw.js

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {}

  const title = data.title || "Notification";

  const options = {
    body: data.body || "",
    data: {
      url: data?.data?.url || data?.url || "/", // ✅ SAFER
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification?.data?.url || "/";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true, // ✅ VERY IMPORTANT
    }).then((clientList) => {
      for (const client of clientList) {
        try {
          const clientUrl = new URL(client.url);
          const targetUrl = new URL(url, self.location.origin);

          if (clientUrl.pathname === targetUrl.pathname && "focus" in client) {
            return client.focus();
          }
        } catch (e) {
          // ignore malformed URL
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
