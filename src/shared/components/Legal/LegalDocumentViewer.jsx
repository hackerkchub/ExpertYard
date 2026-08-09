import { useEffect, useState, useCallback } from "react";
import useLegalBasePath from "../../hooks/useLegalBasePath";
import { getLegalDocumentContentApi } from "../../api/legal.api";
import LegalLoader from "./LegalLoader";

export default function LegalDocumentViewer({
    document: legalDocument,
    onClose,
}) {
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");
    const [metadata, setMetadata] = useState(null);
    const [error, setError] = useState("");
    
    // Get base path for legal documents
    const basePath = useLegalBasePath();

    // Debug logging
    console.log("🔍 LegalDocumentViewer Debug:");
    console.log("basePath:", basePath);
    console.log("slug:", legalDocument?.slug);
    console.log("full document:", legalDocument);

    // Body scroll lock - using window.document to avoid conflict
    useEffect(() => {
        window.document.body.style.overflow = "hidden";
        return () => {
            window.document.body.style.overflow = "";
        };
    }, []);

    // ESC key to close
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const loadDocument = useCallback(async () => {
        if (!legalDocument?.slug) {
            console.error("❌ No slug found in legalDocument:", legalDocument);
            setError("Document not found.");
            setLoading(false);
            return;
        }

        let mounted = true;

        try {
            setLoading(true);
            setError("");

            console.log("📄 Fetching document:", {
                basePath,
                slug: legalDocument.slug,
                url: `${basePath}/documents/${legalDocument.slug}/content`
            });

            // Fix: Pass both basePath and slug
            const res = await getLegalDocumentContentApi(
                basePath,
                legalDocument.slug
            );

            console.log("✅ Document loaded successfully:", res.data);

            if (mounted) {
                setMetadata(res.data);
                setContent(res.data.content || "");
            }

        } catch (err) {
            console.error("❌ Failed to load document:", err);
            console.error("Error details:", {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
                basePath,
                slug: legalDocument.slug
            });
            if (mounted) {
                setError("Unable to load document. Please try again.");
            }
        } finally {
            if (mounted) {
                setLoading(false);
            }
        }

        return () => {
            mounted = false;
        };
    }, [legalDocument?.slug, basePath]);

    useEffect(() => {
        if (legalDocument?.slug) {
            loadDocument();
        } else {
            console.warn("⚠️ No slug available, skipping document load");
        }
    }, [legalDocument?.slug, loadDocument]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.title}>
                            {metadata?.title || legalDocument?.title || "Document"}
                        </h2>
                        <div style={styles.meta}>
                            Version {metadata?.version_number || legalDocument?.version_number}
                            {metadata?.published_at && (
                                <>
                                    <span style={styles.dot}>•</span>
                                    <span>Published {formatDate(metadata.published_at)}</span>
                                </>
                            )}
                            {metadata?.updated_at && metadata?.updated_at !== metadata?.published_at && (
                                <>
                                    <span style={styles.dot}>•</span>
                                    <span>Updated {formatDate(metadata.updated_at)}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        style={styles.close}
                        onClick={onClose}
                        aria-label="Close document viewer"
                    >
                        ✕
                    </button>
                </div>

                {loading ? (
                    <div style={styles.loaderContainer}>
                        <LegalLoader 
                            message="Loading document..."
                            size="medium"
                        />
                    </div>
                ) : error ? (
                    <div style={styles.errorContainer}>
                        <span style={styles.errorIcon}>⚠️</span>
                        <p style={styles.errorText}>{error}</p>
                        <button
                            style={styles.retryButton}
                            onClick={loadDocument}
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div
                        style={styles.content}
                        className="legal-document"
                        dangerouslySetInnerHTML={{
                            __html: content || "<p>No document content available.</p>"
                        }}
                    />
                )}

                <div style={styles.footer}>
                    <button
                        style={styles.closeButton}
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999999,
        padding: "20px",
    },
    modal: {
        width: "95%",
        maxWidth: "950px",
        height: "90vh",
        background: "#fff",
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,.3)",
    },
    header: {
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "20px 24px",
        borderBottom: "1px solid #e2e8f0",
        flexShrink: 0,
    },
    title: {
        margin: 0,
        fontSize: 22,
        fontWeight: 600,
        color: "#0f172a",
    },
    meta: {
        marginTop: 6,
        color: "#64748b",
        fontSize: 14,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 4,
    },
    dot: {
        margin: "0 6px",
        color: "#94a3b8",
    },
    close: {
        border: 0,
        background: "transparent",
        cursor: "pointer",
        fontSize: 24,
        color: "#64748b",
        padding: "4px 8px",
        borderRadius: 6,
        transition: "all 0.2s",
        ":hover": {
            background: "#f1f5f9",
            color: "#0f172a",
        },
    },
    loaderContainer: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
    },
    errorContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        color: "#ef4444",
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 16,
        color: "#64748b",
        marginBottom: 20,
    },
    retryButton: {
        padding: "10px 24px",
        background: "#2563eb",
        color: "#fff",
        border: 0,
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 500,
        transition: "all 0.2s",
        ":hover": {
            background: "#1d4ed8",
        },
    },
    content: {
        flex: 1,
        overflowY: "auto",
        padding: "30px 40px",
        lineHeight: 1.8,
        fontSize: 15,
        color: "#1e293b",
    },
    footer: {
        position: "sticky",
        bottom: 0,
        background: "#fff",
        borderTop: "1px solid #e2e8f0",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "flex-end",
        flexShrink: 0,
    },
    closeButton: {
        padding: "10px 32px",
        background: "#f1f5f9",
        color: "#475569",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 500,
        transition: "all 0.2s",
        ":hover": {
            background: "#e2e8f0",
            borderColor: "#94a3b8",
        },
    },
};