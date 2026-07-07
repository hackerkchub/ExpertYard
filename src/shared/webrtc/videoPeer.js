import { getTurnCredentialsApi } from "../api/webrtc.api";
import { stopMediaStream } from "./mediaPermissions";

let pc = null;
let localStream = null;
let remoteStream = null;
let socketRef = null;
let callIdRef = null;
let localVideoEl = null;
let remoteVideoEl = null;
let pendingIce = [];

const RTC_CONFIG = {
  iceTransportPolicy: "all",
  iceCandidatePoolSize: 10,
  bundlePolicy: "max-bundle",
  rtcpMuxPolicy: "require",
};

const getIceServers = async () => {
  try {
    const turn = await getTurnCredentialsApi();
    if (Array.isArray(turn?.iceServers) && turn.iceServers.length) return turn.iceServers;
  } catch {}
  return [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];
};

const emit = (event, payload) => {
  if (!socketRef?.connected) return false;
  socketRef.emit(event, payload);
  return true;
};

const bindVideo = (element, stream, muted = false) => {
  if (!element || !stream) return;
  if (element.srcObject !== stream) element.srcObject = stream;
  element.autoplay = true;
  element.playsInline = true;
  element.muted = muted;
  element.play?.().catch(() => {});
};

export const getLocalVideoStream = () => localStream;
export const getRemoteVideoStream = () => remoteStream;
export const getVideoPeerConnection = () => pc;

export const attachVideoElements = ({ localVideoRef, remoteVideoRef }) => {
  localVideoEl = localVideoRef?.current || localVideoEl;
  remoteVideoEl = remoteVideoRef?.current || remoteVideoEl;
  bindVideo(localVideoEl, localStream, true);
  bindVideo(remoteVideoEl, remoteStream, false);
};

export const createVideoPeer = async ({
  socket,
  callId,
  localVideoRef,
  remoteVideoRef,
  stream,
  onConnectionState,
  onRemoteStream,
}) => {
  const previousStream = localStream;
  await closeVideoPeer(false);
  if (previousStream && previousStream !== stream) {
    stopMediaStream(previousStream);
  }
  socketRef = socket;
  callIdRef = Number(callId);
  localVideoEl = localVideoRef?.current || null;
  remoteVideoEl = remoteVideoRef?.current || null;

  if (!stream?.getTracks?.().some((track) => track.readyState === "live")) {
    throw new Error("Local video stream is required before initializing WebRTC.");
  }

  localStream = stream;
  remoteStream = new MediaStream();

  bindVideo(localVideoEl, localStream, true);
  bindVideo(remoteVideoEl, remoteStream, false);

  pc = new RTCPeerConnection({ ...RTC_CONFIG, iceServers: await getIceServers() });

  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  pc.ontrack = (event) => {
    event.streams?.[0]?.getTracks?.().forEach((track) => {
      if (!remoteStream.getTracks().some((existing) => existing.id === track.id)) {
        remoteStream.addTrack(track);
      }
    });
    bindVideo(remoteVideoEl, remoteStream, false);
    onRemoteStream?.(remoteStream);
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      emit("video-webrtc:ice-candidate", { callId: callIdRef, candidate: event.candidate });
    }
  };

  pc.onconnectionstatechange = () => {
    console.log("[VIDEO_CALL_WEBRTC_STATE]", {
      callId: callIdRef,
      event: "peer_connection_state",
      state: pc?.connectionState,
      at: new Date().toISOString(),
    });
    onConnectionState?.(pc.connectionState);
    if (pc.connectionState === "failed") restartVideoIce();
  };

  return pc;
};

export const createAndSendVideoOffer = async () => {
  if (!pc || pc.signalingState !== "stable") return false;
  const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
  await pc.setLocalDescription(offer);
  return emit("video-webrtc:offer", { callId: callIdRef, offer });
};

export const createAndSendVideoAnswer = async () => {
  if (!pc) return false;
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  return emit("video-webrtc:answer", { callId: callIdRef, answer });
};

export const setVideoRemoteDescription = async (description) => {
  if (!pc || !description) return false;
  await pc.setRemoteDescription(new RTCSessionDescription(description));
  while (pendingIce.length) {
    await pc.addIceCandidate(pendingIce.shift()).catch(() => {});
  }
  return true;
};

export const addVideoIceCandidate = async (candidate) => {
  if (!candidate) return;
  if (!pc?.remoteDescription) {
    pendingIce.push(candidate);
    return;
  }
  await pc.addIceCandidate(candidate).catch(() => {});
};

export const toggleVideoMute = (muted) => {
  localStream?.getAudioTracks?.().forEach((track) => {
    track.enabled = !muted;
  });
};

export const toggleVideoCamera = (off) => {
  localStream?.getVideoTracks?.().forEach((track) => {
    track.enabled = !off;
  });
};

export const switchVideoCamera = async () => {
  const current = localStream?.getVideoTracks?.()[0];
  const currentFacing = current?.getSettings?.().facingMode;
  const facingMode = currentFacing === "environment" ? "user" : "environment";
  const nextStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode },
  });
  const nextTrack = nextStream.getVideoTracks()[0];
  const sender = pc?.getSenders?.().find((item) => item.track?.kind === "video");
  if (sender && nextTrack) await sender.replaceTrack(nextTrack);
  current?.stop?.();
  localStream?.removeTrack?.(current);
  localStream?.addTrack?.(nextTrack);
  bindVideo(localVideoEl, localStream, true);
};

export const restartVideoIce = async () => {
  if (!pc || pc.signalingState !== "stable") return false;
  const offer = await pc.createOffer({ iceRestart: true, offerToReceiveAudio: true, offerToReceiveVideo: true });
  await pc.setLocalDescription(offer);
  return emit("video-webrtc:offer", { callId: callIdRef, offer });
};

export const closeVideoPeer = async (stopTracks = true) => {
  if (pc || localStream || remoteStream) {
    console.log("[VIDEO_CALL_PEER_CLEANUP]", {
      callId: callIdRef,
      stopTracks,
      at: new Date().toISOString(),
    });
  }
  pendingIce = [];
  if (pc) {
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.onconnectionstatechange = null;
    pc.getSenders?.().forEach((sender) => sender.replaceTrack?.(null).catch(() => {}));
    pc.close();
    pc = null;
  }
  if (stopTracks) stopMediaStream(localStream);
  if (remoteStream) {
    remoteStream.getTracks().forEach((track) => remoteStream.removeTrack(track));
  }
  if (localVideoEl) localVideoEl.srcObject = null;
  if (remoteVideoEl) remoteVideoEl.srcObject = null;
  localStream = null;
  remoteStream = null;
  socketRef = null;
  callIdRef = null;
};
