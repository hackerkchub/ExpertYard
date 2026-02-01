import { useState, useEffect, useCallback, useMemo } from "react";

/* ===============================
   🔐 VAPID PUBLIC KEY
================================ */
const VAPID_PUBLIC_KEY =
  "BGaWmiJyJLWBiYqSYLW1icykb-GgJZbDnRAqvhCU1YU9BAbmk4DlNb8SLmRJst0-q54rW4sNfJkuZdQBRyN0OGI";

/* ===============================
   🔁 BASE64 → UINT8
================================ */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

/* ===============================
   🔔 useWebPush HOOK
================================ */
export function useWebPush({
  panel,
  userId,
  subscribeUrl = "/api/push/subscription",
} = {}) {
  const supported = useMemo(
    () =>
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window,
    []
  );

  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ===============================
     🔄 REFRESH STATE
  ================================ */
  const refresh = useCallback(async () => {
    if (!supported) return;

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setIsSubscribed(!!sub);
      setPermission(Notification.permission);
    } catch {
      // silent
    }
  }, [supported]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /* ===============================
     ✅ ENABLE PUSH (SUBSCRIBE)
  ================================ */
const enable = useCallback(async () => {
  if (!supported) throw new Error("Push not supported in this browser");

  setLoading(true);
  setError(null);

  try {
    const p = await Notification.requestPermission();
    setPermission(p);
    if (p !== "granted") throw new Error("Notification permission denied");

    const reg = await navigator.serviceWorker.ready;

    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    const res = await fetch(subscribeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        panel,
        userId, // may be null → backend already supports null
        subscription: sub.toJSON(),
      }),
    });

    if (!res.ok) throw new Error("Failed to save push subscription");

    setIsSubscribed(true);
    return sub;
  } catch (e) {
    setError(e.message || "Push enable failed");
    throw e;
  } finally {
    setLoading(false);
  }
}, [panel, userId, subscribeUrl, supported]);

  /* ===============================
     ❌ DISABLE PUSH (UNSUBSCRIBE)
  ================================ */
  const disable = useCallback(async () => {
    if (!supported) return;

    setLoading(true);
    setError(null);

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();

      setIsSubscribed(false);
      await refresh();
    } catch (e) {
      setError(e.message || "Push disable failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [refresh, supported]);

  return {
    supported,
    permission,
    isSubscribed,
    loading,
    error,
    enable,
    disable,
    refresh,
  };
}
