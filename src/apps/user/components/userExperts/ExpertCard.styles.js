// src/apps/user/components/userExperts/ExpertCard.styles.js
import styled, { keyframes } from "styled-components";

export const Card = styled.article`
  border-radius: 18px;
  padding: 14px 14px 12px;
  background: radial-gradient(circle at top left, #1f2937, #020617);
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.85);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.16s ease-out, box-shadow 0.16s ease-out,
    border-color 0.16s ease-out;

  &:hover {
    transform: translateY(-4px);
    border-color: #38bdf8;
    box-shadow: 0 20px 55px rgba(56, 189, 248, 0.25);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.6); }
  70% { box-shadow: 0 0 0 8px rgba(56, 189, 248, 0); }
  100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
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
      : "linear-gradient(135deg, #38bdf8, #a855f7)"};
  animation: ${pulse} 2s infinite;
`;

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 999px;
  object-fit: cover;
  display: block;
`;

export const StatusDot = styled.span`
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid #020617;
  background: ${({ $online }) => ($online ? "#22c55e" : "#6b7280")};
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Name = styled.h3`
  font-size: 15px;
  font-weight: 600;
`;

export const Badge = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  padding: 3px 7px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.22);
  border: 1px solid rgba(56, 189, 248, 0.6);
`;

export const Role = styled.div`
  margin-top: 2px;
  font-size: 12px;
  opacity: 0.82;
`;

export const MetaRow = styled.div`
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 11px;
  opacity: 0.86;
`;

export const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const RatingStar = styled.span`
  color: #fbbf24;
  font-size: 12px;
`;

export const LangRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const LangChip = styled.span`
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 11px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.7);
`;

export const PriceRow = styled.div`
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
`;

export const PriceLabel = styled.div`
  opacity: 0.72;
`;

export const PriceTag = styled.div`
  margin-top: 2px;
  font-weight: 600;
`;

export const ActionRow = styled.div`
  margin-top: 8px;
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
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  background: linear-gradient(135deg, #38bdf8, #a855f7);
  color: #0f172a;
  box-shadow: 0 10px 22px rgba(56, 189, 248, 0.35);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: transform 0.14s ease-out, box-shadow 0.14s ease-out;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 32px rgba(56, 189, 248, 0.4);
  }
`;

export const GhostBtn = styled.button`
  min-width: 96px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: transparent;
  color: #e5e7eb;
  font-size: 11px;
  cursor: pointer;
  padding: 6px 10px;
  transition: all 0.14s ease-out;

  &:hover {
    background: rgba(15, 23, 42, 0.9);
    border-color: #38bdf8;
  }
`;
