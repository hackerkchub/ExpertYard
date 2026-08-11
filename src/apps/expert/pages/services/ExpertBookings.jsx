import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiPackage, FiMessageSquare, FiVideo, FiFolder } from "react-icons/fi";
import { useExpert } from "../../../../shared/context/ExpertContext";
import * as S from "./ExpertBookings.style";
import { APP_CONFIG } from "../../../../config/appConfig";

import { requestWorkspaceStatusChange } from "../../../../shared/api/workspace.api";

const ExpertBookings = () => {
  const navigate = useNavigate();
  const { expertData, profileLoading } = useExpert();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(null);

  // Status Change Request Modal State
  const [requestModal, setRequestModal] = useState({
    isOpen: false,
    bookingId: null,
    targetStatus: "COMPLETED",
    notes: "",
    submitting: false,
  });

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

  const handleStatusSelect = (bookingId, selectedValue) => {
    if (selectedValue === "completed" || selectedValue === "request_completed") {
      setRequestModal({
        isOpen: true,
        bookingId,
        targetStatus: "COMPLETED",
        notes: "",
        submitting: false,
      });
      return;
    }

    if (selectedValue === "cancelled" || selectedValue === "request_cancelled") {
      setRequestModal({
        isOpen: true,
        bookingId,
        targetStatus: "CANCELLED",
        notes: "",
        submitting: false,
      });
      return;
    }

    // Direct status updates for pending, confirmed, in_progress
    handleStatusUpdate(bookingId, selectedValue);
  };

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
      alert(err?.response?.data?.message || "Status update failed");
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleSubmitStatusRequest = async (e) => {
    e.preventDefault();
    if (!requestModal.notes.trim()) {
      return alert("Please enter work description or cancellation reason for Admin approval.");
    }

    setRequestModal(prev => ({ ...prev, submitting: true }));
    try {
      const response = await requestWorkspaceStatusChange(
        requestModal.bookingId,
        requestModal.targetStatus,
        requestModal.notes
      );

      if (response?.data?.success) {
        const reqKey = requestModal.targetStatus === "COMPLETED" ? "COMPLETED_REQUESTED" : "CANCELLED_REQUESTED";
        setBookings(prev => prev.map(b => b.id === requestModal.bookingId ? {
          ...b,
          status: "in_progress",
          expert_status_request: reqKey,
          expert_request_notes: requestModal.notes
        } : b));

        alert("✅ Request submitted to Admin for approval. Status remains In Progress until Admin confirms.");
        setRequestModal({ isOpen: false, bookingId: null, targetStatus: "COMPLETED", notes: "", submitting: false });
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit status request to Admin.");
      setRequestModal(prev => ({ ...prev, submitting: false }));
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
              const hasPendingReq = booking.expert_status_request;

              return (
                <S.BookingCard key={booking.id}>
                  <S.CardHeader>
                    <div className="title-area">
                      <h3>{booking.service_title || `Master Service Order #${booking.id}`}</h3>
                      <span className="booking-id">Booking ID: #{booking.id}</span>
                    </div>
                    {hasPendingReq === "COMPLETED_REQUESTED" ? (
                      <span style={{ padding: "0.25rem 0.65rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700", background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}>
                        ⏳ Completion Requested (Pending Admin)
                      </span>
                    ) : hasPendingReq === "CANCELLED_REQUESTED" ? (
                      <span style={{ padding: "0.25rem 0.65rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700", background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" }}>
                        ⚠️ Cancellation Requested (Pending Admin)
                      </span>
                    ) : (
                      <S.StatusBadge $status={booking.status}>{booking.status}</S.StatusBadge>
                    )}
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
                            onClick={() => handleStatusSelect(booking.id, "request_cancelled")}
                            style={{ flex: 1, padding: "6px", background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                          >
                            Request Reject
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
                          onChange={(e) => handleStatusSelect(booking.id, e.target.value)}
                          disabled={updateLoading === booking.id || hasPendingReq}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="request_completed">Request Complete (Needs Admin Approval)</option>
                          <option value="request_cancelled">Request Cancellation (Needs Admin Approval)</option>
                        </select>
                      </div>
                      {updateLoading === booking.id && <S.MiniLoader>...</S.MiniLoader>}
                    </S.CardActions>

                    {booking.expert_request_notes && (
                      <div style={{ background: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '4px', borderLeft: '3px solid #f59e0b', fontSize: '0.75rem', color: '#475569' }}>
                        <strong>Submitted Request Notes:</strong> "{booking.expert_request_notes}"
                      </div>
                    )}
                  </div>
                </S.BookingCard>
              );
            })}
          </S.BookingGrid>
        )}

        {/* Modal Dialog for Expert Status Request Notes */}
        {requestModal.isOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: '1rem'
          }}>
            <div style={{
              background: '#ffffff', borderRadius: '12px', maxWidth: '550px', width: '100%',
              padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>
                  {requestModal.targetStatus === "COMPLETED" ? "🏆 Request Order Completion" : "🚫 Request Order Cancellation"}
                </h3>
                <button
                  type="button"
                  onClick={() => setRequestModal({ isOpen: false, bookingId: null, targetStatus: "COMPLETED", notes: "", submitting: false })}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: '800' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitStatusRequest}>
                <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  {requestModal.targetStatus === "COMPLETED"
                    ? "Describe the work done and deliverables submitted. Your completion request will be sent to Admin for final approval."
                    : "Please describe the reason for cancellation. Admin will review and confirm the status change."}
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.35rem' }}>
                    {requestModal.targetStatus === "COMPLETED" ? "Work Completion Summary *" : "Cancellation Reason *"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={requestModal.targetStatus === "COMPLETED" ? "e.g. Completed document verification, generated final certificate, and uploaded deliverables to client." : "e.g. Client requested cancellation or invalid parameters provided."}
                    value={requestModal.notes}
                    onChange={(e) => setRequestModal(prev => ({ ...prev, notes: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setRequestModal({ isOpen: false, bookingId: null, targetStatus: "COMPLETED", notes: "", submitting: false })}
                    style={{ padding: '0.6rem 1.25rem', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={requestModal.submitting}
                    style={{
                      padding: '0.6rem 1.25rem',
                      background: requestModal.targetStatus === "COMPLETED" ? '#059669' : '#dc2626',
                      color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer'
                    }}
                  >
                    {requestModal.submitting ? "Submitting to Admin..." : "📩 Submit Request to Admin"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </S.Container>
    </S.PageWrapper>
  );
};

export default ExpertBookings;
