import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import VideoCallRoom from "../../../../shared/components/VideoCallRoom";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useSocket } from "../../../../shared/hooks/useSocket";
import {
  addVideoIceCandidate,
  attachVideoElements,
  closeVideoPeer,
  createAndSendVideoOffer,
  createVideoPeer,
  setVideoRemoteDescription,
  switchVideoCamera,
  toggleVideoCamera,
  toggleVideoMute,
} from "../../../../shared/webrtc/videoPeer";
import { requestVideoCallMedia, stopMediaStream } from "../../../../shared/webrtc/mediaPermissions";

const EVENTS = {
  START: "video-call:start",
  CREATED: "video-call:created",
  CONNECTED: "video-call:connected",
  CANCEL: "video-call:cancel",
  END: "video-call:end",
  ENDED: "video-call:ended",
  BUSY: "video-call:busy",
  OFFLINE: "video-call:offline",
  ERROR: "video-call:error",
  BILLING_TICK: "video-call:billing_tick",
  LOW_BALANCE: "video-call:low_balance_warning",
  BILLING_FINALIZED: "video-call:billing_finalized",
};

const callEndMessage = (reason) => {
  if (reason === "expert_media_not_readable") return "Expert camera/microphone is unavailable. Please try again later.";
  if (reason === "expert_media_permission_denied") return "Expert camera/microphone permission is blocked. Please try again later.";
  if (reason === "expert_media_device_not_found") return "Expert camera or microphone was not found. Please try again later.";
  if (reason === "expert_webrtc_init_failed") return "Expert video connection could not start. Please try again later.";
  return reason || "Call ended";
};

export default function VideoCall() {
  const { expertId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket(user?.id, "user");
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callIdRef = useRef(null);
  const startedRef = useRef(false);
  const endedRef = useRef(false);
  const localStreamRef = useRef(null);
  const pageActiveRef = useRef(false);
  const permissionRequestInProgressRef = useRef(false);
  const callFailureEmittedRef = useRef(false);
  const cleanupTimerRef = useRef(null);

  const [callId, setCallId] = useState(null);
  const [status, setStatus] = useState("Preparing camera");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [connectionState, setConnectionState] = useState("connecting");
  const [billing, setBilling] = useState({});
  const [retryNonce, setRetryNonce] = useState(0);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (startedRef.current && !endedRef.current && isConnectedRef.current) {
        setSeconds((value) => value + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cleanup = useCallback(async ({ markEnded = true } = {}) => {
    isConnectedRef.current = false;
    console.log("[VC_MEDIA_CLEANUP_START]", {
      callId: Number(callIdRef.current || 0),
      role: "user",
      hasStream: Boolean(localStreamRef.current),
      at: new Date().toISOString(),
    });
    await closeVideoPeer(true);
    stopMediaStream(localStreamRef.current);
    localStreamRef.current = null;
    if (markEnded) endedRef.current = true;
    console.log("[VC_MEDIA_CLEANUP_DONE]", {
      callId: Number(callIdRef.current || 0),
      role: "user",
      at: new Date().toISOString(),
    });
  }, []);

  const scheduleUnmountCleanup = useCallback(() => {
    if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
    cleanupTimerRef.current = setTimeout(() => {
      if (pageActiveRef.current || permissionRequestInProgressRef.current) return;
      const activeCallId = callIdRef.current;
      if (activeCallId && !endedRef.current && !callFailureEmittedRef.current) {
        console.log("[USER_CANCEL_SENT]", { callId: activeCallId, role: "user", event: EVENTS.CANCEL });
        socket?.emit(EVENTS.CANCEL, { callId: activeCallId });
      }
      cleanup({ markEnded: true });
    }, 300);
  }, [cleanup, socket]);

  useEffect(() => {
    const isIncoming = location.state?.native || location.state?.callId;
    if (isIncoming) {
      const id = Number(location.state.callId || expertId);
      callIdRef.current = id;
      setCallId(id);
    }
  }, [location.state, expertId]);

  const startCall = useCallback(async () => {
    if (!socket || !user?.id || !expertId || startedRef.current || permissionRequestInProgressRef.current) return;
    endedRef.current = false;
    callFailureEmittedRef.current = false;
    permissionRequestInProgressRef.current = true;
    setStatus("Checking camera and microphone...");

    const isIncoming = location.state?.native || location.state?.callId;
    const activeCallId = isIncoming ? Number(location.state.callId || expertId) : 0;

    try {
      console.log("[VC_MEDIA_REQUEST_START]", { callId: activeCallId, role: "user" });
      const media = await requestVideoCallMedia({ callId: activeCallId, role: "user", video: true });
      permissionRequestInProgressRef.current = false;

      if (!pageActiveRef.current || endedRef.current) {
        stopMediaStream(media.stream);
        return;
      }

      if (!media.success) {
        setStatus(media.message);
        endedRef.current = true;
        callFailureEmittedRef.current = true;
        console.log("[VC_MEDIA_FAILURE]", {
          role: "user",
          callId: activeCallId,
          errorCode: media.errorCode,
          message: media.message,
          at: new Date().toISOString(),
        });
        return;
      }

      localStreamRef.current = media.stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
        localVideoRef.current.play?.().catch(() => {});
      }
      startedRef.current = true;

      if (!isIncoming) {
        setStatus("Ringing expert");
        console.log("[VC_MEDIA_SUCCESS]", {
          role: "user",
          callId: 0,
          audioTracks: localStreamRef.current.getAudioTracks().length,
          videoTracks: localStreamRef.current.getVideoTracks().length,
          at: new Date().toISOString(),
        });
        socket.emit(EVENTS.START, {
          expertId: Number(expertId),
          pricing_mode: location.state?.pricing_mode || "per_minute",
          price_per_minute: Number(location.state?.price_per_minute || 0),
          source_context: location.state?.source_context || "expert_profile",
          source_ref_id: location.state?.source_ref_id || null,
        });
      } else {
        setStatus("Connecting...");
        console.log("[VC_MEDIA_SUCCESS]", {
          role: "user",
          callId: activeCallId,
          audioTracks: localStreamRef.current.getAudioTracks().length,
          videoTracks: localStreamRef.current.getVideoTracks().length,
          at: new Date().toISOString(),
        });
        socket.emit(EVENTS.CONNECTED, { callId: activeCallId });
      }
    } catch (error) {
      permissionRequestInProgressRef.current = false;
      setStatus("Unable to access camera or microphone. Please check browser permissions and try again.");
      endedRef.current = true;
      callFailureEmittedRef.current = true;
      console.log("[VC_MEDIA_FAILURE]", {
        role: "user",
        callId: activeCallId,
        errorCode: error?.name || "UNKNOWN_ERROR",
        message: error?.message || "",
        at: new Date().toISOString(),
      });
    }
  }, [expertId, location.state, retryNonce, socket, user?.id]);

  // Start call when component mounts or retry is clicked
  useEffect(() => {
    startCall();
  }, [startCall, retryNonce]);

  // Unmount cleanup lifecycle
  useEffect(() => {
    pageActiveRef.current = true;
    if (cleanupTimerRef.current) {
      clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }
    return () => {
      pageActiveRef.current = false;
      scheduleUnmountCleanup();
    };
  }, [scheduleUnmountCleanup]);

  useEffect(() => {
    if (!socket) return undefined;

    const onCreated = ({ callId: createdId, call_id }) => {
      const id = Number(createdId || call_id);
      callIdRef.current = id;
      setCallId(id);
      setStatus("Ringing expert");
    };

    const onConnected = async ({ callId: connectedId, call_id }) => {
      const id = Number(connectedId || call_id || callIdRef.current);
      callIdRef.current = id;
      setCallId(id);
      setStatus("");
      console.log("[VC_PEER_INIT_START]", { callId: id, role: "user", at: new Date().toISOString() });
      await createVideoPeer({
        socket,
        callId: id,
        localVideoRef,
        remoteVideoRef,
        stream: localStreamRef.current,
        onConnectionState: (state) => {
          setConnectionState(state);
          if (state === "connected") {
            isConnectedRef.current = true;
            console.log("TIMER_STARTED: WebRTC connection established, billing can proceed");
          }
        },
      });
      attachVideoElements({ localVideoRef, remoteVideoRef });
      await createAndSendVideoOffer();
      console.log("[VC_PEER_INIT_DONE]", { callId: id, role: "user", at: new Date().toISOString() });
    };

    const onAnswer = async ({ answer }) => {
      await setVideoRemoteDescription(answer);
    };

    const onIce = async ({ candidate }) => {
      await addVideoIceCandidate(candidate);
    };

    const onEnded = async (payload = {}) => {
      setStatus(callEndMessage(payload.reason));
      setBilling((prev) => ({ ...prev, summary: payload.summary || prev.summary }));
      await cleanup();
      setTimeout(() => navigate(-1), 1800);
    };

    const onError = (payload = {}) => {
      setStatus(payload.message || "Video call failed");
      callFailureEmittedRef.current = true;
      cleanup();
    };

    socket.on(EVENTS.CREATED, onCreated);
    socket.on(EVENTS.CONNECTED, onConnected);
    socket.on("video-webrtc:answer", onAnswer);
    socket.on("video-webrtc:ice-candidate", onIce);
    socket.on(EVENTS.ENDED, onEnded);
    socket.on(EVENTS.BUSY, onError);
    socket.on(EVENTS.OFFLINE, () => onError({ message: "Expert is offline" }));
    socket.on(EVENTS.ERROR, onError);
    socket.on(EVENTS.BILLING_TICK, (data) => setBilling((prev) => ({ ...prev, tick: data })));
    socket.on(EVENTS.LOW_BALANCE, () => setBilling((prev) => ({ ...prev, lowBalance: true })));
    socket.on(EVENTS.BILLING_FINALIZED, (summary) => setBilling((prev) => ({ ...prev, summary })));

    return () => {
      socket.off(EVENTS.CREATED, onCreated);
      socket.off(EVENTS.CONNECTED, onConnected);
      socket.off("video-webrtc:answer", onAnswer);
      socket.off("video-webrtc:ice-candidate", onIce);
      socket.off(EVENTS.ENDED, onEnded);
      socket.off(EVENTS.BUSY, onError);
      socket.off(EVENTS.OFFLINE);
      socket.off(EVENTS.ERROR, onError);
      socket.off(EVENTS.BILLING_TICK);
      socket.off(EVENTS.LOW_BALANCE);
      socket.off(EVENTS.BILLING_FINALIZED);
    };
  }, [cleanup, navigate, socket]);

  const endCall = () => {
    const activeCallId = callId || callIdRef.current;
    if (activeCallId) socket?.emit(EVENTS.END, { callId: activeCallId, reason: "user_ended" });
    cleanup();
    navigate(-1);
  };

  const retryPermission = async () => {
    await cleanup({ markEnded: false });
    callIdRef.current = null;
    setCallId(null);
    startedRef.current = false;
    endedRef.current = false;
    isConnectedRef.current = false;
    callFailureEmittedRef.current = false;
    permissionRequestInProgressRef.current = false;
    setConnectionState("connecting");
    setStatus("Checking camera and microphone...");
    setRetryNonce((value) => value + 1);
  };

  return (
    <VideoCallRoom
      title="Video consultation"
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
