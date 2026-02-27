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
  WaveContainer,
  WaveBar,
  ReconnectingBadge,
  NetworkIndicator,
  Spinner,
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
import { soundManager } from "../../../../shared/services/sound/soundManager";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=44";

export default function ExpertVoiceCall() {
  const { callId } = useParams();
  const navigate = useNavigate();
  const { expertData } = useExpert();

  // ✅ Normalized callId for all checks
  const normalizedCallId = Number(callId);
  const socket = useSocket(expertData?.expertId, "expert");
  
  // Refs for stability
  const streamRef = useRef(null);
  const callIdRef = useRef(normalizedCallId);
  const callStartedRef = useRef(false);
  
  // Refs for protection
  const callStateRef = useRef("connecting");
  const makingAnswerRef = useRef(false);
  const isCleaningUpRef = useRef(false);
  
  const [callState, setCallState] = useState("connecting");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [networkQuality, setNetworkQuality] = useState("good");

  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const [caller, setCaller] = useState({
    name: "Incoming Caller",
    role: "User",
    avatar: DEFAULT_AVATAR,
  });

  // Stop all sounds on mount
  useEffect(() => {
    soundManager.stopAll();
  }, []);

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

  // Auto-start mic on connecting state
  useEffect(() => {
    if (callState !== "connecting") return;
    if (callStartedRef.current) return;

    callStartedRef.current = true;

    const autoStart = async () => {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: { ideal: 1 },
            sampleRate: { ideal: 16000 },
          },
        });

        socket.emit(CALL_EVENTS.ACCEPT, {
          callId: callIdRef.current,
        });

      } catch (err) {
        console.error("❌ Auto mic failed", err);
      }
    };

    autoStart();
  }, [callState, socket]);

  useEffect(() => {
  const onResume = (data) => {
    if (data.callId !== normalizedCallId) return;

    setCallState("connected");

    const alreadyElapsed =
      Math.floor((Date.now() - new Date(data.startedAt)) / 1000);

    setSeconds(alreadyElapsed);
  };

  socket.on("call:resume_data", onResume);
  return () => socket.off("call:resume_data", onResume);
}, [socket, normalizedCallId]);

useEffect(() => {
  if (!streamRef.current) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        streamRef.current = stream;
      })
      .catch(() => {});
  }
}, []);

  // Handle incoming call data
  useEffect(() => {
    const onIncoming = (data) => {
      if (Number(data.callId) !== callIdRef.current) return;

      console.log("📞 Incoming call data:", data);

      // Clear reconnecting state on new incoming
      setReconnecting(false);

      setCaller({
        name: data.user_name || "User",
        role: "User",
        avatar: DEFAULT_AVATAR,
      });

      if (!callStartedRef.current) {
        setCallState("incoming");
      }
    };

    socket.on(CALL_EVENTS.INCOMING, onIncoming);

    return () => {
      socket.off(CALL_EVENTS.INCOMING, onIncoming);
    };
  }, [socket]);

  // Timer with extra safety
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

  // Socket core events
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
      callStartedRef.current = false;
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
  }, [socket, navigate, cleanupMedia, normalizedCallId]);

  // Socket reconnect handler
  useEffect(() => {
    if (!socket) return;

    const onReconnect = () => {
      console.log("🔄 Expert socket reconnected");
      setReconnecting(true);

      handleSocketReconnect();

      if (callIdRef.current && callStateRef.current === "connected") {
        setTimeout(() => {
          console.log("♻ Recreating answer after reconnect");
          setReconnecting(false);
        }, 400);
      }
    };

    socket.io?.on("reconnect", onReconnect);
    return () => socket.io?.off("reconnect", onReconnect);
  }, [socket]);

  // Network quality monitoring (simulated)
  useEffect(() => {
    if (callState === "connected") {
      const interval = setInterval(() => {
        // Simulate network quality - replace with actual WebRTC stats if needed
        const qualities = ["good", "average", "poor"];
        const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
        setNetworkQuality(randomQuality);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [callState]);

  // WebRTC events with ANSWER SPAM PROTECTION + STREAM GUARD
  useEffect(() => {
    if (!normalizedCallId) return;

    const onOffer = async ({ callId: incomingId, offer }) => {
      if (Number(incomingId) !== callIdRef.current) return;
if (callStateRef.current === "ended") return;
      // Clear reconnecting when offer arrives
      setReconnecting(false);

      if (makingAnswerRef.current) {
        console.log("🛡 Answer already in progress");
        return;
      }

      // GUARD: Wait for mic stream to be ready
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
  }, [socket, normalizedCallId]);

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
      callStartedRef.current = true;
      setCallState("connecting");
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

  // Render wave animation for connected state
  const renderWaveAnimation = () => (
    <WaveContainer>
      {[1, 2, 3, 4, 5].map((_, index) => (
        <WaveBar key={index} $index={index} />
      ))}
    </WaveContainer>
  );

  return (
    <PageWrapper>
      <CallCard>
        <audio ref={audioRef} autoPlay playsInline />

        {/* Network Quality Indicator */}
        {callState === "connected" && networkQuality !== "good" && (
          <NetworkIndicator $quality={networkQuality}>
            {networkQuality === "average" ? "Unstable Connection" : "Poor Connection"}
          </NetworkIndicator>
        )}

        {/* Reconnecting UI */}
        {reconnecting && callState === "connected" && (
          <ReconnectingBadge />
        )}

        <ExpertAvatarWrapper>
          <ExpertAvatar 
            src={caller.avatar} 
            alt={caller.name}
          />
        </ExpertAvatarWrapper>

        <ExpertName>{caller.name}</ExpertName>
        <ExpertRole>{caller.role}</ExpertRole>

        {/* Connecting State */}
        {callState === "connecting" && (
          <>
            <StatusText $reconnecting={reconnecting}>
              {reconnecting ? "RECONNECTING..." : "CONNECTING..."}
            </StatusText>
            <Spinner />
          </>
        )}

        {/* Incoming State */}
        {callState === "incoming" && !callStartedRef.current && (
          <>
            <StatusText>INCOMING VOICE CALL</StatusText>
            <IncomingActions>
              <ActionBtn
                $accept
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

        {/* Connected State */}
        {callState === "connected" && (
          <>
            {renderWaveAnimation()}
            <Timer>
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
            </Timer>

            <Controls>
              <ControlBtn 
                $active={muted} 
                onClick={toggleMuteClick}
              >
                {muted ? "🔇" : "🎤"} 
                <span>{muted ? "Unmute" : "Mute"}</span>
              </ControlBtn>

              <ControlBtn $danger onClick={endCall}>
                ❌ <span>End</span>
              </ControlBtn>
            </Controls>
          </>
        )}

        {/* Ended State */}
        {callState === "ended" && (
          <>
            <StatusText>CALL ENDED</StatusText>
            <Spinner />
          </>
        )}

        <Brand>EXPERT YARD — Expert Panel</Brand>
      </CallCard>
    </PageWrapper>
  );
}