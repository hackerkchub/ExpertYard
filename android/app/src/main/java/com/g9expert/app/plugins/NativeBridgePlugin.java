package com.g9expert.app.plugins;

import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.g9expert.app.call.CallStore;

import org.json.JSONObject;

@CapacitorPlugin(name = "NativeBridge")
public class NativeBridgePlugin extends Plugin {

    private static final String TAG = "NativeBridge";

    @PluginMethod
    public void getPendingIncomingCall(PluginCall call) {
        JSObject result = new JSObject();

        try {
            JSONObject pendingCall = CallStore.get(getContext());

            if (pendingCall == null) {
                result.put("hasCall", false);
                call.resolve(result);
                return;
            }

            result.put("hasCall", true);
            result.put("callId", pendingCall.optString("callId", ""));
            result.put("callerName", pendingCall.optString("callerName", ""));
            result.put("callType", pendingCall.optString("callType", "audio"));
            result.put("targetUrl", pendingCall.optString("targetUrl", ""));
            result.put("native", true);

            // ✅ Problem 1 Fixed: DO NOT clear here
            // React will call clearPendingIncomingCall() after successful navigation
            // CallStore.clear(getContext()); // REMOVED

            call.resolve(result);

        } catch (Exception e) {
            // ✅ Problem 4: Added proper logging
            Log.e(TAG, "Pending call read failed", e);
            result.put("hasCall", false);
            result.put("error", e.getMessage());
            call.resolve(result);
        }
    }

    // ✅ Problem 2: New method to clear pending call
    @PluginMethod
    public void clearPendingIncomingCall(PluginCall call) {
        try {
            CallStore.clear(getContext());
            JSObject result = new JSObject();
            result.put("success", true);
            call.resolve(result);
            Log.d(TAG, "Pending call cleared successfully");
        } catch (Exception e) {
            Log.e(TAG, "Failed to clear pending call", e);
            JSObject result = new JSObject();
            result.put("success", false);
            result.put("error", e.getMessage());
            call.resolve(result);
        }
    }

    // ✅ Problem 3: Fast check method
    @PluginMethod
    public void hasPendingIncomingCall(PluginCall call) {
        JSObject result = new JSObject();

        try {
            boolean hasCall = CallStore.hasPendingCall(getContext());
            result.put("hasCall", hasCall);
            call.resolve(result);
            Log.d(TAG, "Has pending call: " + hasCall);
        } catch (Exception e) {
            Log.e(TAG, "Failed to check pending call", e);
            result.put("hasCall", false);
            result.put("error", e.getMessage());
            call.resolve(result);
        }
    }
}