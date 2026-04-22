// VoiceCall.jsx
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  PageWrapper,
  CallCard,
  CallHeader,
  TimerSection,
  TimerLabel,
  Timer,
  HeaderControls,
  HeaderControlBtn,
  ExpertInfo,
  ExpertAvatarWrapper,
  ExpertAvatar,
  ExpertName,
  ExpertRole,
  StatusBadge,
  WaveContainer,
  WaveBar,
  ConnectingAnimation,
  ConnectingDots,
  Dot,
  ConnectingText,
  BottomActions,
  ActionButton,
  NetworkStatus,
  ReconnectingBadge,
  Shimmer,
} from "./VoiceCall.styles";

import { usePublicExpert as useExpert } from "../../context/PublicExpertContext";
import { useSocket } from "../../../../shared/hooks/useSocket";
import { useAuth } from "../../../../shared/context/UserAuthContext";

import {
  createPeer,
  closePeer,
  setRemote,
  addIce,
  toggleMute,
  handleSocketReconnect,
  getStats,
  attachRemoteAudio,
} from "../../../../shared/webrtc/voicePeer";

import { CALL_EVENTS } from "../../../../shared/constants/call.constants";
import { soundManager } from "../../../../shared/services/sound/soundManager";
import { SOUNDS } from "../../../../shared/services/sound/soundRegistry";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=44";

export default function VoiceCall() {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const { experts } = useExpert();
  const { user } = useAuth();
  const userId = user?.id;
  const socket = useSocket(userId, "user");
  const audioRef = useRef(null);
  const hasRemoteSetRef = useRef(false);
  const location = useLocation();

  const validModes = ["per_minute", "session", "subscription"];

  const pricingMode = validModes.includes(location.state?.pricingMode)
    ? location.state.pricingMode
    : "per_minute";

  // Refs for stability
  const callIdRef = useRef(null);
  const callStartedRef = useRef(false);
  const callStateRef = useRef("idle");
  const makingOfferRef = useRef(false);
  const isCleaningUpRef = useRef(false);

  const expert = useMemo(() => {
    if (!expertId || !experts?.length) return null;
    return experts.find((e) => Number(e.id) === Number(expertId));
  }, [experts, expertId]);

  const [callState, setCallState] = useState("idle");
  const [callId, setCallId] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [networkQuality, setNetworkQuality] = useState("good");
  const [isResumed, setIsResumed] = useState(false);
  const [resumeChecked, setResumeChecked] = useState(false);
  const navigatedRef = useRef(false);

  // Sync callState to ref
  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  const goBackToProfile = useCallback(() => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    navigate(`/user/experts/${expertId}`, { replace: true });
  }, [navigate, expertId]);

  useEffect(() => {
    callIdRef.current = callId;
  }, [callId]);

  useEffect(() => {
    attachRemoteAudio(audioRef);
  }, []);

  // Sound management
  useEffect(() => {
    if (callState === "calling") {
      soundManager.stopAll();
      soundManager.play(SOUNDS.OUTGOING_CALL, {
        loop: true,
        volume: 0.6,
      });
    }

    if (callState !== "calling") {
      soundManager.stopAll();
    }
  }, [callState]);

  useEffect(() => {
    if (callState !== "connected") return;

    const interval = setInterval(async () => {
      const stats = await getStats();
      const inbound = stats?.find((s) => s.type === "inbound");

      if (!inbound) return;

      const total = inbound.packetsReceived + inbound.packetsLost;
      if (!total) return;

      const loss = inbound.packetsLost / total;

      if (loss < 0.03) setNetworkQuality("good");
      else if (loss < 0.1) setNetworkQuality("average");
      else setNetworkQuality("poor");
    }, 4000);

    return () => clearInterval(interval);
  }, [callState]);

  // Start call
  const startCall = useCallback(async () => {
    if (callStartedRef.current) return;

    callStartedRef.current = true;
    setCallState("calling");

    try {
      socket.emit(CALL_EVENTS.START, {
        expertId: Number(expertId),
        pricing_mode: pricingMode,
      });
    } catch (error) {
      callStartedRef.current = false;
    }
  }, [expertId, socket, pricingMode]);

  // Auto-start on mount
  useEffect(() => {
    if (!resumeChecked) return;
    if (!isResumed && !callStartedRef.current) {
      startCall();
    }
  }, [resumeChecked, isResumed, startCall]);

  // WebRTC Offer Handler
  const handleWebRTCOffer = useCallback(
    async (currentCallId) => {
       hasRemoteSetRef.current = false;
      if (!currentCallId || makingOfferRef.current) return;

      console.log("📡 Creating WebRTC offer for call:", currentCallId);
      makingOfferRef.current = true;

      try {
        const pc = await createPeer({
          socket,
          callId: currentCallId,
          audioRef,
        });

        if (pc.signalingState !== "stable") {
          console.log("⛔ Skipping offer — not stable");
          return;
        }

        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: false,
        });

        await pc.setLocalDescription(offer);

        socket.emit("webrtc:offer", {
          callId: currentCallId,
          offer,
        });

        console.log("✅ Offer sent to expert");
      } catch (err) {
        console.error("❌ WebRTC offer failed:", err);
        setCallState("ended");
        closePeer();
      } finally {
        makingOfferRef.current = false;
      }
    },
    [socket]
  );

  // Preload audio permissions
  useEffect(() => {
    if (!localStorage.getItem("audio_permission_granted")) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          stream.getTracks().forEach((t) => t.stop());
          localStorage.setItem("audio_permission_granted", "true");
        })
        .catch(console.warn);
    }
  }, []);

  useEffect(() => {
    const onResume = (data) => {
      setIsResumed(true);
      setCallId(data.callId);
      setCallState("connected");
      callStartedRef.current = true;
      hasRemoteSetRef.current = false;

      const alreadyElapsed = Math.floor(
        (Date.now() - new Date(data.startedAt)) / 1000
      );

      setSeconds(alreadyElapsed);

      setTimeout(() => {
        handleWebRTCOffer(data.callId);
      }, 300);
    };

    socket.on("call:resume_data", onResume);
    socket.emit("call:resume_check");

    const t = setTimeout(() => setResumeChecked(true), 800);
    return () => {
      clearTimeout(t);
      socket.off("call:resume_data", onResume);
    };
  }, [socket, handleWebRTCOffer]);

  // Socket listeners
  useEffect(() => {
    console.log("📡 Setting up voice call listeners");

    const onCallCreated = ({ callId }) => {
      console.log("✅ Call created:", callId);
      setCallId(callId);
      callIdRef.current = callId;
    };

    const onConnected = ({ callId: connectedCallId }) => {
      soundManager.stopAll();
      console.log("✅ Call connected:", connectedCallId);
      setReconnecting(false);
      setCallId(connectedCallId);
      setSeconds(0);
      setCallState("connected");
      hasRemoteSetRef.current = false;

      if (!makingOfferRef.current) {
        setTimeout(() => {
          handleWebRTCOffer(connectedCallId);
        }, 400);
      }
    };

    const onWebRTCAnswer = async ({ callId: answerCallId, answer }) => {
      if (answerCallId !== callIdRef.current) return;

      try {
        if (hasRemoteSetRef.current) {
  console.log("⛔ Duplicate answer ignored");
  return;
}

const applied = await setRemote(answer);
hasRemoteSetRef.current = Boolean(applied);
        console.log("✅ Remote description set");
      } catch (err) {
        console.error("❌ Failed to set remote:", err);
      }
    };

    const onWebRTCIce = ({ callId: iceCallId, candidate }) => {
      if (iceCallId !== callIdRef.current) return;
      addIce(candidate);
    };

    const onBusy = () => {
      soundManager.stopAll();
      callStartedRef.current = false;
      setCallState("busy");
      closePeer();
    };

    const onOffline = ({ message }) => {
      soundManager.stopAll();
      callStartedRef.current = false;
      setCallState("offline");
    };

    const onEnded = ({ reason }) => {
      soundManager.stopAll();
      console.log("❌ Call ended:", reason);
      callStartedRef.current = false;
      setCallState("ended");
      closePeer();
    };

    socket.on("call:created", onCallCreated);
    socket.on(CALL_EVENTS.CONNECTED, onConnected);
    socket.on("webrtc:answer", onWebRTCAnswer);
    socket.on("webrtc:ice", onWebRTCIce);
    socket.on(CALL_EVENTS.BUSY, onBusy);
    socket.on(CALL_EVENTS.OFFLINE, onOffline);
    socket.on(CALL_EVENTS.ENDED, onEnded);

    return () => {
      console.log("🧹 Cleaning up voice call listeners");
      socket.off("call:created", onCallCreated);
      socket.off(CALL_EVENTS.CONNECTED, onConnected);
      socket.off("webrtc:answer", onWebRTCAnswer);
      socket.off("webrtc:ice", onWebRTCIce);
      socket.off(CALL_EVENTS.BUSY, onBusy);
      socket.off(CALL_EVENTS.OFFLINE, onOffline);
      socket.off(CALL_EVENTS.ENDED, onEnded);
      closePeer();
    };
  }, [socket, handleWebRTCOffer]);

  useEffect(() => {
    const handleExpertOnline = ({ expertId }) => {
      console.log("🟢 Expert now online");

      if (callStateRef.current === "offline" && !callStartedRef.current) {
        setTimeout(() => {
          startCall();
        }, 1000);
      }
    };

    socket.on("expert_now_online", handleExpertOnline);

    return () => socket.off("expert_now_online", handleExpertOnline);
  }, [socket, startCall]);

  // Reconnect handler
  useEffect(() => {
    if (!socket) return;

    const onReconnect = () => {
      console.log("🔄 Socket reconnected – reinitializing peer");
      setReconnecting(true);
      socket.emit("call:resume_check");
      handleSocketReconnect();
      hasRemoteSetRef.current = false;

      if (callIdRef.current && callStateRef.current === "connected") {
        setTimeout(() => {
          handleWebRTCOffer(callIdRef.current);
        }, 700);
      }
    };

    socket.io?.on("reconnect", onReconnect);

    return () => {
      socket.io?.off("reconnect", onReconnect);
    };
  }, [socket, handleWebRTCOffer]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (callStateRef.current !== "connected" || !callIdRef.current) return;

      attachRemoteAudio(audioRef);
      socket.emit("call:resume_check");

      setTimeout(() => {
        if (callIdRef.current) {
          handleWebRTCOffer(callIdRef.current);
        }
      }, 250);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [socket, handleWebRTCOffer]);

  // Timer
  useEffect(() => {
    if (callState === "connected" && !timerRef.current) {
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

  const formatTime = () => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // End call
  const handleEnd = useCallback(() => {
    if (isCleaningUpRef.current) return;
    isCleaningUpRef.current = true;

    console.log("🔚 Ending call:", callIdRef.current);

    soundManager.stopAll();

    if (callIdRef.current) {
      socket.emit(CALL_EVENTS.END, {
        callId: callIdRef.current,
        by: "user",
      });
    } else {
      console.log("⚠️ No callId yet → cancelling attempt");
      socket.emit("call:cancel_attempt", {
        expertId: Number(expertId),
      });
    }

    setTimeout(() => {
      closePeer();
      goBackToProfile();
      callStartedRef.current = false;
      isCleaningUpRef.current = false;
    }, 200);
  }, [goBackToProfile, socket, expertId]);

  // Mute toggle
  const handleMute = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    toggleMute(newMuted);

    if (callIdRef.current) {
      socket.emit("call:mute", {
        callId: callIdRef.current,
        muted: newMuted,
      });
    }
  }, [muted, socket]);

  // Auto-navigation for ended states
  useEffect(() => {
    if (
      callState === "ended" ||
      callState === "busy" ||
      callState === "offline"
    ) {
      const timer = setTimeout(() => {
        closePeer();
        goBackToProfile();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [callState, goBackToProfile]);

  // Render wave animation for connected state
  const renderWaveAnimation = () => (
    <WaveContainer>
      {[0, 1, 2, 3, 4].map((_, index) => (
        <WaveBar key={index} $index={index} />
      ))}
    </WaveContainer>
  );

  // Render connecting animation
  const renderConnectingAnimation = () => (
    <ConnectingAnimation>
      <ConnectingDots>
        <Dot $delay={0} />
        <Dot $delay={0.2} />
        <Dot $delay={0.4} />
      </ConnectingDots>
      <ConnectingText>Connecting to {expert?.name || "Expert"}...</ConnectingText>
    </ConnectingAnimation>
  );

  const getStatusText = () => {
    switch (callState) {
      case "calling":
        return "Calling...";
      case "connected":
        return "Connected";
      case "ended":
        return "Call Ended";
      case "busy":
        return "Busy";
      case "offline":
        return "Offline";
      default:
        return "";
    }
  };

  const getStatusType = () => {
    switch (callState) {
      case "calling":
        return "calling";
      case "connected":
        return "connected";
      case "ended":
        return "ended";
      case "busy":
        return "busy";
      case "offline":
        return "offline";
      default:
        return "";
    }
  };

  return (
    <PageWrapper>
      <audio ref={audioRef} autoPlay playsInline />

      {/* Network Status */}
      {callState === "connected" && networkQuality !== "good" && (
        <NetworkStatus $quality={networkQuality}>
          <span>{networkQuality === "average" ? "⚠️" : "❌"}</span>
          <span>{networkQuality === "average" ? "Unstable" : "Poor"} Connection</span>
        </NetworkStatus>
      )}

      {/* Reconnecting Badge */}
      {reconnecting && callState === "connected" && (
        <ReconnectingBadge>Reconnecting...</ReconnectingBadge>
      )}

      <CallCard>
        {/* Header with Timer and Controls */}
        <CallHeader>
          {callState === "connected" && (
            <TimerSection>
              <TimerLabel>Call Duration</TimerLabel>
              <Timer>{formatTime()}</Timer>
            </TimerSection>
          )}

          {callState === "calling" && (
            <TimerSection>
              <TimerLabel>Connecting</TimerLabel>
              <Timer>00:00</Timer>
            </TimerSection>
          )}

          <HeaderControls>
            {callState === "connected" && (
              <>
                <HeaderControlBtn
                  onClick={handleMute}
                  $active={muted}
                  title={muted ? "Unmute" : "Mute"}
                >
                  {muted ? "🔇" : "🎤"}
                </HeaderControlBtn>
                <HeaderControlBtn
                  $danger
                  onClick={handleEnd}
                  title="End Call"
                >
                  📞
                </HeaderControlBtn>
              </>
            )}

            {callState === "calling" && (
              <HeaderControlBtn $danger onClick={handleEnd} title="Cancel">
                ✕
              </HeaderControlBtn>
            )}

            {(callState === "busy" || callState === "offline" || callState === "ended") && (
              <HeaderControlBtn onClick={goBackToProfile} title="Back">
                ←
              </HeaderControlBtn>
            )}
          </HeaderControls>
        </CallHeader>

        {/* Expert Info Section */}
        <ExpertInfo>
          <ExpertAvatarWrapper className={callState === "connected" ? "active" : ""}>
            <ExpertAvatar
              src={expert?.profile_photo || DEFAULT_AVATAR}
              alt={expert?.name || "Expert"}
            />
            {callState === "connected" && <Shimmer />}
          </ExpertAvatarWrapper>

          <ExpertName>{expert?.name || "Expert"}</ExpertName>
          <ExpertRole>{expert?.position || "Advisor"}</ExpertRole>

          {callState !== "idle" && (
            <StatusBadge $status={getStatusType()}>
              <span>
                {callState === "connected" && "🔵"}
                {callState === "calling" && "📞"}
                {callState === "ended" && "✓"}
                {callState === "busy" && "⏰"}
                {callState === "offline" && "⚡"}
              </span>
              {getStatusText()}
            </StatusBadge>
          )}

          {/* Wave Animation for Active Call */}
          {callState === "connected" && renderWaveAnimation()}

          {/* Connecting Animation */}
          {callState === "calling" && renderConnectingAnimation()}
        </ExpertInfo>

        {/* Bottom Actions */}
        <BottomActions>
          {callState === "connected" && (
            <ActionButton $danger onClick={handleEnd}>
              📞 End Call
            </ActionButton>
          )}

          {callState === "calling" && (
            <ActionButton $danger onClick={handleEnd}>
              ✕ Cancel Call
            </ActionButton>
          )}

          {(callState === "busy" || callState === "offline") && (
            <ActionButton $primary onClick={goBackToProfile}>
              ← Back to Profile
            </ActionButton>
          )}

          {callState === "ended" && (
            <ActionButton $primary onClick={goBackToProfile}>
              ← Back to Profile
            </ActionButton>
          )}

          {callState === "idle" && (
            <ActionButton $primary onClick={startCall}>
              📞 Start Call
            </ActionButton>
          )}
        </BottomActions>
      </CallCard>
    </PageWrapper>
  );
}