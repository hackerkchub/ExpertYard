import styled, { keyframes } from "styled-components";

/* ---------- card ---------- */

export const Card = styled.article`
  border-radius: 20px;
  padding: 14px;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.95),
    rgba(248,250,252,0.85)
  );
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow:
    0 12px 30px rgba(15, 23, 42, 0.10),
    inset 0 1px 0 rgba(255,255,255,0.7);

  display: flex;
  flex-direction: column;
  gap: 10px;

  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: #60a5fa;
    box-shadow:
      0 18px 45px rgba(37,99,235,0.18),
      inset 0 1px 0 rgba(255,255,255,0.8);
  }
`;

/* ---------- header ---------- */

export const CardHeader = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

/* ---------- avatar ---------- */

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(99,102,241,0.45); }
  70% { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
  100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
`;

export const AvatarWrap = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  padding: 2px;

  background: ${({ $isAI }) =>
    $isAI
      ? "conic-gradient(from 160deg, #38bdf8, #a855f7, #f97316, #38bdf8)"
      : "linear-gradient(135deg, #60a5fa, #818cf8)"};

  animation: ${pulse} 2.2s infinite;
`;

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 999px;
  object-fit: cover;
  background: #e5e7eb;
`;

/* ---------- status ---------- */

export const StatusDot = styled.span`
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid #ffffff;
  background: ${({ $online }) => ($online ? "#22c55e" : "#94a3b8")};
`;

/* ---------- text ---------- */

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Name = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #020617;
`;

export const Badge = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 3px 7px;
  border-radius: 999px;
  background: rgba(99,102,241,0.12);
  color: #4338ca;
  border: 1px solid rgba(99,102,241,0.35);
`;

export const Role = styled.div`
  margin-top: 2px;
  font-size: 12px;
  color: #475569;
`;

/* ---------- meta ---------- */

export const MetaRow = styled.div`
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 11px;
  color: #475569;
`;

export const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const RatingStar = styled.span`
  color: #f59e0b;
  font-size: 12px;
`;

/* ---------- languages ---------- */

export const LangRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const LangChip = styled.span`
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 11px;
  background: rgba(226,232,240,0.8);
  border: 1px solid rgba(203,213,225,0.9);
  color: #334155;
`;

/* ---------- price ---------- */

export const PriceRow = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
`;

export const PriceLabel = styled.div`
  color: #64748b;
`;

export const PriceTag = styled.div`
  margin-top: 2px;
  font-weight: 600;
  color: #020617;
`;

/* ---------- actions ---------- */

export const ActionRow = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 8px;

  @media (max-width: 420px) {
    flex-direction: column;
  }
`;

export const PrimaryBtn = styled.button`
  flex: 1;
  border-radius: 999px;
  border: none;
  outline: none;

  padding: 7px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #ffffff;

  box-shadow: 0 10px 22px rgba(37,99,235,0.35);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  transition: transform 0.14s ease, box-shadow 0.14s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 30px rgba(37,99,235,0.45);
  }
`;

export const GhostBtn = styled.button`
  min-width: 96px;
  border-radius: 999px;
  border: 1px solid rgba(203,213,225,0.9);
  background: #ffffff;
  color: #334155;
  font-size: 11px;
  cursor: pointer;
  padding: 6px 10px;

  transition: all 0.14s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #2563eb;
    color: #1d4ed8;
  }
`;
