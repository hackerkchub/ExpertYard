import { updateRecovery, getCurrentBuildId } from "./updateRecovery";

let isStarted = false;
let checkIntervalId = null;

const CHECK_INTERVAL_MS = 60000; // Check every 60 seconds

/**
 * Checks if a new production build has been deployed to the server.
 */
export async function checkServerVersion() {
  if (typeof window === "undefined") return null;

  // Skip offline or dev environments
  if (!navigator.onLine) return null;

  const currentBuildId = getCurrentBuildId();
  if (!currentBuildId || currentBuildId === "dev") {
    return null;
  }

  try {
    // Cache-busted fetch for version.json
    const res = await fetch(`/version.json?_t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const remoteBuildId = data?.buildId;

    if (remoteBuildId && remoteBuildId !== currentBuildId) {
      console.log(`🆕 [G9 VersionChecker] New build detected on server! Current: "${currentBuildId}", Server: "${remoteBuildId}"`);

      window.__G9_UPDATE_AVAILABLE__ = true;
      window.__G9_REMOTE_BUILD_ID__ = remoteBuildId;

      const transitionKey = `${currentBuildId}:${remoteBuildId}`;

      // Trigger single controlled reload for build upgrade
      await updateRecovery.performControlledReload("version_update", transitionKey);

      return { updateAvailable: true, currentBuildId, remoteBuildId };
    }

    return { updateAvailable: false, currentBuildId, remoteBuildId };

  } catch (err) {
    // Non-fatal background fetch error - do nothing
    console.debug("Background version check error (ignored):", err);
    return null;
  }
}

/**
 * Starts periodic and visibility-based version checking. Singleton pattern.
 */
export function startVersionChecker() {
  if (typeof window === "undefined" || isStarted) return;
  isStarted = true;

  console.log(`🚀 [G9 VersionChecker] Initialized for build ID "${getCurrentBuildId()}".`);

  // Initial check on boot
  checkServerVersion();

  // Periodic interval check
  checkIntervalId = setInterval(() => {
    checkServerVersion();
  }, CHECK_INTERVAL_MS);

  // Tab visibility change check (when user switches back to tab)
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      checkServerVersion();
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    stopVersionChecker();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}

export function stopVersionChecker() {
  if (checkIntervalId) {
    clearInterval(checkIntervalId);
    checkIntervalId = null;
  }
  isStarted = false;
}

export const versionChecker = {
  checkServerVersion,
  startVersionChecker,
  stopVersionChecker,
};

export default versionChecker;
