import React, { useState } from "react";

export default function AiPasteModal({ open, onClose, onImport }) {
    const [text, setText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    if (!open) return null;

    const handleImport = () => {
        if (!text.trim()) return;
        setIsProcessing(true);
        try {
            onImport(text);
            setText("");
            onClose();
        } catch (error) {
            console.error("Import failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>✨ AI Paste</h2>
                    <button style={styles.closeButton} onClick={onClose}>✕</button>
                </div>

                <div style={styles.body}>
                    <p style={styles.description}>
                        Paste your content from ChatGPT, Markdown, or any text source.
                        The editor will automatically detect the format and convert it.
                    </p>

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your content here..."
                        style={styles.textarea}
                        autoFocus
                    />

                    <div style={styles.hint}>
                        <span>📌 Supports: Markdown, HTML, Plain Text</span>
                    </div>
                </div>

                <div style={styles.footer}>
                    <button style={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        style={{
                            ...styles.importButton,
                            ...(!text.trim() || isProcessing ? styles.importButtonDisabled : {})
                        }}
                        onClick={handleImport}
                        disabled={!text.trim() || isProcessing}
                    >
                        {isProcessing ? "Processing..." : "✨ Import & Format"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "20px"
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: "16px",
        maxWidth: "600px",
        width: "100%",
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 24px",
        borderBottom: "1px solid #e5e7eb"
    },
    title: {
        fontSize: "20px",
        fontWeight: "600",
        color: "#1a2332",
        margin: 0,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },
    closeButton: {
        padding: "4px 8px",
        border: "none",
        background: "none",
        fontSize: "20px",
        color: "#6b7280",
        cursor: "pointer"
    },
    body: {
        padding: "24px",
        flex: 1,
        overflow: "auto"
    },
    description: {
        fontSize: "14px",
        color: "#6b7280",
        margin: "0 0 16px 0",
        lineHeight: "1.6"
    },
    textarea: {
        width: "100%",
        minHeight: "200px",
        padding: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        fontSize: "14px",
        fontFamily: "inherit",
        resize: "vertical",
        outline: "none",
        transition: "border-color 0.2s",
        lineHeight: "1.6"
    },
    hint: {
        marginTop: "12px",
        fontSize: "13px",
        color: "#6b7280",
        padding: "8px 12px",
        backgroundColor: "#f8fafc",
        borderRadius: "6px"
    },
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        padding: "16px 24px",
        borderTop: "1px solid #e5e7eb"
    },
    cancelButton: {
        padding: "10px 20px",
        backgroundColor: "#f3f4f6",
        color: "#1a2332",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "background-color 0.2s"
    },
    importButton: {
        padding: "10px 20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "opacity 0.2s"
    },
    importButtonDisabled: {
        opacity: 0.5,
        cursor: "not-allowed"
    }
};