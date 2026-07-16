  // ExpertVoiceCall.jsx
  import React, { useEffect, useState, useCallback, useRef } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import { CALL_EVENTS } from "../../../../shared/constants/call.constants";
  import { useExpert } from "../../../../shared/context/ExpertContext";
  import { useSocket } from "../../../../shared/hooks/useSocket";
  import { useLocation } from "react-router-dom";

  // ✅ STEP 1: Import native call helpers
  import {
      releaseNativeCallLock,
      removeProcessedNativeCall
  } from "../../../../shared/hooks/useNativeIncomingCall";

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
    IncomingActions,
    ActionBtn,
    BottomActions,
    ActionButton,
    Brand,
    ReconnectingBadge,
    NetworkIndicator,
    Spinner,
    Shimmer,
  } from "./ExpertVoiceCall.styles";

  import {
    createPeer,
    closePeer,
    setRemote,
    addIce,
    toggleMute,
    createAnswer,
    handleSocketReconnect,
    getStats,
    attachRemoteAudio,
    ensureAudioPlaying,
    getPeerConnection,
  } from "../../../../shared/webrtc/voicePeer";
  import { soundManager } from "../../../../shared/services/sound/soundManager";

  // Simple user icon component (no external dependencies)
  const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  export default function ExpertVoiceCall() {
    const { callId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const nativeCall = location.state?.native;
    const { expertData } = useExpert();
    const nativeStartedRef = useRef(false);

    // Normalized callId for all checks
    const normalizedCallId = Number(callId);
    const socket = useSocket(expertData?.expertId, "expert");
    
    // Refs for stability
    const streamRef = useRef(null);
    const callIdRef = useRef(normalizedCallId);
    const callStartedRef = useRef(false);
    const callStateRef = useRef("connecting");
    const makingAnswerRef = useRef(false);
    const isCleaningUpRef = useRef(false);
    const reconnectAttemptsRef = useRef(0);
    const MAX_RECONNECT_ATTEMPTS = 5;
    
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
    });

    // Stop all sounds on mount
    useEffect(() => {
      soundManager.stopAll();
    }, []);

    // ✅ STEP 2 & 5: Native call effect with improved handling
    useEffect(() => {
      if (!nativeCall) return;
      if (!socket?.connected) return;
      if (nativeStartedRef.current) return;

      nativeStartedRef.current = true;

      const startNativeCall = async () => {
        try {
          // ✅ STEP 5: Only get stream if not already available
          if (!streamRef.current) {
            streamRef.current = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                channelCount: { ideal: 1 },
                sampleRate: { ideal: 16000 }
              }
            });
          }

          if (!socket.connected) {
            console.log("Socket disconnected while opening native call");
            return;
          }

          const peer = await createPeer({
            socket,
            callId: callIdRef.current,
            audioRef,
            stream: streamRef.current
          });

          if (!peer) {
            throw new Error("Peer creation failed");
          }

          setCaller({
            name: location.state?.callerName || location.state?.caller_name || "User",
            role: "User"
          });

          if (callStartedRef.current) return;
          callStartedRef.current = true;

          if (!socket.connected) {
            throw new Error("Socket disconnected");
          }

          socket.emit(CALL_EVENTS.ACCEPT, {
            callId: callIdRef.current
          });

          // ✅ STEP 2: Release lock but DON'T delete window object
          setCallState("connecting");
          releaseNativeCallLock();

          // ✅ STEP 6: Acknowledge to Android (for Capacitor)
          if (window.Capacitor?.isNativePlatform?.()) {
            try {
              // Will be implemented in Phase-3 with NativeBridge Plugin
              console.log("📱 Native call acknowledged to Android");
              // window.NativeBridge?.nativeCallConsumed?.();
            } catch (e) {
              console.warn("Native acknowledgment not available:", e);
            }
          }

        } catch (err) {
          console.error("Native call failed:", err);

          if (socket.connected) {
            socket.emit(CALL_EVENTS.REJECT, {
              callId: callIdRef.current,
              reason: "MIC_PERMISSION_DENIED"
            });
          }

          cleanupMedia(true);
          nativeStartedRef.current = false;
          releaseNativeCallLock();
  removeProcessedNativeCall(String(callIdRef.current));
  delete window.__NATIVE_INCOMING_CALL__;
          setCallState("ended");
          navigate("/expert/home", { replace: true });
        }
      };

      startNativeCall();
    }, [nativeCall, socket, location.state, navigate]);

    // Keep callState in sync with ref
    useEffect(() => {
      callStateRef.current = callState;
    }, [callState]);

    useEffect(() => {
      callIdRef.current = normalizedCallId;
    }, [normalizedCallId]);

    useEffect(() => {
      attachRemoteAudio(audioRef);
    }, []);

    // Cleanup media tracks with full reset
    const cleanupMedia = useCallback((fullCleanup = true) => {
      console.log("🧹 Expert cleaning up media tracks", { fullCleanup });
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (streamRef.current && fullCleanup) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log(`🛑 Stopped expert track: ${track.kind}`);
        });
        streamRef.current = null;
      }
      
      if (audioRef.current) {
        audioRef.current.srcObject = null;
      }
      
      closePeer(fullCleanup);
      
      // Reset all refs
      makingAnswerRef.current = false;
      callStartedRef.current = false;
      
      if (fullCleanup) {
        reconnectAttemptsRef.current = 0;
      }
    }, []);

    // Auto-start mic on connecting state
    useEffect(() => {
      if (callState !== "connecting") return;
      if (nativeCall) return; // ✅ Skip for native calls
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
    }, [callState, socket, nativeCall]);

    useEffect(() => {
      const onResume = (data) => {
        if (data.callId !== normalizedCallId) return;
        
        setCaller(prev => ({ 
          ...prev, 
          name: data.user_name || prev.name
        }));
        setCallState("connected");
        callStartedRef.current = true;
        setReconnecting(false);
        reconnectAttemptsRef.current = 0;

        const alreadyElapsed =
          Math.floor((Date.now() - new Date(data.startedAt)) / 1000);

        setSeconds(alreadyElapsed);
      };

      socket.on("call:resume_data", onResume);
      return () => socket.off("call:resume_data", onResume);
    }, [socket, normalizedCallId]);

    // Handle incoming call data
    useEffect(() => {
      const onIncoming = (data) => {
        if (Number(data.callId) !== callIdRef.current) return;

        console.log("📞 Incoming call data:", data);

        setReconnecting(false);
        reconnectAttemptsRef.current = 0;

        setCaller({
          name: data.user_name || "User",
          role: "User",
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

    // Timer
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

      const onConnected = ({ callId: connectedId, user_name }) => {
        if (Number(connectedId) !== callIdRef.current) return;
        
        setCaller(prev => ({
          ...prev,
          name: user_name || prev.name
        }));

        setReconnecting(false);
        reconnectAttemptsRef.current = 0;
        setSeconds(0);
        setCallState("connected");
        localStorage.removeItem("native_call_ack");
      };

      const onEnded = ({ callId: endedId }) => {
        if (Number(endedId) !== callIdRef.current) return;
        setCallState("ended");
        callStartedRef.current = false;
        
        // ✅ STEP 3: Clean up native call properly
        releaseNativeCallLock();
        cleanupMedia(true);
        nativeStartedRef.current = false;
        removeProcessedNativeCall(String(callIdRef.current));
        
        // ✅ Keep delete, but after cleaning Set
        delete window.__NATIVE_INCOMING_CALL__;
        
        setTimeout(() => navigate("/expert/home", { replace: true }), 1000);
      };

      const onBusy = () => {
        console.log("🚫 Expert: Call rejected/busy");
        setCallState("ended");
        callStartedRef.current = false;
        cleanupMedia(true);
        nativeStartedRef.current = false;
        releaseNativeCallLock();
  removeProcessedNativeCall(String(callIdRef.current));
  delete window.__NATIVE_INCOMING_CALL__;
        
        // ✅ STEP 4: Reset native flag here
        
        setTimeout(() => {
          navigate("/expert/home", { replace: true });
        }, 1000);
      };

      const onResumed = async ({ callId: resumedCallId }) => {
        console.log("🔁 Expert received call:resumed event for call:", resumedCallId);
        if (Number(resumedCallId) !== Number(callIdRef.current)) {
          console.log("⏭️ call:resumed callId mismatch, ignoring");
          return;
        }
        setReconnecting(false);
        setCallState("connected");
        
        // Reset lock/answer negotiation flags
        makingAnswerRef.current = false;
        
        // Soft-clean the old peer connection without stopping microphone track
        console.log("🧹 Soft cleaning old peer on call:resumed");
        cleanupMedia(false);
        
        // Recreate the peer connection and prepare to receive the new offer
        setTimeout(async () => {
          if (callStateRef.current === "connected" && Number(callIdRef.current) === Number(resumedCallId)) {
            console.log("♻ Recreating expert peer connection to receive offer");
            if (!streamRef.current || streamRef.current.getAudioTracks()[0]?.readyState !== "live") {
              try {
                streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
              } catch (err) {
                console.error("❌ Mic failed on call:resumed", err);
                return;
              }
            }
            await createPeer({
              socket,
              callId: callIdRef.current,
              audioRef,
              stream: streamRef.current
            });
          }
        }, 500);
      };

      socket.on(CALL_EVENTS.CONNECTED, onConnected);
      socket.on(CALL_EVENTS.ENDED, onEnded);
      socket.on(CALL_EVENTS.BUSY, onBusy);
      socket.on("call:resumed", onResumed);

      return () => {
        socket.off(CALL_EVENTS.CONNECTED, onConnected);
        socket.off(CALL_EVENTS.ENDED, onEnded);
        socket.off(CALL_EVENTS.BUSY, onBusy);
        socket.off("call:resumed", onResumed);
      };
    }, [socket, navigate, cleanupMedia, normalizedCallId]);

    // Socket reconnect handler with attempt limiter
    useEffect(() => {
      if (!socket) return;

      const onReconnect = async () => {
        console.log("🔄 Expert socket reconnected");
        setReconnecting(true);
        reconnectAttemptsRef.current++;
        
        if (reconnectAttemptsRef.current > MAX_RECONNECT_ATTEMPTS) {
          console.error("❌ Max reconnection attempts reached, ending call");
          setCallState("ended");
          cleanupMedia(true);
          nativeStartedRef.current = false;
          return;
        }
        
        makingAnswerRef.current = false;
        
        await handleSocketReconnect();
        socket.emit("call:resume_check");

        if (isCleaningUpRef.current) return;
        
        if (callIdRef.current && callStateRef.current === "connected") {
          setTimeout(async () => {
            if (isCleaningUpRef.current) return;
            
            console.log("♻ Recreating peer after reconnect");
            
            if (!streamRef.current || streamRef.current.getAudioTracks()[0]?.readyState !== "live") {
              console.log("🎤 Re-acquiring mic after reconnect");
              try {
                streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
              } catch (err) {
                console.error("❌ Mic failed after reconnect", err);
                return;
              }
            }
            
            let pc = getPeerConnection();
            if (!pc || pc.connectionState === "closed") {
              pc = await createPeer({
                socket,
                callId: callIdRef.current,
                audioRef,
                stream: streamRef.current
              });
            }
          }, 400);
        }
      };

      socket.io?.on("reconnect", onReconnect);
      return () => socket.io?.off("reconnect", onReconnect);
    }, [socket, cleanupMedia]);

    // Visibility change handler
    useEffect(() => {
      const onVisibilityChange = () => {
        if (document.visibilityState !== "visible") return;
        if (callStateRef.current !== "connected" || !callIdRef.current) return;

        attachRemoteAudio(audioRef);
        socket.emit("call:resume_check");
      };

      document.addEventListener("visibilitychange", onVisibilityChange);
      return () => document.removeEventListener("visibilitychange", onVisibilityChange);
    }, [socket]);

    // Network quality monitoring
    useEffect(() => {
      if (callState !== "connected") return;
    
      const interval = setInterval(async () => {
        const stats = await getStats();
        const inbound = stats?.find(s => s.type === "inbound");
    
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

    // WebRTC events
    useEffect(() => {
      if (!normalizedCallId) return;

      const onOffer = async ({ callId: incomingId, offer, attemptId }) => {
        if (Number(incomingId) !== callIdRef.current) return;
        if (callStateRef.current === "ended") return;
        if (makingAnswerRef.current) return;
        
        const currentPC = getPeerConnection();
        if (currentPC?.signalingState === "have-remote-offer") {
          console.log("⏭️ Existing remote offer already pending");
          return;
        }
        
        if (currentPC?.remoteDescription?.sdp === offer.sdp) {
          console.log("⏭️ Duplicate offer ignored");
          return;
        }

        if (!streamRef.current) {
          try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
          } catch (err) {
            console.error("❌ Failed to get mic for offer", err);
            return;
          }
        }

        makingAnswerRef.current = true;

        try {
          let pc = currentPC;
          
          if (!pc || pc.connectionState === "closed") {
            console.log("📡 Creating new peer for answer");
            pc = await createPeer({
              socket,
              callId: callIdRef.current,
              audioRef,
              stream: streamRef.current
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
            attemptId
          });

          console.log("✅ Answer sent to user");
        } catch (err) {
          console.error("❌ Answer failed", err);
        } finally {
          makingAnswerRef.current = false;
        }
      };
      
      const onIce = ({ callId: iceId, candidate, attemptId }) => {
        if (Number(iceId) !== callIdRef.current) return;
        addIce(candidate, attemptId);
      };

      socket.on("webrtc:offer", onOffer);
      socket.on("webrtc:ice", onIce);

      return () => {
        socket.off("webrtc:offer", onOffer);
        socket.off("webrtc:ice", onIce);
      };
    }, [socket, normalizedCallId]);

    // ✅ STEP 7: Cleanup on unmount with lock release
    useEffect(() => {
      return () => {
        console.log("🧹 Expert cleanup on unmount");
        cleanupMedia(true);
        nativeStartedRef.current = false;
        
        // ✅ Release lock and clean processed call
        releaseNativeCallLock();
        removeProcessedNativeCall(String(callIdRef.current));
        
        delete window.__NATIVE_INCOMING_CALL__;
      };
    }, [cleanupMedia]);

    // ACCEPT CALL
    const acceptCall = useCallback(() => {
      if (callStateRef.current !== "incoming") return;

      callStartedRef.current = true;
      setCallState("connecting");
      reconnectAttemptsRef.current = 0;

      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }

      socket.emit(CALL_EVENTS.ACCEPT, { callId: callIdRef.current });
    }, [socket]);

    // REJECT CALL
    const rejectCall = useCallback(() => {
      console.log("❌ Expert: Rejecting call", callIdRef.current);
      socket.emit(CALL_EVENTS.REJECT, { callId: callIdRef.current });
      
      cleanupMedia(true);
      nativeStartedRef.current = false;
      
      // ✅ STEP 3: Clean Set before deleting object
      removeProcessedNativeCall(String(callIdRef.current));
      releaseNativeCallLock();
      delete window.__NATIVE_INCOMING_CALL__;
      
      navigate("/expert/home", { replace: true });
    }, [socket, navigate, cleanupMedia]);

    // END CALL
    const endCall = useCallback(() => {
      if (isCleaningUpRef.current) return;
      isCleaningUpRef.current = true;

      console.log("🔚 Expert: Ending call", callIdRef.current);
      socket.emit(CALL_EVENTS.END, { callId: callIdRef.current });

      setTimeout(() => {
        cleanupMedia(true);
        nativeStartedRef.current = false;
        
        // ✅ STEP 3: Clean Set before deleting object
        removeProcessedNativeCall(String(callIdRef.current));
        releaseNativeCallLock();
        delete window.__NATIVE_INCOMING_CALL__;
        
        navigate("/expert/home", { replace: true });
        isCleaningUpRef.current = false;
      }, 200);
    }, [socket, navigate, cleanupMedia]);

    // MUTE TOGGLE
    const toggleMuteClick = useCallback(() => {
      setMuted((m) => {
        toggleMute(!m);
        
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
        
        if (callIdRef.current) {
          socket.emit("call:mute", {
            callId: callIdRef.current,
            muted: !m
          });
        }
        
        return !m;
      });
    }, [socket]);

    const formatTime = () => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (hours > 0) {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      }
      return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Render wave animation
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
        <ConnectingText>
          {reconnecting ? "Reconnecting..." : "Connecting to caller..."}
        </ConnectingText>
      </ConnectingAnimation>
    );

    const getStatusText = () => {
      switch (callState) {
        case "connecting":
          return "Connecting...";
        case "connected":
          return "Connected";
        case "ended":
          return "Call Ended";
        case "incoming":
          return "Incoming Call";
        default:
          return "";
      }
    };

    const getStatusType = () => {
      switch (callState) {
        case "connecting":
          return "connecting";
        case "connected":
          return "connected";
        case "ended":
          return "ended";
        case "incoming":
          return "incoming";
        default:
          return "";
      }
    };

    return (
      <PageWrapper>
        <audio ref={audioRef} autoPlay={true} playsInline={true} muted={false} />

        {callState === "connected" && networkQuality !== "good" && (
          <NetworkIndicator $quality={networkQuality}>
            {networkQuality === "average" ? "Unstable Connection" : "Poor Connection"}
          </NetworkIndicator>
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

            {callState === "connecting" && (
              <TimerSection>
                <TimerLabel>Connecting</TimerLabel>
                <Timer>00:00</Timer>
              </TimerSection>
            )}

            <HeaderControls>
              {callState === "connected" && (
                <>
                  <HeaderControlBtn
                    onClick={toggleMuteClick}
                    $active={muted}
                    title={muted ? "Unmute" : "Mute"}
                  >
                    {muted ? "🔇" : "🎤"}
                  </HeaderControlBtn>
                  <HeaderControlBtn
                    $danger
                    onClick={endCall}
                    title="End Call"
                  >
                    📞
                  </HeaderControlBtn>
                </>
              )}

              {(callState === "connecting" || callState === "incoming") && (
                <HeaderControlBtn $danger onClick={rejectCall} title="Decline">
                  ✕
                </HeaderControlBtn>
              )}

              {callState === "ended" && (
                <HeaderControlBtn onClick={() => navigate("/expert/home")} title="Back">
                  ←
                </HeaderControlBtn>
              )}
            </HeaderControls>
          </CallHeader>

          <ExpertInfo>
            <ExpertAvatarWrapper className={callState === "connected" ? "active" : ""}>
              <ExpertAvatar>
                <UserIcon />
              </ExpertAvatar>
              {callState === "connected" && <Shimmer />}
            </ExpertAvatarWrapper>

            <ExpertName>{caller.name}</ExpertName>
            <ExpertRole>{caller.role}</ExpertRole>

            {callState !== "idle" && (
              <StatusBadge $status={getStatusType()}>
                <span>
                  {callState === "connected" && "🔵"}
                  {callState === "connecting" && "🔄"}
                  {callState === "ended" && "✓"}
                  {callState === "incoming" && "📞"}
                </span>
                {getStatusText()}
              </StatusBadge>
            )}

            {callState === "connected" && renderWaveAnimation()}
            {callState === "connecting" && renderConnectingAnimation()}

            {callState === "incoming" && (
              <IncomingActions>
                <ActionBtn $accept onClick={acceptCall}>
                  ✔ Accept
                </ActionBtn>
                <ActionBtn onClick={rejectCall}>
                  ✕ Reject
                </ActionBtn>
              </IncomingActions>
            )}

            {callState === "ended" && <Spinner />}
          </ExpertInfo>

          <BottomActions>
            {callState === "connected" && (
              <ActionButton $danger onClick={endCall}>
                📞 End Call
              </ActionButton>
            )}

            {(callState === "connecting" || callState === "incoming") && (
              <ActionButton $danger onClick={rejectCall}>
                ✕ Decline Call
              </ActionButton>
            )}

            {callState === "ended" && (
              <ActionButton $primary onClick={() => navigate("/expert/home")}>
                ← Back to Dashboard
              </ActionButton>
            )}
          </BottomActions>

          <Brand>G9EXPERT — Expert Panel</Brand>
        </CallCard>
      </PageWrapper>
    );
  }