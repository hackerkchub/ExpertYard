import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiCheck,
  FiClock,
  FiDownload,
  FiFileText,
  FiLock,
  FiMessageCircle,
  FiPhone,
  FiShield,
  FiStar,
  FiVideo,
  FiZap,
} from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import useNetworkReconnect from "../../../../shared/hooks/useNetworkReconnect";
import { fireAlert } from "../../../../shared/utils/lazyNotifications";
import { deductWalletApi } from "../../../../shared/api/userApi/walletApi";
import api from "../../../../shared/api/axiosInstance";
import * as S from "./ServiceDetails.style";
import { APP_CONFIG } from "../../../../config/appConfig";

const DEFAULT_SERVICE_IMAGE = "https://via.placeholder.com/800x450?text=Service+Image";
const productTypes = new Set(["digital_product", "digital_package", "course", "custom"]);

const formatLines = (text) => {
  if (!text) return [<p key="empty">No description provided.</p>];

  return String(text).split("\n").map((line, index) => {
    const value = line.trim();
    if (!value) return <br key={index} />;
    if (value.startsWith("-") || value.startsWith("*")) {
      return <li key={index}>{value.slice(1).trim()}</li>;
    }
    if (value.length < 80 && !value.endsWith(".")) {
      return <h4 key={index}>{value}</h4>;
    }
    return <p key={index}>{value}</p>;
  });
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();
  const { balance, fetchWalletHistory } = useWallet();

  const [service, setService] = useState(() => {
    const cachedData = localStorage.getItem(`service_cache_${slug}`);
    return cachedData ? JSON.parse(cachedData) : null;
  });
  const [loading, setLoading] = useState(!service);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const isProductService = productTypes.has(service?.service_type);
  const activePrice = Number(service?.offer_price || service?.price || 0);
  const serviceType = service?.type_label || String(service?.service_type || "consultation").replace("_", " ");

  const checkExistingBooking = async (serviceId, userId) => {
    try {
      const res = await axios.get(`${APP_CONFIG.API_BASE_URL}/bookings/user/${userId}`);
      if (res.data?.success) {
        const exists = res.data.data.some(
          (booking) => booking.service_id === parseInt(serviceId, 10) && booking.status !== "cancelled"
        );
        setIsBooked(exists);
      }
    } catch (err) {
      console.error("Error checking booking:", err);
    }
  };

  const fetchServiceData = useCallback(async () => {
    try {
      const res = await axios.get(`${APP_CONFIG.API_BASE_URL}/services/s/${slug}`);
      if (res.data?.success) {
        const freshData = res.data.data;
        setService(freshData);
        localStorage.setItem(`service_cache_${slug}`, JSON.stringify(freshData));
        if (isLoggedIn && user?.id) {
          checkExistingBooking(freshData.id, user.id);
        }
      }
    } catch (err) {
      console.error("Error fetching service:", err);
    } finally {
      setLoading(false);
    }
  }, [slug, isLoggedIn, user?.id]);

  useEffect(() => {
    if (slug) fetchServiceData();
  }, [slug, fetchServiceData]);

  useNetworkReconnect(fetchServiceData, { enabled: Boolean(slug) });

  const handleBooking = async () => {
    if (!isLoggedIn) {
      fireAlert({ title: "Login Required", icon: "info", confirmButtonColor: "#0a66c2" });
      return navigate("/user/auth", { state: { from: location } });
    }

    if (balance < activePrice) {
      await fireAlert({
        title: "Insufficient Balance!",
        text: `Required: ₹${activePrice}. Your Wallet: ₹${balance}.`,
        icon: "warning",
        confirmButtonText: "Top up Now",
        confirmButtonColor: "#0a66c2",
      });
      return navigate("/user/wallet");
    }

    const confirm = await fireAlert({
      title: isProductService ? "Confirm Purchase?" : "Confirm Booking?",
      text: `₹${activePrice} will be deducted from your wallet.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0a66c2",
      confirmButtonText: isProductService ? "Pay & Unlock" : "Pay & Book",
    });

    if (!confirm.isConfirmed) return;

    try {
      setBookingLoading(true);
      const deductRes = await deductWalletApi({
        amount: activePrice,
        expert_id: service.expert_id,
        service_type: "service_booking",
      });

      if (deductRes.success) {
        const bookingPayload = {
          service_id: parseInt(service.id, 10),
          expert_id: service.expert_id,
          user_id: user.id,
          amount: activePrice,
          payment_mode: "wallet",
          transaction_id: deductRes.transaction_id,
        };

        const bookRes = await axios.post(`${APP_CONFIG.API_BASE_URL}/bookings/book`, bookingPayload);

        if (bookRes.data.success) {
          if (fetchWalletHistory) fetchWalletHistory();
          setIsBooked(true);
          await fireAlert({
            title: isProductService ? "Access Unlocked!" : "Booking Successful!",
            text: "Payment processed via Guidexa Wallet.",
            icon: "success",
            confirmButtonColor: "#0a66c2",
          });
          fetchServiceData();
        }
      }
    } catch (err) {
      fireAlert({ title: "Payment Failed", text: "Transaction error.", icon: "error" });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleFileDownload = async (file) => {
    if (!isLoggedIn) {
      fireAlert({ title: "Login Required", icon: "info", confirmButtonColor: "#0a66c2" });
      return navigate("/user/auth", { state: { from: location } });
    }

    if (file.locked && !isBooked) {
      fireAlert({ title: "Purchase Required", text: "Buy this service to unlock paid files.", icon: "info" });
      return;
    }

    try {
      const response = await api.get(`/services/${service.id}/download/${file.id}`, {
        responseType: "blob",
        skipLoader: true,
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_name || file.file_title || "service-file";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      fireAlert({ title: "Access denied", text: error?.message || "Unable to download this file.", icon: "error" });
    }
  };

  if (loading && !service) return <S.LoaderWrapper><S.Spinner /> Loading...</S.LoaderWrapper>;
  if (!service) return <S.ErrorState>Service not found.</S.ErrorState>;

  return (
    <S.PageWrapper className="service-detail-page">
      <S.Container>
        <S.TopBar>
          <S.FastTag><FiZap /> {isProductService ? "Digital Service" : "Instant Expert Connection"}</S.FastTag>
        </S.TopBar>

        <S.HorizontalLayout>
          <S.ImageSide>
            <S.HeroImage
              src={service.cover_image || service.image || DEFAULT_SERVICE_IMAGE}
              alt={service.title}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = DEFAULT_SERVICE_IMAGE;
              }}
            />
            <S.Badge><FiShield /> {serviceType}</S.Badge>
          </S.ImageSide>

          <S.ContentSide>
            <S.MainInfoCard>
              <S.TitleSection>
                <h1>{service.title}</h1>
                <div className="meta-stats">
                  <span className="rating"><FiStar /> 4.9 (High Rated)</span>
                  <span className="time"><FiClock /> {service.instant_access ? "Instant Access" : "30 Mins"}</span>
                </div>
              </S.TitleSection>

              <S.PricingActionRow>
                <S.PriceBlock>
                  <span className="label">{isProductService ? "Buy Now Price" : "Total Price"}</span>
                  <h2 className="price-val">
                    {service.offer_price && <small>₹{Math.floor(service.price || 0)}</small>}
                    ₹{Math.floor(activePrice)}
                  </h2>
                </S.PriceBlock>

                <S.WalletBlock isLow={balance < activePrice}>
                  <div className="w-head">
                    <FaWallet /> <span>Wallet Balance: <strong>₹{balance}</strong></span>
                  </div>
                </S.WalletBlock>
              </S.PricingActionRow>

              <S.ButtonGroup>
                <S.PrimaryButton
                  onClick={handleBooking}
                  disabled={bookingLoading || isBooked}
                  status={isBooked ? "booked" : (balance < activePrice ? "low" : "ok")}
                >
                  {bookingLoading
                    ? "Processing..."
                    : isBooked
                      ? "Access Unlocked"
                      : balance < activePrice
                        ? "Low Balance - Add Money"
                        : isProductService
                          ? "Buy Now & Unlock"
                          : "Book Now & Pay via Wallet"}
                </S.PrimaryButton>
              </S.ButtonGroup>

              <S.SecondaryActionRow>
                <button type="button" onClick={() => navigate(`/user/experts/${service.expert_slug || service.expert_id}`)}>
                  <FiMessageCircle /> Chat
                </button>
                <button type="button" onClick={() => navigate(`/user/experts/${service.expert_slug || service.expert_id}`)}>
                  <FiPhone /> Call
                </button>
              </S.SecondaryActionRow>

              <S.TrustBar>
                <span><FiCheck /> Secured Payments</span>
                <span><FiCheck /> Locked paid files</span>
                <span><FiCheck /> Quality Guaranteed</span>
              </S.TrustBar>
            </S.MainInfoCard>
          </S.ContentSide>
        </S.HorizontalLayout>

        <S.ProductSections>
          <S.DescriptionBox>
            <h3>About this Service</h3>
            <div className="formatted">{formatLines(service.full_description || service.description)}</div>
          </S.DescriptionBox>

          {Array.isArray(service.deliverables) && service.deliverables.length > 0 && (
            <S.IncludedBox>
              <h3>What user will get</h3>
              <ul>
                {service.deliverables.map((item, index) => (
                  <li key={`${item}-${index}`}><FiCheck /> {item}</li>
                ))}
              </ul>
            </S.IncludedBox>
          )}

          {Array.isArray(service.files) && service.files.length > 0 && (
            <S.FilesBox>
              <h3>Files included</h3>
              <div className="files-list">
                {service.files.map((file) => {
                  const locked = file.locked && !isBooked;
                  const isVideo = file.file_type === "mp4";
                  return (
                    <div className="file-card" key={file.id}>
                      <div className="file-icon">{isVideo ? <FiVideo /> : <FiFileText />}</div>
                      <div className="file-copy">
                        <strong>{file.file_title || file.file_name}</strong>
                        <span>{String(file.file_type || "file").toUpperCase()} · {file.is_preview ? "Preview" : file.is_paid_content ? "Paid content" : "Free"}</span>
                      </div>
                      <button type="button" onClick={() => handleFileDownload(file)}>
                        {locked ? <><FiLock /> Locked</> : <><FiDownload /> Download</>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </S.FilesBox>
          )}
        </S.ProductSections>
      </S.Container>
    </S.PageWrapper>
  );
};

export default ServiceDetail;
