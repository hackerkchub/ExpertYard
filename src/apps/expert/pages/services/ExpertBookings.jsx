import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiPackage } from "react-icons/fi";
import { useExpert } from "../../../../shared/context/ExpertContext";
import * as S from "./ExpertBookings.style";

const ExpertBookings = () => {
  const { expertData, profileLoading } = useExpert();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState({}); // User details store karne ke liye map
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(null);

  useEffect(() => {
    if (expertData?.expertId) {
      fetchBookingsAndUsers();
    }
  }, [expertData?.expertId]);

  const fetchBookingsAndUsers = async () => {
    try {
      setLoading(true);
      // 1. Fetch Bookings
      const res = await axios.get(`https://softmaxs.com/api/bookings/expert/${expertData.expertId}`);
      const bookingData = res.data.data || [];
      setBookings(bookingData);

      // 2. Unique User IDs nikalna
      const uniqueUserIds = [...new Set(bookingData.map(b => b.user_id))];

      // 3. Sabhi unique users ka data fetch karna
      const userDetailsMap = {};
      await Promise.all(
        uniqueUserIds.map(async (id) => {
          try {
            const userRes = await axios.get(`https://softmaxs.com/api/user/public/${id}`);
            // Maan lete hain ki backend se data res.data.data me aa raha hai
            userDetailsMap[id] = userRes.data.data || userRes.data; 
          } catch (err) {
            console.error(`Error fetching user ${id}:`, err);
            userDetailsMap[id] = { name: "Unknown User", email: "N/A", phone: "N/A" };
          }
        })
      );
      setUsers(userDetailsMap);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdateLoading(bookingId);
    try {
      const response = await axios.put(`https://softmaxs.com/api/bookings/status/${bookingId}`, { 
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

  if (profileLoading || loading) return <S.PageWrapper><S.StatusBox>Loading Details...</S.StatusBox></S.PageWrapper>;

  return (
    <S.PageWrapper>
      <S.Container>
        <S.Header>
          <h1>Expert Bookings</h1>
          <p>Detailed client requests for <strong>{expertData?.name}</strong></p>
        </S.Header>

        {bookings.length === 0 ? (
          <S.EmptyState><FiPackage size={40} /><p>No bookings found.</p></S.EmptyState>
        ) : (
          <S.BookingGrid>
            {bookings.map((booking) => {
              const userData = users[booking.user_id] || {};
              return (
                <S.BookingCard key={booking.id}>
                  <S.CardHeader>
                    <div className="title-area">
                      <h3>{booking.service_title}</h3>
                      <span className="booking-id">Booking ID: #{booking.id}</span>
                    </div>
                    <S.StatusBadge $status={booking.status}>{booking.status}</S.StatusBadge>
                  </S.CardHeader>

                  <S.UserDetailSection>
                    <div className="user-row">
                      <FiUser /> <strong>{userData.name || userData.full_name || `User #${booking.user_id}`}</strong>
                    </div>
                    <div className="user-row">
                      <FiMail /> <span>{userData.email || "Email not available"}</span>
                    </div>
                    <div className="user-row">
                      <FiPhone /> <span>{userData.phone || "Phone not available"}</span>
                    </div>
                  </S.UserDetailSection>

                  <S.CardBody>
                    <div className="info-row">
                      <FiCalendar size={14} /> 
                      <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                    </div>
                    <div className="info-row">
                      <FiClock size={14} /> 
                      <span>Amount: <strong>₹{booking.amount}</strong></span>
                    </div>
                  </S.CardBody>

                  <S.CardActions>
                    <div className="select-wrapper">
                      <label>Status:</label>
                      <select 
                        value={booking.status} 
                        onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                        disabled={updateLoading === booking.id}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    {updateLoading === booking.id && <S.MiniLoader>...</S.MiniLoader>}
                  </S.CardActions>
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