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
import BackButton from "../../components/BackButton/BackButton";

import {
  createPeer,
  closePeer,
  setRemote,
  addIce,
  toggleMute,
  handleSocketReconnect,
  getStats,
  attachRemoteAudio,
  createAndSendOffer,
  getLocalStream,
  getPeerConnection,
  ensureAudioPlaying,
  createAnswer,
} from "../../../../shared/webrtc/voicePeer";

import { CALL_EVENTS } from "../../../../shared/constants/call.constants";
import { soundManager } from "../../../../shared/services/sound/soundManager";
import { SOUNDS } from "../../../../shared/services/sound/soundRegistry";
import { buildTrackingPayload, trackLeadEvent } from "../../../../shared/utils/leadTracking";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=44";

export default function VoiceCall() {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const { experts } = useExpert();
  const { user } = useAuth();
  const userId = user?.id;
  const socket = useSocket(userId, "user");
  const audioRef = useRef(null);
  const location = useLocation();
  const profileSlugRef = useRef(location.state?.slug || null);

  const validModes = ["per_minute", "session", "subscription"];

  const pricingMode = validModes.includes(location.state?.pricingMode)
    ? location.state.pricingMode
    : "per_minute";

  // Refs for stability
  const callIdRef = useRef(null);
  const callStartedRef = useRef(false);
  const callStateRef = useRef("idle");
  const makingOfferRef = useRef(false);
  const makingAnswerRef = useRef(false);
  const isCleaningUpRef = useRef(false);
  const cleanupExecutedRef = useRef(false);
  const localStreamRef = useRef(null);
  const lastVisibilityResumeRef = useRef(0);
  const reconnectAttemptsRef = useRef(0);
  const retryOfferCountRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const MAX_OFFER_RETRIES = 3;

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
  const trackedOutcomeRef = useRef(null);

  // Sync callState to ref
  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  const goBackToProfile = useCallback(() => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    navigate(`/user/experts/${expert?.slug}`, { replace: true });
  }, [navigate, expert?.slug]);

  const trackCallOutcome = useCallback(
    (eventPath, actionLabel) => {
      if (trackedOutcomeRef.current === eventPath) return;
      trackedOutcomeRef.current = eventPath;
      trackLeadEvent(
        eventPath,
        buildTrackingPayload({
          user,
          sourcePage: "voice_call",
          actionLabel,
          extra: {
            expert_id: Number(expertId),
            contact_consent: true,
            can_show_contact_to_expert: true,
          },
        })
      );
    },
    [expertId, user]
  );

  useEffect(() => {
    callIdRef.current = callId;
  }, [callId]);

  // Attach remote audio ONLY once on mount
  useEffect(() => {
    attachRemoteAudio(audioRef);
  }, []);
  
useEffect(() => {
  console.log("Expert Data:", expert);
}, [expert]);
  // Preload microphone once
  useEffect(() => {
  const requestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      localStreamRef.current = stream;
      console.log("🎤 Microphone ready");
    } catch (err) {
      console.error("🎤 Microphone permission denied:", err);
    }
  };

  if (!localStreamRef.current) {
    requestMic();
  }
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

  // Audio health check
  useEffect(() => {
    if (callState !== "connected") return;
    
    const audioCheckInterval = setInterval(async () => {
      await ensureAudioPlaying();
    }, 5000);
    
    return () => clearInterval(audioCheckInterval);
  }, [callState]);

  // Cleanup helpers with execution guard
  const cleanupHard = useCallback(async () => {
    if (cleanupExecutedRef.current) return;
    cleanupExecutedRef.current = true;
    
    await closePeer(true);
    callStartedRef.current = false;
    reconnectAttemptsRef.current = 0;
    retryOfferCountRef.current = 0;
    makingOfferRef.current = false; // Reset making offer flag
    
    setTimeout(() => {
      cleanupExecutedRef.current = false;
    }, 500);
  }, []);

  const cleanupSoft = useCallback(async () => {
    if (cleanupExecutedRef.current) return;
    cleanupExecutedRef.current = true;
    
    await closePeer(false);
    callStartedRef.current = false;
    makingOfferRef.current = false; // Reset making offer flag
    
    setTimeout(() => {
      cleanupExecutedRef.current = false;
    }, 500);
  }, []);

  // Start call
 const startCall = useCallback(async () => {
  if (callStartedRef.current) return;

  try {
    if (!localStreamRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      localStreamRef.current = stream;
    }
  } catch (err) {
    alert("Microphone permission required for voice calls");
    console.error("Mic permission failed:", err);
    return;
  }

  callStartedRef.current = true;
  setCallState("calling");

  try {
    socket.emit(CALL_EVENTS.START, {
      expertId: Number(expertId),
      pricing_mode: pricingMode,
    });
  } catch (error) {
    callStartedRef.current = false;
    setCallState("idle");
  }
}, [expertId, socket, pricingMode]);

  // Auto-start on mount
  useEffect(() => {
    if (!resumeChecked) return;
    if (!isResumed && !callStartedRef.current) {
      startCall();
    }
  }, [resumeChecked, isResumed, startCall]);

  // WebRTC Offer Handler - FIXED makingOfferRef locking
  const handleWebRTCOffer = useCallback(async (currentCallId) => {
    if (
      callStateRef.current === "ended" ||
      callStateRef.current === "offline" ||
      callStateRef.current === "busy"
    ) {
      console.log("⛔ Skipping offer - call already ended/offline/busy");
      return;
    }
    
    if (!currentCallId || makingOfferRef.current) return;

    console.log("📡 Creating WebRTC offer for call:", currentCallId);
    makingOfferRef.current = true;

    try {
     let currentStream = getLocalStream() || localStreamRef.current;

if (!currentStream) {
  currentStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });

  localStreamRef.current = currentStream;
}
      await createPeer({
        socket,
        callId: currentCallId,
        audioRef,
        stream: currentStream,
      });

      const success = await createAndSendOffer();
      
      if (!success) {
        console.error("❌ Failed to create and send offer");
        
        if (retryOfferCountRef.current < MAX_OFFER_RETRIES) {
          retryOfferCountRef.current++;
          const retryCallId = currentCallId;
          // Reset makingOfferRef for retry
          makingOfferRef.current = false;
          setTimeout(() => {
            if (
              callStateRef.current !== "ended" &&
              callStateRef.current !== "offline" &&
              callStateRef.current !== "busy" &&
              callIdRef.current === retryCallId
            ) {
              handleWebRTCOffer(retryCallId);
            }
          }, 1000);
        } else {
          retryOfferCountRef.current = 0;
          setCallState("ended");
          await cleanupHard();
        }
      } else {
        console.log("✅ Offer sent to expert");
        retryOfferCountRef.current = 0;
      }
    } catch (err) {
      console.error("❌ WebRTC offer failed:", err);
      setCallState("ended");
      await cleanupHard();
    } finally {
      // ALWAYS reset makingOfferRef - FIXED
      makingOfferRef.current = false;
    }
  }, [socket, cleanupHard]);

  useEffect(() => {
    const onResume = (data) => {
      setIsResumed(true);
      setCallId(data.callId);
      setCallState("connected");
      callStartedRef.current = true;
      setReconnecting(false);
      reconnectAttemptsRef.current = 0;
      retryOfferCountRef.current = 0;
      makingOfferRef.current = false; // Reset making offer flag

      const alreadyElapsed = Math.floor(
        (Date.now() - new Date(data.startedAt)) / 1000
      );

      setSeconds(alreadyElapsed);

      if (!makingOfferRef.current) {
        setTimeout(() => {
          handleWebRTCOffer(data.callId);
        }, 300);
      }
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
      reconnectAttemptsRef.current = 0;
      retryOfferCountRef.current = 0;
      makingOfferRef.current = false; // Reset making offer flag
      setCallId(connectedCallId);
      setSeconds(0);
      setCallState("connected");

      if (!makingOfferRef.current) {
        setTimeout(() => {
          handleWebRTCOffer(connectedCallId);
        }, 400);
      }
    };

    const onWebRTCAnswer = async ({ callId: answerCallId, answer, attemptId }) => {
      if (answerCallId !== callIdRef.current) return;

      try {
        const applied = await setRemote(answer, attemptId);
        console.log("✅ Remote description set", { applied });
      } catch (err) {
        console.error("❌ Failed to set remote:", err);
      }
    };

    const onWebRTCIce = ({ callId: iceCallId, candidate, attemptId }) => {
      if (iceCallId !== callIdRef.current) return;
      addIce(candidate, attemptId);
    };

    const onBusy = () => {
      soundManager.stopAll();
      trackCallOutcome("call-declined", "Call Declined");
      callStartedRef.current = false;
      setCallState("busy");
      setReconnecting(false);
      makingOfferRef.current = false; // Reset making offer flag
      cleanupHard();
    };

    const onOffline = () => {
      soundManager.stopAll();
      trackCallOutcome("call-not-answered", "Call Not Answered");
      callStartedRef.current = false;
      setCallState("offline");
      setReconnecting(false);
      makingOfferRef.current = false; // Reset making offer flag
    };

    const onEnded = ({ reason }) => {
      soundManager.stopAll();
      console.log("❌ Call ended:", reason);
      if (callStateRef.current !== "connected") {
        trackCallOutcome("call-failed", "Call Failed");
      }
      callStartedRef.current = false;
      setCallState("ended");
      setReconnecting(false);
      makingOfferRef.current = false; // Reset making offer flag
      cleanupHard();
    };

    const onResumed = ({ callId: resumedCallId }) => {
      console.log("🔁 call:resumed event received from socket for call:", resumedCallId);
      if (Number(resumedCallId) !== Number(callIdRef.current)) {
        console.log("⏭️ call:resumed callId mismatch, ignoring");
        return;
      }
      setReconnecting(false);
      setCallState("connected");
      
      // Reset negotiation lock flags so a fresh offer can be generated
      makingOfferRef.current = false;
      makingAnswerRef.current = false;
      retryOfferCountRef.current = 0;
      
      // Initiate renegotiation by creating a new peer connection and sending offer
      console.log("📡 Triggering WebRTC renegotiation on call:resumed");
      setTimeout(() => {
        if (callStateRef.current === "connected" && Number(callIdRef.current) === Number(resumedCallId)) {
          handleWebRTCOffer(resumedCallId);
        }
      }, 500);
    };

    const onOffer = async ({ callId: incomingId, offer, attemptId }) => {
      if (Number(incomingId) !== callIdRef.current) return;
      if (
        callStateRef.current === "ended" ||
        callStateRef.current === "offline" ||
        callStateRef.current === "busy"
      ) {
        return;
      }
      if (makingAnswerRef.current) return;

      const currentPC = getPeerConnection();

      // Duplicate SDP protection
      if (currentPC?.remoteDescription?.sdp === offer.sdp) {
        console.log("⏭️ Duplicate offer ignored");
        return;
      }

      console.log("📡 Received WebRTC offer from expert");
      makingAnswerRef.current = true;

      try {
        let currentStream = getLocalStream() || localStreamRef.current;
        if (!currentStream) {
          currentStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          localStreamRef.current = currentStream;
        }

        let pc = currentPC;
        if (!pc || pc.connectionState === "closed") {
          console.log("📡 Creating new peer for answer");
          pc = await createPeer({
            socket,
            callId: callIdRef.current,
            audioRef,
            stream: currentStream,
          });
        } else {
          console.log("♻ Reusing existing peer for answer");
        }

        if (pc.signalingState !== "stable") {
          console.log("⛔ Skipping answer — not stable:", pc.signalingState);
          return;
        }

        const applied = await setRemote(offer, attemptId);
        if (!applied) {
          console.log("❌ Failed to set remote description");
          return;
        }

        const answer = await createAnswer();

        socket.emit("webrtc:answer", {
          callId: callIdRef.current,
          answer,
          attemptId,
        });

        console.log("✅ Answer sent to expert");
      } catch (err) {
        console.error("❌ Answer failed:", err);
      } finally {
        makingAnswerRef.current = false;
      }
    };

    socket.on("call:created", onCallCreated);
    socket.on(CALL_EVENTS.CONNECTED, onConnected);
    socket.on("webrtc:offer", onOffer);
    socket.on("webrtc:answer", onWebRTCAnswer);
    socket.on("webrtc:ice", onWebRTCIce);
    socket.on(CALL_EVENTS.BUSY, onBusy);
    socket.on(CALL_EVENTS.OFFLINE, onOffline);
    socket.on(CALL_EVENTS.ENDED, onEnded);
    socket.on("call:resumed", onResumed);

    return () => {
      console.log("🧹 Cleaning up voice call listeners");
      socket.off("call:created", onCallCreated);
      socket.off(CALL_EVENTS.CONNECTED, onConnected);
      socket.off("webrtc:offer", onOffer);
      socket.off("webrtc:answer", onWebRTCAnswer);
      socket.off("webrtc:ice", onWebRTCIce);
      socket.off(CALL_EVENTS.BUSY, onBusy);
      socket.off(CALL_EVENTS.OFFLINE, onOffline);
      socket.off(CALL_EVENTS.ENDED, onEnded);
      socket.off("call:resumed", onResumed);
      cleanupHard();
    };
  }, [socket, handleWebRTCOffer, cleanupHard, trackCallOutcome]);

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

    const onReconnect = async () => {
      console.log("🔄 Socket reconnected – reinitializing peer");
      setReconnecting(true);
      reconnectAttemptsRef.current++;
      
      if (reconnectAttemptsRef.current > MAX_RECONNECT_ATTEMPTS) {
        console.error("❌ Max reconnection attempts reached, ending call");
        setCallState("ended");
        await cleanupHard();
        return;
      }
      
      makingOfferRef.current = false; // Reset making offer flag on reconnect
      await handleSocketReconnect();
      socket.emit("call:resume_check");
    };

    socket.io?.on("reconnect", onReconnect);

    return () => {
      socket.io?.off("reconnect", onReconnect);
    };
  }, [socket, cleanupHard]);

  // Visibility change with debounce
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (callStateRef.current !== "connected" || !callIdRef.current) return;
      
      const now = Date.now();
      if (now - lastVisibilityResumeRef.current < 3000) {
        console.log("⏭️ Debouncing visibility resume check");
        return;
      }
      lastVisibilityResumeRef.current = now;
      
      console.log("👁️ Tab visible, checking resume");
      socket.emit("call:resume_check");
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [socket]);

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
    if (isCleaningUpRef.current || cleanupExecutedRef.current) return;
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
      trackCallOutcome("call-failed", "Call Cancelled Before Connect");
      socket.emit("call:cancel_attempt", {
        expertId: Number(expertId),
      });
    }

    setTimeout(async () => {
      await cleanupHard();
      goBackToProfile();
      isCleaningUpRef.current = false;
    }, 200);
  }, [goBackToProfile, socket, expertId, cleanupHard, trackCallOutcome]);

  // Mute toggle
  const handleMute = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    toggleMute(newMuted);

    // Unlock browser audio context on user interaction
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

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
        cleanupHard();
        goBackToProfile();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [callState, goBackToProfile, cleanupHard]);

  const renderWaveAnimation = () => (
    <WaveContainer>
      {[0, 1, 2, 3, 4].map((_, index) => (
        <WaveBar key={index} $index={index} />
      ))}
    </WaveContainer>
  );

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
      <audio ref={audioRef} autoPlay={true} playsInline={true} muted={false} />

      {callState === "connected" && networkQuality !== "good" && (
        <NetworkStatus $quality={networkQuality}>
          <span>{networkQuality === "average" ? "⚠️" : "❌"}</span>
          <span>{networkQuality === "average" ? "Unstable" : "Poor"} Connection</span>
        </NetworkStatus>
      )}

      {reconnecting && callState === "connected" && (
        <ReconnectingBadge>Reconnecting...</ReconnectingBadge>
      )}

      <CallCard>
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
                X
              </HeaderControlBtn>
            )}

            {(callState === "busy" || callState === "offline" || callState === "ended") && (
              <BackButton onClick={goBackToProfile} iconOnly />
            )}
          </HeaderControls>
        </CallHeader>

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

          {callState === "connected" && renderWaveAnimation()}
          {callState === "calling" && renderConnectingAnimation()}
        </ExpertInfo>

        <BottomActions>
          {callState === "connected" && (
            <ActionButton $danger onClick={handleEnd}>
              📞 End Call
            </ActionButton>
          )}

          {callState === "calling" && (
            <ActionButton $danger onClick={handleEnd}>
              X Cancel Call
            </ActionButton>
          )}

          {(callState === "busy" || callState === "offline") && (
            <ActionButton $primary onClick={goBackToProfile}>
              Back to Profile
            </ActionButton>
          )}

          {callState === "ended" && (
            <ActionButton $primary onClick={goBackToProfile}>
              Back to Profile
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
