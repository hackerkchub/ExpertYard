/*********************************************************
  ExpertYard - Stable WebRTC Voice Peer (FIXED VERSION)
  FIXES: 
  - Clean peer recreation with fresh ontrack handlers
  - Proper state machine for connection lifecycle
  - Track verification before assuming connected
  - Debounced ICE restarts
**********************************************************/

let pc = null;
let localStream = null;
let remoteStream = null;
let remoteAudioEl = null;
let pendingIce = [];

let socketRef = null;
let callIdRef = null;

let disconnectTimer = null;
let iceTimeout = null;
let connectionTimeout = null;
let qualityInterval = null;
let playRetryTimer = null;

let isRestartingIce = false;
let isGettingMic = false;
let networkListenerAttached = false;
let visibilityListenerAttached = false;

let onNetworkWeakCallback = null;
let onNetworkErrorCallback = null;

// NEW: Track connection state machine
let connectionAttemptId = 0;
let isClosing = false;
let remoteTrackAttached = false;

// ----------------------------------------------------------------------
// Logging helpers
// ----------------------------------------------------------------------
const LOG_PREFIX = "[voicePeer]";
function logInfo(...args) { console.log(LOG_PREFIX, ...args); }
function logWarn(...args) { console.warn(LOG_PREFIX, ...args); }
function logError(...args) { console.error(LOG_PREFIX, ...args); }

function logPeerState(prefix) {
  if (!pc) {
    logInfo(prefix, "peer = null");
    return;
  }
  logInfo(prefix, {
    connectionState: pc.connectionState,
    iceConnectionState: pc.iceConnectionState,
    signalingState: pc.signalingState,
    hasRemoteTrack: remoteTrackAttached,
  });
}

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------
const AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  channelCount: { ideal: 1 },
  sampleRate: { ideal: 48000 }, // Better quality
  sampleSize: { ideal: 16 },
  volume: 1.0,
};

const RTC_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    {
      urls: "turn:turn.expertyard.com:3478",
      username: "expertyard",
      credential: "securepass123",
    },
    {
      urls: "turns:turn.expertyard.com:5349",
      username: "expertyard",
      credential: "securepass123",
    },
  ],
  iceTransportPolicy: "all",
  iceCandidatePoolSize: 10,
  bundlePolicy: "max-bundle",
  rtcpMuxPolicy: "require",
};

// ----------------------------------------------------------------------
// Timer management
// ----------------------------------------------------------------------
function clearTimers() {
  if (disconnectTimer) { clearTimeout(disconnectTimer); disconnectTimer = null; }
  if (iceTimeout) { clearTimeout(iceTimeout); iceTimeout = null; }
  if (connectionTimeout) { clearTimeout(connectionTimeout); connectionTimeout = null; }
  if (qualityInterval) { clearInterval(qualityInterval); qualityInterval = null; }
  if (playRetryTimer) { clearTimeout(playRetryTimer); playRetryTimer = null; }
}

function hasLiveLocalAudio(stream = localStream) {
  const track = stream?.getAudioTracks?.()[0];
  return Boolean(track && track.readyState === "live");
}

function ensureRemoteStream() {
  if (!remoteStream) {
    remoteStream = new MediaStream();
    logInfo("created new remoteStream");
  }
  return remoteStream;
}

function logAudioTracks(prefix, stream) {
  const tracks = stream?.getAudioTracks?.() || [];
  logInfo(prefix, tracks.map(track => ({
    id: track.id,
    enabled: track.enabled,
    muted: track.muted,
    readyState: track.readyState,
    label: track.label,
  })));
}

async function safePlayAudio(audioEl, reason = "unknown") {
  if (!audioEl) {
    logWarn("audio play skipped: no element", { reason });
    return false;
  }
  
  // Don't try to play if no remote track attached
  if (!remoteTrackAttached) {
    logWarn("audio play skipped: no remote track attached", { reason });
    return false;
  }
  
  try {
    await audioEl.play();
    logInfo("audio.play() success", { reason });
    return true;
  } catch (error) {
    logWarn("audio.play() failed", { reason, message: error?.message, name: error?.name });
    if (playRetryTimer) clearTimeout(playRetryTimer);
    playRetryTimer = setTimeout(() => {
      if (!audioEl?.srcObject) return;
      if (!remoteTrackAttached) return;
      audioEl.play().then(
        () => logInfo("audio.play() retry success", { reason }),
        (retryError) => logWarn("audio.play() retry failed", { reason, message: retryError?.message })
      );
    }, 600);
    return false;
  }
}

function bindAudioElement(audioRef) {
  const nextAudioEl = audioRef?.current || null;
  if (nextAudioEl) {
    remoteAudioEl = nextAudioEl;
    remoteAudioEl.autoplay = true;
    remoteAudioEl.playsInline = true;
    remoteAudioEl.muted = false;
    remoteAudioEl.volume = 1;
    logInfo("bound remote audio element (provided)");
  } else if (!remoteAudioEl) {
    remoteAudioEl = document.createElement("audio");
    remoteAudioEl.autoplay = true;
    remoteAudioEl.playsInline = true;
    remoteAudioEl.muted = false;
    remoteAudioEl.volume = 1;
    remoteAudioEl.setAttribute("data-generated-voice-audio", "true");
    document.body.appendChild(remoteAudioEl);
    logWarn("audioRef missing, using fallback audio element");
  }

  if (remoteAudioEl && remoteStream && remoteAudioEl.srcObject !== remoteStream) {
    remoteAudioEl.srcObject = remoteStream;
    logInfo("rebound srcObject to remote stream", { streamId: remoteStream.id });
    
    // Only auto-play if we have remote track
    if (remoteTrackAttached) {
      safePlayAudio(remoteAudioEl, "bind-audio-element");
    }
  }
  return remoteAudioEl;
}

function cleanupRemoteAudioElement() {
  if (!remoteAudioEl) return;
  try {
    remoteAudioEl.pause?.();
    remoteAudioEl.srcObject = null;
    if (remoteAudioEl.dataset?.generatedVoiceAudio === "true") remoteAudioEl.remove();
  } catch (error) { logWarn("remote audio cleanup issue", error); }
  remoteAudioEl = null;
}

async function acquireMicrophone(providedStream) {
  if (providedStream && hasLiveLocalAudio(providedStream)) {
    logAudioTracks("using provided local audio tracks", providedStream);
    return providedStream;
  }
  const existingTrack = localStream?.getAudioTracks?.()[0];
  if (existingTrack && existingTrack.readyState === "live") {
    logAudioTracks("reusing existing local audio tracks", localStream);
    return localStream;
  }
  logInfo("requesting getUserMedia");
  const newStream = await navigator.mediaDevices.getUserMedia({ audio: AUDIO_CONSTRAINTS });
  logInfo("getUserMedia success", { streamId: newStream.id });
  logAudioTracks("local audio tracks", newStream);
  return newStream;
}

function attachTrackRecovery(stream) {
  stream?.getAudioTracks?.().forEach(track => {
    track.onended = async () => {
      logWarn("local audio track ended", { trackId: track.id });
      if (isGettingMic) return;
      isGettingMic = true;
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: AUDIO_CONSTRAINTS });
        logInfo("reacquired microphone", { streamId: newStream.id });
        logAudioTracks("reacquired local audio tracks", newStream);
        const newTrack = newStream.getAudioTracks()[0];
        attachTrackRecovery(newStream);
        const sender = pc?.getSenders().find(item => item.track?.kind === "audio");
        if (sender && newTrack) {
          await sender.replaceTrack(newTrack);
          logInfo("sender.replaceTrack() success");
        }
        localStream?.getTracks().forEach(item => item.stop());
        localStream = newStream;
        setTimeout(() => restartIceWithRenegotiation(), 500);
      } catch (error) {
        logError("microphone reacquire failed", error);
        if (onNetworkErrorCallback) onNetworkErrorCallback();
      } finally { isGettingMic = false; }
    };
  });
}

async function ensureLocalAudioSender(stream) {
  localStream = stream;
  attachTrackRecovery(localStream);
  const track = localStream.getAudioTracks()[0];
  if (!track) throw new Error("No local audio track available");

  const existingSender = pc?.getSenders().find(sender => sender.track?.kind === "audio");
  if (existingSender) {
    if (existingSender.track?.id !== track.id) {
      await existingSender.replaceTrack(track);
      logInfo("replaceTrack()", { senderTrackId: existingSender.track?.id, nextTrackId: track.id });
    } else {
      logInfo("audio sender already up to date", { trackId: track.id });
    }
  } else {
    pc.addTrack(track, localStream);
    logInfo("addTrack()", { trackId: track.id, enabled: track.enabled });
  }

  try {
    const audioSender = pc.getSenders().find(sender => sender.track?.kind === "audio");
    if (audioSender) {
      const params = audioSender.getParameters();
      if (!params.encodings) params.encodings = [{}];
      params.encodings[0].maxBitrate = 32000;
      params.encodings[0].ptime = 20;
      await audioSender.setParameters(params);
      logInfo("audio sender tuned");
    }
  } catch (error) { logWarn("audio sender tuning failed", error); }
}

function setupRemoteAudioLifecycle(audioRef) {
  const audioEl = bindAudioElement(audioRef);
  const stream = ensureRemoteStream();
  if (audioEl.srcObject !== stream) {
    audioEl.srcObject = stream;
    logInfo("remote audio srcObject assigned", { streamId: stream.id });
  }
  const replay = () => {
    if (remoteTrackAttached) {
      safePlayAudio(audioEl, "media-event");
    }
  };
  audioEl.onloadedmetadata = replay;
  audioEl.oncanplay = replay;
}

function setupNetworkListener() {
  if (!navigator.connection || networkListenerAttached) return;
  navigator.connection.addEventListener("change", () => {
    logInfo("network change detected");
    if (pc && (pc.connectionState === "connected" || pc.connectionState === "disconnected")) {
      restartIceWithRenegotiation();
    }
  });
  networkListenerAttached = true;
}

function setupVisibilityListener() {
  if (visibilityListenerAttached) return;
  document.addEventListener("visibilitychange", async () => {
    logInfo("visibilitychange", document.visibilityState);
    if (document.visibilityState !== "visible" || !pc) return;
    bindAudioElement();
    if (remoteTrackAttached) {
      safePlayAudio(remoteAudioEl, "tab-visible");
    }
    const track = localStream?.getAudioTracks?.()[0];
    if (!track || track.readyState === "ended") {
      logWarn("local track missing after tab restore");
      try {
        const recoveredStream = await navigator.mediaDevices.getUserMedia({ audio: AUDIO_CONSTRAINTS });
        await ensureLocalAudioSender(recoveredStream);
      } catch (error) { logError("tab visibility mic recovery failed", error); }
    }
    if (pc.connectionState !== "connected") restartIceWithRenegotiation();
  });
  visibilityListenerAttached = true;
}

setupNetworkListener();
setupVisibilityListener();

// ----------------------------------------------------------------------
// Exported functions
// ----------------------------------------------------------------------
export function setNetworkCallbacks({ onWeak, onError }) {
  onNetworkWeakCallback = onWeak;
  onNetworkErrorCallback = onError;
}

export function attachRemoteAudio(audioRef) {
  logInfo("attachRemoteAudio called");
  setupRemoteAudioLifecycle(audioRef);
}

export async function createPeer({ socket, callId, audioRef, stream }) {
  // Increment connection attempt ID to track stale operations
  const currentAttemptId = ++connectionAttemptId;
  logInfo("createPeer called", { callId, attemptId: currentAttemptId });
  
  // CRITICAL: Always close existing peer and create a fresh one
  if (pc && !isClosing) {
    logInfo("closing existing peer before creating new one", { previousCallId: callIdRef });
    await closePeer();
  }
  
  isClosing = false;
  socketRef = socket;
  callIdRef = callId;
  remoteTrackAttached = false;

  // Create fresh RTCPeerConnection
  pc = new RTCPeerConnection(RTC_CONFIG);
  
  // Reset remote stream with fresh instance
  if (remoteStream) {
    remoteStream.getTracks().forEach(track => {
      remoteStream.removeTrack(track);
      track.stop();
    });
  }
  remoteStream = new MediaStream();
  
  logInfo("created RTCPeerConnection", { callId, attemptId: currentAttemptId });

  // CRITICAL: Setup ontrack BEFORE anything else
  pc.ontrack = (event) => {
    // Ignore stale events from previous connections
    if (currentAttemptId !== connectionAttemptId) {
      logWarn("ignoring stale ontrack from previous connection", { attemptId: currentAttemptId });
      return;
    }
    
    logInfo("ontrack fired", {
      kind: event.track?.kind,
      streamIds: event.streams?.map(s => s.id) || [],
      trackId: event.track?.id,
    });
    
    if (event.track?.kind !== "audio") return;

    setupRemoteAudioLifecycle(audioRef);
    const outputStream = ensureRemoteStream();
    const alreadyAttached = outputStream.getTracks().some(t => t.id === event.track.id);
    
    if (!alreadyAttached) {
      outputStream.addTrack(event.track);
      remoteTrackAttached = true;
      logInfo("added remote track to remoteStream", { 
        trackId: event.track.id, 
        nowTracks: outputStream.getTracks().length 
      });
      
      // Force audio element to play
      if (remoteAudioEl) {
        safePlayAudio(remoteAudioEl, "ontrack-new");
      }
    } else {
      logInfo("remote track already in stream");
    }
    
    logAudioTracks("remote audio tracks after ontrack", outputStream);

    event.track.onunmute = () => {
      logInfo("remote track unmuted", { trackId: event.track.id });
      remoteTrackAttached = true;
      safePlayAudio(remoteAudioEl, "remote-track-unmute");
    };
    event.track.onmute = () => {
      logInfo("remote track muted", { trackId: event.track.id });
      remoteTrackAttached = false;
    };
    event.track.onended = () => {
      logWarn("remote track ended", { trackId: event.track.id });
      remoteTrackAttached = false;
    };

    if (event.receiver) {
      try { 
        event.receiver.playoutDelayHint = 0.3; 
      } catch (e) { 
        logWarn("playoutDelayHint unsupported", e); 
      }
    }
  };

  pc.onicecandidate = (event) => {
    if (!event.candidate || !socketRef || !callIdRef) return;
    socketRef.emit("webrtc:ice", { callId: callIdRef, candidate: event.candidate });
    logInfo("emitted ice candidate", { callId: callIdRef, sdpMid: event.candidate.sdpMid });
  };

  pc.onsignalingstatechange = () => {
    logInfo("signalingState", pc.signalingState);
  };
  
  pc.onconnectionstatechange = () => {
    logInfo("connectionState", pc.connectionState);
    if (pc.connectionState === "connected") {
      if (disconnectTimer) clearTimeout(disconnectTimer);
      if (connectionTimeout) clearTimeout(connectionTimeout);
      if (remoteTrackAttached) {
        safePlayAudio(remoteAudioEl, "pc-connected");
      }
    }
    if (pc.connectionState === "disconnected") {
      disconnectTimer = setTimeout(() => {
        if (pc && pc.connectionState !== "connected") {
          logWarn("disconnected too long, restarting ICE");
          restartIceWithRenegotiation();
        }
      }, 4000);
    }
    if (pc.connectionState === "failed") {
      logError("peer connection failed");
      if (onNetworkErrorCallback) onNetworkErrorCallback();
    }
  };
  
  pc.oniceconnectionstatechange = () => {
    logInfo("iceConnectionState", pc.iceConnectionState);
    if (pc.iceConnectionState === "checking") {
      iceTimeout = setTimeout(() => {
        if (pc && pc.iceConnectionState !== "connected" && pc.iceConnectionState !== "completed") {
          logWarn("ICE stuck in checking");
          if (onNetworkWeakCallback) onNetworkWeakCallback();
        }
      }, 10000);
    }
    if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
      if (iceTimeout) clearTimeout(iceTimeout);
      if (remoteTrackAttached) {
        safePlayAudio(remoteAudioEl, "ice-connected");
      }
    }
    if (pc.iceConnectionState === "failed") {
      logError("ICE failed");
      if (onNetworkErrorCallback) onNetworkErrorCallback();
    }
  };

  setupRemoteAudioLifecycle(audioRef);

  try {
    const nextStream = await acquireMicrophone(stream);
    await ensureLocalAudioSender(nextStream);
    logInfo("local audio sender ready");
  } catch (error) {
    logError("getUserMedia failed", error);
    throw new Error("Microphone access denied");
  }

  clearTimers();
  connectionTimeout = setTimeout(() => {
    if (pc && pc.connectionState !== "connected") {
      logError("connection timeout after 15s");
      if (onNetworkErrorCallback) onNetworkErrorCallback();
    }
  }, 15000);

  startQualityMonitoring();
  logPeerState("createPeer finished");
  return pc;
}

async function restartIceWithRenegotiation() {
  if (isRestartingIce) { logInfo("ICE restart already in progress"); return; }
  if (!pc || !socketRef || !callIdRef) { logWarn("ICE restart skipped: missing peer/socket/callId"); return; }
  if (pc.signalingState !== "stable") {
    logWarn("ICE restart skipped: signaling not stable", { signalingState: pc.signalingState });
    return;
  }
  isRestartingIce = true;
  try {
    const offer = await pc.createOffer({ iceRestart: true, offerToReceiveAudio: true, offerToReceiveVideo: false });
    await pc.setLocalDescription(offer);
    socketRef.emit("webrtc:offer", { callId: callIdRef, offer });
    logInfo("ICE restart offer sent", { callId: callIdRef });
  } catch (error) { logError("ICE restart failed", error); }
  finally { isRestartingIce = false; }
}

export async function createOffer() {
  if (!pc) return null;
  const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: false });
  await pc.setLocalDescription(offer);
  logInfo("createOffer complete");
  return offer;
}

export async function createAnswer() {
  if (!pc) return null;
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  logInfo("createAnswer complete");
  return answer;
}

export async function setRemote(description) {
  if (!pc || !description) return false;
  
  // Prevent duplicate remote descriptions
  if (pc.remoteDescription && pc.remoteDescription.type === description.type) {
    logWarn("setRemote skipped: duplicate description", { type: description.type });
    return false;
  }
  
  const rtcDesc = description instanceof RTCSessionDescription ? description : new RTCSessionDescription(description);
  const isOffer = rtcDesc.type === "offer";
  const canApplyOffer = pc.signalingState === "stable";
  const canApplyAnswer = pc.signalingState === "have-local-offer";

  if ((isOffer && !canApplyOffer) || (!isOffer && !canApplyAnswer)) {
    logWarn("setRemote skipped due to signaling state", { type: rtcDesc.type, signalingState: pc.signalingState });
    return false;
  }
  
  try {
    await pc.setRemoteDescription(rtcDesc);
    logInfo("setRemote success", { type: rtcDesc.type, signalingState: pc.signalingState });
  } catch (error) {
    logError("setRemote failed", error);
    return false;
  }
  
  while (pendingIce.length) {
    const candidate = pendingIce.shift();
    try {
      await pc.addIceCandidate(candidate);
      logInfo("flushed queued ICE candidate");
    } catch (error) { logWarn("queued ICE flush failed", error); }
  }
  return true;
}

export async function addIce(candidate) {
  if (!candidate) return;
  try {
    if (pc && pc.remoteDescription) {
      await pc.addIceCandidate(candidate);
      logInfo("addIce success");
    } else {
      pendingIce.push(candidate);
      logInfo("queued ICE candidate", { pendingCount: pendingIce.length });
    }
  } catch (error) { logError("addIce failed", error); }
}

export function toggleMute(muted) {
  if (!localStream) return;
  localStream.getAudioTracks().forEach(track => track.enabled = !muted);
  logAudioTracks("toggleMute", localStream);
}

export async function getStats() {
  if (!pc) return null;
  try {
    const stats = await pc.getStats();
    const report = [];
    stats.forEach(stat => {
      if (stat.type === "inbound-rtp" && stat.kind === "audio") {
        report.push({ type: "inbound", packetsLost: stat.packetsLost, packetsReceived: stat.packetsReceived, jitter: stat.jitter, roundTripTime: stat.roundTripTime });
      }
      if (stat.type === "outbound-rtp" && stat.kind === "audio") {
        report.push({ type: "outbound", packetsSent: stat.packetsSent });
      }
    });
    return report;
  } catch (error) { logWarn("getStats failed", error); return null; }
}

function startQualityMonitoring() {
  if (qualityInterval) clearInterval(qualityInterval);
  qualityInterval = setInterval(async () => {
    const stats = await getStats();
    const inbound = stats?.find(item => item.type === "inbound");
    if (!inbound) return;
    const total = inbound.packetsReceived + inbound.packetsLost;
    if (!total) return;
    const lossPercent = inbound.packetsLost / total;
    if (lossPercent > 0.08 && onNetworkWeakCallback) {
      onNetworkWeakCallback({ lossPercent, jitter: inbound.jitter, rtt: inbound.roundTripTime });
    }
    if (inbound.roundTripTime > 1.5 || lossPercent > 0.25) {
      logWarn("quality degraded, triggering ICE restart", { lossPercent, roundTripTime: inbound.roundTripTime });
      restartIceWithRenegotiation();
    }
  }, 5000);
}

// EXPORTED: Force audio playback check
export function ensureAudioPlaying() {
  if (remoteAudioEl && remoteTrackAttached) {
    return safePlayAudio(remoteAudioEl, "manual-check");
  }
  return false;
}

export async function closePeer() {
  if (isClosing) {
    logInfo("closePeer already in progress");
    return;
  }
  
  isClosing = true;
  logInfo("cleanup start");
  clearTimers();
  
  if (pc) {
    // Remove all event listeners to prevent stale callbacks
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.onconnectionstatechange = null;
    pc.oniceconnectionstatechange = null;
    pc.onsignalingstatechange = null;
    
    try { 
      pc.getSenders().forEach(sender => sender.replaceTrack(null).catch(() => {})); 
    } catch(e) { 
      logWarn("sender cleanup issue", e); 
    }
    
    pc.close();
    pc = null;
  }
  
  if (localStream) {
    localStream.getTracks().forEach(track => { 
      logInfo("stopping local track", { kind: track.kind, id: track.id }); 
      track.stop(); 
    });
    localStream = null;
  }
  
  if (remoteStream) {
    remoteStream.getTracks().forEach(track => {
      remoteStream.removeTrack(track);
      track.stop();
    });
    remoteStream = null;
  }
  
  cleanupRemoteAudioElement();
  pendingIce = [];
  socketRef = null;
  callIdRef = null;
  isRestartingIce = false;
  remoteTrackAttached = false;
  onNetworkWeakCallback = null;
  onNetworkErrorCallback = null;
  isClosing = false;
  logInfo("cleanup complete");
}

export function handleSocketReconnect() {
  logInfo("socket reconnect: resetting peer state");
  connectionAttemptId++; // Invalidate all pending operations
  closePeer();
}