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
  ReconnectingBadge, // ⭐ Optional UI
} from "./VoiceCall.styles";

import { useExpert } from "../../../../shared/context/ExpertContext";
import { useSocket } from "../../../../shared/hooks/useSocket";
import { useAuth } from "../../../../shared/context/UserAuthContext";

import {
  createPeer,
  closePeer,
  setRemote,
  addIce,
  toggleMute,
  handleSocketReconnect,
} from "../../../../shared/webrtc/voicePeer";

import { CALL_EVENTS } from "../../../../shared/constants/call.constants";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=44";

export default function VoiceCall() {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const { experts } = useExpert();
  const { user } = useAuth();
  const userId = user?.id;
  const socket = useSocket(userId, "user");
  const audioRef = useRef(null);
  
  // Refs for stability
  const callIdRef = useRef(null);
  const callStartedRef = useRef(false);
  // 2️⃣ Ref for latest callState
  const callStateRef = useRef("idle");
  // 3️⃣ Offer spam protection
  const makingOfferRef = useRef(false);
  // 6️⃣ Cleanup guard (optional)
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
  // ⭐ Reconnecting UI state
  const [reconnecting, setReconnecting] = useState(false);
  const navigatedRef = useRef(false);

  // 2️⃣ Sync callState to ref
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

  // ✅ 1️⃣ FIXED: Simplified dependencies, uses ref for guard
  const startCall = useCallback(async () => {
    if (callStartedRef.current) return;
    
    setCallState("calling");
    callStartedRef.current = true;

    try {
      console.log("📞 Starting call for expert:", expertId);
      
      socket.emit(CALL_EVENTS.START, {
        expertId: Number(expertId),
      });
      
    } catch (error) {
      console.error("❌ Failed to start call:", error);
      setCallState("ended");
      setTimeout(() => goBackToProfile(), 1500);
    }
  }, [expertId, socket, goBackToProfile]); // ✅ Removed callState dependency

  // Auto-start on mount
  useEffect(() => {
    startCall();
  }, [startCall]);

  // Expose startCall to parent component (optional)
  useEffect(() => {
    window.__startVoiceCall = startCall;
    return () => {
      delete window.__startVoiceCall;
    };
  }, [startCall]);

  // ✅ 3️⃣ OFFER SPAM PROTECTION
  const handleWebRTCOffer = useCallback(async (currentCallId) => {
    if (!currentCallId) return;
    
    // Prevent multiple simultaneous offers
    if (makingOfferRef.current) {
      console.log("🛡️ Offer already in progress, skipping");
      return;
    }

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

  // 4️⃣ Preload devices for speaker toggle
  useEffect(() => {
    // Pre-audio permission for speaker device enumeration
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
    console.log("📡 Setting up voice call listeners");

    const onConnected = ({ callId: connectedCallId }) => {
      console.log("✅ Call connected:", connectedCallId);
      setReconnecting(false); // ⭐ Clear reconnecting state
      setCallId(connectedCallId);
      setSeconds(0);
      setCallState("connected");
      
      setTimeout(() => {
        handleWebRTCOffer(connectedCallId);
      }, 300);
    };

    const onWebRTCAnswer = async ({ callId: answerCallId, answer }) => {
      console.log("📡 WebRTC Answer received for call:", answerCallId);
      
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
      console.log("🚫 Expert busy");
      setCallState("busy");
      closePeer();
    };

    const onOffline = () => {
      console.log("🔴 Expert offline");
      setCallState("offline");
      closePeer();
    };

    const onEnded = ({ reason }) => {
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

  // ✅ 2️⃣ RECONNECT HANDLER WITH REF
  useEffect(() => {
    if (!socket) return;

    const onReconnect = () => {
      console.log("🔄 Socket reconnected – reinitializing peer");
      setReconnecting(true); // ⭐ Show reconnecting UI
      
      handleSocketReconnect();
      
      // 2️⃣ Use ref for current call state
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
  }, [socket, handleWebRTCOffer]); // ✅ No callState dependency, uses ref

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
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // ✅ 5️⃣ SAFE END CALL WITH DELAY
  const handleEnd = useCallback(() => {
    if (isCleaningUpRef.current) return;
    isCleaningUpRef.current = true;

    console.log("🔚 Ending call:", callIdRef.current);
    
    if (callIdRef.current) {
      socket.emit(CALL_EVENTS.END, {
        callId: callIdRef.current,
        by: "user"
      });
    }
    
    // Give time for packet to send before cleanup
    setTimeout(() => {
      closePeer();
      goBackToProfile();
      callStartedRef.current = false;
      isCleaningUpRef.current = false;
    }, 200);
  }, [goBackToProfile, socket]);

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

  // ✅ 4️⃣ FIXED SPEAKER TOGGLE
  const handleSpeakerToggle = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      // Ensure we have device permissions
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

  useEffect(() => {
    if (callState === "ended" || callState === "busy" || callState === "offline") {
      const timer = setTimeout(() => {
        closePeer();
        goBackToProfile();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [callState, goBackToProfile]);

  return (
    <PageWrapper>
      <audio ref={audioRef} autoPlay playsInline style={{ display: "none" }} />
      
      <CallCard>
        <TopSection>
          <UserBlock>
            <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" />
            <Name>YOU</Name>
          </UserBlock>

          {callState === "calling" && (
            <CallIconRing>
              <span>📞</span>
            </CallIconRing>
          )}
          
          {/* ⭐ Reconnecting UI */}
          {reconnecting && callState === "connected" && (
            <ReconnectingBadge>🔄 Reconnecting...</ReconnectingBadge>
          )}
        </TopSection>

        {callState === "calling" && (
          <>
            <StatusText>CALLING {expert?.name || "EXPERT"}...</StatusText>
            <EndCallButton onClick={handleEnd}>
              ✕ <span>Cancel</span>
            </EndCallButton>
          </>
        )}

        {callState === "connected" && (
          <>
            <Timer>{formatTime()}</Timer>

            <Controls>
              <ControlBtn
                $active={muted}
                onClick={handleMute}
              >
                {muted ? "🔇" : "🎤"}
                <span>Mute</span>
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

        {callState !== "ended" && callState !== "busy" && callState !== "offline" && callState !== "idle" && (
          <ExpertSection>
            <ExpertAvatarWrapper>
              <ExpertAvatar src={expert?.profile_photo || DEFAULT_AVATAR} />
            </ExpertAvatarWrapper>

            <ExpertName>{expert?.name || "Expert"}</ExpertName>
            <ExpertRole>{expert?.position || "Advisor"}</ExpertRole>

            {callState === "calling" && <ConnectingBar><span /></ConnectingBar>}

            <Brand>🌿 EXPERT YARD</Brand>
          </ExpertSection>
        )}

        {callState === "ended" && (
          <>
            <StatusText>CALL ENDED</StatusText>
            <EndCallButton onClick={goBackToProfile}>
              <span>Back</span>
            </EndCallButton>
          </>
        )}
        
        {callState === "idle" && (
          <StatusText>Ready to call</StatusText>
        )}
      </CallCard>
    </PageWrapper>
  );
}