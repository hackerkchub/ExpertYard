import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "../../config/appConfig";

// ✅ FIX: Use Set for duplicate protection
let openingCall = false;
const processedCalls = new Set();

export default function useNativeIncomingCall() {
    const navigate = useNavigate();

    useEffect(() => {
        // Helper function for navigation
        const openVoiceCall = (call) => {
            const base =
                APP_CONFIG.APP_TYPE === "expert"
                    ? "/expert"
                    : "/user";

            navigate(
                `${base}/voice-call/${call.callId}`,
                {
                    replace: true,
                    state: {
                        native: true,
                        callerName: call.callerName,
                        callType: call.callType,
                        target: call.targetUrl,
                        userId: call.userId,
                        expertId: call.expertId,
                    },
                }
            );
        };

        const openCall = () => {
            // ✅ Prevent concurrent navigation
            if (openingCall) {
                console.log("⏳ Navigation already in progress, ignoring");
                return;
            }

            const call = window.__NATIVE_INCOMING_CALL__;

            // ✅ STEP 1: Better validation - normalize callId to string
            const callId = String(call?.callId ?? "").trim();
            
            if (!callId) {
                console.log("❌ Invalid native call payload", call);
                return;
            }

            // ✅ Normalize callId to string for consistency
            call.callId = callId;

            // ✅ Duplicate protection with Set
            if (processedCalls.has(callId)) {
                console.log("🔄 Duplicate native call ignored:", callId);
                return;
            }

            // ✅ Mark as processed immediately
            processedCalls.add(callId);
            openingCall = true;

            console.log("📞 Native Incoming Call", call);
            console.log("📞 Call ID:", callId);
            console.log("📞 Caller:", call.callerName);
            console.log("📞 Type:", call.callType);

            // ✅ Navigate to voice call
            openVoiceCall(call);

            // ✅ STEP 2: Android acknowledgement via localStorage
            // Clear the global object to prevent duplicate processing
            window.__NATIVE_INCOMING_CALL__ = null;
            
            // Store acknowledgment in localStorage for native bridge
            localStorage.setItem("native_call_ack", callId);
            console.log("📱 Native call acknowledged via localStorage:", callId);

            // ✅ REMOVED: requestAnimationFrame unlock
            // Lock will be released when VoiceCall page mounts
        };

        // Listen for native incoming call events
        window.addEventListener("nativeIncomingCall", openCall);

        // ✅ Cold start support - next frame for reliability
        if (window.__NATIVE_INCOMING_CALL__) {
            console.log("🔵 Cold start - processing pending call");
            requestAnimationFrame(openCall);
        }

        return () => {
            window.removeEventListener("nativeIncomingCall", openCall);
        };

    }, [navigate]);
}

// ✅ EXPORT: Helper to release lock when VoiceCall mounts
export function releaseNativeCallLock() {
    openingCall = false;
    console.log("🔓 Native call lock released");
}

// ✅ FIX 1: Helper to remove processed call (prevents memory leak)
export function removeProcessedNativeCall(callId) {
    if (!callId) {
        console.log("⚠️ Cannot remove call: No callId provided");
        return;
    }

    const deleted = processedCalls.delete(callId);
    
    if (deleted) {
        console.log("🗑️ Native call removed from memory:", callId);
    } else {
        console.log("ℹ️ Call not found in processed set:", callId);
    }
    
    // Also release lock if it was held
    if (openingCall) {
        openingCall = false;
        console.log("🔓 Lock released during cleanup");
    }
}

// ✅ EXPORT: Helper to clear processed calls (for logout/cleanup)
export function clearProcessedNativeCalls() {
    const count = processedCalls.size;
    processedCalls.clear();
    openingCall = false;
    console.log(`🧹 Processed native calls cleared (${count} entries removed)`);
}