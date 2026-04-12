import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiArrowLeft, FiShield, FiClock, FiStar } from "react-icons/fi";
import { FaWallet } from "react-icons/fa"; 

import { useAuth } from "../../../../shared/context/UserAuthContext"; 
import { useWallet } from "../../../../shared/context/WalletContext"; 
import * as S from "./ServiceDetails.style";

const ServiceDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth(); 
  const { balance, fetchWalletHistory } = useWallet(); 
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://softmaxs.com/api/services/${id}`);
        if (res.data && res.data.success) {
          setService(res.data.data);
          
          if (isLoggedIn && user?.id) {
            checkExistingBooking(res.data.data.id, user.id);
          }
        }
      } catch (err) {
        console.error("Error fetching service detail:", err);
      } finally {
        setLoading(false);
      }
    };

    const checkExistingBooking = async (serviceId, userId) => {
      try {
        const res = await axios.get(`https://softmaxs.com/api/bookings/user/${userId}`);
        if (res.data && res.data.success) {
          const exists = res.data.data.some(b => b.service_id === parseInt(serviceId) && b.status !== 'cancelled');
          setIsBooked(exists);
        }
      } catch (err) {
        console.error("Error checking existing booking:", err);
      }
    };

    if (id) fetchServiceData();
  }, [id, isLoggedIn, user?.id]);

  const handleBooking = async () => {
    if (!isLoggedIn) {
      Swal.fire({ title: "Login Required", icon: "info", confirmButtonColor: "#0a66c2" });
      return navigate("/login");
    }

    const servicePrice = parseFloat(service.price);

    // ✅ balance check logic updated to auto-redirect
    if (balance < servicePrice) {
      await Swal.fire({
        title: "Insufficient Balance!",
        text: `Wallet Balance: ₹${balance}. Required: ₹${servicePrice}. Redirecting to wallet...`,
        icon: "warning",
        timer: 3000, // 3 second ke baad auto redirect
        showConfirmButton: true,
        confirmButtonText: "Top up Now",
        confirmButtonColor: "#0a66c2",
      });
      return navigate("/user/wallet"); // Direct redirect to wallet page
    }

    const confirm = await Swal.fire({
      title: "Confirm Booking?",
      text: `₹${servicePrice} will be deducted from your wallet.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0a66c2",
      confirmButtonText: "Pay & Book"
    });

    if (!confirm.isConfirmed) return;

    try {
      setBookingLoading(true);

      const walletPayload = {
        user_id: user.id,
        amount: servicePrice,
        expert_id: service.expert_id,
        service_type: "service_booking"
      };

      const deductRes = await axios.post("https://softmaxs.com/api/wallet/deduct", walletPayload);

      if (deductRes.data.success) {
        const bookingPayload = {
          service_id: parseInt(id),
          expert_id: service.expert_id,
          user_id: user.id,
          amount: servicePrice,
          payment_mode: "wallet",
          transaction_id: deductRes.data.transaction_id 
        };

        const bookRes = await axios.post("https://softmaxs.com/api/bookings/book", bookingPayload);

        if (bookRes.data.success) {
          if (fetchWalletHistory) fetchWalletHistory(); 
          
          await Swal.fire({
            title: "Booking Successful!",
            text: "Payment processed via ExpertYard Wallet.",
            icon: "success",
            confirmButtonColor: "#0a66c2",
          });
          navigate(`/user/my-booking/${user.id}`);
        }
      }
    } catch (err) {
      console.error("Transaction Error:", err.response);
      Swal.fire({
        title: "Payment Failed",
        text: err.response?.data?.message || "Internal transaction error.",
        icon: "error",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <S.LoaderWrapper><S.Spinner /> Fetching Service Details...</S.LoaderWrapper>;
  if (!service) return <S.ErrorState>Service not found.</S.ErrorState>;

  return (
    <S.PageWrapper>
      <S.Container>
        <S.BackButton onClick={() => navigate(-1)}><FiArrowLeft /> Back</S.BackButton>
        <S.MainGrid>
          <S.LeftCol>
            <S.HeroImage src={service.image} alt={service.title} />
            <S.InfoBox>
              <h1>{service.title}</h1>
              <div className="meta-tags">
                <span><FiShield /> Verified Expert</span>
                <span><FiStar /> Top Rated</span>
              </div>
              <S.SectionTitle>About Service</S.SectionTitle>
              <p className="description">{service.description}</p>
            </S.InfoBox>
          </S.LeftCol>

          <S.RightCol>
            <S.StickyCard>
              <div className="card-header">
                <span className="label">Total Amount</span>
                <h2 className="price">₹{Math.floor(service.price)}</h2>
              </div>
              
              <div style={{ 
                background: '#f3f2ef', 
                padding: '12px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #ddd'
              }}>
                <span style={{ fontSize: '14px', color: '#555' }}><FaWallet /> Wallet Balance</span>
                <strong style={{ color: balance < service.price ? '#d33' : '#057642' }}>₹{balance}</strong>
              </div>

              <S.BookingButton 
                onClick={handleBooking} 
                disabled={bookingLoading || isBooked}
                style={{ 
                  background: isBooked ? '#057642' : (balance < service.price ? '#999' : '#0a66c2'),
                  cursor: (balance < service.price || isBooked) ? 'not-allowed' : 'pointer'
                }}
              >
                {bookingLoading 
                  ? "Processing..." 
                  : isBooked 
                    ? "Already Booked" 
                    : (balance < service.price ? "Go to Wallet" : "Pay via Wallet")
                }
              </S.BookingButton>
              <p className="footer-text">Instant & Secure Payment</p>
            </S.StickyCard>
          </S.RightCol>
        </S.MainGrid>
      </S.Container>
    </S.PageWrapper>
  );
};

export default ServiceDetail;