import React from "react";
import { FiX, FiCheck, FiPlus, FiLock, FiAlertCircle } from "react-icons/fi";

export default function BookingModal({
  service,
  selectedExpert,
  onClose,
  completedBooking,
  onNavigateWorkspace,
  bookingFormResponses,
  setBookingFormResponses,
  bookingDocumentsMap,
  onSpecFileSelect,
  walletBalance,
  onTriggerRecharge,
  bookingError,
  bookingInProgress,
  onConfirmWalletBooking
}) {
  if (!selectedExpert || !service) return null;

  const basePrice = Number(selectedExpert.custom_price || service.base_price || 0);
  const offerPrice = selectedExpert.offer_price ? Number(selectedExpert.offer_price) : null;
  const effectiveBase = offerPrice && offerPrice > 0 ? offerPrice : basePrice;
  const totalPayable = effectiveBase;

  return (
    <div className="msp-modal-overlay" onClick={onClose}>
      <div
        className="msp-modal-box msp-booking-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="msp-modal-drag-handle" />

        {/* MODAL HEADER */}
        <div className="msp-modal-header">
          <div>
            <h3 className="msp-modal-title">Confirm Service Booking</h3>
            <div className="msp-modal-subtitle">{service.title}</div>
          </div>
          <button type="button" className="msp-modal-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* STEP VISUAL INDICATOR */}
        {!completedBooking && (
          <div className="msp-booking-steps-bar">
            <div className="msp-step-pill msp-step-done">✓ 1. Expert</div>
            <div className="msp-step-pill msp-step-active">2. Requirements</div>
            <div className="msp-step-pill">3. Documents</div>
            <div className="msp-step-pill">4. Payment</div>
          </div>
        )}

        {completedBooking ? (
          /* SUCCESS VIEW */
          <div className="msp-booking-success-view">
            <div className="msp-success-icon">🎉</div>
            <h3 className="msp-success-title">Service Booked Successfully!</h3>
            <p className="msp-success-desc">
              Order <strong>#{completedBooking.booking_id}</strong> is active. Your assigned expert is{" "}
              <strong>{completedBooking.expert_name}</strong>.
            </p>
            <div className="msp-success-actions">
              <button
                type="button"
                className="msp-btn-primary"
                onClick={() =>
                  onNavigateWorkspace(completedBooking.workspace_id || completedBooking.booking_id)
                }
              >
                Open Order Workspace
              </button>
              <button type="button" className="msp-btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* SELECTED EXPERT SUMMARY */}
            <div className="msp-booking-expert-summary">
              <img
                src={
                  selectedExpert.profile_photo ||
                  selectedExpert.profile_image ||
                  "https://via.placeholder.com/50"
                }
                alt={selectedExpert.expert_name || selectedExpert.name}
                className="msp-summary-avatar"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/50?text=Expert";
                }}
              />
              <div>
                <div className="msp-summary-label">Selected Verified Expert</div>
                <strong className="msp-summary-name">
                  {selectedExpert.expert_name || selectedExpert.name}
                </strong>
                <div className="msp-summary-sla" style={{ color: "#64748b", fontWeight: 600 }}>
                  Turnaround: {selectedExpert.delivery_time_days || service.delivery_time_days || 1} Day(s)
                </div>
              </div>
            </div>

            {/* DYNAMIC FORM FIELDS */}
            {Array.isArray(service.form_fields) && service.form_fields.length > 0 && (
              <div className="msp-booking-form-section">
                <h4 className="msp-section-subheading">Service Requirements Form</h4>
                {service.form_fields.map((field) => {
                  const key = field.field_key || field.key || field.id;
                  const isReq = field.is_required === 1 || field.is_required === true;
                  return (
                    <div key={key} className="msp-form-group">
                      <label className="msp-form-label">
                        {field.field_label || field.label}{" "}
                        {isReq ? <span className="msp-required-star">*</span> : ""}
                      </label>
                      <input
                        type="text"
                        placeholder={field.placeholder || "Enter details..."}
                        value={bookingFormResponses[key] || ""}
                        onChange={(e) =>
                          setBookingFormResponses({
                            ...bookingFormResponses,
                            [key]: e.target.value
                          })
                        }
                        className="msp-form-input"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* MANDATORY / OPTIONAL DOCUMENT UPLOADS */}
            {Array.isArray(service.document_specs) && service.document_specs.length > 0 && (
              <div className="msp-booking-docs-section">
                <h4 className="msp-section-subheading">Upload Required Documents</h4>
                {service.document_specs.map((docSpec) => {
                  const uploaded = bookingDocumentsMap[docSpec.doc_type_key];
                  const isMandatory = docSpec.is_mandatory === 1 || docSpec.is_mandatory === true;
                  return (
                    <div key={docSpec.id || docSpec.doc_type_key} className="msp-upload-row">
                      <div className="msp-upload-label-col">
                        <div className="msp-upload-name">
                          {docSpec.label}{" "}
                          {isMandatory ? <span className="msp-required-star">*</span> : ""}
                        </div>
                        <div
                          className={`msp-upload-status ${
                            uploaded ? "msp-status-uploaded" : "msp-status-pending"
                          }`}
                        >
                          {uploaded ? `✓ ${uploaded.file_name}` : "Not uploaded yet"}
                        </div>
                      </div>
                      <label className="msp-file-btn-label">
                        <input
                          type="file"
                          onChange={(e) => onSpecFileSelect(docSpec, e.target.files[0])}
                          className="msp-hidden-file-input"
                        />
                        <span className="msp-file-btn-text">
                          {uploaded ? "Change File" : "Choose File"}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PAYMENT SUMMARY BREAKDOWN */}
            <div className="msp-payment-breakdown-card">
              <div className="msp-breakdown-row">
                <span>Service Price</span>
                <span className="font-mono">₹{effectiveBase.toLocaleString("en-IN")}</span>
              </div>
              <hr className="msp-breakdown-divider" />
              <div className="msp-breakdown-row msp-breakdown-total">
                <span>Total Payable</span>
                <span className="msp-total-amount font-mono">
                  ₹{totalPayable.toLocaleString("en-IN")}
                </span>
              </div>

              {/* WALLET STATUS */}
              <div className="msp-wallet-status-bar">
                <span className="msp-wallet-balance-text">
                  Wallet Balance: <strong className="font-mono">₹{walletBalance.toLocaleString("en-IN")}</strong>
                </span>
                {walletBalance >= totalPayable ? (
                  <span style={{ fontSize: 11, fontWeight: 700, background: "#ecfdf5", color: "#047857", padding: "2px 8px", borderRadius: 4, border: "1px solid #a7f3d0" }}>
                    ✓ Sufficient balance
                  </span>
                ) : (
                  <button
                    type="button"
                    className="msp-add-balance-btn"
                    onClick={() => onTriggerRecharge(totalPayable - walletBalance)}
                  >
                    + Add ₹{(totalPayable - walletBalance).toLocaleString("en-IN")}
                  </button>
                )}
              </div>
            </div>

            {/* ERROR DISPLAY */}
            {bookingError && (
              <div className="msp-booking-error-alert">
                <FiAlertCircle className="msp-error-icon" />
                <span>{bookingError}</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="button"
              className="msp-btn-primary msp-confirm-booking-btn"
              onClick={onConfirmWalletBooking}
              disabled={bookingInProgress}
            >
              {bookingInProgress ? (
                "Initiating Booking & Workspace..."
              ) : (
                <>
                  <FiLock /> Confirm & Pay ₹{totalPayable.toLocaleString("en-IN")} via Wallet
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
