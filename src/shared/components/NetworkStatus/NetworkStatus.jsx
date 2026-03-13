// src/shared/components/NetworkStatus/NetworkStatus.jsx
import React, { useEffect, useState } from "react";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { FiWifi, FiWifiOff } from "react-icons/fi";
import styled from "styled-components";

const NetworkStatus = () => {
  const isOnline = useOnlineStatus();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Jab offline ho jaye tab dikhao, ya jab wapas online aaye tab thodi der ke liye dikhao
    if (!isOnline) {
      setShow(true);
    } else {
      // Wapas online aane par 3 second baad hide kar do
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!show && isOnline) return null;

  return (
    <ToastContainer isOnline={isOnline}>
      {isOnline ? <FiWifi /> : <FiWifiOff />}
      <span>{isOnline ? "Back Online" : "No Internet Connection"}</span>
    </ToastContainer>
  );
};

// LinkedIn style subtle toast
const ToastContainer = styled.div`
  position: fixed;
  bottom: 80px; /* Mobile bottom nav ke upar */
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
    from { bottom: -50px; opacity: 0; }
    to { bottom: 80px; opacity: 1; }
  }
`;

export default NetworkStatus;