package com.g9expert.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import java.util.Map;

public class CallNotificationHelper {

    // Step 1: Notification IDs
    public static final String CHANNEL_CALLS = "g9_calls";
    public static final String CHANNEL_GENERAL = "g9_general";
    public static final int INCOMING_NOTIFICATION_ID = 1001;
    public static final int MISSED_NOTIFICATION_ID = 1002;

    public static void createChannels(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;

        NotificationManager manager = context.getSystemService(NotificationManager.class);

        // ✅ Check if Calls channel exists, create if not
        NotificationChannel calls = manager.getNotificationChannel(CHANNEL_CALLS);
        if (calls == null) {
            calls = new NotificationChannel(
                    CHANNEL_CALLS,
                    "Incoming Calls",
                    NotificationManager.IMPORTANCE_HIGH
            );
            calls.setDescription("Incoming voice calls");
            calls.enableLights(true);
            calls.setLightColor(android.graphics.Color.GREEN);
            calls.enableVibration(true);
            calls.setVibrationPattern(new long[]{0, 700, 700, 700});
            calls.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
            calls.setBypassDnd(true);
            calls.setShowBadge(false);
            calls.setSound(null, null); // Silent - ringtone handled by CallRingtoneManager

            manager.createNotificationChannel(calls);
            Log.d("G9_CALL", "✅ Calls channel created");
        } else {
            Log.d("G9_CALL", "✅ Calls channel already exists");
        }

        // ✅ Check if General channel exists, create if not
        NotificationChannel general = manager.getNotificationChannel(CHANNEL_GENERAL);
        if (general == null) {
            general = new NotificationChannel(
                    CHANNEL_GENERAL,
                    "Notifications",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            general.setDescription("General notifications");

            manager.createNotificationChannel(general);
            Log.d("G9_CALL", "✅ General channel created");
        } else {
            Log.d("G9_CALL", "✅ General channel already exists");
        }
    }

    public static void showNotification(Context context, Map<String, String> data) {
        createChannels(context);

        String title = data.getOrDefault("title", "Notification");
        String body = data.getOrDefault("body", "");

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_GENERAL)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(body)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setOnlyAlertOnce(false)
                .setSilent(false)
                .setTimeoutAfter(30000)
                .setAutoCancel(true);

        NotificationManagerCompat.from(context)
                .notify((int) System.currentTimeMillis(), builder.build());
    }

    public static void showIncomingCall(Context context, Map<String, String> data) {
        // Get callId first
        String callId = data.get("callId");

        // ✅ Duplicate Activity Protection with callId awareness
        // if (CallStateManager.isIncomingVisible(context, callId)) {
        //     Log.d("G9_CALL", "Incoming screen already visible for callId: " + callId);
        //     return;
        // }

        // Set state BEFORE anything else
        // CallStateManager.setIncomingVisible(context, true, callId);
        Log.d("G9_CALL", "Preparing incoming call notification");

        // Cancel old notifications WITHOUT resetting state
        NotificationManagerCompat.from(context).cancel(INCOMING_NOTIFICATION_ID);
        NotificationManagerCompat.from(context).cancel(MISSED_NOTIFICATION_ID);

        // Create channels for this call
        createChannels(context);

        int requestCodeBase = callId != null ? callId.hashCode() : 0;

        Intent intent = new Intent(context, IncomingCallActivity.class);
        intent.putExtra("caller_name", data.get("sender_name"));
        intent.putExtra("call_id", callId);
        intent.putExtra("call_type", data.get("type"));
        intent.putExtra("target_url", data.get("target_url"));

        // ✅ Simplified flags
        intent.setFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK
                        | Intent.FLAG_ACTIVITY_SINGLE_TOP
        );

        Intent acceptIntent = new Intent(context, IncomingCallReceiver.class);
        acceptIntent.setAction(IncomingCallReceiver.ACTION_ACCEPT_CALL);
        acceptIntent.putExtra("call_id", callId);
        acceptIntent.putExtra("caller_name", data.get("sender_name"));
        acceptIntent.putExtra("call_type", data.get("type"));
        acceptIntent.putExtra("target_url", data.get("target_url"));

        PendingIntent acceptPendingIntent = PendingIntent.getBroadcast(
                context,
                501 + requestCodeBase,
                acceptIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Intent rejectIntent = new Intent(context, IncomingCallReceiver.class);
        rejectIntent.setAction(IncomingCallReceiver.ACTION_REJECT_CALL);
        rejectIntent.putExtra("call_id", callId);

        PendingIntent rejectPendingIntent = PendingIntent.getBroadcast(
                context,
                502 + requestCodeBase,
                rejectIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        PendingIntent fullScreenIntent = PendingIntent.getActivity(
                context,
                500 + requestCodeBase,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        // ✅ ALWAYS: Show notification (FALLBACK - works in background/lock screen/killed)
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_CALLS)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(data.getOrDefault("title", "Incoming Call"))
                .setContentText(data.getOrDefault("body", "Someone is calling..."))

                .setCategory(NotificationCompat.CATEGORY_CALL)
                .setPriority(NotificationCompat.PRIORITY_MAX)

                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)

                .setOngoing(true)
                .setAutoCancel(false)

                .setOnlyAlertOnce(false)

                .setForegroundServiceBehavior(
                        NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE
                )

                .setContentIntent(fullScreenIntent)

                .setFullScreenIntent(fullScreenIntent, true)
                .setDefaults(NotificationCompat.DEFAULT_VIBRATE)

                .setVibrate(new long[]{0, 700, 600, 700})

                .setTimeoutAfter(30000)

                .addAction(
                        android.R.drawable.ic_menu_call,
                        "Accept",
                        acceptPendingIntent
                )

                .addAction(
                        android.R.drawable.ic_menu_close_clear_cancel,
                        "Reject",
                        rejectPendingIntent
                );

        // Post notification with logging
        NotificationManagerCompat.from(context)
                .notify(INCOMING_NOTIFICATION_ID, builder.build());

        Log.d("G9_CALL", "✅ Notification posted (FALLBACK - ID: " + INCOMING_NOTIFICATION_ID + ")");

        // Check FullScreenIntent permission on Android 10+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            NotificationManager nm = context.getSystemService(NotificationManager.class);
            Log.d("G9_CALL", "canUseFullScreenIntent = " + nm.canUseFullScreenIntent());
        }

        // Final log with callId
        Log.d("G9_CALL", "CallId = " + callId + " | Notification Sent");
    }

    public static void cancelIncomingCallNotification(Context context, String callId) {
        // Cancel the notification
        NotificationManagerCompat.from(context)
                .cancel(INCOMING_NOTIFICATION_ID);
        
        // ✅ CRITICAL: Reset the state so next call can work properly
        CallStateManager.reset(context);
        
        Log.d("G9_CALL", "✅ Incoming call notification cancelled and state reset");
    }

    public static void showMissedCall(Context context, String callerName) {
        Intent intent = new Intent(context, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

        PendingIntent pendingIntent = PendingIntent.getActivity(
                context,
                900,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_GENERAL)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Missed Call")
                .setContentText(callerName + " tried to call you.")
                .setAutoCancel(true)
                .setContentIntent(pendingIntent);

        NotificationManagerCompat.from(context)
                .notify(MISSED_NOTIFICATION_ID, builder.build());
        
        CallStateManager.setIncomingVisible(context, false, null);
    }
}