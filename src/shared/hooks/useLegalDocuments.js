import useLegalBasePath from "./useLegalBasePath";
import { useCallback } from "react";
import {
    getPendingLegalDocumentsApi,
    acceptBulkLegalDocumentApi,
} from "../api/legal.api";

const LEGAL_DOCUMENTS_CACHE_KEY = "g9expert_legal_documents";

export default function useLegalDocuments() {
    const basePath = useLegalBasePath();

    /* =========================
       CACHE HELPERS
    ========================= */

    const getCachedDocuments = useCallback(() => {
        try {
            const cached = localStorage.getItem(
                LEGAL_DOCUMENTS_CACHE_KEY
            );

            if (!cached) {
                return [];
            }

            const parsed = JSON.parse(cached);

            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error(
                "Failed to read cached legal documents:",
                error
            );

            return [];
        }
    }, []);

    const cacheDocuments = useCallback((documents) => {
        try {
            if (!Array.isArray(documents)) {
                return;
            }

            localStorage.setItem(
                LEGAL_DOCUMENTS_CACHE_KEY,
                JSON.stringify(documents)
            );

            console.log("💾 Legal documents cached");
        } catch (error) {
            console.error(
                "Failed to cache legal documents:",
                error
            );
        }
    }, []);

    /* =========================
       LOAD PENDING DOCUMENTS
    ========================= */

    const loadPendingDocuments = useCallback(async () => {
        if (!basePath) {
            return [];
        }

        /*
         * OFFLINE
         *
         * Don't even call API.
         */
        if (!navigator.onLine) {
            console.log(
                "📴 Offline - loading legal documents from cache"
            );

            return getCachedDocuments();
        }

        try {
            /*
             * ONLINE
             *
             * Always try to get latest documents.
             */
            const res = await getPendingLegalDocumentsApi(basePath);

            const documents = res?.data || [];

            /*
             * Save latest documents for offline use.
             */
            cacheDocuments(documents);

            return documents;

        } catch (error) {
            console.error(
                "Legal document API failed:",
                error
            );

            /*
             * API failed even though browser says online.
             *
             * Use cache as fallback.
             */
            const cachedDocuments = getCachedDocuments();

            if (cachedDocuments.length > 0) {
                console.log(
                    "📦 Using cached legal documents as fallback"
                );

                return cachedDocuments;
            }

            /*
             * No cache available.
             *
             * Let the caller decide how to handle
             * the actual error.
             */
            throw error;
        }
    }, [
        basePath,
        getCachedDocuments,
        cacheDocuments,
    ]);

    /* =========================
       ACCEPT DOCUMENTS
    ========================= */

    const acceptDocuments = useCallback(
        async (documents) => {
            if (!basePath) {
                return;
            }

            /*
             * IMPORTANT:
             *
             * Acceptance API cannot work offline.
             *
             * Do NOT show "Unable to load legal document"
             * here. This is a separate operation.
             */
            if (!navigator.onLine) {
                console.log(
                    "📴 Offline - legal acceptance API skipped"
                );

                return {
                    offline: true,
                    success: false,
                };
            }

            return await acceptBulkLegalDocumentApi(
                basePath,
                {
                    acceptances: documents,
                }
            );
        },
        [basePath]
    );

    return {
        loadPendingDocuments,
        acceptDocuments,

        /*
         * Optional:
         * Useful if another component needs
         * to manually access cached documents.
         */
        getCachedDocuments,
        cacheDocuments,
    };
}