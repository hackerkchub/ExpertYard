import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiTag, FiChevronRight, FiMessageSquare, FiPhone, FiVideo, FiFolder } from "react-icons/fi";
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

  if (!isLoggedIn) return (
    <S.PageContainer>
      <S.EmptyState>Please login to view your orders and bookings.</S.EmptyState>
    </S.PageContainer>
  );

  if (loading) return <S.Loader>Fetching your orders & active services...</S.Loader>;

  return (
    <S.PageContainer>
      <S.ContentWrapper>
        <S.Header>
        </S.Header>

        {bookings.length === 0 ? (
          <S.EmptyState>
            <div className="icon">📦</div>
            <h3>No booked services found.</h3>
            <p>You haven't booked any master services yet.</p>
            <button 
              onClick={() => navigate("/user/all-services")}
              style={{ marginTop: 12, padding: "8px 16px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}
            >
              Explore Master Services
            </button>
          </S.EmptyState>
        ) : (
          <S.BookingList>
            {bookings.map((booking) => {
              const isCompleted = ["COMPLETED", "CANCELLED", "completed", "cancelled"].includes(booking.status);
              const bookingDate = booking.created_at || booking.booking_date;

              return (
                <S.BookingCard key={booking.id} style={{ display: "grid", gap: 14 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <S.ServiceImage 
                      src={getServiceImageUrl(booking.service_image || booking.image_url || booking.thumbnail_url)} 
                      alt={booking.service_title} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/100x100?text=Master+Service";
                      }}
                    />
                    
                    <S.BookingInfo style={{ flex: 1 }}>
                      <div className="top-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{booking.service_title || "Master Service"}</h3>
                        <S.StatusBadge status={booking.status}>
                          {booking.status}
                        </S.StatusBadge>
                      </div>

                      <S.MetaGrid style={{ marginTop: 6 }}>
                        <div className="meta-item">
                          <FiTag /> <span>Order #{booking.id}</span>
                        </div>
                        <div className="meta-item">
                          <FiCalendar /> <span>{bookingDate ? new Date(bookingDate).toLocaleDateString() : "Recent"}</span>
                        </div>
                        <div className="meta-item">
                          <span>Expert: <strong>{booking.expert_name || "Assigned Expert"}</strong></span>
                        </div>
                      </S.MetaGrid>

                      <div className="price-row" style={{ marginTop: 6 }}>
                        <span className="price-label">Paid Amount:</span>
                        <span className="amount" style={{ color: "#059669", fontWeight: 800 }}>₹{parseFloat(booking.amount || 0).toLocaleString()}</span>
                      </div>
                    </S.BookingInfo>
                  </div>

                  {/* REUSE COMMUNICATION & WORKSPACE FUNNEL */}
                  <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      {!isCompleted && booking.expert_id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => navigate(`/user/chat?expert_id=${booking.expert_id}`)}
                            style={{ padding: "6px 12px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                          >
                            <FiMessageSquare /> Chat
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
                            style={{ padding: "6px 12px", background: "#059669", color: "#fff", border: 0, borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                          >
                            <FiPhone /> Voice Call
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#475569", background: "#f1f5f9", padding: "4px 10px", borderRadius: 6, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                          🔒 Service Closed (Chat & Call Disabled)
                        </span>
                      )}

                      {(booking.booking_id || booking.id) && (
                        <button
                          type="button"
                          onClick={() => navigate(`/user/workspace/${booking.booking_id || booking.id}`)}
                          style={{ padding: "6px 12px", background: "#0f172a", color: "#fff", border: 0, borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                        >
                          <FiFolder /> Workspace
                        </button>
                      )}
                    </div>

                    <button 
                      className="details-btn" 
                      onClick={() => handleViewService(booking)}
                      style={{ padding: "6px 12px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                    >
                      Service Details <FiChevronRight />
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
