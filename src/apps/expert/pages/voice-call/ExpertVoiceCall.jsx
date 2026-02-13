import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  createAnswer,
} from "../../../../shared/webrtc/voicePeer";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=44";

export default function ExpertVoiceCall() {
  const { callId } = useParams();
  const navigate = useNavigate();
  const { expertData } = useExpert();

  const normalizedCallId = Number(callId);
  const socket = useSocket(expertData?.expertId, "expert");
  
  // ✅ FIX 2: Add streamRef to store media stream
  const streamRef = useRef(null);
  const callIdRef = useRef(normalizedCallId);
  const callStartedRef = useRef(false);
  
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

  useEffect(() => {
    callIdRef.current = normalizedCallId;
  }, [normalizedCallId]);

  // ✅ FIX 3: Cleanup mic tracks properly
  const cleanupMedia = useCallback(() => {
    console.log("🧹 Expert cleaning up media tracks");
    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`🛑 Stopped expert track: ${track.kind}`);
      });
      streamRef.current = null;
    }
    
    // Clear audio element srcObject
    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }
    
    closePeer();
  }, []);

  // ✅ Handle incoming call data
  useEffect(() => {
    const onIncoming = (data) => {
      if (Number(data.callId) !== callIdRef.current) return;

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
  }, [socket]);

  // ✅ Timer
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

  // ✅ Socket core events
  useEffect(() => {
    if (!callId) return;

    const onConnected = ({ callId: connectedId }) => {
      if (Number(connectedId) !== callIdRef.current) return;
      setSeconds(0);
      setCallState("connected");
    };

    const onEnded = ({ callId: endedId }) => {
      if (Number(endedId) !== callIdRef.current) return;
      setCallState("ended");
      callStartedRef.current = false;
      
      cleanupMedia();
      
      setTimeout(() => navigate("/expert/home", { replace: true }), 1000);
    };

    const onBusy = () => {
      console.log("🚫 Expert: Call rejected/busy");
      setCallState("ended");
      
      cleanupMedia();
      
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
  }, [socket, navigate, callId, cleanupMedia]);

  // ✅ WebRTC events
  useEffect(() => {
    if (!callId) return;

    const onOffer = async ({ callId: incomingId, offer }) => {
      if (Number(incomingId) !== callIdRef.current) return;

      console.log("📡 Expert: Received WebRTC offer");

      // ✅ FIX 2: Pass stream to createPeer
      await createPeer({ 
        socket, 
        callId: callIdRef.current, 
        audioRef,
        stream: streamRef.current // ⭐ CRITICAL: Pass the stored stream
      });
      
      await setRemote(offer);

      const answer = await createAnswer();
      socket.emit("webrtc:answer", { callId: callIdRef.current, answer });
    };

    const onIce = ({ callId: iceId, candidate }) => {
      if (Number(iceId) !== callIdRef.current) return;
      addIce(candidate);
    };

    socket.on("webrtc:offer", onOffer);
    socket.on("webrtc:ice", onIce);

    return () => {
      socket.off("webrtc:offer", onOffer);
      socket.off("webrtc:ice", onIce);
    };
  }, [socket, callId]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("🧹 Expert cleanup");
      cleanupMedia();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cleanupMedia]);

  // ✅ Actions
  const acceptCall = useCallback(async () => {
    if (callState !== "incoming") return;

    try {
      // ✅ FIX 2: Store stream in ref
      streamRef.current = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      console.log("✅ Expert microphone permission granted, stream:", streamRef.current);
      
      socket.emit(CALL_EVENTS.ACCEPT, { callId: callIdRef.current });
    } catch (error) {
      console.error("❌ Failed to get microphone permission:", error);
    }
  }, [callState, socket]);

  const rejectCall = useCallback(() => {
    console.log("❌ Expert: Rejecting call", callIdRef.current);
    socket.emit(CALL_EVENTS.REJECT, { callId: callIdRef.current });
    
    cleanupMedia();
    navigate("/expert/home", { replace: true });
  }, [socket, navigate, cleanupMedia]);

  const endCall = useCallback(() => {
    console.log("🔚 Expert: Ending call", callIdRef.current);
    socket.emit(CALL_EVENTS.END, { callId: callIdRef.current });
    
    cleanupMedia();
    navigate("/expert/home", { replace: true });
  }, [socket, navigate, cleanupMedia]);

  const toggleMuteClick = useCallback(() => {
    setMuted((m) => {
      toggleMute(!m);
      return !m;
    });
  }, []);

  return (
    <PageWrapper>
      <CallCard>
        <audio ref={audioRef} autoPlay playsInline />

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
                  console.log("🔥 ACCEPT CLICKED", callIdRef.current);
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