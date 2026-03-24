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

  useEffect(() => {
    if (!expertId) return;

    const params = new URLSearchParams(window.location.search);

    if (!params.get("from_notification")) return;

    const checkActiveRequests = async () => {
      try {
        const res = await fetch(
          `/notifications?panel=expert&userId=${expertId}&limit=10`
        );

        const data = await res.json();

        // ✅ Bug 3 Fixed: Safer data structure handling
       const notifications =
  data?.data?.data ||
  data?.data ||
  data ||
  [];

       const activeRequest = notifications.find((n) => {

  if (!(n.type === "voice_call" || n.type === "chat_request")) return false;

  if (!n.status) return true; // NULL status → active request

  return !["missed","rejected","ended","cancelled"].includes(n.status);

});

        if (!activeRequest) return;

        // ✅ Bug 1 Fixed: Properly parse and use meta
        const meta =
          typeof activeRequest.meta === "string"
            ? JSON.parse(activeRequest.meta)
            : activeRequest.meta || {};

        /* ===== CALL ===== */
        if (
  activeRequest.type === "voice_call" &&
  activeRequest.status === "ringing"
) {
          const callId = meta.callId || meta.request_id;

          if (callId) {
           setTimeout(() => {

  window.dispatchEvent(
    new CustomEvent("incoming_call", {
      detail: {
        callId,
        user_name: activeRequest.title?.replace(
          "Incoming call from ",
          ""
        ),
        status: "ringing",
      },
    })
  );

}, 500);
          }
        }

        /* ===== CHAT ===== */
        if (activeRequest.type === "chat_request") {
          const requestId = meta.request_id;

          if (requestId) {
           setTimeout(() => {

  window.dispatchEvent(
    new CustomEvent("incoming_chat_request", {
      detail: {
        request_id: requestId,
      },
    })
  );

}, 500);
          }
        }

        // ✅ Bug 2 Fixed: Remove from_notification param after processing
        window.history.replaceState({}, document.title, "/expert");

      } catch (err) {
        console.log("Active request fetch failed:", err);
      }
    };

    checkActiveRequests();
  }, [expertId]);
 
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

 useEffect(() => {
  const handleCancelled = ({ callId }) => {
    window.dispatchEvent(
      new CustomEvent("call_cancelled", { detail: callId })
    );
  };

  const handleMissed = ({ callId }) => {
    window.dispatchEvent(
      new CustomEvent("call_missed", { detail: callId })
    );
  };

  socket.on("call:cancelled", handleCancelled);
  socket.on("call:missed", handleMissed);

  return () => {
    socket.off("call:cancelled", handleCancelled);
    socket.off("call:missed", handleMissed);
  };
}, []); 

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

  const handleFCM = useCallback(() => {
  console.log("FCM handled by notification provider");
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