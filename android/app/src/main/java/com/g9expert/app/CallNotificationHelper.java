package com.g9expert.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

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

        NotificationChannel calls = new NotificationChannel(
                CHANNEL_CALLS,
                "Incoming Calls",
                NotificationManager.IMPORTANCE_HIGH
        );
        calls.setDescription("Incoming voice calls");
        calls.enableLights(true);
        calls.enableVibration(true);
        calls.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
        calls.enableVibration(true);
        calls.setBypassDnd(true);
        calls.setShowBadge(false);

        NotificationChannel general = new NotificationChannel(
                CHANNEL_GENERAL,
                "Notifications",
                NotificationManager.IMPORTANCE_DEFAULT
        );

        manager.createNotificationChannel(calls);
        manager.createNotificationChannel(general);
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
        // Step 2 + 9: Cancel old incoming and missed notifications
        cancelIncomingCallNotification(context, null);
        NotificationManagerCompat.from(context).cancel(MISSED_NOTIFICATION_ID);

        createChannels(context);

        Intent intent = new Intent(context, IncomingCallActivity.class);
        intent.putExtra("caller_name", data.get("caller_name"));
        intent.putExtra("call_id", data.get("call_id"));
        intent.putExtra("user_id", data.get("user_id"));
        intent.putExtra("expert_id", data.get("expert_id"));
        intent.putExtra("avatar", data.get("avatar"));
        intent.putExtra("call_type", data.get("type"));

        intent.setFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK
                        | Intent.FLAG_ACTIVITY_SINGLE_TOP
                        | Intent.FLAG_ACTIVITY_CLEAR_TOP
        );

        Intent acceptIntent = new Intent(context, IncomingCallReceiver.class);
        acceptIntent.setAction(IncomingCallReceiver.ACTION_ACCEPT_CALL);
        acceptIntent.putExtras(intent);

        PendingIntent acceptPendingIntent = PendingIntent.getBroadcast(
                context,
                501,
                acceptIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Intent rejectIntent = new Intent(context, IncomingCallReceiver.class);
        rejectIntent.setAction(IncomingCallReceiver.ACTION_REJECT_CALL);
        rejectIntent.putExtras(intent);

        PendingIntent rejectPendingIntent = PendingIntent.getBroadcast(
                context,
                502,
                rejectIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        PendingIntent fullScreenIntent = PendingIntent.getActivity(
                context,
                500,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_CALLS)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(data.getOrDefault("title", "Incoming Call"))
                .setContentText(data.getOrDefault("body", "Someone is calling..."))
                .setContentIntent(fullScreenIntent)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_CALL)
                .setOngoing(true)
                .setAutoCancel(false)
                // Step 4: Add timeout
                .setTimeoutAfter(30000)
                .setVibrate(new long[]{0, 700, 600, 700, 600, 700})
                // Step 5: Add public visibility for lock screen
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setFullScreenIntent(fullScreenIntent, true)
                .addAction(android.R.drawable.ic_menu_call, "Accept", acceptPendingIntent)
                .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Reject", rejectPendingIntent);

        // Step 1: Use constant instead of hardcoded 1001
        NotificationManagerCompat.from(context)
                .notify(INCOMING_NOTIFICATION_ID, builder.build());
    }

    // Step 8: Use constant instead of hardcoded 1001
    public static void cancelIncomingCallNotification(Context context, String callId) {
        NotificationManagerCompat.from(context).cancel(INCOMING_NOTIFICATION_ID);
    }

    // Step 3: Missed Call Notification
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
    }
}