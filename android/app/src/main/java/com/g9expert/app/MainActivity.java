package com.g9expert.app;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.media.AudioManager;
import android.os.Bundle;
import android.util.Log;

import com.getcapacitor.BridgeActivity;
import android.content.Intent;

import com.g9expert.app.call.CallStore;
import org.json.JSONObject;
// import com.g9expert.app.plugins.NativeBridgePlugin;

public class MainActivity extends BridgeActivity {

    private boolean pendingCallDispatched = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d("APP_TYPE", "MainActivity Started");

        super.onCreate(savedInstanceState);
        // registerPlugin(NativeBridgePlugin.class);
        // Log.d("G9_PLUGIN", "NativeBridgePlugin Registered");

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
            Log.e("APP_TYPE", "Metadata Error", e);
        }

        Log.d("APP_TYPE", "APP TYPE = " + appType);

        final String finalType = appType;

        getBridge().getWebView().post(() -> {
            String js = "window.G9_APP_TYPE='" + finalType + "';";
            getBridge().getWebView().evaluateJavascript(js, null);
            Log.d("APP_TYPE", "Injected JS : " + js);
        });

    }

  @Override
protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);

    setIntent(intent);

    pendingCallDispatched = false;

    getBridge().getWebView().postDelayed(
            this::sendPendingCallToJS,
            300
    );
}

    private void sendPendingCallToJS() {

    if (pendingCallDispatched)
        return;

    if (getBridge() == null || getBridge().getWebView() == null) {
    Log.d("G9_CALL", "Bridge not ready");
    return;
}

    try {

        JSONObject call = CallStore.get(this);

        if (call == null) {
            Log.d("G9_CALL", "No pending call");
            return;
        }

        String script =
                "window.__NATIVE_INCOMING_CALL__=" + call.toString() + ";" +
                "window.dispatchEvent(new CustomEvent('nativeIncomingCall'));";

        getBridge().getWebView().post(() -> {

            getBridge().getWebView().evaluateJavascript(script, null);

            pendingCallDispatched = true;

            CallStore.clear(MainActivity.this);

            Log.d("G9_CALL", "Pending call sent to JS");

        });

    } catch (Exception e) {

        Log.e("G9_CALL", "Failed to send pending call", e);

    }
}
@Override
public  void onResume() {
    super.onResume();

    getBridge().getWebView().postDelayed(
            this::sendPendingCallToJS,
            800
    );
}
}