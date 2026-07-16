package com.g9expert.app;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

public class CallRingtoneManager {

    private static final String TAG = "G9_Ringtone";

    private static MediaPlayer player;
    private static AudioManager audioManager;
    private static AudioFocusRequest focusRequest;

    private static boolean isPlaying = false;
    private static boolean isMuted = false;

    public static synchronized void start(Context context) {

        if (isPlaying) {
            Log.d(TAG, "Already Playing");
            return;
        }

        stop();

        try {

            audioManager =
                    (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

                AudioAttributes attributes =
                        new AudioAttributes.Builder()
                                .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                                .build();

                focusRequest =
                        new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
                                .setAudioAttributes(attributes)
                                .build();

                audioManager.requestAudioFocus(focusRequest);

                player = new MediaPlayer();

                player.setAudioAttributes(attributes);

            } else {

                audioManager.requestAudioFocus(
                        null,
                        AudioManager.STREAM_RING,
                        AudioManager.AUDIOFOCUS_GAIN_TRANSIENT
                );

                player = new MediaPlayer();

                player.setAudioStreamType(AudioManager.STREAM_RING);

            }

            Uri uri = Settings.System.DEFAULT_RINGTONE_URI;

            player.setDataSource(context, uri);

            player.setLooping(true);

            player.prepare();

            player.start();

            isPlaying = true;
            isMuted = false;

            Log.d(TAG, "Ringtone Started");

        } catch (Exception e) {

            Log.e(TAG, "Failed to start ringtone", e);

            stop();

        }

    }

    public static synchronized void stop() {

        try {

            if (player != null) {

                if (player.isPlaying()) {
                    player.stop();
                }

                player.release();

                player = null;

            }

        } catch (Exception ignored) {
        }

        try {

            if (audioManager != null) {

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

                    if (focusRequest != null) {
                        audioManager.abandonAudioFocusRequest(focusRequest);
                    }

                } else {

                    audioManager.abandonAudioFocus(null);

                }

            }

        } catch (Exception ignored) {
        }

        isPlaying = false;
        isMuted = false;

        Log.d(TAG, "Ringtone Stopped");

    }

    public static synchronized void mute() {

        if (player == null)
            return;

        try {

            player.setVolume(0f, 0f);

            isMuted = true;

            Log.d(TAG, "Ringtone Muted");

        } catch (Exception ignored) {
        }

    }

    public static synchronized void unMute() {

        if (player == null)
            return;

        try {

            player.setVolume(1f, 1f);

            isMuted = false;

            Log.d(TAG, "Ringtone UnMuted");

        } catch (Exception ignored) {
        }

    }

    public static boolean isPlaying() {
        return isPlaying;
    }

    public static boolean isMuted() {
        return isMuted;
    }

}