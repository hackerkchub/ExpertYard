import { useEffect, useState } from "react";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const VALID_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
];

export default function UploadSignature({
    value = null,
    onChange,
}) {

    const [preview, setPreview] = useState(
        value?.signature_image || ""
    );

    const [error, setError] = useState("");

    useEffect(() => {

        onChange?.({

            signature_type: "UPLOAD",

            signature_image: preview,

            valid: !!preview,

        });

    }, [preview, onChange]);

    const handleFile = (file) => {

        if (!file) return;

        if (!VALID_TYPES.includes(file.type)) {

            setError("Only PNG, JPG and JPEG are allowed.");

            return;

        }

        if (file.size > MAX_FILE_SIZE) {

            setError("Maximum file size is 2 MB.");

            return;

        }

        setError("");

        const reader = new FileReader();

        reader.onload = () => {

            setPreview(reader.result);

        };

        reader.readAsDataURL(file);

    };

    const removeImage = () => {

        setPreview("");

        setError("");

    };

    return (

        <div style={styles.wrapper}>

            <label style={styles.label}>

                Upload Signature

            </label>

            <input
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                onChange={(e) => handleFile(e.target.files[0])}
            />

            {

                error && (

                    <div style={styles.error}>

                        {error}

                    </div>

                )

            }

            {

                preview && (

                    <div style={styles.previewWrapper}>

                        <img
                            src={preview}
                            alt="Signature Preview"
                            style={styles.image}
                        />

                        <button
                            type="button"
                            style={styles.remove}
                            onClick={removeImage}
                        >

                            Remove

                        </button>

                    </div>

                )

            }

        </div>

    );

}

const styles = {

    wrapper: {

        display: "flex",

        flexDirection: "column",

        gap: 14,

    },

    label: {

        fontWeight: 600,

        color: "#111827",

    },

    error: {

        color: "#dc2626",

        fontSize: 14,

    },

    previewWrapper: {

        border: "1px solid #e5e7eb",

        borderRadius: 10,

        padding: 15,

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        gap: 15,

        background: "#fafafa",

    },

    image: {

        maxWidth: "100%",

        maxHeight: 180,

        objectFit: "contain",

    },

    remove: {

        border: 0,

        padding: "10px 18px",

        borderRadius: 8,

        background: "#ef4444",

        color: "#fff",

        cursor: "pointer",

    },

};