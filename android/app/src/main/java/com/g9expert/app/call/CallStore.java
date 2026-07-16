package com.g9expert.app.call;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONObject;

public class CallStore {

    private static final String PREF_NAME = "g9_call_store";
    private static final String KEY_PENDING_CALL = "pending_call";
    private static final String KEY_TIMESTAMP = "pending_call_timestamp";

    // 30 seconds validity
    private static final long EXPIRY_MS = 30_000;

    /**
     * Save pending call
     */
    public static synchronized void save(Context context, JSONObject data) {
        if (context == null || data == null) return;

        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit()
                .putString(KEY_PENDING_CALL, data.toString())
                .putLong(KEY_TIMESTAMP, System.currentTimeMillis())
                .commit();
    }

    /**
     * Get pending call
     */
    public static synchronized JSONObject get(Context context) {
        if (context == null) return null;

        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);

        long savedTime = prefs.getLong(KEY_TIMESTAMP, 0);
        if (savedTime == 0) {
            return null;
        }

        // Expired
        if (System.currentTimeMillis() - savedTime > EXPIRY_MS) {
            clear(context);
            return null;
        }

        String json = prefs.getString(KEY_PENDING_CALL, null);
        if (json == null) return null;

        try {
            return new JSONObject(json);
        } catch (Exception e) {
            clear(context);
            return null;
        }
    }

    /**
     * Pending available?
     */
    public static synchronized boolean hasPendingCall(Context context) {
        return get(context) != null;
    }

    /**
     * Clear pending call
     */
    public static synchronized void clear(Context context) {
        if (context == null) return;

        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit()
                .remove(KEY_PENDING_CALL)
                .remove(KEY_TIMESTAMP)
                .commit();
    }

    /**
     * Get call ID from pending call
     */
    public static synchronized String getCallId(Context context) {
        try {
            JSONObject call = get(context);
            if (call == null) return null;
            return call.optString("callId", null);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Check if pending call is expired
     */
    public static synchronized boolean isExpired(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        long savedTime = prefs.getLong(KEY_TIMESTAMP, 0);
        if (savedTime == 0) return true;
        return System.currentTimeMillis() - savedTime > EXPIRY_MS;
    }

    /**
     * Replace pending call (overwrite without touching timestamp logic)
     */
    public static synchronized void replace(Context context, JSONObject data) {
        save(context, data);
    }
}