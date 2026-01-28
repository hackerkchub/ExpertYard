import { useEffect, useState, useRef } from "react";

export default function useChatTimer(endTime, onExpire) {
  const [secondsLeft, setSecondsLeft] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!endTime) return;

    const end = new Date(endTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((end - now) / 1000));

      setSecondsLeft(diff);

      if (diff <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        onExpire?.();
      }
    };

    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalRef.current);
  }, [endTime, onExpire]);

  const safe = secondsLeft ?? 0;

  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;

  const formatted =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    secondsLeft: safe,
    minutes,
    seconds,
    formatted,
    isExpired: endTime ? safe <= 0 : false, // ⭐ CRITICAL FIX
  };
}
