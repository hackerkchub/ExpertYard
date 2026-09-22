import { lazy } from "react";
import { updateRecovery, getCurrentBuildId } from "./updateRecovery";
import { updateCoordinator } from "./updateCoordinator";

/**
 * Enhanced lazy loader with atomic deployment validation & build-aware recovery lock.
 * Catches dynamic import failures (e.g. 404 when old hashed JS chunks are removed on new deployment).
 * Verifies new build readiness BEFORE executing controlled reload, avoiding blank screens.
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

        // Attempt safe update via coordinator (verifies remote build readiness first)
        const updateExecuted = await updateCoordinator.requestControlledUpdate("chunk", buildId);

        if (updateExecuted) {
          // Failsafe: Wait for window reload with timeout to prevent infinite hanging
          return new Promise((_, reject) => {
            setTimeout(() => {
              reject(error);
            }, 3000);
          });
        }
      }

      // If update not executed (or remote build not ready), throw for AppErrorBoundary visible fallback
      throw error;
    }
  });
}

export default lazyWithRetry;
