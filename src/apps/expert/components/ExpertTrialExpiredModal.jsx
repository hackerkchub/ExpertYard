// shared/components/ExpertTrialExpiredModal.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useExpert } from "../../../shared/context/ExpertContext";


// ============================================================
// ANIMATIONS
// ============================================================

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const pulseButton = keyframes`
  0%, 100% {
    box-shadow: 0 4px 16px rgba(74, 144, 217, 0.3);
  }
  50% {
    box-shadow: 0 4px 32px rgba(74, 144, 217, 0.6);
  }
`;

// ============================================================
// STYLED COMPONENTS
// ============================================================

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: ${fadeIn} 300ms ease-out;
  padding: 20px;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
`;

const ModalContainer = styled.div`
  background: #ffffff;
  border-radius: 24px;
  max-width: 540px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 48px 40px 40px;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 300ms ease-out;
  position: relative;

  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    padding: 32px 24px 28px;
    border-radius: 20px;
    max-width: 100%;
    margin: 16px;
  }

  @media (max-width: 480px) {
    padding: 24px 20px 20px;
    border-radius: 16px;
    margin: 12px;
  }
`;

const IconWrapper = styled.div`
  text-align: center;
  font-size: 72px;
  margin-bottom: 16px;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 56px;
    margin-bottom: 12px;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #1a1a2e;
  text-align: center;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  text-align: center;
  margin: 0 0 24px 0;
  line-height: 1.6;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 20px;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    #e5e7eb 20%,
    #e5e7eb 80%,
    transparent
  );
  margin: 20px 0;

  @media (max-width: 480px) {
    margin: 16px 0;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
  margin: 0 0 24px 0;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 6px 0;
    margin-bottom: 20px;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-size: 15px;
  color: #1f2937;

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 4px 0;
  }
`;

const CheckIcon = styled.span`
  color: #10b981;
  font-size: 18px;
  flex-shrink: 0;
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const PlanHighlight = styled.div`
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 12px;
  padding: 16px 20px;
  text-align: center;
  margin: 0 0 20px 0;

  @media (max-width: 480px) {
    padding: 14px 16px;
    margin-bottom: 16px;
  }
`;

const PlanPrice = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: -0.5px;

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const PlanPriceLabel = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: #6b7280;
  margin-left: 4px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const PlanDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0 0;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const UpgradeButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #4a90d9 0%, #6c5ce7 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(74, 144, 217, 0.3);
  letter-spacing: -0.2px;
  position: relative;
  overflow: hidden;
  animation: ${pulseButton} 2s ease-in-out infinite;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(74, 144, 217, 0.5);
    scale: 1.01;
    animation: none;
  }

  &:active {
    transform: translateY(0px);
    scale: 0.98;
  }

  &:focus-visible {
    outline: 2px solid #4a90d9;
    outline-offset: 2px;
  }

  &::after {
    content: "→";
    margin-left: 8px;
    transition: transform 0.3s ease;
    display: inline-block;
  }

  &:hover::after {
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    padding: 14px;
    font-size: 17px;
  }

  @media (max-width: 480px) {
    padding: 14px;
    font-size: 16px;
    border-radius: 10px;
  }
`;

const ButtonSubtext = styled.p`
  font-size: 13px;
  color: #6b7280;
  text-align: center;
  margin: 12px 0 0 0;
  line-height: 1.4;

  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 10px;
  }
`;

const SupportLink = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #6b7280;

  @media (max-width: 480px) {
    font-size: 13px;
    margin-top: 16px;
  }
`;

const SupportButton = styled.button`
  background: none;
  border: none;
  color: #4a90d9;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  border-radius: 4px;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #6c5ce7;
    background: rgba(74, 144, 217, 0.08);
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

// ============================================================
// MAIN COMPONENT
// ============================================================

export const ExpertTrialExpiredModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { expertData } = useExpert();

  const [isOpen, setIsOpen] = useState(false);

  console.log("Trial Data:", expertData?.trial);

  // ✅ Features list - reordered for immediate impact
  const features = [
    "Continue Receiving Chat Requests",
    "Continue Receiving Voice Calls",
    "Continue Receiving Video Calls",
    "Create Unlimited Services",
    "Withdraw Earnings Anytime",
    "Verified Expert Badge",
    "Higher Search Ranking",
    "Premium Support",
  ];

  // ✅ 3. Dynamic price from backend (fallback to 2999)
  const planPrice = useCallback(() => {
    // Try to get price from various possible sources
    const priceFromContext = expertData?.plans?.startingPrice;
    const priceFromProfile = expertData?.profile?.plan?.price;
    const fallbackPrice = 2999;

    return priceFromContext || priceFromProfile || fallbackPrice;
  }, [expertData]);

  // ✅ Check if we're on the g9-plan page
  const hideModalOnPlan = location.pathname.startsWith("/expert/g9-plan");

  // Check if modal should be shown
  useEffect(() => {
    const shouldShow =
      !hideModalOnPlan &&
      Boolean(expertData?.trial?.enabled) &&
      Boolean(expertData?.trial?.expired) &&
      Boolean(expertData?.trial?.dashboardLocked);

    console.log("========== Trial Modal ==========");
    console.log("Trial:", expertData?.trial);
    console.log("hideModalOnPlan:", hideModalOnPlan);
    console.log("shouldShow:", shouldShow);

    setIsOpen(shouldShow);

    if (shouldShow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    expertData?.trial?.enabled,
    expertData?.trial?.expired,
    expertData?.trial?.dashboardLocked,
    hideModalOnPlan,
  ]);

  // ✅ 1. Fixed: Prevent ESC key
  useEffect(() => {
    if (!isOpen) return;

    const preventEsc = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("keydown", preventEsc);

    return () => {
      document.removeEventListener("keydown", preventEsc);
    };
  }, [isOpen]);

  // ✅ 1. Fixed: Prevent browser back button with proper cleanup
  useEffect(() => {
    if (!isOpen) return;

    // Push current state to prevent back navigation
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      // Push forward again when back is pressed
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [isOpen]);

  // ✅ Handle upgrade navigation - Simplified
  const handleUpgrade = useCallback(() => {
    navigate("/expert/g9-plan");
  }, [navigate]);

  // Handle support
  const handleSupport = useCallback(() => {
    // You can customize this to open support chat or email
    window.location.href = "mailto:support@g9expert.com";
  }, []);

  // Prevent outside click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  console.log("Modal Render:", {
    isOpen,
    trial: expertData?.trial,
    hideModalOnPlan,
  });

  // Return null at the end after all hooks
  if (!isOpen) return null;

  const price = planPrice();

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer
        role="dialog"
        aria-modal="true"
        aria-labelledby="trial-expired-title"
      >
        {/* ✅ 4. Changed icon from 🎉 to ⏳ */}
        <IconWrapper>⏳</IconWrapper>

        {/* ✅ 5. Changed title */}
        <Title id="trial-expired-title">Free Trial Expired</Title>

        <Subtitle>
          Upgrade your G9 Expert Plan to continue receiving chats, calls and leads.
        </Subtitle>

        <Divider />

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureItem key={index}>
              <CheckIcon>✓</CheckIcon>
              {feature}
            </FeatureItem>
          ))}
        </FeaturesGrid>

        <PlanHighlight>
          <PlanPrice>
            {/* ✅ 3. Dynamic price from backend */}
            Only ₹{price.toLocaleString()}
            <PlanPriceLabel>/year</PlanPriceLabel>
          </PlanPrice>
          <PlanDescription>
            for more details click upgrade now button.
          </PlanDescription>
        </PlanHighlight>

        <UpgradeButton onClick={handleUpgrade}>Upgrade Now</UpgradeButton>

        {/* ✅ 7. Added reassurance text */}
        <ButtonSubtext>
          ✓ Your account will be unlocked immediately after successful payment
        </ButtonSubtext>

        <SupportLink>
          Need Help?{" "}
          <SupportButton onClick={handleSupport}>Contact Support</SupportButton>
        </SupportLink>
      </ModalContainer>
    </Overlay>
  );
};

export default ExpertTrialExpiredModal;