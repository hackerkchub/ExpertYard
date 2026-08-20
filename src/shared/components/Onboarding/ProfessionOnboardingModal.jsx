import React, { useState } from "react";
import { FiBriefcase, FiChevronDown, FiLoader, FiAlertCircle, FiCheck } from "react-icons/fi";
import { updateUserProfessionApi } from "../../api/userApi/auth.api";
import { useAuth } from "../../context/UserAuthContext";

const PROFESSIONS = [
  "Student",
  "Engineer",
  "Doctor",
  "Business Owner",
  "Working Professional",
  "Freelancer",
  "Teacher",
  "Government Employee",
  "Homemaker",
  "Other"
];

export default function ProfessionOnboardingModal({ isOpen, onClose }) {
  const { updateUser } = useAuth();
  const [profession, setProfession] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profession || saving) {
      setErrorMsg("Please select your profession to continue.");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      const res = await updateUserProfessionApi(profession);
      if (res?.success && res?.data) {
        if (typeof updateUser === "function") {
          updateUser(res.data);
        }
        if (typeof onClose === "function") {
          onClose();
        }
      } else {
        setErrorMsg(res?.message || "Failed to save profession. Please try again.");
      }
    } catch (err) {
      console.error("[PROFESSION_ONBOARDING] Error:", err);
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        padding: "16px",
        animation: "fadeIn 0.25s ease-out",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "440px",
          padding: "28px 24px",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 128, 0.2)",
          border: "1px solid #e2e8f0",
          textAlign: "center",
          position: "relative",
          animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header Icon */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #000080 0%, #1e3a8a 100%)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto",
            boxShadow: "0 8px 16px rgba(0, 0, 128, 0.18)",
          }}
        >
          <FiBriefcase size={26} />
        </div>

        {/* Title */}
        <h2
          style={{
            margin: "0 0 8px 0",
            fontSize: "1.35rem",
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.02em",
          }}
        >
          Tell us about you
        </h2>

        {/* Subtitle */}
        <p
          style={{
            margin: "0 0 24px 0",
            fontSize: "0.88rem",
            color: "#64748b",
            lineHeight: 1.5,
          }}
        >
          Select your profession to personalize your G9Expert experience.
        </p>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              fontSize: "0.82rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textAlign: "left",
            }}
          >
            <FiAlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <label
              htmlFor="profession-select"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#334155",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Profession
            </label>
            <div style={{ position: "relative" }}>
              <select
                id="profession-select"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                disabled={saving}
                style={{
                  width: "100%",
                  padding: "12px 38px 12px 14px",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  background: "#f8fafc",
                  color: profession ? "#0f172a" : "#94a3b8",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  appearance: "none",
                  outline: "none",
                  cursor: saving ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <option value="" disabled>
                  Select your profession...
                </option>
                {PROFESSIONS.map((prof, idx) => (
                  <option key={idx} value={prof} style={{ color: "#0f172a" }}>
                    {prof}
                  </option>
                ))}
              </select>
              <FiChevronDown
                size={18}
                color="#64748b"
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving || !profession}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background:
                saving || !profession
                  ? "#cbd5e1"
                  : "linear-gradient(135deg, #000080 0%, #1e3a8a 100%)",
              color: "#ffffff",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: saving || !profession ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow:
                saving || !profession ? "none" : "0 4px 12px rgba(0, 0, 128, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            {saving ? (
              <>
                <FiLoader size={18} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Save & Continue</span>
                <FiCheck size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
