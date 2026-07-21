import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import ExpertSidebar from "../components/ExpertSidebar";
import ExpertTopbar from "../components/ExpertTopbar";
import ExpertBottomNavbar from "../components/ExpertBottomNavbar";
import IncomingCallPopup from "../components/IncomingCallPopup";
import ContinueChatBanner from "../../../shared/components/ContinueChatBanner";

import { LayoutWrapper, ContentWrapper } from "./expertLayout.styles";

import {
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
import { generateToken } from "../../../firebase/generateToken";
import { APP_CONFIG } from "../../../config/appConfig";
import { Capacitor } from "@capacitor/core";
/* ===================================================== */
function ExpertLayoutInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { expertData } = useExpert();

  const isOnCallPage =
    location.pathname.startsWith("/expert/voice-call/") ||
    location.pathname.startsWith("/expert/video-call/");
  const [incomingVideoCall, setIncomingVideoCall] = useState(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= 768;
    }
    return false;
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isExpertInquiryPage = 
    location.pathname.startsWith("/expert/inquiries") || 
    location.pathname === "/expert/inquiries" ||
    location.pathname.startsWith("/expert/chat") ||
    location.pathname === "/expert/chat";

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
          `${APP_CONFIG.API_BASE_URL}/notifications?panel=expert&userId=${expertId}&limit=10`
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
        window.history.replaceState({}, document.title, window.location.pathname || "/expert/home");

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

    const checkPendingChatRequests = () => {
      socket.emit("check_pending_requests", { expert_id: expertId });
    };

    socket.on("connect", checkPendingChatRequests);

    if (socket.connected) {
      checkPendingChatRequests();
    }

    return () => {
      socket.off("connect", checkPendingChatRequests);
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
    if (!expertId) return;

    const handleIncomingVideo = (payload = {}) => {
      const callId = payload.callId || payload.call_id;
      if (!callId || isOnCallPage) return;
      setIncomingVideoCall({
        callId,
        name: payload.callerName || payload.user_name || "User",
        avatar: payload.user_avatar || payload.callerAvatar || "",
        title: "Incoming Video Call",
        price: payload.price_per_minute,
      });
    };

    const closeVideoCall = ({ callId } = {}) => {
      if (callId && incomingVideoCall?.callId && String(callId) !== String(incomingVideoCall.callId)) return;
      setIncomingVideoCall(null);
    };

    socket.on("video-call:incoming", handleIncomingVideo);
    socket.on("video-call:cancelled", closeVideoCall);
    socket.on("video-call:missed", closeVideoCall);
    socket.on("video-call:ended", closeVideoCall);
    socket.on("video-call:taken", closeVideoCall);

    return () => {
      socket.off("video-call:incoming", handleIncomingVideo);
      socket.off("video-call:cancelled", closeVideoCall);
      socket.off("video-call:missed", closeVideoCall);
      socket.off("video-call:ended", closeVideoCall);
      socket.off("video-call:taken", closeVideoCall);
    };
  }, [expertId, incomingVideoCall?.callId, isOnCallPage]);

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
      {!(isExpertInquiryPage && isMobile) && <ExpertTopbar />}
      <ExpertSidebar />
      <ContinueChatBanner />

      <ContentWrapper className={isExpertInquiryPage ? "immersive-inquiry-layout" : ""}>
        <Outlet />
      </ContentWrapper>

      <ExpertBottomNavbar />
{!Capacitor.isNativePlatform() && (
  <>
    <IncomingCallPopup
      caller={
        activeIncomingCall
          ? {
              name:
                activeIncomingCall.payload?.user_name ||
                activeIncomingCall.title?.replace(
                  "Incoming call from ",
                  ""
                ),
              callId:
                activeIncomingCall.payload?.callId ||
                activeIncomingCall.payload?.call_id,
            }
          : null
      }
      onAccept={() => {
        if (activeIncomingCall) {
          acceptNotification(activeIncomingCall);
        }
      }}
      onReject={() => {
        if (activeIncomingCall) {
          rejectNotification(activeIncomingCall);
        }
      }}
    />

    <IncomingCallPopup
      caller={incomingVideoCall}
      callType="video"
      onAccept={() => {
        const callId = incomingVideoCall?.callId;

        setIncomingVideoCall(null);

        if (callId) {
          navigate(`/expert/video-call/${callId}`, {
            state: { autoAccept: true, acceptSent: true, action: "accept" }
          });
        }
      }}
      onReject={() => {
        const callId = incomingVideoCall?.callId;

        if (callId) {
          socket.emit("video-call:decline", { callId });
        }

        setIncomingVideoCall(null);
      }}
    />
  </>
)}
    </LayoutWrapper>
  );
}

/* ===================================================== */

export default function ExpertLayout() {
  return (
    <ExpertNotificationsProvider>
      <ExpertLayoutInner />
    </ExpertNotificationsProvider>
  );
}
