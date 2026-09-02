import React from "react";
import { FiZap, FiCheckCircle, FiMessageSquare } from "react-icons/fi";

export default function MobileStickyBookingBar({
  displayMinPrice,
  isAlreadyBooked,
  onBookClick,
  onOpenWorkspaceClick,
  onSendInquiry
}) {
  return (
    <div className="msp-mobile-sticky-bar">
      <div className="msp-mobile-bar-price-col">
        <span className="msp-mobile-bar-label">Starting Fee</span>
        <div className="msp-mobile-bar-price">
          ₹{displayMinPrice.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="msp-mobile-bar-action-col" style={{ display: "flex", gap: "8px" }}>
        <button
          type="button"
          className="msp-mobile-bar-btn"
          onClick={onSendInquiry}
          style={{ background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1", flex: 1, minWidth: "90px" }}
        >
          <FiMessageSquare size={15} /> Inquire
        </button>

        {isAlreadyBooked ? (
          <button
            type="button"
            className="msp-mobile-bar-btn msp-mobile-bar-active"
            onClick={onOpenWorkspaceClick}
            style={{ flex: 1 }}
          >
            <FiCheckCircle size={16} /> Active Booking
          </button>
        ) : (
          <button
            type="button"
            className="msp-mobile-bar-btn msp-mobile-bar-primary"
            onClick={onBookClick}
            style={{ flex: 1 }}
          >
            <FiZap size={16} /> Book Service
          </button>
        )}
      </div>
    </div>
  );
}
