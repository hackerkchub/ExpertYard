# G9Expert ProGuard / R8 Hardening Rules

# Capacitor Framework Core & Plugins
-keep class com.getcapacitor.** { *; }
-keep class * extends com.getcapacitor.Plugin { *; }
-keep class * extends com.getcapacitor.BridgeActivity { *; }
-keep class * extends com.getcapacitor.Bridge { *; }
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod public *;
    @android.webkit.JavascriptInterface public *;
}

# G9Expert Native Application & JS Bridge Interface
-keep class com.g9expert.app.** { *; }
-keepclassmembers class com.g9expert.app.MainActivity$NativeBridgeInterface {
    public *;
}
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Socket.io & OkHttp Networking Dependencies
-keep class io.socket.** { *; }
-keep class socketio.getbuffer.** { *; }
-keep class okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn org.codehaus.mojo.animal_sniffer.**

# Firebase Push Messaging Service
-keep class com.google.firebase.messaging.** { *; }
-dontwarn com.google.firebase.**

# Preserve annotations, line numbers, and JavaScript interfaces for crash diagnostics
-keepattributes SourceFile,LineNumberTable,*Annotation*,JavascriptInterface

# Google Play Core In-App Update SDK
-keep class com.google.android.play.core.appupdate.** { *; }
-keep class com.google.android.play.core.install.** { *; }

