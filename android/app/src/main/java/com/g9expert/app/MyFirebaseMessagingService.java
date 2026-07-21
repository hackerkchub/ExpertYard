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

        switch (type) {
            case "incoming_call":
            case "voice_call":
            case "video_call":
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

            case "call_cancelled":
                Log.d(TAG, "❌ Call Cancelled: " + message.getData());
                CallNotificationHelper.cancelIncomingCallNotification(this, null);

                // Stop the foreground service
                Intent stopIntent = new Intent(this, IncomingCallForegroundService.class);
                stopIntent.setAction(IncomingCallForegroundService.ACTION_STOP);
                startService(stopIntent);

                // Update state if needed with callId awareness
                String cancelCallId = message.getData().get("callId");
                if (CallStateManager.isIncomingVisible(this, cancelCallId)) {
                    CallStateManager.setIncomingVisible(this, false, null);
                }
                break;

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