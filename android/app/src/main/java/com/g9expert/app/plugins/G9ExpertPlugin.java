package com.g9expert.app.plugins;

import android.content.Context;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.g9expert.app.BuildConfig;

@CapacitorPlugin(name = "G9Expert")
public class G9ExpertPlugin extends Plugin {

    @PluginMethod
    public void getInfo(PluginCall call) {

        Context context = getContext();

        JSObject result = new JSObject();

        // Temporary (Phase-1)
        result.put("appType", "web");

        result.put("packageName", context.getPackageName());

        result.put("applicationId", BuildConfig.APPLICATION_ID);

        result.put("versionName", BuildConfig.VERSION_NAME);

        result.put("versionCode", BuildConfig.VERSION_CODE);

        result.put("buildType", BuildConfig.BUILD_TYPE);

        result.put("debug", BuildConfig.DEBUG);

        call.resolve(result);
    }
}