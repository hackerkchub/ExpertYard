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
            const targetUrl = call.targetUrl;
            if (targetUrl) {
                console.log("📞 Target URL provided, navigating directly:", targetUrl);
                navigate(targetUrl, {
                    replace: true,
                    state: {
                        native: true,
                        ...call,
                    },
                });
                return;
            }

            const base = APP_CONFIG.APP_TYPE === "expert" ? "/expert" : "/user";
            const callId = String(call.callId);

            const isVideo = call.callType === "video" || 
                           call.callType === "video_call" || 
                           call.callType === "video-call";
            const isChat = call.callType === "chat" ||
                           call.callType === "incoming_chat" ||
                           call.callType === "chat_request";
            
            let route;
            if (isChat) {
                route = `${base}/chat/${callId}`;
            } else if (isVideo) {
                route = `${base}/video-call/${callId}`;
            } else {
                route = `${base}/voice-call/${callId}`;
            }

            console.log(`📞 Opening ${isVideo ? 'video' : 'voice'} call page:`, route);

            navigate(route, {
                replace: true,
                state: {
                    native: true,
                    ...call,
                },
            });
        };

        // ============================================================
        // Main handler
        // ============================================================
        const handleIncomingCall = () => {
            if (openingCall) {
                console.log("⏳ Navigation already in progress");
                return;
            }

            const call = getCallData();
            if (!call) {
                console.log("❌ No pending call found");
                return;
            }

            const callId = String(call.callId ?? "").trim();
            if (!callId) {
                console.log("❌ Invalid callId");
                return;
            }

            call.callId = callId;

            if (processedCalls.has(callId)) {
                console.log("🔄 Duplicate call ignored:", callId);
                return;
            }

            processedCalls.add(callId);
            openingCall = true;

            console.log("========================================");
            console.log("📞 NATIVE INCOMING CALL");
            console.log("========================================");
            console.log("CallId      :", callId);
            console.log("Caller      :", call.callerName || call.caller || "Unknown");
            console.log("Type        :", call.callType || "voice");
            console.log("acceptSent  :", call.acceptSent === true);
            console.log("========================================");

            openCallPage(call);

            // Release lock after navigation
            openingCall = false;
        };

        // ============================================================
        // Listen for native event
        // ============================================================
        window.addEventListener(NATIVE_EVENT, handleIncomingCall);
        console.log("👂 Listening for event:", NATIVE_EVENT);

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