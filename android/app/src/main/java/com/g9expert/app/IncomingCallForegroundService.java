package com.g9expert.app;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import java.util.HashMap;
import java.util.Map;

public class IncomingCallForegroundService extends Service {

    private static final String TAG = "G9_SERVICE";
    
    public static final String ACTION_START = "ACTION_START_CALL";
    public static final String ACTION_STOP = "ACTION_STOP_CALL";
    
    // Separate notification ID for foreground service
    private static final int FOREGROUND_NOTIFICATION_ID = 9001;
    
    // Track current call to prevent duplicates
    private String currentCallId = null;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "Foreground Service Created");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        if (intent == null) {
            Log.w(TAG, "Intent is null, stopping service");
            stopSelf();
            return START_NOT_STICKY;
        }

        String action = intent.getAction();

        if (ACTION_STOP.equals(action)) {
            Log.d(TAG, "Stop action received");
            stopService();
            return START_NOT_STICKY;
        }

        if (ACTION_START.equals(action)) {
            return handleStartCall(intent);
        }

        Log.w(TAG, "Unknown action: " + action);
        return START_NOT_STICKY;
    }

    private int handleStartCall(Intent intent) {
        Log.d(TAG, "Handling start call intent");

        // Collect data from intent extras
        Map<String, String> data = extractData(intent);
        
        // Validate callId
        String callId = data.get("callId");
        if (callId == null || callId.isEmpty()) {
            Log.e(TAG, "❌ callId is null or empty - cannot process call");
            stopService();
            return START_NOT_STICKY;
        }

        // ✅ Check for duplicate incoming call
        if (callId.equals(currentCallId)) {
            Log.d(TAG, "⚠️ Duplicate call detected: " + callId + " - ignoring");
            return START_NOT_STICKY;
        }

        // Check if this call is already visible
        if (CallStateManager.isIncomingVisible(this, callId)) {
            Log.d(TAG, "⚠️ Call already visible: " + callId + " - ignoring duplicate");
            return START_NOT_STICKY;
        }

        // Set current call ID
        currentCallId = callId;

        // Prepare caller name (handle both fields)
        String callerName = data.get("caller_name");
        if (callerName == null || callerName.isEmpty()) {
            callerName = data.get("sender_name");
            if (callerName == null || callerName.isEmpty()) {
                callerName = "Incoming Call";
            }
        }

        // Prepare call type (voice/video)
        String callType = data.get("call_type");
        if (callType == null || callType.isEmpty()) {
            callType = data.get("type");
            if (callType == null || callType.isEmpty()) {
                callType = "voice";
            }
        }

        // Extract target URL
        String targetUrl = data.get("target_url");
        if (targetUrl == null || targetUrl.isEmpty()) {
            targetUrl = data.get("targetUrl");
        }

        Log.d(TAG, "Call details - ID: " + callId + 
                  ", Caller: " + callerName + 
                  ", Type: " + callType + 
                  ", TargetUrl: " + targetUrl);

        // ✅ STEP 1: Start Foreground Service FIRST
        startForegroundService();

        // ✅ STEP 2: Show notification
        CallNotificationHelper.showIncomingCall(this, data);

        // ✅ STEP 3: Launch Activity (with error handling)
        launchIncomingCallActivity(callId, callerName, callType, targetUrl, data);

        Log.d(TAG, "Foreground service started for call: " + callId);
        return START_NOT_STICKY;
    }

    private Map<String, String> extractData(Intent intent) {
        Map<String, String> data = new HashMap<>();
        Bundle extras = intent.getExtras();

        if (extras != null) {
            for (String key : extras.keySet()) {
                Object value = extras.get(key);
                if (value != null) {
                    data.put(key, value.toString());
                }
            }
            Log.d(TAG, "Extracted " + data.size() + " extras from intent");
        } else {
            Log.w(TAG, "No extras found in intent");
        }

        return data;
    }

    private void startForegroundService() {
        CallNotificationHelper.createChannels(this);

        // Silent foreground notification - just to keep service alive
        Notification notification = new NotificationCompat.Builder(
                this, 
                CallNotificationHelper.CHANNEL_CALLS
        )
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Incoming Call")
                .setContentText("Preparing incoming call...")
                .setCategory(NotificationCompat.CATEGORY_SERVICE)
                .setPriority(NotificationCompat.PRIORITY_MIN) // ✅ MIN priority
                .setOnlyAlertOnce(true)
                .setSilent(true)
                .setOngoing(true)
                .build();

        // Android 14+ requires foreground service type
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) { // Android 14
            try {
                startForeground(
                        FOREGROUND_NOTIFICATION_ID,
                        notification,
                        android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_PHONE_CALL
                );
                Log.d(TAG, "Foreground started with phone call type (Android 14+)");
            } catch (Exception e) {
                Log.e(TAG, "Failed to start foreground with phone call type, falling back", e);
                startForeground(FOREGROUND_NOTIFICATION_ID, notification);
            }
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            try {
                startForeground(
                        FOREGROUND_NOTIFICATION_ID,
                        notification
                        // FOREGROUND_SERVICE_TYPE_DATA_SYNC commented for compatibility
                );
                Log.d(TAG, "Foreground started (Android 10+)");
            } catch (Exception e) {
                Log.e(TAG, "Failed to start foreground, falling back", e);
                startForeground(FOREGROUND_NOTIFICATION_ID, notification);
            }
        } else {
            startForeground(FOREGROUND_NOTIFICATION_ID, notification);
            Log.d(TAG, "Foreground started (pre Android 10)");
        }

        Log.d(TAG, "Foreground notification displayed");
    }

    private void launchIncomingCallActivity(String callId, String callerName, 
                                           String callType, String targetUrl, 
                                           Map<String, String> data) {
        try {
            Intent activityIntent = new Intent(this, IncomingCallActivity.class);
            activityIntent.putExtra("call_id", callId);
            activityIntent.putExtra("caller_name", callerName);
            activityIntent.putExtra("call_type", callType);
            activityIntent.putExtra("target_url", targetUrl);
            
            // Pass through all data for future use
            for (Map.Entry<String, String> entry : data.entrySet()) {
                if (!activityIntent.hasExtra(entry.getKey())) {
                    activityIntent.putExtra(entry.getKey(), entry.getValue());
                }
            }

            activityIntent.addFlags(
                    Intent.FLAG_ACTIVITY_NEW_TASK
                            | Intent.FLAG_ACTIVITY_SINGLE_TOP
            );

            startActivity(activityIntent);
            Log.d(TAG, "✅ IncomingCallActivity launched successfully for call: " + callId);

        } catch (Exception e) {
            Log.e(TAG, "❌ Unable to start IncomingCallActivity", e);
            
            // ✅ Update notification to FullScreen if activity failed
            try {
                CallNotificationHelper.showIncomingCall(this, data);
                Log.d(TAG, "✅ FullScreen notification shown as fallback");
            } catch (Exception ex) {
                Log.e(TAG, "❌ Failed to show fullscreen notification", ex);
            }
        }
    }

    private void stopService() {
        Log.d(TAG, "Stopping foreground service - CallId: " + currentCallId);
        
        // Stop foreground notification
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            stopForeground(STOP_FOREGROUND_REMOVE);
            Log.d(TAG, "Foreground stopped with removal");
        } else {
            stopForeground(true);
            Log.d(TAG, "Foreground stopped (legacy)");
        }
        
        // Stop ringtone if playing
        try {
            CallRingtoneManager.stop();
            Log.d(TAG, "Ringtone stopped");
        } catch (Exception e) {
            Log.w(TAG, "Failed to stop ringtone", e);
        }
        
        // Clear current call
        currentCallId = null;
        
        // Stop service
        stopSelf();
        Log.d(TAG, "Service stopped");
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        super.onTaskRemoved(rootIntent);
        Log.d(TAG, "Task removed - stopping service");
        // If task is removed, stop service to clean up
        stopService();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "Foreground Service Destroyed");
        
        // ✅ Ensure ringtone is stopped on destroy
        try {
            CallRingtoneManager.stop();
            Log.d(TAG, "Ringtone stopped on destroy");
        } catch (Exception e) {
            Log.w(TAG, "Failed to stop ringtone on destroy", e);
        }
        
        currentCallId = null;
        super.onDestroy();
    }
}