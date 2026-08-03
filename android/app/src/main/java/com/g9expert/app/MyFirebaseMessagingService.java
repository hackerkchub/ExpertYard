package com.g9expert.app;

import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationManagerCompat;

import com.capacitorjs.plugins.pushnotifications.MessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends MessagingService {

    private static final String TAG = "G9_FCM";

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);

        Log.d(TAG, "NEW TOKEN = " + token);

        /*
         * TODO
         * Send token to backend
         */
        // sendTokenToBackend(token);
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        Log.d(TAG, "===============");
        Log.d(TAG, "MESSAGE RECEIVED");
        Log.d(TAG, "FROM : " + message.getFrom());
        Log.d(TAG, "DATA : " + message.getData().toString());
        Log.d(TAG, "===============");

        String type = message.getData().get("type");

        if (type == null) {
            type = "general";
        } else {
            type = type.trim().toLowerCase();
        }

        Log.d(TAG, "TYPE = " + type);

        // Step 1: Read action from payload
        String action = message.getData().get("action");
        if (action == null) {
            action = "";
        } else {
            action = action.trim().toLowerCase();
        }
        Log.d(TAG, "ACTION = " + action);

        switch (type) {
            case "incoming_call":
            case "voice_call":
            case "video_call":
                // Old payloads don't have action, so treat empty as incoming
                if (action.isEmpty() || "incoming".equals(action)) {
                    // Step 1: Cleanup before showing incoming call
                    CallNotificationHelper.cancelIncomingCallNotification(this, null);
                    NotificationManagerCompat.from(this)
                            .cancel(CallNotificationHelper.MISSED_NOTIFICATION_ID);

                    // ✅ START FOREGROUND SERVICE FOR VOICE / VIDEO CALLS
                    Log.d(TAG, "📞 Incoming Call: " + message.getData());

                    Intent serviceIntent = new Intent(this, IncomingCallForegroundService.class);
                    serviceIntent.setAction(IncomingCallForegroundService.ACTION_START);

                    for (String key : message.getData().keySet()) {
                        serviceIntent.putExtra(key, message.getData().get(key));
                    }

                    try {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            startForegroundService(serviceIntent);
                            Log.d(TAG, "✅ startForegroundService() called");
                        } else {
                            startService(serviceIntent);
                            Log.d(TAG, "✅ startService() called");
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "❌ Failed to start IncomingCallForegroundService", e);
                    }
                    break;
                }

                // New backend actions - cancel/decline/end
                if ("cancel".equals(action)
                        || "decline".equals(action)
                        || "end".equals(action)) {

                    Log.d(TAG, "📴 Call closed by remote side. Action = " + action);

                    // 1. Stop ringtone
                    CallRingtoneManager.stop();

                    // 2. Get call ID
                    String cancelCallId = message.getData().get("callId");
                    if (cancelCallId == null) cancelCallId = message.getData().get("call_id");
                    if (cancelCallId == null) cancelCallId = message.getData().get("request_id");

                    // 3. Dismiss notification
                    CallNotificationHelper.cancelIncomingCallNotification(this, cancelCallId);

                    // 4. Stop the foreground service
                    try {
                        Intent stopIntent = new Intent(this, IncomingCallForegroundService.class);
                        stopIntent.setAction(IncomingCallForegroundService.ACTION_STOP);

                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            startForegroundService(stopIntent);
                        } else {
                            startService(stopIntent);
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Failed to stop foreground service", e);
                    }

                    // 5. Finish the activity screen instantly
                    IncomingCallActivity.finishActiveInstance();

                    // 6. Update state
                    CallStateManager.setIncomingVisible(this, false, null);

                    break;
                }
                break;

            case "incoming_chat":
            case "chat":
            case "chat_request":
                Log.d(TAG, "💬 Incoming Chat Request: " + message.getData());
                // Step 1: Cleanup prior notifications
                CallNotificationHelper.cancelIncomingCallNotification(this, null);
                NotificationManagerCompat.from(this)
                        .cancel(CallNotificationHelper.MISSED_NOTIFICATION_ID);

                // Step 2: Post standard notification via NotificationManager to avoid Foreground Service crash
                CallNotificationHelper.showIncomingCall(this, message.getData());
                break;

            // Step 3: Keep old cases for backward compatibility
            case "call_cancelled":
            case "video_call_cancelled":
            case "chat_cancelled":
            case "chat_request_cancelled":
            case "session_terminated":
                Log.d(TAG, "❌ Termination signal received: " + type + " - Data: " + message.getData());
                
                // 1. Stop ringtone
                CallRingtoneManager.stop();

                // 2. Dismiss notification
                String cancelCallId = message.getData().get("callId");
                if (cancelCallId == null) {
                    cancelCallId = message.getData().get("call_id");
                }
                if (cancelCallId == null) {
                    cancelCallId = message.getData().get("request_id");
                }
                CallNotificationHelper.cancelIncomingCallNotification(this, cancelCallId);

                // 3. Stop the foreground service
                try {
                    Intent stopIntent = new Intent(this, IncomingCallForegroundService.class);
                    stopIntent.setAction(IncomingCallForegroundService.ACTION_STOP);
                    startService(stopIntent);
                } catch (Exception e) {
                    Log.e(TAG, "Failed to stop foreground service", e);
                }

                // 4. Finish the activity screen instantly
                IncomingCallActivity.finishActiveInstance();

                // 5. Update state
                CallStateManager.setIncomingVisible(this, false, null);
                break;

            // Step 4: call_missed - No changes
            case "call_missed":
                Log.d(TAG, "📴 Call Missed: " + message.getData());
                CallNotificationHelper.cancelIncomingCallNotification(this, null);

                // Stop the foreground service
                Intent missedStopIntent = new Intent(this, IncomingCallForegroundService.class);
                missedStopIntent.setAction(IncomingCallForegroundService.ACTION_STOP);
                startService(missedStopIntent);

                // Update state with callId awareness
                String missedCallId = message.getData().get("callId");
                if (CallStateManager.isIncomingVisible(this, missedCallId)) {
                    CallStateManager.setIncomingVisible(this, false, null);
                }

                // ✅ FIX 4: Check voice call state with context
                if (CallStateManager.isInVoiceCall(this)) {
                    // ✅ FIX 5: Set voice call state with context
                    CallStateManager.setInVoiceCall(this, false);
                }

                String callerName = message.getData().get("caller_name");
                if (callerName != null && !callerName.isEmpty()) {
                    CallNotificationHelper.showMissedCall(this, callerName);
                } else {
                    CallNotificationHelper.showMissedCall(this, "Someone");
                }
                break;

            default:
                Log.d(TAG, "📨 General Notification forwarded to Capacitor");
                super.onMessageReceived(message);
                break;
        }
    }

    // TODO: Implement this method later
    private void sendTokenToBackend(String token) {
        // Will be implemented when backend API is ready
    }
}