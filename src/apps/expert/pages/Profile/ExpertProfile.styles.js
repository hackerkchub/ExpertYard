import styled from "styled-components";

/* PAGE */
export const PageWrap = styled.div`
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(circle at top left, #dbeafe 0%, #f9fafb 45%, #ffffff 100%);
  display: flex;
  justify-content: center;
`;

/* CONTENT */
export const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 32px auto 40px;
  padding: 0 24px;
  color: #0f172a;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

/* GLASS CARD */
export const GlassCard = styled.div`
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.65));
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  border-radius: 24px;
  padding: 26px 30px;
  margin-bottom: 26px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  box-shadow:
    0 24px 60px rgba(15, 23, 42, 0.14),
    0 0 0 1px rgba(255, 255, 255, 0.7);
`;

/* HEADER */
export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
`;

export const HexAvatar = styled.div`
  width: 120px;
  height: 120px;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  position: relative;
  flex-shrink: 0;

  &::before {
    content: "";
    position: absolute;
    inset: -4px;
    background: radial-gradient(circle at 0 0,#22d3ee,#22c55e);
    z-index: -2;
    clip-path: inherit;
    filter: blur(4px);
    opacity: 0.9;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: #ffffff;
    clip-path: inherit;
    z-index: -1;
  }

  img {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
    clip-path: inherit;
  }
`;


export const StatusDot = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 14px;
  height: 14px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid #fff;
`;

export const Name = styled.h2`
  margin: 0;
  font-size: 26px;
  color: #020617;
`;

export const Title = styled.p`
  margin: 6px 0;
  color: #475569;
`;

export const Badge = styled.span`
  display: inline-block;
  margin-top: 6px;
  background: rgba(14,165,233,0.15);
  color: #0284c7;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
`;

export const StatRow = styled.div`
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const StatPill = styled.span`
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(226,232,240,0.6);
  color: #475569;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  span {
    font-weight: 600;
    color: #0f172a;
  }
`;

export const UpdateBtn = styled.button`
  margin-left: auto;
  padding: 12px 18px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg,#38bdf8,#0ea5e9);
  color: #fff;
  cursor: pointer;
  display: flex;
  gap: 8px;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  box-shadow: 0 12px 30px rgba(37,99,235,0.35);

  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }
`;

/* RATE */
export const RateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: 22px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const RateCard = styled(GlassCard)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 24px;
`;

export const RateValue = styled.div`
  font-size: 30px;
  font-weight: 700;
  background: linear-gradient(135deg,#22c55e,#0ea5e9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

/* TABS */
export const Tabs = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 34px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.85);
`;

export const Tab = styled.div`
  padding-bottom: 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: ${p => (p.active ? "#0ea5e9" : "#94a3b8")};
  border-bottom: ${p =>
    p.active ? "3px solid #0ea5e9" : "3px solid transparent"};
  transition: all 0.18s ease;

  &:hover {
    color: #0ea5e9;
  }
`;

/* SECTIONS */
export const Section = styled.div`
  margin-top: 26px;
`;

export const Label = styled.div`
  font-weight: 600;
  margin-top: 16px;
  color: #020617;
  font-size: 13px;
`;

export const Value = styled.div`
  color: #475569;
  margin-top: 6px;
  line-height: 1.6;
  font-size: 14px;
`;

/* INPUTS */
export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  margin-top: 6px;
  border-radius: 14px;
  border: 1px solid #dbeafe;
  background: rgba(255,255,255,0.9);
  box-shadow: 0 8px 20px rgba(15,23,42,0.04);
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 1px rgba(14,165,233,0.35);
  }
`;

export const ChipButton = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  background: linear-gradient(135deg,#38bdf8,#0ea5e9);
  color: #fff;
  white-space: nowrap;
  box-shadow: 0 10px 25px rgba(37,99,235,0.35);

  &:hover {
    opacity: 0.95;
  }
`;

/* DOCS */
export const DocRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

export const DocPreview = styled.img`
  width: 150px;
  height: 96px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid rgba(226,232,240,0.9);
  background: rgba(248,250,252,0.7);
  box-shadow:
    0 10px 30px rgba(15,23,42,0.12),
    0 0 0 1px rgba(255,255,255,0.7);
`;

/* ACTIONS */
export const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;

  button {
    padding: 12px 26px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    font-size: 14px;
  }
`;

export const Slider = styled.input`
  width: 100%;
  margin-top: 10px;
  -webkit-appearance: none;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg,#0ea5e9,#22c55e);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow:
      0 4px 8px rgba(15,23,42,0.18),
      0 0 0 3px rgba(59,130,246,0.35);
    border: none;
  }
`;

// AppModal.styles ya separate file me
export const GlassDivider = styled.div`
  height: 1px;
  width: 100%;
  margin: 14px 0;
  background: linear-gradient(
    90deg,
    rgba(148,163,184,0),
    rgba(148,163,184,0.45),
    rgba(148,163,184,0)
  );
  backdrop-filter: blur(2px);
`;
