// shared/components/ExpertTrialBanner.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useExpert } from "../../../shared/context/ExpertContext";

// ============================================================
// STYLED COMPONENTS
// ============================================================

const BannerWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  padding: 6px 20px;
  background: ${({ $isUrgent }) =>
    $isUrgent
      ? "linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%)"
      : "linear-gradient(135deg, #4a90d9 0%, #6c5ce7 100%)"};
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  flex-shrink: 0;
  height: 48px;
  display: flex;
  align-items: center;
  margin: 0;
  border-radius: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  /* Animated gradient background */
  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at 30% 50%,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 60%
    );
    animation: shimmer 6s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%,
    100% {
      transform: translateX(-10%) translateY(-10%) scale(1);
    }
    50% {
      transform: translateX(10%) translateY(10%) scale(1.1);
    }
  }

  /* Glow effect on urgent mode */
  ${({ $isUrgent }) =>
    $isUrgent &&
    `
    animation: pulseGlow 2s ease-in-out infinite;
    box-shadow: 0 2px 12px rgba(220, 53, 69, 0.25);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  `}

  @keyframes pulseGlow {
    0%,
    100% {
      box-shadow: 0 2px 12px rgba(220, 53, 69, 0.25);
    }
    50% {
      box-shadow: 0 2px 24px rgba(220, 53, 69, 0.4);
    }
  }

  /* Desktop */
  @media (min-width: 1024px) {
    height: 50px;
    padding: 6px 24px;
  }

  /* Tablet */
  @media (max-width: 1023px) and (min-width: 769px) {
    height: 46px;
    padding: 5px 20px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    position: relative;
    height: auto;
    min-height: 44px;
    padding: 6px 16px;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    min-height: 40px;
    padding: 4px 12px;
  }
`;

const BannerContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  flex-wrap: nowrap;

  /* Mobile */
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 4px;
  }
`;

const BannerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;

  /* Tablet */
  @media (max-width: 1023px) and (min-width: 769px) {
    gap: 8px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    gap: 6px;
    width: 100%;
    flex: 0 0 100%;
  }
`;

const IconWrapper = styled.div`
  width: 28px;
  height: 28px;
  min-width: 28px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  flex-shrink: 0;

  /* Tablet */
  @media (max-width: 1023px) and (min-width: 769px) {
    width: 24px;
    height: 24px;
    min-width: 24px;
    font-size: 12px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    width: 22px;
    height: 22px;
    min-width: 22px;
    font-size: 11px;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    width: 18px;
    height: 18px;
    min-width: 18px;
    font-size: 9px;
  }
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
  flex-wrap: wrap;

  /* Mobile */
  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const Title = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.2px;
  white-space: nowrap;

  /* Tablet */
  @media (max-width: 1023px) and (min-width: 769px) {
    font-size: 12px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 11px;
    white-space: normal;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const UrgentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 6px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  font-size: 8px;
  font-weight: 600;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  white-space: nowrap;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 7px;
    padding: 1px 4px;
  }
`;

const Countdown = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  letter-spacing: -0.3px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  /* Tablet */
  @media (max-width: 1023px) and (min-width: 769px) {
    font-size: 14px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 12px;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const EndDate = styled.span`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  letter-spacing: 0.2px;
  white-space: nowrap;

  /* Tablet */
  @media (max-width: 1023px) and (min-width: 769px) {
    font-size: 9px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 8px;
    display: none;
  }
`;

const BannerRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  /* Mobile */
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const UpgradeButton = styled.button`
  padding: 4px 14px;
  background: #ffffff;
  color: ${({ $isUrgent }) =>
    $isUrgent ? "#dc3545" : "#4a90d9"};
  border: none;
  border-radius: 50px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  letter-spacing: -0.2px;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    scale: 1.02;
  }

  &:active {
    transform: translateY(0px);
    scale: 0.98;
  }

  &:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }

  /* Tablet */
  @media (max-width: 1023px) and (min-width: 769px) {
    padding: 3px 12px;
    font-size: 10px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 3px 10px;
    font-size: 10px;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 2px 8px;
    font-size: 9px;
  }
`;

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

const formatTime = (milliseconds) => {
  if (milliseconds <= 0) return "00h 00m 00s";

  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(
    2,
    "0"
  )}m ${String(seconds).padStart(2, "0")}s`;
};

const getUrgencyLevel = (remainingMs) => {
  const HOURS_24 = 24 * 60 * 60 * 1000;
  const HOURS_6 = 6 * 60 * 60 * 1000;

  if (remainingMs <= 0) return "expired";
  if (remainingMs < HOURS_6) return "critical";
  if (remainingMs < HOURS_24) return "urgent";
  return "normal";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTimeAMPM = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export const ExpertTrialBanner = () => {
  const navigate = useNavigate();
  const { expertData } = useExpert();

  const [remaining, setRemaining] = useState(0);

  // Check if trial is active and dashboard not locked
  const shouldShowBanner = useMemo(() => {
    return (
      expertData?.trial?.enabled === true &&
      expertData?.trial?.dashboardLocked === false
    );
  }, [expertData?.trial?.enabled, expertData?.trial?.dashboardLocked]);

  // Calculate remaining time
  useEffect(() => {
    if (!shouldShowBanner || !expertData?.trial?.endAt) {
      setRemaining(0);
      return;
    }

    const updateRemaining = () => {
      const diff = new Date(expertData.trial.endAt).getTime() - Date.now();
      setRemaining(Math.max(0, diff));
    };

    updateRemaining();

    const interval = setInterval(updateRemaining, 1000);

    return () => clearInterval(interval);
  }, [expertData?.trial?.endAt, shouldShowBanner]);

  // Determine urgency
  const urgencyLevel = getUrgencyLevel(remaining);
  const isUrgent = urgencyLevel === "urgent" || urgencyLevel === "critical";
  const isExpired = urgencyLevel === "expired";

  // Format countdown display
  const formattedTime = useMemo(() => {
    if (isExpired) return "00h 00m 00s";
    return formatTime(remaining);
  }, [remaining, isExpired]);

  // Format end date
  const endDateFormatted = useMemo(() => {
    if (!expertData?.trial?.endAt) return "";
    return `${formatDate(expertData.trial.endAt)} at ${formatTimeAMPM(
      expertData.trial.endAt
    )}`;
  }, [expertData?.trial?.endAt]);

  // Handle upgrade navigation
  const handleUpgrade = () => {
    navigate("/expert/g9-plan", { replace: true });
  };

  // Don't render if conditions not met or expired
  if (!shouldShowBanner || isExpired) return null;

  return (
    <BannerWrapper $isUrgent={isUrgent}>
      <BannerContent>
        <BannerLeft>
          <IconWrapper>
            {isUrgent ? (
              <span role="img" aria-label="Warning">
                ⚠️
              </span>
            ) : (
              <span role="img" aria-label="Trial">
                ⏳
              </span>
            )}
          </IconWrapper>

          <TextContainer>
            <Title>
              {isUrgent ? "Your Free Trial Ends Soon!" : "Free Trial"}
            </Title>
            {isUrgent && (
              <UrgentBadge>
                🔥 {urgencyLevel === "critical" ? "CRITICAL" : "URGENT"}
              </UrgentBadge>
            )}
            <Countdown>{formattedTime}</Countdown>
            <EndDate>| {endDateFormatted}</EndDate>
          </TextContainer>
        </BannerLeft>

        <BannerRight>
          <UpgradeButton $isUrgent={isUrgent} onClick={handleUpgrade}>
            {isUrgent ? "Upgrade Now ⚡" : "Upgrade Now →"}
          </UpgradeButton>
        </BannerRight>
      </BannerContent>
    </BannerWrapper>
  );
};

export default ExpertTrialBanner;