import styled from "styled-components";

/* ---------------- PAGE WRAPPER ---------------- */

export const PageWrap = styled.div`
  max-width: 860px;
  margin: auto;
  padding: 26px;
  background: #f5f7fa;
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

/* ---------------- TOP SECTION ---------------- */

export const TopSection = styled.div`
  background: #ffffffcc;
  backdrop-filter: blur(6px);
  border-radius: 20px;
  padding: 22px;
  display: flex;
  gap: 22px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const LeftImage = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 16px;
  object-fit: cover;
  flex-shrink: 0;
`;

export const RightInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Name = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #0f172a;
`;

export const Role = styled.div`
  opacity: 0.85;
  font-size: 16px;
  margin-bottom: 10px;
`;

export const Status = styled.div`
  font-weight: 600;
  margin-bottom: 12px;
  color: ${(p) => (p.$online ? "#16a34a" : "#64748b")};
`;

export const MetaRow = styled.div`
  color: #475569;
  margin-bottom: 14px;
  font-size: 15px;
`;

/* ---------------- PRICE TAGS ---------------- */

export const PriceTag = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2563eb;
  text-align: center;
  margin-bottom: 6px;
`;

/* ---------------- ACTION BUTTONS ---------------- */

export const ActionButtons = styled.div`
  display: flex;
  gap: 14px;
  margin-top: auto;

  & > div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

export const ActionButton = styled.button`
  padding: 14px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: 0.25s ease;

  background: ${(p) =>
    p.$primary
      ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
      : "#e2e8f0"};

  color: ${(p) => (p.$primary ? "#fff" : "#0f172a")};

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

/* ---------------- CONTENT SECTIONS ---------------- */

export const Section = styled.div`
  margin-top: 32px;
  background: #fff;
  padding: 22px;
  border-radius: 18px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.04);
`;

export const SectionTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 14px;
  font-weight: 700;
  color: #0f172a;
`;

export const SectionBody = styled.p`
  opacity: 0.9;
  line-height: 1.6;
  font-size: 15px;
  color: #334155;
`;

export const ListItem = styled.div`
  margin-bottom: 8px;
  padding-left: 14px;
  border-left: 3px solid #6366f1;
  color: #334155;
  font-size: 15px;
`;

export const TwoColumn = styled.div`
  display: flex;
  gap: 40px;
  flex-wrap: wrap;

  & > div {
    flex: 1;
  }
`;

/* ---------------- RATINGS ---------------- */

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #0f172a;
`;

/* ---------------- REVIEWS ---------------- */

export const ReviewBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ReviewItem = styled.div`
  background: #f8fafc;
  padding: 16px;
  border-radius: 14px;
`;

export const ReviewUser = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
  color: #0f172a;
`;

export const ReviewText = styled.div`
  opacity: 0.85;
  line-height: 1.5;
  font-size: 14px;
  color: #475569;
`;

/* ---------------- LEFT SIDE STACK ---------------- */

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

/* ---------------- VERIFIED BADGE ---------------- */

export const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ecfdf5;
  color: #059669;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
`;

/* ---------------- FOLLOW BUTTON ---------------- */

export const FollowButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  background: ${(p) => (p.$active ? "#ecfdf5" : "#ffffff")};
  color: ${(p) => (p.$active ? "#059669" : "#0f172a")};

  &:hover {
    background: #f1f5f9;
  }
`;

/* ---------------- MINI RATING ---------------- */

export const MiniRating = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
`;
