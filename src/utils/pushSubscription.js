// src/hooks/useWebPush.js
import { useCallback, useEffect, useMemo, useState } from "react";

const VAPID_PUBLIC_KEY = "BGaWmiJyJLWBiYqSYLW1icykb-GgJZbDnRAqvhCU1YU9BAbmk4DlNb8SLmRJst0-q54rW4sNfJkuZdQBRyN0OGI";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function useWebPush({ panel = "user", userId, subscribeUrl = "/api/push/subscription" } = {}) {
  const supported = useMemo(
    () => "serviceWorker" in navigator && "PushManager" in window && "Notification" in window,
    []
  );

  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!supported) return;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription(); // existing subscription or null [web:134]
    setIsSubscribed(!!sub);
    setPermission(Notification.permission); // current permission state [web:151]
  }, [supported]);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  const enable = useCallback(
    async () => {
      if (!supported) throw new Error("Push not supported in this browser");
      setLoading(true);
      setError(null);

      try {
        // Ensure SW ready (register once in app bootstrap OR do it here)
        await navigator.serviceWorker.register("/sw.js");
        const reg = await navigator.serviceWorker.ready;

        const p = await Notification.requestPermission(); // should be user gesture driven [web:151]
        setPermission(p);
        if (p !== "granted") throw new Error("Permission denied");

        let sub = await reg.pushManager.getSubscription();
        if (!sub) {
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          }); // subscribe pattern [web:94]
        }

        const body = {
          panel,
          subscription: sub.toJSON(), // standard JSON form [web:133]
        };
        if (userId) body.userId = userId;

        const res = await fetch(subscribeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Failed to save subscription");

        setIsSubscribed(true);
        return sub;
      } catch (e) {
        setError(e?.message || "Push enable failed");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [panel, subscribeUrl, supported, userId]
  );

  const disable = useCallback(async () => {
    if (!supported) return;
    setLoading(true);
    setError(null);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription(); // [web:134]
      if (sub) await sub.unsubscribe(); // unsubscribe supported on PushSubscription [web:136]
      setIsSubscribed(false);
      await refresh();
    } catch (e) {
      setError(e?.message || "Push disable failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [refresh, supported]);

  return { supported, permission, isSubscribed, loading, error, enable, disable, refresh };
}
