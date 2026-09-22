import { updateRecovery, getCurrentBuildId } from "./updateRecovery";

let isCheckingBuild = false;
let updateState = {
  isAvailable: false,
  remoteBuildId: null,
  isVerifiedReady: false,
};

const listeners = new Set();

export function subscribeUpdateState(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach((fn) => {
    try {
      fn(updateState);
    } catch (e) {
      console.warn("Update listener error:", e);
    }
  });
}

/**
 * Verifies that remote server has deployed a complete and valid build.
 * Checks version.json AND index.html AND the primary entry JS bundle.
 */
export async function verifyRemoteBuildReady(remoteBuildId) {
  if (typeof window === "undefined" || !navigator.onLine) {
    return false;
  }

  const currentBuildId = getCurrentBuildId();
  const targetBuildId = remoteBuildId || updateState.remoteBuildId;

  if (!targetBuildId || targetBuildId === currentBuildId || targetBuildId === "dev") {
    return false;
  }

  if (isCheckingBuild) {
    return updateState.isVerifiedReady;
  }

  isCheckingBuild = true;

  try {
    const timestamp = Date.now();

    // Step 1: Verify version.json
    const vRes = await fetch(`/version.json?_t=${timestamp}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate", Pragma: "no-cache" },
    });

    if (!vRes.ok) {
      console.log("⏳ [G9 UpdateCoordinator] version.json not reachable yet.");
      isCheckingBuild = false;
      return false;
    }

    const vData = await vRes.json().catch(() => null);
    if (!vData || vData.buildId !== targetBuildId) {
      console.log("⏳ [G9 UpdateCoordinator] version.json mismatch or update in progress.");
      isCheckingBuild = false;
      return false;
    }

    // Step 2: Verify index.html
    const idxRes = await fetch(`/index.html?_t=${timestamp}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate", Pragma: "no-cache" },
    });

    if (!idxRes.ok) {
      console.log("⏳ [G9 UpdateCoordinator] index.html not reachable yet.");
      isCheckingBuild = false;
      return false;
    }

    const idxText = await idxRes.text();

    // Step 3: Extract primary entry JS script from index.html (e.g. /assets/index-xxx.js)
    const scriptMatch = idxText.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (scriptMatch && scriptMatch[1]) {
      const entryJsUrl = scriptMatch[1];
      const jsRes = await fetch(`${entryJsUrl}?_t=${timestamp}`, {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });

      const contentType = (jsRes.headers.get("Content-Type") || "").toLowerCase();
      if (!jsRes.ok || (!contentType.includes("javascript") && !contentType.includes("ecmascript"))) {
        console.log(`⏳ [G9 UpdateCoordinator] Primary entry JS ${entryJsUrl} is not ready yet (Status: ${jsRes.status}).`);
        isCheckingBuild = false;
        return false;
      }
    }

    console.log(`✅ [G9 UpdateCoordinator] Verified remote build "${targetBuildId}" is complete and ready for safe activation.`);
    updateState.isVerifiedReady = true;
    notifyListeners();
    isCheckingBuild = false;
    return true;

  } catch (err) {
    console.warn("Background remote build verification error (ignored):", err);
    isCheckingBuild = false;
    return false;
  }
}

/**
 * Called when a new version build ID is detected on the server.
 * Marks update available BUT DOES NOT RELOAD IMMEDIATELY.
 */
export async function notifyVersionDetected(remoteBuildId) {
  const currentBuildId = getCurrentBuildId();
  if (!remoteBuildId || remoteBuildId === currentBuildId || remoteBuildId === "dev") {
    return;
  }

  window.__G9_UPDATE_AVAILABLE__ = true;
  window.__G9_REMOTE_BUILD_ID__ = remoteBuildId;

  updateState = {
    isAvailable: true,
    remoteBuildId,
    isVerifiedReady: updateState.isVerifiedReady && updateState.remoteBuildId === remoteBuildId,
  };

  notifyListeners();

  // Verify in background
  await verifyRemoteBuildReady(remoteBuildId);
}

/**
 * Called when Service Worker installs a new worker version.
 */
export async function notifyServiceWorkerUpdated() {
  const remoteId = window.__G9_REMOTE_BUILD_ID__ || updateState.remoteBuildId;
  if (remoteId) {
    await verifyRemoteBuildReady(remoteId);
  }
}

/**
 * Requests a controlled update to the new build.
 * Executes reload ONLY if build is verified ready AND recovery lock permits.
 */
export async function requestControlledUpdate(source = "user_action", forceBuildId = null) {
  if (typeof window === "undefined") return false;

  const currentBuildId = getCurrentBuildId();
  const remoteBuildId = forceBuildId || updateState.remoteBuildId || window.__G9_REMOTE_BUILD_ID__;
  const transitionKey = `${currentBuildId}:${remoteBuildId || "latest"}`;

  // Check lock first
  if (!updateRecovery.canAttemptRecovery(source, transitionKey)) {
    console.log(`⏸️ [G9 UpdateCoordinator] Recovery locked for key "${source}:${transitionKey}".`);
    return false;
  }

  // Verify remote build before attempting reload
  const isReady = await verifyRemoteBuildReady(remoteBuildId);
  if (!isReady) {
    console.log("⏳ [G9 UpdateCoordinator] Remote build is not verified ready. Delaying controlled reload to protect current UI.");
    return false;
  }

  console.log(`♻️ [G9 UpdateCoordinator] Executing safe controlled update from source "${source}" for transition "${transitionKey}"...`);
  return await updateRecovery.performControlledReload(source, transitionKey);
}

export function getUpdateState() {
  return updateState;
}

export const updateCoordinator = {
  getUpdateState,
  subscribeUpdateState,
  verifyRemoteBuildReady,
  notifyVersionDetected,
  notifyServiceWorkerUpdated,
  requestControlledUpdate,
};

export default updateCoordinator;
