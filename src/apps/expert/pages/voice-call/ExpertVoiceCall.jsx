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
  handleSocketReconnect,
} from "../../../../shared/webrtc/voicePeer";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=44";

export default function ExpertVoiceCall() {
  const { callId } = useParams();
  const navigate = useNavigate();
  const { expertData } = useExpert();

  // ✅ 1️⃣ Use normalizedCallId for all checks
  const normalizedCallId = Number(callId);
  const socket = useSocket(expertData?.expertId, "expert");
  
  // Refs for stability
  const streamRef = useRef(null);
  const callIdRef = useRef(normalizedCallId);
  const callStartedRef = useRef(false);
  
  // Refs for protection
  const callStateRef = useRef("incoming");
  const makingAnswerRef = useRef(false);
  const isCleaningUpRef = useRef(false);
  
  const [callState, setCallState] = useState("incoming");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const [caller, setCaller] = useState({
    name: "Incoming Caller",
    role: "User",
    avatar: DEFAULT_AVATAR,
  });

  // Keep callState in sync with ref
  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  useEffect(() => {
    callIdRef.current = normalizedCallId;
  }, [normalizedCallId]);

  // Cleanup media tracks
  const cleanupMedia = useCallback(() => {
    console.log("🧹 Expert cleaning up media tracks");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`🛑 Stopped expert track: ${track.kind}`);
      });
      streamRef.current = null;
    }
    
    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }
    
    closePeer();
  }, []);

  // Handle incoming call data
  useEffect(() => {
    const onIncoming = (data) => {
      if (Number(data.callId) !== callIdRef.current) return;

      console.log("📞 Incoming call data:", data);

      // ✅ 3️⃣ Clear reconnecting state on new incoming
      setReconnecting(false);

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

  // ✅ 4️⃣ Timer with extra safety
  useEffect(() => {
    if (callState === "connected") {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setSeconds((s) => s + 1);
        }, 1000);
      }
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

  // ✅ 1️⃣ Socket core events (using normalizedCallId)
  useEffect(() => {
    if (!normalizedCallId) return;

    const onConnected = ({ callId: connectedId }) => {
      if (Number(connectedId) !== callIdRef.current) return;
      setReconnecting(false);
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
  }, [socket, navigate, cleanupMedia, normalizedCallId]); // ✅ Using normalizedCallId

  // Socket reconnect handler
  useEffect(() => {
    if (!socket) return;

    const onReconnect = () => {
      console.log("🔄 Expert socket reconnected");
      setReconnecting(true);

      handleSocketReconnect(); // peer reset

      if (callIdRef.current && callStateRef.current === "connected") {
        setTimeout(() => {
          console.log("♻ Recreating answer after reconnect");
          // The offer will come from user automatically
          setReconnecting(false);
        }, 400);
      }
    };

    socket.io?.on("reconnect", onReconnect);
    return () => socket.io?.off("reconnect", onReconnect);
  }, [socket]);

  // ✅ 1️⃣ & 2️⃣ WebRTC events with ANSWER SPAM PROTECTION + STREAM GUARD
  useEffect(() => {
    if (!normalizedCallId) return;

    const onOffer = async ({ callId: incomingId, offer }) => {
      if (Number(incomingId) !== callIdRef.current) return;

      // ✅ 3️⃣ Clear reconnecting when offer arrives
      setReconnecting(false);

      if (makingAnswerRef.current) {
        console.log("🛡 Answer already in progress");
        return;
      }

      // ✅ 2️⃣ GUARD: Wait for mic stream to be ready
      if (!streamRef.current) {
        console.log("⏳ Waiting for mic before answering");
        return;
      }

      makingAnswerRef.current = true;

      try {
        console.log("📡 Expert: Received WebRTC offer");

        await createPeer({ 
          socket, 
          callId: callIdRef.current, 
          audioRef,
          stream: streamRef.current
        });

        await setRemote(offer);

        const answer = await createAnswer();

        socket.emit("webrtc:answer", { 
          callId: callIdRef.current, 
          answer 
        });

        console.log("✅ Expert: Answer sent");
      } catch (err) {
        console.error("❌ Answer failed", err);
      } finally {
        makingAnswerRef.current = false;
      }
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
  }, [socket, normalizedCallId]); // ✅ Using normalizedCallId

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("🧹 Expert cleanup");
      cleanupMedia();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cleanupMedia]);

  // ACCEPT CALL - DOUBLE CLICK GUARD
  const acceptCall = useCallback(async () => {
    if (callStateRef.current !== "incoming") return;

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: { ideal: 1 },
          sampleRate: { ideal: 16000 },
        }
      });
      console.log("✅ Expert microphone permission granted, stream:", streamRef.current);
      
      socket.emit(CALL_EVENTS.ACCEPT, { callId: callIdRef.current });
    } catch (error) {
      console.error("❌ Failed to get microphone permission:", error);
    }
  }, [socket]);

  // REJECT CALL
  const rejectCall = useCallback(() => {
    console.log("❌ Expert: Rejecting call", callIdRef.current);
    socket.emit(CALL_EVENTS.REJECT, { callId: callIdRef.current });
    
    cleanupMedia();
    navigate("/expert/home", { replace: true });
  }, [socket, navigate, cleanupMedia]);

  // SAFE END CALL (billing safe)
  const endCall = useCallback(() => {
    if (isCleaningUpRef.current) return;
    isCleaningUpRef.current = true;

    console.log("🔚 Expert: Ending call", callIdRef.current);
    socket.emit(CALL_EVENTS.END, { callId: callIdRef.current });

    setTimeout(() => {
      cleanupMedia();
      navigate("/expert/home", { replace: true });
      isCleaningUpRef.current = false;
    }, 200);
  }, [socket, navigate, cleanupMedia]);

  const toggleMuteClick = useCallback(() => {
    setMuted((m) => {
      toggleMute(!m);
      
      // Optional: Emit mute status to server
      if (callIdRef.current) {
        socket.emit("call:mute", {
          callId: callIdRef.current,
          muted: !m
        });
      }
      
      return !m;
    });
  }, [socket]);

  return (
    <PageWrapper>
      <CallCard>
        <audio ref={audioRef} autoPlay playsInline />

        <ExpertAvatarWrapper>
          <ExpertAvatar src={caller.avatar} />
        </ExpertAvatarWrapper>

        <ExpertName>{caller.name}</ExpertName>
        <ExpertRole>{caller.role}</ExpertRole>

        {/* Reconnecting UI */}
        {reconnecting && callState === "connected" && (
          <StatusText>🔄 RECONNECTING...</StatusText>
        )}

        {callState === "incoming" && (
          <>
            <StatusText>INCOMING VOICE CALL</StatusText>
            <IncomingActions>
              <ActionBtn
                $accept
                // ✅ 5️⃣ Disable button when not in incoming state
                disabled={callState !== "incoming"}
                onClick={acceptCall}
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