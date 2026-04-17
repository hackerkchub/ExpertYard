import React, { useEffect, useRef, useState } from "react";
import { FiMail, FiPhone, FiLogOut } from "react-icons/fi";
import { getUserProfileApi } from "../../../shared/api/userApi/auth.api";

const ProfilePopup = ({ popupOpen, popupPos, user, onClose, onLogout }) => {
  const popupRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch profile
  useEffect(() => {
    if (!popupOpen || !user?.id) return;

    setLoading(true);

    getUserProfileApi(user.id)
      .then((res) => {
        if (res?.success) setProfile(res.data);
        else setProfile(null);
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [popupOpen, user?.id]);

  // ✅ Close outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (popupOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [popupOpen, onClose]);

  if (!popupOpen) return null;

  return (
    <div
      ref={popupRef}
      style={{
        position: "fixed",
        top: popupPos.top,
        left: popupPos.left,
        width: popupPos.width,
        maxWidth: "calc(100vw - 20px)",
        background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(18px)",
        borderRadius: 18,
        padding: "22px",
        boxShadow: "0 30px 80px rgba(15,23,42,0.25)",
        border: "1px solid rgba(148,163,184,0.12)",
        zIndex: 9999,
        fontSize: 14
      }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          Loading...
        </div>
      ) : (
        <>
          {/* 🔹 Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#667eea,#764ba2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 17
              }}
            >
              {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  color: "#0f172a",
                  fontSize: 15
                }}
              >
                {profile?.full_name || "User"}
              </div>

              {/* <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  marginTop: 2
                }}
              >
                ID: #{user?.id || "--"}
              </div> */}
            </div>
          </div>

          {/* 🔹 Contact */}
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 12,
                marginBottom: 10,
                color: "#64748b",
                fontWeight: 600
              }}
            >
              Contact Info
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8
              }}
            >
              <FiMail style={{ color: "#0284c7" }} />
              <span style={{ color: "#334155" }}>
                {profile?.email || "--"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10
              }}
            >
              <FiPhone style={{ color: "#16a34a" }} />
              <span style={{ color: "#334155" }}>
                {profile?.phone || "--"}
              </span>
            </div>
          </div>

          {/* 🔹 Divider */}
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, transparent, #e2e8f0, transparent)",
              margin: "16px 0"
            }}
          />

          {/* 🔹 Logout Button */}
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              background: "linear-gradient(135deg,#fee2e2,#fecaca)",
              color: "#dc2626",
              border: "1px solid #fecaca",
              borderRadius: 12,
              padding: "12px 16px",
              fontWeight: 600,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(220,38,38,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <FiLogOut /> Sign Out
          </button>
        </>
      )}
    </div>
  );
};

export default ProfilePopup;