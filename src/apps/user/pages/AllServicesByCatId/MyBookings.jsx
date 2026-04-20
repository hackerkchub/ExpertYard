import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Navigation ke liye
import { FiCalendar, FiClock, FiTag, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../../../../shared/context/UserAuthContext"; 
import * as S from "./MyBookings.style";

const MyBookings = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate(); // Hook initialize kiya
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const res = await axios.get(`https://softmaxs.com/api/bookings/user/${user.id}`);
        if (res.data.success) {
          setBookings(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [user?.id]);

  // Click Handler: Service details page par bhejne ke liye
  const handleViewService = (serviceId) => {
    navigate(`/user/service-details/${serviceId}`);
  };

  if (!isLoggedIn) return (
    <S.PageContainer>
      <S.EmptyState>Please login to view your bookings.</S.EmptyState>
    </S.PageContainer>
  );

  if (loading) return <S.Loader>Fetching your bookings...</S.Loader>;

  return (
    <S.PageContainer>
      <S.ContentWrapper>
        <S.Header>
          <h1>My Bookings</h1>
          <p>Track and manage your professional service requests</p>
        </S.Header>

        {bookings.length === 0 ? (
          <S.EmptyState>
            <div className="icon">📅</div>
            <h3>No Bookings Found</h3>
            <p>You haven't booked any services yet.</p>
          </S.EmptyState>
        ) : (
          <S.BookingList>
            {bookings.map((booking) => (
              <S.BookingCard key={booking.id}>
             <S.ServiceImage 
  src={`https://softmaxs.com/${booking.service_image}`} 
  alt={booking.service_title} 
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/100x100?text=No+Image";
  }}
/>
                
                <S.BookingInfo>
                  <div className="top-row">
                    <h3>{booking.service_title}</h3>
                    <S.StatusBadge status={booking.status}>
                      {booking.status}
                    </S.StatusBadge>
                  </div>

                  <S.MetaGrid>
                    <div className="meta-item">
                      <FiTag /> <span>Booking ID: #{booking.id}</span>
                    </div>
                    <div className="meta-item">
                      <FiCalendar /> <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                    </div>
                    <div className="meta-item">
                      <FiClock /> <span>{new Date(booking.booking_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </S.MetaGrid>

                  <div className="price-row">
                    <span className="price-label">Amount:</span>
                    <span className="amount">₹{parseFloat(booking.amount).toLocaleString()}</span>
                  </div>
                </S.BookingInfo>

                <S.ActionArea>
                  {/* Button par click karte hi detail page par jayega */}
                  <button 
                    className="details-btn" 
                    onClick={() => handleViewService(booking.service_id)}
                  >
                    View Service <FiChevronRight />
                  </button>
                </S.ActionArea>
              </S.BookingCard>
            ))}
          </S.BookingList>
        )}
      </S.ContentWrapper>
    </S.PageContainer>
  );
};

export default MyBookings;