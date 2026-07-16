import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import VideoCallRoom from "../../../../shared/components/VideoCallRoom";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { useSocket } from "../../../../shared/hooks/useSocket";
import {
  addVideoIceCandidate,
  attachVideoElements,
  closeVideoPeer,
  createAndSendVideoAnswer,
  createVideoPeer,
  setVideoRemoteDescription,
  switchVideoCamera,
  toggleVideoCamera,
  toggleVideoMute,
} from "../../../../shared/webrtc/videoPeer";
import { requestExpertVideoCallMedia, stopMediaStream } from "../../../../shared/webrtc/mediaPermissions";

// Import native call helpers
import {
  releaseNativeCallLock,
  removeProcessedNativeCall,
  clearNativeCallData,
  isNativeAcceptSent
} from "../../../../shared/hooks/useNativeIncomingCall";

const EVENTS = {
  ACCEPT: "video-call:accept",
  DECLINE: "video-call:decline",
  FAILED: "video-call:failed",
  END: "video-call:end",
  CONNECTED: "video-call:connected",
  ENDED: "video-call:ended",
  CANCELLED: "video-call:cancelled",
  TAKEN: "video-call:taken",
  ERROR: "video-call:error",
  BILLING_TICK: "video-call:billing_tick",
  LOW_BALANCE: "video-call:low_balance_warning",
  BILLING_FINALIZED: "video-call:billing_finalized",
};

export default function ExpertVideoCall() {
  const { callId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { expertData } = useExpert();
  const socket = useSocket(expertData?.expertId, "expert");
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const acceptedRef = useRef(false);
  const endedRef = useRef(false);
  const connectedRef = useRef(false);
  const manualEndRef = useRef(false);
  const localStreamRef = useRef(null);
  const pageActiveRef = useRef(false);
  const mediaRequestInProgressRef = useRef(false);
  const mediaInitializedRef = useRef(false);
  const callFailureEmittedRef = useRef(false);
  const cleanupDoneRef = useRef(false);
  const cleanupTimerRef = useRef(null);
  const nativeCleanupDoneRef = useRef(false);
  const reactReadyNotifiedRef = useRef(false);

  const [status, setStatus] = useState("Accepting call");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [connectionState, setConnectionState] = useState("connecting");
  const [billing, setBilling] = useState({});
  const [retryNonce, setRetryNonce] = useState(0);

  // ============================================================
  // STEP 1: Notify NativeBridgeManager when page mounts
  // ============================================================
  useEffect(() => {
    if (!callId) return;
    if (reactReadyNotifiedRef.current) return;
    
    // Check if this is a native call
    const nativeCall = location.state?.native;
    
    // Only notify if this is a native call
    if (nativeCall && Capacitor.isNativePlatform()) {
      console.log("📹 Notifying NativeBridgeManager - Video call mounted:", callId);
      
      // Call the native bridge to confirm React is ready
      if (window.NativeBridgeManager?.onReactReadyForCall) {
        window.NativeBridgeManager.onReactReadyForCall(callId);
      } else {
        console.log("ℹ️ NativeBridgeManager not available in window");
      }
      
      reactReadyNotifiedRef.current = true;
    }
  }, [callId, location.state]);

  const getMediaFailureReason = useCallback((errorCode) => {
    if (errorCode === "NotReadableError" || errorCode === "TrackStartError") return "expert_media_not_readable";
    if (errorCode === "NotAllowedError" || errorCode === "PermissionDeniedError" || errorCode === "SecurityError") return "expert_media_permission_denied";
    if (errorCode === "NotFoundError" || errorCode === "DevicesNotFoundError") return "expert_media_device_not_found";
    if (errorCode === "OverconstrainedError" || errorCode === "ConstraintNotSatisfiedError") return "expert_media_constraints_failed";
    return "expert_media_failed";
  }, []);

  // Native cleanup helper
  const cleanupNativeState = useCallback(() => {
    if (nativeCleanupDoneRef.current) return;
    nativeCleanupDoneRef.current = true;
    
    console.log("🧹 Cleaning native state for video call:", callId);
    releaseNativeCallLock();
    removeProcessedNativeCall(String(callId));
    clearNativeCallData();
  }, [callId]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (acceptedRef.current && !endedRef.current) setSeconds((value) => value + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cleanupMedia = useCallback(async () => {
    if (cleanupDoneRef.current) return;
    cleanupDoneRef.current = true;
    console.log("[VC_MEDIA_CLEANUP_START]", {
      callId: Number(callId),
      role: "expert",
      hasStream: Boolean(localStreamRef.current),
      at: new Date().toISOString(),
    });
    await closeVideoPeer(true);
    stopMediaStream(localStreamRef.current);
    localStreamRef.current = null;
    mediaInitializedRef.current = false;
    console.log("[VC_MEDIA_CLEANUP_DONE]", {
      callId: Number(callId),
      role: "expert",
      at: new Date().toISOString(),
    });
  }, [callId]);

  const scheduleUnmountCleanup = useCallback(() => {
    if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
    cleanupTimerRef.current = setTimeout(() => {
      if (pageActiveRef.current || mediaRequestInProgressRef.current) return;
      if (connectedRef.current && !manualEndRef.current && !endedRef.current) {
        console.log("[VC_CALL_FAIL_EMIT]", { callId: Number(callId), reason: "expert_left" });
        socket?.emit(EVENTS.END, { callId: Number(callId), reason: "expert_left" });
      }
      cleanupMedia();
      cleanupNativeState();
    }, 300);
  }, [callId, cleanupMedia, cleanupNativeState, socket]);

  // ============================================================
  // Main effect: Handle media and accept logic
  // ============================================================
  useEffect(() => {
    pageActiveRef.current = true;
    cleanupDoneRef.current = false;
    nativeCleanupDoneRef.current = false;
    if (cleanupTimerRef.current) {
      clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }
    if (!socket || !callId || acceptedRef.current || mediaRequestInProgressRef.current || mediaInitializedRef.current) return;
    mediaRequestInProgressRef.current = true;
    setStatus("Checking camera and microphone...");
    (async () => {
      await closeVideoPeer(true);
      console.log("[VC_MEDIA_REQUEST_START]", { callId: Number(callId), role: "expert" });
      const media = await requestExpertVideoCallMedia({ callId: Number(callId), existingStream: localStreamRef.current });
      mediaRequestInProgressRef.current = false;

      if (!pageActiveRef.current || endedRef.current) {
        stopMediaStream(media.stream);
        return;
      }

      if (media.success) {
        acceptedRef.current = true;
        mediaInitializedRef.current = true;
        localStreamRef.current = media.stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
          localVideoRef.current.play?.().catch(() => {});
        }
        console.log("[VC_MEDIA_SUCCESS]", { callId: Number(callId), role: "expert", ok: true, at: new Date().toISOString() });
        console.log("[VIDEO_CALL_ACCEPT]", { callId: Number(callId), expertId: expertData?.expertId, at: new Date().toISOString() });

        // ============================================================
        // STEP 2: Check if native already sent ACCEPT
        // ============================================================
        const nativeAcceptSent = isNativeAcceptSent(callId);
        
        if (!Capacitor.isNativePlatform()) {
          // Web platform - always send ACCEPT
          console.log("📤 Web platform - sending video accept");
          socket.emit(EVENTS.ACCEPT, { 
            callId: Number(callId) 
          });
        } else if (nativeAcceptSent) {
          // Native platform - Android already sent ACCEPT
          console.log("✅ Android already sent video accept - skipping socket emit");
        } else {
          // Native platform - Android didn't send ACCEPT (shouldn't happen)
          console.log("📤 React sending video accept (fallback)");
          socket.emit(EVENTS.ACCEPT, { 
            callId: Number(callId) 
          });
        }

        // Release lock
        releaseNativeCallLock();
        return;
      }

      setStatus(media.message);
      if (!callFailureEmittedRef.current) {
        callFailureEmittedRef.current = true;
        endedRef.current = true;
        console.log("[VC_MEDIA_FAILURE]", {
          callId: Number(callId),
          role: "expert",
          ok: false,
          errorCode: media.errorCode,
          message: media.message,
          at: new Date().toISOString(),
        });
        console.log("[VC_CALL_FAIL_EMIT]", { callId: Number(callId), reason: getMediaFailureReason(media.errorCode) });
        socket.emit(EVENTS.FAILED, { callId: Number(callId), reason: getMediaFailureReason(media.errorCode) });
        cleanupNativeState();
      }
    })();

    return () => {
      pageActiveRef.current = false;
      scheduleUnmountCleanup();
    };
  }, [callId, expertData?.expertId, getMediaFailureReason, retryNonce, scheduleUnmountCleanup, socket, cleanupNativeState]);

  // ============================================================
  // All other event handlers remain the same
  // ============================================================
  
  useEffect(() => {
    if (!socket) return undefined;

    const onConnected = ({ callId: connectedId, call_id }) => {
      const id = Number(connectedId || call_id || callId);
      if (id !== Number(callId)) return;
      connectedRef.current = true;
      setStatus("");
      attachVideoElements({ localVideoRef, remoteVideoRef });
    };

    const onOffer = async ({ callId: offeredId, offer }) => {
      if (Number(offeredId) !== Number(callId)) return;
      console.log("[VIDEO_CALL_WEBRTC_STATE]", { callId: Number(callId), side: "expert", event: "offer_received", at: new Date().toISOString() });
      try {
        console.log("[VC_PEER_INIT_START]", { callId: Number(callId), role: "expert", at: new Date().toISOString() });
        await createVideoPeer({
          socket,
          callId: Number(callId),
          localVideoRef,
          remoteVideoRef,
          stream: localStreamRef.current,
          onConnectionState: setConnectionState,
        });
        attachVideoElements({ localVideoRef, remoteVideoRef });
        await setVideoRemoteDescription(offer);
        await createAndSendVideoAnswer();
        console.log("[VC_PEER_INIT_DONE]", { callId: Number(callId), role: "expert", at: new Date().toISOString() });
        console.log("[VIDEO_CALL_WEBRTC_STATE]", { callId: Number(callId), side: "expert", event: "answer_sent", at: new Date().toISOString() });
      } catch (error) {
        setStatus(error?.message || "Unable to initialize video call");
        if (!callFailureEmittedRef.current) {
          callFailureEmittedRef.current = true;
          endedRef.current = true;
          socket.emit(EVENTS.FAILED, { callId: Number(callId), reason: "expert_webrtc_init_failed" });
          cleanupNativeState();
        }
      }
    };

    const onIce = async ({ callId: iceCallId, candidate }) => {
      if (Number(iceCallId) !== Number(callId)) return;
      await addVideoIceCandidate(candidate);
    };

    const onEnded = async (payload = {}) => {
      setStatus(payload.reason || "Call ended");
      setBilling((prev) => ({ ...prev, summary: payload.summary || prev.summary }));
      endedRef.current = true;
      await cleanupMedia();
      cleanupNativeState();
      setTimeout(() => navigate("/expert/home", { replace: true }), 1800);
    };

    const onTaken = async ({ callId: takenCallId, acceptedSocketId }) => {
      if (Number(takenCallId) === Number(callId) && acceptedSocketId !== socket.id) {
        setStatus("Call answered on another device");
        endedRef.current = true;
        await cleanupMedia();
        cleanupNativeState();
        navigate("/expert/home", { replace: true });
      }
    };

    socket.on(EVENTS.CONNECTED, onConnected);
    socket.on("video-webrtc:offer", onOffer);
    socket.on("video-webrtc:ice-candidate", onIce);
    socket.on(EVENTS.ENDED, onEnded);
    socket.on(EVENTS.CANCELLED, onEnded);
    socket.on(EVENTS.TAKEN, onTaken);
    socket.on(EVENTS.ERROR, (payload = {}) => setStatus(payload.message || "Video call failed"));
    socket.on(EVENTS.BILLING_TICK, (data) => setBilling((prev) => ({ ...prev, tick: data })));
    socket.on(EVENTS.LOW_BALANCE, () => setBilling((prev) => ({ ...prev, lowBalance: true })));
    socket.on(EVENTS.BILLING_FINALIZED, (summary) => setBilling((prev) => ({ ...prev, summary })));

    return () => {
      socket.off(EVENTS.CONNECTED, onConnected);
      socket.off("video-webrtc:offer", onOffer);
      socket.off("video-webrtc:ice-candidate", onIce);
      socket.off(EVENTS.ENDED, onEnded);
      socket.off(EVENTS.CANCELLED, onEnded);
      socket.off(EVENTS.TAKEN, onTaken);
      socket.off(EVENTS.ERROR);
      socket.off(EVENTS.BILLING_TICK);
      socket.off(EVENTS.LOW_BALANCE);
      socket.off(EVENTS.BILLING_FINALIZED);
    };
  }, [callId, cleanupMedia, cleanupNativeState, navigate, socket]);

  useEffect(() => {
    return () => {
      scheduleUnmountCleanup();
    };
  }, [scheduleUnmountCleanup]);

  const endCall = () => {
    manualEndRef.current = true;
    endedRef.current = true;
    socket?.emit(EVENTS.END, { callId: Number(callId), reason: "expert_ended" });
    cleanupMedia();
    cleanupNativeState();
    navigate("/expert/home", { replace: true });
  };

  const retryPermission = async () => {
    await cleanupMedia();
    cleanupDoneRef.current = false;
    nativeCleanupDoneRef.current = false;
    acceptedRef.current = false;
    endedRef.current = false;
    connectedRef.current = false;
    manualEndRef.current = false;
    mediaRequestInProgressRef.current = false;
    mediaInitializedRef.current = false;
    callFailureEmittedRef.current = false;
    setConnectionState("connecting");
    setStatus("Checking camera and microphone...");
    setRetryNonce((value) => value + 1);
  };

  return (
    <VideoCallRoom
      title="Expert video consultation"
      status={status}
      seconds={seconds}
      localVideoRef={localVideoRef}
      remoteVideoRef={remoteVideoRef}
      muted={muted}
      cameraOff={cameraOff}
      connectionState={connectionState}
      billing={billing}
      onToggleMute={() => {
        const next = !muted;
        setMuted(next);
        toggleVideoMute(next);
      }}
      onToggleCamera={() => {
        const next = !cameraOff;
        setCameraOff(next);
        toggleVideoCamera(next);
      }}
      onSwitchCamera={() => switchVideoCamera().catch(() => {})}
      onEnd={endCall}
      onRetryPermission={retryPermission}
    />
  );
}