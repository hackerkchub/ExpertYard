import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiShield, FiClock, FiStar, FiZap, FiCheck } from "react-icons/fi";
import { FaWallet } from "react-icons/fa"; 


import { useAuth } from "../../../../shared/context/UserAuthContext"; 
import { useWallet } from "../../../../shared/context/WalletContext"; 
import * as S from "./ServiceDetails.style";

const ServiceDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth(); 
  const { balance, fetchWalletHistory } = useWallet(); 
  
  // Instant Cache Loading
  const [service, setService] = useState(() => {
    const cachedData = localStorage.getItem(`service_cache_${id}`);
    return cachedData ? JSON.parse(cachedData) : null;
  });
  
  const [loading, setLoading] = useState(!service);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const fetchServiceData = useCallback(async () => {
    try {
      const res = await axios.get(`https://softmaxs.com/api/services/${id}`);
      if (res.data && res.data.success) {
        const freshData = res.data.data;
        setService(freshData);
        localStorage.setItem(`service_cache_${id}`, JSON.stringify(freshData));
        
        if (isLoggedIn && user?.id) {
          checkExistingBooking(freshData.id, user.id);
        }
      }
    } catch (err) {
      console.error("Error fetching service:", err);
    } finally {
      setLoading(false);
    }
  }, [id, isLoggedIn, user?.id]);

  const checkExistingBooking = async (serviceId, userId) => {
    try {
      const res = await axios.get(`https://softmaxs.com/api/bookings/user/${userId}`);
      if (res.data && res.data.success) {
        const exists = res.data.data.some(b => b.service_id === parseInt(serviceId) && b.status !== 'cancelled');
        setIsBooked(exists);
      }
    } catch (err) {
      console.error("Error checking booking:", err);
    }
  };

  useEffect(() => {
    if (id) fetchServiceData();
  }, [id, fetchServiceData]);

  const handleBooking = async () => {
    if (!isLoggedIn) {
      Swal.fire({ title: "Login Required", icon: "info", confirmButtonColor: "#0a66c2" });
      return navigate("/login");
    }

    const servicePrice = parseFloat(service.price);

    if (balance < servicePrice) {
      await Swal.fire({
        title: "Insufficient Balance!",
        text: `Required: ₹${servicePrice}. Your Wallet: ₹${balance}.`,
        icon: "warning",
        confirmButtonText: "Top up Now",
        confirmButtonColor: "#0a66c2",
      });
      return navigate("/user/wallet");
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
      const walletPayload = { user_id: user.id, amount: servicePrice, expert_id: service.expert_id, service_type: "service_booking" };
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
          await Swal.fire({ title: "Booking Successful!", icon: "success", confirmButtonColor: "#0a66c2" });
          navigate(`/user/my-booking/${user.id}`);
        }
      }
    } catch (err) {
      Swal.fire({ title: "Payment Failed", text: "Transaction error.", icon: "error" });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading && !service) return <S.LoaderWrapper><S.Spinner /> Loading...</S.LoaderWrapper>;
  if (!service) return <S.ErrorState>Service not found.</S.ErrorState>;

  return (
    <S.PageWrapper>
      <S.Container>
        <S.TopBar>
           <S.BackButton onClick={() => navigate(-1)}><FiArrowLeft /> Back</S.BackButton>
           <S.FastTag><FiZap /> Instant Expert Connection</S.FastTag>
        </S.TopBar>

        <S.HorizontalLayout>
          {/* LEFT: Image Only */}
          <S.ImageSide>
            <S.HeroImage src={service.image} alt={service.title} />
            <S.Badge><FiShield /> Verified Service</S.Badge>
          </S.ImageSide>

          {/* RIGHT: Content, Price & Buttons */}
          <S.ContentSide>
            <S.MainInfoCard>
              <S.TitleSection>
                <h1>{service.title}</h1>
                <div className="meta-stats">
                  <span className="rating"><FiStar /> 4.9 (High Rated)</span>
                  <span className="time"><FiClock /> 30 Mins</span>
                </div>
              </S.TitleSection>

              <S.DescriptionBox>
                <h3>About this Service</h3>
                <p>{service.description}</p>
              </S.DescriptionBox>

              <S.Divider />

              <S.PricingActionRow>
                <S.PriceBlock>
                  <span className="label">Total Price</span>
                  <h2 className="price-val">₹{Math.floor(service.price)}</h2>
                </S.PriceBlock>

                <S.WalletBlock isLow={balance < service.price}>
                  <div className="w-head">
                    <FaWallet /> <span>Wallet Balance: <strong>₹{balance}</strong></span>
                  </div>
                </S.WalletBlock>
              </S.PricingActionRow>

              <S.ButtonGroup>
                <S.PrimaryButton 
                  onClick={handleBooking} 
                  disabled={bookingLoading || isBooked}
                  status={isBooked ? "booked" : (balance < service.price ? "low" : "ok")}
                >
                  {bookingLoading ? "Processing..." : isBooked ? "Service Already Booked" : (balance < service.price ? "Low Balance - Add Money" : "Book Now & Pay via Wallet")}
                </S.PrimaryButton>
              </S.ButtonGroup>

              <S.TrustBar>
                <span><FiCheck /> Secured Payments</span>
                <span><FiCheck /> 24/7 Support</span>
                <span><FiCheck /> Quality Guaranteed</span>
              </S.TrustBar>
            </S.MainInfoCard>
          </S.ContentSide>
        </S.HorizontalLayout>
      </S.Container>
    </S.PageWrapper>
  );
};

export default ServiceDetail;