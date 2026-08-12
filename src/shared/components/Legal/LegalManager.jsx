import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useLegal } from "../../context/LegalContext";
import useLegalDocuments from "../../hooks/useLegalDocuments";
import { useAuth } from "../../context/UserAuthContext";
import LegalConsentModal from "./LegalConsentModal";
import LegalDocumentViewer from "./LegalDocumentViewer";
import SignatureModal from "./SignatureModal";
import LegalLoader from "./LegalLoader";

// Excluded routes where legal popup should not appear
const EXCLUDED_ROUTES = [
    "/admin",
    "/user/chat",
    "/expert/chat",
    "/user/voice-call",
    "/expert/voice-call",
    "/user/video-call",
    "/expert/video-call",
    "/login",
    "/signup",
    "/forgot-password",
    "/legal",
    "/privacy",
    "/terms",
    "/refund",
    "/cookie-policy",
];

export default function LegalManager() {
    const location = useLocation();
    const { isLoggedIn } = useAuth();

    const {
        pendingDocuments,
        setPendingDocuments,
        isOpen,
        setIsOpen,
        setIsLoading,
        isLoading,
        setApplicationLocked,
        applicationLocked,
        legalInitialized,
        setLegalInitialized,
        refreshKey,
    } = useLegal();

    const {
        loadPendingDocuments,
        acceptDocuments,
    } = useLegalDocuments();

    const [selectedDocument, setSelectedDocument] = useState(null);
    const [accepting, setAccepting] = useState(false);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [documentsToAccept, setDocumentsToAccept] = useState([]);
    const [signatureDocuments, setSignatureDocuments] = useState([]);
    const [currentSignatureIndex, setCurrentSignatureIndex] = useState(0);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;

    // Check authentication - use localStorage for expert
    const expertLoggedIn = Boolean(
        localStorage.getItem("expert_token")
    );
    const isAuthenticated = isLoggedIn || expertLoggedIn;

    // Check if current route should skip legal
    const shouldSkipLegal = useMemo(() => {
        const path = location.pathname.toLowerCase();
        return EXCLUDED_ROUTES.some(route => path.startsWith(route));
    }, [location.pathname]);

    // Body scroll lock
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    // Browser back button lock
    useEffect(() => {
        if (!isOpen) return;

        window.history.pushState(null, "", window.location.href);

        const handler = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.addEventListener("popstate", handler);

        return () => {
            window.removeEventListener("popstate", handler);
        };
    }, [isOpen]);

    // Refresh pending documents helper with offline handling
    const refreshPendingDocuments = useCallback(async () => {
        try {
            setError(null);

            const docs = await loadPendingDocuments();

            setPendingDocuments(docs);

            // Pending legal documents exist => lock application
            const shouldLock = docs.length > 0;

            setApplicationLocked(shouldLock);
            setIsOpen(shouldLock);

            // Successful load
            setRetryCount(0);

            return docs;

        } catch (err) {
            console.error("Failed to load legal documents:", err);
            setError("please refresh it or open app again");
            // Lock application on error for security
            setApplicationLocked(true);

            throw err;
        }
    }, [
        loadPendingDocuments,
        setPendingDocuments,
        setIsOpen,
        setApplicationLocked,
    ]);

    // Initialize - load pending documents on mount with offline support
    const initialize = useCallback(async () => {
        // Skip if not authenticated or route is excluded
        if (!isAuthenticated || shouldSkipLegal) {
            setIsLoading(false);
            setApplicationLocked(false);
            setLegalInitialized(true);
            return;
        }

        /*
         * OFFLINE MODE
         *
         * Do not block application.
         * loadPendingDocuments() itself will use cache.
         */
        if (!navigator.onLine) {
            console.log(
                "📴 LegalManager initialized in offline mode"
            );

            setError(null);
            setIsLoading(false);
            setApplicationLocked(false);
            setIsOpen(false);
            setLegalInitialized(true);

            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            await refreshPendingDocuments();

        } catch (err) {
            console.error("Failed to load legal documents:", err);
            setError("please refresh it or app again open");
            // Keep application locked on error for security
            setApplicationLocked(true);

        } finally {
            setIsLoading(false);
            setLegalInitialized(true);
        }
    }, [
        isAuthenticated,
        shouldSkipLegal,
        refreshPendingDocuments,
        setIsLoading,
        setApplicationLocked,
        setLegalInitialized,
        setIsOpen,
    ]);

    // Network recovery - re-initialize when internet comes back
    useEffect(() => {
        const handleOnline = () => {
            if (isAuthenticated && !shouldSkipLegal) {
                console.log(
                    "🌐 Internet restored - refreshing legal documents"
                );
                initialize();
            }
        };

        window.addEventListener("online", handleOnline);
        return () => {
            window.removeEventListener("online", handleOnline);
        };
    }, [isAuthenticated, shouldSkipLegal, initialize]); // ✅ initialize added to dependencies

    // Initialize on mount and when refreshKey changes
    useEffect(() => {
        initialize();
    }, [initialize, refreshKey]); // ✅ initialize added to dependencies

    // Handle view document
    const handleView = (document) => {
        setSelectedDocument(document);
    };

    // Close viewer
    const handleCloseViewer = () => {
        setSelectedDocument(null);
    };

    // Actual API call with signature support and offline handling
    const submitAcceptance = useCallback(async (documents) => {
        // Prevent double submit
        if (accepting) return;

        try {
            setAccepting(true);
            setError(null);

            const payload = documents.map((doc) => {
                const docPayload = {
                    version_id: doc.version_id,
                };

                // Add signature data if document has it
                if (doc.signature) {
                    return {
                        ...docPayload,
                        ...doc.signature, // Future-proof: supports any signature fields
                    };
                }

                return docPayload;
            });

            await acceptDocuments(payload);

            // Clear all states only after REAL success
            setSelectedDocument(null);
            setShowSignatureModal(false);
            setDocumentsToAccept([]);
            setSignatureDocuments([]);
            setCurrentSignatureIndex(0);

            // Refresh after successful acceptance
            await refreshPendingDocuments();

        } catch (err) {
            /*
             * Offline is NOT an application error.
             * Do not show popup.
             */
            if (
                err?.code === "LEGAL_ACCEPTANCE_OFFLINE" ||
                !navigator.onLine
            ) {
                console.log(
                    "📴 Acceptance postponed - offline"
                );

                setError(null);

                return;
            }

            console.error("Accept failed:", err);

            setError(
                "Failed to accept documents. Please try again."
            );
        } finally {
            setAccepting(false);
        }
    }, [
        accepting,
        acceptDocuments,
        refreshPendingDocuments,
    ]);

    // Handle continue button - check for signature requirements
    const handleContinue = useCallback((documents) => {
        // Close viewer if open
        setSelectedDocument(null);

        const signatureDocs = documents.filter(
            (doc) => doc.require_signature
        );

        if (signatureDocs.length > 0) {
            setDocumentsToAccept(documents);
            setSignatureDocuments(signatureDocs);
            setCurrentSignatureIndex(0);
            setShowSignatureModal(true);
            return;
        }

        // No signature required, proceed directly
        submitAcceptance(documents);
    }, [submitAcceptance]);

    // Handle signature save from SignatureModal
    const handleSignatureSave = useCallback(async (signature) => {
        const currentDoc = signatureDocuments[currentSignatureIndex];
        const isLastSignature = currentSignatureIndex === signatureDocuments.length - 1;

        // Update the signature for current document
        const updatedDocuments = documentsToAccept.map((doc) => {
            if (doc.version_id === currentDoc.version_id) {
                return {
                    ...doc,
                    signature: signature,
                };
            }
            return doc;
        });

        if (isLastSignature) {
            // All signatures done, submit acceptance
            setShowSignatureModal(false);
            setSignatureDocuments([]);
            setDocumentsToAccept([]);
            setCurrentSignatureIndex(0);

            await submitAcceptance(updatedDocuments);
        } else {
            // Move to next signature
            setCurrentSignatureIndex(prev => prev + 1);
            setDocumentsToAccept(updatedDocuments);
        }
    }, [signatureDocuments, currentSignatureIndex, documentsToAccept, submitAcceptance]);

    // Handle signature modal close
    const handleSignatureClose = useCallback(() => {
        setShowSignatureModal(false);
        setDocumentsToAccept([]);
        setSignatureDocuments([]);
        setCurrentSignatureIndex(0);
    }, []);

    // Retry function with limit
    const handleRetry = useCallback(() => {
        if (retryCount >= MAX_RETRIES) {
            setError("Unable to load legal documents after multiple attempts. Please contact support.");
            return;
        }
        setRetryCount(prev => prev + 1);
        setError(null);
        initialize();
    }, [retryCount, initialize]);

    // Don't render if not authenticated or route is excluded
    if (!isAuthenticated || shouldSkipLegal) {
        return null;
    }

    // Show loader while checking documents
    if (isLoading) {
        return (
            <LegalLoader
                message="loading.........."
            />
        );
    }

    // Show error with retry (application stays locked)
    if (error && !isLoading) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorBox}>
                    <span style={styles.errorIcon}>⚠️</span>
                    <p style={styles.errorText}>{error}</p>
                    {retryCount < MAX_RETRIES ? (
                        <button
                            style={styles.retryButton}
                            onClick={handleRetry}
                        >
                            Retry ({retryCount}/{MAX_RETRIES})
                        </button>
                    ) : (
                        <p style={styles.supportText}>
                            Please contact support for assistance.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Don't render anything if no pending documents
    if (!isOpen) return null;

    // Get current signature document
    const currentSignatureDoc = signatureDocuments[currentSignatureIndex] || null;

    return (
        <>
            <LegalConsentModal
                documents={pendingDocuments}
                loading={accepting}
                onView={handleView}
                onContinue={handleContinue}
            />

            {selectedDocument && (
                <LegalDocumentViewer
                    document={selectedDocument}
                    onClose={handleCloseViewer}
                />
            )}

            <SignatureModal
                open={showSignatureModal}
                loading={accepting}
                documentTitle={
                    currentSignatureDoc?.title || "Document"
                }
                documentCount={signatureDocuments.length}
                currentIndex={currentSignatureIndex}
                onClose={handleSignatureClose}
                onSave={handleSignatureSave}
            />
        </>
    );
}

const styles = {
    errorContainer: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999999,
        padding: "20px",
    },
    errorBox: {
        background: "#fff",
        padding: "40px",
        borderRadius: 12,
        maxWidth: 400,
        width: "100%",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,.3)",
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 16,
        display: "block",
    },
    errorText: {
        fontSize: 16,
        color: "#64748b",
        marginBottom: 24,
        marginTop: 0,
        lineHeight: 1.5,
    },
    retryButton: {
        padding: "12px 32px",
        background: "#2563eb",
        color: "#fff",
        border: 0,
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        transition: "all 0.2s",
        ":hover": {
            background: "#1d4ed8",
        },
    },
    supportText: {
        color: "#ef4444",
        fontSize: 14,
        margin: 0,
    },
};