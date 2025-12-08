// src/apps/user/components/userExperts/UserExperts.styles.js
import styled, { keyframes } from "styled-components";

/* ---------- helpers ---------- */

const glassBg = `
  background: radial-gradient(circle at top left, #2b4cff33, #050816 55%);
  backdrop-filter: blur(18px);
`;

const cardGlass = `
  background: linear-gradient(135deg, #111827ee, #020617f2);
  border: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow: 0 22px 45px rgba(15, 23, 42, 0.85);
`;

/* ---------- page layout ---------- */

export const PageWrap = styled.div`
  min-height: 100vh;
  padding: 88px 5vw 56px;
  ${glassBg};
  color: ${({ theme }) => theme?.colors?.textPrimary || "#e5e7eb"};
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 80px 14px 40px;
  }
`;

export const HeaderSection = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const Title = styled.h1`
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 700;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme?.colors?.accent || "#f97316"};
`;

export const SubTitle = styled.p`
  margin-top: 8px;
  max-width: 620px;
  font-size: 14px;
  opacity: 0.84;
`;

/* ---------- tabs ---------- */

export const TabsRow = styled.div`
  display: inline-flex;
  align-self: flex-start;
  padding: 4px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.75);
`;

export const TabButton = styled.button`
  border: none;
  outline: none;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.01em;
  color: ${({ $active }) => ($active ? "#0f172a" : "#e5e7ebd9")};
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, #38bdf8, #a855f7, #f97316)"
      : "transparent"};
  box-shadow: ${({ $active }) =>
    $active ? "0 10px 25px rgba(56,189,248,0.35)" : "none"};
  transition: all 0.18s ease-out;

  &:hover {
    transform: ${({ $active }) => ($active ? "translateY(-1px)" : "none")};
    background: ${({ $active }) =>
      $active
        ? "linear-gradient(135deg, #22d3ee, #a855f7, #fb923c)"
        : "rgba(15,23,42,0.9)"};
  }
`;

/* ---------- main 2-column layout ---------- */

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

/* ---------- filters ---------- */

export const FilterWrap = styled.aside`
  ${cardGlass};
  border-radius: 20px;
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 84px;

  @media (max-width: 1024px) {
    position: static;
    order: 2;
    padding: 14px 14px 12px;
  }
`;

export const FilterTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const FilterGroup = styled.div`
  margin-top: 6px;
  border-radius: 12px;
  padding: 10px 10px 8px;
  background: radial-gradient(circle at top left, #1e293b, #020617);
`;

export const FilterLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  opacity: 0.80;
  margin-bottom: 8px;
`;

export const FilterSelect = styled.select`
  width: 100%;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(15, 23, 42, 0.92);
  color: #e5e7eb;
  font-size: 13px;
  padding: 6px 12px;
  outline: none;

  &:focus {
    border-color: #38bdf8;
    box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.4);
  }
`;

export const FilterCheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 4px;
  cursor: pointer;
`;

export const FilterCheckbox = styled.input`
  accent-color: #38bdf8;
  width: 14px;
  height: 14px;
`;

export const FilterText = styled.span`
  opacity: 0.9;
`;

export const ResetFilterBtn = styled.button`
  margin-top: 6px;
  align-self: flex-start;
  border-radius: 999px;
  padding: 5px 14px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: transparent;
  color: #e5e7ebd9;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease-out;

  &:hover {
    background: rgba(15, 23, 42, 0.85);
    border-color: #38bdf8;
  }
`;

/* ---------- experts grid ---------- */

export const ExpertsWrap = styled.section`
  ${cardGlass};
  border-radius: 22px;
  padding: 18px 18px 20px;

  @media (max-width: 768px) {
    padding: 14px 10px 16px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const EmptyState = styled.div`
  padding: 26px 14px;
  text-align: center;
  font-size: 14px;
  opacity: 0.76;
`;

const shimmer = keyframes`
  0% { transform: translateX(-40%); }
  100% { transform: translateX(120%); }
`;

export const LoaderRow = styled.div`
  padding: 30px 12px;
  text-align: center;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  opacity: 0.9;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      transparent 0%,
      rgba(148, 163, 184, 0.2) 35%,
      transparent 70%
    );
    animation: ${shimmer} 1.4s infinite;
  }
`;
