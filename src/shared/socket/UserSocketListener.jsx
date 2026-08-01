import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../api/socket";
import { useAuth } from "../context/UserAuthContext";
import { getChatRoomCandidates, getChatRoomId } from "../utils/chatRoom";
import { soundManager } from "../services/sound/soundManager";
import { SOUNDS } from "../services/sound/soundRegistry";
import { FiPhone, FiVideo, FiX, FiCheck } from "react-icons/fi";

const UserSocketListener = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const handleChatAccepted = (data = {}) => {
      if (data.user_id && Number(data.user_id) !== Number(user.id)) return;
      const room_id = getChatRoomId(data);
      if (!room_id) return;
      navigate(`/user/chat/${room_id}`, {
        replace: true,
        state: { roomCandidates: getChatRoomCandidates(data) },
      });
    };

    const handleIncomingCall = (data = {}) => {
      console.log("📞 User received incoming call:", data);
      const callId = data.callId || data.call_id || data.id;
      const fromExpertId = data.fromExpertId || data.expert_id || data.expertId;
      const expertName = data.expert_name || data.expertName || "Expert";
      const isVideo = data.isVideo || data.callType === "video" || data.type === "video";

      setIncomingCall({
        callId,
        fromExpertId,
        expertName,
        isVideo,
        raw: data,
      });

      try {
        soundManager.stopAll();
        soundManager.play(SOUNDS.INCOMING_CALL, { loop: true });
      } catch (e) {
        console.warn("Sound play error:", e);
      }
    };

    const handleCloseCall = () => {
      try {
        soundManager.stopAll();
      } catch (e) {}
      setIncomingCall(null);
    };

    socket.on("chat_accepted", handleChatAccepted);
    socket.on("call:incoming", handleIncomingCall);
    socket.on("video-call:incoming", handleIncomingCall);
    socket.on("call:ended", handleCloseCall);
    socket.on("call:rejected", handleCloseCall);
    socket.on("call:cancelled", handleCloseCall);
    socket.on("call:missed", handleCloseCall);

    return () => {
      socket.off("chat_accepted", handleChatAccepted);
      socket.off("call:incoming", handleIncomingCall);
      socket.off("video-call:incoming", handleIncomingCall);
      socket.off("call:ended", handleCloseCall);
      socket.off("call:rejected", handleCloseCall);
      socket.off("call:cancelled", handleCloseCall);
      socket.off("call:missed", handleCloseCall);
    };
  }, [user?.id, navigate]);

  const handleAccept = () => {
    if (!incomingCall) return;
    try {
      soundManager.stopAll();
    } catch (e) {}

    const { callId, fromExpertId, isVideo } = incomingCall;
    if (socket.connected && callId) {
      socket.emit("call:accept", { callId });
    }

    setIncomingCall(null);
    if (isVideo) {
      navigate(`/user/video-call/${fromExpertId}`, {
        state: { callId, autoAccept: true, pricingMode: "subscription" },
      });
    } else {
      navigate(`/user/voice-call/${fromExpertId}`, {
        state: { callId, autoAccept: true, pricingMode: "subscription" },
      });
    }
  };

  const handleDecline = () => {
    if (!incomingCall) return;
    try {
      soundManager.stopAll();
    } catch (e) {}

    const { callId } = incomingCall;
    if (socket.connected && callId) {
      socket.emit("call:reject", { callId, reason: "user_rejected" });
    }
    setIncomingCall(null);
  };

  if (!incomingCall) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 99999,
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(12px)",
        color: "#fff",
        borderRadius: 16,
        padding: "14px 18px",
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        maxWidth: 440,
        width: "calc(100vw - 32px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          background: "#059669",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {incomingCall.isVideo ? <FiVideo size={22} /> : <FiPhone size={22} />}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Service Call
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {incomingCall.expertName}
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>Incoming {incomingCall.isVideo ? "Video" : "Voice"} Call...</div>
      </div>

      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button
          type="button"
          onClick={handleDecline}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: "#ef4444",
            color: "#fff",
            border: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Decline"
        >
          <FiX size={20} />
        </button>
        <button
          type="button"
          onClick={handleAccept}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: "#10b981",
            color: "#fff",
            border: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Accept"
        >
          <FiCheck size={20} />
        </button>
      </div>
    </div>
  );
};

export default UserSocketListener;
