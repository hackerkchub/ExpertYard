import React from "react";
import { FiMessageSquare, FiPhone, FiFolder, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ActiveBookingNotice({
  activeUserBooking,
  serviceTitle,
  showActiveBookingDialog,
  setShowActiveBookingDialog
}) {
  const navigate = useNavigate();
  if (!activeUserBooking) return null;

  return (
    <>
      {/* INLINE BANNER CARD */}
      <div id="active-booking-notice" className="msp-active-notice-card">
        <div className="msp-active-notice-header">
          <div>
            <h4 className="msp-active-notice-title">
              ℹ️ Active Service Order in Progress
            </h4>
            <div className="msp-active-notice-meta">
              Order #{activeUserBooking.id} • Status:{" "}
              <strong className="msp-active-status-badge">
                {activeUserBooking.status}
              </strong>{" "}
              • Expert: <strong>{activeUserBooking.expert_name || "Assigned Expert"}</strong>
            </div>
          </div>
          <span className="msp-active-tag">Active Order In Progress</span>
        </div>

        <div className="msp-active-notice-actions">
          {activeUserBooking.expert_id && (
            <>
              <button
                type="button"
                className="msp-active-btn msp-active-btn-chat"
                onClick={() => navigate(`/user/chat?expert_id=${activeUserBooking.expert_id}`)}
              >
                <FiMessageSquare /> Start Chat
              </button>
              <button
                type="button"
                className="msp-active-btn msp-active-btn-call"
                onClick={() =>
                  navigate(`/user/voice-call/${activeUserBooking.expert_id}`, {
                    state: {
                      pricingMode: "master_service",
                      bookingId: activeUserBooking.id,
                      serviceTitle
                    }
                  })
                }
              >
                <FiPhone /> Voice Call
              </button>
            </>
          )}
          <button
            type="button"
            className="msp-active-btn msp-active-btn-workspace"
            onClick={() =>
              navigate(`/user/workspace/${activeUserBooking.booking_id || activeUserBooking.id}`)
            }
          >
            <FiFolder /> Dedicated Workspace
          </button>
        </div>
      </div>

      {/* POPUP ALERT DIALOG IF USER TRIES TO BOOK AGAIN */}
      {showActiveBookingDialog && (
        <div className="msp-modal-overlay">
          <div className="msp-active-dialog-box">
            <div className="msp-active-dialog-icon">📋</div>
            <h3 className="msp-active-dialog-title">Active Order in Progress</h3>
            <p className="msp-active-dialog-text">
              You already have an active booking for <strong>"{serviceTitle}"</strong>. Please wait
              for completion or cancellation of your current order before placing a new one.
            </p>

            <div className="msp-active-dialog-badge-row">
              <span>Order ID: #{activeUserBooking.id}</span>
              <span className="msp-active-status-tag">
                {activeUserBooking.status || "IN PROGRESS"}
              </span>
            </div>

            <div className="msp-active-dialog-actions">
              <button
                type="button"
                className="msp-btn-primary"
                onClick={() => {
                  setShowActiveBookingDialog(false);
                  navigate(`/user/workspace/${activeUserBooking.booking_id || activeUserBooking.id}`);
                }}
              >
                🚀 Open Dedicated Workspace
              </button>

              <button
                type="button"
                className="msp-btn-secondary"
                onClick={() => setShowActiveBookingDialog(false)}
              >
                Got It, Thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
