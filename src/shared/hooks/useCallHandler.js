import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../api/socket";
import { soundManager } from "../services/sound/soundManager";
import { hotToast } from "../utils/lazyNotifications";
import { closePeer } from "../webrtc/voicePeer";
import { closeVideoPeer } from "../webrtc/videoPeer";
import {
  releaseNativeCallLock,
  removeProcessedNativeCall,
  clearNativeCallData,
} from "./useNativeIncomingCall";

// Memory lock to prevent duplicate termination requests
const terminatingSet = new Set();

/**
 * useCallHandler - Unified Call Termination Hook
 * 
 * Provides:
 * - endCall(callId, initiator, options)
 * - Concurrency protection against duplicate cut requests
 * - Socket emission + Native Bridge cleanup + Web Toast notification + Navigation
 */
export function useCallHandler() {
  const navigate = useNavigate();
  const isEndingRef = useRef(false);

  const endCall = useCallback(
    async (callId, initiator = "expert", options = {}) => {
      const id = String(callId || "").trim();
      if (!id) {
        console.warn("⚠️ useCallHandler: endCall called without valid callId");
        return;
      }

      // 1. CONCURRENCY CHECK: Ignore if call is already ending/ended
      if (terminatingSet.has(id) || isEndingRef.current) {
        console.log(`🛡️ Call ${id} is already ending/ended. Ignoring duplicate endCall call.`);
        return;
      }

      terminatingSet.add(id);
      isEndingRef.current = true;

      const callType = options.type || "voice_call";
      console.log(`🔚 Unified endCall triggered | CallId: ${id} | Initiator: ${initiator} | Type: ${callType}`);

      try {
        // 2. INITIATOR SPECIFIC LOGIC
        if (initiator === "expert") {
          // a) Emit socket event to server
          if (socket && socket.connected) {
            if (callType === "video_call" || callType === "video-call") {
              socket.emit("video-call:end", { callId: id });
            } else if (callType === "chat_request" || callType === "chat") {
              socket.emit("end_chat", { request_id: id });
            } else {
              socket.emit("call:end", { callId: id });
            }
            console.log("📤 Socket end_call emitted to server");
          }
        } else {
          // b) Server/User Initiated: Show UI notification toast
          hotToast.info("Call Ended", { id: `call_ended_${id}` });
        }

        // 3. NATIVE BRIDGE CLEANUP
        if (window.NativeBridgeManager && typeof window.NativeBridgeManager.terminateNativeSession === "function") {
          try {
            window.NativeBridgeManager.terminateNativeSession(id);
            console.log(`📱 NativeBridgeManager.terminateNativeSession executed for ${id}`);
          } catch (e) {
            console.error("NativeBridgeManager termination failed:", e);
          }
        }

        if (window.G9?.native) {
          window.G9.native.pendingCall = null;
        }

        // Native Lock Release
        removeProcessedNativeCall(id);
        releaseNativeCallLock();
        clearNativeCallData();

        // 4. WEBRTC & SOUND CLEANUP
        try {
          closePeer();
          closeVideoPeer(true);
        } catch (e) {
          console.warn("WebRTC cleanup warning:", e);
        }
        soundManager.stopAll();

        // 5. GLOBAL REACT STATE RESET
        window.dispatchEvent(
          new CustomEvent("session_terminated", {
            detail: { callId: id, initiator, type: callType },
          })
        );

        // 6. ROUTE NAVIGATION
        if (options.shouldNavigate !== false) {
          const fallback = options.fallbackUrl || "/expert/home";
          navigate(fallback, { replace: true });
        }

      } catch (err) {
        console.error("Error executing endCall handler:", err);
      } finally {
        // Reset local ref and set lock after delay
        setTimeout(() => {
          isEndingRef.current = false;
          terminatingSet.delete(id);
        }, 3000);
      }
    },
    [navigate]
  );

  return {
    endCall,
    isTerminating: (callId) => terminatingSet.has(String(callId || "").trim()),
  };
}
