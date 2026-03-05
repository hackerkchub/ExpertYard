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
  max-width: 1128px; // LinkedIn Standard Container
  margin: 0 auto;
  padding: 24px 15px;
  background-color: #f3f2ef; // LinkedIn light grey background
  min-height: 100vh;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    padding: 0; // Mobile pe full width cards
  }
`;

export const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  margin-bottom: 8px;
  @media (max-width: 768px) { padding: 12px 16px; background: white; border-bottom: 1px solid #e0e0e0; }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  &:hover { background-color: rgba(0, 0, 0, 0.08); color: #000; }
`;

// --- Main Profile Section ---
export const ProfileCard = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  padding: 24px;
  margin-bottom: 12px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.06);

  @media (max-width: 768px) { border-radius: 0; padding: 20px 16px; }
`;

export const LeftImage = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) { width: 120px; height: 120px; margin: 0 auto; display: block; }
`;

export const Name = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #000000e6;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  @media (max-width: 768px) { justify-content: center; text-align: center; margin-top: 16px; }
`;

export const VerifiedBadge = styled.span`
  background: #e7f3ff;
  color: #0a66c2;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
`;

export const Role = styled.p`
  font-size: 16px;
  color: #000000bf;
  margin-bottom: 8px;
  @media (max-width: 768px) { text-align: center; }
`;

export const Status = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$online ? "#057642" : "#cc1016"};
  margin-bottom: 16px;
  @media (max-width: 768px) { text-align: center; }
`;

export const QuickStats = styled.div`
  display: flex;
  gap: 12px;
  margin: 16px 0;
  flex-wrap: wrap;
  @media (max-width: 768px) { justify-content: center; }
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  background: #f9f9f9;
  padding: 6px 14px;
  border-radius: 16px;
  border: 1px solid #ebebeb;
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
  @media (max-width: 768px) { justify-content: center; }
`;

export const Tag = styled.span`
  background: #f3f2ef;
  color: #000000bf;
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #dcdcdc;
  display: flex;
  align-items: center;
  gap: 6px;
`;

// --- Buttons ---
export const CallToAction = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  @media (max-width: 768px) { flex-direction: column; }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
  border: 1px solid #0a66c2;
  background: ${props => props.$primary ? "#0a66c2" : "white"};
  color: ${props => props.$primary ? "white" : "#0a66c2"};

  &:hover {
    background: ${props => props.$primary ? "#004182" : "#eef3f8"};
    border-width: 2px;
    padding: 9px 23px; // Adjust for border width
  }
`;

export const PriceTag = styled.div`
  font-size: 13px;
  color: #666;
  font-weight: 700;
  margin-bottom: 6px;
  @media (max-width: 768px) { text-align: center; }
`;

export const FollowButton = styled.button`
  background: ${props => props.$active ? "#0a66c2" : "white"};
  color: ${props => props.$active ? "white" : "#666"};
  border: 1px solid ${props => props.$active ? "#0a66c2" : "#666"};
  padding: 6px 18px;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  &:hover { background: ${props => props.$active ? "#004182" : "#f3f2ef"}; }
`;

// --- Content Sections ---
export const Section = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  padding: 24px;
  margin-bottom: 12px;
  @media (max-width: 768px) { border-radius: 0; padding: 16px; }
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #000000e6;
`;

export const SectionBody = styled.div`
  font-size: 15px;
  line-height: 1.5;
  color: #000000bf;
`;

// --- Reviews ---
export const ReviewSection = styled(Section)``;
export const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

export const ReviewForm = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #eee;
  margin-bottom: 24px;
`;

export const ReviewFormTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RatingInput = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const RatingLabel = styled.span` font-size: 14px; font-weight: 600; `;

export const StarRating = styled.div` display: flex; gap: 4px; `;

export const Star = styled.button`
  background: none; border: none; cursor: pointer; font-size: 22px;
  color: ${props => props.$filled ? "#f59e0b" : "#d1d5db"};
  transition: transform 0.1s;
  &:hover { transform: scale(1.1); }
`;

export const TextAreaContainer = styled.div` position: relative; margin-bottom: 12px; `;

export const ReviewTextarea = styled.textarea`
  width: 100%; padding: 12px; border: 1px solid #dcdcdc; border-radius: 4px;
  font-family: inherit; font-size: 14px; resize: vertical;
  &:focus { border-color: #0a66c2; outline: none; box-shadow: 0 0 0 1px #0a66c2; }
`;

export const FormActions = styled.div` display: flex; gap: 12px; align-items: center; `;

export const SubmitButton = styled(ActionButton)`
  padding: 6px 20px; font-size: 14px;
  ${props => props.$disabled && css` background: #ccc; border-color: #ccc; cursor: not-allowed; `}
`;

export const DeleteButton = styled.button`
  background: transparent; border: none; color: #cc1016; font-size: 14px;
  font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px;
  &:hover { text-decoration: underline; }
`;

export const ReviewList = styled.div` display: flex; flex-direction: column; `;

export const ReviewItem = styled.div`
  padding: 16px 0; border-bottom: 1px solid #e0e0e0;
  &:last-child { border-bottom: none; }
`;

export const ReviewUser = styled.div` display: flex; gap: 12px; `;

export const UserAvatar = styled.div`
  width: 48px; height: 48px; border-radius: 50%; background: #717171;
  color: white; display: flex; align-items: center; justify-content: center;
  font-weight: 600; flex-shrink: 0;
`;

export const UserInfo = styled.div` flex: 1; `;
export const UserName = styled.h4` font-size: 14px; font-weight: 600; margin: 0; `;
export const ReviewMeta = styled.div` display: flex; align-items: center; gap: 8px; margin-top: 2px; `;
export const ReviewDate = styled.span` font-size: 12px; color: #666; `;
export const ReviewText = styled.p` font-size: 14px; color: #000000e6; margin-top: 8px; line-height: 1.4; `;

export const ViewAllButton = styled.button`
  width: 100%; padding: 12px; background: transparent; border: none;
  color: #0a66c2; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  &:hover { background: #eef3f8; }
`;

export const LoginPrompt = styled.div` text-align: center; width: 100%; p { margin-bottom: 12px; color: #666; font-size: 14px; } `;
export const LoginButton = styled(ActionButton)` margin: 0 auto; font-size: 14px; padding: 6px 20px; `;

// --- Missing Exports for Error Resolution ---
export const CharCount = styled.div` font-size: 12px; color: #666; text-align: right; margin-top: 4px; `;
export const ExpertiseGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px; `;
export const ExpertiseCard = styled.div` background: #f9f9f9; padding: 16px; border-radius: 8px; border: 1px solid #eee; `;
export const RecentReviewsTitle = styled.h3` font-size: 16px; font-weight: 600; margin: 24px 0 16px; display: flex; align-items: center; gap: 8px; `;
export const LoadingReviews = styled.div` text-align: center; padding: 40px 0; color: #666; `;
export const NoReviews = styled.div` text-align: center; padding: 40px 0; color: #666; h4 { margin: 12px 0 4px; color: #000; } `;

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