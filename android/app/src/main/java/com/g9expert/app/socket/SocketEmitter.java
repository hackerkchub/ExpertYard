package com.g9expert.app.socket;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.g9expert.app.SocketManager;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import io.socket.client.Socket;

public final class SocketEmitter {

    private static final String TAG = "SocketEmitter";

    private static final ExecutorService EXECUTOR =
            Executors.newSingleThreadExecutor();

    // ============================================================
    // Call Type Constants
    // ============================================================
    private static final String TYPE_VOICE = "voice";
    private static final String TYPE_VIDEO = "video";

    // ============================================================
    // Pending Queue (Thread-Safe)
    // ============================================================
    private static final ConcurrentLinkedQueue<PendingEmit> pendingQueue = 
            new ConcurrentLinkedQueue<>();

    private SocketEmitter() {}

    public interface EmitCallback {
        void onSuccess();
        void onFailure(String reason);
    }

    // ============================================================
    // Pending Emit Model (Inner Class)
    // ============================================================
    private static class PendingEmit {
        final String event;
        final JSONObject payload;
        final EmitCallback callback;
        final long timestamp;

        PendingEmit(String event, JSONObject payload, EmitCallback callback) {
            this.event = event;
            this.payload = payload;
            this.callback = callback;
            this.timestamp = System.currentTimeMillis();
        }

        void execute(Socket socket) {
            try {
                Log.d(TAG, "📤 Executing pending emit - Event: " + event + ", CallId: " + extractCallId(payload));
                emitInternal(socket, event, payload, callback);
            } catch (Exception e) {
                Log.e(TAG, "❌ Failed to execute pending emit", e);
                if (callback != null) {
                    postFailure(callback, e.getMessage());
                }
            }
        }
    }

    // ============================================================
    // Helper Methods
    // ============================================================
    
    private static boolean isVideo(String callType) {
        if (callType == null) return false;
        String normalized = callType.trim().toLowerCase();
        return normalized.contains("video");
    }

    private static boolean isChat(String callType) {
        if (callType == null) return false;
        String normalized = callType.trim().toLowerCase();
        return normalized.contains("chat");
    }

    private static boolean isVoice(String callType) {
        if (callType == null) return true;
        return !isVideo(callType) && !isChat(callType);
    }

    private static String getCurrentTime() {
        return new SimpleDateFormat("HH:mm:ss.SSS", Locale.getDefault()).format(new Date());
    }

    private static String extractCallId(JSONObject payload) {
        if (payload == null) return "unknown";
        try {
            return payload.optString("callId", "unknown");
        } catch (Exception e) {
            return "unknown";
        }
    }

    // ============================================================
    // Logging Methods
    // ============================================================

    private static void logEmitHeader(String event, JSONObject payload, Socket socket) {
        String callId = extractCallId(payload);
        String callType = "unknown";
        try {
            if (payload != null && payload.has("callType")) {
                callType = payload.optString("callType");
            }
        } catch (Exception e) {
            // ignore
        }

        Log.d(TAG, "========================================");
        Log.d(TAG, "[SOCKET EMIT]");
        Log.d(TAG, "========================================");
        Log.d(TAG, "Event      : " + event);
        Log.d(TAG, "CallType   : " + callType);
        Log.d(TAG, "CallId     : " + callId);
        Log.d(TAG, "SocketId   : " + (socket != null ? socket.id() : "null"));
        Log.d(TAG, "Connected  : " + (socket != null && socket.connected()));
        Log.d(TAG, "Thread     : " + Thread.currentThread().getName());
        Log.d(TAG, "Time       : " + getCurrentTime());
        Log.d(TAG, "");
        Log.d(TAG, "Payload");
        Log.d(TAG, payload != null ? payload.toString() : "null");
        Log.d(TAG, "========================================");
    }

    private static void logEmitSuccess(String event, JSONObject payload, Socket socket) {
        String callId = extractCallId(payload);
        Log.d(TAG, "========================================");
        Log.d(TAG, "[EMIT SUCCESS]");
        Log.d(TAG, "========================================");
        Log.d(TAG, "Event      : " + event);
        Log.d(TAG, "CallId     : " + callId);
        Log.d(TAG, "SocketId   : " + (socket != null ? socket.id() : "null"));
        Log.d(TAG, "Time       : " + getCurrentTime());
        Log.d(TAG, "========================================");
    }

    private static void logEmitFailure(String event, JSONObject payload, String reason, Socket socket) {
        String callId = extractCallId(payload);
        Log.e(TAG, "========================================");
        Log.e(TAG, "[EMIT FAILED]");
        Log.e(TAG, "========================================");
        Log.e(TAG, "Event      : " + event);
        Log.e(TAG, "CallId     : " + callId);
        Log.e(TAG, "Reason     : " + reason);
        Log.e(TAG, "SocketId   : " + (socket != null ? socket.id() : "null"));
        Log.e(TAG, "Connected  : " + (socket != null && socket.connected()));
        Log.e(TAG, "Time       : " + getCurrentTime());
        Log.e(TAG, "========================================");
    }

    private static void logQueueAdded(String event, JSONObject payload) {
        String callId = extractCallId(payload);
        Log.d(TAG, "========================================");
        Log.d(TAG, "[QUEUE ADDED]");
        Log.d(TAG, "========================================");
        Log.d(TAG, "Event      : " + event);
        Log.d(TAG, "CallId     : " + callId);
        Log.d(TAG, "Queue Size : " + pendingQueue.size());
        Log.d(TAG, "Time       : " + getCurrentTime());
        Log.d(TAG, "========================================");
    }

    private static void logQueueFlush(int count) {
        Log.d(TAG, "========================================");
        Log.d(TAG, "[QUEUE FLUSH]");
        Log.d(TAG, "========================================");
        Log.d(TAG, "Emitting   : " + count + " pending events");
        Log.d(TAG, "Time       : " + getCurrentTime());
        Log.d(TAG, "========================================");
    }

    // ============================================================
    // Queue Management
    // ============================================================

    private static void enqueue(PendingEmit emit) {
        pendingQueue.add(emit);
        logQueueAdded(emit.event, emit.payload);
        
        // Try to flush immediately if socket is connected
        flushQueue();
    }

    private static void flushQueue() {
        Socket socket = SocketManager.getSocket();
        
        if (socket == null || !socket.connected()) {
            Log.d(TAG, "⏳ Socket not ready, queue will be flushed later. Queue size: " + pendingQueue.size());
            return;
        }

        if (pendingQueue.isEmpty()) {
            return;
        }

        int count = pendingQueue.size();
        logQueueFlush(count);

        PendingEmit emit;
        while ((emit = pendingQueue.poll()) != null) {
            emit.execute(socket);
        }

        Log.d(TAG, "✅ Queue flushed completely");
    }

    // ============================================================
    // Public Method: Flush Queue (for external calls)
    // ============================================================

    public static void flushPendingQueue() {
        EXECUTOR.execute(SocketEmitter::flushQueue);
    }

    // ============================================================
    // Generic Emit (Queue-based)
    // ============================================================

    private static void emit(
            String event,
            JSONObject payload,
            EmitCallback callback
    ) {
        EXECUTOR.execute(() -> {
            try {
                // Create pending emit
                PendingEmit emit = new PendingEmit(event, payload, callback);
                
                // Log header with current socket state
                logEmitHeader(event, payload, SocketManager.getSocket());
                
                // Add to queue
                enqueue(emit);
                
                // Ensure socket is connecting (if not already)
                SocketManager.connect();

            } catch (Exception e) {
                Log.e(TAG, "Emit Failed", e);
                logEmitFailure(event, payload, e.getMessage(), SocketManager.getSocket());
                postFailure(callback, e.getMessage());
            }
        });
    }

    // ============================================================
    // Internal Emit Execution
    // ============================================================

    private static void emitInternal(
            Socket socket,
            String event,
            JSONObject payload,
            EmitCallback callback
    ) {
        try {
            // Emit the event
            socket.emit(event, payload);
            
            Log.d(TAG, "✅ Emit called successfully - Event: " + event + ", CallId: " + extractCallId(payload));
            
            // Success log
            logEmitSuccess(event, payload, socket);

            // Post success callback (no delay needed with queue architecture)
            if (callback != null) {
                new Handler(Looper.getMainLooper())
                        .post(() -> {
                            Log.d(TAG, "✅ Success callback executing - Event: " + event + ", CallId: " + extractCallId(payload));
                            callback.onSuccess();
                        });
            }

        } catch (Exception e) {
            Log.e(TAG, "Emit Error", e);
            logEmitFailure(event, payload, e.getMessage(), socket);
            postFailure(callback, e.getMessage());
        }
    }

    // ============================================================
    // ACCEPT - Voice & Video
    // ============================================================

    public static void accept(
            String callType,
            String callId,
            String userId,
            String expertId,
            EmitCallback callback
    ) {
        try {
            JSONObject object = new JSONObject();
            object.put("callId", callId);
            object.put("callType", callType != null ? callType : TYPE_VOICE);

            if (isVoice(callType)) {
                if (userId != null) object.put("userId", userId);
                if (expertId != null) object.put("expertId", expertId);
                Log.d(TAG, "Voice call accept - CallId: " + callId + ", UserId: " + userId + ", ExpertId: " + expertId);
            } else {
                Log.d(TAG, "Video call accept - CallId: " + callId + " (no user/expert IDs)");
            }

            String event = isVideo(callType) ? "video-call:accept" : "call:accept";
            
            emit(event, object, callback);

        } catch (Exception e) {
            Log.e(TAG, "Accept failed", e);
            JSONObject payload = new JSONObject();
            try {
                payload.put("callId", callId);
                payload.put("callType", callType);
            } catch (Exception ignored) {}
            logEmitFailure("accept", payload, e.getMessage(), SocketManager.getSocket());
            postFailure(callback, e.getMessage());
        }
    }

    // ============================================================
    // REJECT / DECLINE - Voice & Video
    // ============================================================

    public static void reject(
            String callType,
            String callId,
            String userId,
            String expertId,
            EmitCallback callback
    ) {
        try {
            JSONObject object = new JSONObject();
            try {
                long numericCallId = Long.parseLong(callId);
                object.put("callId", numericCallId);
                object.put("call_id", numericCallId);
            } catch (Exception ignored) {
                object.put("callId", callId);
                object.put("call_id", callId);
            }
            object.put("requestId", callId);
            object.put("request_id", callId);
            object.put("callType", callType != null ? callType : TYPE_VOICE);
            object.put("reason", "expert_declined");

            if (userId != null) object.put("userId", userId);
            if (expertId != null) object.put("expertId", expertId);

            if (isChat(callType)) {
                Log.d(TAG, "Chat request reject - RequestId: " + callId);
                emit("reject_chat", object, callback);
                emit("reject_chat_request", object, null);
            } else if (isVideo(callType)) {
                Log.d(TAG, "Video call decline - CallId: " + callId);
                emit("video-call:decline", object, callback);
                emit("video-call:reject", object, null);
                emit("reject_video_call", object, null);
            } else {
                Log.d(TAG, "Voice call reject - CallId: " + callId);
                emit("call:reject", object, callback);
                emit("reject_call", object, null);
            }

        } catch (Exception e) {
            Log.e(TAG, "Reject failed", e);
            JSONObject payload = new JSONObject();
            try {
                payload.put("callId", callId);
                payload.put("callType", callType);
            } catch (Exception ignored) {}
            logEmitFailure("reject", payload, e.getMessage(), SocketManager.getSocket());
            postFailure(callback, e.getMessage());
        }
    }

    // ============================================================
    // CANCEL - Voice & Video
    // ============================================================

    public static void cancel(
            String callType,
            String callId,
            String userId,
            String expertId,
            EmitCallback callback
    ) {
        try {
            JSONObject object = new JSONObject();
            object.put("callId", callId);
            object.put("callType", callType != null ? callType : TYPE_VOICE);

            if (isVoice(callType)) {
                if (userId != null) object.put("userId", userId);
                if (expertId != null) object.put("expertId", expertId);
                Log.d(TAG, "Voice call cancel - CallId: " + callId);
            } else {
                Log.d(TAG, "Video call cancel - CallId: " + callId);
            }

            String event = isVideo(callType) ? "video-call:cancel" : "call:cancel";
            
            emit(event, object, callback);

        } catch (Exception e) {
            Log.e(TAG, "Cancel failed", e);
            JSONObject payload = new JSONObject();
            try {
                payload.put("callId", callId);
                payload.put("callType", callType);
            } catch (Exception ignored) {}
            logEmitFailure("cancel", payload, e.getMessage(), SocketManager.getSocket());
            postFailure(callback, e.getMessage());
        }
    }

    // ============================================================
    // MISSED - Voice & Video
    // ============================================================

    public static void missed(
            String callType,
            String callId,
            String userId,
            String expertId,
            EmitCallback callback
    ) {
        try {
            JSONObject object = new JSONObject();
            object.put("callId", callId);
            object.put("callType", callType != null ? callType : TYPE_VOICE);

            if (isVoice(callType)) {
                if (userId != null) object.put("userId", userId);
                if (expertId != null) object.put("expertId", expertId);
                Log.d(TAG, "Voice call missed - CallId: " + callId);
            } else {
                Log.d(TAG, "Video call missed - CallId: " + callId);
            }

            String event = isVideo(callType) ? "video-call:missed" : "call:missed";
            
            emit(event, object, callback);

        } catch (Exception e) {
            Log.e(TAG, "Missed failed", e);
            JSONObject payload = new JSONObject();
            try {
                payload.put("callId", callId);
                payload.put("callType", callType);
            } catch (Exception ignored) {}
            logEmitFailure("missed", payload, e.getMessage(), SocketManager.getSocket());
            postFailure(callback, e.getMessage());
        }
    }

    // ============================================================
    // BUSY - Voice & Video
    // ============================================================

    public static void busy(
            String callType,
            String callId,
            String userId,
            String expertId,
            EmitCallback callback
    ) {
        try {
            JSONObject object = new JSONObject();
            object.put("callId", callId);
            object.put("callType", callType != null ? callType : TYPE_VOICE);

            if (isVoice(callType)) {
                if (userId != null) object.put("userId", userId);
                if (expertId != null) object.put("expertId", expertId);
                Log.d(TAG, "Voice call busy - CallId: " + callId);
            } else {
                Log.d(TAG, "Video call busy - CallId: " + callId);
            }

            String event = isVideo(callType) ? "video-call:busy" : "call:busy";
            
            emit(event, object, callback);

        } catch (Exception e) {
            Log.e(TAG, "Busy failed", e);
            JSONObject payload = new JSONObject();
            try {
                payload.put("callId", callId);
                payload.put("callType", callType);
            } catch (Exception ignored) {}
            logEmitFailure("busy", payload, e.getMessage(), SocketManager.getSocket());
            postFailure(callback, e.getMessage());
        }
    }

    // ============================================================
    // Callback Helpers
    // ============================================================

    private static void postSuccess(EmitCallback callback) {
        if (callback == null) return;
        new Handler(Looper.getMainLooper())
                .post(callback::onSuccess);
    }

    private static void postFailure(EmitCallback callback, String reason) {
        if (callback == null) return;
        new Handler(Looper.getMainLooper())
                .post(() -> callback.onFailure(reason));
    }

    // ============================================================
    // Convenience Overloads (without callback)
    // ============================================================

    public static void accept(String callType, String callId, String userId, String expertId) {
        accept(callType, callId, userId, expertId, null);
    }

    public static void reject(String callType, String callId, String userId, String expertId) {
        reject(callType, callId, userId, expertId, null);
    }

    public static void cancel(String callType, String callId, String userId, String expertId) {
        cancel(callType, callId, userId, expertId, null);
    }

    public static void missed(String callType, String callId, String userId, String expertId) {
        missed(callType, callId, userId, expertId, null);
    }

    public static void busy(String callType, String callId, String userId, String expertId) {
        busy(callType, callId, userId, expertId, null);
    }

    // ============================================================
    // Debug: Get Socket State & Queue Info
    // ============================================================

    public static boolean isConnected() {
        Socket socket = SocketManager.getSocket();
        return socket != null && socket.connected();
    }

    public static int getQueueSize() {
        return pendingQueue.size();
    }

    public static boolean hasPendingEmits() {
        return !pendingQueue.isEmpty();
    }
}