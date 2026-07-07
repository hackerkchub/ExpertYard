import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  diagnoseMediaAccess,
  getBrowserInfo,
  isMediaDevicesSupported,
  isSecureMediaContext,
  stopMediaStream,
} from "../webrtc/mediaPermissions";

const pageStyle = {
  minHeight: "100dvh",
  background: "#07111f",
  color: "#e5eefb",
  padding: 20,
  boxSizing: "border-box",
};

const panelStyle = {
  maxWidth: 840,
  margin: "0 auto",
  border: "1px solid rgba(148,163,184,.28)",
  borderRadius: 16,
  padding: 18,
  background: "rgba(15,23,42,.92)",
  display: "grid",
  gap: 14,
};

const buttonStyle = {
  border: 0,
  borderRadius: 12,
  padding: "11px 14px",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

export default function VideoMediaTestPage({ role = "diagnostic" }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const browser = useMemo(() => getBrowserInfo(), []);
  const [secure, setSecure] = useState(false);
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState("Ready to test camera and microphone.");
  const [result, setResult] = useState(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setSecure(isSecureMediaContext());
    setSupported(isMediaDevicesSupported());
    return () => stopMediaStream(streamRef.current);
  }, []);

  const stopTest = () => {
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("Camera and microphone test stopped.");
  };

  const runTest = async () => {
    stopTest();
    setTesting(true);
    setStatus("Requesting camera and microphone...");
    const diagnostic = await diagnoseMediaAccess({ role });
    setResult(diagnostic);
    setTesting(false);

    if (diagnostic.ok) {
      streamRef.current = diagnostic.stream;
      if (videoRef.current) {
        videoRef.current.srcObject = diagnostic.stream;
        videoRef.current.play?.().catch(() => {});
      }
      setStatus("Camera and microphone are working.");
      return;
    }

    setStatus(diagnostic.message);
  };

  return (
    <main style={pageStyle}>
      <section style={panelStyle}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Video Media Test</h1>
        <p style={{ margin: 0, color: "#cbd5e1" }}>
          Use this page on the same URL where you will test video calls. Camera and microphone require HTTPS except localhost.
        </p>

        <div style={{ display: "grid", gap: 6, fontSize: 14 }}>
          <div><strong>Origin:</strong> {window.location.origin}</div>
          <div><strong>Secure context:</strong> {String(secure)}</div>
          <div><strong>Media support:</strong> {String(supported)}</div>
          <div><strong>Browser:</strong> {browser.name}</div>
        </div>

        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          style={{
            width: "min(420px, 100%)",
            aspectRatio: "4 / 3",
            borderRadius: 14,
            background: "#020817",
            objectFit: "cover",
            border: "1px solid rgba(148,163,184,.28)",
          }}
        />

        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: result?.ok ? "rgba(34,197,94,.16)" : "rgba(59,130,246,.16)",
            color: result?.ok ? "#bbf7d0" : "#bfdbfe",
            fontWeight: 700,
          }}
        >
          {status}
        </div>

        {result?.debug && (
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: "rgba(2,8,23,.72)",
              borderRadius: 12,
              padding: 12,
              color: "#cbd5e1",
              fontSize: 12,
            }}
          >
            {JSON.stringify(result.debug, null, 2)}
          </pre>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={buttonStyle} disabled={testing} onClick={runTest}>
            {testing ? "Testing..." : "Test Camera & Microphone"}
          </button>
          <button type="button" style={{ ...buttonStyle, background: "#475569" }} onClick={stopTest}>
            Stop Test
          </button>
        </div>
      </section>
    </main>
  );
}
