import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiPackage, FiMessageSquare, FiVideo, FiFolder } from "react-icons/fi";
import { useExpert } from "../../../../shared/context/ExpertContext";
import * as S from "./ExpertBookings.style";
import { APP_CONFIG } from "../../../../config/appConfig";

const ExpertBookings = () => {
  const navigate = useNavigate();
  const { expertData, profileLoading } = useExpert();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(null);

  const fetchBookingsAndUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${APP_CONFIG.API_BASE_URL}/bookings/expert/${expertData.expertId}`);
      const bookingData = res.data.data || [];
      setBookings(bookingData);

      const uniqueUserIds = [...new Set(bookingData.map(b => b.user_id))];
      const userDetailsMap = {};
      await Promise.all(
        uniqueUserIds.map(async (id) => {
          try {
            const userRes = await axios.get(`${APP_CONFIG.API_BASE_URL}/user/public/${id}`);
            userDetailsMap[id] = userRes.data.data || userRes.data; 
          } catch (err) {
            console.error(`Error fetching user ${id}:`, err);
            userDetailsMap[id] = { name: "Client User", email: "N/A", phone: "N/A" };
          }
        })
      );
      setUsers(userDetailsMap);
    } catch (err) {
      console.error("Error fetching expert bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expertData?.expertId) {
      fetchBookingsAndUsers();
    }
  }, [expertData?.expertId]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdateLoading(bookingId);
    try {
      const response = await axios.put(`${APP_CONFIG.API_BASE_URL}/bookings/status/${bookingId}`, { 
        status: newStatus 
      });
      if (response.data.success) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      alert("Status update failed");
    } finally {
      setUpdateLoading(null);
    }
  };

  if (profileLoading || loading) return <S.PageWrapper><S.StatusBox>Loading Bookings...</S.StatusBox></S.PageWrapper>;

  return (
    <S.PageWrapper>
      <S.Container>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f0f2f5", padding: "10px 16px", borderRadius: "12px", border: "1px solid #e9edef", marginBottom: "1rem" }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
            title="Go Back"
          >
            <FiArrowLeft size={18} color="#111b21" />
          </button>
          <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#111b21" }}>Service Bookings</h2>
        </div>

        <S.Header>
          <h1>Expert Bookings Console</h1>
          <p>Client requests and service fulfillment orders for <strong>{expertData?.name}</strong></p>
        </S.Header>

        {bookings.length === 0 ? (
          <S.EmptyState><FiPackage size={40} /><p>No bookings assigned yet.</p></S.EmptyState>
        ) : (
          <S.BookingGrid>
            {bookings.map((booking) => {
              const isCompleted = ["COMPLETED", "CANCELLED", "completed", "cancelled"].includes(booking.status);
              const userData = users[booking.user_id] || {};

              return (
                <S.BookingCard key={booking.id}>
                  <S.CardHeader>
                    <div className="title-area">
                      <h3>{booking.service_title || `Master Service Order #${booking.id}`}</h3>
                      <span className="booking-id">Booking ID: #{booking.id}</span>
                    </div>
                    <S.StatusBadge $status={booking.status}>{booking.status}</S.StatusBadge>
                  </S.CardHeader>

                  <S.UserDetailSection>
                    <div className="user-row">
                      <FiUser /> <strong>{userData.name || userData.full_name || `User #${booking.user_id}`}</strong>
                    </div>
                    <div className="user-row">
                      <FiMail /> <span>{userData.email || "Email N/A"}</span>
                    </div>
                    <div className="user-row">
                      <FiPhone /> <span>{userData.phone || "Phone N/A"}</span>
                    </div>
                  </S.UserDetailSection>

                  <S.CardBody>
                    <div className="info-row">
                      <FiCalendar size={14} /> 
                      <span>{booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : "Recent"}</span>
                    </div>
                    <div className="info-row">
                      <FiClock size={14} /> 
                      <span>Amount: <strong>₹{booking.amount}</strong></span>
                    </div>
                  </S.CardBody>

                  <div style={{ padding: "0 1rem 1rem", display: "grid", gap: "0.5rem" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {booking.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                            style={{ flex: 1, padding: "6px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                          >
                            Accept Booking
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                            style={{ flex: 1, padding: "6px", background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => navigate(`/expert/workspace/${booking.id}`)}
                        style={{ flex: 1, padding: "6px", background: "#059669", color: "#fff", border: 0, borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                      >
                        <FiFolder size={12} /> Open Workspace
                      </button>
                    </div>

                    {!isCompleted ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => {
                            const expId = booking.expert_id || expertData?.expertId || expertData?.id;
                            navigate(`/expert/chat/chat_${booking.user_id}_${expId}`);
                          }}
                          style={{ flex: 1, padding: "4px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                        >
                          <FiMessageSquare size={11} /> Chat
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/expert/voice-call/${booking.user_id}`)}
                          style={{ flex: 1, padding: "4px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                        >
                          <FiPhone size={11} /> Call
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: "11px", color: "#065f46", background: "#ecfdf5", padding: "6px", borderRadius: 6, fontWeight: "700", textAlign: "center" }}>
                        🔒 Order Completed (Chat & Call Disabled)
                      </div>
                    )}

                    <S.CardActions>
                      <div className="select-wrapper">
                        <label>Update Status:</label>
                        <select 
                          value={booking.status} 
                          onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                          disabled={updateLoading === booking.id}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      {updateLoading === booking.id && <S.MiniLoader>...</S.MiniLoader>}
                    </S.CardActions>
                  </div>
                </S.BookingCard>
              );
            })}
          </S.BookingGrid>
        )}
      </S.Container>
    </S.PageWrapper>
  );
};

export default ExpertBookings;
