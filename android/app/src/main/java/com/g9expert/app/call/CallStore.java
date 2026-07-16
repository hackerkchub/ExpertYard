package com.g9expert.app.call;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * CallStore - Single Source of Truth for Call Data
 */
public class CallStore {

    private static final String TAG = "CallStore";

    // ============================================================
    // Constants
    // ============================================================
    private static final String PREF_NAME = "g9_call_store";
    private static final String KEY_CALL_DATA = "call_data";
    private static final String KEY_TIMESTAMP = "timestamp";
    private static final long EXPIRY_MS = 30_000; // 30 seconds

    // Call State Constants (for IncomingCallReceiver compatibility)
    public static final String STATE_ACCEPTED = "accepted";
    public static final String STATE_REJECTED = "rejected";
    public static final String STATE_MISSED = "missed";

    // ============================================================
    // Private Constructor
    // ============================================================
    private CallStore() {}

    // ============================================================
    // Logging Helper
    // ============================================================
    private static String getCurrentTime() {
        return new SimpleDateFormat("HH:mm:ss.SSS", Locale.getDefault()).format(new Date());
    }

    // ============================================================
    // Core Operations
    // ============================================================

    public static synchronized void save(Context context, JSONObject data) {
        if (context == null || data == null) {
            Log.w(TAG, "Cannot save: context or data is null");
            return;
        }

        try {
            if (!data.has("createdAt")) {
                data.put("createdAt", System.currentTimeMillis());
            }

            SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
            prefs.edit()
                    .putString(KEY_CALL_DATA, data.toString())
                    .putLong(KEY_TIMESTAMP, System.currentTimeMillis())
                    .apply();

            Log.d(TAG, "✅ Call saved - CallId: " + data.optString("callId", "unknown"));
            logState(context);

        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to save call", e);
        }
    }

    public static synchronized JSONObject get(Context context) {
        if (context == null) {
            Log.w(TAG, "Cannot get: context is null");
            return null;
        }

        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);

        if (!prefs.contains(KEY_CALL_DATA)) {
            return null;
        }

        long timestamp = prefs.getLong(KEY_TIMESTAMP, 0);
        if (timestamp == 0 || System.currentTimeMillis() - timestamp > EXPIRY_MS) {
            Log.d(TAG, "⏰ Call expired, clearing");
            clear(context);
            return null;
        }

        String json = prefs.getString(KEY_CALL_DATA, null);
        if (json == null) {
            return null;
        }

        try {
            return new JSONObject(json);
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to parse call JSON", e);
            clear(context);
            return null;
        }
    }

    public static synchronized void clear(Context context) {
        if (context == null) {
            Log.w(TAG, "Cannot clear: context is null");
            return;
        }

        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit()
                .remove(KEY_CALL_DATA)
                .remove(KEY_TIMESTAMP)
                .apply();

        Log.d(TAG, "🧹 CallStore cleared");
    }

    public static synchronized boolean hasPendingCall(Context context) {
        return get(context) != null;
    }

    // ============================================================
    // Mark Operations
    // ============================================================

    public static synchronized void markAccept(Context context) {
        if (context == null) return;

        JSONObject call = get(context);
        if (call == null) {
            Log.w(TAG, "⚠️ Cannot mark accept - no pending call");
            return;
        }

        try {
            call.put("acceptSent", true);
            save(context, call);
            Log.d(TAG, "✅ Accept marked - CallId: " + call.optString("callId", "unknown"));
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to mark accept", e);
        }
    }

    // Wrapper for IncomingCallReceiver compatibility
    public static synchronized void markAcceptSent(Context context) {
        markAccept(context);
    }

    public static synchronized void markReject(Context context) {
        if (context == null) return;

        JSONObject call = get(context);
        if (call == null) {
            Log.w(TAG, "⚠️ Cannot mark reject - no pending call");
            return;
        }

        try {
            call.put("rejectSent", true);
            save(context, call);
            Log.d(TAG, "✅ Reject marked - CallId: " + call.optString("callId", "unknown"));
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to mark reject", e);
        }
    }

    // Wrapper for IncomingCallReceiver compatibility
    public static synchronized void markRejectSent(Context context) {
        markReject(context);
    }

    public static synchronized void markMissed(Context context) {
        if (context == null) return;

        JSONObject call = get(context);
        if (call == null) {
            Log.w(TAG, "⚠️ Cannot mark missed - no pending call");
            return;
        }

        try {
            call.put("missedSent", true);
            save(context, call);
            Log.d(TAG, "✅ Missed marked - CallId: " + call.optString("callId", "unknown"));
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to mark missed", e);
        }
    }

    // Wrapper for IncomingCallReceiver compatibility
    public static synchronized void markMissedSent(Context context) {
        markMissed(context);
    }

    // ============================================================
    // Check Operations
    // ============================================================

    public static synchronized boolean isAcceptSent(Context context) {
        if (context == null) return false;
        JSONObject call = get(context);
        if (call == null) return false;
        return call.optBoolean("acceptSent", false);
    }

    public static synchronized boolean isRejectSent(Context context) {
        if (context == null) return false;
        JSONObject call = get(context);
        if (call == null) return false;
        return call.optBoolean("rejectSent", false);
    }

    public static synchronized boolean isMissedSent(Context context) {
        if (context == null) return false;
        JSONObject call = get(context);
        if (call == null) return false;
        return call.optBoolean("missedSent", false);
    }

    // ============================================================
    // Convenience Getter Methods
    // ============================================================

    public static synchronized String getCallId(Context context) {
        JSONObject call = get(context);
        if (call == null) return null;
        return call.optString("callId", null);
    }

    public static synchronized String getCaller(Context context) {
        JSONObject call = get(context);
        if (call == null) return null;
        return call.optString("caller", null);
    }

    public static synchronized String getCallType(Context context) {
        JSONObject call = get(context);
        if (call == null) return null;
        return call.optString("callType", null);
    }

    public static synchronized Long getCreatedAt(Context context) {
        JSONObject call = get(context);
        if (call == null) return null;
        long time = call.optLong("createdAt", 0);
        return time > 0 ? time : null;
    }

    // ============================================================
    // Debug Operations
    // ============================================================

    public static synchronized void logState(Context context) {
        if (context == null) return;

        JSONObject call = get(context);
        if (call == null) {
            Log.d(TAG, "📊 CallStore: No pending call");
            return;
        }

        try {
            String callId = call.optString("callId", "unknown");
            String caller = call.optString("caller", "unknown");
            String callType = call.optString("callType", "unknown");
            boolean acceptSent = call.optBoolean("acceptSent", false);
            boolean rejectSent = call.optBoolean("rejectSent", false);
            boolean missedSent = call.optBoolean("missedSent", false);
            long createdAt = call.optLong("createdAt", 0);

            Log.d(TAG, "========================================");
            Log.d(TAG, "📊 CallStore State");
            Log.d(TAG, "========================================");
            Log.d(TAG, "CallId     : " + callId);
            Log.d(TAG, "Caller     : " + caller);
            Log.d(TAG, "CallType   : " + callType);
            Log.d(TAG, "acceptSent : " + acceptSent);
            Log.d(TAG, "rejectSent : " + rejectSent);
            Log.d(TAG, "missedSent : " + missedSent);
            Log.d(TAG, "createdAt  : " + (createdAt > 0 ? formatTime(createdAt) : "N/A"));
            Log.d(TAG, "========================================");

        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to log state", e);
        }
    }

    private static String formatTime(long timestamp) {
        return new SimpleDateFormat("HH:mm:ss.SSS", Locale.getDefault())
                .format(new Date(timestamp));
    }

    // ============================================================
    // Utility Operations
    // ============================================================

    public static synchronized void touch(Context context) {
        if (context == null) return;
        JSONObject call = get(context);
        if (call == null) return;
        save(context, call);
        Log.d(TAG, "🔄 Call touched - CallId: " + call.optString("callId", "unknown"));
    }

    public static synchronized boolean isExpired(Context context) {
        if (context == null) return true;
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        long timestamp = prefs.getLong(KEY_TIMESTAMP, 0);
        if (timestamp == 0) return true;
        return System.currentTimeMillis() - timestamp > EXPIRY_MS;
    }

    public static long getExpiryTime() {
        return EXPIRY_MS;
    }

    public static JSONObject buildCall(String callId, String caller, String callType) {
        try {
            JSONObject data = new JSONObject();
            data.put("callId", callId);
            data.put("caller", caller != null ? caller : "Unknown");
            data.put("callType", callType != null ? callType : "voice");
            data.put("acceptSent", false);
            data.put("rejectSent", false);
            data.put("missedSent", false);
            data.put("createdAt", System.currentTimeMillis());
            return data;
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to build call data", e);
            return null;
        }
    }
}