export default function LegalCheckbox({
    checked,
    document,
    onChange,
    onView
}) {
    return (
        <div style={styles.container}>
            <label style={styles.left}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onChange(document)}
                    style={styles.checkbox}
                />

                <div>
                    <div style={styles.title}>
                        {document.title}
                    </div>

                    <div style={styles.meta}>
                        Version {document.version_number}

                        {document.require_signature && (
                            <span style={styles.signature}>
                                Signature Required
                            </span>
                        )}
                    </div>
                </div>
            </label>

            <button
                onClick={() => onView(document)}
                style={styles.viewButton}
            >
                View
            </button>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        background: "#f8fafc",
        borderRadius: 8,
        border: "1px solid #e2e8f0",
        marginBottom: 10,
        transition: "all 0.2s",
    },
    left: {
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        cursor: "pointer",
        flex: 1,
    },
    checkbox: {
        marginTop: 2,
        width: 18,
        height: 18,
        cursor: "pointer",
        flexShrink: 0,
    },
    title: {
        fontSize: 15,
        fontWeight: 600,
        color: "#0f172a",
        marginBottom: 4,
    },
    meta: {
        fontSize: 13,
        color: "#64748b",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
    },
    signature: {
        background: "#fef3c7",
        color: "#92400e",
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.3px",
        display: "inline-block",
    },
    viewButton: {
        padding: "6px 16px",
        background: "transparent",
        border: "1px solid #cbd5e1",
        borderRadius: 6,
        color: "#475569",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s",
        flexShrink: 0,
        marginLeft: 12,
        ":hover": {
            background: "#f1f5f9",
            borderColor: "#94a3b8",
        },
    },
};