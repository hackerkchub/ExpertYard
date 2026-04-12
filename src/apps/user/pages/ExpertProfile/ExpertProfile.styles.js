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
  
  @media (max-width: 768px) { width: 120px; height: 120px;  auto; display: block; }
`;

export const AvatarFallback = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: ${({ bg }) =>
    bg || "linear-gradient(135deg, #6366f1, #06b6d4)"};
  color: #fff;
  font-size: 42px;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;

  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    font-size: 32px;
    margin: 0 auto;
    display: flex;
  }
`;

// --- Name & Header Info ---
export const Name = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #000000e6;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 8px; /* Badha diya thoda gap */
  
  @media (max-width: 768px) { 
    font-size: 20px;
    justify-content: flex-start; /* Left align on mobile */
    text-align: left; 
    margin-top: 0; 
  }
`;

export const VerifiedBadge = styled.span`
  background: #e7f3ff;
  color: #000080;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  flex-shrink: 0;
`;

export const Role = styled.p`
  font-size: 16px;
  color: #000000bf;
  margin-bottom: 4px;
  @media (max-width: 768px) { text-align: left; font-size: 14px; }
`;

export const Status = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$online ? "#057642" : "#cc1016"};
  margin-bottom: 12px;
  @media (max-width: 768px) { text-align: left; font-size: 12px; }
`;

// --- Stats & Tags (No Overflow) ---
export const QuickStats = styled.div`
  display: flex;
  gap: 8px;
  margin: 12px 0;
  flex-wrap: wrap; /* Screen ke bahar nahi jayega */
  @media (max-width: 768px) { justify-content: flex-start; }
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
  background: #f9f9f9;
  padding: 4px 10px;
  border-radius: 16px;
  border: 1px solid #ebebeb;
  white-space: nowrap;
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap; 
  gap: 8px;
  margin: 12px 0;
  @media (max-width: 768px) { justify-content: flex-start; }
`;

export const Tag = styled.span`
  background: #f3f2ef;
  color: #000000bf;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #dcdcdc;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
`;

// --- Buttons & Price ---
export const CallToAction = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  @media (max-width: 768px) { 
    flex-direction: row; /* Mobile pe bhi side-by-side rakha hai */
    width: 100%;
  }
`;

export const ActionButton = styled.button`
  flex: 1; /* Barabar jagah lenge */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #000080;
  background: ${props => props.$primary ? "#000080" : "white"};
  color: ${props => props.$primary ? "white" : "#000080"};
  white-space: nowrap;

  &:hover {
    background: ${props => props.$primary ? "#004182" : "#eef3f8"};
  }
`;

export const PriceTag = styled.div`
  font-size: 14px;
  color: #000;
  font-weight: 700;
  margin-bottom: 6px;
  @media (max-width: 768px) { text-align: left; }
`;

export const FollowButton = styled.button`
  border: 1px solid #000080;
  background: none;
  color: #000080;
  border-radius: 20px;
  padding: 4px 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;

  // Desktop
  margin-top: 16px;
  margin-left: 25px;
  display: block;

  &:hover {
    background-color: rgba(10, 102, 194, 0.1);
  }

  // Mobile
  @media (max-width: 768px) {
        padding-left: 20px;
        padding-right: 20px;
        display: inline-block;
        margin: 10px;
  }
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
  &:focus { border-color: #000080; outline: none; box-shadow: 0 0 0 1px #000080; }
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

// new added styles for experience and price sections


// Add these new styled components to your ExpertProfile.styles.js file

export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    gap: 4px;
  }
`;

export const TabButton = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.$active ? "#000080" : "#666"};
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
      height: 2px;
      background: #000080;
    }
  `}
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 13px;
  }
`;

export const TabContent = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const InfoItem = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #eee;
`;

export const InfoLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #666;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

export const InfoValue = styled.div`
  font-size: 14px;
  color: #000000e6;
  line-height: 1.5;
  
  div {
    margin-bottom: 4px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const ExperienceCard = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ExperienceHeader = styled.div`
  margin-bottom: 12px;
`;

export const ExperienceTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000000e6;
  margin: 0 0 4px 0;
`;

export const ExperienceCompany = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

export const ExperienceDate = styled.div`
  font-size: 12px;
  color: #999;
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
  background: #eef3f8;
  border-radius: 4px;
  
  &:hover {
    text-decoration: underline;
    background: #e2e9f0;
  }
`;


// Add this new styled component for the post grid
export const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// Update PostCard for grid layout
export const PostCard = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

export const PostHeader = styled.div`
  padding: 16px 16px 8px 16px;
`;

export const PostTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000000e6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const PostDescription = styled.p`
  font-size: 14px;
  color: #000000bf;
  line-height: 1.5;
  margin: 0 16px 12px 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const PostImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  background: #f3f2ef;
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
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.$liked ? "#ef4444" : "#666"};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f3f2ef;
    color: ${props => props.$liked ? "#dc2626" : "#000080"};
  }
`;

// Add these new styled components

export const CommentsBox = styled.div`
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  background: #f9f9f9;
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
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 13px;
  outline: none;
  
  &:focus {
    border-color: #000080;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  margin-top: 20px;
  color: white;
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
`;

export const PlanCard = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  }
`;

export const PlanHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
`;

export const PlanName = styled.h3`
  margin: 0 0 8px 0;
  color: #0f172a;
  font-size: 20px;
`;

export const PlanPrice = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #6366f1;
  margin: 8px 0;
`;

export const PlanDuration = styled.div`
  color: #64748b;
  font-size: 14px;
`;

export const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
`;

export const PlanFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: #334155;
  font-size: 14px;
`;

export const SubscribeButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
`;

export const ActiveSubscriptionCard = styled.div`
  background: #ecfdf5;
  border: 1px solid #10b981;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
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
`;

export const SubscriptionRemaining = styled.div`
  margin-top: 12px;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #d1fae5;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
`;

export const UsageText = styled.div`
  color: #065f46;
  font-size: 13px;
  font-weight: 500;
  margin-top: 8px;
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
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

export const PricingModeTab = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid ${props => props.$active ? '#6366f1' : '#e2e8f0'};
  background: ${props => props.$active ? '#6366f1' : '#fff'};
  color: ${props => props.$active ? '#fff' : '#475569'};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #6366f1;
    background: ${props => props.$active ? '#6366f1' : '#f8fafc'};
  }
`;

export const PricingInfo = styled.div`
  font-size: 13px;
  color: #64748b;
  padding: 8px 0;
`;