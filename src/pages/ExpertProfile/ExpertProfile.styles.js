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
    padding: 18px;
  }
`;

export const LeftImage = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 16px;
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 130px;
    height: 130px;
  }
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

export const PriceRow = styled.div`
  display: flex;
  gap: 26px;
  margin: 18px 0;
`;

export const PriceItem = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    font-size: 22px;
    color: #0f172a;
  }

  span {
    opacity: 0.7;
    margin-top: 2px;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: auto;
`;

export const ActionButton = styled.button`
  flex: 1;
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
  box-shadow: ${(p) =>
    p.$primary ? "0 5px 15px rgba(37,99,235,0.25)" : "none"};

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
  line-height: 1.45;
`;

export const TwoColumn = styled.div`
  display: flex;
  gap: 40px;
  flex-wrap: wrap;

  & > div {
    flex: 1;
  }
`;

export const TagRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const SkillTag = styled.div`
  background: #eef2ff;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #4338ca;
`;

/* ---------------- REVIEWS ---------------- */

export const ReviewBlock = styled.div`
  background: #f8fafc;
  padding: 16px;
  border-radius: 14px;
  margin-bottom: 14px;
`;

export const ReviewName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 15px;
  color: #0f172a;
`;

export const ReviewText = styled.div`
  opacity: 0.85;
  line-height: 1.5;
  font-size: 14px;
  color: #475569;
`;
