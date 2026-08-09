import { useEffect, useMemo, useState } from "react";
import LegalCheckbox from "./LegalCheckbox";

export default function LegalConsentModal({
    documents = [],
    onView,
    onContinue,
    loading = false,
}) {
    const [checkedDocuments, setCheckedDocuments] = useState({});

    // Reset checkboxes when documents change
    useEffect(() => {
        const initial = {};
        documents.forEach(doc => {
            initial[doc.version_id] = false;
        });
        setCheckedDocuments(initial);
    }, [documents]);

    // Body scroll lock
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // Disable Escape key
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
            }
        };
        window.addEventListener("keydown", handler);
        return () => {
            window.removeEventListener("keydown", handler);
        };
    }, []);

    // Toggle checkbox for a document
    const toggleCheckbox = (document) => {
        setCheckedDocuments(prev => ({
            ...prev,
            [document.version_id]: !prev[document.version_id]
        }));
    };

    // Check if all documents are accepted
    const allChecked = useMemo(() => {
        if (documents.length === 0) return false;
        return documents.every(doc => checkedDocuments[doc.version_id]);
    }, [documents, checkedDocuments]);

    // Get selected count
    const selectedCount = useMemo(() => {
        return Object.values(checkedDocuments).filter(Boolean).length;
    }, [checkedDocuments]);

    // Handle continue button click
    const handleContinue = () => {
        const selected = documents.filter(
            doc => checkedDocuments[doc.version_id]
        );
        
        if (!selected.length) return;
        onContinue(selected);
    };

    // Show empty state
    if (documents.length === 0) {
        return (
            <div style={styles.overlay}>
                <div style={styles.modal}>
                    <div style={styles.empty}>
                        <span style={styles.emptyIcon}>✅</span>
                        <p style={styles.emptyText}>
                            No pending legal documents.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>
                        Legal Documents
                    </h2>

                    <p style={styles.subtitle}>
                        Before continuing, please review and accept all required legal documents.
                    </p>
                </div>

                <div style={styles.list}>
                    {documents.map(doc => (
                        <LegalCheckbox
                            key={doc.version_id}
                            document={doc}
                            checked={checkedDocuments[doc.version_id] || false}
                            onChange={toggleCheckbox}
                            onView={onView}
                        />
                    ))}
                </div>

                <div style={styles.footer}>
                    <div style={styles.footerInfo}>
                        <span style={styles.documentCount}>
                            {documents.length} document{documents.length > 1 ? 's' : ''} required
                        </span>
                    </div>

                    <button
                        disabled={!allChecked || loading}
                        onClick={handleContinue}
                        style={{
                            ...styles.continueBtn,
                            ...((!allChecked || loading) ? styles.continueBtnDisabled : {})
                        }}
                    >
                        {loading 
                            ? "Saving Acceptance..." 
                            : `Continue (${selectedCount}/${documents.length})`
                        }
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
        zIndex: 999999,
    },
    modal: {
        width: "95%",
        maxWidth: 650,
        background: "#fff",
        borderRadius: 12,
        padding: 30,
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        flexShrink: 0,
    },
    title: {
        fontSize: 24,
        fontWeight: 600,
        color: "#0f172a",
        marginBottom: 8,
        marginTop: 0,
    },
    subtitle: {
        color: "#64748b",
        fontSize: 15,
        marginBottom: 0,
        marginTop: 0,
        lineHeight: 1.5,
    },
    list: {
        overflowY: "auto",
        margin: "20px 0",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        flex: 1,
        paddingRight: 4,
    },
    footer: {
        borderTop: "1px solid #e2e8f0",
        paddingTop: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        flexShrink: 0,
        background: "#fff",
    },
    footerInfo: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    documentCount: {
        fontSize: 13,
        color: "#64748b",
        fontWeight: 500,
    },
    continueBtn: {
        width: "100%",
        height: 48,
        background: "#2563eb",
        color: "#fff",
        border: 0,
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 15,
        fontWeight: 600,
        transition: "all 0.2s",
    },
    continueBtnDisabled: {
        opacity: 0.5,
        cursor: "not-allowed",
    },
    empty: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: "#64748b",
        margin: 0,
    },
};