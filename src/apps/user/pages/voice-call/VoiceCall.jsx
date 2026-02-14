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
  
  const callIdRef = useRef(null);
  const callStartedRef = useRef(false);

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
  const navigatedRef = useRef(false);

  const goBackToProfile = useCallback(() => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    navigate(`/user/experts/${expertId}`, { replace: true });
  }, [navigate, expertId]);

  useEffect(() => {
    callIdRef.current = callId;
  }, [callId]);

  // ✅ SIMPLIFIED: Just emit START, voicePeer handles mic
  const startCall = useCallback(async () => {
    if (callStartedRef.current || callState !== "idle") return;
    
    setCallState("calling");
    callStartedRef.current = true;

    try {
      console.log("📞 Starting call for expert:", expertId);
      
      // VoicePeer will request mic when createPeer is called
      socket.emit(CALL_EVENTS.START, {
        expertId: Number(expertId),
      });
      
    } catch (error) {
      console.error("❌ Failed to start call:", error);
      setCallState("ended");
      setTimeout(() => goBackToProfile(), 1500);
    }
  }, [expertId, socket, goBackToProfile, callState]);

  // Expose startCall to parent component
  useEffect(() => {
    window.__startVoiceCall = startCall;
    return () => {
      delete window.__startVoiceCall;
    };
  }, [startCall]);

  const handleWebRTCOffer = useCallback(async (currentCallId) => {
    if (!currentCallId) return;

    console.log("📡 Creating WebRTC offer for call:", currentCallId);
    
    try {
      // ✅ SIMPLIFIED: voicePeer handles mic internally
      const pc = await createPeer({
        socket,
        callId: currentCallId,
        audioRef,
        // No stream passed - voicePeer gets it automatically
      });

      const offer = await pc.createOffer();
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
    }
  }, [socket]);

  useEffect(() => {
    console.log("📡 Setting up voice call listeners");

    const onConnected = ({ callId: connectedCallId }) => {
      console.log("✅ Call connected:", connectedCallId);
      setCallId(connectedCallId);
      setSeconds(0);
      setCallState("connected");
      handleWebRTCOffer(connectedCallId);
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

  const handleEnd = useCallback(() => {
    console.log("🔚 Ending call:", callIdRef.current);
    
    if (callIdRef.current) {
      socket.emit(CALL_EVENTS.END, {
        callId: callIdRef.current,
        by: "user"
      });
    }
    
    closePeer();
    goBackToProfile();
    callStartedRef.current = false;
  }, [goBackToProfile, socket]);

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
                $active={muted}  // ✅ FIXED: $active instead of active
                onClick={() => {
                  setMuted(m => {
                    toggleMute(!m);
                    return !m;
                  });
                }}
              >
                {muted ? "🔇" : "🎤"}
                <span>Mute</span>
              </ControlBtn>

              <ControlBtn disabled>
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