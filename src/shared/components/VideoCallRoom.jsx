import React from "react";
import { FiCamera, FiCameraOff, FiMic, FiMicOff, FiPhoneOff, FiRefreshCw } from "react-icons/fi";

const formatTime = (seconds = 0) => {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

const isActiveStatus = (status, connectionState) => {
  const normalizedStatus = String(status || "").toLowerCase();
  const normalizedConnection = String(connectionState || "").toLowerCase();
  return (
    normalizedStatus === "connected" ||
    normalizedConnection === "connected" ||
    normalizedConnection === "completed"
  );
};

const isPermissionIssue = (status) => {
  const value = String(status || "").toLowerCase();
  return (
    value.includes("permission") ||
    value.includes("camera") ||
    value.includes("microphone") ||
    value.includes("device") ||
    value.includes("https") ||
    value.includes("access")
  );
};

const getCompactStatus = (status, connectionState) => {
  if (isActiveStatus(status, connectionState)) return "";
  const text = String(status || connectionState || "").trim();
  if (!text) return "";
  if (text.toLowerCase() === "connected") return "";
  return text;
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
  const compactStatus = getCompactStatus(status, connectionState);
  const showRetry = Boolean(onRetryPermission && isPermissionIssue(status) && !isActiveStatus(status, connectionState));

  return (
    <main className="vc-page" aria-label={title}>
      <section className="vc-stage">
        <video ref={remoteVideoRef} className="vc-remote-video" playsInline autoPlay />

        <div className="vc-video-placeholder" aria-hidden="true">
          <span>{compactStatus || "Waiting for video"}</span>
        </div>

        <header className="vc-topbar">
          <div className="vc-title-wrap">
            <span className="vc-title">{title}</span>
            <span className="vc-timer">{formatTime(seconds)}</span>
          </div>
          {compactStatus && <span className="vc-status-badge">{compactStatus}</span>}
        </header>

        <div className={`vc-local-preview ${cameraOff ? "is-camera-off" : ""}`}>
          <video ref={localVideoRef} className="vc-local-video" playsInline autoPlay muted />
          {cameraOff && <span className="vc-local-off">Camera off</span>}
        </div>

        {showRetry && (
          <div className="vc-media-error" role="alert">
            <p>{status}</p>
            <button type="button" onClick={onRetryPermission}>
              Try again
            </button>
          </div>
        )}

        {billing?.lowBalance && (
          <div className="vc-low-balance" role="status">
            Low wallet balance
          </div>
        )}

        {billing?.summary && (
          <div className="vc-summary" role="status">
            <strong>Call ended</strong>
            <span>{billing.summary.duration_seconds || 0}s</span>
            <span>Rs {Number(billing.summary.gross_amount || billing.summary.user_wallet_debited || 0).toFixed(2)}</span>
          </div>
        )}

        <nav className="vc-controls" aria-label="Video call controls">
          <button
            type="button"
            className={`vc-control-btn ${muted ? "is-active" : ""}`}
            onClick={onToggleMute}
            aria-label={muted ? "Unmute microphone" : "Mute microphone"}
          >
            {muted ? <FiMicOff /> : <FiMic />}
          </button>
          <button
            type="button"
            className={`vc-control-btn ${cameraOff ? "is-active" : ""}`}
            onClick={onToggleCamera}
            aria-label={cameraOff ? "Turn camera on" : "Turn camera off"}
          >
            {cameraOff ? <FiCameraOff /> : <FiCamera />}
          </button>
          <button type="button" className="vc-control-btn vc-switch-btn" onClick={onSwitchCamera} aria-label="Switch camera">
            <FiRefreshCw />
          </button>
          <button type="button" className="vc-control-btn vc-end-btn" onClick={onEnd} aria-label="End call">
            <FiPhoneOff />
          </button>
        </nav>
      </section>

      <style>{`
        .vc-page {
          min-height: 100vh;
          min-height: 100dvh;
          width: 100%;
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.22), transparent 32%),
            linear-gradient(135deg, #030712 0%, #0f172a 56%, #111827 100%);
          color: #fff;
          overflow: hidden;
          display: grid;
          place-items: center;
          padding: 24px;
          box-sizing: border-box;
        }

        .vc-stage {
          position: relative;
          width: min(1180px, 100%);
          height: min(760px, calc(100dvh - 48px));
          min-height: 560px;
          overflow: hidden;
          border-radius: 22px;
          background: #020617;
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42);
          border: 1px solid rgba(255, 255, 255, 0.12);
          isolation: isolate;
        }

        .vc-remote-video,
        .vc-video-placeholder {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .vc-remote-video {
          object-fit: cover;
          background: #020617;
          z-index: 2;
        }

        .vc-video-placeholder {
          display: grid;
          place-items: center;
          z-index: 1;
          background:
            linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 0.96));
          color: rgba(226, 232, 240, 0.82);
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0;
        }

        .vc-topbar {
          position: absolute;
          z-index: 5;
          top: 18px;
          left: 18px;
          right: 18px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          pointer-events: none;
        }

        .vc-title-wrap {
          display: inline-flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
          padding: 10px 13px;
          border-radius: 16px;
          background: rgba(2, 6, 23, 0.42);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(14px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.24);
        }

        .vc-title {
          max-width: min(420px, 54vw);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 15px;
          font-weight: 800;
        }

        .vc-timer {
          font-size: 13px;
          font-weight: 700;
          color: rgba(226, 232, 240, 0.86);
        }

        .vc-status-badge,
        .vc-low-balance {
          max-width: min(360px, 42vw);
          padding: 9px 12px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.62);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(241, 245, 249, 0.92);
          font-size: 13px;
          font-weight: 800;
          text-align: right;
          backdrop-filter: blur(14px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vc-local-preview {
          position: absolute;
          z-index: 6;
          top: 86px;
          right: 18px;
          width: clamp(132px, 17vw, 210px);
          aspect-ratio: 10 / 14;
          overflow: hidden;
          border-radius: 18px;
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.24);
          box-shadow: 0 18px 46px rgba(0, 0, 0, 0.42);
        }

        .vc-local-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          background: #0f172a;
        }

        .vc-local-off {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: rgba(15, 23, 42, 0.94);
          color: #e2e8f0;
          font-size: 13px;
          font-weight: 800;
        }

        .vc-controls {
          position: absolute;
          z-index: 8;
          left: 50%;
          bottom: 24px;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 999px;
          background: rgba(2, 6, 23, 0.56);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.32);
        }

        .vc-control-btn {
          width: 54px;
          height: 54px;
          border: 0;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.16);
          color: #fff;
          cursor: pointer;
          font-size: 22px;
          transition: transform 140ms ease, background 140ms ease, opacity 140ms ease;
        }

        .vc-control-btn:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.24);
        }

        .vc-control-btn.is-active {
          background: rgba(241, 245, 249, 0.92);
          color: #0f172a;
        }

        .vc-end-btn {
          background: #ef4444;
          color: #fff;
        }

        .vc-end-btn:hover {
          background: #dc2626;
        }

        .vc-media-error {
          position: absolute;
          z-index: 10;
          left: 50%;
          top: 50%;
          width: min(440px, calc(100% - 32px));
          transform: translate(-50%, -50%);
          display: grid;
          gap: 14px;
          padding: 18px;
          border-radius: 18px;
          background: rgba(15, 23, 42, 0.88);
          border: 1px solid rgba(248, 113, 113, 0.34);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.42);
          backdrop-filter: blur(16px);
          text-align: center;
        }

        .vc-media-error p {
          margin: 0;
          color: #fee2e2;
          font-weight: 700;
          line-height: 1.45;
        }

        .vc-media-error button {
          justify-self: center;
          border: 0;
          border-radius: 999px;
          padding: 10px 18px;
          background: #fff;
          color: #0f172a;
          font-weight: 900;
          cursor: pointer;
        }

        .vc-low-balance {
          position: absolute;
          z-index: 7;
          left: 50%;
          bottom: 104px;
          transform: translateX(-50%);
          background: rgba(180, 83, 9, 0.72);
          color: #fff7ed;
          text-align: center;
        }

        .vc-summary {
          position: absolute;
          z-index: 9;
          left: 50%;
          bottom: 104px;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: calc(100% - 32px);
          padding: 12px 14px;
          border-radius: 16px;
          background: rgba(15, 23, 42, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(16px);
          color: #e2e8f0;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }

        @media (min-width: 1025px) {
          .vc-remote-video {
            object-fit: cover;
          }
        }

        @media (max-width: 1024px) {
          .vc-page {
            padding: 0;
            background: #020617;
          }

          .vc-stage {
            width: 100%;
            height: 100vh;
            height: 100dvh;
            min-height: 0;
            border-radius: 0;
            border: 0;
            box-shadow: none;
          }

          .vc-topbar {
            top: calc(env(safe-area-inset-top, 0px) + 12px);
            left: 12px;
            right: 12px;
          }

          .vc-title-wrap {
            padding: 9px 11px;
            border-radius: 14px;
          }

          .vc-title {
            max-width: 52vw;
            font-size: 14px;
          }

          .vc-status-badge {
            max-width: 38vw;
            font-size: 12px;
            padding: 8px 10px;
          }

          .vc-local-preview {
            top: calc(env(safe-area-inset-top, 0px) + 76px);
            right: 12px;
            width: clamp(104px, 30vw, 132px);
            border-radius: 15px;
          }

          .vc-controls {
            left: 12px;
            right: 12px;
            bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
            transform: none;
            justify-content: space-evenly;
            gap: 10px;
            padding: 12px;
          }

          .vc-control-btn {
            width: 52px;
            height: 52px;
            min-width: 52px;
            font-size: 21px;
          }

          .vc-low-balance,
          .vc-summary {
            bottom: calc(env(safe-area-inset-bottom, 0px) + 92px);
          }
        }

        @media (max-width: 480px) {
          .vc-title {
            max-width: 48vw;
          }

          .vc-timer {
            font-size: 12px;
          }

          .vc-status-badge {
            max-width: 34vw;
          }

          .vc-local-preview {
            width: 104px;
          }

          .vc-control-btn {
            width: 48px;
            height: 48px;
            min-width: 48px;
          }

          .vc-controls {
            gap: 8px;
          }
        }

        @media (max-width: 360px) {
          .vc-control-btn {
            width: 44px;
            height: 44px;
            min-width: 44px;
            font-size: 19px;
          }

          .vc-controls {
            padding: 10px;
          }
        }
      `}</style>
    </main>
  );
}
