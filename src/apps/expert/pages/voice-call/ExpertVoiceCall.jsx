import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { socket } from "../../../../shared/api/socket";
import { CALL_EVENTS } from "../../../../shared/constants/call.constants";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { useSocket } from "../../../../shared/hooks/useSocket";

import {
  PageWrapper,
  CallCard,
  StatusText,
  IncomingActions,
  ActionBtn,
  ExpertAvatarWrapper,
  ExpertAvatar,
  ExpertName,
  ExpertRole,
  Timer,
  Controls,
  ControlBtn,
  Brand,
} from "./ExpertVoiceCall.styles";

import {
  createPeer,
  closePeer,
  setRemote,
  addIce,
  toggleMute,
  createAnswer, // ✅ ADDED: Import createAnswer from voicePeer
} from "../../../../shared/webrtc/voicePeer";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=44";

export default function ExpertVoiceCall() {
  const { callId } = useParams();
  const navigate = useNavigate();
  const { expertData } = useExpert();


  const [callState, setCallState] = useState("incoming");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);

  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const [caller, setCaller] = useState({
  name: "Incoming Caller",
  role: "User",
  avatar: DEFAULT_AVATAR,
});

  const normalizedCallId = Number(callId);
const socket = useSocket(expertData?.expertId, "expert");
  useEffect(() => {
  const onIncoming = (data) => {
    // data = { callId, fromUserId, user_name, pricePerMinute }

    if (Number(data.callId) !== normalizedCallId) return;

    console.log("📞 Incoming call data:", data);

    setCaller({
      name: data.user_name || "User",
      role: "User",
      avatar: DEFAULT_AVATAR,
    });

    setCallState("incoming");
  };

  socket.on(CALL_EVENTS.INCOMING, onIncoming);

  return () => {
    socket.off(CALL_EVENTS.INCOMING, onIncoming);
  };
}, [normalizedCallId, socket]);

  useEffect(() => {
    if (callState === "connected") {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [callState]);

  /* ================= SOCKET CORE ================= */
  useEffect(() => {
    if (!callId) return;

  const onConnected = ({ callId: connectedId }) => {
  if (Number(connectedId) !== normalizedCallId) return;
  setCallState("connected");
};



  const onEnded = ({ callId: endedId }) => {
  if (Number(endedId) !== normalizedCallId) return;
  setCallState("ended");
  closePeer();
  setTimeout(() => navigate("/expert/home", { replace: true }), 1000);
};


    // Optional: Handle if call is rejected from user side
    const onBusy = () => {
      console.log("🚫 Expert: Call rejected/busy");
      setCallState("ended");
      closePeer();
      
      setTimeout(() => {
        navigate("/expert/home", { replace: true });
      }, 1000);
    };

    socket.on(CALL_EVENTS.CONNECTED, onConnected);
    socket.on(CALL_EVENTS.ENDED, onEnded);
    socket.on(CALL_EVENTS.BUSY, onBusy);

    return () => {
      socket.off(CALL_EVENTS.CONNECTED, onConnected);
      socket.off(CALL_EVENTS.ENDED, onEnded);
      socket.off(CALL_EVENTS.BUSY, onBusy);
    };
  }, [callId, navigate]);

  /* ================= WEBRTC ================= */
  useEffect(() => {
    if (!callId) return;

   const onOffer = async ({ callId: incomingId, offer }) => {
  if (Number(incomingId) !== normalizedCallId) return;

  console.log("📡 Expert: Received WebRTC offer");

  await createPeer({ socket, callId: normalizedCallId, audioRef });
  await setRemote(offer);

  const answer = await createAnswer();
  socket.emit("webrtc:answer", { callId: normalizedCallId, answer });
};


    const onIce = ({ callId: iceId, candidate }) => {
  if (Number(iceId) !== normalizedCallId) return;
  addIce(candidate);
};

    socket.on("webrtc:offer", onOffer);
    socket.on("webrtc:ice", onIce);

    return () => {
      socket.off("webrtc:offer", onOffer);
      socket.off("webrtc:ice", onIce);
    };
  }, [callId]);

  /* ================= ACTIONS ================= */
 const acceptCall = useCallback(() => {
  if (callState !== "incoming") return;
 socket.emit(CALL_EVENTS.ACCEPT, { callId: normalizedCallId });
 },[normalizedCallId, callState, socket]);


  const rejectCall = useCallback(() => {
    console.log("❌ Expert: Rejecting call", callId);
    socket.emit(CALL_EVENTS.REJECT, { callId: normalizedCallId });
    closePeer();
    navigate("/expert/home", { replace: true });
  }, [callId, navigate]);

  const endCall = useCallback(() => {
    console.log("🔚 Expert: Ending call", callId);
    socket.emit(CALL_EVENTS.END, { callId });
    closePeer();
    navigate("/expert/home", { replace: true });
  }, [callId, navigate]);

  const toggleMuteClick = useCallback(() => {
    setMuted((m) => {
      toggleMute(!m);
      return !m;
    });
  }, []);

  /* ================= RENDER ================= */
  return (
    <PageWrapper>
      <CallCard>
        {/* ✅ FIX 4: Add muted={false} for browser autoplay policy */}
        <audio ref={audioRef} muted={false} />

        <ExpertAvatarWrapper>
          <ExpertAvatar src={caller.avatar} />
        </ExpertAvatarWrapper>

        <ExpertName>{caller.name}</ExpertName>
        <ExpertRole>{caller.role}</ExpertRole>

        {callState === "incoming" && (
          <>
            <StatusText>INCOMING VOICE CALL</StatusText>
            <IncomingActions>
             <ActionBtn
  $accept
  onClick={() => {
    console.log("🔥 ACCEPT CLICKED", normalizedCallId);
    acceptCall();
  }}
>
  ✔ Accept
</ActionBtn>

              <ActionBtn onClick={rejectCall}>
                ✕ Reject
              </ActionBtn>
            </IncomingActions>
          </>
        )}

        {callState === "connected" && (
          <>
            <Timer>
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
            </Timer>

            <Controls>
              <ControlBtn active={muted} onClick={toggleMuteClick}>
                {muted ? "🔇" : "🎤"} <span>Mute</span>
              </ControlBtn>

              <ControlBtn danger onClick={endCall}>
                ❌ <span>End</span>
              </ControlBtn>
            </Controls>
          </>
        )}

        {callState === "ended" && (
          <StatusText>CALL ENDED</StatusText>
        )}

        <Brand>🌿 EXPERT YARD — Expert Panel</Brand>
      </CallCard>
    </PageWrapper>
  );
}