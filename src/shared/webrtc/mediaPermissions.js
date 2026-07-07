const AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

const PRIMARY_CONSTRAINTS = {
  audio: AUDIO_CONSTRAINTS,
  video: {
    facingMode: "user",
    width: { ideal: 640 },
    height: { ideal: 480 },
  },
};

const FALLBACK_CONSTRAINTS = {
  audio: true,
  video: true,
};

const mediaRequests = new Map();
const cachedStreams = new Map();

const getLocationDebug = () => ({
  origin: window.location.origin,
  protocol: window.location.protocol,
  hostname: window.location.hostname,
  isSecureContext: window.isSecureContext,
});

export const isSecureMediaContext = () => {
  const secure =
    Boolean(window.isSecureContext) ||
    window.location.protocol === "https:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  console.log("[VIDEO_MEDIA_SECURE_CONTEXT]", {
    secure,
    ...getLocationDebug(),
    at: new Date().toISOString(),
  });

  return secure;
};

export const isMediaDevicesSupported = () => {
  const supported = Boolean(navigator.mediaDevices?.getUserMedia);
  console.log("[VIDEO_MEDIA_SUPPORT_CHECK]", {
    supported,
    userAgent: navigator.userAgent,
    at: new Date().toISOString(),
  });
  return supported;
};

export const getBrowserInfo = () => {
  const ua = navigator.userAgent || "";
  let name = "Unknown";
  if (/Edg\//.test(ua)) name = "Microsoft Edge";
  else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) name = "Chrome";
  else if (/Firefox\//.test(ua)) name = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) name = "Safari";

  return {
    name,
    userAgent: ua,
    platform: navigator.platform,
  };
};

export const getMediaPermissionErrorMessage = (error) => {
  const name = error?.name || error?.code || "UNKNOWN_ERROR";

  if (name === "INSECURE_CONTEXT" || name === "SecurityError") {
    return "Camera and microphone require HTTPS on mobile Chrome/Edge. Please open the app using the Cloudflare Tunnel HTTPS URL.";
  }
  if (name === "MEDIA_UNSUPPORTED" || name === "TypeError") {
    return "This browser does not support camera/microphone access or the app is not running in a secure context.";
  }
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return "Camera or microphone permission was denied. Click the lock icon in the address bar and allow Camera and Microphone.";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "No camera or microphone was found on this device.";
  }
  if (name === "NotReadableError" || name === "TrackStartError" || name === "device_busy_or_unavailable") {
    return "Camera/microphone may already be used by another browser/app. For same-laptop testing, use one side on mobile and one side on laptop, or turn camera off on one side if supported.";
  }
  if (name === "OverconstrainedError" || name === "ConstraintNotSatisfiedError") {
    return "Selected camera settings are not supported. Trying basic camera mode.";
  }

  return "Unable to access camera or microphone. Please check browser permission.";
};

const errorTypeFor = (error) => {
  const name = error?.name || error?.code || "UNKNOWN_ERROR";
  if (name === "INSECURE_CONTEXT" || name === "SecurityError") return "insecure_context";
  if (name === "MEDIA_UNSUPPORTED" || name === "TypeError") return "unsupported_browser";
  if (name === "NotAllowedError" || name === "PermissionDeniedError") return "permission_denied";
  if (name === "NotFoundError" || name === "DevicesNotFoundError") return "device_not_found";
  if (name === "NotReadableError" || name === "TrackStartError" || name === "device_busy_or_unavailable") return "device_busy_or_unavailable";
  if (name === "OverconstrainedError" || name === "ConstraintNotSatisfiedError") return "constraints_failed";
  return "unknown_error";
};

const streamDebugInfo = (stream) => ({
  audioTracks: stream?.getAudioTracks?.().length || 0,
  videoTracks: stream?.getVideoTracks?.().length || 0,
  audioStates: stream?.getAudioTracks?.().map((track) => track.readyState) || [],
  videoStates: stream?.getVideoTracks?.().map((track) => track.readyState) || [],
});

const hasLiveAudioVideo = (stream) => {
  const hasAudio = stream?.getAudioTracks?.().some((track) => track.readyState === "live");
  const hasVideo = stream?.getVideoTracks?.().some((track) => track.readyState === "live");
  return Boolean(hasAudio && hasVideo);
};

const getDeviceSummary = async () => {
  try {
    if (!navigator.mediaDevices?.enumerateDevices) return { audioInputs: null, videoInputs: null };
    const devices = await navigator.mediaDevices.enumerateDevices();
    return {
      audioInputs: devices.filter((device) => device.kind === "audioinput").length,
      videoInputs: devices.filter((device) => device.kind === "videoinput").length,
      hasLabels: devices.some((device) => Boolean(device.label)),
    };
  } catch {
    return { audioInputs: null, videoInputs: null, hasLabels: false };
  }
};

const makeErrorResult = async ({ error, role, callId }) => {
  const errorName = error?.name || error?.code || "UNKNOWN_ERROR";
  const result = {
    ok: false,
    success: false,
    stream: null,
    errorName,
    errorCode: errorName,
    errorType: errorTypeFor(error),
    message: getMediaPermissionErrorMessage(error),
    shouldEndCall: true,
    shouldCharge: false,
    debug: {
      callId,
      role,
      browser: getBrowserInfo(),
      location: getLocationDebug(),
      devices: await getDeviceSummary(),
      errorName,
      errorMessage: error?.message || "",
    },
    rawError: error,
  };

  console.log("[VIDEO_MEDIA_REQUEST_ERROR]", {
    callId,
    role,
    errorName: result.errorName,
    errorMessage: result.debug.errorMessage,
    debug: result.debug,
    at: new Date().toISOString(),
  });

  return result;
};

const validateStream = async ({ stream, role, callId }) => {
  if (!hasLiveAudioVideo(stream)) {
    stopMediaStream(stream);
    return makeErrorResult({
      error: { name: "NotFoundError", message: "Missing live audio or video track" },
      role,
      callId,
    });
  }

  cachedStreams.set(`${callId || 0}:${role}`, stream);
  console.log("[VIDEO_MEDIA_REQUEST_SUCCESS]", {
    callId,
    role,
    ...streamDebugInfo(stream),
    devices: await getDeviceSummary(),
    at: new Date().toISOString(),
  });

  return {
    ok: true,
    success: true,
    stream,
    errorName: null,
    errorCode: null,
    errorType: null,
    message: "",
    shouldEndCall: false,
    shouldCharge: false,
    debug: {
      callId,
      role,
      browser: getBrowserInfo(),
      location: getLocationDebug(),
      devices: await getDeviceSummary(),
      stream: streamDebugInfo(stream),
    },
  };
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requestWithRetry = async ({ callId, role }) => {
  try {
    return await navigator.mediaDevices.getUserMedia(PRIMARY_CONSTRAINTS);
  } catch (error) {
    if (error?.name === "OverconstrainedError" || error?.name === "ConstraintNotSatisfiedError") {
      console.log("[VIDEO_MEDIA_RETRY_BASIC_CONSTRAINTS]", {
        callId,
        role,
        reason: error.name,
        at: new Date().toISOString(),
      });
      return navigator.mediaDevices.getUserMedia(FALLBACK_CONSTRAINTS);
    }

    if (error?.name === "NotReadableError" || error?.name === "TrackStartError") {
      console.log("[VIDEO_MEDIA_RETRY_BASIC_CONSTRAINTS]", {
        callId,
        role,
        reason: error.name,
        at: new Date().toISOString(),
      });
      await wait(500);
      try {
        return await navigator.mediaDevices.getUserMedia(FALLBACK_CONSTRAINTS);
      } catch (retryError) {
        if (retryError?.name === "NotReadableError" || retryError?.name === "TrackStartError") {
          const busyError = new Error(retryError.message || "Camera or microphone is already in use.");
          busyError.name = "device_busy_or_unavailable";
          throw busyError;
        }
        throw retryError;
      }
    }

    throw error;
  }
};

export const requestVideoCallPermissions = async ({ video = true, audio = true } = {}) => {
  if (!isSecureMediaContext()) {
    const error = new Error("Camera and microphone require HTTPS.");
    error.name = "INSECURE_CONTEXT";
    throw error;
  }
  if (!isMediaDevicesSupported()) {
    const error = new Error("MediaDevices API is unavailable.");
    error.name = "MEDIA_UNSUPPORTED";
    throw error;
  }
  return navigator.mediaDevices.getUserMedia({
    audio: audio ? AUDIO_CONSTRAINTS : false,
    video: video ? PRIMARY_CONSTRAINTS.video : false,
  });
};

export const requestVideoCallMedia = async (options = {}) => {
  const callId = options.callId || 0;
  const role = options.role || "user";
  const key = `${callId}:${role}`;

  if (!isSecureMediaContext()) {
    const error = new Error("Camera and microphone require HTTPS.");
    error.name = "INSECURE_CONTEXT";
    return makeErrorResult({ error, role, callId });
  }

  if (!isMediaDevicesSupported()) {
    const error = new Error("MediaDevices API is unavailable.");
    error.name = "MEDIA_UNSUPPORTED";
    return makeErrorResult({ error, role, callId });
  }

  const existingStream = options.existingStream || cachedStreams.get(key);
  if (hasLiveAudioVideo(existingStream)) {
    console.log("[VIDEO_MEDIA_REQUEST_SUCCESS]", {
      callId,
      role,
      reused: true,
      ...streamDebugInfo(existingStream),
      at: new Date().toISOString(),
    });
    return validateStream({ stream: existingStream, role, callId });
  }

  if (mediaRequests.has(key)) {
    console.log("[VIDEO_MEDIA_REQUEST_START]", {
      callId,
      role,
      duplicateBlocked: true,
      at: new Date().toISOString(),
    });
    return mediaRequests.get(key);
  }

  const promise = (async () => {
    console.log("[VIDEO_MEDIA_REQUEST_START]", {
      callId,
      role,
      browser: getBrowserInfo(),
      location: getLocationDebug(),
      devices: await getDeviceSummary(),
      at: new Date().toISOString(),
    });

    try {
      const stream = await requestWithRetry({ callId, role });
      return validateStream({ stream, role, callId });
    } catch (error) {
      return makeErrorResult({ error, role, callId });
    }
  })();

  mediaRequests.set(key, promise);
  try {
    return await promise;
  } finally {
    mediaRequests.delete(key);
  }
};

export const requestExpertVideoCallMedia = async ({ callId = null, existingStream = null } = {}) =>
  requestVideoCallMedia({ callId, role: "expert", existingStream });

export const diagnoseMediaAccess = async ({ role = "diagnostic" } = {}) => {
  const base = {
    ok: false,
    secureContext: isSecureMediaContext(),
    supported: isMediaDevicesSupported(),
    browser: getBrowserInfo(),
    location: getLocationDebug(),
    devicesBefore: await getDeviceSummary(),
  };

  const media = await requestVideoCallMedia({ callId: "diagnostic", role });
  return {
    ...base,
    ok: media.ok,
    stream: media.stream,
    message: media.message || "Camera and microphone are working.",
    errorName: media.errorName,
    errorType: media.errorType,
    devicesAfter: await getDeviceSummary(),
    debug: media.debug,
  };
};

export const stopMediaStream = (stream) => {
  if (!stream) return;
  const info = streamDebugInfo(stream);
  stream.getTracks?.().forEach((track) => track.stop());

  for (const [key, cached] of cachedStreams.entries()) {
    if (cached === stream) cachedStreams.delete(key);
  }

  console.log("[VIDEO_MEDIA_STREAM_STOPPED]", {
    ...info,
    at: new Date().toISOString(),
  });
};
