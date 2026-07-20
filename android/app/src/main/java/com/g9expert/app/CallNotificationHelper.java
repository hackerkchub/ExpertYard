package com.g9expert.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Notification;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import java.util.Map;

public class CallNotificationHelper {

    private static final String TAG = "CallNotificationHelper";

    // Notification IDs
    public static final String CHANNEL_CALLS = "g9_calls";
    public static final String CHANNEL_GENERAL = "g9_general";
    public static final int INCOMING_NOTIFICATION_ID = 1001;
    public static final int MISSED_NOTIFICATION_ID = 1002;

    public static void createChannels(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;

        NotificationManager manager = context.getSystemService(NotificationManager.class);

        // Calls channel
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
            Log.d(TAG, "✅ Calls channel created");
        }

        // General channel
        NotificationChannel general = manager.getNotificationChannel(CHANNEL_GENERAL);
        if (general == null) {
            general = new NotificationChannel(
                    CHANNEL_GENERAL,
                    "Notifications",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            general.setDescription("General notifications");
            manager.createNotificationChannel(general);
            Log.d(TAG, "✅ General channel created");
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

    public static Notification buildIncomingCallNotification(Context context, Map<String, String> data, boolean disableFullScreen) {
        // Get call details with proper fallbacks
        String callId = data.get("callId");
        if (callId == null || callId.isEmpty()) {
            callId = data.get("request_id");
            if (callId == null || callId.isEmpty()) {
                callId = data.get("related_id");
                if (callId == null || callId.isEmpty()) {
                    callId = data.get("chatId");
                    if (callId == null || callId.isEmpty()) {
                        callId = data.get("notification_id");
                        if (callId == null || callId.isEmpty()) {
                            Log.e(TAG, "❌ callId and fallback IDs are null or empty - cannot show notification");
                            return null;
                        }
                    }
                }
            }
        }

        // Proper caller name with fallback
        String callerName = data.get("caller_name");
        if (callerName == null || callerName.isEmpty()) {
            callerName = data.get("sender_name");
            if (callerName == null || callerName.isEmpty()) {
                callerName = "Incoming Call";
            }
        }

        // Proper call type with fallback
        String callType = data.get("call_type");
        if (callType == null || callType.isEmpty()) {
            callType = data.get("type");
            if (callType == null || callType.isEmpty()) {
                callType = "voice";
            }
        }

        String targetUrl = data.get("target_url");
        if (targetUrl == null || targetUrl.isEmpty()) {
            targetUrl = data.get("targetUrl");
            if (targetUrl == null || targetUrl.isEmpty()) {
                targetUrl = data.get("url");
                if (targetUrl == null || targetUrl.isEmpty()) {
                    targetUrl = data.get("click_action");
                }
            }
        }

        if (targetUrl == null || targetUrl.isEmpty()) {
            boolean isVideo = "video".equalsIgnoreCase(callType) || "video_call".equalsIgnoreCase(callType) || "video-call".equalsIgnoreCase(callType);
            boolean isChat = "chat".equalsIgnoreCase(callType) || "incoming_chat".equalsIgnoreCase(callType) || "chat_request".equalsIgnoreCase(callType);
            String base = "/expert";
            if (isChat) {
                targetUrl = base + "/chat/" + callId;
            } else if (isVideo) {
                targetUrl = base + "/video-call/" + callId;
            } else {
                targetUrl = base + "/voice-call/" + callId;
            }
        }

        // Get additional fields
        String userId = data.get("userId");
        String expertId = data.get("expertId");

        Log.d(TAG, "Building incoming notification - ID: " + callId + 
                  ", Caller: " + callerName + 
                  ", Type: " + callType +
                  ", TargetUrl: " + targetUrl);

        createChannels(context);

        int requestCodeBase = callId.hashCode();

        // Main activity intent
        Intent intent = new Intent(context, IncomingCallActivity.class);
        intent.putExtra("call_id", callId);
        intent.putExtra("caller_name", callerName);
        intent.putExtra("call_type", callType);
        intent.putExtra("target_url", targetUrl);
        intent.putExtra("targetUrl", targetUrl);
        if (userId != null) intent.putExtra("user_id", userId);
        if (expertId != null) intent.putExtra("expert_id", expertId);

        intent.setFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK
                        | Intent.FLAG_ACTIVITY_SINGLE_TOP
        );

        // Accept intent targeting MainActivity directly to bring app to foreground
        Intent acceptIntent = new Intent(context, MainActivity.class);
        acceptIntent.setAction("ACTION_ACCEPT_CALL");
        acceptIntent.putExtra("call_id", callId);
        acceptIntent.putExtra("caller_name", callerName);
        acceptIntent.putExtra("call_type", callType);
        acceptIntent.putExtra("target_url", targetUrl);
        acceptIntent.putExtra("targetUrl", targetUrl);
        if (userId != null) acceptIntent.putExtra("user_id", userId);
        if (expertId != null) acceptIntent.putExtra("expert_id", expertId);
        acceptIntent.putExtra("native_accept", true);
        acceptIntent.putExtra("auto_accept", true); // ✅ Auto-accept calls instantly
        acceptIntent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK
                        | Intent.FLAG_ACTIVITY_CLEAR_TOP
                        | Intent.FLAG_ACTIVITY_SINGLE_TOP
        );

        PendingIntent acceptPendingIntent = PendingIntent.getActivity(
                context,
                501 + requestCodeBase,
                acceptIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        // Reject intent with all data
        Intent rejectIntent = new Intent(context, IncomingCallReceiver.class);
        rejectIntent.setAction(IncomingCallReceiver.ACTION_REJECT_CALL);
        rejectIntent.putExtra("call_id", callId);
        rejectIntent.putExtra("caller_name", callerName);
        rejectIntent.putExtra("call_type", callType);
        if (userId != null) rejectIntent.putExtra("user_id", userId);
        if (expertId != null) rejectIntent.putExtra("expert_id", expertId);

        PendingIntent rejectPendingIntent = PendingIntent.getBroadcast(
                context,
                502 + requestCodeBase,
                rejectIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        // View intent to dismiss notification and route without accepting/rejecting
        Intent viewIntent = new Intent(context, MainActivity.class);
        viewIntent.setAction("ACTION_VIEW_CALL");
        viewIntent.putExtra("call_id", callId);
        viewIntent.putExtra("caller_name", callerName);
        viewIntent.putExtra("call_type", callType);
        viewIntent.putExtra("target_url", targetUrl);
        if (userId != null) viewIntent.putExtra("user_id", userId);
        if (expertId != null) viewIntent.putExtra("expert_id", expertId);
        viewIntent.putExtra("native_view", true);
        viewIntent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK
                        | Intent.FLAG_ACTIVITY_CLEAR_TOP
                        | Intent.FLAG_ACTIVITY_SINGLE_TOP
        );

        PendingIntent viewPendingIntent = PendingIntent.getActivity(
                context,
                503 + requestCodeBase,
                viewIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        PendingIntent fullScreenIntent = PendingIntent.getActivity(
                context,
                500 + requestCodeBase,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        boolean isVideo = "video".equalsIgnoreCase(callType) || "video_call".equalsIgnoreCase(callType) || "video-call".equalsIgnoreCase(callType) || "video consultation".equalsIgnoreCase(callType);
        boolean isChat = "chat".equalsIgnoreCase(callType) || "incoming_chat".equalsIgnoreCase(callType) || "chat_request".equalsIgnoreCase(callType);

        String titleText;
        String contentText;
        if (isChat) {
            titleText = callerName + " sent a chat request";
            contentText = "💬 Chat request";
        } else {
            titleText = callerName + " is calling...";
            contentText = isVideo ? "📹 Video call" : "📞 Voice call";
        }

        // Build notification
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_CALLS)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(titleText)
                .setContentText(contentText)
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
                )
                .addAction(
                        android.R.drawable.ic_menu_view,
                        "View",
                        viewPendingIntent
                );

        if (!disableFullScreen) {
            builder.setFullScreenIntent(fullScreenIntent, true);
        }

        // Colorized for Android 14+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            builder.setColorized(true);
            builder.setColor(android.graphics.Color.parseColor("#00C853")); // Green accent
        }

        return builder.build();
    }

    public static void showIncomingCall(Context context, Map<String, String> data) {
        Notification notification = buildIncomingCallNotification(context, data, false);
        if (notification == null) return;

        // Cancel old notifications without resetting state
        NotificationManagerCompat.from(context).cancel(INCOMING_NOTIFICATION_ID);
        NotificationManagerCompat.from(context).cancel(MISSED_NOTIFICATION_ID);

        // Try-catch for SecurityException
        try {
            NotificationManagerCompat.from(context)
                    .notify(INCOMING_NOTIFICATION_ID, notification);
            Log.d(TAG, "✅ Notification posted (ID: " + INCOMING_NOTIFICATION_ID + ")");
        } catch (SecurityException e) {
            Log.e(TAG, "❌ SecurityException posting notification", e);
            // Fallback without fullscreen intent
            try {
                Notification fallbackNotification = buildIncomingCallNotification(context, data, true);
                NotificationManagerCompat.from(context)
                        .notify(INCOMING_NOTIFICATION_ID, fallbackNotification);
                Log.d(TAG, "✅ Fallback notification posted without fullscreen");
            } catch (Exception ex) {
                Log.e(TAG, "❌ Failed to post fallback notification", ex);
            }
            // Log fullscreen intent availability on Android 10+
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                NotificationManager nm = context.getSystemService(NotificationManager.class);
                Log.d(TAG, "canUseFullScreenIntent = " + nm.canUseFullScreenIntent());
            }

            String callId = data.get("callId");
            Log.d(TAG, "✅ Incoming call notification shown - CallId: " + callId);
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to post notification", e);
        }
    }

    // ✅ Fix 1: Only cancel notification, NO state reset
    public static void cancelIncomingCallNotification(Context context, String callId) {
        try {
            NotificationManagerCompat.from(context)
                    .cancel(INCOMING_NOTIFICATION_ID);
            Log.d(TAG, "✅ Incoming call notification cancelled - CallId: " + callId);
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to cancel notification", e);
        }
    }

    // ✅ Fix 14: Missed call notification
    public static void showMissedCall(Context context, String callerName, String callId) {
        try {
            Intent intent = new Intent(context, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            if (callId != null) {
                intent.putExtra("call_id", callId);
            }

            PendingIntent pendingIntent = PendingIntent.getActivity(
                    context,
                    900 + (callId != null ? callId.hashCode() : 0),
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            // Determine display name
            String displayName = callerName != null ? callerName : "Someone";

            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_GENERAL)
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentTitle("Missed Call")
                    .setContentText(displayName + " tried to call you.")
                    .setAutoCancel(true)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setContentIntent(pendingIntent);

            NotificationManagerCompat.from(context)
                    .notify(MISSED_NOTIFICATION_ID, builder.build());

            Log.d(TAG, "✅ Missed call notification shown - Caller: " + displayName + ", CallId: " + callId);
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to show missed call notification", e);
        }
    }

    // Convenience method for missed call without callId
    public static void showMissedCall(Context context, String callerName) {
        showMissedCall(context, callerName, null);
    }

    // ✅ Fix 4: Removed duplicate protection - now handled by ForegroundService

    // ✅ Fix 5: Helper to check if notification is still showing
    public static boolean isIncomingNotificationActive(Context context) {
        try {
            // Not reliable with NotificationManagerCompat
            // Better to check via CallStateManager
            return CallStateManager.isIncomingVisible(context, null);
        } catch (Exception e) {
            Log.e(TAG, "Failed to check notification status", e);
            return false;
        }
    }

    // Helper to update notification with caller name
    public static void updateIncomingCallNotification(Context context, String callId, String callerName) {
        try {
            // Rebuild notification with updated caller name
            Map<String, String> data = Map.of(
                "callId", callId,
                "caller_name", callerName
            );
            showIncomingCall(context, data);
            Log.d(TAG, "✅ Incoming call notification updated - CallId: " + callId);
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to update notification", e);
        }
    }
}