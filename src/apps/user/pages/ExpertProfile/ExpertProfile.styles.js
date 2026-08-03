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
  @import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');

  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px clamp(20px, 2vw, 40px);
  scroll-behavior: smooth;
  overscroll-behavior-y: contain;
  background: #f8fafc;
  min-height: 100vh;
  font-family: "Rubik", "Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #111827;
  animation: ${fadeIn} 0.4s ease-out;

  *,
  *::before,
  *::after,
  button,
  input,
  select,
  textarea,
  h1, h2, h3, h4, h5, h6, p, span, div, a, label {
    font-family: "Rubik", "Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  }

  @media (min-width: 1024px) {
    .expert-profile-content-grid {
      display: grid;
      grid-template-columns: 28% minmax(0, 1fr);
      gap: 24px;
      align-items: start;
    }
  }

  .expert-profile-content-grid {
    display: grid;
    grid-template-columns: 28% minmax(0, 1fr);
    gap: 24px;
    align-items: start;
    width: 100%;
    height: auto;
  }

  .expert-profile-sidebar {
    position: relative;
    align-self: start;
    display: flex;
    flex-direction: column;
    gap: clamp(16px, 1.8vw, 24px);
    min-width: 0;
    width: 100%;
    height: auto;

    @media (min-width: 1024px) {
      position: sticky;
      top: 90px;
    }
  }

  @media (max-width: 768px) {
     .expert-profile-sidebar {
        display: none !important;
    }
}

  .expert-profile-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: clamp(16px, 1.8vw, 24px);
    width: 100%;
    height: auto;
    align-self: start;
    scroll-behavior: smooth;
  }

  .consult-card,
  .about-me-card,
  .profile-tabs-card,
  .profile-reviews-card {
    margin-bottom: 0;
    height: auto;
  }

  .consult-options {
    display: grid;
    gap: 10px;
  }

  .consult-options .expert-profile-consult-video-btn {
    width: 100% !important;
    min-height: 56px !important;
    justify-content: center !important;
    border-radius: 18px !important;
    padding: 10px 12px !important;
    background: linear-gradient(135deg, #2563eb, #000080) !important;
    color: #ffffff !important;
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18) !important;
    white-space: normal !important;
    text-align: center !important;
  }

  .consult-option {
    width: 100%;
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr);
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
    font-size: 14px;
    color: #475467;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
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
      gap: 24px;
      width: 100%;
      max-width: 100%;
      margin-bottom: 0;
      overflow: visible;
    }

    .expert-profile-sidebar {
      position: static;
      display: flex;
      flex-direction: column;
      gap: 24px;
      width: 100%;
      max-width: 100%;
      margin-bottom: 0;
      overflow: visible;
    }

    .consult-card {
      display: none;
    }

    .expert-profile-main {
      display: flex;
      flex-direction: column;
      gap: 24px;
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
      background: #16a34a !important;
      color: #ffffff !important;
      box-shadow: 0 10px 22px rgba(22, 163, 74, 0.24);
    }

    .expert-profile-subscription-cta-btn svg,
    .expert-profile-subscription-cta-btn * {
      color: #ffffff !important;
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
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
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

    .mobile-profile-actions button,
    .mobile-profile-actions .video-call-button {
      min-width: 0;
      width: 100% !important;
      min-height: 50px !important;
      border: none;
      border-radius: 999px;
      padding: 8px 8px !important;
      font-size: 12.5px !important;
      line-height: 1.2;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      cursor: pointer;
      white-space: nowrap !important;
      touch-action: manipulation;
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
      pointer-events: auto;
      text-align: center;
      overflow: hidden;
    }

    .mobile-profile-actions button svg,
    .mobile-profile-actions .video-call-button svg {
      width: 16px;
      height: 16px;
      flex: 0 0 auto;
    }

    .mobile-profile-actions button strong {
      display: inline-block;
      width: auto;
      min-width: 0;
      font-size: 11px;
      font-weight: 900;
      opacity: 0.94;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mobile-profile-actions button span {
      min-width: 0;
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

    .mobile-video-call-btn {
      background: linear-gradient(135deg, #2563eb, #000080) !important;
      color: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.22) !important;
      box-shadow: 0 12px 24px rgba(37, 99, 235, 0.26) !important;
    }

    .mobile-video-call-btn:disabled {
      background: #94a3b8 !important;
      color: #ffffff !important;
      border-color: #cbd5e1 !important;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12) !important;
      opacity: 1 !important;
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
      gap: 6px;
      padding: 0;
      border-radius: 16px;
    }

    .mobile-profile-actions button,
    .mobile-profile-actions .video-call-button {
      min-height: 48px !important;
      font-size: 11.5px !important;
      gap: 4px;
      padding: 7px 5px !important;
    }

    .mobile-profile-actions button strong {
      font-size: 9.5px;
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
  overflow: visible;
  color: #ffffff;
  background:
    radial-gradient(circle at 12% 0%, rgba(255, 255, 255, 0.18), transparent 28%),
    radial-gradient(circle at 88% 18%, rgba(255, 210, 63, 0.26), transparent 24%),
    linear-gradient(135deg, #000080 0%, #03045e 56%, #020329 100%);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: clamp(20px, 2.2vw, 36px);
  margin-bottom: 24px;
  width: 100%;
  max-width: 1700px;
  margin-left: auto;
  margin-right: auto;
  height: auto;
  min-height: 280px;
  box-shadow: 0 16px 44px rgba(0, 0, 128, 0.18);
  box-sizing: border-box;

  @media (min-width: 1024px) {
    height: auto;
    min-height: 280px;
    
    .expert-profile-hero-inner {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) 400px !important;
      gap: clamp(20px, 2.2vw, 36px) !important;
      align-items: start !important;
      width: 100% !important;
    }
  }

  @media (min-width: 769px) {
    .expert-profile-desktop-tag,
    .expert-profile-desktop-tag *,
    .expert-profile-desktop-tag svg,
    .expert-profile-header-tag,
    .expert-profile-header-tag *,
    .expert-profile-header-tag svg {
      color: #ffffff !important;
    }

    .expert-profile-desktop-mode-tab.inactive-tab,
    .expert-profile-desktop-mode-tab.inactive-tab *,
    .expert-profile-desktop-mode-tab.inactive-tab svg {
      color: #ffffff !important;
    }

    .expert-profile-desktop-mode-tab.active-tab,
    .expert-profile-desktop-mode-tab.active-tab *,
    .expert-profile-desktop-mode-tab.active-tab svg {
      color: #000080 !important;
    }
  }

  .expert-profile-mobile-follow-wrap {
    display: none;
  }

  .expert-profile-title-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }

  @media (max-width: 768px) {
    .expert-profile-title-row {
      display: flex !important;
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 3px !important;
      margin-bottom:5px;
      width: 100% !important;
      margin-bottom: 2px !important;
    }

    .expert-profile-verified-badge {
      margin-top: 2px !important;
      display: inline-flex !important;
      width: fit-content !important;
    }

    .expert-profile-user-row {
      gap: 14px !important;
      align-items: flex-start !important;
    }

    .expert-profile-avatar-box {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 8px !important;
      flex-shrink: 0 !important;
      width: 86px !important;
    }

    .expert-profile-avatar-box img {
      width: 86px !important;
      height: 86px !important;
    }

    .expert-profile-avatar-box .expert-profile-follow-wrap {
      display: flex !important;
      width: 100% !important;
    }

    .expert-profile-avatar-box .expert-profile-follow-wrap button {
      width: 100% !important;
      min-width: 0 !important;
      margin-top: 0 !important;
      padding: 5px 6px !important;
      font-size: 11px !important;
      border-radius: 999px !important;
    }

    .expert-profile-name-group {
      display: flex !important;
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0 !important;
      min-width: 0;
      flex: 1 !important;
    }

    .expert-profile-name-group h1 {
      display: inline-flex !important;
      align-items: center !important;
      flex-wrap: nowrap !important;
      font-size: 19px !important;
      line-height: 1.2 !important;
      margin: 0 0 2px 0 !important;
    }

    .expert-profile-name-group p {
      margin-top: 10px !important;
      margin-bottom: 6px !important;
      font-size: 12.5px !important;
      line-height: 1.35 !important;
      text-align: left !important;
    }

    .expert-profile-name-group div {
      margin-top: 2px !important;
      margin-bottom: 0 !important;
      display: inline-flex !important;
      width: fit-content !important;
    }

    .expert-profile-sidebar,
    .expert-profile-page .expert-profile-sidebar,
    aside.expert-profile-sidebar {
      display: none !important;
    }
  }

  .expert-profile-header-tag.expert-profile-desktop-tag{
  color:white !Important;
  }
  
  .expert-profile-hero-left {
    min-width: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .expert-profile-user-row {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
  }

  .expert-profile-avatar-box {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .expert-profile-name-group {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .expert-profile-hero-right {
    min-width: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 14px;
  }
`;

export const LeftImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 12px 28px rgba(0, 0, 128, 0.28);
  display: block;
  margin: 0 auto;
  width: 110px !important;
  height: 110px !important;
  aspect-ratio: 1 / 1;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 78px !important;
    height: 78px !important;
    border-width: 2px;
    box-shadow: 0 10px 24px rgba(0,0,0,0.22);
  }
`;

export const AvatarFallback = styled.div`
  border-radius: 50%;
  background: ${({ bg }) =>
    bg || "linear-gradient(135deg, #ffd23f, #ffc107)"};
  color: #000080;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  border: 3px solid #fff;
  box-shadow: 0 12px 28px rgba(0, 0, 128, 0.28);
  margin: 0 auto;
  width: 110px !important;
  height: 110px !important;
  font-size: clamp(28px, 2.5vw, 36px);
  aspect-ratio: 1 / 1;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 78px !important;
    height: 78px !important;
    font-size: 25px;
    border-width: 2px;
    box-shadow: 0 10px 24px rgba(0,0,0,0.22);
  }
`;

// --- Name & Header Info ---
export const Name = styled.h1`
  font-family: "Rubik", "Poppins", sans-serif;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #ffffff;
  margin: 0 0 6px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  line-height: 1.2;
  flex-wrap: nowrap;
  
  @media (max-width: 768px) { 
    font-size: 19px;
    line-height: 1.2;
    display: inline-flex !important;
    align-items: center !important;
    flex-wrap: nowrap !important;
    justify-content: flex-start;
    text-align: left; 
    margin-top: 0; 
    margin-bottom: 2px;
    gap: 6px;
  }
`;

export const VerifiedCheckIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  min-width: 22px;
  min-height: 22px;
  border-radius: 50%;
  background: #047857 !important;
  color: #ffffff !important;
  margin-left: 6px;
  flex-shrink: 0;
  vertical-align: middle;
  box-shadow: 0 2px 6px rgba(4, 120, 87, 0.35);

  svg,
  * {
    color: #ffffff !important;
    stroke: #ffffff !important;
    stroke-width: 3.2px !important;
    width: 12px !important;
    height: 12px !important;
  }

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
    min-width: 18px;
    min-height: 18px;
    margin-left: 5px;

    svg,
    * {
      width: 10px !important;
      height: 10px !important;
      stroke-width: 3.2px !important;
    }
  }
`;

export const Role = styled.p`
  font-family: "Inter", "Outfit", sans-serif;
  font-size: 14px;
  color: #e2e8f0;
  margin: 0 0 8px;
  font-weight: 500;
  line-height: 1.4;

  @media (max-width: 768px) {
    text-align: left;
    font-size: 13px;
    line-height: 1.3;
    margin: 0;
    color: #e2e8f0;
  }
`;

export const Status = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 4px 12px;
  border-radius: 999px;
  background: ${props => props.$online ? "rgba(16, 185, 129, 0.16)" : "rgba(248, 113, 113, 0.14)"};
  border: 1px solid ${props => props.$online ? "rgba(16, 185, 129, 0.28)" : "rgba(248, 113, 113, 0.28)"};
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.$online ? "#bbf7d0" : "#fecaca"};
  margin-bottom: 12px;
  @media (max-width: 768px) {
    display: flex;
    width: fit-content;
    margin-top: 4px;
    margin-bottom: 4px;
    text-align: left;
    font-size: 11px;
    min-height: 22px;
    padding: 3px 8px;
  }
`;

// --- Stats & Tags (No Overflow) ---
export const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
  width: 100%;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
    margin-bottom: 12px;
  }
`;

export const StatItem = styled.div`
  display: flex;
  height: clamp(64px, 4.8vw, 76px);
  min-height: 64px;
  max-height: 76px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: clamp(11px, 0.8vw, 13px);
  color: rgba(255, 255, 255, 0.95);
  background: rgba(255, 255, 255, 0.14);
  padding: 6px 8px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  text-align: center;
  backdrop-filter: blur(12px);
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.35);
  }

  span {
    font-weight: 700;
    font-size: clamp(13px, 1vw, 18px);
  }

  svg {
    font-size: clamp(16px, 1.2vw, 20px);
    color: #ffc107;
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 48px;
    padding: 8px 4px;
    gap: 3px;
    font-size: 10px;
    line-height: 1.15;
    border-radius: 10px;

    span {
      font-size: 13px;
      font-weight: 700;
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap; 
  gap: 8px;
  margin: 12px 0;
  @media (max-width: 768px) {
    margin: 8px 0 10px;
    gap: 6px;
    width: 100%;
  }
`;

export const Tag = styled.span`
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff !important;
  padding: 5px 12px;
  border-radius: 999px;
  font-family: "Inter", "Outfit", sans-serif;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  font-weight: 600;

  &&,
  && svg,
  && * {
    color: #ffffff !important;
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 8px;
    gap: 4px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

// --- Pricing Mode Tabs ---
export const PricingModeTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.12);
  padding: 4px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: fit-content;

  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 6px;
  }
`;

export const PricingModeTab = styled.button`
  background: ${props => props.$active ? "#ffc107" : "transparent"};
  color: ${props => props.$active ? "#000080 !important" : "#ffffff !important"};
  border: none;
  padding: 6px 14px;
  border-radius: 10px;
  font-family: "Inter", "Outfit", sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &&,
  && svg,
  && * {
    color: ${props => props.$active ? "#000080 !important" : "#ffffff !important"};
  }

  &:hover {
    background: ${props => props.$active ? "#ffc107" : "rgba(255, 255, 255, 0.18)"};
  }

  @media (max-width: 768px) {
    flex: 1;
    width: 100%;
    justify-content: center;
    padding: 8px 12px;
    min-height: 38px;
    border-radius: 10px;
    font-size: 12px;
  }
`;

export const PricingInfo = styled.div`
  font-size: clamp(12px, 0.85vw, 13.5px);
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.3;
`;

export const ActiveSubscriptionCard = styled.div`
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 14px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SubscriptionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  div {
    display: flex;
    flex-direction: column;
    
    strong {
      font-size: 13.5px;
      color: #ffffff;
    }
    small {
      font-size: 11.5px;
      color: rgba(255, 255, 255, 0.78);
    }
  }
`;

export const SubscriptionRemaining = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const UsageText = styled.span`
  font-size: 12px;
  color: #bbf7d0;
  font-weight: 600;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
`;

// --- Buttons & Price ---
export const CallToAction = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: clamp(6px, 0.8vw, 10px);
  margin-top: 10px;
  width: 100%;
  box-sizing: border-box;

  .expert-profile-action-item {
    flex: 1 1 0px;
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    overflow: hidden;
  }

  .expert-profile-video-call-btn {
    width: 100% !important;
    height: 46px !important;
    min-height: 46px !important;
    max-height: 46px !important;
    border-radius: 12px !important;
    background: linear-gradient(135deg, #2563eb, #000080) !important;
    color: #ffffff !important;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.22) !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    font-size: clamp(12px, 0.88vw, 13.5px) !important;
    padding: 0 12px !important;
  }

  .expert-profile-video-call-btn,
  .expert-profile-video-call-btn *,
  .expert-profile-video-call-btn svg {
    color: #ffffff !important;
  }

  .expert-profile-video-call-btn:disabled {
    background: #94a3b8 !important;
    color: #ffffff !important;
    border-color: #cbd5e1 !important;
    box-shadow: none !important;
    opacity: 1 !important;
  }

  @media (max-width: 768px) { 
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 4px;
    margin-top: 8px;
    margin-bottom: clamp(14px, 4vw, 22px);
    padding-bottom: env(safe-area-inset-bottom, 12px);
    width: 100%;

    .expert-profile-action-item {
      flex: 1 1 0px;
      min-width: 0;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      overflow: hidden;
    }
  }
`;

export const ActionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 0;
  height: 46px;
  min-height: 46px;
  max-height: 46px;
  padding: 0 12px;
  border-radius: 12px;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: clamp(12px, 0.88vw, 13.5px);
  cursor: pointer;
  border: 1px solid ${props => props.$primary ? "#ffc107" : "#e2e8f0"};
  background: ${props => props.$primary ? "linear-gradient(135deg, #ffd23f, #ffc107)" : "#ffffff"};
  color: ${props => props.$primary ? "#000080" : "#000080"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: ${props => props.$primary ? "0 4px 12px rgba(255, 193, 7, 0.2)" : "0 2px 6px rgba(0, 0, 0, 0.04)"};
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  svg {
    flex: 0 0 auto;
    font-size: clamp(13px, 0.9vw, 16px);
  }

  .action-btn-rate {
    font-size: 11px;
    opacity: 0.88;
    font-weight: 600;
    display: inline-block;
    background: rgba(0, 0, 0, 0.12);
    padding: 1px 6px;
    border-radius: 999px;
    margin-left: 3px;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.$primary ? "0 8px 18px rgba(255, 193, 7, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.08)"};
  }

  &:disabled {
    cursor: not-allowed;
    transform: none;
    border-color: #cbd5e1;
    background: #e5e7eb;
    color: #475569;
    box-shadow: none;
    opacity: 1;
  }

  &.expert-profile-green-action-btn {
    border-color: #16a34a !important;
    background: #16a34a !important;
    color: #ffffff !important;
    box-shadow: 0 8px 18px rgba(22, 163, 74, 0.22) !important;

    svg,
    * {
      color: #ffffff !important;
    }

    &:hover {
      background: #15803d !important;
      border-color: #15803d !important;
      color: #ffffff !important;
    }
  }

  @media (max-width: 768px) {
    min-height: 40px;
    padding: 8px 10px;
    font-size: 13px;
    line-height: 1.2;
  }
`;

export const PriceTag = styled.div`
  width: 100%;
  max-width: 100%;
  min-height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: clamp(10px, 0.72vw, 11.5px);
  color: #ffffff;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.22);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
  box-sizing: border-box;
  @media (max-width: 768px) { 
    font-size: 9.5px !important;
    padding: 2px 2px !important;
    min-height: 18px !important;
    border-radius: 999px !important;
    width: 100% !important;
    max-width: 100% !important;
    text-align: center !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    margin-left: auto;
    margin-right: auto;
    letter-spacing: -0.2px;
  }
`;

export const AboutSubsection = styled.div`
  margin-top: 16px;
  &:first-of-type {
    margin-top: 14px;
  }
`;

export const AboutSubtitle = styled.h3`
  font-family: "Poppins", "Plus Jakarta Sans", sans-serif;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #000080;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    color: #000080;
    font-size: 14px;
  }
`;

export const QualificationsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const QualificationItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13.5px;
  font-weight: 600;
  color: #1e293b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 9px 13px;
  line-height: 1.4;
  word-break: break-word;

  svg {
    color: #000080;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;



export const FollowButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: ${props => props.$active ? " #ffffff" : " #000080"};
  border-radius: 999px;
  padding: 9px 18px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 16px;

  ${props => props.$active && css`
    color: #ffffff !important;
    background: #000080 !important;
    border-color: #000080 !important;
    svg, * {
      color: #ffffff !important;
    }
  `}

  &:hover {
    transform: translateY(-1px);
    background-color: ${props => props.$active ? "rgba(255, 255, 255, 0.28)" : "rgba(255, 255, 255, 0.92)"};
    color: ${props => props.$active ? "#ffffff !important" : "#000080"};
  }

  @media (min-width: 1024px) {
    ${props => props.$active && css`
      color: #ffffff;
      border-color: #000080;
      background: #000080;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.22);
    `}
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
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  margin-bottom: 24px;
  scroll-margin-top: 96px;
  min-height: 220px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    min-height: auto;
    scroll-margin-top: 12px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  }
`;

export const SectionTitle = styled.h2`
  font-family: "Poppins", "Plus Jakarta Sans", sans-serif;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #000080;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    margin-bottom: 10px;
    font-size: 16px;
    line-height: 1.25;
  }
`;

export const SectionBody = styled.div`
  font-family: "Inter", "Outfit", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  color: #334155;
  white-space: pre-line;
  word-break: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.6;
  }
`;

// --- Reviews ---
export const ReviewSection = styled(Section)`
  @media (min-width: 1920px) {
    max-width: 900px;
  }

  @media (max-width: 768px) {
    padding: 14px;
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
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const InfoItem = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.07);
  }

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 14px;
    min-height: auto;
  }
`;

export const InfoLabel = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  color: #000080;
  letter-spacing: 0.5px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    margin-bottom: 6px;
    font-size: 11px;
    line-height: 1.3;
  }
`;

export const InfoValue = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 15px;
  color: #334155;
  line-height: 1.65;
  overflow-wrap: anywhere;
  flex: 1;
  
  div {
    margin-bottom: 6px;
    
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

  @media (min-width: 1024px) {
    color: #ffffff !important;

    :where(h1, h2, h3, h4, p, span, small, strong, div, li, svg) {
      color: inherit !important;
    }
  }

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

  @media (min-width: 1024px) {
    ${props => props.$featured && `
      color: #ffffff !important;

      :where(h1, h2, h3, h4, p, span, small, strong, div, li, svg) {
        color: inherit !important;
      }

      button {
        color: #667eea !important;
      }
    `}
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



export const ReelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding-bottom: 60px;
  }
`;

export const ReelGridCard = styled.div`
  position: relative;
  aspect-ratio: 9 / 16;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

export const ReelThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ReelVideoPreview = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ReelOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.75) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 12px;
  color: #fff;
`;

export const ReelPlayIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0.85;
  transition: opacity 0.2s, transform 0.2s;

  ${ReelGridCard}:hover & {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

export const ReelMetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 600;
  margin-top: 4px;
`;

export const ReelCaption = styled.p`
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #ffffff;
`;
