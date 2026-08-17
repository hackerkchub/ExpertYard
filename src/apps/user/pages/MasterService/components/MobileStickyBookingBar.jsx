import React from "react";
import { FiZap, FiCheckCircle } from "react-icons/fi";

export default function MobileStickyBookingBar({
  displayMinPrice,
  isAlreadyBooked,
  onBookClick,
  onOpenWorkspaceClick
}) {
  return (
    <div className="msp-mobile-sticky-bar">
      <div className="msp-mobile-bar-price-col">
        <span className="msp-mobile-bar-label">Starting Fee</span>
        <div className="msp-mobile-bar-price">
          ₹{displayMinPrice.toLocaleString("en-IN")}{" "}
          <span className="msp-mobile-bar-gst">+ GST</span>
        </div>
      </div>

      <div className="msp-mobile-bar-action-col">
        {isAlreadyBooked ? (
          <button
            type="button"
            className="msp-mobile-bar-btn msp-mobile-bar-active"
            onClick={onOpenWorkspaceClick}
          >
            <FiCheckCircle size={16} /> Active Booking
          </button>
        ) : (
          <button
            type="button"
            className="msp-mobile-bar-btn msp-mobile-bar-primary"
            onClick={onBookClick}
          >
            <FiZap size={16} /> Book Service
          </button>
        )}
      </div>
    </div>
  );
}
