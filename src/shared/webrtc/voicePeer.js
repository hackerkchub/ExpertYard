/*********************************************************
  🌿 ExpertYard – Stable WebRTC Voice Peer (FINAL)
  Production safe version - Self-contained mic handling
**********************************************************/

let pc = null;
let localStream = null;
let remoteAudioEl = null;
let pendingIce = [];

/* =====================================================
   CREATE PEER - SELF CONTAINED, ALWAYS HAS MIC
   👉 stream is OPTIONAL, will get mic if not provided
===================================================== */
export async function createPeer({ socket, callId, audioRef, stream }) {
  // prevent duplicate / closed peer reuse
  if (pc && pc.connectionState !== "closed") return pc;

  pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  });

  /* 🎤 ALWAYS ensure stream exists - SELF CONTAINED */
  try {
    localStream = stream || await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } 
    });
    
    console.log("✅ WebRTC: Got audio stream", localStream.id);
  } catch (err) {
    console.error("❌ WebRTC: Failed to get microphone:", err);
    throw new Error("Microphone access denied");
  }

  // Add all audio tracks to peer connection
  localStream.getTracks().forEach(track => {
    pc.addTrack(track, localStream);
    console.log(`🎤 Added track: ${track.kind}`, track.enabled ? 'enabled' : 'disabled');
  });

  /* 🔊 Remote audio - FIXED: Always set srcObject correctly */
  pc.ontrack = (event) => {
    console.log("🔊 Received remote track:", event.track.kind);
    
    if (!remoteAudioEl) {
      remoteAudioEl = audioRef?.current || document.createElement("audio");
      remoteAudioEl.autoplay = true;
      remoteAudioEl.playsInline = true;
      remoteAudioEl.muted = false; // ⭐ CRITICAL: Don't mute remote audio

      if (!audioRef?.current) {
        document.body.appendChild(remoteAudioEl);
      }
    }

    remoteAudioEl.srcObject = event.streams[0];
    console.log("🔊 Remote audio attached");
  };

  /* ❄ ICE Candidate handling */
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("webrtc:ice", {
        callId,
        candidate: event.candidate,
      });
    }
  };

  /* 🧠 Connection state logging */
  pc.onconnectionstatechange = () => {
    console.log("📡 PC state:", pc.connectionState);
    
    if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
      console.warn("⚠️ WebRTC connection failed");
    }
  };

  pc.oniceconnectionstatechange = () => {
    console.log("❄️ ICE state:", pc.iceConnectionState);
  };

  // Apply any pending ICE candidates
  for (const candidate of pendingIce) {
    await pc.addIceCandidate(candidate).catch(console.warn);
  }
  pendingIce = [];

  return pc;
}

/* =====================================================
   OFFER / ANSWER
===================================================== */
export async function createOffer() {
  if (!pc) return null;

  const offer = await pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: false
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
   REMOTE DESCRIPTION
===================================================== */
export async function setRemote(description) {
  if (!pc || !description) return;

  const rtcDesc =
    description instanceof RTCSessionDescription
      ? description
      : new RTCSessionDescription(description);

  await pc.setRemoteDescription(rtcDesc);
  console.log("📥 Remote description set");
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
      console.log("🧊 ICE candidate queued");
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
   CLEANUP - COMPLETE RESET
===================================================== */
export function closePeer() {
  console.log("🧹 WebRTC cleanup");
  
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

  // Clean up audio element
  if (remoteAudioEl) {
    remoteAudioEl.srcObject = null;
    remoteAudioEl.pause?.();
    if (!remoteAudioEl.hasAttribute('data-keep')) {
      remoteAudioEl.remove?.();
    }
    remoteAudioEl = null;
  }

  pendingIce = [];
  console.log("✅ WebRTC cleanup complete");
}