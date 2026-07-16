package com.g9expert.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.g9expert.app.call.CallStore;
import com.g9expert.app.bridge.NativeBridgeManager;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * IncomingCallReceiver - Production-Ready Implementation
 * 
 * Simplified Architecture:
 * - When Accept pressed: save call into CallStore → mark acceptSent → launch MainActivity
 * - Do NOT emit socket
 * - Do NOT call JS
 * - Do NOT dispatch event
 * - Only CallStore operations
 * - Voice and Video support
 * - Cold start, background, killed state support
 */
public class IncomingCallReceiver extends BroadcastReceiver {

    private static final String TAG = "IncomingCallReceiver";
    private static final String TAG_ACCEPT = "ACCEPT_RECEIVER";
    private static final String TAG_REJECT = "REJECT_RECEIVER";
    private static final String TAG_TIMEOUT = "TIMEOUT_RECEIVER";

    private static final ExecutorService EXECUTOR = Executors.newSingleThreadExecutor();

    public static final String ACTION_ACCEPT_CALL = "ACTION_ACCEPT_CALL";
    public static final String ACTION_REJECT_CALL = "ACTION_REJECT_CALL";
    public static final String ACTION_TIMEOUT_CALL = "ACTION_TIMEOUT_CALL";

    private static final AtomicBoolean processingAccept = new AtomicBoolean(false);
    private static final AtomicBoolean processingReject = new AtomicBoolean(false);
    private static final AtomicBoolean processingTimeout = new AtomicBoolean(false);

    // Call type constants
    private static final String TYPE_VOICE = "voice";
    private static final String TYPE_VIDEO = "video";

    private String getCurrentTime() {
        return new SimpleDateFormat("HH:mm:ss.SSS", Locale.getDefault()).format(new Date());
    }

    private boolean isVideoCall(String callType) {
        if (callType == null) return false;
        String normalized = callType.trim().toLowerCase();
        return normalized.equals("video") ||
               normalized.equals("video_call") ||
               normalized.equals("video-call") ||
               normalized.equals("video consultation");
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        final PendingResult pendingResult = goAsync();

        EXECUTOR.execute(() -> {
            try {
                if (intent == null) {
                    Log.e(TAG, "Intent is null");
                    return;
                }

                String action = intent.getAction();
                String callId = intent.getStringExtra("call_id");
                String callerName = intent.getStringExtra("caller_name");
                String callType = intent.getStringExtra("call_type");
                String targetUrl = intent.getStringExtra("target_url");
                String userId = intent.getStringExtra("user_id");
                String expertId = intent.getStringExtra("expert_id");

                Log.d(TAG, "====================================");
                Log.d(TAG, "CALL RECEIVER");
                Log.d(TAG, "====================================");
                Log.d(TAG, "Action      : " + action);
                Log.d(TAG, "CallId      : " + callId);
                Log.d(TAG, "Caller      : " + callerName);
                Log.d(TAG, "Type        : " + callType);
                Log.d(TAG, "Target URL  : " + targetUrl);
                Log.d(TAG, "UserId      : " + userId);
                Log.d(TAG, "ExpertId    : " + expertId);
                Log.d(TAG, "Thread      : " + Thread.currentThread().getName());
                Log.d(TAG, "Time        : " + getCurrentTime());
                Log.d(TAG, "====================================");

                if (action == null) {
                    Log.e(TAG, "Action is null");
                    return;
                }

                switch (action) {
                    case ACTION_ACCEPT_CALL:
                        handleAcceptCall(context, callId, callerName, callType, targetUrl, userId, expertId);
                        break;

                    case ACTION_REJECT_CALL:
                        handleRejectCall(context, callId, callType, userId, expertId);
                        break;

                    case ACTION_TIMEOUT_CALL:
                        handleTimeoutCall(context, callId, callerName, callType, userId, expertId);
                        break;

                    default:
                        Log.w(TAG, "Unknown action: " + action);
                        break;
                }

            } catch (Exception e) {
                Log.e(TAG, "Error in receiver", e);
            } finally {
                pendingResult.finish();
            }
        });
    }

    /*
     * =====================================================
     * HANDLE ACCEPT CALL
     * =====================================================
     * Flow:
     * 1. Save call to CallStore
     * 2. Mark acceptSent = true
     * 3. Launch MainActivity
     * 4. DO NOT emit socket
     * 5. DO NOT call JS
     * 6. DO NOT dispatch event
     */
    private void handleAcceptCall(Context context, String callId, String callerName,
                                   String callType, String targetUrl, String userId, String expertId) {
        if (!processingAccept.compareAndSet(false, true)) {
            Log.d(TAG_ACCEPT, "Accept already processing - ignoring duplicate");
            return;
        }

        if (callId == null || callId.isEmpty()) {
            Log.e(TAG_ACCEPT, "Invalid callId");
            processingAccept.set(false);
            return;
        }

        try {
            Log.d(TAG_ACCEPT, "====================================");
            Log.d(TAG_ACCEPT, "ACCEPT CALL");
            Log.d(TAG_ACCEPT, "====================================");
            Log.d(TAG_ACCEPT, "CallId      : " + callId);
            Log.d(TAG_ACCEPT, "CallType    : " + callType);
            Log.d(TAG_ACCEPT, "UserId      : " + userId);
            Log.d(TAG_ACCEPT, "ExpertId    : " + expertId);
            Log.d(TAG_ACCEPT, "Time        : " + getCurrentTime());
            Log.d(TAG_ACCEPT, "====================================");

            // ============================================================
            // STEP 1: Save call to CallStore
            // ============================================================
            Log.d(TAG_ACCEPT, "[STEP 1] Saving call to CallStore");

            JSONObject call = new JSONObject();
            call.put("callId", callId);
            call.put("callerName", callerName != null ? callerName : "Unknown");
            call.put("callType", callType != null ? callType : TYPE_VOICE);
            call.put("targetUrl", targetUrl != null ? targetUrl : "");
            call.put("userId", userId != null ? userId : "");
            call.put("expertId", expertId != null ? expertId : "");
            call.put("acceptedAt", System.currentTimeMillis());
            call.put("callState", CallStore.STATE_ACCEPTED);
            call.put("socketEvents", new JSONObject());

            CallStore.save(context, call);
            CallStore.touch(context);
            CallStore.logState(context);
            Log.d(TAG_ACCEPT, "[STEP 1] ✅ Call saved to CallStore");

            // ============================================================
            // STEP 2: Mark acceptSent = true
            // ============================================================
            Log.d(TAG_ACCEPT, "[STEP 2] Marking acceptSent = true");
            CallStore.markAcceptSent(context);
            CallStore.touch(context);
            CallStore.logState(context);
            Log.d(TAG_ACCEPT, "[STEP 2] ✅ acceptSent marked");

            // ============================================================
            // STEP 3: Stop ringtone
            // ============================================================
            Log.d(TAG_ACCEPT, "[STEP 3] Stopping ringtone");
            CallRingtoneManager.stop();
            Log.d(TAG_ACCEPT, "[STEP 3] ✅ Ringtone stopped");

            // ============================================================
            // STEP 4: Cancel notification
            // ============================================================
            Log.d(TAG_ACCEPT, "[STEP 4] Canceling notification");
            CallNotificationHelper.cancelIncomingCallNotification(context, callId);
            Log.d(TAG_ACCEPT, "[STEP 4] ✅ Notification canceled");

            // ============================================================
            // STEP 5: Update CallStateManager
            // ============================================================
            Log.d(TAG_ACCEPT, "[STEP 5] Updating CallStateManager");
            CallStateManager.setIncomingVisible(context, false, null);

            if (isVideoCall(callType)) {
                CallStateManager.setInVideoCall(context, true);
                Log.d(TAG_ACCEPT, "[STEP 5] ✅ Video call state set");
            } else {
                CallStateManager.setInVoiceCall(context, true);
                Log.d(TAG_ACCEPT, "[STEP 5] ✅ Voice call state set");
            }

            // ============================================================
            // STEP 6: Launch MainActivity
            // ============================================================
            Log.d(TAG_ACCEPT, "[STEP 6] Launching MainActivity");

            Intent launch = new Intent(context, MainActivity.class);
            launch.addFlags(
                    Intent.FLAG_ACTIVITY_NEW_TASK |
                    Intent.FLAG_ACTIVITY_SINGLE_TOP |
                    Intent.FLAG_ACTIVITY_CLEAR_TOP
            );
            launch.putExtra("native_accept", true);
            launch.putExtra("call_id", callId);
            launch.putExtra("call_type", callType);

            try {
                context.startActivity(launch);
                Log.d(TAG_ACCEPT, "[STEP 6] ✅ MainActivity launched");
            } catch (Exception e) {
                Log.e(TAG_ACCEPT, "[STEP 6] ❌ Failed to launch MainActivity", e);
                processingAccept.set(false);
                return;
            }

            // ============================================================
            // STEP 7: Reset NativeBridgeManager
            // ============================================================
            Log.d(TAG_ACCEPT, "[STEP 7] Resetting NativeBridgeManager");
            NativeBridgeManager.reset();
            Log.d(TAG_ACCEPT, "[STEP 7] ✅ NativeBridgeManager reset");

            // ============================================================
            // STEP 8: Done - DO NOT emit socket, DO NOT call JS, DO NOT dispatch
            // ============================================================
            Log.d(TAG_ACCEPT, "====================================");
            Log.d(TAG_ACCEPT, "✅ ACCEPT COMPLETE");
            Log.d(TAG_ACCEPT, "   - Call saved to CallStore");
            Log.d(TAG_ACCEPT, "   - acceptSent = true");
            Log.d(TAG_ACCEPT, "   - MainActivity launched");
            Log.d(TAG_ACCEPT, "   - React will dispatch automatically");
            Log.d(TAG_ACCEPT, "====================================");

        } catch (Exception e) {
            Log.e(TAG_ACCEPT, "Exception in handleAcceptCall", e);
        } finally {
            processingAccept.set(false);
        }
    }

    /*
     * =====================================================
     * HANDLE REJECT CALL
     * =====================================================
     */
    private void handleRejectCall(Context context, String callId, String callType, 
                                   String userId, String expertId) {
        if (!processingReject.compareAndSet(false, true)) {
            Log.d(TAG_REJECT, "Reject already processing - ignoring duplicate");
            return;
        }

        if (callId == null || callId.isEmpty()) {
            Log.e(TAG_REJECT, "Invalid callId");
            processingReject.set(false);
            return;
        }

        try {
            Log.d(TAG_REJECT, "====================================");
            Log.d(TAG_REJECT, "REJECT CALL");
            Log.d(TAG_REJECT, "====================================");
            Log.d(TAG_REJECT, "CallId      : " + callId);
            Log.d(TAG_REJECT, "CallType    : " + callType);
            Log.d(TAG_REJECT, "Time        : " + getCurrentTime());
            Log.d(TAG_REJECT, "====================================");

            // ============================================================
            // STEP 1: Save reject to CallStore
            // ============================================================
            Log.d(TAG_REJECT, "[STEP 1] Saving reject to CallStore");

            JSONObject call = CallStore.get(context);
            if (call == null) {
                call = new JSONObject();
                call.put("callId", callId);
                call.put("callType", callType != null ? callType : TYPE_VOICE);
                call.put("socketEvents", new JSONObject());
            }

            call.put("callState", CallStore.STATE_REJECTED);
            CallStore.save(context, call);
            CallStore.touch(context);
            CallStore.logState(context);
            Log.d(TAG_REJECT, "[STEP 1] ✅ Reject saved to CallStore");

            // ============================================================
            // STEP 2: Mark rejectSent
            // ============================================================
            Log.d(TAG_REJECT, "[STEP 2] Marking rejectSent = true");
            CallStore.markRejectSent(context);
            CallStore.touch(context);
            Log.d(TAG_REJECT, "[STEP 2] ✅ rejectSent marked");

            // ============================================================
            // STEP 3: Stop ringtone
            // ============================================================
            Log.d(TAG_REJECT, "[STEP 3] Stopping ringtone");
            CallRingtoneManager.stop();
            Log.d(TAG_REJECT, "[STEP 3] ✅ Ringtone stopped");

            // ============================================================
            // STEP 4: Cancel notification
            // ============================================================
            Log.d(TAG_REJECT, "[STEP 4] Canceling notification");
            CallNotificationHelper.cancelIncomingCallNotification(context, callId);
            Log.d(TAG_REJECT, "[STEP 4] ✅ Notification canceled");

            // ============================================================
            // STEP 5: Clear CallStore
            // ============================================================
            Log.d(TAG_REJECT, "[STEP 5] Clearing CallStore");
            CallStore.clear(context);
            CallStore.logState(context);
            Log.d(TAG_REJECT, "[STEP 5] ✅ CallStore cleared");

            // ============================================================
            // STEP 6: Reset CallStateManager
            // ============================================================
            Log.d(TAG_REJECT, "[STEP 6] Resetting CallStateManager");
            CallStateManager.reset(context);
            Log.d(TAG_REJECT, "[STEP 6] ✅ CallStateManager reset");

            Log.d(TAG_REJECT, "✅ REJECT COMPLETE");

        } catch (Exception e) {
            Log.e(TAG_REJECT, "Exception in handleRejectCall", e);
        } finally {
            processingReject.set(false);
        }
    }

    /*
     * =====================================================
     * HANDLE TIMEOUT CALL
     * =====================================================
     */
    private void handleTimeoutCall(Context context, String callId, String callerName,
                                   String callType, String userId, String expertId) {
        if (!processingTimeout.compareAndSet(false, true)) {
            Log.d(TAG_TIMEOUT, "Timeout already processing - ignoring duplicate");
            return;
        }

        if (callId == null || callId.isEmpty()) {
            Log.e(TAG_TIMEOUT, "Invalid callId");
            processingTimeout.set(false);
            return;
        }

        try {
            Log.d(TAG_TIMEOUT, "====================================");
            Log.d(TAG_TIMEOUT, "TIMEOUT CALL");
            Log.d(TAG_TIMEOUT, "====================================");
            Log.d(TAG_TIMEOUT, "CallId      : " + callId);
            Log.d(TAG_TIMEOUT, "CallType    : " + callType);
            Log.d(TAG_TIMEOUT, "Time        : " + getCurrentTime());
            Log.d(TAG_TIMEOUT, "====================================");

            // ============================================================
            // STEP 1: Save missed to CallStore
            // ============================================================
            Log.d(TAG_TIMEOUT, "[STEP 1] Saving missed call to CallStore");

            JSONObject call = CallStore.get(context);
            if (call == null) {
                call = new JSONObject();
                call.put("callId", callId);
                call.put("callType", callType != null ? callType : TYPE_VOICE);
                call.put("callerName", callerName != null ? callerName : "Unknown");
                call.put("socketEvents", new JSONObject());
            }

            call.put("callState", CallStore.STATE_MISSED);
            CallStore.save(context, call);
            CallStore.touch(context);
            CallStore.logState(context);
            Log.d(TAG_TIMEOUT, "[STEP 1] ✅ Missed call saved to CallStore");

            // ============================================================
            // STEP 2: Mark missedSent
            // ============================================================
            Log.d(TAG_TIMEOUT, "[STEP 2] Marking missedSent = true");
            CallStore.markMissedSent(context);
            CallStore.touch(context);
            Log.d(TAG_TIMEOUT, "[STEP 2] ✅ missedSent marked");

            // ============================================================
            // STEP 3: Stop ringtone
            // ============================================================
            Log.d(TAG_TIMEOUT, "[STEP 3] Stopping ringtone");
            CallRingtoneManager.stop();
            Log.d(TAG_TIMEOUT, "[STEP 3] ✅ Ringtone stopped");

            // ============================================================
            // STEP 4: Cancel notification
            // ============================================================
            Log.d(TAG_TIMEOUT, "[STEP 4] Canceling notification");
            CallNotificationHelper.cancelIncomingCallNotification(context, callId);
            Log.d(TAG_TIMEOUT, "[STEP 4] ✅ Notification canceled");

            // ============================================================
            // STEP 5: Show missed call notification
            // ============================================================
            Log.d(TAG_TIMEOUT, "[STEP 5] Showing missed call notification");
            String name = (callerName == null || callerName.isEmpty()) ? "Someone" : callerName;
            CallNotificationHelper.showMissedCall(context, name, callId);
            Log.d(TAG_TIMEOUT, "[STEP 5] ✅ Missed call notification shown");

            // ============================================================
            // STEP 6: Clear CallStore
            // ============================================================
            Log.d(TAG_TIMEOUT, "[STEP 6] Clearing CallStore");
            CallStore.clear(context);
            CallStore.logState(context);
            Log.d(TAG_TIMEOUT, "[STEP 6] ✅ CallStore cleared");

            // ============================================================
            // STEP 7: Reset CallStateManager
            // ============================================================
            Log.d(TAG_TIMEOUT, "[STEP 7] Resetting CallStateManager");
            CallStateManager.reset(context);
            Log.d(TAG_TIMEOUT, "[STEP 7] ✅ CallStateManager reset");

            Log.d(TAG_TIMEOUT, "✅ TIMEOUT COMPLETE");

        } catch (Exception e) {
            Log.e(TAG_TIMEOUT, "Exception in handleTimeoutCall", e);
        } finally {
            processingTimeout.set(false);
        }
    }
}