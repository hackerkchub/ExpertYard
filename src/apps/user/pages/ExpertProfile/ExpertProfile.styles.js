import styled, { keyframes, css } from "styled-components";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const PageWrap = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 28px 18px 72px;
  scroll-behavior: smooth;
  overscroll-behavior-y: contain;
  background:
    radial-gradient(circle at 8% 0%, rgba(0, 0, 128, 0.1), transparent 28%),
    radial-gradient(circle at 92% 8%, rgba(255, 210, 63, 0.16), transparent 24%),
    linear-gradient(180deg, #f7f8fc 0%, #f8fafc 48%, #ffffff 100%);
  min-height: 100vh;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  animation: ${fadeIn} 0.5s ease-out;
  color: #111827;

  .expert-profile-content-grid {
    display: grid;
    grid-template-columns: minmax(270px, 320px) minmax(0, 1fr);
    gap: 18px;
    align-items: start;
  }

  .expert-profile-sidebar {
    position: sticky;
    top: 88px;
    align-self: start;
    display: grid;
    gap: 16px;
    min-width: 0;
  }

  .expert-profile-main {
    min-width: 0;
    scroll-behavior: smooth;
  }

  .consult-card,
  .about-me-card,
  .profile-tabs-card,
  .profile-reviews-card {
    margin-bottom: 0;
  }

  .consult-options {
    display: grid;
    gap: 10px;
  }

  .consult-option {
    width: 100%;
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    min-height: 56px;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    background: #ffffff;
    color: #111827;
    font: inherit;
    cursor: pointer;
    text-align: left;
    box-shadow: 0 10px 24px rgba(16, 24, 40, 0.06);
    transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  }

  .consult-option svg {
    width: 38px;
    height: 38px;
    padding: 10px;
    border-radius: 14px;
    color: #ffffff;
    background: linear-gradient(135deg, #000080, #05044f);
    box-sizing: border-box;
  }

  .consult-option span {
    font-size: 14px;
    font-weight: 900;
    color: #000080;
  }

  .consult-option strong {
    font-size: 12px;
    color: #475467;
    white-space: nowrap;
  }

  .consult-call {
    border-color: rgba(255, 193, 7, 0.55);
    background: linear-gradient(135deg, #fff9e6, #ffffff);
  }

  .consult-call svg {
    color: #000080;
    background: linear-gradient(135deg, #ffd23f, #ffc107);
  }

  .consult-option:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: rgba(0, 0, 128, 0.22);
    box-shadow: 0 16px 34px rgba(16, 24, 40, 0.11);
  }

  .consult-option:disabled {
    cursor: not-allowed;
    opacity: 0.72;
  }

  .mobile-profile-actions {
    display: none;
  }

  @media (max-width: 768px) {
    min-height: auto;
    width: 100%;
    max-width: 100%;
    padding: 10px 10px 8px;
    padding-bottom: calc(var(--mobile-bottom-nav-reserved-space, 80px) + 44px + env(safe-area-inset-bottom, 0px));
    margin-bottom: 0;
    overflow-x: hidden;
    overflow-y: visible;
    overscroll-behavior-y: auto;
    -webkit-overflow-scrolling: touch;
    animation: none;

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .expert-profile-content-grid {
      grid-template-columns: 1fr;
      gap: 12px;
      width: 100%;
      max-width: 100%;
      margin-bottom: 0;
      overflow: visible;
    }

    .expert-profile-sidebar {
      position: static;
      gap: 12px;
      width: 100%;
      max-width: 100%;
      margin-bottom: 0;
      overflow: visible;
    }

    .consult-card {
      display: none;
    }

    .expert-profile-main {
      width: 100%;
      max-width: 100%;
      margin-bottom: 0;
      padding-bottom: 0;
      overflow: visible;
    }

    .expert-profile-subscription-cta {
      margin-top: 8px !important;
      text-align: left !important;
      grid-column: 1 / -1;
    }

    .expert-profile-subscription-cta-btn {
      width: 100% !important;
      min-height: 40px !important;
      justify-content: center !important;
      padding: 9px 12px !important;
      border-radius: 999px !important;
      font-size: 12.5px !important;
      box-shadow: 0 10px 22px rgba(99, 102, 241, 0.24);
    }

    .expert-profile-main > *:last-child,
    .expert-profile-sidebar > *:last-child {
      margin-bottom: 0;
    }

    .mobile-profile-actions {
      position: fixed;
      left: 10px;
      right: 10px;
      bottom: calc(var(--nav-height, 72px) + 8px + env(safe-area-inset-bottom, 0px));
      z-index: 10005;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      backdrop-filter: none;
      transform: translateZ(0);
      will-change: transform;
      pointer-events: none;
    }

    .mobile-profile-actions button {
      min-width: 0;
      min-height: 48px;
      border: none;
      border-radius: 999px;
      font-size: 13.5px;
      line-height: 1.2;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      white-space: nowrap;
      touch-action: manipulation;
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
      pointer-events: auto;
    }

    .mobile-profile-actions button strong {
      font-size: 12px;
      font-weight: 900;
      opacity: 0.94;
    }

    .mobile-message-btn {
      background: linear-gradient(135deg, #000080, #2563eb);
      color: #ffffff;
    }

    .mobile-call-btn {
      background: linear-gradient(135deg, #ffd23f, #ffc107);
      color: #000080;
      box-shadow: 0 12px 24px rgba(255, 193, 7, 0.24);
    }

    .subscription-plans-modal {
      align-items: flex-end !important;
      justify-content: center !important;
      padding: 0 !important;
      overflow: hidden !important;
      z-index: 20050 !important;
      background: rgba(15, 23, 42, 0.62) !important;
      backdrop-filter: blur(4px);
    }

    .subscription-plans-modal__sheet {
      width: 100% !important;
      max-width: 100% !important;
      max-height: min(88dvh, 720px) !important;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch;
      border-radius: 24px 24px 0 0 !important;
      padding: 18px 12px calc(14px + env(safe-area-inset-bottom, 0px)) !important;
      box-shadow: 0 -18px 44px rgba(15, 23, 42, 0.24) !important;
      animation: expertProfileSheetUp 260ms ease-out both;
    }

    .subscription-plans-modal__header {
      position: sticky;
      top: 0;
      z-index: 2;
      margin: 0 0 10px !important;
      padding: 4px 0 8px;
      background: #ffffff;
      border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    }

    .subscription-plans-modal__header::before {
      content: "";
      position: absolute;
      left: 50%;
      top: -8px;
      width: 42px;
      height: 4px;
      border-radius: 999px;
      background: #cbd5e1;
      transform: translateX(-50%);
    }

    .subscription-plans-modal__header h2 {
      font-size: 18px !important;
      line-height: 1.25 !important;
      color: #000080 !important;
    }

    .expert-profile-recharge-modal {
      align-items: flex-end !important;
      justify-content: center !important;
      padding: 0 !important;
      z-index: 20060 !important;
      background: rgba(15, 23, 42, 0.62) !important;
      backdrop-filter: blur(4px);
    }

    .expert-profile-recharge-modal__sheet {
      position: relative;
      width: 100% !important;
      max-width: 100% !important;
      max-height: 82dvh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: 24px 24px 0 0 !important;
      padding: 24px 16px calc(16px + env(safe-area-inset-bottom, 0px)) !important;
      box-shadow: 0 -18px 44px rgba(15, 23, 42, 0.26);
      animation: expertProfileSheetUp 260ms ease-out both;
    }

    .expert-profile-recharge-modal__sheet::before {
      content: "";
      position: absolute;
      top: 9px;
      left: 50%;
      width: 44px;
      height: 4px;
      border-radius: 999px;
      background: #cbd5e1;
      transform: translateX(-50%);
    }

    .expert-profile-recharge-modal__sheet > div {
      display: grid !important;
      grid-template-columns: 1fr;
      gap: 10px !important;
    }

    .expert-profile-recharge-modal__sheet button {
      width: 100%;
      min-height: 46px;
    }
  }

  @media (max-width: 380px) {
    padding-left: 8px;
    padding-right: 8px;
    padding-bottom: calc(var(--mobile-bottom-nav-reserved-space, 80px) + 42px + env(safe-area-inset-bottom, 0px));

    .mobile-profile-actions {
      left: 8px;
      right: 8px;
      gap: 8px;
      padding: 0;
      border-radius: 16px;
    }

    .mobile-profile-actions button {
      min-height: 48px;
      font-size: 13px;
      gap: 5px;
    }

    .mobile-profile-actions button strong {
      font-size: 11px;
    }
  }

  @keyframes expertProfileSheetUp {
    from {
      opacity: 0.88;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;


// --- Main Profile Section ---
export const ProfileCard = styled.div`
  position: relative;
  overflow: hidden;
  color: #ffffff;
  background:
    radial-gradient(circle at 12% 0%, rgba(255, 255, 255, 0.18), transparent 28%),
    radial-gradient(circle at 88% 18%, rgba(255, 210, 63, 0.26), transparent 24%),
    linear-gradient(135deg, #000080 0%, #03045e 56%, #020329 100%);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 28px;
  margin-bottom: 18px;
  box-shadow: 0 24px 62px rgba(0, 0, 128, 0.22);

  > div {
    display: grid !important;
    grid-template-columns: 190px minmax(0, 1fr);
    gap: 26px;
    align-items: center;
  }

  > div > div:first-child {
    flex: initial !important;
    text-align: center;
  }

  > div > div:nth-child(2) {
    min-width: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    border-radius: 16px;
    padding: 9px;
    margin-bottom: 8px;
    box-shadow: 0 14px 34px rgba(0, 0, 128, 0.16);

    > div,
    .expert-profile-hero-inner {
      display: grid !important;
      grid-template-columns: 82px minmax(0, 1fr);
      align-items: start;
      gap: 9px;
      width: 100%;
      max-width: 100%;
    }

    .expert-profile-hero-media {
      flex: initial !important;
      width: 82px;
      min-width: 0;
      display: grid;
      justify-items: center;
      gap: 5px;
      text-align: center;
    }

    .expert-profile-follow-wrap {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .expert-profile-hero-info {
      flex: initial !important;
      min-width: 0;
      width: 100%;
      display: grid;
      gap: 5px;
    }

    .expert-profile-hero-top {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr);
      gap: 5px;
      width: 100%;
      min-width: 0;
    }

    .expert-profile-identity {
      min-width: 0;
      display: grid;
      justify-items: start;
      gap: 3px;
    }

    .expert-profile-pricing-summary {
      grid-column: 1 / -1;
      margin: 2px 0 0 !important;
    }
  }

  @media (max-width: 360px) {
    > div,
    .expert-profile-hero-inner {
      grid-template-columns: 74px minmax(0, 1fr);
      gap: 8px;
    }

    .expert-profile-hero-media {
      width: 74px;
    }
  }
`;

export const LeftImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 18px 42px rgba(0,0,0,0.28);
  
  @media (max-width: 768px) {
    width: 78px;
    height: 78px;
    display: block;
    margin: 0 auto;
    border-width: 2px;
    box-shadow: 0 10px 24px rgba(0,0,0,0.22);
  }

  @media (max-width: 360px) {
    width: 72px;
    height: 72px;
  }
`;

export const AvatarFallback = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: ${({ bg }) =>
    bg || "linear-gradient(135deg, #ffd23f, #ffc107)"};
  color: #fff;
  font-size: 42px;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;

  border: 4px solid #fff;
  color: #000080;
  box-shadow: 0 18px 42px rgba(0,0,0,0.28);

  @media (max-width: 768px) {
    width: 78px;
    height: 78px;
    font-size: 25px;
    margin: 0 auto;
    display: flex;
    border-width: 2px;
    box-shadow: 0 10px 24px rgba(0,0,0,0.22);
  }

  @media (max-width: 360px) {
    width: 72px;
    height: 72px;
    font-size: 23px;
  }
`;

// --- Name & Header Info ---
export const Name = styled.h1`
  font-size: clamp(25px, 3vw, 40px);
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.08;
  flex-wrap: wrap;
  
  @media (max-width: 768px) { 
    font-size: clamp(17px, 5.3vw, 21px);
    line-height: 1.16;
    justify-content: flex-start;
    text-align: left; 
    margin-top: 0; 
    margin-bottom: 0;
    gap: 6px;
  }
`;

export const VerifiedBadge = styled.span`
  background: rgba(255, 255, 255, 0.95);
  color: #000080;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 900;
  flex-shrink: 0;

  @media (max-width: 768px) {
    min-height: 20px;
    padding: 3px 7px;
    font-size: 10px;
    gap: 3px;
  }
`;

export const Role = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.86);
  margin: 0 0 6px;
  font-weight: 600;
  @media (max-width: 768px) {
    text-align: left;
    font-size: 12.5px;
    line-height: 1.25;
    margin: 0;
    color: rgba(255, 255, 255, 0.82);
  }
`;

export const Status = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 5px 12px;
  border-radius: 999px;
  background: ${props => props.$online ? "rgba(16, 185, 129, 0.16)" : "rgba(248, 113, 113, 0.14)"};
  border: 1px solid ${props => props.$online ? "rgba(16, 185, 129, 0.28)" : "rgba(248, 113, 113, 0.28)"};
  font-size: 13px;
  font-weight: 900;
  color: ${props => props.$online ? "#bbf7d0" : "#fecaca"};
  margin-bottom: 12px;
  @media (max-width: 768px) {
    display: flex;
    width: fit-content;
    margin: 0;
    text-align: left;
    font-size: 11px;
    min-height: 22px;
    padding: 3px 7px;
  }
`;

// --- Stats & Tags (No Overflow) ---
export const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(112px, 1fr));
  gap: 10px;
  margin: 4px 0 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 5px;
    margin: 0;
  }
`;

export const StatItem = styled.div`
  display: flex;
  min-height: 58px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.12);
  padding: 10px 12px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  text-align: center;
  backdrop-filter: blur(12px);

  span {
    font-weight: 900;
  }

  @media (max-width: 768px) {
    min-height: 32px;
    padding: 4px 4px;
    gap: 2px;
    font-size: 9.5px;
    line-height: 1.15;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    svg {
      width: 13px;
      height: 13px;
    }
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap; 
  gap: 8px;
  margin: 12px 0;
  @media (max-width: 768px) {
    grid-column: 1 / -1;
    justify-content: flex-start;
    gap: 4px;
    margin: 1px 0 0;

    &.expert-profile-header-tags {
      display: grid;
      grid-template-columns: 1fr;
      gap: 5px;
      width: 100%;
      margin-top: 2px;
    }
  }
`;

export const Tag = styled.span`
  background: #eef2ff;
  color: #000080;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  border: 1px solid rgba(0, 0, 128, 0.12);
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 4px 7px;
    font-size: 10.5px;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    gap: 4px;

    &.expert-profile-header-tag {
      width: 100%;
      min-height: 28px;
      justify-content: flex-start;
      padding: 6px 8px;
      border-radius: 10px;
      white-space: normal;
      overflow-wrap: anywhere;
      text-overflow: clip;
      background: rgba(255, 255, 255, 0.95);
      color: #000080;
    }
  }

  @media (max-width: 768px) {
    svg {
      width: 12px;
      height: 12px;
      flex: 0 0 auto;
    }
  }
`;

// --- Buttons & Price ---
export const CallToAction = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 15px;
  max-width: 560px;
  @media (max-width: 768px) { 
    display: none;
  }
`;

export const ActionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 42px;
  padding: 10px 14px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid ${props => props.$primary ? "#ffc107" : "rgba(255, 255, 255, 0.55)"};
  background: ${props => props.$primary ? "linear-gradient(135deg, #ffd23f, #ffc107)" : "rgba(255, 255, 255, 0.96)"};
  color: ${props => props.$primary ? "#000080" : "#000080"};
  white-space: nowrap;
  box-shadow: ${props => props.$primary ? "0 12px 24px rgba(255, 193, 7, 0.22)" : "0 10px 22px rgba(0, 0, 0, 0.12)"};
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.$primary ? "0 16px 30px rgba(255, 193, 7, 0.3)" : "0 14px 28px rgba(0, 0, 0, 0.16)"};
  }

  @media (max-width: 768px) {
    min-height: 44px;
    padding: 10px 12px;
    font-size: 14px;
    line-height: 1.2;
  }
`;

export const PriceTag = styled.div`
  width: fit-content;
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.16);
  font-weight: 900;
  margin-bottom: 7px;
  @media (max-width: 768px) { margin-left: auto; margin-right: auto; }
`;

export const FollowButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: ${props => props.$active ? "rgba(255, 255, 255, 0.2)" : "#ffffff"};
  color: ${props => props.$active ? "#ffffff" : "#000080"};
  border-radius: 999px;
  padding: 9px 18px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 16px;

  &:hover {
    transform: translateY(-1px);
    background-color: rgba(255, 255, 255, 0.88);
    color: #000080;
  }

  @media (max-width: 768px) {
    margin: 5px auto 0;
    width: 100%;
    min-height: 28px;
    padding: 5px 7px;
    font-size: 10.5px;
    line-height: 1.1;
    font-weight: 800;
    gap: 4px;
  }
`;

// --- Content Sections ---
export const Section = styled.div`
  background: #fff;
  border-radius: 22px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  margin-bottom: 16px;
  scroll-margin-top: 96px;
  box-shadow: 0 14px 34px rgba(16, 24, 40, 0.08);
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    border-radius: 16px;
    padding: 14px;
    margin-bottom: 10px;
    scroll-margin-top: 12px;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
  }
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  margin-bottom: 16px;
  color: #000080;

  @media (max-width: 768px) {
    margin-bottom: 10px;
    font-size: 17px;
    line-height: 1.25;
  }
`;

export const SectionBody = styled.div`
  font-size: 15px;
  line-height: 1.7;
  color: #344054;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.55;
  }
`;

// --- Reviews ---
export const ReviewSection = styled(Section)`
  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 0;
  }
`;
export const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;

  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

export const ReviewForm = styled.div`
  background:
    radial-gradient(circle at 100% 0%, rgba(255, 210, 63, 0.12), transparent 28%),
    #f8fafc;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 10px;
    border-radius: 14px;
    margin-bottom: 12px;
  }
`;

export const ReviewFormTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #000080;
  font-weight: 900;

  @media (max-width: 768px) {
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 1.3;
  }
`;

export const RatingInput = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }
`;

export const RatingLabel = styled.span`
  font-size: 14px;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 12px;
    font-weight: 700;
  }
`;

export const StarRating = styled.div`
  display: flex;
  gap: 4px;

  @media (max-width: 768px) {
    gap: 2px;
  }
`;

export const Star = styled.button`
  background: none; border: none; cursor: pointer; font-size: 22px;
  color: ${props => props.$filled ? "#f59e0b" : "#d1d5db"};
  transition: transform 0.1s;
  &:hover { transform: scale(1.1); }

  @media (max-width: 768px) {
    font-size: 19px;
    padding: 2px;
  }
`;

export const TextAreaContainer = styled.div`
  position: relative;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

export const ReviewTextarea = styled.textarea`
  width: 100%; padding: 13px 14px; border: 1px solid #d0d5dd; border-radius: 14px;
  font-family: inherit; font-size: 14px; resize: vertical;
  box-sizing: border-box;
  &:focus { border-color: #000080; outline: none; box-shadow: 0 0 0 4px rgba(0, 0, 128, 0.08); }

  @media (max-width: 768px) {
    min-height: 74px;
    max-height: 104px;
    padding: 10px 11px;
    border-radius: 12px;
    font-size: 13px;
    line-height: 1.4;
    resize: none;
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    align-items: stretch;
    flex-direction: row;
    justify-content: flex-end;
    gap: 8px;
  }
`;

export const SubmitButton = styled(ActionButton)`
  width: auto;
  background: #000080;
  color: #ffffff;
  border-color: #000080;
  box-shadow: 0 12px 24px rgba(0, 0, 128, 0.16);
  padding: 10px 20px; font-size: 14px;
  ${props => props.$disabled && css` background: #ccc; border-color: #ccc; cursor: not-allowed; `}

  @media (max-width: 768px) {
    width: auto;
    min-height: 38px;
    padding: 8px 14px;
    font-size: 13px;
  }
`;

export const DeleteButton = styled.button`
  background: transparent; border: none; color: #cc1016; font-size: 14px;
  font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px;
  &:hover { text-decoration: underline; }

  @media (max-width: 768px) {
    min-height: 38px;
    padding: 8px 12px;
    justify-content: center;
    border: 1px solid rgba(204, 16, 22, 0.18);
    border-radius: 999px;
    background: #fff5f5;
    font-size: 13px;
  }
`;

export const ReviewList = styled.div` display: flex; flex-direction: column; `;

export const ReviewItem = styled.div`
  padding: 16px;
  border: 1px solid #eef2f7;
  border-radius: 18px;
  background: #ffffff;
  margin-bottom: 12px;
  &:last-child { border-bottom: none; }

  @media (max-width: 768px) {
    padding: 12px;
    border-radius: 14px;
    margin-bottom: 10px;
  }
`;

export const ReviewUser = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

export const UserAvatar = styled.div`
  width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #000080, #05044f);
  color: white; display: flex; align-items: center; justify-content: center;
  font-weight: 900; flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
`;

export const UserInfo = styled.div`
  min-width: 0;
  flex: 1;
`;
export const UserName = styled.h4`
  font-size: 14px;
  font-weight: 900;
  margin: 0;
  color: #111827;

  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 1.3;
  }
`;
export const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
`;
export const ReviewDate = styled.span`
  font-size: 12px;
  color: #666;
`;
export const ReviewText = styled.p`
  font-size: 14px;
  color: #000000e6;
  margin-top: 8px;
  line-height: 1.4;
  overflow-wrap: anywhere;

  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 1.5;
  }
`;

export const ViewAllButton = styled.button`
  width: 100%; padding: 12px; background: transparent; border: none;
  color: #000080; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  &:hover { background: #eef3f8; }
`;

export const LoginPrompt = styled.div` text-align: center; width: 100%; p { margin-bottom: 12px; color: #666; font-size: 14px; } `;
export const LoginButton = styled(ActionButton)` margin: 0 auto; font-size: 14px; padding: 6px 20px; `;

// --- Missing Exports for Error Resolution ---
export const CharCount = styled.div` font-size: 12px; color: #666; text-align: right; margin-top: 4px; `;
export const ExpertiseGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px; `;
export const ExpertiseCard = styled.div` background: #f9f9f9; padding: 16px; border-radius: 8px; border: 1px solid #eee; `;
export const RecentReviewsTitle = styled.h3`
  font-size: 16px;
  font-weight: 900;
  margin: 24px 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #000080;

  @media (max-width: 768px) {
    margin: 14px 0 10px;
    font-size: 15px;
    line-height: 1.25;
  }
`;
export const LoadingReviews = styled.div` text-align: center; padding: 40px 0; color: #667085; `;
export const NoReviews = styled.div` text-align: center; padding: 40px 0; color: #667085; h4 { margin: 12px 0 4px; color: #111827; } `;

// Fallback for missing styled components in JSX
export const MiniRating = styled.div` display: flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 600; color: #000; `;
export const RatingValue = styled.span` font-size: 14px; color: #666; `;
export const LeftColumn = styled.div``;
export const TopSection = styled.div``;
export const RightInfo = styled.div``;
export const TwoColumn = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 20px; @media (max-width: 768px) { grid-template-columns: 1fr; } `;
export const ListItem = styled.div``;
export const ReviewBox = styled.div``;
export const RatingRow = styled.div``;
export const NotificationBadge = styled.span``;

// new added styles for experience and price sections


// Add these new styled components to your ExpertProfile.styles.js file

export const TabContainer = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    gap: 4px;
    margin-bottom: 14px;
  }
`;

export const TabButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  scroll-snap-align: start;
  padding: 13px 18px;
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 900;
  color: ${props => props.$active ? "#000080" : "#667085"};
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  
  &:hover {
    color: #000080;
  }
  
  ${props => props.$active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 3px;
      border-radius: 999px 999px 0 0;
      background: #000080;
    }
  `}
  
  @media (max-width: 768px) {
    flex: 0 0 auto;
    min-height: 40px;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 800;
  }
`;

export const TabContent = styled.div`
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    overflow: visible;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const InfoItem = styled.div`
  background:
    radial-gradient(circle at 100% 0%, rgba(0, 0, 128, 0.05), transparent 28%),
    #f8fafc;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 12px;
    border-radius: 14px;
  }
`;

export const InfoLabel = styled.div`
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  color: #000080;
  letter-spacing: 0.5px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    margin-bottom: 6px;
    font-size: 11px;
    line-height: 1.3;
  }
`;

export const InfoValue = styled.div`
  font-size: 14px;
  color: #344054;
  line-height: 1.65;
  overflow-wrap: anywhere;
  
  div {
    margin-bottom: 4px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 1.5;
  }
`;

export const ExperienceCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(16, 24, 40, 0.09);
  }
  
  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 14px;
    margin-bottom: 10px;
  }
`;

export const ExperienceHeader = styled.div`
  margin-bottom: 12px;
`;

export const ExperienceTitle = styled.h3`
  font-size: 16px;
  font-weight: 900;
  color: #000080;
  margin: 0 0 4px 0;

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 1.3;
  }
`;

export const ExperienceCompany = styled.div`
  font-size: 14px;
  color: #344054;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 1.4;
  }
`;

export const ExperienceDate = styled.div`
  font-size: 12px;
  color: #667085;
  margin-bottom: 12px;
`;

export const ExperienceCertificate = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #000080;
  text-decoration: none;
  padding: 6px 12px;
  background: #eef2ff;
  border-radius: 999px;
  
  &:hover {
    text-decoration: underline;
    background: #e2e9f0;
  }
`;


// Add this new styled component for the post grid
export const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

// Update PostCard for grid layout
export const PostCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.2s;
  box-shadow: 0 10px 24px rgba(16, 24, 40, 0.06);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 34px rgba(16, 24, 40, 0.12);
  }

  @media (max-width: 768px) {
    border-radius: 14px;
    box-shadow: 0 8px 18px rgba(16, 24, 40, 0.05);
  }
`;

export const PostHeader = styled.div`
  padding: 16px 16px 8px 16px;

  @media (max-width: 768px) {
    padding: 12px 12px 6px;
  }
`;

export const PostTitle = styled.h3`
  font-size: 16px;
  font-weight: 900;
  color: #000080;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 1.3;
  }
`;

export const PostDescription = styled.p`
  font-size: 14px;
  color: #344054;
  line-height: 1.5;
  margin: 0 16px 12px 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    margin: 0 12px 10px;
    font-size: 13px;
    line-height: 1.45;
  }
`;

export const PostImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  background: #f8fafc;

  @media (max-width: 768px) {
    height: 190px;
  }
`;

export const PostStats = styled.div`
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  margin: 0;
`;

export const PostStat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
`;

export const PostActions = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;

  @media (max-width: 768px) {
    padding: 10px 12px;
  }
`;

export const PostActionBtn = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  background: none;
  border: none;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  color: ${props => props.$liked ? "#ef4444" : "#000080"};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #eef2ff;
    color: ${props => props.$liked ? "#dc2626" : "#000080"};
  }
`;

// Add these new styled components

export const CommentsBox = styled.div`
  padding: 12px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
`;

export const CommentsList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 12px;
`;

export const CommentItem = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const CommentText = styled.div`
  font-size: 13px;
  color: #000000bf;
  margin-bottom: 4px;
`;

export const CommentMeta = styled.div`
  font-size: 11px;
  color: #000080;
`;

export const InlineInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d0d5dd;
  border-radius: 20px;
  font-size: 13px;
  outline: none;
  
  &:focus {
    border-color: #000080;
  }

  @media (max-width: 768px) {
    min-width: 0;
    font-size: 13px;
  }
`;

export const SendBtn = styled.button`
  background: #000080;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: #004182;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const RatingBox = styled.div`
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  background: #f9f9f9;
`;

export const StarsRow = styled.div`
  display: flex;
  gap: 8px;
  margin: 12px 0;
`;

export const StarBtn = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${props => props.active ? "#f59e0b" : "#d1d5db"};
  
  &:hover {
    transform: scale(1.1);
  }
`;

export const UserReviewBox = styled.div`
  padding: 8px 12px;
  background: #e0f2fe;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 12px;
`;

// Add these to your existing styled components file

export const SubscriptionCard = styled.div`
  background: linear-gradient(135deg, #000080 0%, #05044f 100%);
  border-radius: 18px;
  padding: 20px;
  margin-top: 20px;
  color: white;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    margin-top: 8px;
    padding: 10px 12px;
    border-radius: 14px;
    box-shadow: 0 10px 24px rgba(0, 0, 128, 0.14);
  }
`;

export const SubscriptionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
`;

export const PlansContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    display: flex;
    grid-template-columns: none;
    gap: 10px;
    margin-top: 10px;
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 2px 2px 8px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const PlanCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 24px;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  }

  @media (max-width: 768px) {
    flex: 0 0 clamp(218px, 76vw, 286px);
    min-width: 0;
    padding: 12px;
    border-radius: 14px;
    scroll-snap-align: start;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);

    &:hover {
      transform: none;
    }
  }
`;

export const PlanHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: 4px 8px;
    text-align: left;
    margin-bottom: 8px;
    padding-bottom: 8px;
  }
`;

export const PlanName = styled.h3`
  margin: 0 0 8px 0;
  color: #000080;
  font-size: 20px;

  @media (max-width: 768px) {
    margin: 0;
    min-width: 0;
    font-size: 14px;
    line-height: 1.25;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const PlanPrice = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #000080;
  margin: 8px 0;

  @media (max-width: 768px) {
    margin: 0;
    font-size: 19px;
    line-height: 1.1;
    white-space: nowrap;
  }
`;

export const PlanDuration = styled.div`
  color: #64748b;
  font-size: 14px;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    font-size: 11.5px;
    line-height: 1.25;
  }
`;

export const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;

  @media (max-width: 768px) {
    display: grid;
    gap: 3px;
    margin: 0 0 10px;
  }
`;

export const PlanFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: #334155;
  font-size: 14px;

  @media (max-width: 768px) {
    min-width: 0;
    gap: 6px;
    padding: 2px 0;
    font-size: 12px;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    svg {
      flex: 0 0 auto;
      width: 14px;
      height: 14px;
    }

    &:nth-child(n + 5) {
      display: none;
    }
  }
`;

export const SubscribeButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #000080 0%, #05044f 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    min-height: 38px;
    padding: 9px 10px;
    border-radius: 999px;
    font-size: 12.5px;
    line-height: 1.2;
  }
`;

export const ActiveSubscriptionCard = styled.div`
  background: #ecfdf5;
  border: 1px solid #10b981;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    margin-top: 4px;
    padding: 8px;
    border-radius: 10px;
  }
`;

export const SubscriptionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  
  div {
    display: flex;
    flex-direction: column;
    
    strong {
      color: #065f46;
      font-size: 14px;
    }
    
    small {
      color: #047857;
      font-size: 12px;
    }
  }

  @media (max-width: 768px) {
    gap: 6px;
    margin-bottom: 5px;

    > svg {
      width: 16px;
      height: 16px;
      flex: 0 0 auto;
    }

    div {
      min-width: 0;

      strong {
        font-size: 12px;
        line-height: 1.25;
      }

      small {
        font-size: 10.5px;
      }
    }
  }
`;

export const SubscriptionRemaining = styled.div`
  margin-top: 12px;

  @media (max-width: 768px) {
    margin-top: 5px;
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #d1fae5;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;

  @media (max-width: 768px) {
    height: 5px;
    margin-top: 4px;
  }
`;

export const UsageText = styled.div`
  color: #065f46;
  font-size: 13px;
  font-weight: 500;
  margin-top: 8px;

  @media (max-width: 768px) {
    font-size: 11px;
    margin-top: 2px;
  }
`;

// In ExpertProfile.styles.js, after defining PlanCard
export const SubscriptionPlanCard = PlanCard;

// Add these to your ExpertProfile.styles.js file

export const PricingOptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 24px 0;
`;

export const PricingOptionCard = styled.div`
  background: ${props => props.$featured ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ffffff'};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid ${props => props.$featured ? 'transparent' : '#e5e7eb'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
`;

export const PricingOptionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${props => props.$featured ? '#ffffff' : '#1f2937'};
`;

export const PricingOptionPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${props => props.$featured ? '#ffffff' : '#0f172a'};
`;

export const PricingOptionDetails = styled.div`
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: ${props => props.$featured ? 'rgba(255, 255, 255, 0.9)' : '#6b7280'};
`;

export const PricingOptionButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  
  ${props => props.$primary && `
    background: #3b82f6;
    color: white;
    &:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }
  `}
  
  ${props => props.$featured && `
    background: white;
    color: #667eea;
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PricingModeTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.08);
    justify-content: flex-start;
    gap: 5px;
    margin-bottom: 5px;
    overflow: visible;

    > button:nth-child(3):last-child {
      grid-column: 1 / -1;
    }
  }
`;

export const PricingModeTab = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid ${props => props.$active ? '#ffc107' : 'rgba(255, 255, 255, 0.28)'};
  background: ${props => props.$active ? 'linear-gradient(135deg, #ffd23f, #ffc107)' : 'rgba(255, 255, 255, 0.12)'};
  color: ${props => props.$active ? '#000080' : '#ffffff'};
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ffc107;
  }

  @media (max-width: 768px) {
    min-width: 0;
    width: 100%;
    min-height: 38px;
    justify-content: center;
    padding: 7px 8px;
    border-radius: 12px;
    border-color: ${props => props.$active ? '#ffc107' : 'transparent'};
    font-size: 11.5px;
    font-weight: 800;
    gap: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    svg {
      width: 12px;
      height: 12px;
      flex: 0 0 auto;
    }
  }
`;

export const PricingInfo = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.84);
  padding: 8px 0;
  font-weight: 700;

  @media (max-width: 768px) {
    text-align: left;
    font-size: 11.5px;
    line-height: 1.3;
    padding: 1px 0;
  }
`;
