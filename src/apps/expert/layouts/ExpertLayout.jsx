import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import ExpertSidebar from "../components/ExpertSidebar";
import ExpertTopbar from "../components/ExpertTopbar";
import { LayoutWrapper, ContentWrapper } from "./expertLayout.styles";

// ✅ CONTEXT
import { ExpertProvider, useExpert } from "../../../shared/context/ExpertContext";

// ✅ SHARED SOCKET
import { socket } from "../../../shared/api/socket";

/* ======================================================
   INNER LAYOUT
====================================================== */
function ExpertLayoutInner() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const { expertData } = useExpert();

  // ✅ CORRECT expertId
const expertId = expertData?.id;


  /* ===============================
     EXPERT ONLINE (JOIN ROOM)
  =============================== */
  useEffect(() => {
  if (!expertId) return;

  socket.emit("expert_online", {
    expert_id: expertId
  });

  console.log("🧑‍💼 Expert online:", expertId);
}, [expertId]);
  /* ===============================
     CHAT ACCEPTED → REDIRECT
  =============================== */
  useEffect(() => {
    const handleChatStarted = ({ room_id }) => {
      if (!room_id) return;

      console.log("🚀 Expert chat started:", room_id);
      navigate(`/expert/chat/${room_id}`);
    };

    // ✅ SAME EVENT NAME AS BACKEND
    socket.on("chat_started", handleChatStarted);

    return () => {
      socket.off("chat_started", handleChatStarted);
    };
  }, [navigate]);

  return (
    <LayoutWrapper>
      <ExpertTopbar setMobileOpen={setMobileOpen} />

      <ExpertSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </LayoutWrapper>
  );
}

/* ======================================================
   PROVIDER WRAPPER
====================================================== */
export default function ExpertLayout() {
  return (
    <ExpertProvider>
      <ExpertLayoutInner />
    </ExpertProvider>
  );
}
