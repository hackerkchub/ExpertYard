import { useLoader } from "./LoaderContext";
import { useEffect, useState } from "react";
import "./loader.css";

export default function GlobalLoader() {
  const { loading } = useLoader();
  const [slowNetwork, setSlowNetwork] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine); // 🌐 Real network check

  useEffect(() => {
    // 🌍 1. Browser ke internet connection ko track karna
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    let timer;

    if (loading) {
      setSlowNetwork(false); // Reset taaki purana state agle load me pass na ho

      // Timer tabhi chalega jab actual internet connect ho, bas slow ho
      if (!isOffline) {
        timer = setTimeout(() => {
          setSlowNetwork(true);
        }, 4000);
      }
    } else {
      setSlowNetwork(false);
    }

    return () => {
      clearTimeout(timer); // Timer hamesha reset hoga memory leak rokne ke liye
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [loading, isOffline]); // ✅ Track loading and offline states both

  // 🛑 Condition Check: Agar loading band ho chuki hai, to turant ruko
  if (!loading) return null;

  return (
    <div className="global-loader">
      <div className="loader-spinner" />

      <div className="loader-text">
        {isOffline ? "You are offline!" : "Loading..."}
      </div>

      {/* 🔴 Case 1: Internet disconnected */}
      {isOffline && (
        <p className="offline-text" style={{ color: "#ef4444", fontWeight: 600 }}>
          ❌ No internet connection. Please check your network.
        </p>
      )}

      {/* 🟡 Case 2: Internet connected but slow */}
      {!isOffline && slowNetwork && (
        <p className="slow-network-text" style={{ color: "#f59e0b", fontWeight: 500 }}>
          ⚠️ Network is slow, please wait...
        </p>
      )}
    </div>
  );
}