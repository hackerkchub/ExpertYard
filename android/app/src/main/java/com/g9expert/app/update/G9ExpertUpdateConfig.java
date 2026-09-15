package com.g9expert.app.update;

import android.util.Log;

import com.g9expert.app.BuildConfig;
import com.google.android.play.core.appupdate.AppUpdateInfo;

/**
 * G9ExpertUpdateConfig - Centralized Configuration for Google Play In-App Updates
 * 
 * Provides production-ready controls for update checking frequency, mode selection
 * (FLEXIBLE vs IMMEDIATE), debug logging, and version enforcement.
 */
public class G9ExpertUpdateConfig {

    private static final String TAG = "G9ExpertUpdateConfig";

    public enum UpdateMode {
        FLEXIBLE,
        IMMEDIATE
    }

    // Master switch for in-app updates
    private static boolean enabled = true;

    // Default update mode: FLEXIBLE unless critical update is configured
    private static UpdateMode defaultUpdateMode = UpdateMode.FLEXIBLE;

    // Check for updates automatically on app startup
    private static boolean checkOnLaunch = true;

    // Allow flexible background updates
    private static boolean allowFlexible = true;

    // Allow immediate full-screen updates
    private static boolean allowImmediate = true;

    // Show debug logs (defaults to BuildConfig.DEBUG)
    private static boolean showDebugLogs = BuildConfig.DEBUG;

    // Minimum required versionCode. If installed < minAllowedVersionCode, force IMMEDIATE update.
    private static int minAllowedVersionCode = 0;

    // Update priority threshold (0-5 scale from Google Play Console).
    // Updates with priority >= this threshold will automatically trigger IMMEDIATE mode.
    private static int updatePriorityImmediateThreshold = 4;

    /*
     * =====================================================
     * Helper / Business Logic Methods
     * =====================================================
     */

    /**
     * Determines effective update mode for an available update.
     * 
     * @param appUpdateInfo Play Core AppUpdateInfo object
     * @param installedVersionCode Version code currently running
     * @return Effective UpdateMode (IMMEDIATE or FLEXIBLE)
     */
    public static UpdateMode getEffectiveUpdateMode(AppUpdateInfo appUpdateInfo, int installedVersionCode) {
        // 1. Mandatory version enforcement: if installed version is below minimum allowed, force IMMEDIATE
        if (minAllowedVersionCode > 0 && installedVersionCode < minAllowedVersionCode) {
            if (showDebugLogs) {
                Log.d(TAG, "[UpdateConfig] Forcing IMMEDIATE update: installedVersionCode (" + 
                        installedVersionCode + ") < minAllowedVersionCode (" + minAllowedVersionCode + ")");
            }
            return UpdateMode.IMMEDIATE;
        }

        // 2. High priority update from Play Console (priority >= threshold)
        if (appUpdateInfo != null && appUpdateInfo.updatePriority() >= updatePriorityImmediateThreshold) {
            if (showDebugLogs) {
                Log.d(TAG, "[UpdateConfig] Elevating to IMMEDIATE update due to Play Console priority: " + 
                        appUpdateInfo.updatePriority() + " >= " + updatePriorityImmediateThreshold);
            }
            return UpdateMode.IMMEDIATE;
        }

        // 3. Fallback to default configured update mode
        return defaultUpdateMode;
    }

    /*
     * =====================================================
     * Getters and Setters
     * =====================================================
     */

    public static boolean isEnabled() {
        return enabled;
    }

    public static void setEnabled(boolean value) {
        enabled = value;
    }

    public static UpdateMode getDefaultUpdateMode() {
        return defaultUpdateMode;
    }

    public static void setDefaultUpdateMode(UpdateMode mode) {
        if (mode != null) {
            defaultUpdateMode = mode;
        }
    }

    public static boolean isCheckOnLaunch() {
        return checkOnLaunch;
    }

    public static void setCheckOnLaunch(boolean value) {
        checkOnLaunch = value;
    }

    public static boolean isAllowFlexible() {
        return allowFlexible;
    }

    public static void setAllowFlexible(boolean value) {
        allowFlexible = value;
    }

    public static boolean isAllowImmediate() {
        return allowImmediate;
    }

    public static void setAllowImmediate(boolean value) {
        allowImmediate = value;
    }

    public static boolean isShowDebugLogs() {
        return showDebugLogs;
    }

    public static void setShowDebugLogs(boolean value) {
        showDebugLogs = value;
    }

    public static int getMinAllowedVersionCode() {
        return minAllowedVersionCode;
    }

    public static void setMinAllowedVersionCode(int versionCode) {
        minAllowedVersionCode = versionCode;
    }

    public static int getUpdatePriorityImmediateThreshold() {
        return updatePriorityImmediateThreshold;
    }

    public static void setUpdatePriorityImmediateThreshold(int threshold) {
        updatePriorityImmediateThreshold = threshold;
    }
}
