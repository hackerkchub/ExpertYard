import styled, { keyframes, css } from "styled-components";

// Animations
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const pulseRing = keyframes`
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 0.4; }
  100% { transform: scale(0.95); opacity: 0.8; }
`;

export const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const PageWrap = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Rubik:wght@400;500;600;700;800&display=swap');

  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 16px clamp(12px, 2vw, 24px);
  background: #f8fafc;
  min-height: 100vh;
  font-family: "Inter", "Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  color: #0f172a;
  animation: ${fadeIn} 0.3s ease-out;
  box-sizing: border-box;

  *, *::before, *::after, button, input, select, textarea {
    font-family: "Inter", "Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    box-sizing: border-box;
  }

  /* Custom scrollbar utility */
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  /* Mobile container adjustments */
  @media (max-width: 1023px) {
    padding: 0 0 calc(90px + env(safe-area-inset-bottom, 0px)) 0 !important;
    background: #ffffff !important;
  }

  /* Top sticky navigation header */
  .profile-top-header-bar {
    position: sticky;
    top: 0;
    z-index: 40;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid #f1f5f9;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .top-back-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #334155;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .top-back-btn:active {
    transform: scale(0.95);
    background: #e2e8f0;
  }

  .top-header-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.2px;
  }

  .top-verified-icon {
    color: #2563eb;
    flex-shrink: 0;
  }

  .top-share-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #475569;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .top-share-btn:active {
    transform: scale(0.95);
    background: #e2e8f0;
  }

  /* Desktop vs Mobile Layout Grid */
  .profile-page-layout-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    width: 100%;
    margin-top: 12px;
  }

  @media (min-width: 1024px) {
    .profile-page-layout-grid {
      grid-template-columns: minmax(0, 1fr) 360px;
      gap: 24px;
      align-items: start;
    }
  }

  .profile-layout-main-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
    width: 100%;
  }

  .profile-layout-sidebar-col {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;

    @media (min-width: 1024px) {
      position: sticky;
      top: 80px;
    }
  }

  @media (max-width: 1023px) {
    .profile-layout-sidebar-col {
      display: none !important;
    }
  }

  @media (min-width: 1024px) {
    .mobile-only-consult-module {
      display: none !important;
    }
  }
`;

/* Hero Profile Card Components */
export const ProfileCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;

  @media (max-width: 768px) {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: none;
    padding: 14px 16px;
  }
`;

export const HeroTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

export const AvatarWrap = styled.div`
  position: relative;
  flex-shrink: 0;

  .avatar-circle {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    color: #ffffff;
    font-size: 22px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #ffffff;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    overflow: hidden;
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .status-badge {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 16px;
    height: 16px;
    background: #10b981;
    border: 2px solid #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);

    &.offline {
      background: #94a3b8;
    }
  }

  .pulse-inner {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ffffff;
    animation: ${pulseRing} 2s infinite ease-in-out;
  }
`;

export const QuickStats = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  text-align: center;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 14px;
  padding: 10px 6px;
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:not(:last-child) {
    border-right: 1px solid #e2e8f0;
  }

  .stat-value {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.2;
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .stat-label {
    font-size: 10px;
    font-weight: 500;
    color: #64748b;
    margin-top: 2px;
  }
`;

export const HeroBioSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .hero-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .hero-expert-name {
    margin: 0;
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.3px;
    line-height: 1.2;
  }

  .category-pill {
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 12px;
    border: 1px solid #dbeafe;
  }

  .hero-subtitle {
    margin: 0;
    font-size: 12px;
    color: #475569;
    font-weight: 500;
  }

  .hero-availability {
    font-size: 11px;
    font-weight: 600;
    color: #059669;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;

    &.offline {
      color: #64748b;
    }
  }
`;

export const HeroActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

export const FollowButton = styled.button`
  flex: 1;
  height: 38px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$active ? "#f1f5f9" : "#2563eb"};
  color: ${props => props.$active ? "#334155" : "#ffffff"};
  border: ${props => props.$active ? "1px solid #cbd5e1" : "none"};

  &:active {
    transform: scale(0.98);
  }
`;

export const ActionButton = styled.button`
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SkillChipsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  .skill-chip {
    background: #f1f5f9;
    color: #334155;
    font-size: 11px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 14px;
    white-space: nowrap;
    border: 1px solid #e2e8f0;
    flex-shrink: 0;
  }
`;

/* Consultation Pricing Module Components */
export const ConsultModuleCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  @media (max-width: 768px) {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: none;
    padding: 14px 16px;
  }
`;

export const PricingModeTabs = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 10px;
  gap: 2px;
`;

export const PricingModeTab = styled.button`
  flex: 1;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: ${props => (props.$active ? "700" : "500")};
  color: ${props => (props.$active ? "#1d4ed8" : "#64748b")};
  background: ${props => (props.$active ? "#ffffff" : "transparent")};
  box-shadow: ${props => (props.$active ? "0 1px 3px rgba(0,0,0,0.08)" : "none")};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.15s ease;
`;

export const PerMinuteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

export const PricingCard = styled.div`
  padding: 12px;
  border-radius: 14px;
  border: ${props => (props.$active ? `2px solid ${props.$borderColor || "#2563eb"}` : "1px solid #e2e8f0")};
  background: ${props => props.$bg || "#ffffff"};
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  box-shadow: ${props => (props.$active ? "0 4px 14px rgba(37,99,235,0.18)" : "0 1px 3px rgba(0,0,0,0.02)")};

  &:hover {
    border-color: ${props => props.$hoverColor || props.$borderColor || "#2563eb"};
  }

  &:active {
    transform: scale(0.98);
  }

  .card-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 700;
    color: ${props => props.$titleColor || "#0f172a"};
  }

  .card-price {
    font-size: 15px;
    font-weight: 800;
    color: ${props => props.$priceColor || "#1e293b"};
    line-height: 1.1;
  }

  .card-subtext {
    font-size: 10px;
    color: #64748b;
    font-weight: 400;
  }
`;

export const SessionCardBox = styled.div`
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .session-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .session-title {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
  }

  .session-badge {
    background: #dbeafe;
    color: #1e40af;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 6px;
  }

  .session-price-row {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .session-price {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
  }

  .session-desc {
    font-size: 11px;
    color: #475569;
    line-height: 1.4;
  }

  .session-book-btn {
    width: 100%;
    padding: 10px;
    background: #2563eb;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #1d4ed8;
    }
  }
`;

/* Edge-to-Edge Content Tabs */
export const ProfileTabsCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  width: 100%;

  @media (max-width: 768px) {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: none;
    padding: 12px 16px;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 2px;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

export const TabButton = styled.button`
  padding: 8px 0;
  font-size: 12px;
  font-weight: ${props => (props.$active ? "700" : "500")};
  color: ${props => (props.$active ? "#2563eb" : "#64748b")};
  border-bottom: 2px solid ${props => (props.$active ? "#2563eb" : "transparent")};
  background: transparent;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    color: #0f172a;
  }
`;

export const TabContent = styled.div`
  padding-top: 14px;
`;

export const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
`;

export const SectionBody = styled.p`
  font-size: 12px;
  color: #475569;
  line-height: 1.5;
  margin: 0;
`;

export const QualificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
`;

export const QualificationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #334155;
  background: #f8fafc;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

export const Tag = styled.span`
  background: #f1f5f9;
  color: #334155;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

/* Experience Timeline */
export const ExperienceCard = styled.div`
  position: relative;
  padding-left: 16px;
  border-left: 2px solid #e2e8f0;
  margin-bottom: 14px;

  &::before {
    content: "";
    position: absolute;
    left: -5px;
    top: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2563eb;
    border: 2px solid #ffffff;
  }
`;

export const ExperienceHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ExperienceTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
`;

export const ExperienceCompany = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #2563eb;
`;

export const ExperienceDate = styled.div`
  font-size: 10px;
  color: #94a3b8;
  margin-top: 2px;
`;

export const ExperienceCertificate = styled.a`
  font-size: 11px;
  color: #059669;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

/* Post Feed Grid */
export const PostGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const PostCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PostTitle = styled.h4`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
`;

export const PostDescription = styled.p`
  margin: 0;
  font-size: 12px;
  color: #475569;
  line-height: 1.4;
`;

export const PostImage = styled.img`
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  border-radius: 10px;
`;

export const PostStats = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PostStat = styled.div`
  font-size: 11px;
  color: #64748b;
`;

export const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 6px;
  border-top: 1px solid #e2e8f0;
`;

export const PostActionBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.$liked ? "#ef4444" : "#64748b"};
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

/* Reels Grid */
export const ReelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

export const ReelGridCard = styled.div`
  position: relative;
  height: 160px;
  border-radius: 14px;
  overflow: hidden;
  background: #0f172a;
  cursor: pointer;
`;

export const ReelThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ReelOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%);
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #ffffff;
`;

export const ReelPlayIcon = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;

export const ReelCaption = styled.div`
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ReelMetaInfo = styled.div`
  display: flex;
  gap: 8px;
  font-size: 10px;
  color: #cbd5e1;
  margin-top: 2px;
`;

/* Reviews Components */
export const ReviewSection = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  margin-top: 16px;

  @media (max-width: 768px) {
    border-radius: 0;
    border: none;
    box-shadow: none;
    padding: 14px 16px;
  }
`;

export const ReviewHeader = styled.div`
  margin-bottom: 12px;
`;

export const ReviewForm = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 16px;
`;

export const ReviewFormTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const RatingInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const RatingLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #475569;
`;

export const StarRating = styled.div`
  display: flex;
  gap: 4px;
`;

export const Star = styled.button`
  background: transparent;
  border: none;
  font-size: 16px;
  color: ${props => props.$filled ? "#f59e0b" : "#cbd5e1"};
  cursor: pointer;
  padding: 0;
`;

export const TextAreaContainer = styled.div`
  width: 100%;
  margin-bottom: 8px;
`;

export const ReviewTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px;
  font-size: 12px;
  outline: none;
  resize: vertical;
  color: #0f172a;
  background: #ffffff;
`;

export const FormActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SubmitButton = styled.button`
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DeleteButton = styled.button`
  background: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

export const RecentReviewsTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ReviewItem = styled.div`
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 10px;

  &:last-child {
    border-bottom: none;
  }
`;

export const ReviewUser = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #475569;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
`;

export const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ReviewDate = styled.span`
  font-size: 10px;
  color: #94a3b8;
`;

export const ReviewText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #475569;
  line-height: 1.4;
`;

export const LoadingReviews = styled.div`
  text-align: center;
  padding: 20px;
  color: #64748b;
  font-size: 12px;
`;

export const NoReviews = styled.div`
  text-align: center;
  padding: 20px;
  color: #94a3b8;
  font-size: 12px;
`;

/* Mobile Sticky Bottom Consultation Bar */
export const MobileStickyBottomBar = styled.div`
  display: none;

  @media (max-width: 1023px) {
    display: flex !important;
    position: fixed !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    z-index: 2147483647 !important;
    background: #ffffff !important;
    border-top: 1px solid #e2e8f0 !important;
    padding: 10px 16px calc(10px + env(safe-area-inset-bottom, 0px)) !important;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06) !important;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    box-sizing: border-box !important;
  }

  @media (min-width: 1024px) {
    display: none !important;
  }

  .cta-info-col {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .cta-label {
      font-size: 11px;
      font-weight: 500;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .cta-price {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
      white-space: nowrap;

      span {
        font-size: 11px;
        font-weight: 400;
        color: #64748b;
      }
    }
  }

  .cta-btn-primary {
    flex: 1;
    min-width: 140px;
    height: 44px;
    background: #2563eb;
    color: #ffffff;
    border: none;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    transition: all 0.15s ease;

    &:active {
      transform: scale(0.98);
      background: #1d4ed8;
    }
  }
`;

/* Legacy compatibility exports */
export const VerifiedCheckIcon = styled.span`
  color: #2563eb;
  display: inline-flex;
  align-items: center;
`;
export const LoginPrompt = styled.div` font-size: 12px; color: #64748b; `;
export const LoginButton = styled.button` background: #2563eb; color: #fff; border: none; padding: 4px 10px; border-radius: 6px; font-size: 11px; `;
export const ViewAllButton = styled.button` background: transparent; border: none; color: #2563eb; font-size: 11px; cursor: pointer; `;
export const LeftImage = styled.img` width: 100%; height: 100%; object-fit: cover; `;
export const Name = styled.h1` font-size: 17px; font-weight: 800; margin: 0; color: #0f172a; `;
export const Role = styled.p` font-size: 12px; color: #64748b; margin: 0; `;
export const Status = styled.span` font-size: 11px; font-weight: 600; color: ${props => props.$online ? "#059669" : "#64748b"}; `;
export const Section = styled.div` margin-bottom: 16px; `;
export const PriceTag = styled.span` font-size: 11px; font-weight: 700; color: #2563eb; `;
export const CallToAction = styled.div` display: flex; gap: 8px; `;
export const AboutSubsection = styled.div` margin-top: 12px; `;
export const AboutSubtitle = styled.h4` font-size: 12px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0; `;
export const AvatarFallback = styled.span` font-size: 22px; font-weight: 800; color: #fff; `;
export const InfoGrid = styled.div` display: flex; flex-direction: column; gap: 10px; `;
export const InfoItem = styled.div` display: flex; flex-direction: column; gap: 2px; `;
export const InfoLabel = styled.span` font-size: 11px; font-weight: 700; color: #0f172a; `;
export const InfoValue = styled.div` font-size: 12px; color: #475569; `;
export const CommentsBox = styled.div` margin-top: 8px; `;
export const CommentsList = styled.div` display: flex; flex-direction: column; gap: 6px; `;
export const CommentItem = styled.div` font-size: 11px; color: #334155; `;
export const CommentText = styled.span` font-weight: 500; `;
export const CommentMeta = styled.span` font-size: 10px; color: #94a3b8; margin-left: 6px; `;
export const InlineInput = styled.input` flex: 1; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 8px; font-size: 11px; `;
export const SendBtn = styled.button` background: #2563eb; color: #fff; border: none; border-radius: 6px; padding: 4px 8px; font-size: 11px; `;
export const RatingBox = styled.div``;
export const StarsRow = styled.div``;
export const StarBtn = styled.button``;
export const UserReviewBox = styled.div``;
export const SubscriptionCard = styled.div``;
export const SubscriptionBadge = styled.span``;
export const PlansContainer = styled.div` display: flex; flex-direction: column; gap: 12px; `;
export const PlanCard = styled.div` border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; background: #f8fafc; `;
export const PlanHeader = styled.div` margin-bottom: 8px; `;
export const PlanName = styled.h4` margin: 0; font-size: 14px; font-weight: 700; color: #0f172a; `;
export const PlanPrice = styled.div` font-size: 18px; font-weight: 800; color: #2563eb; `;
export const PlanDuration = styled.span` font-size: 11px; color: #64748b; `;
export const PlanFeatures = styled.div` display: flex; flex-direction: column; gap: 4px; margin: 8px 0; `;
export const PlanFeature = styled.div` font-size: 11px; color: #334155; display: flex; align-items: center; gap: 6px; `;
export const SubscribeButton = styled.button` width: 100%; padding: 8px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; `;
export const ActiveSubscriptionCard = styled.div` background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 10px 14px; `;
export const SubscriptionInfo = styled.div` display: flex; align-items: center; gap: 10px; color: #065f46; font-size: 12px; `;
export const SubscriptionRemaining = styled.div``;
export const ProgressBar = styled.div``;
export const UsageText = styled.span``;
export const PricingInfo = styled.div``;
export const ReelVideoPreview = styled.div``;
export const ShareIconButton = styled.button` background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; `;
export const ShareModalOverlay = styled.div` position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 16px; `;
export const ShareModalBox = styled.div` background: #ffffff; border-radius: 20px; width: 100%; max-width: 420px; padding: 20px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); .share-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; h3 { margin: 0; font-size: 15px; font-weight: 700; color: #0f172a; } button { background: none; border: none; color: #64748b; cursor: pointer; } } .share-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; } `;
export const ShareOptionItem = styled.a` display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 10px; border: 1px solid #e2e8f0; background: #f8fafc; color: #0f172a; text-decoration: none; font-size: 12px; font-weight: 600; cursor: pointer; &:hover { background: #f1f5f9; } `;
