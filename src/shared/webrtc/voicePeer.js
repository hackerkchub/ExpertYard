/*********************************************************
  ExpertYard - Stable WebRTC Voice Peer
  Frontend-side reliability fixes for audio attach, cleanup,
  reconnect, and resume renegotiation.
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

const AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  channelCount: { ideal: 1 },
  sampleRate: { ideal: 16000 },
  sampleSize: { ideal: 16 },
  volume: 1.0,
};

const RTC_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
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
  iceTransportPolicy: (() => {
    const connection = navigator.connection;
    if (connection) {
      const isLowNetwork =
        connection.effectiveType?.includes("2g") || connection.downlink < 0.5;
      console.log(
        "[voicePeer] initial network",
        connection.effectiveType,
        "policy=",
        isLowNetwork ? "relay" : "all"
      );
      return isLowNetwork ? "relay" : "all";
    }
    return "all";
  })(),
  iceCandidatePoolSize: 10,
  bundlePolicy: "max-bundle",
  rtcpMuxPolicy: "require",
};

function clearTimers() {
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
  if (playRetryTimer) {
    clearTimeout(playRetryTimer);
    playRetryTimer = null;
  }
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

function logAudioTracks(prefix, stream) {
  const tracks = stream?.getAudioTracks?.() || [];
  console.log(
    prefix,
    tracks.map((track) => ({
      id: track.id,
      enabled: track.enabled,
      muted: track.muted,
      readyState: track.readyState,
      label: track.label,
    }))
  );
}

async function safePlayAudio(audioEl, reason = "unknown") {
  if (!audioEl) {
    console.warn("[voicePeer] audio play skipped: no element", { reason });
    return false;
  }

  try {
    await audioEl.play();
    console.log("[voicePeer] audio.play() success", { reason });
    return true;
  } catch (error) {
    console.warn("[voicePeer] audio.play() failed", {
      reason,
      message: error?.message,
      name: error?.name,
    });

    if (playRetryTimer) {
      clearTimeout(playRetryTimer);
    }

    playRetryTimer = setTimeout(() => {
      if (!audioEl?.srcObject) return;
      audioEl.play().then(
        () => console.log("[voicePeer] audio.play() retry success", { reason }),
        (retryError) =>
          console.warn("[voicePeer] audio.play() retry failed", {
            reason,
            message: retryError?.message,
            name: retryError?.name,
          })
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
    console.log("[voicePeer] bound remote audio element", {
      tagName: remoteAudioEl.tagName,
    });
  } else if (!remoteAudioEl) {
    remoteAudioEl = document.createElement("audio");
    remoteAudioEl.autoplay = true;
    remoteAudioEl.playsInline = true;
    remoteAudioEl.muted = false;
    remoteAudioEl.volume = 1;
    remoteAudioEl.setAttribute("data-generated-voice-audio", "true");
    document.body.appendChild(remoteAudioEl);
    console.warn("[voicePeer] audioRef missing, using fallback audio element");
  }

  if (remoteAudioEl && remoteStream && remoteAudioEl.srcObject !== remoteStream) {
    remoteAudioEl.srcObject = remoteStream;
    console.log("[voicePeer] rebound srcObject to remote stream", {
      streamId: remoteStream.id,
    });
    safePlayAudio(remoteAudioEl, "bind-audio-element");
  }

  return remoteAudioEl;
}

function cleanupRemoteAudioElement() {
  if (!remoteAudioEl) return;

  try {
    remoteAudioEl.pause?.();
    remoteAudioEl.srcObject = null;

    if (remoteAudioEl.dataset?.generatedVoiceAudio === "true") {
      remoteAudioEl.remove();
    }
  } catch (error) {
    console.warn("[voicePeer] remote audio cleanup issue", error);
  }

  remoteAudioEl = null;
}

async function acquireMicrophone(providedStream) {
  if (providedStream && hasLiveLocalAudio(providedStream)) {
    logAudioTracks("[voicePeer] using provided local audio tracks", providedStream);
    return providedStream;
  }

  const existingTrack = localStream?.getAudioTracks?.()[0];
  if (existingTrack && existingTrack.readyState === "live") {
    logAudioTracks("[voicePeer] reusing existing local audio tracks", localStream);
    return localStream;
  }

  console.log("[voicePeer] requesting getUserMedia");
  const newStream = await navigator.mediaDevices.getUserMedia({
    audio: AUDIO_CONSTRAINTS,
  });
  console.log("[voicePeer] getUserMedia success", { streamId: newStream.id });
  logAudioTracks("[voicePeer] local audio tracks", newStream);
  return newStream;
}

function attachTrackRecovery(stream) {
  stream?.getAudioTracks?.().forEach((track) => {
    track.onended = async () => {
      console.warn("[voicePeer] local audio track ended", { trackId: track.id });

      if (isGettingMic) return;
      isGettingMic = true;

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: AUDIO_CONSTRAINTS,
        });
        console.log("[voicePeer] reacquired microphone", { streamId: newStream.id });
        logAudioTracks("[voicePeer] reacquired local audio tracks", newStream);

        const newTrack = newStream.getAudioTracks()[0];
        attachTrackRecovery(newStream);

        const sender = pc?.getSenders().find((item) => item.track?.kind === "audio");
        if (sender && newTrack) {
          await sender.replaceTrack(newTrack);
          console.log("[voicePeer] sender.replaceTrack() success", {
            oldTrackId: track.id,
            newTrackId: newTrack.id,
          });
        }

        localStream?.getTracks().forEach((item) => item.stop());
        localStream = newStream;

        setTimeout(() => {
          restartIceWithRenegotiation();
        }, 500);
      } catch (error) {
        console.error("[voicePeer] microphone reacquire failed", error);
        if (onNetworkErrorCallback) onNetworkErrorCallback();
      } finally {
        isGettingMic = false;
      }
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

  const existingSender = pc
    ?.getSenders()
    .find((sender) => sender.track?.kind === "audio");

  if (existingSender) {
    if (existingSender.track?.id !== track.id) {
      await existingSender.replaceTrack(track);
      console.log("[voicePeer] replaceTrack()", {
        senderTrackId: existingSender.track?.id,
        nextTrackId: track.id,
      });
    } else {
      console.log("[voicePeer] audio sender already up to date", {
        trackId: track.id,
      });
    }
  } else {
    pc.addTrack(track, localStream);
    console.log("[voicePeer] addTrack()", {
      trackId: track.id,
      enabled: track.enabled,
    });
  }

  try {
    const audioSender = pc.getSenders().find((sender) => sender.track?.kind === "audio");
    if (audioSender) {
      const params = audioSender.getParameters();
      if (!params.encodings) params.encodings = [{}];
      params.encodings[0].maxBitrate = 32000;
      params.encodings[0].ptime = 20;
      await audioSender.setParameters(params);
      console.log("[voicePeer] audio sender tuned");
    }
  } catch (error) {
    console.warn("[voicePeer] audio sender tuning failed", error);
  }
}

function setupRemoteAudioLifecycle(audioRef) {
  const audioEl = bindAudioElement(audioRef);
  const stream = ensureRemoteStream();

  if (audioEl.srcObject !== stream) {
    audioEl.srcObject = stream;
    console.log("[voicePeer] remote audio srcObject assigned", {
      streamId: stream.id,
    });
  }

  const replay = () => safePlayAudio(audioEl, "media-event");
  audioEl.onloadedmetadata = replay;
  audioEl.oncanplay = replay;
}

function setupNetworkListener() {
  if (!navigator.connection || networkListenerAttached) return;

  navigator.connection.addEventListener("change", () => {
    console.log("[voicePeer] network change detected");
    if (pc && (pc.connectionState === "connected" || pc.connectionState === "disconnected")) {
      restartIceWithRenegotiation();
    }
  });

  networkListenerAttached = true;
}

function setupVisibilityListener() {
  if (visibilityListenerAttached) return;

  document.addEventListener("visibilitychange", async () => {
    console.log("[voicePeer] visibilitychange", document.visibilityState);

    if (document.visibilityState !== "visible" || !pc) return;

    bindAudioElement();
    safePlayAudio(remoteAudioEl, "tab-visible");

    const track = localStream?.getAudioTracks?.()[0];
    if (!track || track.readyState === "ended") {
      console.warn("[voicePeer] local track missing after tab restore");
      try {
        const recoveredStream = await navigator.mediaDevices.getUserMedia({
          audio: AUDIO_CONSTRAINTS,
        });
        await ensureLocalAudioSender(recoveredStream);
      } catch (error) {
        console.error("[voicePeer] tab visibility mic recovery failed", error);
      }
    }

    if (pc.connectionState !== "connected") {
      restartIceWithRenegotiation();
    }
  });

  visibilityListenerAttached = true;
}

setupNetworkListener();
setupVisibilityListener();

export function setNetworkCallbacks({ onWeak, onError }) {
  onNetworkWeakCallback = onWeak;
  onNetworkErrorCallback = onError;
}

export function attachRemoteAudio(audioRef) {
  setupRemoteAudioLifecycle(audioRef);
}

export async function createPeer({ socket, callId, audioRef, stream }) {
  const shouldReuseExistingPeer =
    pc &&
    pc.signalingState !== "closed" &&
    pc.connectionState !== "failed" &&
    callIdRef === callId;

  socketRef = socket;
  callIdRef = callId;

  if (!shouldReuseExistingPeer) {
    if (pc) {
      console.log("[voicePeer] closing stale peer before createPeer", {
        previousCallId: callIdRef,
      });
      closePeer();
      socketRef = socket;
      callIdRef = callId;
    }

    pc = new RTCPeerConnection(RTC_CONFIG);
    remoteStream = new MediaStream();

    console.log("[voicePeer] created RTCPeerConnection", { callId });

    pc.ontrack = (event) => {
      console.log("[voicePeer] ontrack fired", {
        kind: event.track?.kind,
        streamIds: event.streams?.map((item) => item.id) || [],
        trackId: event.track?.id,
      });

      if (event.track?.kind !== "audio") return;

      setupRemoteAudioLifecycle(audioRef);
      const outputStream = ensureRemoteStream();

      const alreadyAttached = outputStream
        .getTracks()
        .some((item) => item.id === event.track.id);

      if (!alreadyAttached) {
        outputStream.addTrack(event.track);
      }

      event.track.onunmute = () => {
        console.log("[voicePeer] remote track unmuted", { trackId: event.track.id });
        safePlayAudio(remoteAudioEl, "remote-track-unmute");
      };

      event.track.onmute = () => {
        console.log("[voicePeer] remote track muted", { trackId: event.track.id });
      };

      event.track.onended = () => {
        console.warn("[voicePeer] remote track ended", { trackId: event.track.id });
      };

      logAudioTracks("[voicePeer] remote audio tracks", outputStream);

      if (event.receiver) {
        try {
          event.receiver.playoutDelayHint = 0.3;
        } catch (error) {
          console.warn("[voicePeer] playoutDelayHint unsupported", error);
        }
      }

      safePlayAudio(remoteAudioEl, "ontrack");
    };

    pc.onicecandidate = (event) => {
      if (!event.candidate || !socketRef || !callIdRef) return;

      socketRef.emit("webrtc:ice", {
        callId: callIdRef,
        candidate: event.candidate,
      });
      console.log("[voicePeer] emitted ice candidate", {
        callId: callIdRef,
        sdpMid: event.candidate.sdpMid,
      });
    };

    pc.onsignalingstatechange = () => {
      console.log("[voicePeer] signalingState", pc.signalingState);
    };

    pc.onconnectionstatechange = () => {
      console.log("[voicePeer] connectionState", pc.connectionState);

      if (pc.connectionState === "connected") {
        if (disconnectTimer) {
          clearTimeout(disconnectTimer);
          disconnectTimer = null;
        }
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
        safePlayAudio(remoteAudioEl, "pc-connected");
      }

      if (pc.connectionState === "disconnected") {
        disconnectTimer = setTimeout(() => {
          if (pc && pc.connectionState !== "connected") {
            console.warn("[voicePeer] disconnected too long, restarting ICE");
            restartIceWithRenegotiation();
          }
        }, 4000);
      }

      if (pc.connectionState === "failed") {
        console.error("[voicePeer] peer connection failed");
        if (onNetworkErrorCallback) onNetworkErrorCallback();
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("[voicePeer] iceConnectionState", pc.iceConnectionState);

      if (pc.iceConnectionState === "checking") {
        iceTimeout = setTimeout(() => {
          if (
            pc &&
            pc.iceConnectionState !== "connected" &&
            pc.iceConnectionState !== "completed"
          ) {
            console.warn("[voicePeer] ICE stuck in checking");
            if (onNetworkWeakCallback) onNetworkWeakCallback();
          }
        }, 10000);
      }

      if (
        pc.iceConnectionState === "connected" ||
        pc.iceConnectionState === "completed"
      ) {
        if (iceTimeout) {
          clearTimeout(iceTimeout);
          iceTimeout = null;
        }
        safePlayAudio(remoteAudioEl, "ice-connected");
      }

      if (pc.iceConnectionState === "failed") {
        console.error("[voicePeer] ICE failed");
        if (onNetworkErrorCallback) onNetworkErrorCallback();
      }
    };
  } else {
    console.log("[voicePeer] reusing active peer", {
      callId,
      signalingState: pc.signalingState,
      connectionState: pc.connectionState,
    });
  }

  setupRemoteAudioLifecycle(audioRef);

  try {
    const nextStream = await acquireMicrophone(stream);
    await ensureLocalAudioSender(nextStream);
  } catch (error) {
    console.error("[voicePeer] getUserMedia failed", error);
    throw new Error("Microphone access denied");
  }

  clearTimers();
  connectionTimeout = setTimeout(() => {
    if (pc && pc.connectionState !== "connected") {
      console.warn("[voicePeer] connection timeout after 15s");
      if (onNetworkErrorCallback) onNetworkErrorCallback();
    }
  }, 15000);

  startQualityMonitoring();
  return pc;
}

async function restartIceWithRenegotiation() {
  if (isRestartingIce) {
    console.log("[voicePeer] ICE restart already in progress");
    return;
  }

  if (!pc || !socketRef || !callIdRef) {
    console.warn("[voicePeer] ICE restart skipped: missing peer/socket/callId");
    return;
  }

  if (pc.signalingState !== "stable") {
    console.warn("[voicePeer] ICE restart skipped: signaling not stable", {
      signalingState: pc.signalingState,
    });
    return;
  }

  isRestartingIce = true;

  try {
    const offer = await pc.createOffer({
      iceRestart: true,
      offerToReceiveAudio: true,
      offerToReceiveVideo: false,
    });

    await pc.setLocalDescription(offer);

    socketRef.emit("webrtc:offer", {
      callId: callIdRef,
      offer,
    });

    console.log("[voicePeer] ICE restart offer sent", { callId: callIdRef });
  } catch (error) {
    console.error("[voicePeer] ICE restart failed", error);
  } finally {
    isRestartingIce = false;
  }
}

export async function createOffer() {
  if (!pc) return null;

  const offer = await pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: false,
  });

  await pc.setLocalDescription(offer);
  console.log("[voicePeer] createOffer complete");
  return offer;
}

export async function createAnswer() {
  if (!pc) return null;

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  console.log("[voicePeer] createAnswer complete");
  return answer;
}

export async function setRemote(description) {
  if (!pc || !description) return;

  const rtcDesc =
    description instanceof RTCSessionDescription
      ? description
      : new RTCSessionDescription(description);

  const isOffer = rtcDesc.type === "offer";
  const canApplyOffer = pc.signalingState === "stable";
  const canApplyAnswer = pc.signalingState === "have-local-offer";

  if ((isOffer && !canApplyOffer) || (!isOffer && !canApplyAnswer)) {
    console.warn("[voicePeer] setRemote skipped due to signaling state", {
      type: rtcDesc.type,
      signalingState: pc.signalingState,
    });
    return false;
  }

  try {
    await pc.setRemoteDescription(rtcDesc);
    console.log("[voicePeer] setRemote success", {
      type: rtcDesc.type,
      signalingState: pc.signalingState,
    });
  } catch (error) {
    console.error("[voicePeer] setRemote failed", error);
    return false;
  }

  while (pendingIce.length) {
    const candidate = pendingIce.shift();
    try {
      await pc.addIceCandidate(candidate);
      console.log("[voicePeer] flushed queued ICE candidate");
    } catch (error) {
      console.warn("[voicePeer] queued ICE flush failed", error);
    }
  }

  return true;
}

export async function addIce(candidate) {
  if (!candidate) return;

  try {
    if (pc && pc.remoteDescription) {
      await pc.addIceCandidate(candidate);
      console.log("[voicePeer] addIce success");
    } else {
      pendingIce.push(candidate);
      console.log("[voicePeer] queued ICE candidate", {
        pendingCount: pendingIce.length,
      });
    }
  } catch (error) {
    console.error("[voicePeer] addIce failed", error);
  }
}

export function toggleMute(muted) {
  if (!localStream) return;

  localStream.getAudioTracks().forEach((track) => {
    track.enabled = !muted;
  });

  logAudioTracks("[voicePeer] toggleMute", localStream);
}

export async function getStats() {
  if (!pc) return null;

  try {
    const stats = await pc.getStats();
    const report = [];

    stats.forEach((stat) => {
      if (stat.type === "inbound-rtp" && stat.kind === "audio") {
        report.push({
          type: "inbound",
          packetsLost: stat.packetsLost,
          packetsReceived: stat.packetsReceived,
          jitter: stat.jitter,
          roundTripTime: stat.roundTripTime,
        });
      }
      if (stat.type === "outbound-rtp" && stat.kind === "audio") {
        report.push({
          type: "outbound",
          packetsSent: stat.packetsSent,
        });
      }
    });

    return report;
  } catch (error) {
    console.warn("[voicePeer] getStats failed", error);
    return null;
  }
}

function startQualityMonitoring() {
  if (qualityInterval) clearInterval(qualityInterval);

  qualityInterval = setInterval(async () => {
    const stats = await getStats();
    const inbound = stats?.find((item) => item.type === "inbound");

    if (!inbound) return;

    const total = inbound.packetsReceived + inbound.packetsLost;
    if (!total) return;

    const lossPercent = inbound.packetsLost / total;

    if (lossPercent > 0.08 && onNetworkWeakCallback) {
      onNetworkWeakCallback({
        lossPercent,
        jitter: inbound.jitter,
        rtt: inbound.roundTripTime,
      });
    }

    if (inbound.roundTripTime > 1.5 || lossPercent > 0.25) {
      console.warn("[voicePeer] quality degraded, triggering ICE restart", {
        lossPercent,
        roundTripTime: inbound.roundTripTime,
      });
      restartIceWithRenegotiation();
    }
  }, 5000);
}

export function closePeer() {
  console.log("[voicePeer] cleanup start");

  clearTimers();

  if (pc) {
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.onconnectionstatechange = null;
    pc.oniceconnectionstatechange = null;
    pc.onsignalingstatechange = null;

    try {
      pc.getSenders().forEach((sender) => {
        if (typeof sender.replaceTrack === "function") {
          sender.replaceTrack(null).catch(() => {});
        }
      });
    } catch (error) {
      console.warn("[voicePeer] sender cleanup issue", error);
    }

    pc.close();
    pc = null;
  }

  if (localStream) {
    localStream.getTracks().forEach((track) => {
      console.log("[voicePeer] stopping local track", {
        kind: track.kind,
        id: track.id,
      });
      track.stop();
    });
    localStream = null;
  }

  if (remoteStream) {
    remoteStream.getTracks().forEach((track) => remoteStream.removeTrack(track));
    remoteStream = null;
  }

  cleanupRemoteAudioElement();

  pendingIce = [];
  socketRef = null;
  callIdRef = null;
  isRestartingIce = false;
  onNetworkWeakCallback = null;
  onNetworkErrorCallback = null;

  console.log("[voicePeer] cleanup complete");
}

export function handleSocketReconnect() {
  console.log("[voicePeer] socket reconnect: resetting peer state");
  closePeer();
}