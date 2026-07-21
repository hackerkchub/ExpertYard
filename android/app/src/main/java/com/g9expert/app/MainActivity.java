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
        
        Log.d(TAG, "=====================================");
        Log.d(TAG, "onCreate - MainActivity Started");
        Log.d(TAG, "=====================================");

        // 1. Initialize NativeBridgeManager
        initializeBridgeManager();

        // 2. Inject APP_TYPE and NativeBridge interface
        injectNativeBridgeInterface();

        // 3. Handle incoming intent (e.g. from notification accept action)
        handleIntent(getIntent());

        // 4. Dispatch pending call (state machine handles duplicate)
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
        
        // Handle incoming intent (e.g. from notification accept action)
        handleIntent(intent);
        
        // Dispatch pending call (state machine handles duplicate)
        dispatchPendingCall();
    }

    private void handleIntent(Intent intent) {
        if (intent == null) return;
        
        String action = intent.getAction();
        boolean nativeAccept = intent.getBooleanExtra("native_accept", false);
        boolean nativeView = intent.getBooleanExtra("native_view", false);
        
        Log.d(TAG, "handleIntent - Action: " + action + ", NativeAccept: " + nativeAccept + ", NativeView: " + nativeView);
        
        if ("ACTION_ACCEPT_CALL".equals(action) || nativeAccept) {
            String callId = intent.getStringExtra("call_id");
            String callerName = intent.getStringExtra("caller_name");
            String callType = intent.getStringExtra("call_type");
            String targetUrl = intent.getStringExtra("target_url");
            if (targetUrl == null || targetUrl.isEmpty()) {
                targetUrl = intent.getStringExtra("targetUrl");
            }
            String userId = intent.getStringExtra("user_id");
            String expertId = intent.getStringExtra("expert_id");
            
            Log.d(TAG, "MainActivity handleIntent: ACTION_ACCEPT_CALL for CallId: " + callId + ", TargetUrl: " + targetUrl);
            
            // Execute accept logic directly inside MainActivity context
            IncomingCallReceiver.performAcceptLogic(this, callId, callerName, callType, targetUrl, userId, expertId);
        } else if ("ACTION_VIEW_CALL".equals(action) || nativeView) {
            String callId = intent.getStringExtra("call_id");
            String callerName = intent.getStringExtra("caller_name");
            String callType = intent.getStringExtra("call_type");
            String targetUrl = intent.getStringExtra("target_url");
            if (targetUrl == null || targetUrl.isEmpty()) {
                targetUrl = intent.getStringExtra("targetUrl");
            }
            String userId = intent.getStringExtra("user_id");
            String expertId = intent.getStringExtra("expert_id");
            
            Log.d(TAG, "MainActivity handleIntent: ACTION_VIEW_CALL for CallId: " + callId + ", TargetUrl: " + targetUrl);
            
            // Execute view logic directly inside MainActivity context (stops ringtone and opens app)
            IncomingCallReceiver.performViewLogic(this, callId, callerName, callType, targetUrl, userId, expertId);
        }
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

            // Add JavascriptInterface for NativeBridge immediately
            webView.addJavascriptInterface(new NativeBridgeInterface(), "NativeBridgeManager_Native");
            Log.d(TAG, "✅ NativeBridgeManager JavascriptInterface added");

            // Wrap BridgeWebViewClient to re-inject wrapper JS on page finished
            webView.setWebViewClient(new com.getcapacitor.BridgeWebViewClient(getBridge()) {
                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    Log.d(TAG, "🌐 WebView onPageFinished - re-injecting NativeBridgeManager wrapper JS: " + url);
                    performJsInjection(view);
                    dispatchPendingCall();
                }
            });

            // Perform initial JS injection
            performJsInjection(webView);

        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to inject NativeBridge interface", e);
        }
    }

    private void performJsInjection(WebView webView) {
        if (webView == null) return;
        try {
            String appType = getAppType();
            String js = "window.G9_APP_TYPE='" + appType + "';";
            webView.evaluateJavascript(js, null);

            String wrapperJs = 
                "if (!window.NativeBridgeManager) {" +
                "  window.NativeBridgeManager = {" +
                "    _native: window.NativeBridgeManager_Native," +
                "    onReactReadyForCall: function(callId) {" +
                "      if (window.NativeBridgeManager_Native) { window.NativeBridgeManager_Native.onReactReadyForCall(callId); }" +
                "    }," +
                "    notifyReactReady: function() {" +
                "      if (window.NativeBridgeManager_Native) { window.NativeBridgeManager_Native.notifyReactReady(); }" +
                "    }," +
                "    onReactReady: function() {" +
                "      if (window.NativeBridgeManager_Native) { window.NativeBridgeManager_Native.onReactReady(); }" +
                "    }," +
                "    getState: function() {" +
                "      return window.NativeBridgeManager_Native ? window.NativeBridgeManager_Native.getState() : '';" +
                "    }," +
                "    openAppSettings: function() {" +
                "      if (window.NativeBridgeManager_Native) { window.NativeBridgeManager_Native.openAppSettings(); }" +
                "    }," +
                "    terminateNativeSession: function(callId) {" +
                "      if (window.NativeBridgeManager_Native) { window.NativeBridgeManager_Native.terminateNativeSession(callId); }" +
                "    }" +
                "  };" +
                "}" +
                "console.log('[G9] NativeBridgeManager JS wrapper active');";
            webView.evaluateJavascript(wrapperJs, null);
            Log.d(TAG, "✅ NativeBridgeManager JavaScript wrapper injected into WebView");
        } catch (Exception e) {
            Log.e(TAG, "❌ performJsInjection error", e);
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
         * Called by React when app is fully mounted and ready to route (primary name)
         */
        @JavascriptInterface
        public void onReactReady() {
            Log.d(TAG, "=====================================");
            Log.d(TAG, "🚀 React called onReactReady");
            Log.d(TAG, "Thread: " + Thread.currentThread().getName());
            Log.d(TAG, "=====================================");
            
            // Set React ready and trigger any deferred dispatch
            NativeBridgeManager.setReactReady(true);
            NativeBridgeManager.dispatchPendingCall();
        }

        /**
         * Called by React when app is fully mounted and ready to route
         */
        @JavascriptInterface
        public void notifyReactReady() {
            Log.d(TAG, "=====================================");
            Log.d(TAG, "🚀 React called notifyReactReady");
            Log.d(TAG, "Thread: " + Thread.currentThread().getName());
            Log.d(TAG, "=====================================");
            
            // Set React ready and trigger any deferred dispatch
            NativeBridgeManager.setReactReady(true);
            NativeBridgeManager.dispatchPendingCall();
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

        /**
         * Terminate the native call session programmatically from React
         */
        @JavascriptInterface
        public void terminateNativeSession(String callId) {
            Log.d(TAG, "📞 terminateNativeSession called from JS bridge for callId: " + callId);
            NativeBridgeManager.terminateNativeSession(callId);
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