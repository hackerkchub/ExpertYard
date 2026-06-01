import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Network } from "@capacitor/network";
import { FiWifi, FiWifiOff } from "react-icons/fi";
import styled from "styled-components";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let networkListener = null;
    let onlineHandler = null;
    let offlineHandler = null;

    const initNetwork = async () => {
      // Native Android/iOS
      if (Capacitor.isNativePlatform()) {
        try {
          const status = await Network.getStatus();
          setIsOnline(status.connected);

          networkListener = await Network.addListener(
            "networkStatusChange",
            (status) => {
              setIsOnline(status.connected);
            }
          );
        } catch (err) {
          console.error("Native network listener error:", err);
        }
      } 
      // Web/PWA
      else {
        setIsOnline(navigator.onLine);

        onlineHandler = () => setIsOnline(true);
        offlineHandler = () => setIsOnline(false);

        window.addEventListener("online", onlineHandler);
        window.addEventListener("offline", offlineHandler);
      }
    };

    initNetwork();

    return () => {
      if (networkListener) {
        networkListener.remove();
      }

      if (onlineHandler) {
        window.removeEventListener("online", onlineHandler);
      }

      if (offlineHandler) {
        window.removeEventListener("offline", offlineHandler);
      }
    };
  }, []);

  useEffect(() => {
    let timer;

    if (!isOnline) {
      setShow(true);
    } else {
      setShow(true);
      timer = setTimeout(() => {
        setShow(false);
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOnline]);

  if (!show) return null;

  return (
    <ToastContainer isOnline={isOnline}>
      {isOnline ? <FiWifi /> : <FiWifiOff />}
      <span>{isOnline ? "Back Online" : "No Internet Connection"}</span>
    </ToastContainer>
  );
};

const ToastContainer = styled.div`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: ${(props) => (props.isOnline ? "#057642" : "#191919")};
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 9999;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      bottom: -50px;
      opacity: 0;
    }
    to {
      bottom: 80px;
      opacity: 1;
    }
  }
`;

export default NetworkStatus;