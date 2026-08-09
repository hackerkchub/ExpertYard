import { useEffect, useState } from "react";
import TypeSignature from "./TypeSignature";
import DrawSignature from "./DrawSignature";
import UploadSignature from "./UploadSignature";

const TABS = {
    TYPE: "TYPE",
    DRAW: "DRAW",
    UPLOAD: "UPLOAD",
};

export default function SignatureModal({
    open,
    onClose,
    onSave,
    documentTitle,
    loading = false,
}) {
    const [activeTab, setActiveTab] = useState(TABS.TYPE);
    const [signatureData, setSignatureData] = useState(null);

    // Reset signature on modal open
    useEffect(() => {
        if (open) {
            setActiveTab(TABS.TYPE);
            setSignatureData(null);
        }
    }, [open]);

    // ESC key support
    useEffect(() => {
        if (!open) return;

        const handleEsc = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [open, onClose]);

    if (!open) return null;

    const handleSubmit = () => {
        if (!signatureData?.valid) return;
        onSave(signatureData);
    };

    const isSubmitDisabled = loading || !signatureData || !signatureData.valid;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 style={styles.title}>
                    Electronic Signature Required
                </h2>

                <p style={styles.text}>
                    Please provide your signature using one of the methods below.
                </p>

                <div style={styles.documentBadge}>
                    {documentTitle}
                </div>

                {/* Tabs */}
                <div style={styles.tabs}>
                    <button
                        onClick={() => setActiveTab(TABS.TYPE)}
                        style={{
                            ...styles.tab,
                            ...(activeTab === TABS.TYPE ? styles.activeTab : {})
                        }}
                    >
                        Type
                    </button>
                    <button
                        onClick={() => setActiveTab(TABS.DRAW)}
                        style={{
                            ...styles.tab,
                            ...(activeTab === TABS.DRAW ? styles.activeTab : {})
                        }}
                    >
                        Draw
                    </button>
                    <button
                        onClick={() => setActiveTab(TABS.UPLOAD)}
                        style={{
                            ...styles.tab,
                            ...(activeTab === TABS.UPLOAD ? styles.activeTab : {})
                        }}
                    >
                        Upload
                    </button>
                </div>

                {/* Dynamic Signature Component */}
                <div style={styles.signatureContainer}>
                    {activeTab === TABS.TYPE && (
                        <TypeSignature
                            value={signatureData}
                            onChange={setSignatureData}
                        />
                    )}

                    {activeTab === TABS.DRAW && (
                        <DrawSignature
                            value={signatureData}
                            onChange={setSignatureData}
                        />
                    )}

                    {activeTab === TABS.UPLOAD && (
                        <UploadSignature
                            value={signatureData}
                            onChange={setSignatureData}
                        />
                    )}
                </div>

                <div style={styles.footer}>
                    <button
                        disabled={loading}
                        style={styles.cancel}
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        disabled={isSubmitDisabled}
                        onClick={handleSubmit}
                        style={{
                            ...styles.save,
                            ...(isSubmitDisabled ? styles.disabled : {})
                        }}
                    >
                        {loading ? "Saving..." : "Save Signature"}
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
        background: "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999999,
        padding: "20px",
    },
    modal: {
        width: "100%",
        maxWidth: 500,
        background: "#fff",
        padding: 25,
        borderRadius: 12,
        margin: 20,
        boxSizing: "border-box",
        maxHeight: "90vh",
        overflowY: "auto",
    },
    title: {
        marginBottom: 10,
        fontSize: 22,
        fontWeight: 600,
        color: "#111",
    },
    text: {
        color: "#666",
        marginBottom: 20,
        lineHeight: 1.5,
    },
    documentBadge: {
        background: "#eef2ff",
        padding: "10px 14px",
        borderRadius: 8,
        marginBottom: 18,
        fontWeight: 600,
        color: "#1d4ed8",
        wordBreak: "break-word",
    },
    tabs: {
        display: "flex",
        marginBottom: 20,
        borderBottom: "1px solid #eee",
        borderRadius: 8,
        overflow: "hidden",
    },
    tab: {
        flex: 1,
        padding: "12px 16px",
        border: 0,
        background: "#f8fafc",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 14,
        color: "#64748b",
        transition: "all 0.2s",
        ":hover": {
            background: "#f1f5f9",
        },
    },
    activeTab: {
        background: "#2563eb",
        color: "#fff",
        ":hover": {
            background: "#1d4ed8",
        },
    },
    signatureContainer: {
        marginBottom: 25,
        minHeight: 150,
    },
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 10,
    },
    cancel: {
        padding: "10px 18px",
        border: "1px solid #ddd",
        background: "#fff",
        cursor: "pointer",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        color: "#333",
        transition: "all 0.2s",
        ":hover": {
            background: "#f8fafc",
        },
    },
    save: {
        padding: "10px 18px",
        border: 0,
        background: "#2563eb",
        color: "#fff",
        cursor: "pointer",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        transition: "all 0.2s",
        minWidth: "120px",
        ":hover": {
            background: "#1d4ed8",
        },
    },
    disabled: {
        opacity: 0.6,
        cursor: "not-allowed",
        ":hover": {
            background: "#2563eb",
        },
    },
};