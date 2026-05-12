import { useEffect, useRef } from "react";
import { subscribeNetworkReconnect } from "../network/networkReconnect";

export default function useNetworkReconnect(callback, options = {}) {
  const { enabled = true } = options;
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return undefined;

    return subscribeNetworkReconnect(() => {
      callbackRef.current?.();
    });
  }, [enabled]);
}
