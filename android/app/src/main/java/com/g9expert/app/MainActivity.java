package com.g9expert.app;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.content.Intent;

import com.getcapacitor.BridgeActivity;
import com.g9expert.app.bridge.NativeBridgeManager;
import android.view.WindowManager; 
/**
 * MainActivity - Production-Ready Implementation
 * 
 * Responsibilities:
 * - Initialize NativeBridgeManager
 * - Inject APP_TYPE and NativeBridge interface into WebView
 * - Dispatch pending call via state machine
 * - NO polling, NO timers, NO React detection
 * - React calls NativeBridgeInterface.onReactReadyForCall()
 */
public class MainActivity extends BridgeActivity {

    private static final String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
         getWindow().setSoftInputMode(
        WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE
    );
        Log.d(TAG, "=====================================");
        Log.d(TAG, "onCreate - MainActivity Started");
        Log.d(TAG, "=====================================");

        // 1. Initialize NativeBridgeManager
        initializeBridgeManager();

        // 2. Inject APP_TYPE and NativeBridge interface
        injectNativeBridgeInterface();

        // 3. Dispatch pending call (state machine handles duplicate)
        dispatchPendingCall();

        Log.d(TAG, "onCreate - MainActivity initialization complete");
    }

    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG, "onResume - Activity resumed");
        
        // Dispatch pending call (state machine handles duplicate)
        dispatchPendingCall();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        Log.d(TAG, "onNewIntent - New intent received");
        
        // Dispatch pending call (state machine handles duplicate)
        dispatchPendingCall();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "onDestroy - Cleaning up");
        
        // Only clean up bridge reference, NEVER clear CallStore
        NativeBridgeManager.destroy();
    }

    /*
     * =====================================================
     * Initialization Methods
     * =====================================================
     */

    /**
     * Initialize NativeBridgeManager with bridge and context
     */
    private void initializeBridgeManager() {
        try {
            NativeBridgeManager.initialize(getBridge(), this);
            Log.d(TAG, "✅ NativeBridgeManager initialized successfully");
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to initialize NativeBridgeManager", e);
        }
    }

    /**
     * Inject APP_TYPE and NativeBridge interface into WebView
     * This creates a Java-to-JavaScript bridge
     */
    private void injectNativeBridgeInterface() {
        WebView webView = getBridge() != null ? getBridge().getWebView() : null;
        if (webView == null) {
            Log.w(TAG, "WebView not available, cannot inject interface");
            return;
        }

        try {
            webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
            Log.d(TAG, "✅ Disabled user gesture requirement for media playback");

            // Inject APP_TYPE
            String appType = getAppType();
            String js = "window.G9_APP_TYPE='" + appType + "';";
            webView.evaluateJavascript(js, null);
            Log.d(TAG, "✅ APP_TYPE injected: " + js);

            // Add JavascriptInterface for NativeBridge
            webView.addJavascriptInterface(new NativeBridgeInterface(), "NativeBridgeManager");
            Log.d(TAG, "✅ NativeBridgeManager JavascriptInterface added");

            // Also inject a JavaScript wrapper for backward compatibility
            String wrapperJs = 
                "if (!window.NativeBridgeManager) {" +
                "  window.NativeBridgeManager = {" +
                "    onReactReadyForCall: function(callId) {" +
                "      if (window.NativeBridgeManager && window.NativeBridgeManager._native) {" +
                "        window.NativeBridgeManager._native.onReactReadyForCall(callId);" +
                "      }" +
                "    }" +
                "  };" +
                "}";
            webView.evaluateJavascript(wrapperJs, null);
            Log.d(TAG, "✅ NativeBridgeManager JavaScript wrapper injected");

        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to inject NativeBridge interface", e);
        }
    }

    /**
     * Get APP_TYPE from AndroidManifest
     */
    private String getAppType() {
        String appType = "web";
        try {
            ApplicationInfo ai = getPackageManager().getApplicationInfo(
                    getPackageName(),
                    PackageManager.GET_META_DATA
            );
            if (ai.metaData != null) {
                appType = ai.metaData.getString("APP_TYPE", "web");
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to read APP_TYPE metadata", e);
        }
        return appType;
    }

    /**
     * Dispatch pending call - state machine handles duplicate
     */
    private void dispatchPendingCall() {
        Log.d(TAG, "=====================================");
        Log.d(TAG, "DISPATCH PENDING CALL");
        Log.d(TAG, "State: " + NativeBridgeManager.getState());
        Log.d(TAG, "=====================================");
        
        NativeBridgeManager.dispatchPendingCall();
    }

    /*
     * =====================================================
     * NativeBridgeInterface - JavascriptInterface
     * =====================================================
     */
    
    /**
     * NativeBridge Interface for React to call Java methods
     * This is exposed to JavaScript via addJavascriptInterface
     */
    public class NativeBridgeInterface {
        
        /**
         * Called by React when VoiceCall/VideoCall mounts
         * This confirms React opened the call page
         */
        @JavascriptInterface
        public void onReactReadyForCall(String callId) {
            Log.d(TAG, "=====================================");
            Log.d(TAG, "📞 React called onReactReadyForCall");
            Log.d(TAG, "CallId: " + callId);
            Log.d(TAG, "Thread: " + Thread.currentThread().getName());
            Log.d(TAG, "=====================================");
            
            // Delegate to NativeBridgeManager
            NativeBridgeManager.onReactReadyForCall(callId);
        }
        
        /**
         * Get current state for debugging
         */
        @JavascriptInterface
        public String getState() {
            return "State: " + NativeBridgeManager.getState() +
                   ", CallId: " + NativeBridgeManager.getPendingCallId() +
                   ", DispatchId: " + NativeBridgeManager.getDispatchId();
        }

        /**
         * Open Android system app settings for permission management
         */
        @JavascriptInterface
        public void openAppSettings() {
            Log.d(TAG, "📞 openAppSettings called from JS bridge");
            try {
                Intent intent = new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                intent.setData(android.net.Uri.parse("package:" + getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            } catch (Exception e) {
                Log.e(TAG, "❌ Failed to open app settings from bridge", e);
            }
        }
    }

    /*
     * =====================================================
     * Debug/Utility Methods
     * =====================================================
     */

    /**
     * Get the current state of NativeBridgeManager
     */
    public String getBridgeState() {
        return "State: " + NativeBridgeManager.getState() +
               ", CallId: " + NativeBridgeManager.getPendingCallId() +
               ", DispatchId: " + NativeBridgeManager.getDispatchId();
    }
}