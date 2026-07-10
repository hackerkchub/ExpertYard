package com.g9expert.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.g9expert.app.call.CallStore;

import org.json.JSONObject;

public class IncomingCallReceiver extends BroadcastReceiver {

    private static final String TAG = "G9_CallReceiver";

    // ✅ Action Constants
    public static final String ACTION_ACCEPT_CALL = "ACTION_ACCEPT_CALL";
    public static final String ACTION_REJECT_CALL = "ACTION_REJECT_CALL";

    @Override
    public void onReceive(Context context, Intent intent) {
        // ✅ Null safety check
        if (intent == null) {
            Log.e(TAG, "Intent is null");
            return;
        }

        String action = intent.getAction();
        String callId = intent.getStringExtra("call_id");
        String userId = intent.getStringExtra("user_id");
        String expertId = intent.getStringExtra("expert_id");
        String callerName = intent.getStringExtra("caller_name");
        String callType = intent.getStringExtra("call_type");
        String targetUrl = intent.getStringExtra("target_url"); // ✅ Added targetUrl

        Log.d(TAG, "========== CALL RECEIVER ==========");
        Log.d(TAG, "Action: " + action);
        Log.d(TAG, "Call ID: " + callId);
        Log.d(TAG, "User ID: " + userId);
        Log.d(TAG, "Expert ID: " + expertId);
        Log.d(TAG, "Caller: " + callerName);
        Log.d(TAG, "Type: " + callType);
        Log.d(TAG, "Target URL: " + targetUrl); // ✅ Log targetUrl
        Log.d(TAG, "====================================");

        if (action == null) {
            Log.e(TAG, "Action is null");
            return;
        }

        // ✅ Cancel notification once (only here)
        CallNotificationHelper.cancelIncomingCallNotification(context, callId);

        // ✅ Use constants in switch
        switch (action) {
            case ACTION_ACCEPT_CALL:
                // ✅ Better logging with details
                Log.d(TAG, "✅ Call ACCEPTED - Call ID: " + callId + ", User: " + userId + ", Expert: " + expertId);
                
                // ✅ Save call data to CallStore with validation
                boolean saved = false;
                try {
                    JSONObject call = new JSONObject();
                    call.put("callId", callId);
                    call.put("callerName", callerName);
                    call.put("callType", callType);
                    call.put("userId", userId);
                    call.put("expertId", expertId);
                    call.put("targetUrl", targetUrl); // ✅ Added targetUrl

                    CallStore.save(context, call);
                    saved = true;
                    Log.d(TAG, "✅ Call data saved to CallStore");
                } catch (Exception e) {
                    Log.e(TAG, "❌ Failed to save pending call", e);
                }

                // ✅ Only launch MainActivity if save was successful
                if (saved) {
                    Intent launch = new Intent(context, MainActivity.class);
                    launch.addFlags(
                            Intent.FLAG_ACTIVITY_NEW_TASK
                                    | Intent.FLAG_ACTIVITY_CLEAR_TOP
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
                    Log.e(TAG, "❌ Call data save failed, not launching MainActivity");
                }
                
                // TODO: Send accept event to backend
                // sendCallAcceptToBackend(callId, userId, expertId);
                break;

            case ACTION_REJECT_CALL:
                // ✅ Better logging with details
                Log.d(TAG, "❌ Call REJECTED - Call ID: " + callId + ", User: " + userId + ", Expert: " + expertId);
                
                // ✅ Clear CallStore (notification already cancelled above)
                CallStore.clear(context);
                
                // TODO: Send reject event to backend
                // sendCallRejectToBackend(callId, userId, expertId);
                break;

            default:
                Log.w(TAG, "⚠️ Unknown action: " + action);
                break;
        }
    }

    /**
     * TODO: Implement these methods when backend API is ready
     */
    private void sendCallAcceptToBackend(String callId, String userId, String expertId) {
        // Will implement when backend API is ready
        Log.d(TAG, "📤 Sending ACCEPT to backend: " + callId);
    }

    private void sendCallRejectToBackend(String callId, String userId, String expertId) {
        // Will implement when backend API is ready
        Log.d(TAG, "📤 Sending REJECT to backend: " + callId);
    }
}