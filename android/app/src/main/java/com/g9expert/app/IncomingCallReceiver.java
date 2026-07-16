package com.g9expert.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.g9expert.app.call.CallStore;

import org.json.JSONObject;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

public class IncomingCallReceiver extends BroadcastReceiver {

    private static final String TAG = "G9_CallReceiver";

    private static final ExecutorService EXECUTOR = Executors.newSingleThreadExecutor();

    public static final String ACTION_ACCEPT_CALL = "ACTION_ACCEPT_CALL";
    public static final String ACTION_REJECT_CALL = "ACTION_REJECT_CALL";
    public static final String ACTION_TIMEOUT_CALL = "ACTION_TIMEOUT_CALL";

    private static final AtomicBoolean processingAccept = new AtomicBoolean(false);
    private static final AtomicBoolean processingReject = new AtomicBoolean(false);
    private static final AtomicBoolean processingTimeout = new AtomicBoolean(false);

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

                Log.d(TAG, "========== CALL RECEIVER ==========");
                Log.d(TAG, "Action: " + action);
                Log.d(TAG, "Call ID: " + callId);
                Log.d(TAG, "Caller: " + callerName);
                Log.d(TAG, "Type: " + callType);
                Log.d(TAG, "Target URL: " + targetUrl);
                Log.d(TAG, "====================================");

                if (action == null) {
                    Log.e(TAG, "Action is null");
                    return;
                }

                // ❌ REMOVED: Global cancel - now handled per action

                switch (action) {
                    case ACTION_ACCEPT_CALL:
                        handleAcceptCall(context, callId, callerName, callType, targetUrl);
                        break;

                    case ACTION_REJECT_CALL:
                        handleRejectCall(context, callId);
                        break;

                    case ACTION_TIMEOUT_CALL:
                        handleTimeoutCall(context, callId, callerName);
                        break;

                    default:
                        Log.w(TAG, "⚠️ Unknown action: " + action);
                        break;
                }

            } catch (Exception e) {
                Log.e(TAG, "❌ Error in receiver", e);
            } finally {
                pendingResult.finish();
            }
        });
    }

    private void handleAcceptCall(Context context, String callId, String callerName,
                                   String callType, String targetUrl) {
        if (!processingAccept.compareAndSet(false, true)) {
            Log.d(TAG, "Accept already processing");
            return;
        }

        if (callId == null || callId.isEmpty()) {
            Log.e(TAG, "❌ Invalid callId");
            processingAccept.set(false);
            return;
        }

        try {
            Log.d(TAG, "✅ Call ACCEPTED - Call ID: " + callId);

            // Step 1: Stop ringtone
            CallRingtoneManager.stop();

            // Step 2: Cancel notification
            CallNotificationHelper.cancelIncomingCallNotification(context, callId);

            // Step 3: Save CallStore
            boolean saved = false;
            try {
                JSONObject call = new JSONObject();
                call.put("callId", callId);
                call.put("callerName", callerName);
                call.put("callType", callType);
                call.put("targetUrl", targetUrl);

                CallStore.save(context, call);
                saved = true;
                Log.d(TAG, "✅ Call data saved to CallStore");
            } catch (Exception e) {
                Log.e(TAG, "❌ Failed to save pending call", e);
            }

            // Step 4: Reset state and set voice call
            if (saved) {
                CallStateManager.reset(context);
                CallStateManager.setInVoiceCall(context, true);
                Log.d(TAG, "✅ State reset and voice call set to true");

                // Step 5: Launch MainActivity
                Intent launch = new Intent(context, MainActivity.class);
                launch.addFlags(
                        Intent.FLAG_ACTIVITY_NEW_TASK
                                | Intent.FLAG_ACTIVITY_SINGLE_TOP
                );
                launch.putExtra("native_accept", true);

                try {
                    context.startActivity(launch);
                    Log.d(TAG, "✅ MainActivity launched successfully");
                } catch (Exception e) {
                    Log.e(TAG, "❌ Failed to launch MainActivity", e);
                }
            } else {
                Log.e(TAG, "❌ Call data save failed - cleaning up");
                CallStore.clear(context);
            }

        } finally {
            processingAccept.set(false);
        }
    }

    private void handleRejectCall(Context context, String callId) {
        if (!processingReject.compareAndSet(false, true)) {
            Log.d(TAG, "Reject already processing");
            return;
        }

        try {
            Log.d(TAG, "❌ Call REJECTED - Call ID: " + callId);

            // Step 1: Stop ringtone
            CallRingtoneManager.stop();

            // Step 2: Cancel notification
            CallNotificationHelper.cancelIncomingCallNotification(context, callId);

            // Step 3: Clear CallStore and reset state
            CallStore.clear(context);
            CallStateManager.reset(context);

            Log.d(TAG, "✅ Reject handled successfully");

        } finally {
            processingReject.set(false);
        }
    }

    private void handleTimeoutCall(Context context, String callId, String callerName) {
        if (!processingTimeout.compareAndSet(false, true)) {
            Log.d(TAG, "Timeout already processing");
            return;
        }

        try {
            Log.d(TAG, "⏰ Call TIMEOUT - Call ID: " + callId);

            // Step 1: Stop ringtone
            CallRingtoneManager.stop();

            // Step 2: Cancel notification
            CallNotificationHelper.cancelIncomingCallNotification(context, callId);

            // Step 3: Clear CallStore and reset state
            CallStore.clear(context);
            CallStateManager.reset(context);

            // Step 4: Show missed call notification
            String name = (callerName == null || callerName.isEmpty()) ? "Someone" : callerName;
            CallNotificationHelper.showMissedCall(context, name);

            Log.d(TAG, "✅ Timeout handled successfully");

        } finally {
            processingTimeout.set(false);
        }
    }
}