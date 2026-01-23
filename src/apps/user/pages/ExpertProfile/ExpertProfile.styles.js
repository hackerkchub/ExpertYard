import styled from "styled-components";

/* ---------------- PAGE WRAPPER ---------------- */
export const PageWrap = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
`;

/* ---------------- HEADER ---------------- */
export const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.25s ease;
  box-shadow: 0 3px 6px rgba(0,0,0,0.04);

  &:hover {
    background: #f1f5f9;
    transform: translateY(-1px);
  }
`;

/* ---------------- MAIN PROFILE CARD ---------------- */
export const ProfileCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
`;

export const LeftImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 16px;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;

export const Name = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1f2937;
`;

export const Role = styled.div`
  font-size: 18px;
  color: #6b7280;
  margin-bottom: 12px;
`;

export const Status = styled.div`
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 20px;
  color: ${(p) => (p.$online ? "#10b981" : "#9ca3af")};
`;

/* ---------------- VERIFIED BADGE ---------------- */
export const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  margin-left: 12px;
  vertical-align: middle;
`;

/* ---------------- QUICK STATS ---------------- */
export const QuickStats = styled.div`
  display: flex;
  gap: 20px;
  background: #f9fafb;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4b5563;

  svg {
    flex-shrink: 0;
  }

  span {
    font-weight: 500;
    white-space: nowrap;
  }
`;

/* ---------------- TAG LIST ---------------- */
export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f3f4f6;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #4b5563;
  font-weight: 500;
  border: 1px solid #e5e7eb;

  svg {
    color: #6b7280;
  }
`;

/* ---------------- CALL TO ACTION ---------------- */
export const CallToAction = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;

  & > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const PriceTag = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1f40af;
  text-align: center;
  margin-bottom: 10px;
`;

export const ActionButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  background: ${(p) =>
    p.$primary
      ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
      : "linear-gradient(135deg, #10b981, #059669)"};

  color: white;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.2);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
  }
`;

/* ---------------- EXPERTISE SECTION ---------------- */
export const ExpertiseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ExpertiseCard = styled.div`
  background: ${(p) => (p.$highlight ? 'linear-gradient(135deg, #f5f3ff, #ede9fe)' : '#ffffff')};
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${(p) => (p.$highlight ? '#c4b5fd' : '#e5e7eb')};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

/* ---------------- SECTIONS ---------------- */
export const Section = styled.div`
  background: #ffffff;
  padding: 28px;
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

export const SectionTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1f2937;
`;

export const SectionBody = styled.p`
  line-height: 1.7;
  font-size: 16px;
  color: #4b5563;
`;

/* ---------------- REVIEWS SECTION ---------------- */
export const ReviewSection = styled(Section)`
  background: #ffffff;
`;

export const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 20px;
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ReviewItem = styled.div`
  background: #f9fafb;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
`;

export const ReviewUser = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 15px;
  color: #374151;
`;

export const ReviewText = styled.div`
  line-height: 1.6;
  font-size: 15px;
  color: #6b7280;
`;

/* ---------------- FOLLOW & RATING ---------------- */
export const FollowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  border: 2px solid ${(p) => (p.$active ? '#10b981' : '#d1d5db')};
  background: ${(p) => (p.$active ? '#d1fae5' : '#ffffff')};
  color: ${(p) => (p.$active ? '#065f46' : '#374151')};
  margin-top: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: ${(p) => (p.$active ? '#a7f3d0' : '#f3f4f6')};
  }
`;

export const MiniRating = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  padding: 8px 0;
`;

/* ---------------- STAR RATING ---------------- */
export const StarRating = styled.div`
  display: flex;
  gap: 6px;
`;

export const Star = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${(p) => (p.$filled ? '#facc15' : '#d1d5db')};
  transition: all 0.2s ease;
  border-radius: 4px;

  &:hover {
    color: #facc15;
    transform: scale(1.2);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

/* ---------------- NOTIFICATION BADGE ---------------- */
export const NotificationBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
  min-width: 20px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

/* ---------------- REMAINING STYLES ---------------- */
export const TwoColumn = styled.div`
  display: flex;
  gap: 40px;
  flex-wrap: wrap;

  & > div {
    flex: 1;
  }
`;

export const ListItem = styled.div`
  margin-bottom: 8px;
  padding-left: 14px;
  border-left: 3px solid #6366f1;
  color: #334155;
  font-size: 15px;
`;

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
`;

export const ReviewBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TopSection = styled.div`
  /* Deprecated - using ProfileCard instead */
`;

export const RightInfo = styled.div`
  /* Deprecated - restructured */
`;

/* ---------------- REVIEW FORM ---------------- */
export const ReviewForm = styled.div`
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

export const ReviewFormTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const RatingInput = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

export const RatingLabel = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #4b5563;
  white-space: nowrap;
`;

export const RatingValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${(p) => (p.$active ? '#1f40af' : '#9ca3af')};
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 20px;
  min-width: 100px;
  text-align: center;
`;

export const TextAreaContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

export const ReviewTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${(p) => (p.disabled ? '#d1d5db' : '#e5e7eb')};
  font-size: 15px;
  resize: vertical;
  font-family: inherit;
  background: white;
  transition: all 0.2s ease;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const CharCount = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-size: 12px;
  color: #6b7280;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 10px;
`;

export const FormActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  background: ${(p) => (p.$disabled ? '#d1d5db' : 'linear-gradient(135deg, #f59e0b, #d97706)')};
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;
  min-width: 140px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
  }

  svg {
    margin-right: 4px;
  }
`;

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid #fca5a5;
  background: white;
  color: #dc2626;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #fee2e2;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LoginPrompt = styled.div`
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px dashed #d1d5db;
  width: 100%;

  p {
    margin: 0 0 16px 0;
    color: #6b7280;
    font-size: 15px;
  }
`;

export const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
  }
`;

/* ---------------- RECENT REVIEWS ---------------- */
export const RecentReviewsTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 32px 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LoadingReviews = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;

  p {
    margin-top: 16px;
    font-size: 14px;
  }
`;

export const NoReviews = styled.div`
  text-align: center;
  padding: 40px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px dashed #d1d5db;

  h4 {
    margin: 16px 0 8px 0;
    color: #4b5563;
    font-size: 16px;
  }

  p {
    color: #9ca3af;
    font-size: 14px;
    margin: 0;
  }
`;

export const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
`;

export const UserInfo = styled.div`
  flex: 1;
`;

export const UserName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 15px;
`;

export const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`;

export const ReviewDate = styled.div`
  font-size: 13px;
  color: #9ca3af;
`;

export const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  margin-top: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #4b5563;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;