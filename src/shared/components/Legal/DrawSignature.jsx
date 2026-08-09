import { useEffect, useRef, useState } from "react";

export default function DrawSignature({
    value = null,
    onChange,
}) {

    const canvasRef = useRef(null);

    const drawing = useRef(false);

    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {

        const canvas = canvasRef.current;

        const ctx = canvas.getContext("2d");

        const ratio = window.devicePixelRatio || 1;

        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = 220 * ratio;

        ctx.scale(ratio, ratio);

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#111827";

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.offsetWidth, 220);

    }, []);

    useEffect(() => {

        if (!canvasRef.current) return;

        onChange?.({

            signature_type: "DRAW",

            signature_image: hasSignature
                ? canvasRef.current.toDataURL("image/png")
                : "",

            valid: hasSignature,

        });

    }, [hasSignature, onChange]);

    const getPoint = (event) => {

        const canvas = canvasRef.current;

        const rect = canvas.getBoundingClientRect();

        if (event.touches?.length) {

            return {

                x: event.touches[0].clientX - rect.left,

                y: event.touches[0].clientY - rect.top,

            };

        }

        return {

            x: event.nativeEvent.offsetX,

            y: event.nativeEvent.offsetY,

        };

    };

    const startDraw = (event) => {

        drawing.current = true;

        const point = getPoint(event);

        const ctx = canvasRef.current.getContext("2d");

        ctx.beginPath();

        ctx.moveTo(point.x, point.y);

    };

    const draw = (event) => {

        if (!drawing.current) return;

        event.preventDefault();

        const point = getPoint(event);

        const ctx = canvasRef.current.getContext("2d");

        ctx.lineTo(point.x, point.y);

        ctx.stroke();

        setHasSignature(true);

    };

    const stopDraw = () => {

        drawing.current = false;

    };

    const clearCanvas = () => {

        const canvas = canvasRef.current;

        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#fff";

        ctx.fillRect(0, 0, canvas.offsetWidth, 220);

        setHasSignature(false);

    };

    return (

        <div style={styles.wrapper}>

            <div style={styles.header}>

                <span style={styles.label}>
                    Draw Your Signature
                </span>

                <button
                    type="button"
                    onClick={clearCanvas}
                    style={styles.clear}
                >
                    Clear
                </button>

            </div>

            <canvas

                ref={canvasRef}

                style={styles.canvas}

                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}

                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}

            />

        </div>

    );

}

const styles = {

    wrapper: {

        display: "flex",

        flexDirection: "column",

        gap: 10,

    },

    header: {

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

    },

    label: {

        fontWeight: 600,

    },

    clear: {

        border: 0,

        background: "#ef4444",

        color: "#fff",

        padding: "8px 14px",

        borderRadius: 6,

        cursor: "pointer",

    },

    canvas: {

        width: "100%",

        height: 220,

        border: "1px solid #d1d5db",

        borderRadius: 10,

        background: "#fff",

        touchAction: "none",

        cursor: "crosshair",

    },

};