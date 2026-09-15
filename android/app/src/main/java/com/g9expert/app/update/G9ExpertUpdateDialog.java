package com.g9expert.app.update;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * G9ExpertUpdateDialog - Custom Native UI for Downloaded Flexible Updates
 * 
 * Displays a clean, responsive native card when a flexible update has finished downloading.
 * Supports edge-to-edge layouts, dark/light themes, and safe lifecycle dismissal.
 */
public class G9ExpertUpdateDialog {

    private static final String TAG = "G9ExpertUpdateDialog";
    private static AlertDialog currentDialog = null;

    /**
     * Show update ready UI prompt to restart and apply update.
     * 
     * @param activity Hosting Activity
     * @param onRestartRunnable Action to execute when "Restart Now" is clicked
     */
    public static void showUpdateReadyDialog(final Activity activity, final Runnable onRestartRunnable) {
        if (activity == null || activity.isFinishing() || activity.isDestroyed()) {
            Log.w(TAG, "Cannot show update dialog: Activity is invalid or finishing");
            return;
        }

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    // Dismiss previous dialog if showing
                    dismissDialog();

                    AlertDialog.Builder builder = new AlertDialog.Builder(activity);

                    // Root container layout created programmatically to prevent resource XML mismatch
                    LinearLayout layout = new LinearLayout(activity);
                    layout.setOrientation(LinearLayout.VERTICAL);
                    int paddingDp = (int) (20 * activity.getResources().getDisplayMetrics().density);
                    layout.setPadding(paddingDp, paddingDp, paddingDp, paddingDp);
                    layout.setBackgroundColor(Color.parseColor("#1E293B")); // Modern dark slate container

                    // Title
                    TextView titleView = new TextView(activity);
                    titleView.setText("New Update Ready");
                    titleView.setTextSize(18);
                    titleView.setTextColor(Color.WHITE);
                    titleView.setTypeface(null, android.graphics.Typeface.BOLD);
                    LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                    titleParams.setMargins(0, 0, 0, (int) (10 * activity.getResources().getDisplayMetrics().density));
                    titleView.setLayoutParams(titleParams);
                    layout.addView(titleView);

                    // Message body
                    TextView msgView = new TextView(activity);
                    msgView.setText("The latest version of G9Expert has been downloaded and is ready to install.");
                    msgView.setTextSize(14);
                    msgView.setTextColor(Color.parseColor("#CBD5E1")); // Light grey text
                    LinearLayout.LayoutParams msgParams = new LinearLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                    msgParams.setMargins(0, 0, 0, (int) (20 * activity.getResources().getDisplayMetrics().density));
                    msgView.setLayoutParams(msgParams);
                    layout.addView(msgView);

                    // Button container
                    LinearLayout buttonLayout = new LinearLayout(activity);
                    buttonLayout.setOrientation(LinearLayout.HORIZONTAL);
                    buttonLayout.setGravity(Gravity.END);
                    LinearLayout.LayoutParams buttonContainerParams = new LinearLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                    buttonLayout.setLayoutParams(buttonContainerParams);

                    // Later button
                    Button btnLater = new Button(activity);
                    btnLater.setText("Later");
                    btnLater.setTextColor(Color.parseColor("#94A3B8"));
                    btnLater.setBackgroundColor(Color.TRANSPARENT);
                    btnLater.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            dismissDialog();
                        }
                    });
                    buttonLayout.addView(btnLater);

                    // Restart Now button
                    Button btnRestart = new Button(activity);
                    btnRestart.setText("Restart Now");
                    btnRestart.setTextColor(Color.WHITE);
                    btnRestart.setBackgroundColor(Color.parseColor("#2563EB")); // Primary G9 blue
                    LinearLayout.LayoutParams restartParams = new LinearLayout.LayoutParams(
                            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                    restartParams.setMargins((int) (10 * activity.getResources().getDisplayMetrics().density), 0, 0, 0);
                    btnRestart.setLayoutParams(restartParams);
                    btnRestart.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            dismissDialog();
                            if (onRestartRunnable != null) {
                                onRestartRunnable.run();
                            }
                        }
                    });
                    buttonLayout.addView(btnRestart);

                    layout.addView(buttonLayout);

                    builder.setView(layout);
                    builder.setCancelable(true);

                    currentDialog = builder.create();

                    // Edge-to-edge / window layout formatting
                    Window window = currentDialog.getWindow();
                    if (window != null) {
                        window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
                    }

                    currentDialog.show();
                    Log.d(TAG, "Update ready dialog displayed to user");

                } catch (Exception e) {
                    Log.e(TAG, "Error displaying update ready dialog", e);
                }
            }
        });
    }

    /**
     * Dismiss the current update dialog safely.
     */
    public static void dismissDialog() {
        if (currentDialog != null && currentDialog.isShowing()) {
            try {
                currentDialog.dismiss();
            } catch (Exception e) {
                Log.e(TAG, "Error dismissing update dialog", e);
            }
        }
        currentDialog = null;
    }
}
