import styled, { keyframes } from "styled-components";

/* ---------- helpers ---------- */

const glassBg = `
  background:
    radial-gradient(circle at top left, rgba(99,102,241,0.12), transparent 40%),
    radial-gradient(circle at bottom right, rgba(56,189,248,0.12), transparent 40%),
    linear-gradient(180deg, #f8fafc, #eef2ff);
`;

const cardGlass = `
  background: rgba(240, 230, 230, 0.75);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow:
    0 10px 30px rgba(88, 113, 171, 0.08),
    inset 0 1px 0 rgba(255,255,255,0.6);
`;

/* ---------- page layout ---------- */

export const PageWrap = styled.div`
  min-height: 100vh;
  padding: 88px 5vw 56px;
  ${glassBg};
  color: #020617;

  display: flex;
  flex-direction: column;
  gap: 28px;

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
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #1e293b;
`;

export const SubTitle = styled.p`
  margin-top: 10px;
  max-width: 640px;
  font-size: 14px;
  color: #475569;
`;

/* ---------- tabs ---------- */

export const TabsRow = styled.div`
  display: inline-flex;
  align-self: flex-start;
  padding: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
`;

export const TabButton = styled.button`
  border: none;
  outline: none;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  color: ${({ $active }) => ($active ? "#ffffff" : "#334155")};
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, #2563eb, #4f46e5)"
      : "transparent"};

  box-shadow: ${({ $active }) =>
    $active ? "0 8px 20px rgba(37,99,235,0.35)" : "none"};

  transition: all 0.18s ease;

  &:hover {
    background: ${({ $active }) =>
      $active
        ? "linear-gradient(135deg, #1d4ed8, #4338ca)"
        : "rgba(226,232,240,0.6)"};
  }
`;

/* ---------- main layout ---------- */

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

/* ---------- filters ---------- */

export const FilterWrap = styled.aside`
  ${cardGlass};
  border-radius: 24px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 84px;

  @media (max-width: 1024px) {
    position: static;
    order: 2;
  }
`;

export const FilterTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #020617;
`;

export const FilterGroup = styled.div`
  border-radius: 14px;
  padding: 12px;
  background: rgba(241, 245, 249, 0.9);
`;

export const FilterLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #475569;
  margin-bottom: 8px;
`;

export const FilterSelect = styled.select`
  width: 100%;
  border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.9);
  background: #ffffff;
  color: #020617;
  font-size: 13px;
  padding: 7px 14px;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  }
`;

export const FilterCheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #334155;
  margin-bottom: 6px;
  cursor: pointer;
`;

export const FilterCheckbox = styled.input`
  accent-color: #2563eb;
  width: 14px;
  height: 14px;
`;

export const FilterText = styled.span``;

export const ResetFilterBtn = styled.button`
  margin-top: 8px;
  align-self: flex-start;
  border-radius: 999px;
  padding: 6px 16px;
  border: 1px solid rgba(203, 213, 225, 0.9);
  background: #ffffff;
  color: #334155;
  font-size: 12px;
  cursor: pointer;

  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #2563eb;
    color: #1d4ed8;
  }
`;

/* ---------- experts grid ---------- */

export const ExpertsWrap = styled.section`
  ${cardGlass};
  border-radius: 24px;
  padding: 20px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const EmptyState = styled.div`
  padding: 28px 14px;
  text-align: center;
  font-size: 14px;
  color: #64748b;
`;

/* ---------- loader ---------- */

const shimmer = keyframes`
  0% { transform: translateX(-40%); }
  100% { transform: translateX(120%); }
`;

export const LoaderRow = styled.div`
  padding: 32px 12px;
  text-align: center;
  font-size: 14px;
  color: #334155;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(203,213,225,0.5),
      transparent
    );
    animation: ${shimmer} 1.4s infinite;
  }
`;

/* ---------- AI coming soon ---------- */

export const AIComingSoon = styled.div`
  min-height: 280px;
  border-radius: 22px;
  padding: 32px 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  text-align: center;

  background: linear-gradient(
    135deg,
    rgba(56,189,248,0.12),
    rgba(168,85,247,0.12),
    rgba(249,115,22,0.12)
  );

  border: 1px dashed rgba(99,102,241,0.45);

  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.4),
    0 20px 45px rgba(15,23,42,0.15);
`;

export const AIIcon = styled.div`
  font-size: 42px;
`;

export const AITitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #020617;
`;

export const AIDesc = styled.p`
  max-width: 460px;
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
`;

export const AIHint = styled.div`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #4338ca;
`;

export const PaginationWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

export const PageButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: #10b981;
  color: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PageInfo = styled.div`
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
`;

// Add these to your CallChatExpert.styles.js file

export const StatsBar = styled.div`
  display: flex;
  gap: 24px;
  padding: 16px 0;
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
  
  @media (max-width: 768px) {
    gap: 16px;
    flex-wrap: wrap;
  }
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #475569;
  
  svg {
    color: #3b82f6;
  }
  
  span {
    font-weight: 500;
  }
`;

export const SearchBar = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

export const ClearSearchBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #ef4444;
  }
`;

export const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
`;

export const FilterCount = styled.span`
  background: #3b82f6;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 600;
`;

export const MobileFilterToggle = styled.button`
  display: none;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 20px;
  position: relative;
  
  .badge {
    background: #3b82f6;
    color: white;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 20px;
    margin-left: 4px;
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

export const MobileFilterDrawer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 85%;
  max-width: 380px;
  height: 100vh;
  background: white;
  z-index: 1001;
  overflow-y: auto;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

export const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding: 12px 0;
`;

export const ActiveFilterChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 30px;
  font-size: 12px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #fee2e2;
    border-color: #ef4444;
    color: #ef4444;
  }
  
  svg {
    margin-left: 4px;
  }
`;