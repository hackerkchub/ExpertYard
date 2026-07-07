import React from "react";
import { FiCamera, FiCameraOff, FiMic, FiMicOff, FiPhoneOff, FiRefreshCw } from "react-icons/fi";

const styles = {
  page: {
    minHeight: "100dvh",
    background: "#07111f",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    boxSizing: "border-box",
  },
  shell: {
    width: "min(1180px, 100%)",
    height: "min(760px, calc(100dvh - 32px))",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 280px",
    gap: 16,
  },
  videoStage: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 18,
    background: "#020817",
    border: "1px solid rgba(255,255,255,.12)",
  },
  remoteVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    background: "#020817",
  },
  localPreview: {
    position: "absolute",
    right: 16,
    top: 16,
    width: "min(180px, 32vw)",
    aspectRatio: "9 / 16",
    borderRadius: 14,
    objectFit: "cover",
    background: "#0f172a",
    border: "2px solid rgba(255,255,255,.7)",
  },
  topBar: {
    position: "absolute",
    left: 16,
    top: 16,
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(2,8,23,.72)",
    backdropFilter: "blur(10px)",
    fontWeight: 700,
  },
  controls: {
    position: "absolute",
    left: "50%",
    bottom: 24,
    transform: "translateX(-50%)",
    display: "flex",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 999,
    background: "rgba(2,8,23,.72)",
    backdropFilter: "blur(12px)",
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 999,
    border: 0,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,.14)",
    color: "#fff",
    cursor: "pointer",
    fontSize: 20,
  },
  danger: { background: "#ef4444" },
  panel: {
    borderRadius: 18,
    padding: 18,
    background: "rgba(15,23,42,.92)",
    border: "1px solid rgba(255,255,255,.12)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  status: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(59,130,246,.16)",
    color: "#bfdbfe",
    fontWeight: 700,
  },
  summary: {
    marginTop: "auto",
    padding: 12,
    borderRadius: 12,
    background: "rgba(255,255,255,.08)",
    lineHeight: 1.6,
  },
};

export default function VideoCallRoom({
  title = "Video Call",
  status = "Connecting",
  seconds = 0,
  localVideoRef,
  remoteVideoRef,
  muted,
  cameraOff,
  connectionState,
  billing,
  onToggleMute,
  onToggleCamera,
  onSwitchCamera,
  onEnd,
  onRetryPermission,
}) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <main style={styles.page}>
      <section style={styles.shell} className="video-call-shell">
        <div style={styles.videoStage}>
          <video ref={remoteVideoRef} style={styles.remoteVideo} playsInline autoPlay />
          <video ref={localVideoRef} style={styles.localPreview} playsInline autoPlay muted />
          <div style={styles.topBar}>{mm}:{ss} · {status}</div>
          <div style={styles.controls}>
            <button type="button" style={styles.button} onClick={onToggleMute} aria-label={muted ? "Unmute" : "Mute"}>
              {muted ? <FiMicOff /> : <FiMic />}
            </button>
            <button type="button" style={styles.button} onClick={onToggleCamera} aria-label={cameraOff ? "Camera on" : "Camera off"}>
              {cameraOff ? <FiCameraOff /> : <FiCamera />}
            </button>
            <button type="button" style={styles.button} onClick={onSwitchCamera} aria-label="Switch camera">
              <FiRefreshCw />
            </button>
            <button type="button" style={{ ...styles.button, ...styles.danger }} onClick={onEnd} aria-label="End call">
              <FiPhoneOff />
            </button>
          </div>
        </div>
        <aside style={styles.panel}>
          <h1 style={{ margin: 0, fontSize: 24 }}>{title}</h1>
          <div style={styles.status}>{connectionState || status}</div>
          {onRetryPermission && (
            <button
              type="button"
              onClick={onRetryPermission}
              style={{
                border: "1px solid rgba(147,197,253,.45)",
                borderRadius: 12,
                padding: "10px 12px",
                background: "rgba(37,99,235,.18)",
                color: "#dbeafe",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Retry Permission
            </button>
          )}
          <p style={{ margin: 0, color: "#cbd5e1" }}>
            Keep this screen open. Billing starts after both participants are connected and is finalized by the server.
          </p>
          {billing?.lowBalance && (
            <div style={{ ...styles.status, background: "rgba(245,158,11,.18)", color: "#fde68a" }}>
              Wallet balance is low. The call may end automatically.
            </div>
          )}
          {billing?.summary && (
            <div style={styles.summary}>
              <strong>Final summary</strong><br />
              Duration: {billing.summary.duration_seconds || 0}s<br />
              Amount: ₹{Number(billing.summary.gross_amount || billing.summary.user_wallet_debited || 0).toFixed(2)}<br />
              Reason: {billing.summary.end_reason || "ended"}
            </div>
          )}
        </aside>
      </section>
      <style>{`
        @media (max-width: 767px) {
          .video-call-shell {
            height: 100dvh !important;
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          .video-call-shell aside {
            position: absolute;
            left: 12px;
            right: 12px;
            bottom: calc(env(safe-area-inset-bottom, 0px) + 96px);
            padding: 12px !important;
            background: rgba(2,8,23,.58) !important;
            backdrop-filter: blur(10px);
          }
        }
      `}</style>
    </main>
  );
}
