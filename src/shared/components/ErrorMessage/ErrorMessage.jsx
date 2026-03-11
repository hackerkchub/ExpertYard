import React, { useEffect, useState } from "react";

export default function ErrorMessage({
  message,
  autoHideDuration = 5000,
  dismissible = true
}) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (!message) return;

    setVisible(true);

    if (autoHideDuration) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [message, autoHideDuration]);

  if (!message || !visible) return null;

  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(90deg,#fee2e2,#fecaca)",
        border: "1px solid #f87171",
        color: "#7f1d1d",
        padding: "12px 14px",
        borderRadius: "10px",
        marginBottom: "16px",
        fontSize: "14px",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        boxShadow: "0 6px 16px rgba(248,113,113,0.15)",
        animation: "fadeSlide 0.25s ease"
      }}
    >
      <span>{message}</span>

      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#7f1d1d",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          ×
        </button>
      )}

      <style>
        {`
          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateY(-6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}