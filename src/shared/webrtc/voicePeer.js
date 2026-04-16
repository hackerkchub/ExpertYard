/*********************************************************
  🌿 ExpertYard – Stable WebRTC Voice Peer (FINAL)
  Production safe version - Self-contained mic handling
  With TURN support, network recovery, and low bandwidth optimization
**********************************************************/

let pc = null;
let localStream = null;
let remoteAudioEl = null;
let pendingIce = [];

// Store socket and callId for renegotiation
let socketRef = null;
let callIdRef = null;

// ⏱️ Timers for network monitoring
let disconnectTimer = null;
let iceTimeout = null;
let connectionTimeout = null;
let qualityInterval = null;

// 🛡️ Protection flags
let isRestartingIce = false; // Prevent renegotiation storm
// 🔥 GLOBAL LOCK (top of file me add karo)
let isGettingMic = false;

// 1️⃣ & 2️⃣ Listener attachment guards
let networkListenerAttached = false;
let visibilityListenerAttached = false;

// 🟢 Callbacks for UI
let onNetworkWeakCallback = null;
let onNetworkErrorCallback = null;

/* =====================================================
   CONFIG - TURN + STUN
===================================================== */
const RTC_CONFIG = {
  iceServers: [
    // STUN servers (public)
     { urls: "stun:stun.l.google.com:19302" },
    // { urls: "stun:stun1.l.google.com:19302" },
    // { urls: "stun:stun2.l.google.com:19302" },
    
    // TURN servers (enterprise grade - REPLACE WITH YOUR CREDENTIALS)
    {
      urls: "turn:turn.expertyard.com:3478", // ⚠️ REPLACE WITH YOUR TURN SERVER
      username: "expertyard",                 // ⚠️ REPLACE WITH YOUR USERNAME
      credential: "securepass123",            // ⚠️ REPLACE WITH YOUR PASSWORD
    },
    {
      urls: "turns:turn.expertyard.com:5349", // TURN over TLS (more secure)
      username: "expertyard",
      credential: "securepass123",
    }
  ],
  // Dynamic transport policy based on network
  iceTransportPolicy: (() => {
    const connection = navigator.connection;
    if (connection) {
      const isLowNetwork = connection.effectiveType?.includes('2g') || 
                          connection.downlink < 0.5;
      console.log(`📶 Initial network: ${connection.effectiveType}, forcing ${isLowNetwork ? 'relay' : 'all'}`);
      return isLowNetwork ? "relay" : "all";
    }
    return "all";
  })(),
  iceCandidatePoolSize: 10,
  bundlePolicy: "max-bundle",
  rtcpMuxPolicy: "require",
};

/* =====================================================
   1️⃣ Network change detection (with guard)
===================================================== */
function setupNetworkListener() {
  if (!navigator.connection || networkListenerAttached) return;
  
  navigator.connection.addEventListener("change", () => {
    console.log("📶 Network changed – restarting ICE");
    if (pc && (pc.connectionState === "connected" || pc.connectionState === "disconnected")) {
      restartIceWithRenegotiation();
    }
  });
  
  networkListenerAttached = true;
  console.log("📡 Network change listener attached");
}

/* =====================================================
   2️⃣ Tab visibility recovery (with guard)
===================================================== */
function setupVisibilityListener() {
  if (visibilityListenerAttached) return;
 document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "visible" && pc && pc.connectionState !== "connected") {
    
    const track = localStream?.getAudioTracks()[0];

    if (!track || track.readyState === "ended") {
      console.log("🔄 Recovering mic after tab switch");

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const sender = pc?.getSenders().find(s => s.track?.kind === "audio");

        if (sender && newStream.getAudioTracks()[0]) {
          await sender.replaceTrack(newStream.getAudioTracks()[0]);
          localStream = newStream;
        }

        restartIceWithRenegotiation();
      } catch (err) {
        console.error("❌ Visibility mic recovery failed:", err);
      }
    }
  }
});

  visibilityListenerAttached = true;
  console.log("👁️ Visibility change listener attached");
}

// Initialize listeners once
setupNetworkListener();
setupVisibilityListener();

/* =====================================================
   SET CALLBACKS for network events
===================================================== */
export function setNetworkCallbacks({ onWeak, onError }) {
  onNetworkWeakCallback = onWeak;
  onNetworkErrorCallback = onError;
}

/* =====================================================
   CREATE PEER - SELF CONTAINED, ALWAYS HAS MIC
   🔥 FIX 3 — DUPLICATE BUG FIXED
===================================================== */
export async function createPeer({ socket, callId, audioRef, stream }) {
  // Check if peer exists and is usable
  if (pc) {
    if (pc.signalingState !== "closed" && pc.connectionState !== "failed") {
      console.log("♻️ Reusing existing peer safely");
      return pc;
    }
    closePeer();
  }

  // Store socket and callId for renegotiation
  socketRef = socket;
  callIdRef = callId;

  pc = new RTCPeerConnection(RTC_CONFIG);

  /* 🎤 Get microphone stream */
  try {
    // Safe constraints with fallback
    localStream = stream || await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: { ideal: 1 },
        sampleRate: { ideal: 16000 },
        sampleSize: { ideal: 16 },
        volume: 1.0,
      } 
    });
    
    console.log("✅ WebRTC: Got audio stream", localStream.id);
    const settings = localStream.getAudioTracks()[0]?.getSettings();
    console.log(`🎤 Audio settings: ${settings?.sampleRate || 'unknown'}Hz, ${settings?.channelCount || 'unknown'} channels`);

    // 4️⃣ Track ended auto recovery (PROPER FIX)
   localStream.getAudioTracks().forEach(track => {
  track.onended = async () => {
    console.log("🎤 Track ended – reacquiring microphone");

    // 🔒 prevent multiple calls
    if (isGettingMic) return;
    isGettingMic = true;

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: { ideal: 1 },
          sampleRate: { ideal: 16000 },
        }
      });

      const newTrack = newStream.getAudioTracks()[0];

      // 🔥 CRITICAL — rebind listener
      newTrack.onended = track.onended;

      const sender = pc?.getSenders().find(s => s.track?.kind === "audio");

      if (sender && newTrack) {
        await sender.replaceTrack(newTrack);
        console.log("🎤 Track replaced successfully");

        localStream = newStream;

        // ⏱️ delay ICE restart (VERY IMPORTANT)
        setTimeout(() => {
          restartIceWithRenegotiation();
        }, 800);
      }

    } catch (err) {
      console.error("❌ Failed to reacquire microphone:", err);
      if (onNetworkErrorCallback) onNetworkErrorCallback();
    } finally {
      isGettingMic = false;
    }
  };
});
  } catch (err) {
    console.error("❌ WebRTC: Failed to get microphone:", err);
    throw new Error("Microphone access denied");
  }

  // Add tracks with duplicate guard
  localStream.getTracks().forEach(track => {
    const sender = pc.getSenders().find(s => s.track?.id === track.id);
    if (!sender) {
      pc.addTrack(track, localStream);
      console.log(`🎤 Added track: ${track.kind}`, track.enabled ? 'enabled' : 'disabled');
    } else {
      console.log(`🎤 Track ${track.kind} already exists, skipping`);
    }
  });

  // 🔥 AUDIO SENDER TUNING (BIGGEST QUALITY BOOST)
  const audioSender = pc.getSenders().find(s => s.track?.kind === "audio");
  if (audioSender) {
    try {
      const params = audioSender.getParameters();
      if (!params.encodings) params.encodings = [{}];
      
      params.encodings[0].maxBitrate = 32000; // 🔥 stable voice bitrate
      params.encodings[0].ptime = 20;
      
      await audioSender.setParameters(params);
      console.log("🎛️ Audio sender tuned: maxBitrate=32kbps, ptime=20ms");
    } catch (err) {
      console.warn("⚠️ Could not set audio parameters:", err);
    }
  }

  /* 🔊 Remote audio handling */
  pc.ontrack = (event) => {
    console.log("🔊 Received remote track:", event.track.kind);
    
    if (!remoteAudioEl) {
      remoteAudioEl = audioRef?.current || document.createElement("audio");
      remoteAudioEl.autoplay = true;
      remoteAudioEl.playsInline = true;
      
      // 🔥 FIX 8 — MUTED AUDIO EDGE CASE
      remoteAudioEl.muted = false;
      remoteAudioEl.volume = 1;

      if (!audioRef?.current) {
        document.body.appendChild(remoteAudioEl);
      }
    }

    // 🔥 FIX 1 — REMOTE AUDIO FULLY SAFE (ALWAYS FORCE UPDATE)
    // ALWAYS force update - prevents silent audio when track changes
    remoteAudioEl.srcObject = event.streams[0];
    
    // 🔥 HARD PLAY GUARANTEE
    setTimeout(() => {
      if (remoteAudioEl) {
        remoteAudioEl.play().catch(() => {
          console.log("🔇 Play failed, will retry on user interaction");
        });
      }
    }, 100);
    
    // 🔥 TRACK LEVEL FIX
    if (event.streams[0]) {
      event.streams[0].getAudioTracks().forEach(track => {
        track.onunmute = () => {
          console.log("🔊 Track unmuted — forcing play");
          if (remoteAudioEl) {
            remoteAudioEl.play().catch(console.warn);
          }
        };
      });
    }
    
    // 🔥 BONUS: Playout delay hint for smoother audio
    if (event.receiver) {
      try {
        event.receiver.playoutDelayHint = 0.3;
        console.log("🎵 Playout delay hint set to 0.3s");
      } catch (err) {
        console.warn("⚠️ Could not set playoutDelayHint:", err);
      }
    }
    
    console.log("🔊 Remote audio attached and forced updated");
  };

  /* ❄ ICE Candidate handling */
  pc.onicecandidate = (event) => {
    if (event.candidate && socketRef && callIdRef) {
      socketRef.emit("webrtc:ice", {
        callId: callIdRef,
        candidate: event.candidate,
      });
    }
  };

  /* 🧠 Connection state monitoring + recovery */
  pc.onconnectionstatechange = () => {
    console.log("📡 PC state:", pc.connectionState);

    // Clear timers when connected
    if (pc.connectionState === "connected") {
      if (disconnectTimer) {
        clearTimeout(disconnectTimer);
        disconnectTimer = null;
      }
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        connectionTimeout = null;
      }
    }

    if (pc.connectionState === "disconnected") {
      // 3️⃣ Force TURN after disconnect (spec-safe version)
      try {
        const currentConfig = pc.getConfiguration();
        pc.setConfiguration({
          ...currentConfig,
          iceTransportPolicy: "relay"
        }).catch(err => console.warn("⚠️ Could not force TURN:", err));
        console.log("🔄 Forcing TURN relay mode for recovery");
      } catch (err) {
        console.warn("⚠️ Failed to update config:", err);
      }

      disconnectTimer = setTimeout(() => {
        if (pc && pc.connectionState !== "connected") {
          console.log("♻️ Initiating ICE restart with renegotiation");
          restartIceWithRenegotiation();
        }
      }, 4000);
    }

    if (pc.connectionState === "failed") {
      console.log("❌ WebRTC connection failed");
      if (onNetworkErrorCallback) onNetworkErrorCallback();
      closePeer();
    }
  };

  /* ❄️ ICE connection state monitoring */
  pc.oniceconnectionstatechange = () => {
    console.log("❄️ ICE state:", pc.iceConnectionState);

    // Low network detection
    if (pc.iceConnectionState === "checking") {
      iceTimeout = setTimeout(() => {
        if (pc && pc.iceConnectionState !== "connected" && pc.iceConnectionState !== "completed") {
          console.log("📶 Network too weak - ICE stuck in checking");
          if (onNetworkWeakCallback) onNetworkWeakCallback();
        }
      }, 10000);
    }

    if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
      if (iceTimeout) {
        clearTimeout(iceTimeout);
        iceTimeout = null;
      }
    }

    if (pc.iceConnectionState === "failed") {
      console.log("❌ ICE failed");
      if (onNetworkErrorCallback) onNetworkErrorCallback();
    }
  };

  // Connection timeout
  connectionTimeout = setTimeout(() => {
    if (pc && pc.connectionState !== "connected") {
      console.log("⏳ Connection timeout after 15s");
      if (onNetworkErrorCallback) onNetworkErrorCallback();
      closePeer();
    }
  }, 15000);

  // Start quality monitoring
  startQualityMonitoring();

  return pc;
}

/* =====================================================
   ICE RESTART WITH RENEGOTIATION & STORM PROTECTION
   🔥 FIX 5 — ICE RESTART LOOP CONTROL
   🔥 FIX 2 — REDUCED AGGRESSIVENESS
===================================================== */
async function restartIceWithRenegotiation() {
  // Prevent multiple simultaneous restarts
  if (isRestartingIce) {
    console.log("🔄 ICE restart already in progress, skipping");
    return;
  }

  if (!pc || !socketRef || !callIdRef) {
    console.log("❌ Cannot restart ICE: missing peer or socket");
    return;
  }

  // 🔥 FIX 5 — Check signaling state before restart
  if (pc.signalingState !== "stable") {
    console.log("⛔ ICE restart skipped — not stable, current state:", pc.signalingState);
    return;
  }

  isRestartingIce = true;

  try {
    console.log("🔄 Creating new offer with iceRestart: true");
    const offer = await pc.createOffer({ 
      iceRestart: true,
      offerToReceiveAudio: true 
    });
    
    await pc.setLocalDescription(offer);
    
    socketRef.emit("webrtc:offer", {
      callId: callIdRef,
      offer,
    });
    
    console.log("📤 Renegotiation offer sent");
  } catch (err) {
    console.error("❌ Renegotiation failed:", err);
  } finally {
    // Always reset the flag
    isRestartingIce = false;
  }
}

/* =====================================================
   OFFER / ANSWER
===================================================== */
export async function createOffer() {
  if (!pc) return null;

  const offer = await pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: false,
  });
  
  await pc.setLocalDescription(offer);
  console.log("📤 Offer created");
  return offer;
}

export async function createAnswer() {
  if (!pc) return null;

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  console.log("📤 Answer created");
  return answer;
}

/* =====================================================
   REMOTE DESCRIPTION WITH PENDING ICE FLUSH
===================================================== */
export async function setRemote(description) {
  if (!pc || !description) return;

  const rtcDesc =
    description instanceof RTCSessionDescription
      ? description
      : new RTCSessionDescription(description);

  await pc.setRemoteDescription(rtcDesc);
  console.log("📥 Remote description set");

  // Flush pending ICE candidates
  for (const candidate of pendingIce) {
    try {
      await pc.addIceCandidate(candidate);
      console.log("🧊 Pending ICE candidate added");
    } catch (err) {
      console.warn("⚠️ Failed to add pending ICE:", err);
    }
  }
  pendingIce = [];
}

/* =====================================================
   ICE HANDLING
===================================================== */
export async function addIce(candidate) {
  if (!candidate) return;

  try {
    if (pc && pc.remoteDescription) {
      await pc.addIceCandidate(candidate);
      console.log("🧊 ICE candidate added");
    } else {
      pendingIce.push(candidate);
      console.log("🧊 ICE candidate queued (pending:", pendingIce.length, ")");
    }
  } catch (err) {
    console.error("❌ ICE error:", err);
  }
}

/* =====================================================
   MUTE / UNMUTE
===================================================== */
export function toggleMute(muted) {
  if (!localStream) return;

  localStream.getAudioTracks().forEach((t) => {
    t.enabled = !muted;
  });
  
  console.log(`🎤 ${muted ? 'Muted' : 'Unmuted'}`);
}

/* =====================================================
   GET STATS with percentage-based quality monitoring
===================================================== */
export async function getStats() {
  if (!pc) return null;
  
  try {
    const stats = await pc.getStats();
    const report = [];
    
    stats.forEach(stat => {
      if (stat.type === 'inbound-rtp' && stat.kind === 'audio') {
        report.push({
          type: 'inbound',
          packetsLost: stat.packetsLost,
          packetsReceived: stat.packetsReceived,
          jitter: stat.jitter,
          roundTripTime: stat.roundTripTime,
        });
      }
      if (stat.type === 'outbound-rtp' && stat.kind === 'audio') {
        report.push({
          type: 'outbound',
          packetsSent: stat.packetsSent,
        });
      }
    });
    
    return report;
  } catch (err) {
    console.warn("Could not get stats:", err);
    return null;
  }
}

/* =====================================================
   5️⃣ QUALITY MONITORING with safe percentage calculation
   🔥 FIX 2 — LESS AGGRESSIVE ICE RESTART
===================================================== */
function startQualityMonitoring() {
  if (qualityInterval) clearInterval(qualityInterval);
  
  qualityInterval = setInterval(async () => {
    const stats = await getStats();
    
    if (stats) {
      const inboundStats = stats.find(s => s.type === 'inbound');
      if (inboundStats) {
        // 5️⃣ Safe division with zero guard
        const total = inboundStats.packetsReceived + inboundStats.packetsLost;
        if (total === 0) return;
        
        const lossPercent = inboundStats.packetsLost / total;
        
        if (lossPercent > 0.08) { // 8% packet loss threshold
          console.log(`📉 High packet loss: ${(lossPercent * 100).toFixed(1)}%`);
          
          // 🟢 OPTIONAL: Auto switch to relay on high loss
          if (lossPercent > 0.15 && pc) {
            try {
              const currentConfig = pc.getConfiguration();
              pc.setConfiguration({
                ...currentConfig,
                iceTransportPolicy: "relay"
              }).catch(console.warn);
              console.log("🔄 Auto-switching to relay due to high packet loss");
            } catch (err) {
              console.warn("⚠️ Could not force TURN:", err);
            }
          }
          
          if (onNetworkWeakCallback) {
            onNetworkWeakCallback({
              lossPercent,
              jitter: inboundStats.jitter,
              rtt: inboundStats.roundTripTime
            });
          }
        }
        
        // 🔥 FIX 2 — LESS AGGRESSIVE: Only restart on EXTREME RTT (>1.5s) or VERY HIGH loss (>25%)
        if (inboundStats.roundTripTime > 1.5) { // Increased threshold from 0.8 to 1.5 seconds
          console.log("⚠️ Extreme RTT detected (>1.5s), restarting ICE");
          restartIceWithRenegotiation();
        }
        
        // Additional safety: Restart on very high packet loss (>25%)
        if (lossPercent > 0.25) {
          console.log("⚠️ Very high packet loss (>25%), restarting ICE");
          restartIceWithRenegotiation();
        }
      }
    }
  }, 5000);
}

/* =====================================================
   CLEANUP - COMPLETE RESET
===================================================== */
export function closePeer() {
  console.log("🧹 WebRTC cleanup");
  
  // Clear all timers
  if (disconnectTimer) {
    clearTimeout(disconnectTimer);
    disconnectTimer = null;
  }
  if (iceTimeout) {
    clearTimeout(iceTimeout);
    iceTimeout = null;
  }
  if (connectionTimeout) {
    clearTimeout(connectionTimeout);
    connectionTimeout = null;
  }
  if (qualityInterval) {
    clearInterval(qualityInterval);
    qualityInterval = null;
  }
  
  // Close peer connection
  if (pc) {
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.onconnectionstatechange = null;
    pc.oniceconnectionstatechange = null;
    pc.close();
    pc = null;
  }

  // Stop all tracks in local stream
  if (localStream) {
    localStream.getTracks().forEach((t) => {
      t.stop();
      console.log(`🛑 Stopped track: ${t.kind}`);
    });
    localStream = null;
  }

  // Safer audio element cleanup
  if (remoteAudioEl && !remoteAudioEl.hasAttribute('data-keep')) {
    remoteAudioEl.srcObject = null;
    remoteAudioEl.pause?.();
    remoteAudioEl.remove();
    remoteAudioEl = null;
  } else if (remoteAudioEl) {
    remoteAudioEl.srcObject = null;
    remoteAudioEl = null;
  }

  pendingIce = [];
  socketRef = null;
  callIdRef = null;
  isRestartingIce = false;
  
  // Reset callbacks
  onNetworkWeakCallback = null;
  onNetworkErrorCallback = null;
  
  console.log("✅ WebRTC cleanup complete");
}

/* =====================================================
   SOCKET RECONNECT HANDLER
===================================================== */
export function handleSocketReconnect() {
  console.log("🔄 Socket reconnected - cleaning up peer for renegotiation");
  closePeer();
  // Consumer should call createPeer again
}