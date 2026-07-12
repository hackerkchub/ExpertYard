package com.g9expert.app;

import android.app.KeyguardManager;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.Log;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageButton;
import android.widget.TextView;
import android.view.View;

import com.g9expert.app.CallRingtoneManager;
import com.g9expert.app.call.CallStore;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

import java.util.Locale;

public class IncomingCallActivity extends AppCompatActivity {
    private static final String TAG = "IncomingCall";
    private boolean handled = false;

    // Step 1: Declare views
    private TextView logoText;
    private TextView avatarText;
    private TextView callerName;
    private TextView callerSubtitle;
    private TextView callType;
    private ImageButton btnAccept;
    private ImageButton btnReject;
    private TextView countdownText;

    // Step 2: Timer variables
    private CountDownTimer countDownTimer;
    private static final long CALL_TIMEOUT = 30000;

    private String getInitials(String name) {
        if (name == null) return "?";
        name = name.trim();
        if (name.isEmpty()) return "?";

        String[] parts = name.split("\\s+");

        if (parts.length == 1) {
            return parts[0].substring(0, 1).toUpperCase();
        }

        return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
    }

    private void disableButtons() {
        btnAccept.setEnabled(false);
        btnReject.setEnabled(false);
    }

    // ✅ 2. Keep for future reconnect
    private void enableButtons() {
        btnAccept.setEnabled(true);
        btnReject.setEnabled(true);
    }

    // Step 5: Countdown timer method
    private void startCountdown() {
        countDownTimer = new CountDownTimer(CALL_TIMEOUT, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                long sec = millisUntilFinished / 1000;
                countdownText.setText(
                    String.format(
                        Locale.getDefault(),
                        "00:%02d",
                        sec
                    )
                );
            }

            @Override
            public void onFinish() {
                CallRingtoneManager.stop();

                // Clear avatar animation on timeout
                if (avatarText != null) {
                    avatarText.clearAnimation();
                }

                CallStore.clear(IncomingCallActivity.this);

                // ✅ 1. Use helper instead of direct manager.cancel()
                CallNotificationHelper.cancelIncomingCallNotification(
                        IncomingCallActivity.this,
                        getIntent().getStringExtra("call_id")
                );

                // ✅ 2. Show Missed Call Notification
                String callerNameText = callerName != null ? callerName.getText().toString() : "Someone";
                CallNotificationHelper.showMissedCall(IncomingCallActivity.this, callerNameText);

                // ✅ 4. Use finish() instead of finishAffinity()
                finish();
                overridePendingTransition(0, 0);
            }
        };

        countDownTimer.start();
    }

    // ✅ 6. Avatar pulse animation with null check
    private void startAvatarAnimation() {
        if (avatarText == null) return;

        Animation pulse = AnimationUtils.loadAnimation(this, R.anim.pulse);
        avatarText.startAnimation(pulse);
    }

    // ✅ 5. Card entry animation with null check
    private void animateCard() {
        View card = findViewById(R.id.card);
        if (card == null) return;

        card.setScaleX(0.90f);
        card.setScaleY(0.90f);
        card.setAlpha(0f);

        card.animate()
                .alpha(1f)
                .scaleX(1f)
                .scaleY(1f)
                .setDuration(350)
                .start();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_incoming_call);

        // ✅ 5. Validate callId before anything else
        String callId = getIntent().getStringExtra("call_id");
        if (callId == null || callId.trim().isEmpty()) {
            Log.e(TAG, "Invalid callId. Finishing activity.");
            finish();
            return;
        }

        CallRingtoneManager.start(this);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);

            KeyguardManager km = (KeyguardManager) getSystemService(KEYGUARD_SERVICE);
            if (km != null) {
                km.requestDismissKeyguard(this, null);
            }
        } else {
            getWindow().addFlags(
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                            | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                            | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                            | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
            );
        }

        // Step 2: Initialize views
        logoText = findViewById(R.id.logoText);
        avatarText = findViewById(R.id.avatarText);
        callerName = findViewById(R.id.callerName);
        callerSubtitle = findViewById(R.id.callerSubtitle);
        callType = findViewById(R.id.callType);
        btnAccept = findViewById(R.id.btnAccept);
        btnReject = findViewById(R.id.btnReject);
        countdownText = findViewById(R.id.countdownText);

        // Step 3: Bind caller data
        String caller = getIntent().getStringExtra("caller_name");
        callerName.setText(caller == null ? "Customer" : caller);
        avatarText.setText(getInitials(caller));
        callerSubtitle.setText("Customer Calling");

        String type = getIntent().getStringExtra("call_type");
        if ("video".equalsIgnoreCase(type)) {
            callType.setText("Incoming Video Consultation");
        } else {
            callType.setText("Incoming Audio Consultation");
        }

        // Accept button
        btnAccept.setOnClickListener(v -> {
            if (handled) return;
            handled = true;

            // Step 7: Cancel timer on accept
            if (countDownTimer != null) {
                countDownTimer.cancel();
            }

            // Step 4: UI Updates on Accept
            disableButtons();
            
            // Clear avatar animation on accept
            if (avatarText != null) {
                avatarText.clearAnimation();
            }
            btnAccept.clearAnimation();
            
            // Step 12: Accept button animation (tactile feel)
            btnAccept.animate()
                    .scaleX(0.85f)
                    .scaleY(0.85f)
                    .setDuration(120)
                    .withEndAction(() ->
                            btnAccept.animate()
                                    .scaleX(1f)
                                    .scaleY(1f)
                                    .setDuration(120)
                                    .start()
                    );
            
            callerSubtitle.setText("Connecting...");

            CallRingtoneManager.stop();

            // ✅ 1. Use helper instead of direct manager.cancel()
            CallNotificationHelper.cancelIncomingCallNotification(
                    this,
                    getIntent().getStringExtra("call_id")
            );

            boolean saved = false;

            try {
                JSONObject call = new JSONObject();
                call.put("callId", getIntent().getStringExtra("call_id"));
                call.put("callerName", getIntent().getStringExtra("caller_name"));
                call.put("callType", getIntent().getStringExtra("call_type"));
                call.put("targetUrl", getIntent().getStringExtra("target_url"));
                call.put("userId", getIntent().getStringExtra("user_id"));
                call.put("expertId", getIntent().getStringExtra("expert_id"));

                CallStore.save(this, call);
                saved = true;
            } catch (Exception e) {
                Log.e(TAG, "Failed to save call", e);
            }

            if (saved) {
                Intent launch = new Intent(IncomingCallActivity.this, MainActivity.class);
                launch.putExtra("native_accept", true);
                launch.addFlags(
                        Intent.FLAG_ACTIVITY_NEW_TASK
                                | Intent.FLAG_ACTIVITY_CLEAR_TOP
                                | Intent.FLAG_ACTIVITY_SINGLE_TOP
                );

                startActivity(launch);
                // ✅ 4. Use finish() instead of finishAffinity()
                finish();
                overridePendingTransition(0, 0);
            } else {
                // Save failed, close the activity
                CallRingtoneManager.stop();
                // ✅ 4. Use finish() instead of finishAffinity()
                finish();
                overridePendingTransition(0, 0);
            }
        });

        // Reject button
        btnReject.setOnClickListener(v -> {
            if (handled) return;
            handled = true;

            // Step 7: Cancel timer on reject
            if (countDownTimer != null) {
                countDownTimer.cancel();
            }

            // Step 5: UI Updates on Reject
            disableButtons();
            
            // Clear avatar animation on reject
            if (avatarText != null) {
                avatarText.clearAnimation();
            }
            btnReject.clearAnimation();
            
            // Step 13: Reject button animation (shrink + fade)
            btnReject.animate()
                    .alpha(0.5f)
                    .scaleX(0.9f)
                    .scaleY(0.9f)
                    .setDuration(150);
            
            callerSubtitle.setText("Declining...");

            CallRingtoneManager.stop();

            // ✅ 1. Use helper instead of direct manager.cancel()
            CallNotificationHelper.cancelIncomingCallNotification(
                    this,
                    getIntent().getStringExtra("call_id")
            );

            // Clear stored call data on reject
            CallStore.clear(this);

            // TODO: Send reject to backend via socket
            // SocketManager.rejectCall(callId)
            
            // ✅ 4. Use finish() instead of finishAffinity()
            finish();
            overridePendingTransition(0, 0);
        });

        // Step 6: Start countdown
        startCountdown();

        // Step 4: Start avatar pulse animation (after countdown)
        startAvatarAnimation();

        // Step 14: Animate card entry
        animateCard();
    }

    // ✅ 7. Prevent resume of stale call
    // @Override
    // protected void onResume() {
    //     super.onResume();
        
    //     // Check if call still exists in CallStore
    //     if (!CallStore.hasPendingCall(this)) {
    //         Log.d(TAG, "No pending call found, finishing activity");
    //         finish();
    //     }
    // }

    @Override
    public void onBackPressed() {
        // Ignore Back Press
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        
        // ✅ 6. Set handled flag
        handled = true;
        
        // Cancel timer
        if (countDownTimer != null) {
            countDownTimer.cancel();
        }
        
        // ✅ 3. Clear avatar animation
        if (avatarText != null) {
            avatarText.clearAnimation();
        }
        
        CallRingtoneManager.stop(); // Safe even if already stopped
    }
}