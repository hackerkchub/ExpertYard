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

  const expName = String(selectedExpert?.expert_name || selectedExpert?.name || "").trim();
  const expId = Number(selectedExpert?.expert_id || selectedExpert?.id || 0);
  const isRealExpertSelection = Boolean(
    expId > 0 &&
    expName &&
    !["verified expert", "assigned expert", "unassigned expert", "our team will assign", "awaiting admin assignment"].includes(expName.toLowerCase()) &&
    selectedExpert?.is_real_expert !== false
  );

  const completedExpId = Number(completedBooking?.expert_id || 0);
  const completedExpName = String(completedBooking?.expert_name || "").trim();
  const completedExpAvatar = completedBooking?.profile_photo || completedBooking?.profile_image || null;

  const isRealAssignedBooking = Boolean(
    completedExpId > 0 &&
    completedExpName &&
    !["verified expert", "assigned expert", "unassigned expert", "our team will assign", "awaiting admin assignment"].includes(completedExpName.toLowerCase()) &&
    (completedBooking?.assignment_type === "expert" || !completedBooking?.assignment_type)
  );

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
          <div className="msp-booking-success-view" style={{ textAlign: "center" }}>
            <div className="msp-success-icon" style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎉</div>
            <h3 className="msp-success-title" style={{ fontSize: "1.35rem", fontWeight: 900, color: "#0f172a", marginBottom: "0.5rem" }}>
              Service Booked Successfully!
            </h3>
            {isRealAssignedBooking ? (
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "1rem 1.25rem", margin: "1rem 0 1.25rem", textAlign: "left", display: "flex", alignItems: "center", gap: "12px" }}>
                {completedExpAvatar ? (
                  <img
                    src={completedExpAvatar}
                    alt={completedExpName}
                    style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #2563eb" }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/48?text=Expert"; }}
                  />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#dbeafe", color: "#1e40af", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "1.2rem", flexShrink: 0 }}>
                    👤
                  </div>
                )}
                <div>
                  <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: 800 }}>
                    Order #{completedBooking.booking_id || completedBooking.id} is active.
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a", marginTop: "2px" }}>
                    Your selected expert, <strong>{completedExpName}</strong>, will work on your service shortly.
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "1rem 1.25rem", margin: "1rem 0 1.25rem", textAlign: "left", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#2563eb" }}>
                  Order #{completedBooking.booking_id || completedBooking.id} is active.
                </div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>
                  Our team will assign the best expert for your service shortly.
                </div>
                <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.45, marginTop: "2px" }}>
                  Your request has been received successfully and is now being reviewed by our team.
                </div>
              </div>
            )}
            <div className="msp-success-actions" style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                type="button"
                className="msp-btn-primary"
                onClick={() =>
                  onNavigateWorkspace(completedBooking.workspace_id || completedBooking.booking_id || completedBooking.id)
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
            {isRealExpertSelection ? (
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
                  <div className="msp-summary-label">Selected Expert</div>
                  <strong className="msp-summary-name">
                    {selectedExpert.expert_name || selectedExpert.name}
                  </strong>
                  <div className="msp-summary-sla" style={{ color: "#059669", fontWeight: 700, fontSize: "12px", marginTop: "2px" }}>
                    ⚡ Fast Service
                  </div>
                </div>
              </div>
            ) : (
              <div className="msp-booking-expert-summary" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.2rem", flexShrink: 0 }}>
                  🛡️
                </div>
                <div>
                  <div className="msp-summary-label" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#64748b", fontWeight: 800 }}>
                    Expert Assignment
                  </div>
                  <strong className="msp-summary-name" style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", display: "block", marginTop: "2px" }}>
                    Our Team Will Assign the Best Expert
                  </strong>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", lineHeight: 1.45 }}>
                    Your booking will be reviewed by our team and the most suitable expert will be assigned based on your service requirements.
                  </div>
                  <div style={{ color: "#059669", fontWeight: 700, fontSize: "12px", marginTop: "6px", display: "flex", alignItems: "center", gap: 4 }}>
                    ⚡ Fast Service
                  </div>
                </div>
              </div>
            )}

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
