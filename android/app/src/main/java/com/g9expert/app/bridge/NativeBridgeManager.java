package com.g9expert.app.bridge;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.ValueCallback;

import com.getcapacitor.Bridge;
import com.g9expert.app.BuildConfig;
import com.g9expert.app.call.CallStore;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.UUID;

/**
 * NativeBridgeManager - Clean, Production-Ready
 * 
 * State Machine:
 * IDLE → DISPATCHED
 * 
 * Flow:
 * 1. CallStore has pending call
 * 2. dispatchPendingCall() → inject immediately → DISPATCHED
 * 3. React receives event → navigates → VoiceCall mounts
 * 4. VoiceCall → onReactReadyForCall() → CallStore.clear() → reset to IDLE
 * 
 * onReactReadyForCall() is ONLY for confirmation, NOT for dispatch
 */
public final class NativeBridgeManager {

    private static final String TAG = "NativeBridge";

    // ============================================================
    // State Machine
    // ============================================================
    public enum DispatchState {
        IDLE,           // No operation in progress
        DISPATCHED      // Successfully dispatched to React
    }

    // ============================================================
    // Runtime Objects
    // ============================================================
    private static Bridge bridge;
    private static Context context;
    private static final Handler handler = new Handler(Looper.getMainLooper());

    // ============================================================
    // Runtime State (volatile for thread safety)
    // ============================================================
    private static volatile DispatchState state = DispatchState.IDLE;
    private static volatile String pendingCallId = null;
    private static volatile String pendingCallType = null;
    private static volatile String dispatchId = null;
    private static volatile boolean isInitialized = false;
    private static volatile boolean isReactReady = false;

    // ============================================================
    // Private Constructor
    // ============================================================
    private NativeBridgeManager() {}

    // ============================================================
    // Logging Helper
    // ============================================================
    private static String getCurrentTime() {
        return new SimpleDateFormat("HH:mm:ss.SSS", Locale.getDefault()).format(new Date());
    }

    private static void logState(String method, String message) {
        Log.d(TAG, "=====================================");
        Log.d(TAG, method);
        Log.d(TAG, "=====================================");
        Log.d(TAG, "State      : " + state);
        Log.d(TAG, "CallId     : " + pendingCallId);
        Log.d(TAG, "CallType   : " + pendingCallType);
        Log.d(TAG, "DispatchId : " + dispatchId);
        Log.d(TAG, "Initialized: " + isInitialized);
        Log.d(TAG, "Time       : " + getCurrentTime());
        if (message != null) {
            Log.d(TAG, "Message    : " + message);
        }
        Log.d(TAG, "=====================================");
    }

    // ============================================================
    // WebView Helpers
    // ============================================================
    private static WebView getWebView() {
        if (bridge == null) return null;
        return bridge.getWebView();
    }

    private static boolean isBridgeReady() {
        if (bridge == null) return false;
        WebView webView = bridge.getWebView();
        if (webView == null) return false;
        if (webView.getHandler() == null) return false;
        return true;
    }

    private static void evaluateJavascript(String script, ValueCallback<String> callback) {
        WebView webView = getWebView();
        if (webView == null) {
            Log.w(TAG, "Cannot evaluate JS: WebView is null");
            return;
        }
        if (webView.getHandler() == null) {
            Log.w(TAG, "Cannot evaluate JS: WebView handler is null");
            return;
        }
        handler.post(() -> {
            WebView currentWebView = getWebView();
            if (currentWebView == null) return;
            currentWebView.evaluateJavascript(script, callback);
        });
    }

    // ============================================================
    // Public API
    // ============================================================

    /**
     * Initialize NativeBridgeManager
     */
    public static synchronized void initialize(Bridge b, Context c) {
        if (isInitialized && bridge == b) {
            Log.d(TAG, "Already initialized, skipping");
            return;
        }

        bridge = b;
        context = c.getApplicationContext();
        isInitialized = true;
        state = DispatchState.IDLE;
        pendingCallId = null;
        pendingCallType = null;
        dispatchId = null;
        isReactReady = false;

        logState("INITIALIZE", "NativeBridgeManager initialized");
    }

    public interface HandshakeAckListener {
        void onHandshakeAck(String callId);
    }

    private static volatile HandshakeAckListener handshakeAckListener = null;

    public static void setHandshakeAckListener(HandshakeAckListener listener) {
        handshakeAckListener = listener;
    }

    /**
     * Called by React when VoiceCall/VideoCall mounts
     * This confirms React opened the call page
     * Safe to clear CallStore now
     * 
     * IMPORTANT: This is ONLY for confirmation, NOT for dispatch
     */
    public static synchronized void onReactReadyForCall(String callId) {
        if (!isInitialized) {
            Log.w(TAG, "onReactReadyForCall called but not initialized");
            return;
        }

        logState("REACT_READY_FOR_CALL", "React confirmed call page - CallId: " + callId);

        // Notify Handshake ACK listener (IncomingCallActivity)
        if (handshakeAckListener != null) {
            try {
                handshakeAckListener.onHandshakeAck(callId);
            } catch (Exception e) {
                Log.e(TAG, "Error invoking handshakeAckListener", e);
            }
        }

        // Clear CallStore if callId matches
        if (context != null && callId != null) {
            String storedCallId = CallStore.getCallId(context);
            if (callId.equals(storedCallId)) {
                CallStore.clear(context);
                Log.d(TAG, "✅ CallStore cleared - CallId: " + callId);
            } else {
                Log.w(TAG, "⚠️ CallId mismatch - stored: " + storedCallId + ", react: " + callId);
            }
        }

        // Reset to IDLE
        reset();
    }

    /**
     * Dispatch pending call from CallStore to React
     * Dispatches immediately, does NOT wait for reactReady
     */
    public static synchronized void dispatchPendingCall() {
        if (!isInitialized) {
            Log.w(TAG, "dispatchPendingCall called but not initialized");
            return;
        }

        // State machine guard
        if (state == DispatchState.DISPATCHED) {
            Log.d(TAG, "Already dispatched - CallId: " + pendingCallId);
            return;
        }

        if (!isReactReady) {
            logState("DISPATCH_PENDING", "React is NOT ready yet. Postponing dispatch.");
            return;
        }

        if (!isBridgeReady()) {
            logState("DISPATCH_PENDING", "Bridge not ready");
            return;
        }

        if (context == null) {
            Log.e(TAG, "Context is null");
            return;
        }

        // Get call from CallStore
        JSONObject callData = CallStore.get(context);
        if (callData == null) {
            logState("DISPATCH_PENDING", "No pending call found");
            state = DispatchState.IDLE;
            return;
        }

        try {
            String callId = callData.optString("callId", null);
            if (callId == null || callId.isEmpty()) {
                Log.e(TAG, "CallId not found");
                state = DispatchState.IDLE;
                return;
            }

            pendingCallId = callId;
            pendingCallType = callData.optString("callType", "unknown");
            dispatchId = UUID.randomUUID().toString();

            logState("DISPATCH_PENDING", "Dispatching call to React");

            // Inject into React immediately
            injectPendingCall(callData);

        } catch (Exception e) {
            Log.e(TAG, "dispatchPendingCall error", e);
            state = DispatchState.IDLE;
        }
    }

    /**
     * Reset to IDLE state
     * Does NOT clear CallStore - handled by onReactReadyForCall
     */
    public static synchronized void reset() {
        if (state == DispatchState.IDLE && pendingCallId == null) {
            return;
        }

        logState("RESET", "Resetting to IDLE");
        state = DispatchState.IDLE;
        pendingCallId = null;
        pendingCallType = null;
        dispatchId = null;
    }

    /**
     * Clear pending call without React confirmation
     * Use for reject/missed/cancel
     */
    public static synchronized void clearPendingCall() {
        logState("CLEAR_PENDING", "Clearing pending call - CallId: " + pendingCallId);

        if (context != null) {
            CallStore.clear(context);
            Log.d(TAG, "✅ CallStore cleared");
        }

        state = DispatchState.IDLE;
        pendingCallId = null;
        pendingCallType = null;
        dispatchId = null;
    }

    /**
     * Terminate native session (Foreground service, ringtone, notification, CallStore)
     */
    public static synchronized void terminateNativeSession(String callId) {
        logState("TERMINATE_SESSION", "Terminating native session for callId: " + callId);
        
        if (context != null) {
            try {
                // 1. Stop ringtone
                com.g9expert.app.CallRingtoneManager.stop();

                // 2. Cancel notification
                if (callId != null && !callId.isEmpty()) {
                    com.g9expert.app.CallNotificationHelper.cancelIncomingCallNotification(context, callId);
                }

                // 3. Stop foreground service
                android.content.Intent stopIntent = new android.content.Intent(context, com.g9expert.app.IncomingCallForegroundService.class);
                stopIntent.setAction(com.g9expert.app.IncomingCallForegroundService.ACTION_STOP);
                context.startService(stopIntent);

                // 4. Clear store & state
                com.g9expert.app.call.CallStore.clear(context);
                com.g9expert.app.CallStateManager.reset(context);
            } catch (Exception e) {
                Log.e(TAG, "Error terminating native session", e);
            }
        }

        state = DispatchState.IDLE;
        pendingCallId = null;
        pendingCallType = null;
        dispatchId = null;

        // Dispatch call ended event to WebView
        dispatchCallEnded(callId);
    }

    /**
     * Dispatch rejection event to React WebView with dynamic callType
     */
    public static void dispatchCallRejected(String callId, String callType) {
        if (!isBridgeReady()) {
            Log.w(TAG, "Bridge not ready for call rejected dispatch");
            return;
        }

        handler.post(() -> {
            try {
                String safeCallId = callId != null ? callId : "";
                String safeCallType = callType != null ? callType : "voice_call";
                String script =
                    "if (!window.G9) window.G9 = {};" +
                    "if (!window.G9.native) window.G9.native = {};" +
                    "window.G9.native.pendingCall = null;" +
                    "window.dispatchEvent(new CustomEvent('g9:nativeCallRejected', { detail: { callId: '" + safeCallId + "', callType: '" + safeCallType + "', type: '" + safeCallType + "' } }));" +
                    "console.log('[G9] Native call rejected dispatched:', '" + safeCallId + "', 'Type:', '" + safeCallType + "');";

                evaluateJavascript(script, value -> {
                    Log.d(TAG, "✅ g9:nativeCallRejected dispatched to WebView for callId: " + safeCallId + ", callType: " + safeCallType);
                });
            } catch (Exception e) {
                Log.e(TAG, "Failed to dispatch call rejected event", e);
            }
        });
    }

    public static void dispatchCallRejected(String callId) {
        dispatchCallRejected(callId, "voice_call");
    }

    /**
     * Dispatch call timeout event to React WebView with dynamic callType
     */
    public static void dispatchCallTimeout(String callId, String callType) {
        if (!isBridgeReady()) {
            Log.w(TAG, "Bridge not ready for call timeout dispatch");
            return;
        }

        handler.post(() -> {
            try {
                String safeCallId = callId != null ? callId : "";
                String safeCallType = callType != null ? callType : "voice_call";
                String script =
                    "if (!window.G9) window.G9 = {};" +
                    "if (!window.G9.native) window.G9.native = {};" +
                    "window.G9.native.pendingCall = null;" +
                    "window.dispatchEvent(new CustomEvent('g9:nativeCallTimeout', { detail: { callId: '" + safeCallId + "', callType: '" + safeCallType + "', type: '" + safeCallType + "' } }));" +
                    "console.log('[G9] Native call timeout dispatched:', '" + safeCallId + "', 'Type:', '" + safeCallType + "');";

                evaluateJavascript(script, value -> {
                    Log.d(TAG, "✅ g9:nativeCallTimeout dispatched to WebView for callId: " + safeCallId + ", callType: " + safeCallType);
                });
            } catch (Exception e) {
                Log.e(TAG, "Failed to dispatch call timeout event", e);
            }
        });
    }

    public static void dispatchCallTimeout(String callId) {
        dispatchCallTimeout(callId, "voice_call");
    }

    /**
     * Dispatch call ended event to React WebView with dynamic callType
     */
    public static void dispatchCallEnded(String callId, String callType) {
        if (!isBridgeReady()) {
            Log.w(TAG, "Bridge not ready for call ended dispatch");
            return;
        }

        handler.post(() -> {
            try {
                String safeCallId = callId != null ? callId : "";
                String safeCallType = callType != null ? callType : "voice_call";
                String script =
                    "if (!window.G9) window.G9 = {};" +
                    "if (!window.G9.native) window.G9.native = {};" +
                    "window.G9.native.pendingCall = null;" +
                    "window.dispatchEvent(new CustomEvent('g9:nativeCallEnded', { detail: { callId: '" + safeCallId + "', callType: '" + safeCallType + "', type: '" + safeCallType + "' } }));" +
                    "console.log('[G9] Native call ended dispatched:', '" + safeCallId + "', 'Type:', '" + safeCallType + "');";

                evaluateJavascript(script, value -> {
                    Log.d(TAG, "✅ g9:nativeCallEnded dispatched to WebView for callId: " + safeCallId + ", callType: " + safeCallType);
                });
            } catch (Exception e) {
                Log.e(TAG, "Failed to dispatch call ended event", e);
            }
        });
    }

    public static void dispatchCallEnded(String callId) {
        dispatchCallEnded(callId, "voice_call");
    }

    /**
     * Destroy - cleanup references
     * NEVER clear CallStore here
     */
    public static synchronized void destroy() {
        logState("DESTROY", "Destroying NativeBridgeManager");

        bridge = null;
        context = null;
        isInitialized = false;
        // DO NOT clear CallStore here
        // DO NOT reset state here (keep for logging)
    }

    // ============================================================
    // Internal Methods
    // ============================================================

    /**
     * Inject pending call into React's window object
     */
    private static void injectPendingCall(JSONObject callData) {
        try {
            if (!isBridgeReady()) {
                Log.w(TAG, "Bridge not ready for injection");
                state = DispatchState.IDLE;
                return;
            }

            String payload = callData.toString();
            String callId = callData.optString("callId", "unknown");

            Log.d(TAG, "=====================================");
            Log.d(TAG, "NATIVE INJECT");
            Log.d(TAG, "=====================================");
            Log.d(TAG, "DispatchId : " + dispatchId);
            Log.d(TAG, "CallId     : " + callId);
            Log.d(TAG, "CallType   : " + pendingCallType);
            Log.d(TAG, "acceptSent : " + callData.optBoolean("acceptSent", false));
            Log.d(TAG, "PayloadSize: " + payload.length() + " bytes");
            Log.d(TAG, "Time       : " + getCurrentTime());
            Log.d(TAG, "=====================================");

            String targetUrl = callData.optString("targetUrl", "");
            if (targetUrl.isEmpty()) {
                targetUrl = callData.optString("target_url", "");
            }

            // Build injection script
            String script =
                "if (!window.G9) window.G9 = {};" +
                "if (!window.G9.native) window.G9.native = {};" +
                "window.G9.native.pendingCall = " + payload + ";" +
                "window.G9.native.dispatchId = '" + dispatchId + "';" +
                "window.G9.native.dispatchTime = " + System.currentTimeMillis() + ";" +
                "window.G9.native.callId = '" + pendingCallId + "';" +
                "window.G9.native.targetUrl = '" + targetUrl + "';" +
                "window.G9.native.receivedAt = Date.now();" +
                "window.dispatchEvent(new CustomEvent('g9:nativeIncomingCall', { detail: " + payload + " }));" +
                (BuildConfig.DEBUG ? "console.log('[G9] Native call dispatched:', window.G9.native.callId, 'TargetUrl:', window.G9.native.targetUrl, 'DispatchId:', window.G9.native.dispatchId);" : "");

            evaluateJavascript(script, value -> {
                Log.d(TAG, "✅ Call injected successfully - CallId: " + pendingCallId +
                          ", DispatchId: " + dispatchId);

                // Transition to DISPATCHED
                state = DispatchState.DISPATCHED;
                logState("INJECT_COMPLETE", "Call dispatched to React");
            });

        } catch (Exception e) {
            Log.e(TAG, "injectPendingCall error", e);
            state = DispatchState.IDLE;
        }
    }

    // ============================================================
    // Getters
    // ============================================================

    public static boolean isInitialized() { return isInitialized; }
    public static DispatchState getState() { return state; }
    public static String getPendingCallId() { return pendingCallId; }
    public static String getPendingCallType() { return pendingCallType; }
    public static String getDispatchId() { return dispatchId; }
    public static boolean isDispatched() { return state == DispatchState.DISPATCHED; }
    public static boolean isIdle() { return state == DispatchState.IDLE; }
    public static boolean isReactReady() { return isReactReady; }
    public static synchronized void setReactReady(boolean ready) {
        isReactReady = ready;
        Log.d(TAG, "setReactReady: " + ready);
    }

    public static boolean hasPendingCall() {
        return context != null && CallStore.hasPendingCall(context);
    }

    public static void logCurrentState() {
        logState("CURRENT_STATE", null);
        if (context != null) {
            CallStore.logState(context);
        }
    }
}