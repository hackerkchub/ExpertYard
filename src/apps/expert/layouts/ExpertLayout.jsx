// src/apps/expert/layout/ExpertLayout.jsx
import React, { useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import ExpertSidebar from "../components/ExpertSidebar";
import ExpertTopbar from "../components/ExpertTopbar";
import { LayoutWrapper, ContentWrapper } from "./expertLayout.styles";

import { ExpertProvider, useExpert } from "../../../shared/context/ExpertContext";
import { useAuth } from "../../../shared/context/UserAuthContext";
import { socket } from "../../../shared/api/socket";

import { ExpertNotificationsProvider } from "../context/ExpertNotificationsContext";

/* =====================================================
   INNER LAYOUT
===================================================== */
function ExpertLayoutInner() {
  const navigate = useNavigate();
  const { expertData } = useExpert();
  const { user: authUser } = useAuth();

  /* ----------------------------------
     ✅ SINGLE SOURCE EXPERT ID
  ---------------------------------- */
  const expertId = useMemo(() => {
    return Number(
      expertData?.expertId ||
      expertData?.profile?.expert_id ||
      authUser?.expert_id ||
      0
    );
  }, [expertData, authUser]);

  /* ----------------------------------
     🔌 EXPERT SOCKET REGISTER (ONLY HERE)
  ---------------------------------- */
  useEffect(() => {
    if (!expertId) return;

    const onConnect = () => {
      console.log("🟢 EXPERT SOCKET CONNECTED");

      socket.emit("register", {
        userId: expertId,
        role: "expert",
      });

      console.log("🟢 EXPERT REGISTERED:", expertId);
    };

    socket.on("connect", onConnect);

    // ✅ socket.js already has auth token
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
    };
  }, [expertId]);

  /* ----------------------------------
     🚀 CHAT ACCEPT → AUTO REDIRECT
  ---------------------------------- */
  useEffect(() => {
    const handleChatStarted = ({ room_id }) => {
      navigate(`/expert/chat/${room_id}`, { replace: true });
    };

    socket.on("chat_started", handleChatStarted);
    return () => socket.off("chat_started", handleChatStarted);
  }, [navigate]);

  /* ----------------------------------
     ❌ SOCKET DEBUG LOGS
  ---------------------------------- */
  useEffect(() => {
    const onError = (e) =>
      console.error("❌ Socket error:", e?.message || e);

    const onDisconnect = (r) =>
      console.warn("🔴 Socket disconnected:", r);

    socket.on("connect_error", onError);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect_error", onError);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <LayoutWrapper>
      <ExpertTopbar />
      <ExpertSidebar />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </LayoutWrapper>
  );
}

/* =====================================================
   ROOT EXPORT
===================================================== */
export default function ExpertLayout() {
  return (
    <ExpertProvider>
      {/* <ExpertNotificationsProvider> */}
        <ExpertLayoutInner />
      {/* </ExpertNotificationsProvider> */}
    </ExpertProvider>
  );
}
