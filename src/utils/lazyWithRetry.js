import { lazy } from "react";
import { updateRecovery, getCurrentBuildId } from "./updateRecovery";

/**
 * Enhanced lazy loader with build-aware single-recovery execution lock.
 * Catches dynamic import failures (e.g. when old hashed JS chunks are removed on deployment)
 * and triggers at most ONE safe reload per build identity to pull new build assets.
 */
export function lazyWithRetry(componentImportFn) {
  return lazy(async () => {
    try {
      return await componentImportFn();
    } catch (error) {
      console.warn("⚠️ [G9] Dynamic import chunk load error caught:", error);

      const errorMessage = String(error?.message || error || "").toLowerCase();
      const isChunkLoadFailure =
        error?.name === "ChunkLoadError" ||
        errorMessage.includes("failed to fetch dynamically imported module") ||
        errorMessage.includes("importing a module script failed") ||
        errorMessage.includes("loading chunk") ||
        errorMessage.includes("unexpected token") ||
        errorMessage.includes("404");

      if (isChunkLoadFailure && typeof window !== "undefined") {
        const buildId = getCurrentBuildId();

        // Check if single automatic recovery is permitted for this build
        if (updateRecovery.canAttemptRecovery("chunk", buildId)) {
          const reloaded = await updateRecovery.performControlledReload("chunk", buildId, async () => {
            if ("serviceWorker" in navigator) {
              try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const reg of registrations) {
                  await reg.update().catch(() => {});
                }
              } catch (e) {
                console.warn("SW update error during chunk recovery:", e);
              }
            }
          });

          if (reloaded) {
            return new Promise(() => {});
          }
        }
      }

      // If already reloaded for this build or not a chunk error, rethrow for AppErrorBoundary
      throw error;
    }
  });
}

export default lazyWithRetry;
