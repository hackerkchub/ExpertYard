import React, { useState, useEffect } from "react";
import { FiX, FiSend, FiMessageSquare, FiAlertCircle, FiCheckCircle, FiClock, FiPhone, FiMail } from "react-icons/fi";
import APP_CONFIG from "../../../../../config/appConfig";

const API_BASE = APP_CONFIG.API_BASE_URL;

const userAuthHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("userToken") || localStorage.getItem("user_token") || "";
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const apiFetch = async (path, options = {}) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const primaryUrl = cleanPath.startsWith("/api") ? `${API_BASE.replace(/\/api\/?$/, "")}${cleanPath}` : `${API_BASE}${cleanPath}`;
  return await fetch(primaryUrl, options);
};

export default function ServiceInquiryModal({ service, onClose, user, onLoginClick }) {
  if (!service) return null;

  const token = localStorage.getItem("token") || localStorage.getItem("userToken") || localStorage.getItem("user_token") || "";

  // User details auto-populate
  const [userName, setUserName] = useState(user?.name || user?.first_name || "");
  const [userEmail, setUserEmail] = useState(user?.email || "");
  const [userMobile, setUserMobile] = useState(user?.mobile || user?.phone || "");

  // Form fields
  const [subject, setSubject] = useState(`Inquiry regarding ${service.title || service.name || "Service"}`);
  const [inquiryType, setInquiryType] = useState("Service Related Question");
  const [preferredContactMethod, setPreferredContactMethod] = useState("Phone Call");
  const [preferredContactTime, setPreferredContactTime] = useState("Morning (9 AM - 12 PM)");
  const [message, setMessage] = useState("");

  // States
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Sync user profile when user prop changes
  useEffect(() => {
    if (user) {
      if (!userName) setUserName(user.name || user.first_name || "");
      if (!userEmail) setUserEmail(user.email || "");
      if (!userMobile) setUserMobile(user.mobile || user.phone || "");
    }
  }, [user]);

  // Escape key handler to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Please log in to submit an inquiry.");
      return;
    }

    if (!userName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!userEmail.trim() || !userEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!userMobile.trim()) {
      setError("Please enter your mobile number.");
      return;
    }

    if (!subject.trim() || subject.trim().length < 5) {
      setError("Subject must be at least 5 characters long.");
      return;
    }

    const trimmedMsg = message.trim();
    if (!trimmedMsg) {
      setError("Please enter your inquiry message.");
      return;
    }

    if (trimmedMsg.length < 20) {
      setError("Message must be at least 20 characters long.");
      return;
    }

    if (trimmedMsg.length > 2000) {
      setError("Message cannot exceed 2000 characters.");
      return;
    }

    setSubmitting(true);

    try {
      // Prepend Inquiry Type to Subject for full context while preserving Phase 1 DB schema
      const finalSubject = `${inquiryType}: ${subject.trim()}`.substring(0, 150);

      const response = await apiFetch("/api/inquiries", {
        method: "POST",
        headers: userAuthHeaders(),
        body: JSON.stringify({
          master_service_id: service.id,
          expert_id: null,
          subject: finalSubject,
          message: trimmedMsg,
          preferred_contact_method: preferredContactMethod,
          preferred_contact_time: preferredContactTime,
          user_name: userName.trim(),
          user_email: userEmail.trim(),
          user_mobile: userMobile.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setError(data.message || "Failed to submit inquiry. Please try again.");
      }
    } catch (err) {
      console.error("Inquiry submission error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="msp-modal-overlay" onClick={onClose}>
      <div
        className="msp-modal-box"
        style={{ maxWidth: "620px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="msp-modal-drag-handle" />

        {/* MODAL HEADER */}
        <div className="msp-modal-header">
          <div>
            <h3 className="msp-modal-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FiMessageSquare style={{ color: "#2563eb" }} /> Send Service Inquiry
            </h3>
            <div className="msp-modal-subtitle">
              Have questions regarding <strong>{service.title || service.name}</strong>? Ask our team directly!
            </div>
          </div>
          <button type="button" className="msp-modal-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* SUCCESS VIEW */}
        {success ? (
          <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
              Inquiry Submitted Successfully!
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
              Thank you for contacting us regarding <strong>{service.title || service.name}</strong>. Our service specialists will reach out to you via {preferredContactMethod}.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f0fdf4", color: "#166534", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "700" }}>
              <FiCheckCircle /> Notification sent to Service Operations Team
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* SERVICE BADGE BANNER */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justify: "space-between",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", letterSpacing: "0.5px" }}>
                  Selected Service
                </span>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                  {service.title || service.name}
                </div>
              </div>
              {service.category_name && (
                <span className="msp-badge msp-badge-blue" style={{ fontSize: "11px" }}>
                  {service.category_name}
                </span>
              )}
            </div>

            {/* ERROR BANNER */}
            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#991b1b",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FiAlertCircle style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* LOGIN REQUIREMENT BANNER */}
            {!token && (
              <div
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  color: "#1e40af",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Please log in to submit your inquiry.</span>
                {onLoginClick && (
                  <button
                    type="button"
                    onClick={onLoginClick}
                    style={{
                      background: "#2563eb",
                      color: "#ffffff",
                      border: 0,
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontWeight: "700",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Log In
                  </button>
                )}
              </div>
            )}

            {/* USER SNAPSHOT INPUTS (3-col or 1-col grid) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Full Name"
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={userMobile}
                  onChange={(e) => setUserMobile(e.target.value)}
                  placeholder="Mobile Number"
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* INQUIRY TYPE & SUBJECT */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                  Inquiry Type
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    background: "#ffffff",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Service Related Question">Service Question</option>
                  <option value="Service Problem">Service Problem</option>
                  <option value="Document Related">Document Related</option>
                  <option value="Payment Related">Payment Related</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Inquiry Subject"
                  required
                  maxLength={150}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* PREFERRED CONTACT METHOD & TIME */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                  Contact Method
                </label>
                <select
                  value={preferredContactMethod}
                  onChange={(e) => setPreferredContactMethod(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    background: "#ffffff",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Phone Call">📞 Phone Call</option>
                  <option value="Email">✉️ Email</option>
                  <option value="WhatsApp">💬 WhatsApp</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                  Preferred Time
                </label>
                <select
                  value={preferredContactTime}
                  onChange={(e) => setPreferredContactTime(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    background: "#ffffff",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                  <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                  <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                </select>
              </div>
            </div>

            {/* MESSAGE TEXTAREA WITH CHAR COUNTER */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>
                  Inquiry Message * (min 20 chars)
                </label>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: message.trim().length >= 20 ? "#64748b" : "#ef4444",
                  }}
                >
                  {message.trim().length} / 2000
                </span>
              </div>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question, required assistance, or details about your service request..."
                required
                minLength={20}
                maxLength={2000}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
              <button
                type="button"
                className="msp-btn-secondary"
                onClick={onClose}
                disabled={submitting}
                style={{ padding: "10px 18px", fontSize: "13px" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="msp-btn-primary"
                disabled={submitting || !token}
                style={{
                  padding: "10px 22px",
                  fontSize: "13px",
                  opacity: submitting || !token ? 0.7 : 1,
                  cursor: submitting || !token ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <FiSend /> Submit Inquiry
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
