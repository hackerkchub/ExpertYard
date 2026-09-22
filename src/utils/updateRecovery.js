/**
 * Centralized Build-Aware Update & Recovery Lock System
 * Prevents repeat reloads, infinite reload loops, and tab reload storms.
 * Enforces single automatic recovery per build transition event while preserving exact route URL.
 */

const STORAGE_KEY = "g9_central_recovery_store";

function getStorage() {
  if (typeof window === "undefined" || !window.sessionStorage) return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveStorage(data) {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Unable to save recovery lock state to sessionStorage:", e);
  }
}

export function getCurrentBuildId() {
  if (typeof window !== "undefined" && window.__G9_BUILD_ID__) {
    return window.__G9_BUILD_ID__;
  }
  if (typeof __G9_BUILD_ID__ !== "undefined") {
    return __G9_BUILD_ID__;
  }
  return "dev";
}

export function getScopedRecoveryKey(type, identifier) {
  const buildId = getCurrentBuildId();
  const id = identifier || buildId;
  return `${type}:${id}`;
}

/**
 * Returns true if automatic recovery has NOT been executed yet for this specific event/build key.
 */
export function canAttemptRecovery(type, identifier) {
  const store = getStorage();
  const key = getScopedRecoveryKey(type, identifier);
  const entry = store[key];

  if (!entry) return true;

  // Allow retry if attempt was made over 2 minutes ago or build has changed
  if (Date.now() - entry.timestamp > 120000) {
    return true;
  }

  return false;
}

/**
 * Marks that recovery has been executed for this specific event/build key.
 */
export function markRecoveryAttempted(type, identifier) {
  const store = getStorage();
  const key = getScopedRecoveryKey(type, identifier);
  store[key] = {
    timestamp: Date.now(),
    buildId: getCurrentBuildId(),
  };
  saveStorage(store);
}

/**
 * Executes a controlled reload or route navigation to the target URL.
 * Preserves exact route (pathname, search, hash).
 */
export async function performControlledReload(type, identifier, beforeReloadFn, targetUrl) {
  if (typeof window === "undefined") return false;

  const key = getScopedRecoveryKey(type, identifier);

  if (!canAttemptRecovery(type, identifier)) {
    console.log(`⏸️ [G9 Recovery Lock] Recovery locked for key "${key}". Skipping reload.`);
    return false;
  }

  // Mark lock BEFORE reload to prevent race conditions
  markRecoveryAttempted(type, identifier);

  if (typeof beforeReloadFn === "function") {
    try {
      await beforeReloadFn();
    } catch (e) {
      console.warn("Warning during pre-reload action:", e);
    }
  }

  const destination = targetUrl || window.location.href;
  console.log(`♻️ [G9 Recovery Lock] Executing single controlled transition for key "${key}" to URL: "${destination}"...`);

  if (targetUrl && targetUrl !== window.location.href) {
    window.location.assign(destination);
  } else {
    window.location.reload();
  }

  return true;
}

export const updateRecovery = {
  getCurrentBuildId,
  getScopedRecoveryKey,
  canAttemptRecovery,
  markRecoveryAttempted,
  performControlledReload,
};

export default updateRecovery;
