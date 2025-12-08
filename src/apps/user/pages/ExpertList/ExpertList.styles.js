// src/pages/ExpertList/ExpertList.styles.js
import styled, { keyframes, css } from "styled-components";

/* ------------------------------------------
   PAGE WRAPPER
------------------------------------------- */
export const PageWrap = styled.div`
  max-width: 1280px;
  margin: 40px auto 70px;
  padding: 0 20px;

  @media (max-width: 768px) {
    margin: 30px auto 40px;
  }
`;

/* ------------------------------------------
   HEADER
------------------------------------------- */
export const HeaderWrap = styled.div`
  text-align: left;
  margin-bottom: 30px;

  @media (max-width: 600px) {
    text-align: center;
  }
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.3px;
`;

export const PageSubtitle = styled.p`
  opacity: 0.7;
  font-size: 14px;
  margin-top: 6px;
`;

/* ------------------------------------------
   MAIN LAYOUT (LEFT FILTERS + RIGHT EXPERT LIST)
------------------------------------------- */
export const Layout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 26px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

/* ------------------------------------------
   LEFT FILTER SIDEBAR (GLASS UI)
------------------------------------------- */
export const LeftSidebar = styled.aside`
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.45);
  border-radius: 20px;
  padding: 16px 18px 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.6);

  position: sticky;
  top: 90px;
  height: max-content;

  @media (max-width: 960px) {
    position: static;
    width: 100%;
  }
`;

export const FilterTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 14px;
  color: #e2e8f0;
`;

export const FiltersForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const FieldLabel = styled.label`
  font-size: 11px;
  letter-spacing: 0.07em;
  opacity: 0.8;
  color: #cbd5e1;
`;

export const Select = styled.select`
  padding: 9px 14px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.5);
  color: #f1f5f9;

  &:focus {
    border-color: #0ea5e9;
    outline: none;
    box-shadow: 0 0 0 1px rgba(14, 165, 233, 0.55);
  }
`;

export const SearchInput = styled.input`
  padding: 9px 14px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.5);

  color: #f8fafc;
  font-size: 13px;

  &::placeholder {
    color: rgba(148, 163, 184, 0.8);
  }

  &:focus {
    border-color: #0ea5e9;
    outline: none;
    box-shadow: 0 0 0 1px rgba(14, 165, 233, 0.55);
  }
`;

export const PillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
`;

export const PillButton = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.75);
  color: #e2e8f0;
  font-size: 11px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  transition: 0.18s ease;
  cursor: pointer;

  ${({ $active }) =>
    $active &&
    css`
      background: linear-gradient(135deg, #0ea5e9, #22c55e);
      border-color: #0ea5e9;
      color: #0f172a;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(14, 165, 233, 0.45);
    `}

  &:hover {
    opacity: 0.95;
  }
`;

/* ------------------------------------------
   RIGHT PANEL – EXPERT CARDS GRID (2 PER ROW)
------------------------------------------- */
export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;
`;

export const ExpertsGrid = styled.div`
  display: grid;
  gap: 20px;

  @media (min-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 899px) {
    grid-template-columns: 1fr;
  }
`;

export const ExpertCard = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  padding: 16px;
  border-radius: 20px;

  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.45);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.65);

  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: #0ea5e9;
    box-shadow: 0 22px 48px rgba(15, 23, 42, 0.85);
  }
`;

/* Avatar */
export const AvatarImg = styled.img`
  width: 74px;
  height: 74px;
  border-radius: 18px;
  object-fit: cover;

  border: 2px solid #0ea5e9;

  @media (max-width: 600px) {
    width: 65px;
    height: 65px;
  }
`;

export const ExpertBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ExpertName = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #f1f5f9;
`;

export const StatusPill = styled.div`
  width: fit-content;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;

  ${({ $online }) =>
    $online
      ? `
        background: rgba(22, 163, 74, 0.18);
        color: #22c55e;
    `
      : `
        background: rgba(100,116,139,0.25);
        color: #cbd5e1;
    `}
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  font-size: 11px;
  opacity: 0.85;
  color: #cbd5e1;
`;

export const Rating = styled.span`
  color: #facc15;
  font-weight: 600;
`;

export const PriceRow = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Price = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #22c55e;
`;

export const PerMinute = styled.span`
  font-size: 12px;
  opacity: 0.8;
`;

/* ------------------------------------------
   SUGGESTED EXPERTS HORIZONTAL STRIP
------------------------------------------- */
export const SuggestedSection = styled.section`
  margin-top: 24px;
`;

export const SuggestedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const SuggestedTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
`;

export const SuggestedCaption = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

export const SuggestedStrip = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 8px 4px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.75);
    border-radius: 999px;
  }
`;

export const SuggestedCard = styled.div`
  min-width: 180px;
  max-width: 200px;

  background: #5d637bff;
  border-radius: 18px;
  padding: 12px;

  border: 1px solid rgba(148, 163, 184, 0.45);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.75);

  cursor: pointer;
  transition: 0.18s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: #0ea5e9;
    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.88);
  }
`;

export const SuggestedName = styled.div`
  font-weight: 600;
  color: #e2e8f0;
  margin-top: 6px;
`;

export const SuggestedMeta = styled.div`
  font-size: 11px;
  opacity: 0.75;
`;
