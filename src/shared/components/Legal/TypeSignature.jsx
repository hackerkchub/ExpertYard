import { useEffect, useState } from "react";

export default function TypeSignature({
    value = null,
    onChange,
}) {

    const [signatureName, setSignatureName] = useState(
        value?.signature_name || ""
    );

    useEffect(() => {

        onChange?.({

            signature_type: "TYPE",

            signature_name: signatureName.trim(),

            valid: signatureName.trim().length >= 2,

        });

    }, [signatureName, onChange]);

    return (

        <div style={styles.container}>

            <label style={styles.label}>
                Type Your Full Name
            </label>

            <input
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="Enter your full name"
                style={styles.input}
                autoComplete="off"
            />

            <div style={styles.previewBox}>

                <div style={styles.previewLabel}>
                    Signature Preview
                </div>

                <div style={styles.signature}>

                    {
                        signatureName.trim()

                            ? signatureName

                            : "Your Signature"
                    }

                </div>

            </div>

        </div>

    );

}

const styles = {

    container: {

        display: "flex",

        flexDirection: "column",

        gap: 15,

    },

    label: {

        fontWeight: 600,

        color: "#111827",

    },

    input: {

        padding: "12px 14px",

        border: "1px solid #d1d5db",

        borderRadius: 8,

        fontSize: 15,

        outline: "none",

        boxSizing: "border-box",

    },

    previewBox: {

        border: "1px dashed #cbd5e1",

        borderRadius: 10,

        padding: 20,

        background: "#fafafa",

    },

    previewLabel: {

        fontSize: 13,

        color: "#6b7280",

        marginBottom: 12,

    },

    signature: {

        minHeight: 45,

        display: "flex",

        alignItems: "center",

        fontSize: 28,

        fontFamily: "cursive",

        color: "#111827",

    },

};