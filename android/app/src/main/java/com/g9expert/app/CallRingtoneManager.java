package com.g9expert.app;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.net.Uri;
import android.provider.Settings;

public class CallRingtoneManager {

    private static MediaPlayer player;

    public static void start(Context context) {

        stop();

        try {

            Uri uri = Settings.System.DEFAULT_RINGTONE_URI;

            player = new MediaPlayer();

            player.setAudioAttributes(

                    new AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                            .build()

            );

            player.setDataSource(context, uri);

            player.setLooping(true);

            player.prepare();

            player.start();

        } catch (Exception ignored) {
        }

    }

    public static void stop() {

        try {

            if (player != null) {

                player.stop();

                player.release();

                player = null;

            }

        } catch (Exception ignored) {
        }

    }

}