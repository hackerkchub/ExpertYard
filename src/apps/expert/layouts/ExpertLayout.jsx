import React, { useEffect, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import ExpertSidebar from "../components/ExpertSidebar";
import ExpertTopbar from "../components/ExpertTopbar";
import IncomingCallPopup from "../components/IncomingCallPopup";

import { LayoutWrapper, ContentWrapper } from "./expertLayout.styles";

import { ExpertProvider, useExpert } from "../../../shared/context/ExpertContext";
import { useAuth } from "../../../shared/context/UserAuthContext";
import { socket } from "../../../shared/api/socket";

import {
  ExpertNotificationsProvider,
  useExpertNotifications,
} from "../context/ExpertNotificationsContext";

/* ===================================================== */
function ExpertLayoutInner() {
  const navigate = useNavigate();
  const { expertData } = useExpert();
  const { user: authUser } = useAuth();
  const location = useLocation();

const isOnCallPage = location.pathname.startsWith("/expert/voice-call/");

  const {
    notifications,
    acceptNotification,
    rejectNotification,
  } = useExpertNotifications();

 const activeIncomingCall =
  !isOnCallPage &&
  notifications.find(
    (n) => n.type === "voice_call" && n.status === "ringing"
  );

  const expertId = useMemo(() => {
    return Number(
      expertData?.expertId ||
      expertData?.profile?.expert_id ||
      authUser?.expert_id ||
      0
    );
  }, [expertData, authUser]);

  /* SOCKET REGISTER */
  useEffect(() => {
    if (!expertId) return;

    const onConnect = () => {
      socket.emit("register", {
        userId: expertId,
        role: "expert",
      });
      socket.emit("call:resume_check"); 
    };

    socket.on("connect", onConnect);

    if (!socket.connected) socket.connect();
    else onConnect();

    return () => socket.off("connect", onConnect);
  }, [expertId]);

  /* CHAT REDIRECT */
  useEffect(() => {
    const handleChatStarted = ({ room_id }) => {
      navigate(`/expert/chat/${room_id}`, { replace: true });
    };

    socket.on("chat_started", handleChatStarted);
    return () => socket.off("chat_started", handleChatStarted);
  }, [navigate]);

  useEffect(() => {
  const handler = (e) => {
    navigate(`/expert/voice-call/${e.detail}`);
  };

  window.addEventListener("go_to_call_page", handler);
  return () => window.removeEventListener("go_to_call_page", handler);
}, [navigate]);

  return (
    <LayoutWrapper>
      <ExpertTopbar />
      <ExpertSidebar />

      <ContentWrapper>
        <Outlet />
      </ContentWrapper>

      {/* 🌍 GLOBAL INCOMING CALL POPUP */}
      <IncomingCallPopup
  caller={
    activeIncomingCall && {
      name:
        activeIncomingCall.payload?.user_name ||
        activeIncomingCall.title?.replace("Incoming call from ", ""),
    }
  }
  onAccept={() =>
    activeIncomingCall && acceptNotification(activeIncomingCall)
  }
  onReject={() =>
    activeIncomingCall && rejectNotification(activeIncomingCall)
  }
/>
    </LayoutWrapper>
  );
}

/* ROOT */
export default function ExpertLayout() {
  return (
    <ExpertProvider>
      <ExpertNotificationsProvider>
        <ExpertLayoutInner />
      </ExpertNotificationsProvider>
    </ExpertProvider>
  );
}