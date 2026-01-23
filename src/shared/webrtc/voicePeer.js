let pc = null;
let localStream = null;
let remoteAudioEl = null;
let pendingIce = [];

/* =========================
   CREATE PEER
========================= */
export async function createPeer({ socket, callId, audioRef }) {
  if (pc) return pc; // safety

  pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  /* 🎤 Get microphone */
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  /* 🔊 Remote audio */
  pc.ontrack = (event) => {
    if (!remoteAudioEl) {
      remoteAudioEl = audioRef?.current || document.createElement("audio");
      remoteAudioEl.autoplay = true;
      remoteAudioEl.playsInline = true;
      remoteAudioEl.muted = false;

      if (!audioRef?.current) {
        document.body.appendChild(remoteAudioEl);
      }
    }

    remoteAudioEl.srcObject = event.streams[0];
  };

  /* ❄ ICE */
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("webrtc:ice", {
        callId,
        candidate: event.candidate,
      });
    }
  };

  /* 🔁 Connection state logs (debug) */
  pc.onconnectionstatechange = () => {
    console.log("📡 PC state:", pc.connectionState);
  };

  return pc;
}

/* =========================
   OFFER / ANSWER HELPERS
========================= */
export async function createOffer() {
  if (!pc) return null;
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  return offer;
}

export async function createAnswer() {
  if (!pc) return null;
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  return answer;
}

/* =========================
   REMOTE DESCRIPTION
========================= */
export async function setRemote(description) {
  if (!pc || !description) return;

  const rtcDesc =
    description instanceof RTCSessionDescription
      ? description
      : new RTCSessionDescription(description);

  await pc.setRemoteDescription(rtcDesc);

  // 🔁 Apply queued ICE
  pendingIce.forEach((c) => pc.addIceCandidate(c));
  pendingIce = [];
}

/* =========================
   ICE HANDLING
========================= */
export async function addIce(candidate) {
  if (!pc || !candidate) return;

  try {
    if (pc.remoteDescription) {
      await pc.addIceCandidate(candidate);
    } else {
      pendingIce.push(candidate);
    }
  } catch (err) {
    console.error("ICE error:", err);
  }
}

/* =========================
   MUTE / UNMUTE
========================= */
export function toggleMute(muted) {
  if (!localStream) return;
  localStream.getAudioTracks().forEach((t) => {
    t.enabled = !muted;
  });
}

/* =========================
   CLEANUP
========================= */
export function closePeer() {
  if (pc) {
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.close();
  }

  pc = null;

  if (localStream) {
    localStream.getTracks().forEach((t) => t.stop());
    localStream = null;
  }

  if (remoteAudioEl && !remoteAudioEl.srcObject) {
    remoteAudioEl.remove();
  }

  remoteAudioEl = null;
  pendingIce = [];
}
