// src/shared/utils/nativeKeyboardBridge.js
import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";

let currentMode = null;
let keyboardState = {
  visible: false,
  height: 0,
};
const listeners = new Set();

export const isAndroid10 = () => {
  return (
    Capacitor &&
    typeof Capacitor.isNativePlatform === "function" &&
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === "android" &&
    /Android 10\b/i.test(navigator.userAgent || "")
  );
};

/**
 * Safely update the native Android soft input mode ("pan" | "resize" | "nothing").
 * @param {"pan" | "resize" | "nothing"} mode 
 */
export const setNativeKeyboardMode = (mode) => {
  try {
    const isNative = Capacitor && typeof Capacitor.isNativePlatform === "function" && Capacitor.isNativePlatform();
    const platform = isNative ? Capacitor.getPlatform() : "web";
    const pathname = window.location?.pathname || "unknown";
    const nativeBridge = window.NativeBridgeManager_Native;
    const bridgeExists = !!nativeBridge;
    const methodExists = nativeBridge && typeof nativeBridge.setSoftInputMode === "function";

    const normalizedMode = (mode || "").trim().toLowerCase();

    console.log(`[KEYBOARD_MODE_DEBUG] platform=${platform} native=${isNative} pathname=${pathname} requested=${mode} bridgeExists=${bridgeExists} methodExists=${methodExists}`);

    if (!isNative || platform !== "android") return;
    if (!bridgeExists || !methodExists) {
      console.error("[KEYBOARD_MODE_DEBUG] ❌ NativeBridgeManager_Native or setSoftInputMode method missing!");
      return;
    }

    if (normalizedMode !== "pan" && normalizedMode !== "resize" && normalizedMode !== "nothing") {
      console.warn(`[KEYBOARD_MODE_DEBUG] Invalid mode ignored: ${mode}`);
      return;
    }

    if (currentMode === normalizedMode) return;

    currentMode = normalizedMode;
    console.log(`[KEYBOARD_MODE_DEBUG] Calling native setSoftInputMode("${normalizedMode}")`);
    nativeBridge.setSoftInputMode(normalizedMode);
  } catch (err) {
    console.error("[KEYBOARD_MODE_DEBUG] setNativeKeyboardMode error:", err);
  }
};

/**
 * Query current actual soft input mode directly from native Activity Window attributes
 */
export const getActualNativeSoftInputMode = () => {
  try {
    const nativeBridge = window.NativeBridgeManager_Native;
    if (nativeBridge && typeof nativeBridge.getActualSoftInputMode === "function") {
      return nativeBridge.getActualSoftInputMode();
    }
  } catch (e) {
    // ignore
  }
  return currentMode || "UNKNOWN";
};

/**
 * Query real-time native IME keyboard height in pixels directly from Java Bridge
 */
export const getNativeKeyboardHeight = () => {
  try {
    const nativeBridge = window.NativeBridgeManager_Native;
    if (nativeBridge && typeof nativeBridge.getNativeKeyboardHeight === "function") {
      const h = nativeBridge.getNativeKeyboardHeight();
      if (typeof h === "number" && h >= 0) return h;
    }
  } catch (e) {
    // ignore
  }
  return keyboardState.height || 0;
};

/**
 * Get native DecorView screen metrics to detect Window translation
 */
export const getDecorViewMetrics = () => {
  try {
    const nativeBridge = window.NativeBridgeManager_Native;
    if (nativeBridge && typeof nativeBridge.getDecorViewMetrics === "function") {
      return nativeBridge.getDecorViewMetrics();
    }
  } catch (e) {
    // ignore
  }
  return "N/A";
};

/**
 * Get the currently cached keyboard mode.
 */
export const getNativeKeyboardMode = () => currentMode || "pan";

/**
 * Get current keyboard height in pixels.
 */
export const getKeyboardHeight = () => keyboardState.height;

/**
 * Check if keyboard is currently visible.
 */
export const isKeyboardVisible = () => keyboardState.visible;

/**
 * Subscribe to keyboard state changes.
 */
export const subscribeKeyboardState = (callback) => {
  if (typeof callback === "function") {
    listeners.add(callback);
    callback(keyboardState);
  }
  return () => listeners.delete(callback);
};

const updateKeyboardState = (visible, height) => {
  const h = Math.max(0, height || 0);

  if (keyboardState.visible === visible && keyboardState.height === h) {
    return; // Avoid duplicate DOM updates
  }

  keyboardState = { visible, height: h };
  
  if (isAndroid10()) {
    document.documentElement.style.setProperty(
      "--native-keyboard-height",
      visible ? `${h}px` : "0px"
    );
  } else {
    document.documentElement.style.setProperty("--native-keyboard-height", "0px");
  }

  console.log(`[KEYBOARD_HEIGHT_DEBUG] event=${visible ? "SHOW" : "HIDE"} height=${h}px`);

  listeners.forEach((cb) => {
    try {
      cb(keyboardState);
    } catch (e) {
      console.error("Keyboard state listener error:", e);
    }
  });
};

// Listen to Native Java WindowInsets IME height events
if (typeof window !== "undefined") {
  window.addEventListener("nativeKeyboardHeightChange", (e) => {
    const height = e.detail?.height || 0;
    console.log(`[KEYBOARD_HEIGHT_DEBUG] Native event nativeKeyboardHeightChange height=${height}px`);
    updateKeyboardState(height > 0, height);
  });
}

// Initialize Capacitor Keyboard event listeners as secondary signal
if (Capacitor && typeof Capacitor.isNativePlatform === "function" && Capacitor.isNativePlatform()) {
  try {
    Keyboard.addListener("keyboardWillShow", (info) => {
      const h = info?.keyboardHeight || 0;
      updateKeyboardState(true, h);
    });

    Keyboard.addListener("keyboardDidShow", (info) => {
      const h = info?.keyboardHeight || 0;
      updateKeyboardState(true, h);
    });

    Keyboard.addListener("keyboardWillHide", () => {
      updateKeyboardState(false, 0);
    });

    Keyboard.addListener("keyboardDidHide", () => {
      updateKeyboardState(false, 0);
    });
  } catch (err) {
    console.warn("Error setting up Capacitor Keyboard listeners:", err);
  }
}
