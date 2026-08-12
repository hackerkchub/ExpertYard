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
import android.graphics.Rect;
import android.view.View;
import android.view.ViewTreeObserver;
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
    private volatile int nativeKeyboardHeight = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        getWindow().setSoftInputMode(
            WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN
        );
        Log.d(TAG, "=====================================");
        Log.d(TAG, "onCreate - MainActivity Started");
        Log.d(TAG, "=====================================");

        // Setup real-time native IME keyboard height listener
        setupImeInsetDetector();

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

    private void setupImeInsetDetector() {
        try {
            final View decorView = getWindow().getDecorView();
            decorView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
                private int lastHeight = -1;

                @Override
                public void onGlobalLayout() {
                    try {
                        Rect r = new Rect();
                        decorView.getWindowVisibleDisplayFrame(r);
                        int screenHeight = decorView.getRootView().getHeight();
                        int keypadHeight = screenHeight - r.bottom;

                        // Threshold to distinguish keyboard from system navigation bar insets (> 15% screen height)
                        int calculatedImeHeight = 0;
                        if (keypadHeight > screenHeight * 0.15) {
                            calculatedImeHeight = keypadHeight;
                        }

                        if (calculatedImeHeight != lastHeight) {
                            lastHeight = calculatedImeHeight;
                            nativeKeyboardHeight = calculatedImeHeight;
                            Log.d(TAG, "[KEYBOARD_HEIGHT_DEBUG] Native IME Height changed: " + calculatedImeHeight + "px");

                            final String js = "window.dispatchEvent(new CustomEvent('nativeKeyboardHeightChange', { detail: { height: " + calculatedImeHeight + " } }));";
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    try {
                                        if (getBridge() != null && getBridge().getWebView() != null) {
                                            getBridge().getWebView().evaluateJavascript(js, null);
                                        }
                                    } catch (Exception err) {
                                        Log.e(TAG, "Error evaluating keyboard JS event", err);
                                    }
                                }
                            });
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Error in IME inset calculation", e);
                    }
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Error attaching IME inset detector", e);
        }
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
         * Dynamically switch native soft input mode (pan, resize, nothing)
         */
        @JavascriptInterface
        public void setSoftInputMode(final String mode) {
            if (mode == null) return;
            final String normalizedMode = mode.trim().toLowerCase(java.util.Locale.US);
            if (!"pan".equals(normalizedMode) && !"resize".equals(normalizedMode) && !"nothing".equals(normalizedMode)) {
                Log.w(TAG, "[KEYBOARD_MODE_DEBUG] setSoftInputMode ignored invalid mode: " + mode);
                return;
            }

            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        if ("nothing".equals(normalizedMode)) {
                            getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING);
                        } else if ("resize".equals(normalizedMode)) {
                            getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
                        } else {
                            getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
                        }

                        int currentModeFlags = getWindow().getAttributes().softInputMode;
                        int adjustMask = currentModeFlags & WindowManager.LayoutParams.SOFT_INPUT_MASK_ADJUST;
                        String activeAdjustStr = "UNKNOWN";
                        if (adjustMask == WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING) activeAdjustStr = "NOTHING";
                        else if (adjustMask == WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN) activeAdjustStr = "PAN";
                        else if (adjustMask == WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE) activeAdjustStr = "RESIZE";
                        else if (adjustMask == WindowManager.LayoutParams.SOFT_INPUT_ADJUST_UNSPECIFIED) activeAdjustStr = "UNSPECIFIED";

                        Log.d(TAG, "[KEYBOARD_MODE_DEBUG] Requested: " + mode + " | Normalized: " + normalizedMode + " | RawFlags: " + currentModeFlags + " | MaskedAdjust: " + activeAdjustStr);
                    } catch (Exception e) {
                        Log.e(TAG, "[KEYBOARD_MODE_DEBUG] Error setting soft input mode: " + mode, e);
                    }
                }
            });
        }

        /**
         * Query current active window adjust mode
         */
        @JavascriptInterface
        public String getActualSoftInputMode() {
            try {
                int flags = getWindow().getAttributes().softInputMode;
                int adjust = flags & WindowManager.LayoutParams.SOFT_INPUT_MASK_ADJUST;
                if (adjust == WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING) return "NOTHING";
                if (adjust == WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN) return "PAN";
                if (adjust == WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE) return "RESIZE";
                if (adjust == WindowManager.LayoutParams.SOFT_INPUT_ADJUST_UNSPECIFIED) return "UNSPECIFIED";
                return "RAW_" + adjust;
            } catch (Exception e) {
                return "ERROR";
            }
        }

        /**
         * Query DecorView location on screen to detect native window panning
         */
        @JavascriptInterface
        public String getDecorViewMetrics() {
            try {
                int[] loc = new int[2];
                getWindow().getDecorView().getLocationOnScreen(loc);
                int top = loc[1];
                int left = loc[0];
                int height = getWindow().getDecorView().getHeight();
                int bottom = top + height;
                return "top:" + top + "|btm:" + bottom + "|h:" + height + "|l:" + left;
            } catch (Exception e) {
                return "ERROR";
            }
        }

        /**
         * Query real-time native IME keyboard height in pixels
         */
        @JavascriptInterface
        public int getNativeKeyboardHeight() {
            return nativeKeyboardHeight;
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