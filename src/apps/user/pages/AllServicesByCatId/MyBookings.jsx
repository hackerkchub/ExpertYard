import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FiCalendar, FiClock, FiTag, FiChevronRight, FiMessageSquare, 
  FiPhone, FiFolder, FiZap, FiCheckCircle, FiArrowLeft, FiRefreshCw, FiPackage, FiAward
} from "react-icons/fi";
import { useAuth } from "../../../../shared/context/UserAuthContext"; 
import useNetworkReconnect from "../../../../shared/hooks/useNetworkReconnect";
import * as S from "./MyBookings.style";
import { APP_CONFIG } from "../../../../config/appConfig";

const getServiceImageUrl = (url) => {
  if (!url) return "https://placehold.co/100x100?text=Master+Service";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  const base = APP_CONFIG.API_BASE_URL.replace(/\/api\/?$/, "");
  return `${base}${cleanPath}`;
};

const MyBookings = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // "active" | "history"

  const fetchMyBookings = useCallback(async () => {
    const activeUserId = user?.id || JSON.parse(localStorage.getItem("user") || "{}")?.id;
    if (!activeUserId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || localStorage.getItem("userToken") || "";
      const res = await axios.get(`${APP_CONFIG.API_BASE_URL}/bookings/user/${activeUserId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data.success) {
        setBookings(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  useNetworkReconnect(fetchMyBookings, { enabled: Boolean(user?.id) });

  const handleViewService = (booking) => {
    const slugOrId = booking.service_slug || booking.master_service_id || booking.service_id;
    navigate(`/user/service/${slugOrId}`);
  };

  // Categorize Bookings into Active Orders vs Order History
  const activeBookings = bookings.filter((b) => {
    const statusClean = String(b.status || "").toLowerCase();
    const stepClean = String(b.current_step_key || "").toUpperCase();
    return (
      !["completed", "cancelled", "closed"].includes(statusClean) &&
      !["COMPLETED", "CANCELLED", "CLOSED"].includes(stepClean)
    );
  });

  const historyBookings = bookings.filter((b) => {
    const statusClean = String(b.status || "").toLowerCase();
    const stepClean = String(b.current_step_key || "").toUpperCase();
    return (
      ["completed", "cancelled", "closed"].includes(statusClean) ||
      ["COMPLETED", "CANCELLED", "CLOSED"].includes(stepClean)
    );
  });

  const displayedBookings = activeTab === "active" ? activeBookings : historyBookings;

  if (!isLoggedIn) return (
    <S.PageContainer>
      <S.EmptyState style={{ border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", borderRadius: 20 }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
        <h3 style={{ fontSize: "1.25rem", color: "#0f172a", fontWeight: 800 }}>Authentication Required</h3>
        <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Please login to view your active orders and service history.</p>
        <button 
          onClick={() => navigate("/user/auth")}
          style={{ marginTop: 14, padding: "10px 24px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 12, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}
        >
          Go to Login
        </button>
      </S.EmptyState>
    </S.PageContainer>
  );

  if (loading) return (
    <S.PageContainer>
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: 36, marginBottom: 12, animation: "pulse 1.5s infinite" }}>⚙️</div>
        <div style={{ fontWeight: 800, color: "#1e293b", fontSize: "1.1rem" }}>Syncing your orders & active services...</div>
      </div>
    </S.PageContainer>
  );

  return (
    <S.PageContainer style={{ background: "#f8fafc", minHeight: "100vh", padding: "1rem 0.75rem 4rem" }}>
      <S.ContentWrapper style={{ maxWidth: 860, margin: "0 auto" }}>
        
        {/* FLUTTER NATIVE APP HEADER (HIDDEN ON MOBILE VERSION ONLY) */}
        <S.HeaderBar>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <FiArrowLeft size={18} color="#0f172a" />
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900, color: "#0f172a" }}>My Orders</h1>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, marginTop: 1 }}>
                Fulfillment & Service Management
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchMyBookings}
            style={{
              background: "#eff6ff",
              color: "#2563eb",
              border: "1px solid #bfdbfe",
              borderRadius: "12px",
              padding: "6px 12px",
              fontWeight: 700,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer"
            }}
          >
            <FiRefreshCw size={13} /> Refresh
          </button>
        </S.HeaderBar>

        {/* FLUTTER-STYLE SEGMENTED TAB SWITCHER (PROPORTIONED FOR MOBILE & DESKTOP) */}
        <S.TabSwitcher>
          <S.TabButton
            type="button"
            $active={activeTab === "active"}
            onClick={() => setActiveTab("active")}
          >
            <span>⚡ Active Orders</span>
            <S.TabCountBadge $active={activeTab === "active"} $type="active">
              {activeBookings.length}
            </S.TabCountBadge>
          </S.TabButton>

          <S.TabButton
            type="button"
            $active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
          >
            <span>📜 Order History</span>
            <S.TabCountBadge $active={activeTab === "history"} $type="history">
              {historyBookings.length}
            </S.TabCountBadge>
          </S.TabButton>
        </S.TabSwitcher>

        {/* TAB CONTENT VIEW */}
        {displayedBookings.length === 0 ? (
          <S.EmptyState style={{ border: "1px solid #e2e8f0", borderRadius: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div className="icon" style={{ fontSize: 40, marginBottom: 8 }}>
              {activeTab === "active" ? "⚡" : "📜"}
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
              {activeTab === "active" ? "No Active Orders Right Now" : "No Past Order History"}
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.88rem", margin: 0 }}>
              {activeTab === "active"
                ? "You don't have any ongoing service fulfillment orders."
                : "Your completed and cancelled orders will be archived here."}
            </p>
            {activeTab === "active" && (
              <button 
                onClick={() => navigate("/user/all-services")}
                style={{ marginTop: 16, padding: "10px 20px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 10, fontWeight: 800, cursor: "pointer", fontSize: 13 }}
              >
                Browse Master Services
              </button>
            )}
          </S.EmptyState>
        ) : (
          <S.BookingList style={{ display: "grid", gap: "1rem" }}>
            {displayedBookings.map((booking) => {
              const isCompleted = ["COMPLETED", "CANCELLED", "completed", "cancelled"].includes(booking.status);
              const bookingDate = booking.created_at || booking.booking_date;
              const hasPendingReq = booking.expert_status_request;

              return (
                <S.BookingCard key={booking.id} style={{ display: "grid", gap: 14, borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <S.ServiceImage 
                      src={getServiceImageUrl(booking.service_image || booking.image_url || booking.thumbnail_url)} 
                      alt={booking.service_title} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/100x100?text=Master+Service";
                      }}
                      style={{ width: 80, height: 80, borderRadius: 16, objectFit: "cover" }}
                    />
                    
                    <S.BookingInfo style={{ flex: 1 }}>
                      <div className="top-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>
                          {booking.service_title || "Master Service"}
                        </h3>
                        {hasPendingReq === "COMPLETED_REQUESTED" ? (
                          <span style={{ padding: "0.25rem 0.65rem", borderRadius: "8px", fontSize: "0.72rem", fontWeight: "800", background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}>
                            ⏳ Completion Requested (Pending Admin)
                          </span>
                        ) : hasPendingReq === "CANCELLED_REQUESTED" ? (
                          <span style={{ padding: "0.25rem 0.65rem", borderRadius: "8px", fontSize: "0.72rem", fontWeight: "800", background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" }}>
                            ⚠️ Cancellation Requested (Pending Admin)
                          </span>
                        ) : (
                          <S.StatusBadge status={booking.status} style={{ fontSize: "0.75rem", padding: "3px 10px", borderRadius: 8, fontWeight: 800, textTransform: "uppercase" }}>
                            {booking.status}
                          </S.StatusBadge>
                        )}
                      </div>

                      <S.MetaGrid style={{ marginTop: 6, gap: 12 }}>
                        <div className="meta-item" style={{ fontSize: 12 }}>
                          <FiTag size={13} /> <span>Order #{booking.id}</span>
                        </div>
                        <div className="meta-item" style={{ fontSize: 12 }}>
                          <FiCalendar size={13} /> <span>{bookingDate ? new Date(bookingDate).toLocaleDateString() : "Recent"}</span>
                        </div>
                        <div className="meta-item" style={{ fontSize: 12 }}>
                          <span>Expert: <strong style={{ color: "#1e293b" }}>{booking.expert_name || "Assigned Expert"}</strong></span>
                        </div>
                      </S.MetaGrid>

                      <div className="price-row" style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                        <span className="price-label" style={{ fontSize: 12, color: "#64748b" }}>Paid Amount:</span>
                        <span className="amount" style={{ color: "#059669", fontWeight: 900, fontSize: "1rem" }}>
                          ₹{parseFloat(booking.amount || 0).toLocaleString()}
                        </span>
                      </div>
                    </S.BookingInfo>
                  </div>

                  {/* FLUTTER ACTION FUNNEL */}
                  <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      {!isCompleted && booking.expert_id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => navigate(`/user/chat?expert_id=${booking.expert_id}`)}
                            style={{ padding: "6px 14px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 6px rgba(37,99,235,0.2)" }}
                          >
                            <FiMessageSquare size={13} /> Chat
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/user/voice-call/${booking.expert_id}`, {
                              state: {
                                pricingMode: "master_service",
                                bookingId: booking.id,
                                serviceTitle: booking.service_title
                              }
                            })}
                            style={{ padding: "6px 14px", background: "#059669", color: "#fff", border: 0, borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 6px rgba(5,150,105,0.2)" }}
                          >
                            <FiPhone size={13} /> Voice Call
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#065f46", background: "#ecfdf5", padding: "5px 10px", borderRadius: 8, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                          🔒 Service Completed & Closed
                        </span>
                      )}

                      {(booking.booking_id || booking.id) && (
                        <button
                          type="button"
                          onClick={() => navigate(`/user/workspace/${booking.booking_id || booking.id}`)}
                          style={{ padding: "6px 14px", background: "#0f172a", color: "#fff", border: 0, borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 6px rgba(15,23,42,0.2)" }}
                        >
                          <FiFolder size={13} /> Open Workspace
                        </button>
                      )}
                    </div>

                    <button 
                      className="details-btn" 
                      onClick={() => handleViewService(booking)}
                      style={{ padding: "6px 14px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer", color: "#334155" }}
                    >
                      Service Details <FiChevronRight size={13} />
                    </button>
                  </div>
                </S.BookingCard>
              );
            })}
          </S.BookingList>
        )}
      </S.ContentWrapper>
    </S.PageContainer>
  );
};

export default MyBookings;
