/*********************************************************
  ExpertYard - Stable WebRTC Voice Peer (PRODUCTION READY)
  
  PRODUCTION LOGS (with feature flags):
  - Socket Connected/Disconnected/Reconnected
  - TURN API Failed → STUN Fallback
  - Relay Connected (with RTT) - once per connection
  - ICE Failed / Restart (with reason & attempt count)
  - Connection Timeout / Offer Timeout
  - Voice Frozen / Recovered - once per connection
  - Microphone Permission Denied
  - Quality metrics - throttled to 15s per connection
  - setRemote Failed / addIce Failed
**********************************************************/
import { getTurnCredentialsApi } from "../api/webrtc.api";

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------
const QUALITY_LOG_THROTTLE_MS = 15000; // FIXED: Added missing constant
const DEFAULT_TTL = 300;
const MAX_ICE_RESTART_ATTEMPTS = 3;

// ----------------------------------------------------------------------
// TURN Credential Cache with Promise Deduplication
// ----------------------------------------------------------------------
let cachedTurnResponse = null;
let turnFetchPromise = null;
let turnApiFailedLogged = false; // Prevent spam

// Helper to clear TURN cache - needed for 401/403 responses
export function clearTurnCache() {
  cachedTurnResponse = null;
  turnFetchPromise = null;
  turnApiFailedLogged = false;
  logDev("TURN", "Cache cleared");
}

async function getIceServers() {
  // Return cached response if still valid
  if (cachedTurnResponse && Date.now() < cachedTurnResponse.expireAt) {
    return cachedTurnResponse.iceServers;
  }

  // If already fetching, return the existing promise
  if (turnFetchPromise) {
    try {
      const response = await turnFetchPromise;
      return response.iceServers;
    } catch (error) {
      // If the in-flight request failed, clear the promise and try again
      turnFetchPromise = null;
      return getIceServers();
    }
  }

  // Create new fetch promise with deduplication
  turnFetchPromise = (async () => {
    try {
      const turnData = await getTurnCredentialsApi();
      
      // Validate response structure
      if (!turnData || typeof turnData !== 'object') {
        throw new Error("Invalid TURN response format");
      }

      // Check for success flag if present
      if (turnData.success === false) {
        // If 401/403, clear cache
        if (turnData.statusCode === 401 || turnData.statusCode === 403) {
          clearTurnCache();
        }
        throw new Error(turnData.message || "TURN credentials fetch failed");
      }

      // Extract iceServers
      const iceServers = turnData.iceServers || [];
      
      if (!Array.isArray(iceServers) || iceServers.length === 0) {
        throw new Error("No ICE servers received");
      }

      // Get TTL from response or use default
      const ttl = turnData.ttl || turnData.expiresIn || DEFAULT_TTL;
      
      // Cache entire response for future extensibility
      cachedTurnResponse = {
        iceServers,
        ttl,
        expireAt: Date.now() + (ttl * 1000),
        ...(turnData.region && { region: turnData.region }),
        ...(turnData.priority && { priority: turnData.priority }),
        ...(turnData.refreshToken && { refreshToken: turnData.refreshToken }),
      };
      
      // Reset fallback flag on success
      turnApiFailedLogged = false;
      
      return iceServers;
      
    } catch (error) {
      // Log TURN API failure only once
      if (!turnApiFailedLogged) {
        logError("TURN API Failed. Using Google STUN fallback.", error);
        turnApiFailedLogged = true;
      }
      
      // STUN fallback servers - NOT CACHED
      const fallbackServers = [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
      ];
      
      return fallbackServers;
    } finally {
      turnFetchPromise = null;
    }
  })();

  try {
    const result = await turnFetchPromise;
    return result;
  } catch (error) {
    turnFetchPromise = null;
    throw error;
  }
}

// ----------------------------------------------------------------------
// State variables
// ----------------------------------------------------------------------
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

// ICE restart debounce and limit
let lastIceRestartAt = 0;
let iceRestartAttempts = 0;
let lastIceRestartReason = "Unknown";
let lastIceRestartRtt = 0;

// Voice recovery logging
let voiceRecoveredLogged = false;

// Relay connected logging
let relayLogged = false;

// Store current peer reference for event handlers
let currentPeer = null;

// Offer-answer timeout
let offerAnswerTimeout = null;

// ----------------------------------------------------------------------
// Logging helpers - PRODUCTION READY
// ----------------------------------------------------------------------
const DEBUG = import.meta.env?.DEV || import.meta.env?.VITE_DEBUG_WEBRTC === 'true' || false;
const PROD_LOGS = import.meta.env?.VITE_WEBRTC_PROD_LOGS === 'true' || false;

// Production logs - feature flagged
function logProd(type, message, data = null) {
  if (!PROD_LOGS) return;
  
  const time = new Date().toLocaleTimeString();
  if (data) {
    console.log(`[${time}] [${type}] ${message}`, data);
  } else {
    console.log(`[${time}] [${type}] ${message}`);
  }
}

// Development-only logs
function logDev(type, message, data = null) {
  if (!DEBUG) return;
  const time = new Date().toLocaleTimeString();
  if (data) {
    console.log(`[${time}] [${type}] ${message}`, data);
  } else {
    console.log(`[${time}] [${type}] ${message}`);
  }
}

// Production errors - always log
function logError(message, error = null) {
  const time = new Date().toLocaleTimeString();
  if (error) {
    console.error(`[${time}] [ERROR] ${message}`, error);
  } else {
    console.error(`[${time}] [ERROR] ${message}`);
  }
}

// ----------------------------------------------------------------------
// Socket emit helper with safety check
// ----------------------------------------------------------------------
function safeSocketEmit(event, data) {
  if (!socketRef || !socketRef.connected) {
    logDev("SOCKET", `Cannot emit ${event}: socket not connected`);
    return false;
  }
  try {
    socketRef.emit(event, data);
    return true;
  } catch (error) {
    logDev("SOCKET", `Socket emit failed for ${event}`, error);
    return false;
  }
}

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------
const AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

const RTC_CONFIG = {
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
  if (!audioEl || !remoteTrackAttached) return false;
  
  if (!audioEl.paused) return true;
  
  try {
    await audioEl.play();
    if (!audioPlaybackStarted) {
      audioPlaybackStarted = true;
    }
    return true;
  } catch (error) {
    if (playRetryTimer) clearTimeout(playRetryTimer);
    playRetryTimer = setTimeout(() => {
      if (!audioEl?.srcObject || !remoteTrackAttached) return;
      audioEl.play().then(
        () => { audioPlaybackStarted = true; },
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

// ----------------------------------------------------------------------
// WebRTC Support Check
// ----------------------------------------------------------------------
function checkWebRTCSupport() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("WebRTC not supported in this browser");
  }
}

async function acquireMicrophone(providedStream) {
  checkWebRTCSupport();
  
  if (providedStream && hasLiveLocalAudio(providedStream)) {
    return providedStream;
  }
  const existingTrack = localStream?.getAudioTracks?.()[0];
  if (existingTrack && existingTrack.readyState === "live") {
    return localStream;
  }
  
  try {
    const newStream = await navigator.mediaDevices.getUserMedia({ audio: AUDIO_CONSTRAINTS });
    return newStream;
  } catch (error) {
    logError("Microphone Permission Denied", error);
    throw error;
  }
}

function attachTrackRecovery(stream) {
  stream?.getAudioTracks?.().forEach(track => {
    track.onended = async () => {
      if (isGettingMic) return;
      isGettingMic = true;
      try {
        checkWebRTCSupport();
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: AUDIO_CONSTRAINTS });
        const newTrack = newStream.getAudioTracks()[0];
        attachTrackRecovery(newStream);
        const sender = pc?.getSenders().find(item => item.track?.kind === "audio");
        if (sender && newTrack) {
          await sender.replaceTrack(newTrack);
        }
        localStream?.getTracks().forEach(item => item.stop());
        localStream = newStream;
        setTimeout(() => restartIceWithRenegotiation("Microphone recovery"), 500);
      } catch (error) {
        logDev("Microphone reacquire failed", error);
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
}

function setupRemoteAudioLifecycle(audioRef) {
  const audioEl = bindAudioElement(audioRef);
  const stream = ensureRemoteStream();
  
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
      restartIceWithRenegotiation("Network change");
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
        checkWebRTCSupport();
        const recoveredStream = await navigator.mediaDevices.getUserMedia({ audio: AUDIO_CONSTRAINTS });
        await ensureLocalAudioSender(recoveredStream);
      } catch (error) { 
        logDev("Tab visibility mic recovery failed", error); 
      }
    }
    if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
      restartIceWithRenegotiation("Visibility change");
    }
  });
  visibilityListenerAttached = true;
}

function setupAudioDeviceListener() {
  if (!navigator.mediaDevices?.ondevicechange) return;
  if (audioDeviceListenerAttached) return;
  
  navigator.mediaDevices.addEventListener("devicechange", () => {
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
// Soft cleanup
// ----------------------------------------------------------------------
async function cleanupPeerOnly() {
  clearTimers();
  pendingIce = [];
  audioPlaybackStarted = false;
  
  // Reset all state flags
  voiceRecoveredLogged = false;
  relayLogged = false;
  iceRestartAttempts = 0;
  lastIceRestartReason = "Unknown";
  lastIceRestartRtt = 0;

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
      pc.close();
    } catch (e) {}
    pc = null;
    currentPeer = null;
  }

  if (remoteAudioEl) {
    remoteAudioEl.srcObject = null;
  }

  if (remoteStream) {
    remoteStream.getTracks().forEach(track => {
      remoteStream.removeTrack(track);
    });
  }

  remoteTrackAttached = false;
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
  
  checkWebRTCSupport();
  
  if (pc && !isClosing) {
    await cleanupPeerOnly();
  }
  
  isClosing = false;
  socketRef = socket;
  callIdRef = callId;
  canInitiateIceRestart = false;
  remoteTrackAttached = false;
  audioPlaybackStarted = false;
  iceRestartAttempts = 0;
  voiceRecoveredLogged = false;
  relayLogged = false;
  lastIceRestartReason = "Unknown";
  lastIceRestartRtt = 0;

  const iceServers = await getIceServers();

  const peer = new RTCPeerConnection({
    ...RTC_CONFIG,
    iceServers,
  });

  pc = peer;
  currentPeer = peer;
  
  if (remoteAudioEl) {
    remoteAudioEl.srcObject = null;
  }
  
  if (!remoteStream) {
    remoteStream = new MediaStream();
  } else {
    remoteStream.getTracks().forEach(track => {
      remoteStream.removeTrack(track);
    });
  }

  peer.ontrack = (event) => {
    if (currentAttemptId !== connectionAttemptId) return;
    if (event.track?.kind !== "audio") return;

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
      remoteTrackAttached = true;
      safePlayAudio(remoteAudioEl, "remote-track-unmute");
    };
    event.track.onmute = () => {};
    event.track.onended = () => {
      remoteTrackAttached = false;
      // Reset recovery flag when track ends
      voiceRecoveredLogged = false;
    };

    if (event.receiver) {
      try { 
        event.receiver.playoutDelayHint = 0.3; 
      } catch (e) {}
    }
  };

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      if (!callIdRef) return;
      safeSocketEmit("webrtc:ice", { 
        callId: callIdRef, 
        candidate: event.candidate,
        attemptId: currentAttemptId
      });
    }
  };

  peer.onicecandidateerror = (e) => {
    // Filter out browser noise
    // 701 = STUN timeout, 702 = TURN timeout, 703 = Safari noise
    if (e.errorCode === 701 || e.errorCode === 702 || e.errorCode === 703) {
      return;
    }
    logDev("ICE Candidate Error", {
      code: e.errorCode,
      text: e.errorText,
      url: e.url,
    });
  };
  
  peer.onconnectionstatechange = () => {
    if (peer.connectionState === "connected") {
      if (disconnectTimer) clearTimeout(disconnectTimer);
      if (connectionTimeout) clearTimeout(connectionTimeout);
      iceRestartAttempts = 0;
      if (remoteTrackAttached) {
        safePlayAudio(remoteAudioEl, "pc-connected");
      }
    }
    if (peer.connectionState === "disconnected") {
      if (disconnectTimer) clearTimeout(disconnectTimer);
      disconnectTimer = setTimeout(() => {
        if (peer !== currentPeer) return;
        if (peer.connectionState !== "connected") {
          restartIceWithRenegotiation("Connection lost");
        }
      }, 4000);
    }
    if (peer.connectionState === "failed") {
      remoteTrackAttached = false;
      voiceRecoveredLogged = false;
      relayLogged = false;
      logError("ICE Failed");
      if (onNetworkErrorCallback) onNetworkErrorCallback();
    }
  };
  
  peer.oniceconnectionstatechange = () => {
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
      
      // Check if TURN relay is being used (only once)
      setTimeout(async () => {
        if (peer !== currentPeer) return;
        try {
          const stats = await peer.getStats();
          
          stats.forEach(report => {
            if (
              report.type === "candidate-pair" &&
              (report.selected || report.nominated || report.state === "succeeded")
            ) {
              // Get local and remote candidate types
              const localTypes = new Map();
              const remoteTypes = new Map();
              
              stats.forEach(r => {
                if (r.type === "local-candidate") {
                  localTypes.set(r.id, r.candidateType);
                }
                if (r.type === "remote-candidate") {
                  remoteTypes.set(r.id, r.candidateType);
                }
              });
              
              const localType = localTypes.get(report.localCandidateId) || "unknown";
              const remoteType = remoteTypes.get(report.remoteCandidateId) || "unknown";
              
              // Only log if TURN relay is used and not logged yet
              if ((localType === "relay" || remoteType === "relay") && !relayLogged) {
                logProd("Relay Connected", {
                  protocol: localType,
                  rtt: Math.round(report.currentRoundTripTime * 1000) + "ms"
                });
                relayLogged = true;
              }
            }
          });
        } catch (error) {
          logDev("Failed to get ICE stats", error);
        }
      }, 2000);
      
      // Voice recovered - only once per connection
      if (remoteTrackAttached && !voiceRecoveredLogged) {
        logProd("Voice Recovered");
        voiceRecoveredLogged = true;
        safePlayAudio(remoteAudioEl, "ice-connected");
      }
    }
    if (peer.iceConnectionState === "failed") {
      remoteTrackAttached = false;
      voiceRecoveredLogged = false;
      relayLogged = false;
      logError("ICE Failed");
      if (onNetworkErrorCallback) onNetworkErrorCallback();
    }
  };

  setupRemoteAudioLifecycle(audioRef);

  if (isClosing || peer !== currentPeer) {
    return peer;
  }

  try {
    const nextStream = await acquireMicrophone(stream);
    
    if (isClosing || peer !== currentPeer) {
      return peer;
    }
    
    await ensureLocalAudioSender(nextStream);
    
    if (isClosing || peer !== currentPeer) {
      return peer;
    }
  } catch (error) {
    // Error already logged in acquireMicrophone
    throw error;
  }

  clearTimers();
  connectionTimeout = setTimeout(() => {
    if (peer !== currentPeer) return;
    if (peer.connectionState !== "connected") {
      logError("Connection Timeout");
      if (onNetworkErrorCallback) onNetworkErrorCallback();
    }
  }, 15000);

  startQualityMonitoring(peer);
  return peer;
}

export async function createAndSendOffer() {
  if (!pc || !socketRef || !callIdRef) {
    return false;
  }

  if (pc.signalingState !== "stable") {
    return false;
  }

  try {
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
    });

    await pc.setLocalDescription(offer);
    canInitiateIceRestart = true;

    if (offerAnswerTimeout) clearTimeout(offerAnswerTimeout);
    offerAnswerTimeout = setTimeout(() => {
      if (pc && pc.connectionState !== "connected") {
        logError("Offer Timeout");
        restartIceWithRenegotiation("Offer timeout");
      }
    }, 12000);

    const emitted = safeSocketEmit("webrtc:offer", {
      callId: callIdRef,
      offer,
      attemptId: currentAttemptIdGlobal,
    });

    return emitted;
  } catch (error) {
    logDev("Failed to create and send offer", error);
    return false;
  }
}

async function restartIceWithRenegotiation(reason = "Unknown") {
  if (iceRestartAttempts >= MAX_ICE_RESTART_ATTEMPTS) {
    logError("ICE Restart Failed", `Limit exceeded (${MAX_ICE_RESTART_ATTEMPTS})`);
    if (onNetworkErrorCallback) {
      onNetworkErrorCallback("ICE restart limit exceeded");
    }
    return;
  }
  
  if (isRestartingIce) return;
  if (!canInitiateIceRestart) return;
  
  const peer = pc;
  if (!peer || !socketRef || !callIdRef) return;
  if (peer.signalingState !== "stable") return;
  
  const now = Date.now();
  if (now - lastIceRestartAt < 8000) return;
  lastIceRestartAt = now;
  
  iceRestartAttempts++;
  isRestartingIce = true;
  lastIceRestartReason = reason;
  
  // Get current RTT for debugging
  try {
    const stats = await peer.getStats();
    const inboundRtp = stats.values().find(stat => stat.type === "inbound-rtp" && stat.kind === "audio");
    lastIceRestartRtt = inboundRtp?.roundTripTime || 0;
  } catch (error) {
    lastIceRestartRtt = 0;
  }
  
  const rttMsg = lastIceRestartRtt > 0 ? `, RTT: ${(lastIceRestartRtt * 1000).toFixed(0)}ms` : '';
  logProd("ICE Restart", `Attempt ${iceRestartAttempts}/${MAX_ICE_RESTART_ATTEMPTS} (${reason}${rttMsg})`);
  
  try {
    const offer = await peer.createOffer({ 
      iceRestart: true, 
      offerToReceiveAudio: true 
    });
    
    if (peer !== currentPeer) {
      isRestartingIce = false;
      return;
    }
    
    await peer.setLocalDescription(offer);
    
    if (peer !== currentPeer) {
      isRestartingIce = false;
      return;
    }
    
    // FIXED: Check if socket emit succeeded
    const emitted = safeSocketEmit("webrtc:offer", { 
      callId: callIdRef, 
      offer,
      attemptId: currentAttemptIdGlobal
    });
    
    if (!emitted) {
      // Rollback attempt count if socket failed
      iceRestartAttempts--;
      logDev("ICE", "Restart offer failed to send, rolling back attempt");
      return;
    }
  } catch (error) { 
    logError("ICE Restart Failed", error);
    // Rollback attempt count on error
    iceRestartAttempts--;
  }
  finally { isRestartingIce = false; }
}

export async function createOffer() {
  if (!pc) return null;
  const offer = await pc.createOffer({ 
    offerToReceiveAudio: true 
  });
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
    if (!isOffer && offerAnswerTimeout) {
      clearTimeout(offerAnswerTimeout);
      offerAnswerTimeout = null;
    }
  } catch (error) {
    logError("setRemote Failed", error);
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
  
  try {
    if (pc && pc.remoteDescription) {
      await pc.addIceCandidate(candidate);
    } else {
      pendingIce.push(candidate);
    }
  } catch (error) { 
    if (error?.name !== "OperationError") {
      logError("addIce Failed", error);
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
    });
    return report;
  } catch (error) { 
    return null; 
  }
}

function startQualityMonitoring(peer) {
  if (qualityInterval) clearInterval(qualityInterval);
  
  let lastBytesReceived = 0;
  let freezeCount = 0;
  let lastQualityLog = 0; // PER-CONNECTION variable
  
  qualityInterval = setInterval(async () => {
    if (peer !== currentPeer) {
      clearInterval(qualityInterval);
      qualityInterval = null;
      return;
    }
    
    const stats = await getStats();
    const inbound = stats?.find(item => item.type === "inbound");
    if (!inbound) return;
    
    // Calculate lossPercent ONCE at the top
    const total = inbound.packetsReceived + inbound.packetsLost;
    const lossPercent = total > 0 ? inbound.packetsLost / total : 0;
    
    // RTP Freeze Detection
    if (
      inbound.bytesReceived === lastBytesReceived &&
      peer?.connectionState === "connected"
    ) {
      freezeCount++;
      if (freezeCount >= 3) {
        logError("Voice Frozen");
        voiceRecoveredLogged = false; // Reset so recovery logs on reconnect
        restartIceWithRenegotiation(`Voice frozen (loss: ${(lossPercent * 100).toFixed(1)}%)`);
        freezeCount = 0;
      }
    } else {
      freezeCount = 0;
    }
    lastBytesReceived = inbound.bytesReceived;
    
    // Quality metrics with throttling (PER-CONNECTION)
    const now = Date.now();
    if (now - lastQualityLog >= QUALITY_LOG_THROTTLE_MS && total > 0) {
      if (lossPercent > 0.08) {
        logProd("Packet Loss", `${(lossPercent * 100).toFixed(1)}%`);
      }
      
      if (inbound.roundTripTime > 1.5) {
        logProd("High RTT", `${(inbound.roundTripTime * 1000).toFixed(0)}ms`);
      }
      
      if (inbound.jitter > 0.1) {
        logProd("High Jitter", `${(inbound.jitter * 1000).toFixed(0)}ms`);
      }
      
      lastQualityLog = now;
    }
    
    // ICE restart triggers based on quality (use lossPercent from above)
    if (inbound.roundTripTime > 1.5 || lossPercent > 0.25) {
      const rttMs = (inbound.roundTripTime * 1000).toFixed(0);
      const lossPct = (lossPercent * 100).toFixed(1);
      restartIceWithRenegotiation(`Quality: RTT=${rttMs}ms, Loss=${lossPct}%`);
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
  if (isClosing) return;
  
  isClosing = true;
  
  clearTimers();
  
  if (qualityInterval) {
    clearInterval(qualityInterval);
    qualityInterval = null;
  }
  
  audioPlaybackStarted = false;
  pendingIce = [];
  iceRestartAttempts = 0;
  voiceRecoveredLogged = false;
  relayLogged = false;
  lastIceRestartReason = "Unknown";
  lastIceRestartRtt = 0;
  
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
  connectionAttemptId++;
  iceRestartAttempts = 0;
  voiceRecoveredLogged = false;
  relayLogged = false;
  lastIceRestartReason = "Unknown";
  lastIceRestartRtt = 0;
  await cleanupPeerOnly();
}

export function getPeerConnection() {
  return pc;
}

// Document click/touchstart listener
if (typeof document !== "undefined") {
  const resumeAudioOnInteraction = () => {
    if (remoteAudioEl && remoteTrackAttached && remoteAudioEl.paused) {
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