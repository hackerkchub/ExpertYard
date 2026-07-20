package com.g9expert.app;

import android.app.KeyguardManager;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.Log;
import android.view.KeyEvent;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageButton;
import android.widget.TextView;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

import java.util.Locale;
import java.util.concurrent.atomic.AtomicBoolean;

public class IncomingCallActivity extends AppCompatActivity {
    private static final String TAG = "IncomingCall";
    
    private final AtomicBoolean handled = new AtomicBoolean(false);

    private TextView logoText;
    private TextView avatarText;
    private TextView callerName;
    private TextView callerSubtitle;
    private TextView callType;
    private ImageButton btnAccept;
    private ImageButton btnReject;
    private TextView countdownText;
    private ImageButton btnIgnore;

    private String callId;

    private CountDownTimer countDownTimer;
    private static final long CALL_TIMEOUT = 30000;

    // ✅ Change 1: Helper constants and methods
    private static final String TYPE_VOICE = "voice_call";
    private static final String TYPE_VIDEO = "video_call";

    private boolean isVideoCall(String type) {
        if (type == null) return false;

        type = type.trim().toLowerCase();

        return type.equals("video")
                || type.equals("video_call")
                || type.equals("video-call")
                || type.equals("video consultation");
    }

    private String getCallTitle(String type) {
        return isVideoCall(type)
                ? "Incoming Video Consultation"
                : "Incoming Audio Consultation";
    }

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
        btnIgnore.setEnabled(false);
    }

    private void sendAction(String action) {
        try {
            Intent intent = new Intent(this, IncomingCallReceiver.class);
            intent.setAction(action);
            intent.putExtra("call_id", callId);
            intent.putExtra("caller_name", getIntent().getStringExtra("caller_name"));
            intent.putExtra("call_type", getIntent().getStringExtra("call_type"));
            intent.putExtra("target_url", getIntent().getStringExtra("target_url"));
            sendBroadcast(intent);
            
            // ✅ Change 7: Enhanced broadcast logging
            Log.d(TAG, "==============================");
            Log.d(TAG, "Broadcast Action");
            Log.d(TAG, "Action     : " + action);
            Log.d(TAG, "CallId     : " + callId);
            Log.d(TAG, "Caller     : " + getIntent().getStringExtra("caller_name"));
            Log.d(TAG, "Call Type  : " + getIntent().getStringExtra("call_type"));
            Log.d(TAG, "Target Url : " + getIntent().getStringExtra("target_url"));
            Log.d(TAG, "==============================");
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to send broadcast: " + action, e);
        }
    }

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
                // ✅ Change 6: Timeout logging
                Log.d(TAG, "==============================");
                Log.d(TAG, "CALL TIMEOUT");
                Log.d(TAG, "CallId : " + callId);
                Log.d(TAG, "==============================");

                CallRingtoneManager.stop();
                
                if (avatarText != null) {
                    avatarText.clearAnimation();
                }

                sendAction(IncomingCallReceiver.ACTION_TIMEOUT_CALL);

                countdownText.postDelayed(() -> {
                    finish();
                    overridePendingTransition(0, 0);
                }, 100);
            }
        };

        countDownTimer.start();
    }

    private void startAvatarAnimation() {
        if (avatarText == null) return;

        Animation pulse = AnimationUtils.loadAnimation(this, R.anim.pulse);
        avatarText.startAnimation(pulse);
    }

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
        Log.e("G9_ACTIVITY", "IncomingCallActivity CREATED");
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_incoming_call);

        Log.d(TAG, "🚀 IncomingCallActivity onCreate STARTED");

        callId = getIntent().getStringExtra("call_id");
        if (callId == null || callId.trim().isEmpty()) {
            Log.e(TAG, "Invalid callId. Finishing activity.");
            CallStateManager.setIncomingVisible(this, false, null);
            finish();
            return;
        }

        // ✅ Change 1: Duplicate check (commented out as per original)
        // if (CallStateManager.isIncomingVisible(this, callId)) {
        //     Log.d(TAG, "Duplicate IncomingCallActivity detected for callId: " + callId);
        //     finish();
        //     return;
        // }

        // Set state after duplicate check
        // CallStateManager.setIncomingVisible(this, true, callId);

        if (!CallRingtoneManager.isPlaying()) {
            CallRingtoneManager.start(this);
        }

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

        logoText = findViewById(R.id.logoText);
        avatarText = findViewById(R.id.avatarText);
        callerName = findViewById(R.id.callerName);
        callerSubtitle = findViewById(R.id.callerSubtitle);
        callType = findViewById(R.id.callType);
        btnAccept = findViewById(R.id.btnAccept);
        btnReject = findViewById(R.id.btnReject);
        btnIgnore = findViewById(R.id.btnIgnore);
        countdownText = findViewById(R.id.countdownText);

        countdownText.setVisibility(View.GONE);

        String caller = getIntent().getStringExtra("caller_name");
        callerName.setText(caller == null ? "Customer" : caller);
        avatarText.setText(getInitials(caller));

        // ✅ Change 2: Enhanced call type handling with logging
        String type = getIntent().getStringExtra("call_type");

        Log.d(TAG, "==============================");
        Log.d(TAG, "Incoming Call UI");
        Log.d(TAG, "CallId     : " + callId);
        Log.d(TAG, "Caller     : " + caller);
        Log.d(TAG, "Raw Type   : " + type);
        Log.d(TAG, "Is Video   : " + isVideoCall(type));
        Log.d(TAG, "==============================");

        callType.setText(getCallTitle(type));

        callerSubtitle.setText(
                isVideoCall(type)
                        ? "Customer wants to start a video consultation"
                        : "Customer wants to start an audio consultation"
        );

        // ✅ Change 3: Accept Button with logging
        btnAccept.setOnClickListener(v -> {
            if (!handled.compareAndSet(false, true)) {
                Log.d(TAG, "Accept already handled");
                return;
            }

            Log.d(TAG, "==============================");
            Log.d(TAG, "ACCEPT BUTTON CLICKED");
            Log.d(TAG, "CallId : " + callId);
            Log.d(TAG, "Type   : " + getIntent().getStringExtra("call_type"));
            Log.d(TAG, "==============================");

            if (countDownTimer != null) {
                countDownTimer.cancel();
            }

            disableButtons();
            
            if (avatarText != null) {
                avatarText.clearAnimation();
            }
            btnAccept.clearAnimation();
            
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

            sendAction(IncomingCallReceiver.ACTION_ACCEPT_CALL);

            Log.d(TAG, "Waiting for React Handshake ACK...");

            final Runnable safetyTimeoutRunnable = new Runnable() {
                @Override
                public void run() {
                    Log.d(TAG, "⏳ Handshake safety timeout reached (15s) - finishing IncomingCallActivity");
                    com.g9expert.app.bridge.NativeBridgeManager.setHandshakeAckListener(null);
                    finish();
                    overridePendingTransition(0, 0);
                }
            };

            // Post safety fallback runnable (15 seconds generous window for cold start webview load)
            btnAccept.postDelayed(safetyTimeoutRunnable, 15000);

            // 🤝 Handshake ACK: Keep IncomingCallActivity alive until React frontend confirms takeover
            com.g9expert.app.bridge.NativeBridgeManager.setHandshakeAckListener(ackCallId -> {
                Log.d(TAG, "🤝 Handshake ACK received for call: " + ackCallId + " - finishing IncomingCallActivity immediately");
                runOnUiThread(() -> {
                    btnAccept.removeCallbacks(safetyTimeoutRunnable);
                    com.g9expert.app.bridge.NativeBridgeManager.setHandshakeAckListener(null);
                    finish();
                    overridePendingTransition(0, 0);
                });
            });
        });

        // ✅ Change 5: Ignore Button with logging
        btnIgnore.setOnClickListener(v -> {
            if (!handled.compareAndSet(false, true)) {
                Log.d(TAG, "Ignore already handled");
                return;
            }

            Log.d(TAG, "==============================");
            Log.d(TAG, "IGNORE BUTTON CLICKED");
            Log.d(TAG, "CallId : " + callId);
            Log.d(TAG, "==============================");

            if (countDownTimer != null) {
                countDownTimer.cancel();
            }

            CallRingtoneManager.stop();

            CallNotificationHelper.cancelIncomingCallNotification(this, callId);
            CallStateManager.setIncomingVisible(this, false, null);

            finish();
            overridePendingTransition(0, 0);
        });

        // ✅ Change 4: Reject Button with logging
        btnReject.setOnClickListener(v -> {
            if (!handled.compareAndSet(false, true)) {
                Log.d(TAG, "Reject already handled");
                return;
            }

            Log.d(TAG, "==============================");
            Log.d(TAG, "REJECT BUTTON CLICKED");
            Log.d(TAG, "CallId : " + callId);
            Log.d(TAG, "Type   : " + getIntent().getStringExtra("call_type"));
            Log.d(TAG, "==============================");

            if (countDownTimer != null) {
                countDownTimer.cancel();
            }

            disableButtons();
            
            if (avatarText != null) {
                avatarText.clearAnimation();
            }
            btnReject.clearAnimation();
            
            btnReject.animate()
                    .alpha(0.5f)
                    .scaleX(0.9f)
                    .scaleY(0.9f)
                    .setDuration(150);
            
            callerSubtitle.setText("Declining...");

            CallRingtoneManager.stop();

            sendAction(IncomingCallReceiver.ACTION_REJECT_CALL);

            Log.d(TAG, "Waiting Receiver...");

            // Increased delay to 300ms
            btnReject.postDelayed(() -> {
                finish();
                overridePendingTransition(0, 0);
            }, 300);
        });

        startCountdown();
        startAvatarAnimation();
        animateCard();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_VOLUME_UP
                || keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {

            if (!CallRingtoneManager.isMuted()) {
                CallRingtoneManager.mute();
                Log.d(TAG, "Ringtone muted");
            }

            return true;
        }

        return super.onKeyDown(keyCode, event);
    }

    @Override
    public void onBackPressed() {
        // Ignore Back Press
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (isFinishing()) {
            return;
        }
        Log.d(TAG, "IncomingCallActivity stopped");
    }

    @Override
    protected void onDestroy() {
        // ✅ Change 8: Enhanced onDestroy logging
        Log.d(TAG, "IncomingCallActivity Destroyed");
        Log.d(TAG, "CallId : " + callId);

        if (avatarText != null) {
            avatarText.clearAnimation();
        }
        
        if (countDownTimer != null) {
            countDownTimer.cancel();
            countDownTimer = null;
        }
        
        super.onDestroy();
        handled.set(true);
        
        // Only stop ringtone, let Receiver handle state
        if (isFinishing()) {
            CallRingtoneManager.stop();
            // State is handled by IncomingCallReceiver
        }
    }
}