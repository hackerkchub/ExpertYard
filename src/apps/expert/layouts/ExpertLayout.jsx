import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ExpertSidebar from "../components/ExpertSidebar"; // Desktop only
import ExpertTopbar from "../components/ExpertTopbar";   // Handles mobile completely
import { LayoutWrapper, ContentWrapper } from "./expertLayout.styles";
import { ExpertProvider, useExpert } from "../../../shared/context/ExpertContext";
import { useAuth } from "../../../shared/context/UserAuthContext";
import { socket } from "../../../shared/api/socket";
import { ExpertNotificationsProvider } from "../context/ExpertNotificationsContext"; 

function ExpertLayoutInner() {
  const navigate = useNavigate();
  const { expertData } = useExpert();
  const { user: expertUser } = useAuth();
  
const expertId = Number(
  expertData?.expert_id ??
  expertData?.profile?.expert_id ??
  expertData?.id ??
  expertUser?.expert_id ??
  expertUser?.id ??
  0
);


  
  console.log("🔍 ExpertLayout - expertId:", expertId);

  /* ===============================
     SOCKET CONNECTION MANAGER
  =============================== */
  const connectSocket = useCallback(() => {
    if (!socket.connected) {
      console.log("🔌 FORCING socket connect...");
      socket.connect();
    }
  }, []);

  /* ===============================
     EXPERT ONLINE STATUS - BULLETPROOF
  =============================== */
 useEffect(() => {
  if (!expertId) return;

  const emitOnline = () => {
    console.log("🟢 EXPERT ONLINE:", expertId);
    socket.emit("expert_online", { expert_id: expertId });
  };

  if (socket.connected) {
    emitOnline();
  } else {
    socket.once("connect", emitOnline);
  }

  socket.on("ping", () => socket.emit("pong"));

  return () => {
    socket.emit("expert_offline", { expert_id: expertId });
    socket.off("ping");
    socket.off("connect", emitOnline);
  };
}, [expertId]);

  /* ===============================
     CHAT ACCEPTED → AUTO REDIRECT
  =============================== */
  useEffect(() => {
    const handleChatStarted = ({ room_id, user_id }) => {
      console.log("🚀 AUTO REDIRECT → /expert/chat/", room_id);
      navigate(`/expert/chat/${room_id}`, { replace: true });
    };

    socket.on("chat_started", handleChatStarted);
    return () => {
      socket.off("chat_started", handleChatStarted);
    };
  }, [navigate]);

  /* ===============================
     GLOBAL ERROR HANDLING
  =============================== */
  useEffect(() => {
    const handleSocketError = (error) => {
      console.error("❌ Socket error:", error);
    };

    const handleDisconnect = (reason) => {
      console.log("🔴 Socket disconnected:", reason);
    };

    socket.on("connect_error", handleSocketError);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect_error", handleSocketError);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  /* ===============================
     RESPONSIVE LAYOUT - NO PROPS NEEDED
  =============================== */
  return (
    <LayoutWrapper>
      {/* ✅ Topbar: Handles ALL mobile menu logic */}
      <ExpertTopbar />
      
      {/* ✅ Sidebar: Desktop ONLY (1024px+) */}
      <ExpertSidebar />
      
      {/* ✅ Content: Perfect responsive spacing */}
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </LayoutWrapper>
  );
}

export default function ExpertLayout() {
  return (
    <ExpertProvider>
      <ExpertNotificationsProvider>
        <ExpertLayoutInner />
      </ExpertNotificationsProvider>
    </ExpertProvider>
  );
}
