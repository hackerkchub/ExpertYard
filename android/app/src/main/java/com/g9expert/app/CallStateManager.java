package com.g9expert.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import java.util.concurrent.atomic.AtomicBoolean;

public final class CallStateManager {

    private static final String TAG = "CallStateManager";

    private CallStateManager() {}

    private static final String PREF = "g9_call_state";

    private static final String KEY_INCOMING = "incoming_visible";
    private static final String KEY_VOICE = "voice_call";
    private static final String KEY_VIDEO = "video_call"; // Added
    private static final String KEY_CHAT = "chat_call";
    private static final String KEY_CALL_ID = "call_id";
    private static final String KEY_TIMESTAMP = "timestamp";
    private static final String KEY_LAST_CALL_ID = "last_call_id";

    // State timeout - 35 seconds (incoming screen should auto-dismiss)
    private static final long STATE_TIMEOUT_MS = 35000;

    // Atomic booleans for fast in-memory access
    private static final AtomicBoolean incomingVisible = new AtomicBoolean(false);
    private static final AtomicBoolean voiceCall = new AtomicBoolean(false);
    private static final AtomicBoolean videoCall = new AtomicBoolean(false); // Added
    private static final AtomicBoolean chat = new AtomicBoolean(false);

    // Current call ID in memory for fast access
    private static volatile String currentCallId = null;

    private static SharedPreferences prefs(Context c) {
        return c.getApplicationContext()
                .getSharedPreferences(PREF, Context.MODE_PRIVATE);
    }

    // -----------------------------------------------------------------------
    // Incoming Screen - Call ID Aware with Timeout
    // -----------------------------------------------------------------------

    public static boolean isIncomingVisible(Context context, String currentCallId) {
        if (context == null) {
            Log.w(TAG, "Context is null, returning false");
            return false;
        }

        String savedCallId = getCurrentCallId(context);
        long lastUpdate = getLastUpdate(context);
        long age = System.currentTimeMillis() - lastUpdate;

        // Check if state is too old (>35 seconds)
        if (age > STATE_TIMEOUT_MS) {
            Log.d(TAG, "State expired (age: " + age + "ms). Clearing.");
            reset(context);
            return false;
        }

        // Check if this is a different call ID
        if (currentCallId != null && savedCallId != null && !savedCallId.equals(currentCallId)) {
            Log.d(TAG, "Different CallId detected. Old: " + savedCallId + ", New: " + currentCallId);
            reset(context);
            return false;
        }

        // Check if currentCallId is null but we have state
        if (currentCallId == null && savedCallId != null) {
            Log.d(TAG, "Current call ID is null but saved call ID exists: " + savedCallId);
            // Keep the state but log warning
        }

        boolean memory = incomingVisible.get();
        boolean pref = prefs(context).getBoolean(KEY_INCOMING, false);

        boolean visible = memory || pref;
        
        Log.d(TAG, "isIncomingVisible=" + visible + 
                  " | memory=" + memory + 
                  " | pref=" + pref +
                  " | savedCallId=" + savedCallId +
                  " | currentCallId=" + currentCallId +
                  " | age=" + age + "ms");

        return visible;
    }

    public static void setIncomingVisible(Context context, boolean visible, String callId) {
        if (context == null) {
            Log.w(TAG, "Context is null, cannot set incoming visible");
            return;
        }

        Log.d(TAG, "setIncomingVisible -> visible=" + visible + ", callId=" + callId);

        incomingVisible.set(visible);
        
        if (visible && callId != null) {
            currentCallId = callId;
        } else if (!visible) {
            currentCallId = null;
        }

        SharedPreferences.Editor editor = prefs(context).edit();
        editor.putBoolean(KEY_INCOMING, visible);
        
        if (callId != null) {
            editor.putString(KEY_CALL_ID, callId);
            editor.putString(KEY_LAST_CALL_ID, callId);
        }
        
        editor.putLong(KEY_TIMESTAMP, System.currentTimeMillis());
        editor.apply();

        Log.d(TAG, "State updated - incomingVisible=" + visible + ", callId=" + callId);
    }

    // -----------------------------------------------------------------------
    // Voice Call
    // -----------------------------------------------------------------------

    public static boolean isInVoiceCall(Context context) {
        if (context == null) {
            return false;
        }
        
        if (voiceCall.get()) {
            return true;
        }
        
        boolean pref = prefs(context).getBoolean(KEY_VOICE, false);
        Log.d(TAG, "isInVoiceCall=" + pref);
        return pref;
    }

    public static void setInVoiceCall(Context context, boolean value) {
        if (context == null) {
            Log.w(TAG, "Context is null, cannot set voice call");
            return;
        }

        Log.d(TAG, "setInVoiceCall=" + value);
        voiceCall.set(value);
        prefs(context).edit().putBoolean(KEY_VOICE, value).apply();
    }

    // -----------------------------------------------------------------------
    // Video Call (Added)
    // -----------------------------------------------------------------------

    public static boolean isInVideoCall(Context context) {
        if (context == null)
            return false;

        if (videoCall.get())
            return true;

        return prefs(context).getBoolean(KEY_VIDEO, false);
    }

    public static void setInVideoCall(Context context, boolean value) {
        if (context == null)
            return;

        videoCall.set(value);

        prefs(context)
                .edit()
                .putBoolean(KEY_VIDEO, value)
                .apply();
    }

    // -----------------------------------------------------------------------
    // Chat
    // -----------------------------------------------------------------------

    public static boolean isInChat(Context context) {
        if (context == null) {
            return false;
        }
        
        if (chat.get()) {
            return true;
        }
        
        boolean pref = prefs(context).getBoolean(KEY_CHAT, false);
        Log.d(TAG, "isInChat=" + pref);
        return pref;
    }

    public static void setInChat(Context context, boolean value) {
        if (context == null) {
            Log.w(TAG, "Context is null, cannot set chat");
            return;
        }

        Log.d(TAG, "setInChat=" + value);
        chat.set(value);
        prefs(context).edit().putBoolean(KEY_CHAT, value).apply();
    }

    // -----------------------------------------------------------------------
    // Busy (Updated - includes video call)
    // -----------------------------------------------------------------------

    public static boolean isBusy(Context context) {
        if (context == null) {
            return false;
        }
        
        boolean busy = isInVoiceCall(context) 
                    || isInVideoCall(context)  // Added
                    || isInChat(context);
        
        Log.d(TAG, "isBusy=" + busy);
        return busy;
    }

    // -----------------------------------------------------------------------
    // Call ID Management
    // -----------------------------------------------------------------------

    public static String getCurrentCallId(Context context) {
        if (context == null) {
            return null;
        }
        
        // Return memory value first (faster)
        if (currentCallId != null) {
            return currentCallId;
        }
        
        // Fallback to SharedPreferences
        String saved = prefs(context).getString(KEY_CALL_ID, null);
        if (saved != null) {
            currentCallId = saved;
        }
        return saved;
    }

    public static String getLastCallId(Context context) {
        if (context == null) {
            return null;
        }
        return prefs(context).getString(KEY_LAST_CALL_ID, null);
    }

    public static long getLastUpdate(Context context) {
        if (context == null) {
            return 0;
        }
        return prefs(context).getLong(KEY_TIMESTAMP, 0);
    }

    // -----------------------------------------------------------------------
    // Reset (Updated - includes video call)
    // -----------------------------------------------------------------------

    public static void reset(Context context) {
        Log.d(TAG, "******** RESET CALLED ********");

        // Clear memory state
        incomingVisible.set(false);
        voiceCall.set(false);
        videoCall.set(false);  // Added
        chat.set(false);
        currentCallId = null;

        // Clear SharedPreferences
        if (context != null) {
            prefs(context).edit().clear().apply();
            Log.d(TAG, "SharedPreferences cleared");
        }

        Log.d(TAG, "Reset complete");
    }

    // -----------------------------------------------------------------------
    // Cleanup (for destroy scenarios)
    // -----------------------------------------------------------------------

    public static void cleanup(Context context) {
        Log.d(TAG, "Cleanup called");
        reset(context);
    }

    // -----------------------------------------------------------------------
    // Debug Helpers (Updated - includes video call)
    // -----------------------------------------------------------------------

    public static void logState(Context context) {
        if (context == null) {
            Log.d(TAG, "Context is null, cannot log state");
            return;
        }

        String callId = getCurrentCallId(context);
        long lastUpdate = getLastUpdate(context);
        long age = System.currentTimeMillis() - lastUpdate;
        
        Log.d(TAG, "========== STATE DUMP ==========");
        Log.d(TAG, "incomingVisible: " + incomingVisible.get());
        Log.d(TAG, "voiceCall: " + voiceCall.get());
        Log.d(TAG, "videoCall: " + videoCall.get());  // Added
        Log.d(TAG, "chat: " + chat.get());
        Log.d(TAG, "currentCallId: " + callId);
        Log.d(TAG, "lastCallId: " + getLastCallId(context));
        Log.d(TAG, "lastUpdate: " + lastUpdate + " (" + age + "ms ago)");
        
        // SharedPreferences state
        SharedPreferences prefs = prefs(context);
        Log.d(TAG, "PREF incomingVisible: " + prefs.getBoolean(KEY_INCOMING, false));
        Log.d(TAG, "PREF voiceCall: " + prefs.getBoolean(KEY_VOICE, false));
        Log.d(TAG, "PREF videoCall: " + prefs.getBoolean(KEY_VIDEO, false));  // Added
        Log.d(TAG, "PREF chat: " + prefs.getBoolean(KEY_CHAT, false));
        Log.d(TAG, "PREF callId: " + prefs.getString(KEY_CALL_ID, "null"));
        Log.d(TAG, "=================================");
    }

    // -----------------------------------------------------------------------
    // Convenience Methods (Updated - includes video call)
    // -----------------------------------------------------------------------

    public static boolean hasActiveCall(Context context) {
        return isInVoiceCall(context) 
            || isInVideoCall(context)   // Added
            || isInChat(context) 
            || isIncomingVisible(context, null);
    }

    public static void clearAllState(Context context) {
        Log.d(TAG, "Clearing all state");
        reset(context);
    }
}