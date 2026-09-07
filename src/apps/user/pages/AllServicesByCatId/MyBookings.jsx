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
import PremiumCenterLoader from "../../../../shared/components/Loader/PremiumCenterLoader";
import ServiceInquiryModal from "../MasterService/components/ServiceInquiryModal";

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
  const [selectedInquiryBooking, setSelectedInquiryBooking] = useState(null);

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

  const displayBookings = activeTab === "active" ? activeBookings : historyBookings;

  if (loading) {
    return <PremiumCenterLoader text="Loading your orders & services..." />;
  }

  return (
    <S.PageContainer>
      <S.ContentWrapper>
        {/* Header Bar */}
        <S.HeaderBar>
          <S.HeaderSection>
            <S.Title>My Orders & Service Workspaces</S.Title>
            <S.Subtitle>Track status, contact assigned experts, submit inquiries, or open workspace</S.Subtitle>
          </S.HeaderSection>
          <button
            onClick={fetchMyBookings}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 12,
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              fontSize: 13,
              fontWeight: 700,
              color: "#334155",
              cursor: "pointer"
            }}
          >
            <FiRefreshCw size={14} /> Refresh
          </button>
        </S.HeaderBar>

        {/* Tab Switcher */}
        <S.TabSwitcher>
          <S.TabButton
            $active={activeTab === "active"}
            onClick={() => setActiveTab("active")}
          >
            <FiZap size={15} /> Active Orders
            <S.TabCountBadge $active={activeTab === "active"} $type="active">
              {activeBookings.length}
            </S.TabCountBadge>
          </S.TabButton>
          <S.TabButton
            $active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
          >
            <FiCheckCircle size={15} /> Order History
            <S.TabCountBadge $active={activeTab === "history"} $type="history">
              {historyBookings.length}
            </S.TabCountBadge>
          </S.TabButton>
        </S.TabSwitcher>

        {displayBookings.length === 0 ? (
          <S.EmptyState>
            <div className="icon">📦</div>
            <h3>{activeTab === "active" ? "No Active Orders" : "No Completed Orders"}</h3>
            <p>
              {activeTab === "active"
                ? "You don't have any active orders right now. Explore master services to book an expert."
                : "You haven't completed any master service orders yet."}
            </p>
          </S.EmptyState>
        ) : (
          <S.BookingList>
            {displayBookings.map((booking) => {
              const statusClean = String(booking.status || "").toLowerCase();
              const stepKey = String(booking.current_step_key || "").toUpperCase();

              const isTrulyCompleted = statusClean === "completed" || stepKey === "COMPLETED" || statusClean === "closed" || stepKey === "CLOSED";
              const isTrulyCancelled = statusClean === "cancelled" || stepKey === "CANCELLED";

              // Check expert assignment type
              const assignmentType = booking.assignment_type || (booking.expert_id ? "expert" : "admin_queue");
              const isRealExpert = Boolean(booking.expert_id && assignmentType === "expert");
              const isAdminHandled = assignmentType === "admin_handled";
              const isAdminQueue = assignmentType === "admin_queue" || (!isRealExpert && !isAdminHandled);

              const bookingDate = booking.created_at || booking.booking_date;
              const hasPendingReq = booking.expert_status_request;

              const displayExpertName = isRealExpert
                ? (booking.expert_name || "Assigned Expert")
                : isAdminHandled
                ? "G9Expert Support Team"
                : "Awaiting Admin Assignment";

              const statusBadgeText = isTrulyCompleted
                ? "COMPLETED"
                : isTrulyCancelled
                ? "CANCELLED"
                : isAdminQueue
                ? "AWAITING EXPERT ASSIGNMENT"
                : isAdminHandled
                ? "MANAGED BY SUPPORT"
                : stepKey ? stepKey.replace(/_/g, " ") : (booking.status || "CONFIRMED").toUpperCase();

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
                          <S.StatusBadge status={statusBadgeText} style={{ fontSize: "0.75rem", padding: "3px 10px", borderRadius: 8, fontWeight: 800, textTransform: "uppercase" }}>
                            {statusBadgeText}
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
                          <span>Expert: <strong style={{ color: "#1e293b" }}>{displayExpertName}</strong></span>
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

                  {/* ACTION FUNNEL */}
                  <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      {!isTrulyCompleted && !isTrulyCancelled && isRealExpert ? (
                        <>
                          <button
                            type="button"
                            onClick={() => navigate(`/user/chat?expert_id=${booking.expert_id}`)}
                            style={{ padding: "6px 14px", background: "#6b46c1", color: "#fff", border: 0, borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 6px rgba(107,70,193,0.2)" }}
                          >
                            <FiMessageSquare size={13} /> Chat with Expert
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
                      ) : !isTrulyCompleted && !isTrulyCancelled ? (
                        <button
                          type="button"
                          onClick={() => setSelectedInquiryBooking(booking)}
                          style={{ padding: "6px 14px", background: "#6b46c1", color: "#fff", border: 0, borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 6px rgba(107,70,193,0.2)" }}
                        >
                          <FiMessageSquare size={13} /> Submit Inquiry
                        </button>
                      ) : isTrulyCompleted ? (
                        <span style={{ fontSize: "11px", color: "#065f46", background: "#ecfdf5", padding: "5px 10px", borderRadius: 8, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                          🔒 Service Completed & Closed
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#991b1b", background: "#fee2e2", padding: "5px 10px", borderRadius: 8, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                          ❌ Booking Cancelled
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

      {/* SERVICE DETAIL INQUIRY MODAL REUSE */}
      {selectedInquiryBooking && (
        <ServiceInquiryModal
          service={{
            id: selectedInquiryBooking.master_service_id || selectedInquiryBooking.service_id || 1,
            title: selectedInquiryBooking.service_title || "Master Service",
            booking_id: selectedInquiryBooking.booking_id || selectedInquiryBooking.id,
          }}
          bookingId={selectedInquiryBooking.booking_id || selectedInquiryBooking.id}
          user={user}
          onClose={() => setSelectedInquiryBooking(null)}
        />
      )}
    </S.PageContainer>
  );
};

export default MyBookings;
