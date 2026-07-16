package com.g9expert.app;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.g9expert.app.socket.SocketEmitter;

import java.net.URI;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicBoolean;

import io.socket.client.IO;
import io.socket.client.Socket;

public final class SocketManager {

    private static final String TAG = "SocketManager";
    private static final int CONNECTION_TIMEOUT_MS = 12000;
    private static final int RECONNECTION_DELAY_MS = 1000;
    private static final int RECONNECTION_DELAY_MAX_MS = 5000;
    private static final int CONNECTION_TIMEOUT_MS_FOR_SOCKET = 10000;

    private static volatile Socket socket;
    private static final AtomicBoolean connecting = new AtomicBoolean(false);
    private static final List<ConnectionListener> listeners = new CopyOnWriteArrayList<>();
    private static final Handler timeoutHandler = new Handler(Looper.getMainLooper());
    private static Runnable timeoutRunnable;
    private static SocketReconnectHandler reconnectHandler;

    private SocketManager() {
        // Private constructor to prevent instantiation
    }

    public interface ConnectionListener {
        void onConnected(String socketId);
        void onDisconnected();
        void onConnectError(String error);
        void onReconnecting(int attempt);
        void onReconnectFailed();
        void onConnectionStateChanged(boolean connected);
    }

    // Generic handler for reconnect operations
    public interface SocketReconnectHandler {
        void onReconnected(String socketId);
    }

    public static void addConnectionListener(ConnectionListener listener) {
        if (listener != null && !listeners.contains(listener)) {
            listeners.add(listener);
        }
    }

    public static void removeConnectionListener(ConnectionListener listener) {
        listeners.remove(listener);
    }

    public static synchronized void setReconnectHandler(SocketReconnectHandler handler) {
        reconnectHandler = handler;
    }

    private static synchronized void createSocket() {
        if (socket != null) {
            return;
        }

        try {
            String api = BuildConfig.API_BASE_URL;
            String socketUrl = api.replaceAll("/api/?$", "");

            IO.Options options = new IO.Options();
            
            options.transports = new String[]{"websocket"};
            options.upgrade = true;
            options.rememberUpgrade = true;
            options.forceNew = false;
            options.reconnection = true;
            options.reconnectionAttempts = Integer.MAX_VALUE;
            options.reconnectionDelay = RECONNECTION_DELAY_MS;
            options.reconnectionDelayMax = RECONNECTION_DELAY_MAX_MS;
            options.timeout = CONNECTION_TIMEOUT_MS_FOR_SOCKET;

            socket = IO.socket(new URI(socketUrl), options);
            registerEvents(socket);

            Log.d(TAG, "Socket Created: " + socketUrl);

        } catch (Exception e) {
            Log.e(TAG, "Socket Creation Failed", e);
            notifyConnectError(e.getMessage());
        }
    }

    public static synchronized Socket getSocket() {
        if (socket == null) {
            createSocket();
        }
        return socket;
    }

    public static synchronized void connect() {
        createSocket();

        if (socket == null) {
            return;
        }

        // Check if already connected or connecting
        if (socket.connected()) {
            Log.d(TAG, "==============================");
            Log.d(TAG, "SOCKET ALREADY CONNECTED");
            Log.d(TAG, "==============================");
            Log.d(TAG, "SocketId   : " + socket.id());
            Log.d(TAG, "Connected  : true");
            Log.d(TAG, "==============================");
            return;
        }

        // Race condition safe check
        if (connecting.get()) {
            Log.d(TAG, "Socket connection already in progress");
            return;
        }

        Log.d(TAG, "==============================");
        Log.d(TAG, "SOCKET CONNECT REQUEST");
        Log.d(TAG, "==============================");
        Log.d(TAG, "Connected    : false");
        Log.d(TAG, "Connecting   : false");
        Log.d(TAG, "SocketId     : " + (socket != null ? socket.id() : "null"));
        Log.d(TAG, "==============================");

        connecting.set(true);
        Log.d(TAG, "Connecting Socket...");

        cancelConnectionTimeout();

        timeoutRunnable = () -> {
            if (connecting.get()) {
                connecting.set(false);
                Log.e(TAG, "Connection timeout exceeded");
                notifyConnectError("Connection timeout");
            }
        };
        timeoutHandler.postDelayed(timeoutRunnable, CONNECTION_TIMEOUT_MS);

        socket.connect();
    }

    public static boolean isConnected() {
        return socket != null && socket.connected();
    }

    public static boolean isConnecting() {
        return connecting.get();
    }

    public static boolean isDisconnected() {
        return socket == null || !socket.connected();
    }

    public static String getSocketId() {
        return socket != null ? socket.id() : null;
    }

    public static synchronized void disconnect() {
        connecting.set(false);
        cancelConnectionTimeout();

        if (socket == null) {
            return;
        }

        try {
            Log.d(TAG, "Disconnecting Socket...");
            socket.disconnect();
            socket.close();
            socket = null;

            notifyDisconnected();
            Log.d(TAG, "Socket Disconnected Successfully");

        } catch (Exception e) {
            Log.e(TAG, "Disconnect Error", e);
        }
    }

    private static void cancelConnectionTimeout() {
        if (timeoutRunnable != null) {
            timeoutHandler.removeCallbacks(timeoutRunnable);
            timeoutRunnable = null;
        }
    }

    public static boolean ensureConnected() {
        if (isConnected()) {
            return true;
        }
        connect();
        return false;
    }

    public static void emit(String event, Object... args) {
        if (!isConnected()) {
            Log.w(TAG, "Cannot emit '" + event + "': Socket not connected");
            return;
        }

        try {
            socket.emit(event, args);
            Log.d(TAG, "Emit: " + event + 
                      " | Connected: " + socket.connected() + 
                      " | SocketId: " + socket.id());
        } catch (Exception e) {
            Log.e(TAG, "Error emitting '" + event + "'", e);
        }
    }

    private static void registerEvents(Socket socket) {
        // ✅ EVENT_CONNECT
        socket.on(Socket.EVENT_CONNECT, args -> {
            connecting.set(false);
            cancelConnectionTimeout();

            String socketId = socket.id();
            
            Log.d(TAG, "==============================");
            Log.d(TAG, "SOCKET CONNECTED");
            Log.d(TAG, "==============================");
            Log.d(TAG, "SocketId   : " + socketId);
            Log.d(TAG, "Connected  : true");
            Log.d(TAG, "==============================");

            // ✅ Phase-2: Flush pending queue on connect
            Log.d(TAG, "📤 Flushing pending socket emits...");
            SocketEmitter.flushPendingQueue();

            notifyConnected(socketId);
            notifyConnectionStateChanged(true);

            if (reconnectHandler != null) {
                reconnectHandler.onReconnected(socketId);
            }
        });

        // ✅ EVENT_DISCONNECT
        socket.on(Socket.EVENT_DISCONNECT, args -> {
            connecting.set(false);
            cancelConnectionTimeout();

            String reason = args.length > 0 ? args[0].toString() : "Unknown";
            String socketId = socket != null ? socket.id() : "null";
            boolean isManual = reason != null && reason.contains("io client disconnect");
            
            Log.d(TAG, "==============================");
            Log.d(TAG, "SOCKET DISCONNECTED");
            Log.d(TAG, "==============================");
            Log.d(TAG, "Reason     : " + reason);
            Log.d(TAG, "SocketId   : " + socketId);
            Log.d(TAG, "Manual     : " + isManual);
            Log.d(TAG, "==============================");

            // ✅ Queue untouched - will be flushed on reconnect
            if (SocketEmitter.hasPendingEmits()) {
                Log.d(TAG, "📌 Queue has " + SocketEmitter.getQueueSize() + " pending emits - will flush on reconnect");
            }

            // Only notify if it's a manual disconnect
            if (isManual) {
                notifyDisconnected();
                notifyConnectionStateChanged(false);
            }
        });

        // ✅ EVENT_CONNECT_ERROR
        socket.on(Socket.EVENT_CONNECT_ERROR, args -> {
            connecting.set(false);
            cancelConnectionTimeout();

            String error = args.length > 0 ? args[0].toString() : "Unknown error";
            String socketId = socket != null ? socket.id() : "null";
            boolean connected = socket != null && socket.connected();
            
            Log.e(TAG, "==============================");
            Log.e(TAG, "SOCKET CONNECT ERROR");
            Log.e(TAG, "==============================");
            Log.e(TAG, "Reason     : " + error);
            Log.e(TAG, "Connected  : " + connected);
            Log.e(TAG, "SocketId   : " + socketId);
            Log.e(TAG, "==============================");
            
            notifyConnectError(error);
        });
    }

    // Notification helpers
    private static void notifyConnected(String socketId) {
        for (ConnectionListener listener : listeners) {
            try {
                listener.onConnected(socketId);
            } catch (Exception e) {
                Log.e(TAG, "Error in onConnected listener", e);
            }
        }
    }

    private static void notifyDisconnected() {
        for (ConnectionListener listener : listeners) {
            try {
                listener.onDisconnected();
            } catch (Exception e) {
                Log.e(TAG, "Error in onDisconnected listener", e);
            }
        }
    }

    private static void notifyConnectError(String error) {
        for (ConnectionListener listener : listeners) {
            try {
                listener.onConnectError(error);
            } catch (Exception e) {
                Log.e(TAG, "Error in onConnectError listener", e);
            }
        }
    }

    private static void notifyReconnecting(int attempt) {
        for (ConnectionListener listener : listeners) {
            try {
                listener.onReconnecting(attempt);
            } catch (Exception e) {
                Log.e(TAG, "Error in onReconnecting listener", e);
            }
        }
    }

    private static void notifyReconnectFailed() {
        for (ConnectionListener listener : listeners) {
            try {
                listener.onReconnectFailed();
            } catch (Exception e) {
                Log.e(TAG, "Error in onReconnectFailed listener", e);
            }
        }
    }

    private static void notifyConnectionStateChanged(boolean connected) {
        for (ConnectionListener listener : listeners) {
            try {
                listener.onConnectionStateChanged(connected);
            } catch (Exception e) {
                Log.e(TAG, "Error in onConnectionStateChanged listener", e);
            }
        }
    }
}