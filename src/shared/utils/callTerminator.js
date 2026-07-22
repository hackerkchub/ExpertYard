import { socket } from "../api/socket";
import { soundManager } from "../services/sound/soundManager";
import { closePeer } from "../webrtc/voicePeer";
import { closeVideoPeer } from "../webrtc/videoPeer";

// Set to track terminating sessions and prevent duplicate termination execution
const terminatingSessions = new Set();
const rejectingSessions = new Set();

/**
 * Global Call & Request Termination Protocol - Centralized Kill Switch
 * 
 * @param {string|number} callId - ID of the session/request to terminate
 * @param {string} reason - Termination reason e.g., 'expert_hangup', 'user_hangup', 'timeout', 'error'
 * @param {object} options - Options e.g., { type: 'voice_call'|'video_call'|'chat_request', navigate: func, fallbackUrl: string }
 */
export async function terminateSession(callId, reason = "user_hangup", options = {}) {
  const id = String(callId || "").trim();
  if (!id) {
    console.warn("⚠️ terminateSession called without valid callId");
    return;
  }

  // 1. Conflict Resolution: Prevent duplicate cut/termination requests
  if (terminatingSessions.has(id)) {
    console.log(`🛡️ Termination already in progress for session ${id} - ignoring duplicate.`);
    return;
  }

  terminatingSessions.add(id);
  console.log(`🛑 Executing Global Termination Protocol for CallId: ${id} | Reason: ${reason}`);

  try {
    const sessionType = options.type || "voice_call";

    // 2. LAYER 1: Socket.io - Notify backend & peer with both event name conventions
    if (socket && socket.connected) {
      if (sessionType === "video_call" || sessionType === "video-call" || sessionType === "video") {
        socket.emit("video-call:end", { callId: id, reason });
        socket.emit("reject_video_call", { callId: id, reason });
      } else if (sessionType === "chat_request" || sessionType === "chat") {
        socket.emit("end_chat", { request_id: id, requestId: id, reason });
        socket.emit("reject_chat", { requestId: id, request_id: id, reason });
      } else {
        socket.emit("call:end", { callId: id, reason });
        socket.emit("reject_call", { callId: id, reason });
      }
    }

    // 3. LAYER 2: Native Bridge - Destroy Foreground Service, Ringtone & Notification
    if (window.NativeBridgeManager && typeof window.NativeBridgeManager.terminateNativeSession === "function") {
      try {
        window.NativeBridgeManager.terminateNativeSession(id);
        console.log(`📱 Native Android session terminated for ${id}`);
      } catch (err) {
        console.error("Failed to invoke terminateNativeSession on NativeBridgeManager:", err);
      }
    }

    // Clear window.G9.native.pendingCall
    if (window.G9?.native) {
      window.G9.native.pendingCall = null;
    }

    // 4. LAYER 3: Web Hardware, Stream & Sound Cleanup
    try {
      closePeer();
      closeVideoPeer(true);
    } catch (e) {
      console.warn("WebRTC peer cleanup warning:", e);
    }
    soundManager.stopAll();

    // 5. LAYER 4: React UI State - Dispatch global session_terminated event
    window.dispatchEvent(
      new CustomEvent("session_terminated", {
        detail: { callId: id, reason, type: sessionType },
      })
    );

    // 6. Navigation: Navigate back to dashboard if navigate function is provided
    if (typeof options.navigate === "function") {
      const fallback = options.fallbackUrl || "/expert/home";
      options.navigate(fallback, { replace: true });
    }

  } catch (error) {
    console.error("Error executing terminateSession:", error);
  } finally {
    // Release lock after 3 seconds
    setTimeout(() => {
      terminatingSessions.delete(id);
    }, 3000);
  }
}

/**
 * Unified Rejection & Timeout Handler for Chat, Voice, and Video Call Requests.
 * Emits Socket Events to notify Server and Caller (User) so the User's UI updates immediately.
 * 
 * @param {string|number} callId - ID of call/chat
 * @param {string} callType - 'voice_call' | 'video_call' | 'chat_request'
 * @param {string} reason - 'expert_declined' | 'timeout' | 'busy'
 */
export function rejectIncomingRequest(callId, callType = "voice_call", reason = "expert_declined") {
  const id = String(callId || "").trim();
  if (!id) return;

  if (rejectingSessions.has(id)) {
    console.log(`🛡️ Rejection socket emission already processed for ${id} - ignoring duplicate.`);
    return;
  }

  rejectingSessions.add(id);
  console.log(`📡 Emitting Socket Rejection to Server | CallId: ${id} | Type: ${callType} | Reason: ${reason}`);

  try {
    if (socket && socket.connected) {
      const isVideo = callType === "video_call" || callType === "video-call" || callType === "video";
      const isChat = callType === "chat_request" || callType === "chat";

      if (isVideo) {
        const numId = Number(id) || id;
        if (reason === "timeout") {
          socket.emit("video-call:missed", { callId: numId, reason: "timeout" });
        } else {
          socket.emit("video-call:decline", { callId: numId, reason });
          socket.emit("video-call:reject", { callId: numId, reason });
          socket.emit("reject_video_call", { callId: numId, reason });
        }
      } else if (isChat) {
        socket.emit("reject_chat", { requestId: id, request_id: id, reason });
        socket.emit("reject_chat_request", { request_id: id, requestId: id, reason });
      } else {
        if (reason === "timeout") {
          socket.emit("call:missed", { callId: id, reason: "timeout" });
        } else {
          socket.emit("call:reject", { callId: id, reason });
          socket.emit("reject_call", { callId: id, reason });
        }
      }
      console.log(`📤 Socket event emitted successfully for ${callType} rejection (${reason})`);
    }

    // Hardware & Audio Cleanup on rejection
    try {
      closePeer();
      closeVideoPeer(true);
    } catch (e) {}
    soundManager.stopAll();

  } catch (e) {
    console.error("Failed to emit socket rejection event:", e);
  } finally {
    setTimeout(() => {
      rejectingSessions.delete(id);
    }, 3000);
  }
}

/**
 * Helper to check if a session is currently terminating
 */
export function isSessionTerminating(callId) {
  if (!callId) return false;
  return terminatingSessions.has(String(callId).trim());
}
