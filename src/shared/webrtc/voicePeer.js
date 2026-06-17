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
let currentAttemptIdGlobal = 0;

let disconnectTimer = null;
let iceTimeout = null;
let connectionTimeout = null;
let qualityInterval = null;
let playRetryTimer = null;

let isRestartingIce = false;
let isGettingMic = false;
let networkListenerAttached = false;
let visibilityListenerAttached = false;
let audioDeviceListenerAttached = false;

let onNetworkWeakCallback = null;
let onNetworkErrorCallback = null;

// Track connection state machine
let connectionAttemptId = 0;
let isClosing = false;
let remoteTrackAttached = false;

// RTP freeze detection
let audioPlaybackStarted = false;
let canInitiateIceRestart = false;

// ICE restart debounce
let lastIceRestartAt = 0;

// Store current peer reference for event handlers
let currentPeer = null;

// Offer-answer timeout
let offerAnswerTimeout = null;

// ----------------------------------------------------------------------
// Logging helpers
// ----------------------------------------------------------------------
const DEBUG = true;

function log(type, message, data = null) {
  if (!DEBUG) return;

  const time = new Date().toLocaleTimeString();

  if (data) {
    console.log(`[${time}] [${type}] ${message}`, data);
  } else {
    console.log(`[${time}] [${type}] ${message}`);
  }
}

function logError(message, error = null) {
  const time = new Date().toLocaleTimeString();

  if (error) {
    console.error(`[${time}] [ERROR] ${message}`, error);
  } else {
    console.error(`[${time}] [ERROR] ${message}`);
  }
}

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------
const AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  // channelCount: { ideal: 1 },
  // sampleRate: { ideal: 16000 },
  // sampleSize: { ideal: 16 },
  // volume: 1.0,
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
  if (offerAnswerTimeout) { clearTimeout(offerAnswerTimeout); offerAnswerTimeout = null; }
}

function hasLiveLocalAudio(stream = localStream) {
  const track = stream?.getAudioTracks?.()[0];
  return Boolean(track && track.readyState === "live");
}

function ensureRemoteStream() {
  if (!remoteStream) {
    remoteStream = new MediaStream();
  }
  return remoteStream;
}

async function safePlayAudio(audioEl, reason = "unknown") {
  if (!audioEl) {
    return false;
  }
  
  if (!remoteTrackAttached) {
    return false;
  }
  
  // Avoid interrupting already playing audio
  if (!audioEl.paused) {
    return true;
  }
  
  try {
    await audioEl.play();
    if (!audioPlaybackStarted) {
      log("MEDIA", "Remote audio playing");
      audioPlaybackStarted = true;
    }
    return true;
  } catch (error) {
    if (playRetryTimer) clearTimeout(playRetryTimer);
    playRetryTimer = setTimeout(() => {
      if (!audioEl?.srcObject) return;
      if (!remoteTrackAttached) return;
      audioEl.play().then(
        () => {
          if (!audioPlaybackStarted) {
            log("MEDIA", "Remote audio playing");
            audioPlaybackStarted = true;
          }
        },
        () => {}
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
  } else if (!remoteAudioEl) {
    remoteAudioEl = document.createElement("audio");
    remoteAudioEl.autoplay = true;
    remoteAudioEl.playsInline = true;
    remoteAudioEl.muted = false;
    remoteAudioEl.volume = 1;
    remoteAudioEl.setAttribute("data-generated-voice-audio", "true");
    document.body.appendChild(remoteAudioEl);
  }

  if (remoteAudioEl && remoteStream && remoteAudioEl.srcObject !== remoteStream) {
    remoteAudioEl.srcObject = remoteStream;
    
    if (remoteTrackAttached) {
      safePlayAudio(remoteAudioEl, "bind-audio-element");
    }
  }
  return remoteAudioEl;
}

function cleanupRemoteAudioElement(fullCleanup = true) {
  if (!remoteAudioEl) return;
  try {
    remoteAudioEl.pause?.();
    remoteAudioEl.srcObject = null;
    if (fullCleanup && remoteAudioEl.dataset?.generatedVoiceAudio === "true") {
      remoteAudioEl.remove();
    }
  } catch (error) {}
  remoteAudioEl = null;
}

async function acquireMicrophone(providedStream) {
  if (providedStream && hasLiveLocalAudio(providedStream)) {
    return providedStream;
  }
  const existingTrack = localStream?.getAudioTracks?.()[0];
  if (existingTrack && existingTrack.readyState === "live") {
    return localStream;
  }
  const newStream = await navigator.mediaDevices.getUserMedia({ audio: AUDIO_CONSTRAINTS });
  return newStream;
}

function attachTrackRecovery(stream) {
  stream?.getAudioTracks?.().forEach(track => {
    track.onended = async () => {
      if (isGettingMic) return;
      isGettingMic = true;
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: AUDIO_CONSTRAINTS });
        const newTrack = newStream.getAudioTracks()[0];
        attachTrackRecovery(newStream);
        const sender = pc?.getSenders().find(item => item.track?.kind === "audio");
        if (sender && newTrack) {
          await sender.replaceTrack(newTrack);
        }
        localStream?.getTracks().forEach(item => item.stop());
        localStream = newStream;
        setTimeout(() => restartIceWithRenegotiation(), 500);
      } catch (error) {
        logError("Microphone reacquire failed", error);
        if (onNetworkErrorCallback) onNetworkErrorCallback();
      } finally { isGettingMic = false; }
    };
  });
}

async function ensureLocalAudioSender(stream) {
  localStream = stream;
  attachTrackRecovery(localStream);

  const track = localStream.getAudioTracks()[0];

  if (!track) {
    throw new Error("No local audio track available");
  }

  track.enabled = true;

  console.log("MIC TRACK DEBUG:", {
    enabled: track.enabled,
    muted: track.muted,
    readyState: track.readyState,
    label: track.label,
    id: track.id
  });

  const senders = pc?.getSenders() || [];

  const existingSender = senders.find(
    sender => sender.track?.kind === "audio"
  );

  if (existingSender) {
    try {
      await existingSender.replaceTrack(null);
    } catch (e) {}

    await existingSender.replaceTrack(track);
  } else {
    pc.addTrack(track, localStream);
  }

  const finalSender = pc?.getSenders()?.find(
    sender => sender.track?.kind === "audio"
  );

  console.log("AUDIO SENDER DEBUG:", {
    senderExists: !!finalSender,
    senderTrackEnabled: finalSender?.track?.enabled,
    senderTrackMuted: finalSender?.track?.muted,
    senderTrackReadyState: finalSender?.track?.readyState
  });

  log("MEDIA", "Local microphone attached");
}

function setupRemoteAudioLifecycle(audioRef) {
  const audioEl = bindAudioElement(audioRef);
  const stream = ensureRemoteStream();
  
  // Clear old handlers before reassigning
  if (audioEl.onloadedmetadata) audioEl.onloadedmetadata = null;
  if (audioEl.oncanplay) audioEl.oncanplay = null;
  
  if (audioEl.srcObject !== stream) {
    audioEl.srcObject = stream;
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
    if (pc && (pc.connectionState === "connected" || pc.connectionState === "disconnected")) {
      restartIceWithRenegotiation();
    }
  });
  networkListenerAttached = true;
}

function setupVisibilityListener() {
  if (visibilityListenerAttached) return;
  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState !== "visible" || !pc) return;
    bindAudioElement();
    if (remoteTrackAttached) {
      safePlayAudio(remoteAudioEl, "tab-visible");
    }
    const track = localStream?.getAudioTracks?.()[0];
    if (!track || track.readyState === "ended") {
      try {
        const recoveredStream = await navigator.mediaDevices.getUserMedia({ audio: AUDIO_CONSTRAINTS });
        await ensureLocalAudioSender(recoveredStream);
      } catch (error) { logError("Tab visibility mic recovery failed", error); }
    }
    if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
      restartIceWithRenegotiation();
    }
  });
  visibilityListenerAttached = true;
}

// Setup audio device change listener for Bluetooth/headphones
function setupAudioDeviceListener() {
  if (!navigator.mediaDevices?.ondevicechange) return;
  if (audioDeviceListenerAttached) return;
  
  navigator.mediaDevices.addEventListener("devicechange", () => {
    log("MEDIA", "Audio device changed", { 
      hasRemoteTrack: remoteTrackAttached,
      connectionState: pc?.connectionState 
    });
    
    if (remoteTrackAttached && remoteAudioEl) {
      setTimeout(() => {
        safePlayAudio(remoteAudioEl, "device-change");
      }, 200);
    }
  });
  audioDeviceListenerAttached = true;
}

setupNetworkListener();
setupVisibilityListener();
setupAudioDeviceListener();

// ----------------------------------------------------------------------
// Soft cleanup (does NOT stop microphone)
// ----------------------------------------------------------------------
async function cleanupPeerOnly() {
  clearTimers();

  // Clear stale candidates
  pendingIce = [];
  
  // Reset audio playback flag
  audioPlaybackStarted = false;

  if (pc) {
    // Clear track event handlers to prevent memory leaks
    pc.getReceivers().forEach(receiver => {
      if (receiver.track) {
        receiver.track.onmute = null;
        receiver.track.onunmute = null;
        receiver.track.onended = null;
      }
    });
    
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.onconnectionstatechange = null;
    pc.oniceconnectionstatechange = null;
    pc.onsignalingstatechange = null;
    pc.onicegatheringstatechange = null;
    pc.onnegotiationneeded = null;
    pc.onicecandidateerror = null;

    try {
      pc.close();
    } catch (e) {}
    pc = null;
    currentPeer = null;
  }

  if (remoteAudioEl) {
    remoteAudioEl.srcObject = null;
  }

  if (remoteStream) {
    // Clear tracks but keep the stream reference for reconnection
    remoteStream.getTracks().forEach(track => {
      remoteStream.removeTrack(track);
    });
    // DON'T set remoteStream = null - allows audio continuity
  }

  remoteTrackAttached = false;

  log("PEER", "Peer cleaned (soft)");
}

// ----------------------------------------------------------------------
// Exported functions
// ----------------------------------------------------------------------
export function setNetworkCallbacks({ onWeak, onError }) {
  onNetworkWeakCallback = onWeak;
  onNetworkErrorCallback = onError;
}

export function attachRemoteAudio(audioRef) {
  setupRemoteAudioLifecycle(audioRef);
}

export function getLocalStream() {
  return localStream;
}

export async function createPeer({ socket, callId, audioRef, stream }) {
  const currentAttemptId = ++connectionAttemptId;
  currentAttemptIdGlobal = currentAttemptId;
  
  log("PEER", "Creating new peer", {
    callId,
    attemptId: currentAttemptId
  });
  
  // Use soft cleanup instead of full closePeer
  if (pc && !isClosing) {
    await cleanupPeerOnly();
  }
  
  isClosing = false;
  socketRef = socket;
  callIdRef = callId;
  canInitiateIceRestart = false;
  remoteTrackAttached = false;
  audioPlaybackStarted = false;

  // Create fresh RTCPeerConnection
  const peer = new RTCPeerConnection(RTC_CONFIG);
  pc = peer;
  currentPeer = peer;
  
  // Reset remote stream - preserve existing if available for continuity
  if (remoteAudioEl) {
    remoteAudioEl.srcObject = null;
  }
  
  // Don't recreate remoteStream if it exists - preserve for continuity
  if (!remoteStream) {
    remoteStream = new MediaStream();
  } else {
    // Clear tracks but keep the stream reference
    remoteStream.getTracks().forEach(track => {
      remoteStream.removeTrack(track);
    });
  }

  // Setup ontrack
  peer.ontrack = (event) => {
    if (currentAttemptId !== connectionAttemptId) {
      return;
    }
    
    if (event.track?.kind !== "audio") return;

    log("MEDIA", "Remote audio track received", {
      trackId: event.track.id
    });

    setupRemoteAudioLifecycle(audioRef);
    const outputStream = ensureRemoteStream();
    const alreadyAttached = outputStream.getTracks().some(t => t.id === event.track.id);
    
    if (!alreadyAttached) {
      outputStream.addTrack(event.track);
      remoteTrackAttached = true;
      
      if (remoteAudioEl) {
        safePlayAudio(remoteAudioEl, "ontrack-new");
      }
    }

    event.track.onunmute = () => {
      log("MEDIA", "Remote track unmuted");
      remoteTrackAttached = true;
      safePlayAudio(remoteAudioEl, "remote-track-unmute");
    };
    event.track.onmute = () => {
      log("MEDIA", "Remote track muted");
    };
    event.track.onended = () => {
      log("MEDIA", "Remote track ended");
      remoteTrackAttached = false;
    };

    if (event.receiver) {
      try { 
        event.receiver.playoutDelayHint = 0.3; 
      } catch (e) {}
    }
  };

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      if (!socketRef || !callIdRef) return;
      socketRef.emit("webrtc:ice", { 
        callId: callIdRef, 
        candidate: event.candidate,
        attemptId: currentAttemptId
      });
    } else {
      log("ICE", "ICE gathering complete");
    }
  };

  peer.onnegotiationneeded = () => {
    log("PEER", "Negotiation needed");
  };
  
  peer.onicegatheringstatechange = () => {
    log("ICE", `Gathering -> ${peer.iceGatheringState}`);
  };
  
  peer.onicecandidateerror = (e) => {
    logError("ICE candidate error", {
      url: e.url,
      errorCode: e.errorCode,
      errorText: e.errorText
    });
  };
  
  peer.onconnectionstatechange = () => {
    log("PEER", `Connection -> ${peer.connectionState}`);
    
    if (peer.connectionState === "connected") {
      if (disconnectTimer) clearTimeout(disconnectTimer);
      if (connectionTimeout) clearTimeout(connectionTimeout);
      if (remoteTrackAttached) {
        safePlayAudio(remoteAudioEl, "pc-connected");
      }
    }
    if (peer.connectionState === "disconnected") {
      log("ICE", "Connection lost, waiting for recovery");
      if (disconnectTimer) clearTimeout(disconnectTimer);
      disconnectTimer = setTimeout(() => {
        if (peer !== currentPeer) return;
        if (peer.connectionState !== "connected") {
          restartIceWithRenegotiation();
        }
      }, 4000);
    }
    if (peer.connectionState === "failed" || peer.connectionState === "closed") {
      log("MEDIA", "Connection failed/closed, resetting track attachment");
      remoteTrackAttached = false;
      if (peer.connectionState === "failed" && onNetworkErrorCallback) {
        onNetworkErrorCallback();
      }
    }
  };
  
  peer.oniceconnectionstatechange = () => {
    log("ICE", `ICE state -> ${peer.iceConnectionState}`);
    
    if (peer.iceConnectionState === "checking") {
      if (iceTimeout) clearTimeout(iceTimeout);
      iceTimeout = setTimeout(() => {
        if (peer !== currentPeer) return;
        if (peer.iceConnectionState !== "connected" && peer.iceConnectionState !== "completed") {
          if (onNetworkWeakCallback) onNetworkWeakCallback();
        }
      }, 10000);
    }
    if (peer.iceConnectionState === "connected" || peer.iceConnectionState === "completed") {
      if (iceTimeout) clearTimeout(iceTimeout);
      log("ICE", "Connection recovered");
      if (remoteTrackAttached) {
        safePlayAudio(remoteAudioEl, "ice-connected");
      }
    }
    if (peer.iceConnectionState === "failed") {
      logError("ICE failed");
      remoteTrackAttached = false;
      if (onNetworkErrorCallback) onNetworkErrorCallback();
    }
  };

  setupRemoteAudioLifecycle(audioRef);

  // Abort protection - check if still valid before microphone acquisition
  if (isClosing || peer !== currentPeer) {
    log("PEER", "Aborting peer creation - cleanup in progress");
    return peer;
  }

  try {
    const nextStream = await acquireMicrophone(stream);
    
    // Check again after async operation
    if (isClosing || peer !== currentPeer) {
      log("PEER", "Aborting peer creation after mic - cleanup happened");
      return peer;
    }
    
    await ensureLocalAudioSender(nextStream);
    
    // Check again after async operation
    if (isClosing || peer !== currentPeer) {
      log("PEER", "Aborting peer creation after audio sender - cleanup happened");
      return peer;
    }
  } catch (error) {
    logError("Microphone access denied", error);
    throw new Error("Microphone access denied");
  }

  clearTimers();
  connectionTimeout = setTimeout(() => {
    if (peer !== currentPeer) return;
    if (peer.connectionState !== "connected") {
      logError("Connection timeout after 15s");
      if (onNetworkErrorCallback) onNetworkErrorCallback();
    }
  }, 15000);

  startQualityMonitoring(peer);
  return peer;
}

export async function createAndSendOffer() {
  if (!pc || !socketRef || !callIdRef) {
    log("PEER", "Cannot create offer: missing pc, socket, or callId");
    return false;
  }

  if (pc.signalingState !== "stable") {
    log("PEER", "Skipping offer - signaling not stable", { signalingState: pc.signalingState });
    return false;
  }

  try {
    log("PEER", "Creating offer");
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      // offerToReceiveVideo: false,
    });

    await pc.setLocalDescription(offer);
    canInitiateIceRestart = true;

    // Set timeout for answer
    if (offerAnswerTimeout) clearTimeout(offerAnswerTimeout);
    offerAnswerTimeout = setTimeout(() => {
      if (pc && pc.connectionState !== "connected") {
        log("PEER", "No answer received within timeout, restarting ICE");
        restartIceWithRenegotiation();
      }
    }, 12000);

    socketRef.emit("webrtc:offer", {
      callId: callIdRef,
      offer,
      attemptId: currentAttemptIdGlobal,
    });

    log("PEER", "Offer created and sent", { attemptId: currentAttemptIdGlobal });
    return true;
  } catch (error) {
    logError("Failed to create and send offer", error);
    return false;
  }
}

async function restartIceWithRenegotiation() {
  if (isRestartingIce) return;
  if (!canInitiateIceRestart) return;
  
  const peer = pc;
  if (!peer || !socketRef || !callIdRef) return;
  if (peer.signalingState !== "stable") return;
  
  const now = Date.now();
  if (now - lastIceRestartAt < 8000) {
    return;
  }
  lastIceRestartAt = now;
  
  isRestartingIce = true;
  log("ICE", "Restarting ICE");
  
  try {
    const offer = await peer.createOffer({ iceRestart: true, offerToReceiveAudio: true, offerToReceiveVideo: false });
    
    if (peer !== currentPeer) {
      log("ICE", "Peer changed during ICE restart, aborting");
      return;
    }
    
    await peer.setLocalDescription(offer);
    
    if (peer !== currentPeer) return;
    
    socketRef.emit("webrtc:offer", { 
      callId: callIdRef, 
      offer,
      attemptId: currentAttemptIdGlobal
    });
    log("ICE", "ICE restart offer sent", { attemptId: currentAttemptIdGlobal });
  } catch (error) { 
    logError("ICE restart failed", error); 
  }
  finally { isRestartingIce = false; }
}

export async function createOffer() {
  if (!pc) return null;
  const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: false });
  await pc.setLocalDescription(offer);
  return offer;
}

export async function createAnswer() {
  if (!pc) return null;
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  return answer;
}

export async function setRemote(description, attemptId = null) {
  if (!pc || !description) return false;
  
  // Relax attemptId check to avoid mismatch between independent client counters
  // if (attemptId && attemptId !== currentAttemptIdGlobal) {
  //   return false;
  // }
  
  if (pc.remoteDescription && pc.remoteDescription.sdp === description.sdp) {
    return false;
  }
  
  const rtcDesc = description instanceof RTCSessionDescription ? description : new RTCSessionDescription(description);
  const isOffer = rtcDesc.type === "offer";
  const canApplyOffer = pc.signalingState === "stable";
  const canApplyAnswer = pc.signalingState === "have-local-offer";

  if ((isOffer && !canApplyOffer) || (!isOffer && !canApplyAnswer)) {
    return false;
  }
  
  try {
    await pc.setRemoteDescription(rtcDesc);
    // Clear offer-answer timeout when answer is received
    if (!isOffer && offerAnswerTimeout) {
      clearTimeout(offerAnswerTimeout);
      offerAnswerTimeout = null;
    }
  } catch (error) {
    logError("setRemote failed", error);
    return false;
  }
  
  while (pendingIce.length) {
    const candidate = pendingIce.shift();
    try {
      await pc.addIceCandidate(candidate);
    } catch (error) {}
  }
  return true;
}

export async function addIce(candidate, attemptId = null) {
  if (!candidate) return;
  
  // Relax attemptId check to avoid mismatch between independent client counters
  // if (attemptId && attemptId !== currentAttemptIdGlobal) {
  //   return;
  // }
  
  try {
    if (pc && pc.remoteDescription) {
      await pc.addIceCandidate(candidate);
    } else {
      pendingIce.push(candidate);
    }
  } catch (error) { 
    if (error?.name !== "OperationError") {
      logError("addIce failed", error);
    }
  }
}

export function toggleMute(muted) {
  if (!localStream) return;
  localStream.getAudioTracks().forEach(track => track.enabled = !muted);
}

export async function getStats() {
  const peer = pc;
  if (!peer) return null;
  
  try {
    const stats = await peer.getStats();
    
    if (peer !== pc) return null;
    
    const report = [];
    const localCandidates = new Map();
    const remoteCandidates = new Map();
    let selectedPair = null;
    
    stats.forEach(stat => {
      if (stat.type === "inbound-rtp" && stat.kind === "audio") {
        report.push({ 
          type: "inbound", 
          packetsLost: stat.packetsLost, 
          packetsReceived: stat.packetsReceived,
          bytesReceived: stat.bytesReceived,
          jitter: stat.jitter, 
          roundTripTime: stat.roundTripTime,
          totalAudioEnergy: stat.totalAudioEnergy
        });
      }
      if (stat.type === "outbound-rtp" && stat.kind === "audio") {
        report.push({ type: "outbound", packetsSent: stat.packetsSent });
      }
      if (stat.type === "candidate-pair" && stat.selected) {
        selectedPair = stat;
      }
      if (stat.type === "local-candidate") {
        localCandidates.set(stat.id, stat.candidateType);
      }
      if (stat.type === "remote-candidate") {
        remoteCandidates.set(stat.id, stat.candidateType);
      }
    });
    
    if (selectedPair) {
      const localType = localCandidates.get(selectedPair.localCandidateId);
      const remoteType = remoteCandidates.get(selectedPair.remoteCandidateId);
      log("ICE", `Selected candidate - Local: ${localType}, Remote: ${remoteType}`);
    }
    
    return report;
  } catch (error) { 
    return null; 
  }
}

function startQualityMonitoring(peer) {
  if (qualityInterval) clearInterval(qualityInterval);
  
  let lastBytesReceived = 0;
  let freezeCount = 0;
  
  qualityInterval = setInterval(async () => {
    if (peer !== currentPeer) {
      clearInterval(qualityInterval);
      qualityInterval = null;
      return;
    }
    
    const stats = await getStats();
    const inbound = stats?.find(item => item.type === "inbound");
    if (!inbound) return;
    
    if (
      inbound.bytesReceived === lastBytesReceived &&
      peer?.connectionState === "connected"
    ) {
      freezeCount++;
      
      log("RTP", `No data received (${freezeCount})`);
      
      if (freezeCount >= 3) {
        logError("MEDIA FROZEN");
        restartIceWithRenegotiation();
        freezeCount = 0;
      }
    } else {
      freezeCount = 0;
    }
    
    lastBytesReceived = inbound.bytesReceived;
    
    const total = inbound.packetsReceived + inbound.packetsLost;
    if (!total) return;
    const lossPercent = inbound.packetsLost / total;
    if (lossPercent > 0.08 && onNetworkWeakCallback) {
      onNetworkWeakCallback({ lossPercent, jitter: inbound.jitter, rtt: inbound.roundTripTime });
    }
    if (inbound.roundTripTime > 1.5 || lossPercent > 0.25) {
      restartIceWithRenegotiation();
    }
  }, 5000);
}

export function ensureAudioPlaying() {
  if (remoteAudioEl && remoteTrackAttached) {
    return safePlayAudio(remoteAudioEl, "manual-check");
  }
  return false;
}

export async function closePeer(fullCleanup = true) {
  if (isClosing) {
    return;
  }
  
  isClosing = true;
  log("PEER", "Destroying peer connection", { fullCleanup });
  clearTimers();
  
  if (qualityInterval) {
    clearInterval(qualityInterval);
    qualityInterval = null;
  }
  
  audioPlaybackStarted = false;
  pendingIce = [];
  
  if (pc) {
    pc.getReceivers().forEach(receiver => {
      if (receiver.track) {
        receiver.track.onmute = null;
        receiver.track.onunmute = null;
        receiver.track.onended = null;
      }
    });
    
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.onconnectionstatechange = null;
    pc.oniceconnectionstatechange = null;
    pc.onsignalingstatechange = null;
    pc.onicegatheringstatechange = null;
    pc.onnegotiationneeded = null;
    pc.onicecandidateerror = null;
    
    try { 
      pc.getSenders().forEach(sender => sender.replaceTrack(null).catch(() => {})); 
    } catch(e) {}
    
    try {
      pc.close();
    } catch (e) {}
    pc = null;
    currentPeer = null;
  }
  
  if (fullCleanup && localStream) {
    localStream.getTracks().forEach(track => { 
      track.stop(); 
    });
    localStream = null;
  }
  
  if (remoteAudioEl) {
    remoteAudioEl.srcObject = null;
  }
  
  if (remoteStream) {
    remoteStream.getTracks().forEach(track => {
      remoteStream.removeTrack(track);
    });
    if (fullCleanup) {
      remoteStream = null;
    }
  }
  
  // Only remove audio element on full cleanup
  cleanupRemoteAudioElement(fullCleanup);
  
  socketRef = null;
  callIdRef = null;
  canInitiateIceRestart = false;
  isRestartingIce = false;
  remoteTrackAttached = false;
  
  setTimeout(() => {
    isClosing = false;
  }, 100);
}

export async function handleSocketReconnect() {
  log("SOCKET", "Socket reconnected");
  connectionAttemptId++;
  await cleanupPeerOnly();
}

export function getPeerConnection() {
  return pc;
}

// Document click/touchstart listener to bypass browser audio autoplay restrictions
if (typeof document !== "undefined") {
  const resumeAudioOnInteraction = () => {
    if (remoteAudioEl && remoteTrackAttached && remoteAudioEl.paused) {
      log("MEDIA", "User interacted, attempting to play remote audio");
      safePlayAudio(remoteAudioEl, "user-interaction").then((success) => {
        if (success) {
          document.removeEventListener("click", resumeAudioOnInteraction);
          document.removeEventListener("touchstart", resumeAudioOnInteraction);
        }
      });
    }
  };
  document.addEventListener("click", resumeAudioOnInteraction, { passive: true });
  document.addEventListener("touchstart", resumeAudioOnInteraction, { passive: true });
}
