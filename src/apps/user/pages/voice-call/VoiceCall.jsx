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
// import { socket } from "../../../../shared/api/socket";
import { useSocket } from "../../../../shared/hooks/useSocket";
import { useAuth } from "../../../../shared/context/UserAuthContext";

import {
  createPeer,
  closePeer,
  setRemote,
  addIce,
  toggleMute,
} from "../../../../shared/webrtc/voicePeer";

// ✅ ADDED: Import call constants
import { CALL_EVENTS } from "../../../../shared/constants/call.constants";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=44";

export default function VoiceCall() {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const { experts } = useExpert();
  const { user } = useAuth();
  const userId = user?.id;
  const socket = useSocket(userId, "user");
  // ✅ Audio ref
  const audioRef = useRef(null);
  
  // ✅ Refs to prevent duplicate listeners
  const socketAttached = useRef(false);
  const peerCreated = useRef(false);
  const callIdRef = useRef(null);
  const callStartedRef = useRef(false);

  /* ===============================
     FIND EXPERT DATA
  =============================== */
  const expert = useMemo(() => {
    if (!expertId || !experts?.length) return null;
    return experts.find(
      (e) => Number(e.id) === Number(expertId)
    );
  }, [experts, expertId]);

  /**
   * calling | connected | busy | offline | ended
   */
  const [callState, setCallState] = useState("calling");
  const [callId, setCallId] = useState(null);

  /* TIMER */
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  /* CONTROLS */
  const [muted, setMuted] = useState(false);
  // const [speaker, setSpeaker] = useState(false);

  const navigatedRef = useRef(false);

  const goBackToProfile = useCallback(() => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;

    navigate(`/user/experts/${expertId}`, { replace: true });
  }, [navigate, expertId]);

  // ✅ Store callId in ref for cleanup
  useEffect(() => {
    callIdRef.current = callId;
  }, [callId]);

  useEffect(() => {
  if (!userId || !expertId || callStartedRef.current) return;

  callStartedRef.current = true;

  socket.emit(CALL_EVENTS.START, {
    expertId: Number(expertId),
  });
}, [userId, expertId, socket]);

  /* ===============================
     ✅ CORRECT WEBRTC FLOW
     (ONLY after call:connected event)
  =============================== */
  const handleWebRTCOffer = useCallback(async (currentCallId) => {
    if (!currentCallId || peerCreated.current) return;

    console.log("📡 Creating WebRTC offer for call:", currentCallId);
    
    try {
      // ✅ createPeer call FIX
      const pc = await createPeer({
        socket,
        callId: currentCallId,
        audioRef, // ✅ Audio ref passed
      });
      peerCreated.current = true;

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
    }
  }, [socket]);

  /* ===============================
     ✅ START CALL ON MOUNT
  =============================== */
  // useEffect(() => {
  //   if (!expertId) return;

  //   console.log("📞 Starting call for expert:", expertId);
    
  //   // ✅ Use CALL_EVENTS.START constant
  //   socket.emit(CALL_EVENTS.START, {
  //     expertId: Number(expertId),
  //   });

  //   return () => {};
  // }, [expertId]);

  /* ===============================
     ✅ SOCKET EVENTS - ATTACH ONCE
     (Using CALL_EVENTS constants)
  =============================== */
  useEffect(() => {
    if (socketAttached.current) return;

    console.log("📡 Setting up voice call listeners");

    // ✅ 1. Call connected - START WEBRTC HERE (using constant)
    const onConnected = ({ callId: connectedCallId }) => {
      console.log("✅ Call connected:", connectedCallId);
      setCallId(connectedCallId);
      setCallState("connected");
      
      // ✅ START WEBRTC NEGOTIATION HERE (only after connected)
      handleWebRTCOffer(connectedCallId);
    };

    // ✅ 2. WebRTC Answer from expert
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

    // ✅ 3. ICE Candidates
    const onWebRTCIce = ({ callId: iceCallId, candidate }) => {
      if (iceCallId !== callIdRef.current) return;
      addIce(candidate);
    };

    // ✅ 4. Other call events (using constants)
    const onBusy = () => {
      console.log("🚫 Expert busy");
      setCallState("busy");
    };

    const onOffline = () => {
      console.log("🔴 Expert offline");
      setCallState("offline");
    };

    const onEnded = ({ reason }) => {
      console.log("❌ Call ended:", reason);
      setCallState("ended");
      closePeer();
      peerCreated.current = false;
      socketAttached.current = false;
    };

    // ✅ ATTACH LISTENERS USING CALL_EVENTS CONSTANTS
    socket.on(CALL_EVENTS.CONNECTED, onConnected);
    socket.on("webrtc:answer", onWebRTCAnswer);
    socket.on("webrtc:ice", onWebRTCIce);
    socket.on(CALL_EVENTS.BUSY, onBusy);
    socket.on(CALL_EVENTS.OFFLINE, onOffline);
    socket.on(CALL_EVENTS.ENDED, onEnded);

    socketAttached.current = true;

    return () => {
      console.log("🧹 Cleaning up voice call listeners");
      
      // ✅ REMOVE LISTENERS USING CALL_EVENTS CONSTANTS
      socket.off(CALL_EVENTS.CONNECTED, onConnected);
      socket.off("webrtc:answer", onWebRTCAnswer);
      socket.off("webrtc:ice", onWebRTCIce);
      socket.off(CALL_EVENTS.BUSY, onBusy);
      socket.off(CALL_EVENTS.OFFLINE, onOffline);
      socket.off(CALL_EVENTS.ENDED, onEnded);
      
      socketAttached.current = false;
      
      // Cleanup WebRTC
      closePeer();
      peerCreated.current = false;
    };
  }, [socket, handleWebRTCOffer]);

  /* ===============================
     TIMER
  =============================== */
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

  const formatTime = () => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  /* ===============================
     END CALL
     (Using CALL_EVENTS.END constant)
  =============================== */
  const handleEnd = useCallback(() => {
    console.log("🔚 Ending call:", callIdRef.current);
    
    if (callIdRef.current) {
      // ✅ Use CALL_EVENTS.END constant
      socket.emit(CALL_EVENTS.END, {
  callId: callIdRef.current,
  by: "user"
});

    }
    
    closePeer();
    peerCreated.current = false;

    goBackToProfile();
    callStartedRef.current = false;
  }, [goBackToProfile]);

  // ✅ Auto-navigate when call ends
  useEffect(() => {
    if (callState === "ended") {
      const timer = setTimeout(goBackToProfile, 1500);
      return () => clearTimeout(timer);
    }
  }, [callState, goBackToProfile]);

  // ✅ Auto-navigate on busy/offline
  useEffect(() => {
    if (callState === "busy" || callState === "offline") {
      const timer = setTimeout(goBackToProfile, 1500);
      return () => clearTimeout(timer);
    }
  }, [callState, goBackToProfile]);

  /* ===============================
     UI RENDER
  =============================== */
  return (
    <PageWrapper>
      {/* ✅ Audio element for WebRTC audio */}
      <audio ref={audioRef} style={{ display: 'none' }} />
      
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
              {/* ✅ Mute button with WebRTC toggle */}
              <ControlBtn
                active={muted}
                onClick={() => {
                  setMuted(m => {
                    toggleMute(!m); // ✅ Toggle actual WebRTC mute
                    return !m;
                  });
                }}
              >
                {muted ? "🔇" : "🎤"}
                <span>Mute</span>
              </ControlBtn>

              {/* ✅ Speaker button (disabled for now) */}
              <ControlBtn disabled>
                🔊
                <span>Speaker</span>
              </ControlBtn>

              <ControlBtn danger onClick={handleEnd}>
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

        {callState !== "ended" && callState !== "busy" && callState !== "offline" && (
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
      </CallCard>
    </PageWrapper>
  );
}