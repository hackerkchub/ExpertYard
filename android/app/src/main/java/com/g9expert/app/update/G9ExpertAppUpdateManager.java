package com.g9expert.app.update;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.g9expert.app.BuildConfig;
import com.getcapacitor.BridgeActivity;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.appupdate.AppUpdateOptions;
import com.google.android.play.core.install.InstallState;
import com.google.android.play.core.install.InstallStateUpdatedListener;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.InstallStatus;
import com.google.android.play.core.install.model.UpdateAvailability;

import org.json.JSONObject;

/**
 * G9ExpertAppUpdateManager - Singleton Core Manager for Google Play In-App Updates
 * 
 * Manages official Google Play Core In-App Update checking, immediate/flexible flows,
 * resume/interrupted state recovery, and clean WebView JS bridge reporting.
 */
public class G9ExpertAppUpdateManager {

    private static final String TAG = "G9ExpertAppUpdateManager";
    public static final int REQUEST_CODE_IN_APP_UPDATE = 9001;

    private static G9ExpertAppUpdateManager instance;

    private AppUpdateManager appUpdateManager;
    private InstallStateUpdatedListener installStateUpdatedListener;

    private boolean isChecking = false;
    private boolean isFlowActive = false;

    private int currentInstallStatus = InstallStatus.UNKNOWN;
    private int lastAvailableVersionCode = 0;
    private G9ExpertUpdateConfig.UpdateMode activeUpdateMode = G9ExpertUpdateConfig.UpdateMode.FLEXIBLE;
    private String lastErrorMessage = "";

    private G9ExpertAppUpdateManager() {
        // Private constructor for singleton pattern
    }

    public static synchronized G9ExpertAppUpdateManager getInstance() {
        if (instance == null) {
            instance = new G9ExpertAppUpdateManager();
        }
        return instance;
    }

    /**
     * Initialize AppUpdateManager instance with Context.
     */
    public void init(Context context) {
        if (context == null) return;
        try {
            if (appUpdateManager == null) {
                appUpdateManager = AppUpdateManagerFactory.create(context.getApplicationContext());
                Log.d(TAG, "✅ AppUpdateManager initialized for package: " + context.getPackageName());
            }
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to initialize AppUpdateManager", e);
        }
    }

    /**
     * Perform update check on application startup.
     * Silently handles errors if Play Store or internet is unavailable.
     * 
     * @param activity Hosting Activity
     */
    public void checkForUpdate(final Activity activity) {
        if (!G9ExpertUpdateConfig.isEnabled()) {
            if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                Log.d(TAG, "[CheckForUpdate] Skipped: G9ExpertUpdateConfig is disabled");
            }
            return;
        }

        if (activity == null || activity.isFinishing()) {
            return;
        }

        init(activity);

        if (appUpdateManager == null) {
            Log.w(TAG, "AppUpdateManager not initialized");
            return;
        }

        if (isChecking) {
            if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                Log.d(TAG, "[CheckForUpdate] Skip: Update check already in progress");
            }
            return;
        }

        isChecking = true;
        if (G9ExpertUpdateConfig.isShowDebugLogs()) {
            Log.d(TAG, "[G9Expert Update] Checking Play Store update for package: " + activity.getPackageName() + "...");
        }

        try {
            appUpdateManager.getAppUpdateInfo()
                .addOnSuccessListener(new OnSuccessListener<AppUpdateInfo>() {
                    @Override
                    public void onSuccess(AppUpdateInfo appUpdateInfo) {
                        isChecking = false;
                        handleUpdateInfoSuccess(activity, appUpdateInfo);
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(Exception e) {
                        isChecking = false;
                        lastErrorMessage = e.getMessage() != null ? e.getMessage() : "Unknown update check error";
                        if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                            Log.d(TAG, "[G9Expert Update] Update check failed or Play Store unavailable (silent pass): " + lastErrorMessage);
                        }
                        dispatchUpdateStateToWebView(activity);
                    }
                });
        } catch (Exception e) {
            isChecking = false;
            Log.e(TAG, "Exception during getAppUpdateInfo call", e);
        }
    }

    /**
     * Process successful AppUpdateInfo result from Play Core.
     */
    private void handleUpdateInfoSuccess(final Activity activity, AppUpdateInfo appUpdateInfo) {
        if (appUpdateInfo == null) return;

        int availability = appUpdateInfo.updateAvailability();
        lastAvailableVersionCode = appUpdateInfo.availableVersionCode();
        currentInstallStatus = appUpdateInfo.installStatus();

        if (G9ExpertUpdateConfig.isShowDebugLogs()) {
            Log.d(TAG, "[G9Expert Update] Availability: " + availability + 
                    ", Available VersionCode: " + lastAvailableVersionCode + 
                    ", Installed VersionCode: " + BuildConfig.VERSION_CODE + 
                    ", InstallStatus: " + currentInstallStatus);
        }

        // 1. If an immediate update is already in progress, resume it immediately
        if (availability == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS) {
            if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                Log.d(TAG, "[G9Expert Update] Resuming in-progress IMMEDIATE update flow");
            }
            startImmediateUpdateFlow(activity, appUpdateInfo);
            return;
        }

        // 2. If a flexible update has already completed download, present the restart UI
        if (currentInstallStatus == InstallStatus.DOWNLOADED) {
            if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                Log.d(TAG, "[G9Expert Update] Flexible update downloaded and ready to install");
            }
            promptUserToCompleteUpdate(activity);
            dispatchUpdateStateToWebView(activity);
            return;
        }

        // 3. New update is available
        if (availability == UpdateAvailability.UPDATE_AVAILABLE) {
            if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                Log.d(TAG, "[G9Expert Update] Update available: true");
            }

            activeUpdateMode = G9ExpertUpdateConfig.getEffectiveUpdateMode(appUpdateInfo, BuildConfig.VERSION_CODE);

            if (activeUpdateMode == G9ExpertUpdateConfig.UpdateMode.IMMEDIATE && 
                    G9ExpertUpdateConfig.isAllowImmediate() && 
                    appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                
                if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                    Log.d(TAG, "[G9Expert Update] Immediate allowed: true. Launching IMMEDIATE update flow...");
                }
                startImmediateUpdateFlow(activity, appUpdateInfo);

            } else if (G9ExpertUpdateConfig.isAllowFlexible() && 
                    appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {

                if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                    Log.d(TAG, "[G9Expert Update] Flexible allowed: true. Launching FLEXIBLE update flow...");
                }
                startFlexibleUpdateFlow(activity, appUpdateInfo);

            } else {
                Log.w(TAG, "[G9Expert Update] Available update mode (" + activeUpdateMode + ") not allowed or supported by Play Core");
            }

        } else {
            if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                Log.d(TAG, "[G9Expert Update] Update available: false");
            }
        }

        dispatchUpdateStateToWebView(activity);
    }

    /**
     * Start Google Play Immediate Update Flow.
     */
    private void startImmediateUpdateFlow(Activity activity, AppUpdateInfo appUpdateInfo) {
        if (isFlowActive || activity == null || activity.isFinishing()) return;
        try {
            isFlowActive = true;
            AppUpdateOptions options = AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build();
            appUpdateManager.startUpdateFlowForResult(appUpdateInfo, activity, options, REQUEST_CODE_IN_APP_UPDATE);
        } catch (Exception e) {
            isFlowActive = false;
            Log.e(TAG, "Error starting immediate update flow", e);
        }
    }

    /**
     * Start Google Play Flexible Update Flow.
     */
    private void startFlexibleUpdateFlow(final Activity activity, AppUpdateInfo appUpdateInfo) {
        if (isFlowActive || activity == null || activity.isFinishing()) return;
        try {
            isFlowActive = true;
            registerInstallStateListener(activity);

            AppUpdateOptions options = AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build();
            appUpdateManager.startUpdateFlowForResult(appUpdateInfo, activity, options, REQUEST_CODE_IN_APP_UPDATE);
        } catch (Exception e) {
            isFlowActive = false;
            Log.e(TAG, "Error starting flexible update flow", e);
        }
    }

    /**
     * Register listener to track download & installation status for Flexible updates.
     */
    private synchronized void registerInstallStateListener(final Activity activity) {
        if (installStateUpdatedListener == null) {
            installStateUpdatedListener = new InstallStateUpdatedListener() {
                @Override
                public void onStateUpdate(InstallState state) {
                    if (state == null) return;

                    currentInstallStatus = state.installStatus();

                    if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                        Log.d(TAG, "[G9Expert Update] Install state change: " + currentInstallStatus + 
                                " (Bytes: " + state.bytesDownloaded() + "/" + state.totalBytesToDownload() + ")");
                    }

                    if (currentInstallStatus == InstallStatus.DOWNLOADED) {
                        if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                            Log.d(TAG, "[G9Expert Update] Update downloaded");
                        }
                        promptUserToCompleteUpdate(activity);
                    } else if (currentInstallStatus == InstallStatus.INSTALLED) {
                        if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                            Log.d(TAG, "[G9Expert Update] Update installation completed");
                        }
                        unregisterInstallStateListener();
                    } else if (currentInstallStatus == InstallStatus.FAILED || 
                            currentInstallStatus == InstallStatus.CANCELED) {
                        isFlowActive = false;
                    }

                    dispatchUpdateStateToWebView(activity);
                }
            };
            appUpdateManager.registerListener(installStateUpdatedListener);
            if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                Log.d(TAG, "Registered InstallStateUpdatedListener");
            }
        }
    }

    /**
     * Unregister InstallStateUpdatedListener to prevent leaks.
     */
    public synchronized void unregisterInstallStateListener() {
        if (appUpdateManager != null && installStateUpdatedListener != null) {
            try {
                appUpdateManager.unregisterListener(installStateUpdatedListener);
                if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                    Log.d(TAG, "Unregistered InstallStateUpdatedListener");
                }
            } catch (Exception e) {
                Log.e(TAG, "Error unregistering install state listener", e);
            }
            installStateUpdatedListener = null;
        }
    }

    /**
     * Handle activity lifecycle onResume.
     * Re-checks update state to resume interrupted immediate flows or show downloaded prompt.
     */
    public void handleResume(final Activity activity) {
        if (!G9ExpertUpdateConfig.isEnabled() || activity == null || activity.isFinishing()) return;

        init(activity);
        if (appUpdateManager == null) return;

        try {
            appUpdateManager.getAppUpdateInfo().addOnSuccessListener(new OnSuccessListener<AppUpdateInfo>() {
                @Override
                public void onSuccess(AppUpdateInfo appUpdateInfo) {
                    if (appUpdateInfo == null) return;

                    currentInstallStatus = appUpdateInfo.installStatus();

                    if (appUpdateInfo.updateAvailability() == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS) {
                        if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                            Log.d(TAG, "[G9Expert Update] Resuming interrupted IMMEDIATE update flow in onResume");
                        }
                        startImmediateUpdateFlow(activity, appUpdateInfo);
                    } else if (currentInstallStatus == InstallStatus.DOWNLOADED) {
                        if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                            Log.d(TAG, "[G9Expert Update] Flexible update downloaded, showing UI prompt in onResume");
                        }
                        promptUserToCompleteUpdate(activity);
                    }
                    dispatchUpdateStateToWebView(activity);
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Error in handleResume update check", e);
        }
    }

    /**
     * Handle onActivityResult for update request code.
     */
    public void handleActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CODE_IN_APP_UPDATE) {
            isFlowActive = false;
            if (resultCode == Activity.RESULT_OK) {
                if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                    Log.d(TAG, "[G9Expert Update] Update flow completed successfully (RESULT_OK)");
                }
            } else if (resultCode == Activity.RESULT_CANCELED) {
                if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                    Log.d(TAG, "[G9Expert Update] User cancelled the update flow (RESULT_CANCELED)");
                }
            } else {
                if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                    Log.d(TAG, "[G9Expert Update] Update flow failed or was cancelled with resultCode: " + resultCode);
                }
            }
        }
    }

    /**
     * Complete flexible update by triggering Play Core restart & install.
     */
    public void completeUpdate() {
        if (appUpdateManager != null) {
            try {
                if (G9ExpertUpdateConfig.isShowDebugLogs()) {
                    Log.d(TAG, "[G9Expert Update] Calling appUpdateManager.completeUpdate() to install update...");
                }
                appUpdateManager.completeUpdate();
            } catch (Exception e) {
                Log.e(TAG, "Failed to execute completeUpdate()", e);
            }
        }
    }

    /**
     * Prompt user with native UI to complete downloaded update.
     */
    private void promptUserToCompleteUpdate(final Activity activity) {
        G9ExpertUpdateDialog.showUpdateReadyDialog(activity, new Runnable() {
            @Override
            public void run() {
                completeUpdate();
            }
        });
    }

    /**
     * Formats update status as JSON for JavaScript WebView consumption.
     */
    public String getUpdateStateJson() {
        try {
            JSONObject json = new JSONObject();
            json.put("enabled", G9ExpertUpdateConfig.isEnabled());
            json.put("currentVersionCode", BuildConfig.VERSION_CODE);
            json.put("currentVersionName", BuildConfig.VERSION_NAME);
            json.put("availableVersionCode", lastAvailableVersionCode);
            json.put("installStatus", currentInstallStatus);
            json.put("updateMode", activeUpdateMode.name());
            json.put("isChecking", isChecking);
            json.put("isFlowActive", isFlowActive);
            json.put("lastError", lastErrorMessage);
            return json.toString();
        } catch (Exception e) {
            return "{}";
        }
    }

    /**
     * Dispatch update state change event to JavaScript WebView if available.
     */
    public void dispatchUpdateStateToWebView(final Activity activity) {
        if (activity == null) return;
        try {
            final String jsonState = getUpdateStateJson();
            final String js = "window.dispatchEvent(new CustomEvent('g9AppUpdateStatus', { detail: " + jsonState + " }));";
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        if (activity instanceof BridgeActivity) {
                            BridgeActivity bridgeActivity = (BridgeActivity) activity;
                            if (bridgeActivity.getBridge() != null && bridgeActivity.getBridge().getWebView() != null) {
                                bridgeActivity.getBridge().getWebView().evaluateJavascript(js, null);
                            }
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Error evaluating JS update status event", e);
                    }
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Error in dispatchUpdateStateToWebView", e);
        }
    }
}
