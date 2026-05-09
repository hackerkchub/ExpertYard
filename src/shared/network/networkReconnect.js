const listeners = new Set();

let started = false;
let wasOffline = typeof navigator !== "undefined" ? !navigator.onLine : false;
let reconnectTimer = null;

const notifyReconnect = () => {
  if (reconnectTimer) {
    window.clearTimeout(reconnectTimer);
  }

  reconnectTimer = window.setTimeout(() => {
    listeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        console.error("Network reconnect listener failed", error);
      }
    });
  }, 450);
};

const markOffline = () => {
  wasOffline = true;
  if (reconnectTimer) {
    window.clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

const handleOnline = () => {
  if (!wasOffline) return;
  wasOffline = false;
  notifyReconnect();
};

const handleVisibilityChange = () => {
  if (
    document.visibilityState === "visible" &&
    wasOffline &&
    navigator.onLine
  ) {
    handleOnline();
  }
};

export const startNetworkReconnectListener = () => {
  if (started || typeof window === "undefined") return;

  started = true;
  window.addEventListener("offline", markOffline);
  window.addEventListener("online", handleOnline);
  document.addEventListener("visibilitychange", handleVisibilityChange);
};

export const subscribeNetworkReconnect = (listener) => {
  if (typeof listener !== "function") {
    return () => {};
  }

  startNetworkReconnectListener();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};
