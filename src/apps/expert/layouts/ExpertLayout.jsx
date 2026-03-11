import React, { useEffect, useMemo, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import ExpertSidebar from "../components/ExpertSidebar";
import ExpertTopbar from "../components/ExpertTopbar";
import IncomingCallPopup from "../components/IncomingCallPopup";

import { LayoutWrapper, ContentWrapper } from "./expertLayout.styles";

import {
  ExpertProvider,
  useExpert,
} from "../../../shared/context/ExpertContext";

import {
  connectSocket,
  disconnectSocket,
  socket,
} from "../../../shared/api/socket";

import {
  ExpertNotificationsProvider,
  useExpertNotifications,
} from "../context/ExpertNotificationsContext";
import useFCM from "../../../hooks/useFCM";
import { generateToken } from "../../../firebase/generateToken";

/* ===================================================== */
function ExpertLayoutInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { expertData } = useExpert();

  const isOnCallPage = location.pathname.startsWith("/expert/voice-call/");

  const {
    notifications,
    acceptNotification,
    rejectNotification,
  } = useExpertNotifications();

  /* ✅ ONLY EXPERT CONTEXT — NO USER AUTH MIX */
  const expertId = useMemo(() => {
    return Number(
      expertData?.expertId ||
      expertData?.profile?.expert_id ||
      0
    );
  }, [expertData]);

 
  /* =====================================================
     🔌 CONNECT SOCKET (ROLE SAFE)
  ===================================================== */
  useEffect(() => {
    if (!expertId) return;

    connectSocket({
      userId: expertId,
      role: "expert",
    });

    return () => {
      disconnectSocket();
    };
  }, [expertId]);

useEffect(() => {
  if (!expertId) return;

  generateToken("expert");
}, [expertId]);

   useEffect(() => {
  if (!expertId) return;

  const sendStatus = () => {
   socket.emit("expert_active_status", {
  expertId,
  isActive: document.visibilityState === "visible",
});
  };

  const handleConnect = () => {
    sendStatus(); // send immediately after connect
  };

  socket.on("connect", handleConnect);

  document.addEventListener("visibilitychange", sendStatus);

  return () => {
    socket.off("connect", handleConnect);
    document.removeEventListener("visibilitychange", sendStatus);
  };
}, [expertId]);

  /* =====================================================
     📞 RESUME CALL CHECK AFTER CONNECT
  ===================================================== */
  useEffect(() => {
    if (!expertId) return;

    const handleConnect = () => {
      socket.emit("call:resume_check");
    };

    socket.on("connect", handleConnect);

    return () => socket.off("connect", handleConnect);
  }, [expertId]);

  /* =====================================================
     💬 CHAT REDIRECT
  ===================================================== */
  useEffect(() => {
    const handleChatStarted = ({ room_id }) => {
      navigate(`/expert/chat/${room_id}`, { replace: true });
    };

    socket.on("chat_started", handleChatStarted);

    return () => socket.off("chat_started", handleChatStarted);
  }, [navigate]);

  /* =====================================================
     📞 RESUME CALL NAVIGATION (FROM GLOBAL EVENT)
  ===================================================== */
  useEffect(() => {
    const handler = (e) => {
      navigate(`/expert/voice-call/${e.detail}`);
    };

    window.addEventListener("resume_call", handler);
    return () => window.removeEventListener("resume_call", handler);
  }, [navigate]);


 const handleFCM = useCallback((data) => {
  console.log("Incoming FCM:", data);

  window.dispatchEvent(
    new CustomEvent("incoming_call", { detail: data })
  );
}, []);

useFCM(handleFCM);
  /* =====================================================
     📲 INCOMING CALL
  ===================================================== */
  const activeIncomingCall =
    !isOnCallPage &&
    notifications?.find(
      (n) => n.type === "voice_call" && n.status === "ringing"
    );

  /* ===================================================== */

  return (
    <LayoutWrapper>
      <ExpertTopbar />
      <ExpertSidebar />

      <ContentWrapper>
        <Outlet />
      </ContentWrapper>

      <IncomingCallPopup
        caller={
          activeIncomingCall && {
            name:
              activeIncomingCall.payload?.user_name ||
              activeIncomingCall.title?.replace(
                "Incoming call from ",
                ""
              ),
          }
        }
        onAccept={() =>
          activeIncomingCall &&
          acceptNotification(activeIncomingCall)
        }
        onReject={() =>
          activeIncomingCall &&
          rejectNotification(activeIncomingCall)
        }
      />
    </LayoutWrapper>
  );
}

/* ===================================================== */

export default function ExpertLayout() {
  return (
    <ExpertProvider>
      <ExpertNotificationsProvider>
        <ExpertLayoutInner />
      </ExpertNotificationsProvider>
    </ExpertProvider>
  );
}