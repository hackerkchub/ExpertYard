package com.g9expert.app;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationManagerCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = "G9_FCM";

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);

        Log.d(TAG, "NEW TOKEN = " + token);

        /*
         * TODO
         * Send token to backend
         */
        // You'll implement this later:
        // sendTokenToBackend(token);
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);

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

                // Step 3: Better logging with full data
                Log.d(TAG, "Incoming Call: " + message.getData());

                CallNotificationHelper.showIncomingCall(this, message.getData());
                break;

            // Step 2: Future ready - Call Cancelled
            case "call_cancelled":
                Log.d(TAG, "Call Cancelled: " + message.getData());
                CallNotificationHelper.cancelIncomingCallNotification(this, null);
                break;

            // Step 2: Future ready - Call Missed
            case "call_missed":
                Log.d(TAG, "Call Missed: " + message.getData());
                CallNotificationHelper.cancelIncomingCallNotification(this, null);
                
                String callerName = message.getData().get("caller_name");
                if (callerName != null && !callerName.isEmpty()) {
                    CallNotificationHelper.showMissedCall(this, callerName);
                } else {
                    CallNotificationHelper.showMissedCall(this, "Someone");
                }
                break;

            default:
                Log.d(TAG, "General Notification");
                CallNotificationHelper.showNotification(this, message.getData());
                break;
        }
    }

    // TODO: Implement this method later
    private void sendTokenToBackend(String token) {
        // Will be implemented when backend API is ready
    }
}