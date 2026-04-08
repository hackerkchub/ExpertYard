import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  PageWrapper,
  CallCard,
  TopSection,
  UserBlock,
  Avatar,
  Name,
  CallIconRing,
  StatusText,
  EndCallButton,
  ExpertSection,
  ExpertAvatarWrapper,
  ExpertAvatar,
  ExpertName,
  ExpertRole,
  ConnectingBar,
  Brand,
  Controls,
  ControlBtn,
  Timer,
  ReconnectingBadge,
  WaveContainer,
  WaveBar,
  NetworkStatus,
} from "./VoiceCall.styles";

import { usePublicExpert as useExpert } from "../../context/PublicExpertContext";
import { useSocket } from "../../../../shared/hooks/useSocket";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useLocation } from "react-router-dom";

import {
  createPeer,
  closePeer,
  setRemote,
  addIce,
  toggleMute,
  handleSocketReconnect,
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
    return experts.find(
      (e) => Number(e.id) === Number(expertId)
    );
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

  // Sound management
  useEffect(() => {
    if (callState === "calling") {
      soundManager.stopAll();
      soundManager.play(SOUNDS.OUTGOING_CALL, {
        loop: true,
        volume: 1,
      });
    }

    if (callState !== "calling") {
      soundManager.stopAll();
    }
  }, [callState]);

  // Start call
 const startCall = useCallback(async () => {
  if (callStartedRef.current) return;

  callStartedRef.current = true; // 🔥 FIRST LINE

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
  const handleWebRTCOffer = useCallback(async (currentCallId) => {
    if (!currentCallId || makingOfferRef.current) return;
if (callStateRef.current !== "connected") return;
    console.log("📡 Creating WebRTC offer for call:", currentCallId);
    makingOfferRef.current = true;

    try {
      const pc = await createPeer({
        socket,
        callId: currentCallId,
        audioRef,
      });

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
  }, [socket]);

  // Preload audio permissions
  useEffect(() => {
    if (!localStorage.getItem('audio_permission_granted')) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          stream.getTracks().forEach(t => t.stop());
          localStorage.setItem('audio_permission_granted', 'true');
        })
        .catch(console.warn);
    }
  }, []);

   useEffect(() => {
  const onResume = (data) => {
    setIsResumed(true);

    setCallId(data.callId);
    setCallState("connected");

    const alreadyElapsed =
      Math.floor((Date.now() - new Date(data.startedAt)) / 1000);

    setSeconds(alreadyElapsed);

 if (callStateRef.current === "connected") {
  setTimeout(() => {
    handleWebRTCOffer(data.callId);
  }, 400);
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

    const onConnected = ({ callId: connectedCallId }) => {
      soundManager.stopAll();
      console.log("✅ Call connected:", connectedCallId);
      setReconnecting(false);
      setCallId(connectedCallId);
      setSeconds(0);
      setCallState("connected");
      
      setTimeout(() => {
        handleWebRTCOffer(connectedCallId);
      }, 300);
    };

    const onWebRTCAnswer = async ({ callId: answerCallId, answer }) => {
      if (answerCallId !== callIdRef.current) return;
      
      try {
        await setRemote(answer);
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
      console.log("🚫 Expert busy");
      setCallState("busy");
      closePeer();
    };

  const onOffline = ({ message }) => {
  soundManager.stopAll();

  setCallState("offline");

  alert(message || "Expert is offline. Please try again later.");
};

    const onEnded = ({ reason }) => {
      soundManager.stopAll();
      console.log("❌ Call ended:", reason);
      setCallState("ended");
      closePeer();
    };

    socket.on(CALL_EVENTS.CONNECTED, onConnected);
    socket.on("webrtc:answer", onWebRTCAnswer);
    socket.on("webrtc:ice", onWebRTCIce);
    socket.on(CALL_EVENTS.BUSY, onBusy);
    socket.on(CALL_EVENTS.OFFLINE, onOffline);
    socket.on(CALL_EVENTS.ENDED, onEnded);

    return () => {
      console.log("🧹 Cleaning up voice call listeners");
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

    // 🔥 BEST UX
   if (callStateRef.current === "offline" && !callStartedRef.current) {
  setTimeout(() => {
    startCall(); // 🔥 USE SAME FUNCTION
  }, 1000);
}
  };

  socket.on("expert_now_online", handleExpertOnline);

  return () => socket.off("expert_now_online", handleExpertOnline);
}, [socket , startCall]);

  // Reconnect handler
  useEffect(() => {
    if (!socket) return;

    const onReconnect = () => {
      console.log("🔄 Socket reconnected – reinitializing peer");
      setReconnecting(true);
      handleSocketReconnect();
      
      if (callIdRef.current && callStateRef.current === "connected") {
        setTimeout(() => {
          handleWebRTCOffer(callIdRef.current);
        }, 500);
      }
    };

    socket.io?.on("reconnect", onReconnect);

    return () => {
      socket.io?.off("reconnect", onReconnect);
    };
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

  // Network quality monitoring (simulated)
  useEffect(() => {
    if (callState === "connected") {
      const interval = setInterval(() => {
        // Simulate network quality changes (you can replace with actual WebRTC stats)
        const qualities = ["good", "average", "poor"];
        const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
        setNetworkQuality(randomQuality);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [callState]);

  const formatTime = () => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
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
        by: "user"
      });
    }
    
    setTimeout(() => {
      closePeer();
      goBackToProfile();
      callStartedRef.current = false;
      isCleaningUpRef.current = false;
    }, 200);
  }, [goBackToProfile, socket]);

  // Mute toggle
  const handleMute = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    toggleMute(newMuted);
    
    if (callIdRef.current) {
      socket.emit("call:mute", {
        callId: callIdRef.current,
        muted: newMuted
      });
    }
  }, [muted, socket]);

  // Speaker toggle
  const handleSpeakerToggle = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      if (!localStorage.getItem('audio_permission_granted')) {
        await navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => stream.getTracks().forEach(t => t.stop()));
      }

      // @ts-ignore - setSinkId not in all browsers
      if (audioRef.current.setSinkId) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const speakers = devices.filter(d => d.kind === 'audiooutput');
        
        if (speakers.length > 1) {
          // @ts-ignore
          const currentId = audioRef.current.sinkId;
          const nextSpeaker = speakers.find(s => s.deviceId !== currentId) || speakers[0];
          // @ts-ignore
          await audioRef.current.setSinkId(nextSpeaker.deviceId);
          console.log(`🔊 Switched to speaker: ${nextSpeaker.label}`);
        }
      }
    } catch (err) {
      console.warn("Speaker toggle not supported:", err);
    }
  }, []);

  // Auto-navigation for ended states
  useEffect(() => {
    if (callState === "ended" || callState === "busy" || callState === "offline") {
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
      {[1, 2, 3, 4, 5].map((_, index) => (
        <WaveBar key={index} $index={index} />
      ))}
    </WaveContainer>
  );

  return (
    <PageWrapper>
      <audio ref={audioRef} autoPlay playsInline style={{ display: "none" }} />
      
      {/* Network Status */}
      {callState === "connected" && networkQuality !== "good" && (
        <NetworkStatus>
          {networkQuality === "average" ? "📶 Network unstable" : "⚠️ Poor connection"}
        </NetworkStatus>
      )}
      
      <CallCard>
        <TopSection>
          <UserBlock>
            <Avatar 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt="Your avatar"
            />
            <Name>YOU</Name>
          </UserBlock>

          {callState === "calling" && (
            <CallIconRing>
              <span>📞</span>
            </CallIconRing>
          )}
          
          {/* Reconnecting UI */}
          {reconnecting && callState === "connected" && (
            <ReconnectingBadge />
          )}
        </TopSection>

        {/* Calling State */}
        {callState === "calling" && (
          <>
            <StatusText>CALLING {expert?.name || "EXPERT"}</StatusText>
            <EndCallButton onClick={handleEnd}>
              ✕ <span>Cancel</span>
            </EndCallButton>
          </>
        )}

        {/* Connected State */}
        {callState === "connected" && (
          <>
            {renderWaveAnimation()}
            <Timer>{formatTime()}</Timer>

            <Controls>
              <ControlBtn
                $active={muted}
                onClick={handleMute}
              >
                {muted ? "🔇" : "🎤"}
                <span>{muted ? "Unmute" : "Mute"}</span>
              </ControlBtn>

              <ControlBtn onClick={handleSpeakerToggle}>
                🔊
                <span>Speaker</span>
              </ControlBtn>

              <ControlBtn $danger onClick={handleEnd}>  
                ❌
                <span>End</span>
              </ControlBtn>
            </Controls>
          </>
        )}

        {/* Busy/Offline States */}
        {(callState === "busy" || callState === "offline") && (
          <>
            <StatusText>
              {callState === "busy" ? "EXPERT IS BUSY" : "EXPERT IS OFFLINE"}
            </StatusText>
            <EndCallButton onClick={goBackToProfile}>
              <span>Back</span>
            </EndCallButton>
          </>
        )}

        {/* Expert Info Section */}
        {callState !== "ended" && callState !== "busy" && callState !== "offline" && callState !== "idle" && (
          <ExpertSection>
            <ExpertAvatarWrapper>
              <ExpertAvatar 
                src={expert?.profile_photo || DEFAULT_AVATAR} 
                alt={expert?.name || "Expert"}
              />
            </ExpertAvatarWrapper>

            <ExpertName>{expert?.name || "Expert"}</ExpertName>
            <ExpertRole>{expert?.position || "Advisor"}</ExpertRole>

            {callState === "calling" && <ConnectingBar><span /></ConnectingBar>}

            <Brand>EXPERT YARD</Brand>
          </ExpertSection>
        )}

        {/* Ended State */}
        {callState === "ended" && (
          <>
            <StatusText>CALL ENDED</StatusText>
            <EndCallButton onClick={goBackToProfile}>
              <span>Back</span>
            </EndCallButton>
          </>
        )}
        
        {/* Idle State */}
        {callState === "idle" && (
          <StatusText>Ready to call</StatusText>
        )}
      </CallCard>
    </PageWrapper>
  );
}