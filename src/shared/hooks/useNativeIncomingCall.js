import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "../../config/appConfig";

// Constants
const NATIVE_EVENT = "g9:nativeIncomingCall";

// Lock for preventing duplicate navigation
let openingCall = false;
const processedCalls = new Set();

/**
 * useNativeIncomingCall - Clean Hook
 * 
 * Responsibilities:
 * - Read window.G9.native.pendingCall
 * - Navigate to call page
 * - Prevent duplicate navigation
 * 
 * DOES NOT:
 * - Emit socket accept
 * - Modify acceptSent
 * - Clear CallStore
 */
export default function useNativeIncomingCall() {
    const navigate = useNavigate();

    useEffect(() => {
        // ============================================================
        // Get call data from Android
        // ============================================================
        const getCallData = () => {
            const call = window.G9?.native?.pendingCall;
            if (call) {
                console.log("📦 Found call in G9.native.pendingCall");
                return call;
            }
            return null;
        };

        // ============================================================
        // Navigate to call page
        // ============================================================
        const openCallPage = (call) => {
            let targetUrl = call.targetUrl || call.target_url;

            if (!targetUrl) {
                const base = APP_CONFIG.APP_TYPE === "expert" ? "/expert" : "/user";
                const callId = String(call.callId);

                const isVideo = call.callType === "video" || 
                               call.callType === "video_call" || 
                               call.callType === "video-call";
                const isChat = call.callType === "chat" ||
                               call.callType === "incoming_chat" ||
                               call.callType === "chat_request";
                
                if (isChat) {
                    targetUrl = `${base}/chat/${callId}`;
                } else if (isVideo) {
                    targetUrl = `${base}/video-call/${callId}`;
                } else {
                    targetUrl = `${base}/voice-call/${callId}`;
                }
            }

            console.log("⚡ Direct-to-Call: Navigating directly to targetUrl:", targetUrl);

            // 1. Clear window.G9.native.pendingCall so cold-start timers don't re-read stale data
            if (window.G9?.native) {
                window.G9.native.pendingCall = null;
            }

            // 2. Notify Native Android handshake listener
            if (window.NativeBridgeManager?.onReactReadyForCall) {
                try {
                    window.NativeBridgeManager.onReactReadyForCall(call.callId);
                } catch (e) {
                    console.error("Failed to notify NativeBridgeManager onReactReadyForCall:", e);
                }
            }

            // 3. Dispatch event to clear active incoming banners & ringtone in React
            window.dispatchEvent(new CustomEvent("native_call_accepted", { detail: call }));

            // 4. Perform direct router navigation
            navigate(targetUrl, {
                replace: true,
                state: {
                    native: true,
                    autoAccept: true,
                    acceptSent: true,
                    action: "accept",
                    ...call,
                },
            });

            // 5. Release opening lock
            setTimeout(() => {
                openingCall = false;
            }, 500);
        };

        // ============================================================
        // Main handler
        // ============================================================
        const handleIncomingCall = (event) => {
            const call = event?.detail || getCallData();
            if (!call) {
                return;
            }

            const callId = String(call.callId ?? "").trim();
            if (!callId) {
                return;
            }

            call.callId = callId;

            // Check if user is ALREADY on the target call screen
            const currentPath = window.location.pathname;
            if (currentPath.includes(callId)) {
                console.log("📍 Already on target call page:", currentPath);
                if (window.G9?.native) window.G9.native.pendingCall = null;
                return;
            }

            if (processedCalls.has(callId)) {
                // If pendingCall is still present, force navigation execution
                if (window.G9?.native?.pendingCall) {
                    console.log("⚡ Found pendingCall despite duplicate lock. Executing navigation for callId:", callId);
                    openCallPage(call);
                    return;
                }
                console.log("🔄 Duplicate call ignored:", callId);
                return;
            }

            processedCalls.add(callId);
            openingCall = true;

            // Allow callId re-processing after 10 seconds
            setTimeout(() => {
                processedCalls.delete(callId);
            }, 10000);

            console.log("========================================");
            console.log("📞 NATIVE INCOMING CALL");
            console.log("========================================");
            console.log("CallId      :", callId);
            console.log("Caller      :", call.callerName || call.caller || "Unknown");
            console.log("Type        :", call.callType || "voice");
            console.log("acceptSent  :", call.acceptSent === true);
            console.log("========================================");

            openCallPage(call);
        };

        // ============================================================
        // Listen for native event
        // ============================================================
        window.addEventListener(NATIVE_EVENT, handleIncomingCall);
        console.log("👂 Listening for event:", NATIVE_EVENT);

        // ============================================================
        // Resilient window polling for window.NativeBridgeManager
        // ============================================================
        let pollAttempts = 0;
        const maxAttempts = 50; // 50 * 50ms = 2.5s window
        const pollInterval = 50;
        let pollTimer = null;

        const registerNativeBridge = () => {
            if (window.NativeBridgeManager) {
                console.log(`🚀 Signaling native side that React is ready (Attempt ${pollAttempts})`);
                try {
                    if (typeof window.NativeBridgeManager.onReactReady === "function") {
                        window.NativeBridgeManager.onReactReady();
                    }
                    if (typeof window.NativeBridgeManager.notifyReactReady === "function") {
                        window.NativeBridgeManager.notifyReactReady();
                    }
                } catch (e) {
                    console.error("Failed to signal native readiness:", e);
                }
                return;
            }

            // Fallback check directly for Java Interface NativeBridgeManager_Native
            if (window.NativeBridgeManager_Native) {
                console.log("⚡ Found NativeBridgeManager_Native directly, binding wrapper...");
                window.NativeBridgeManager = {
                    _native: window.NativeBridgeManager_Native,
                    onReactReadyForCall: (callId) => window.NativeBridgeManager_Native.onReactReadyForCall(callId),
                    notifyReactReady: () => window.NativeBridgeManager_Native.notifyReactReady(),
                    onReactReady: () => window.NativeBridgeManager_Native.onReactReady(),
                };
                try {
                    window.NativeBridgeManager.notifyReactReady();
                } catch (e) {
                    console.error("Failed to notify via NativeBridgeManager_Native:", e);
                }
                return;
            }

            pollAttempts++;
            if (pollAttempts < maxAttempts) {
                pollTimer = setTimeout(registerNativeBridge, pollInterval);
            } else {
                console.warn("⚠️ NativeBridgeManager not available after polling max attempts");
            }
        };

        registerNativeBridge();

        // ============================================================
        // Cold start - check immediately
        // ============================================================
        const coldStartCheck = () => {
            const call = getCallData();
            if (call) {
                console.log("🔵 Cold start - processing pending call");
                handleIncomingCall();
            }
        };

        coldStartCheck();
        const timeoutId = setTimeout(coldStartCheck, 200);

        // ============================================================
        // Cleanup
        // ============================================================
        return () => {
            window.removeEventListener(NATIVE_EVENT, handleIncomingCall);
            clearTimeout(timeoutId);
            if (pollTimer) clearTimeout(pollTimer);
            console.log("🧹 Cleaned up native call listeners");
        };

    }, [navigate]);
}

// ============================================================
// EXPORTED HELPERS
// ============================================================

export function releaseNativeCallLock() {
    openingCall = false;
    console.log("🔓 Native call lock released");
}

export function removeProcessedNativeCall(callId) {
    if (!callId) return;
    const deleted = processedCalls.delete(callId);
    if (deleted) {
        console.log("🗑️ Native call removed from memory:", callId);
    }
    if (openingCall) {
        openingCall = false;
    }
}

export function clearProcessedNativeCalls() {
    const count = processedCalls.size;
    processedCalls.clear();
    openingCall = false;
    console.log(`🧹 Processed native calls cleared (${count} entries removed)`);
}

export function clearNativeCallData() {
    if (window.G9?.native) {
        window.G9.native.pendingCall = null;
        console.log("🧹 Cleared G9.native.pendingCall");
    }
}

export function isNativeCallProcessed(callId) {
    if (!callId) return false;
    return processedCalls.has(callId);
}

export function isNativeAcceptSent(callId) {
    const call = window.G9?.native?.pendingCall;
    if (!call) return false;
    return String(call.callId) === String(callId) && call.acceptSent === true;
}

export function getNativeCallState() {
    const call = window.G9?.native?.pendingCall;
    if (!call) return null;
    return {
        callId: call.callId,
        callType: call.callType,
        caller: call.callerName || call.caller || "Unknown",
        acceptSent: call.acceptSent === true,
        rejectSent: call.rejectSent === true,
        missedSent: call.missedSent === true,
        reactReady: call.reactReady === true,
        createdAt: call.createdAt || null,
    };
}

export function triggerNativeCallProcessing() {
    console.log("🔧 Manual trigger");
    const event = new CustomEvent(NATIVE_EVENT);
    window.dispatchEvent(event);
}

export function hasPendingNativeCall() {
    const call = window.G9?.native?.pendingCall;
    if (!call) return false;
    return String(call.callId ?? "").trim().length > 0;
}