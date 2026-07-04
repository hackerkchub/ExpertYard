// src/apps/user/pages/CallChatExpert.styles.js - UPDATED WITH RESPONSIVE FIXES
import styled, { keyframes } from "styled-components";

const navy = "#000080";
const navyDark = "#02044a";
const yellow = "#FFC107";
const yellowLight = "#FFD23F";
const text = "#111827";
const muted = "#667085";
const border = "#e5e7eb";

const shimmer = keyframes`
  0% { transform: translateX(-45%); }
  100% { transform: translateX(120%); }
`;

export const PageWrap = styled.div`
  min-height: 100vh;
  width: 100%;
  max-width: 1320px;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 10px;
  color: ${text};
  background:
    radial-gradient(circle at 8% 0%, rgba(0, 0, 128, 0.09), transparent 28%),
    radial-gradient(circle at 92% 8%, rgba(255, 210, 63, 0.18), transparent 24%),
    linear-gradient(180deg, #f7f8fc 0%, #f8fafc 48%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  gap: 18px;
  scroll-behavior: smooth;
  overflow-x: hidden;

  @media (min-width: 1024px) {
    max-width: none;
    margin: 0;
    padding: 28px;
    background:
      radial-gradient(circle at 8% 0%, rgba(0, 0, 128, 0.08), transparent 30%),
      radial-gradient(circle at 92% 8%, rgba(255, 213, 74, 0.14), transparent 28%),
      #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  .trust-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    margin-top: 18px;
  }

  .trust-badges span,
  .mode-indicator {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 34px;
    padding: 7px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 900;
    white-space: nowrap;
  }

  .trust-badges span {
    color: rgba(255, 255, 255, 0.94);
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.18);
  }

  .mobile-category-strip,
  .mobile-expert-list {
    display: none;
  }

  .mobile-category-strip {
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    padding: 2px 0 4px;
  }

  .mobile-category-strip::-webkit-scrollbar {
    display: none;
  }

  .mobile-category-strip button {
    flex: 0 0 auto;
    min-height: 36px;
    max-width: 156px;
    border: 1px solid rgba(0, 0, 128, 0.1);
    border-radius: 999px;
    background: #ffffff;
    color: #64748b;
    padding: 0 13px;
    font-size: 12px;
    line-height: 1.2;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-shadow: none;
  }

  .mobile-category-strip button.active {
    background: rgba(0, 0, 128, 0.08);
    color: ${navy};
    border-color: rgba(0, 0, 128, 0.18);
    font-weight: 700;
    box-shadow: none;
  }

  .mobile-category-strip button:active {
    transform: scale(0.98);
  }

  .mobile-category-strip button.active:first-child {
    background: linear-gradient(135deg, ${navy}, #2563eb);
    color: #ffffff;
  }

  .mobile-callchat-card {
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
    padding: 12px;
    overflow: hidden;
  }

  .mobile-callchat-card__main {
    width: 100%;
    border: 0;
    padding: 0;
    background: transparent;
    display: flex;
    gap: 10px;
    text-align: left;
    cursor: pointer;
  }

  .mobile-callchat-card__avatar {
    position: relative;
    width: 64px;
    height: 64px;
    flex: 0 0 64px;
    border-radius: 16px;
    overflow: hidden;
    background: #eef2ff;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 128, 0.08);
  }

  .mobile-callchat-card__avatar img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .mobile-callchat-card__avatar i {
    position: absolute;
    right: 6px;
    bottom: 6px;
    width: 11px;
    height: 11px;
    border-radius: 999px;
    border: 2px solid #ffffff;
    background: #94a3b8;
  }

  .mobile-callchat-card__avatar i.online {
    background: #22c55e;
  }

  .mobile-callchat-card__info {
    min-width: 0;
    flex: 1;
    display: grid;
    gap: 4px;
  }

  .mobile-callchat-card__name-row {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mobile-callchat-card__name-row strong {
    min-width: 0;
    color: #111827;
    font-size: 15.5px;
    line-height: 1.25;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mobile-callchat-card__name-row em {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #eef2ff;
    color: ${navy};
    font-style: normal;
  }

  .mobile-callchat-card__info small {
    color: #64748b;
    font-size: 12px;
    line-height: 1.35;
    font-weight: 500;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .mobile-callchat-card__line {
    min-width: 0;
    color: #64748b;
    font-size: 11px;
    line-height: 1.35;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mobile-callchat-card__line svg {
    flex: 0 0 auto;
    color: ${navy};
  }

  .mobile-callchat-card__meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 9px;
    color: #64748b;
    font-size: 11px;
    line-height: 1.35;
    font-weight: 500;
  }

  .mobile-callchat-card__rating {
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }

  .mobile-callchat-card__rating svg {
    width: 13px;
    height: 13px;
    color: #d0d5dd;
  }

  .mobile-callchat-card__rating svg.filled {
    color: #f59e0b;
    fill: currentColor;
  }

  .mobile-callchat-card__rating b {
    color: #111827;
    margin-left: 3px;
  }

  .mobile-callchat-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #eef2f7;
  }

  .mobile-callchat-card__price {
    min-width: 0;
    display: flex;
    align-items: baseline;
    gap: 7px;
    flex-wrap: wrap;
  }

  .mobile-callchat-card__price strong {
    color: ${navy};
    font-size: 15px;
    line-height: 1.15;
    font-weight: 700;
  }

  .mobile-callchat-card__price del {
    color: #98a2b3;
    font-size: 12px;
    font-weight: 500;
  }

  .mobile-callchat-card__cta {
    min-width: 92px;
    min-height: 40px;
    border: 0;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    background: linear-gradient(135deg, ${navy}, #2563eb);
    color: #ffffff;
    font-size: 13px;
    line-height: 1;
    font-weight: 700;
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.22);
  }

  .mobile-filter-actions {
    position: sticky;
    bottom: 0;
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: 10px;
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
    border-top: 1px solid #eef2f7;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 -12px 24px rgba(15, 23, 42, 0.08);
  }

  .mobile-filter-actions button {
    min-width: 0;
    min-height: 44px;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 950;
    cursor: pointer;
  }

  .mobile-filter-actions .clear {
    border: 1px solid rgba(0, 0, 128, 0.16);
    background: #ffffff;
    color: ${navy};
  }

  .mobile-filter-actions .apply {
    border: 0;
    background: linear-gradient(135deg, ${navy}, #20209c);
    color: #ffffff;
    box-shadow: 0 12px 24px rgba(0, 0, 128, 0.2);
  }

  .mobile-filter-grabber,
  .mobile-filter-header,
  .mobile-filter-body {
    display: none;
  }

  .mode-indicator {
    color: ${navy};
    background: linear-gradient(135deg, ${yellowLight}, ${yellow});
    box-shadow: 0 16px 28px rgba(255, 193, 7, 0.24);
  }

  @media (max-width: 768px) {
    max-width: 100%;
    min-height: auto;
    gap: 10px;
    padding: 8px 12px calc(84px + env(safe-area-inset-bottom, 0px));
    background: #f8fafc;

    .trust-badges {
      flex-wrap: wrap;
      overflow: visible;
      padding-bottom: 0;
    }

    .mobile-category-strip {
      display: flex;
      margin: -2px 0 0;
      padding: 0 0 2px;
    }

    .experts-result-count {
      margin: 0 2px 10px !important;
      font-size: 12px !important;
      line-height: 1.35;
      font-weight: 600;
      color: #64748b !important;
    }

    .mobile-expert-list {
      display: grid;
      gap: 10px;
    }

    .mobile-filter-actions {
      padding: 10px 14px calc(10px + env(safe-area-inset-bottom, 0px));
      border-top: 1px solid rgba(15, 23, 42, 0.08);
      background: rgba(255, 255, 255, 0.98);
      box-shadow: 0 -12px 28px rgba(15, 23, 42, 0.1);
    }

    .mobile-filter-actions button {
      min-height: 46px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 850;
    }

    .mobile-filter-actions .clear {
      background: #f8fafc;
      border-color: rgba(0, 0, 128, 0.14);
    }

    .mobile-filter-actions .apply {
      background: linear-gradient(135deg, ${navy}, #2563eb);
      box-shadow: 0 12px 22px rgba(37, 99, 235, 0.22);
    }
  }

  @media (max-width: 430px) {
    padding-left: 12px;
    padding-right: 12px;
  }

  @media (max-width: 340px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

export const HeaderSection = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  padding: 30px;
  border-radius: 26px;
  color: #ffffff;
  background:
    radial-gradient(circle at 12% 0%, rgba(255, 255, 255, 0.18), transparent 28%),
    radial-gradient(circle at 88% 18%, rgba(255, 210, 63, 0.25), transparent 24%),
    linear-gradient(135deg, ${navy} 0%, #03045e 56%, #020329 100%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 24px 58px rgba(0, 0, 128, 0.2);

  @media (min-width: 1024px) {
    color: #ffffff !important;

    :where(h1, p, small, strong, svg) {
      color: inherit !important;
    }
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
    border-radius: 22px;
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
  }

  @media (max-width: 430px) {
    padding: 18px 14px;
    border-radius: 20px;
  }
`;

export const Title = styled.h1`
  margin: 0;
  max-width: 840px;
  font-size: clamp(28px, 5vw, 56px);
  font-weight: 950;
  line-height: 1.05;
  letter-spacing: 0;
  color: #ffffff;
  overflow-wrap: anywhere;

  @media (max-width: 768px) {
    line-height: 1.1;
  }

  @media (max-width: 430px) {
    font-size: clamp(25px, 8vw, 31px);
  }
`;

export const SubTitle = styled.p`
  margin: 11px 0 0;
  max-width: 720px;
  font-size: 15px;
  line-height: 1.6;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.86);

  @media (max-width: 768px) {
    max-width: 58ch;
    margin-top: 8px;
    font-size: 14px;
    line-height: 1.5;
  }

  @media (max-width: 430px) {
    font-size: 13px;
    line-height: 1.45;
  }
`;

export const TabsRow = styled.div`
  display: inline-flex;
  align-self: flex-start;
  gap: 6px;
  padding: 6px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid ${border};
  box-shadow: 0 12px 28px rgba(16, 24, 40, 0.08);

  @media (max-width: 768px) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    position: sticky;
    top: 0;
    z-index: 8;
    padding: 4px;
    border-radius: 16px;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
  }
`;

export const TabButton = styled.button`
  border: none;
  outline: none;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  color: ${({ $active }) => ($active ? navy : "#344054")};
  background: ${({ $active }) =>
    $active ? `linear-gradient(135deg, ${yellowLight}, ${yellow})` : "transparent"};
  box-shadow: ${({ $active }) =>
    $active ? "0 10px 22px rgba(255, 193, 7, 0.24)" : "none"};
  transition: transform 180ms ease, background 180ms ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ $active }) => ($active ? `linear-gradient(135deg, ${yellowLight}, ${yellow})` : "#eef2ff")};
  }

  @media (max-width: 768px) {
    width: 100%;
    min-height: 40px;
    padding: 9px 10px;
    font-size: 13px;
    font-weight: 700;

    span {
      display: none;
    }
  }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 292px minmax(0, 1fr);
  gap: 18px;
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(260px, 292px) minmax(0, 1fr);
    gap: 22px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }
`;

export const FilterWrap = styled.aside`
  position: sticky;
  top: 84px;
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(0, 0, 128, 0.08);
  box-shadow: 0 16px 36px rgba(16, 24, 40, 0.08);

  @media (min-width: 1024px) {
    border-color: ${border};
    border-radius: 18px;
    box-shadow: 0 16px 42px rgba(15, 23, 42, 0.075);
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid ${border};
`;

export const FilterTitle = styled.h3`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 16px;
  font-weight: 950;
  color: ${navy};
`;

export const FilterCount = styled.span`
  background: #eef2ff;
  color: ${navy};
  font-size: 12px;
  padding: 4px 9px;
  border-radius: 999px;
  font-weight: 900;
`;

export const FilterGroup = styled.div`
  border-radius: 18px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #eef2f7;

  @media (max-width: 768px) {
    padding: 11px;
    border-radius: 14px;
    background: #ffffff;
    border-color: rgba(0, 0, 0, 0.08);
  }
`;

export const FilterLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${navy};
  margin-bottom: 8px;
  font-weight: 900;

  @media (max-width: 768px) {
    margin-bottom: 7px;
    color: #64748b;
    font-size: 11px;
    line-height: 1.3;
    letter-spacing: 0.04em;
    font-weight: 700;
  }
`;

export const FilterSelect = styled.select`
  width: 100%;
  border-radius: 14px;
  border: 1px solid #d0d5dd;
  background: #ffffff;
  color: ${text};
  font-size: 13px;
  font-weight: 700;
  padding: 10px 12px;
  outline: none;

  &:focus {
    border-color: ${navy};
    box-shadow: 0 0 0 4px rgba(0, 0, 128, 0.08);
  }

  &:disabled {
    cursor: not-allowed;
    color: #667085;
    background: #f1f5f9;
  }

  @media (max-width: 768px) {
    min-height: 44px;
    border-radius: 12px;
    color: #111827;
    font-size: 13px;
    line-height: 1.4;
    font-weight: 500;
    padding: 10px 12px;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 38px 12px 38px;
  border: 1px solid #d0d5dd;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 700;
  box-sizing: border-box;
  transition: border-color 180ms ease, box-shadow 180ms ease;

  &:focus {
    outline: none;
    border-color: ${navy};
    box-shadow: 0 0 0 4px rgba(0, 0, 128, 0.08);
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: ${navy};
`;

export const ClearSearchBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: #f2f4f7;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  color: #667085;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #dc2626;
  }
`;

export const FilterCheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #344054;
  margin-bottom: 6px;
  cursor: pointer;
`;

export const FilterCheckbox = styled.input`
  accent-color: ${navy};
  width: 14px;
  height: 14px;
`;

export const FilterText = styled.span``;

export const ResetFilterBtn = styled.button`
  margin-top: 4px;
  align-self: flex-start;
  border-radius: 999px;
  padding: 9px 16px;
  border: 1px solid rgba(0, 0, 128, 0.18);
  background: #ffffff;
  color: ${navy};
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 180ms ease, background 180ms ease;

  &:hover {
    transform: translateY(-1px);
    background: #eef2ff;
  }
`;

export const ExpertsWrap = styled.section`
  min-width: 0;
  border-radius: 22px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(0, 0, 128, 0.08);
  box-shadow: 0 16px 36px rgba(16, 24, 40, 0.08);

  @media (min-width: 1024px) {
    border-color: ${border};
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 16px 42px rgba(15, 23, 42, 0.075);
  }

  @media (max-width: 768px) {
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  @media (max-width: 430px) {
    padding: 0;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  align-items: stretch;
  gap: 18px;

  @media (min-width: 1280px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  > div {
    min-width: 0;
    height: 100%;
    display: flex;
  }

  > div > div {
    width: 100%;
    min-width: 0;
    height: 100%;
  }

  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  @media (max-width: 640px) {
    display: none;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const EmptyState = styled.div`
  padding: 44px 14px;
  text-align: center;
  font-size: 15px;
  color: ${muted};
  border: 1px dashed #d0d5dd;
  border-radius: 20px;
  background: #f8fafc;
`;

export const LoaderRow = styled.div`
  padding: 0;
  text-align: center;
  font-size: 14px;
  color: #344054;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: transparent;

  &::after {
    display: none;
  }
`;

export const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 14px;
  }
`;

export const SkeletonCard = styled.div`
  min-height: 360px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 128, 0.08);
  background:
    linear-gradient(90deg, transparent, rgba(255,255,255,0.72), transparent),
    linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  background-size: 180% 100%, 100% 100%;
  box-shadow: 0 14px 30px rgba(16, 24, 40, 0.08);
  animation: ${shimmer} 1.35s infinite;

  @media (max-width: 640px) {
    min-height: 326px;
  }
`;

export const PaginationWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    width: 100%;
    gap: 8px;
    margin: 16px 0 10px;
    padding: 12px;
    border: 1px solid rgba(0, 0, 128, 0.08);
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
  }
`;

export const PageButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 999px;
  border: none;
  background: ${navy};
  color: white;
  font-weight: 900;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    flex: 1;
    min-height: 40px;
    justify-content: center;
    padding: 8px 10px;
    font-size: 12px;
    border-radius: 14px;
  }
`;

export const PageInfo = styled.div`
  font-size: 14px;
  color: ${muted};
  display: flex;
  align-items: center;
  font-weight: 800;

  @media (max-width: 640px) {
    flex: 0 0 100%;
    justify-content: center;
    order: -1;
    color: ${navy};
    font-size: 12px;
  }
`;

export const StatsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  overflow-x: auto;
  white-space: nowrap;

  @media (max-width: 640px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const StatItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  color: ${navy};
  background: #ffffff;
  border: 1px solid rgba(0, 0, 128, 0.1);
  box-shadow: 0 8px 18px rgba(16, 24, 40, 0.05);
  flex-shrink: 0;

  svg {
    color: ${yellow};
  }

  span {
    font-weight: 900;
  }
`;

export const SearchBar = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

export const MobileFilterToggle = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  padding: 11px 18px;
  background: ${navy};
  color: #ffffff;
  border: none;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  margin-bottom: 14px;
  position: relative;
  box-shadow: 0 12px 24px rgba(0, 0, 128, 0.16);

  .badge {
    background: ${yellow};
    color: ${navy};
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 999px;
    margin-left: 2px;
  }

  @media (max-width: 1024px) {
    display: flex;
  }

  @media (max-width: 640px) {
    width: max-content;
    min-height: 40px;
    margin: -2px 0 8px;
    padding: 0 14px;
    border-radius: 999px;
    background: #ffffff;
    color: ${navy};
    border: 1px solid rgba(0, 0, 128, 0.12);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
    font-size: 13px;
    line-height: 1.2;
    font-weight: 800;

    .badge {
      min-width: 20px;
      min-height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #000080;
      color: #ffffff;
      padding: 0 6px;
      font-size: 11px;
    }
  }
`;

export const MobileFilterDrawer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 100%;
  max-height: min(82vh, 680px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  background: #ffffff;
  border-radius: 24px 24px 0 0;
  z-index: 10030;
  overflow: hidden;
  box-shadow: 0 -22px 54px rgba(15, 23, 42, 0.22);

  @media (max-width: 768px) {
    width: 100%;
    height: min(90dvh, 720px);
    max-height: calc(100dvh - 12px);
    border-radius: 24px 24px 0 0;

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    select,
    button,
    input {
      max-width: 100%;
    }

    .mobile-filter-grabber {
      display: block;
      width: 44px;
      height: 5px;
      margin: 9px auto 8px;
      border-radius: 999px;
      background: #cbd5e1;
    }

    .mobile-filter-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      align-items: center;
      gap: 8px;
      padding: 0 14px 12px;
      border-bottom: 1px solid rgba(15, 23, 42, 0.08);
      background: #ffffff;
    }

    .mobile-filter-header h3 {
      margin: 0;
      color: ${text};
      font-size: 18px;
      line-height: 1.2;
      font-weight: 850;
    }

    .mobile-filter-header span {
      display: block;
      margin-top: 2px;
      color: #64748b;
      font-size: 12px;
      line-height: 1.2;
      font-weight: 600;
    }

    .mobile-filter-clear-top,
    .mobile-filter-close {
      border: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .mobile-filter-clear-top {
      min-height: 36px;
      padding: 0 11px;
      border-radius: 999px;
      background: #eef2ff;
      color: ${navy};
      font-size: 12px;
      font-weight: 850;
    }

    .mobile-filter-close {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      background: #f3f4f6;
      color: #111827;
    }

    .mobile-filter-body {
      display: grid;
      gap: 10px;
      overflow-y: auto;
      min-height: 0;
      overscroll-behavior: contain;
      padding: 12px 14px 18px;
      -webkit-overflow-scrolling: touch;
      background: #f8fafc;
    }

    .mobile-filter-body > * {
      min-width: 0;
    }

    .mobile-filter-body ${FilterHeader} {
      display: none;
    }

    .mobile-filter-body ${ResetFilterBtn} {
      display: none;
    }

    .mobile-filter-actions {
      position: relative;
      bottom: auto;
      z-index: 2;
      flex: 0 0 auto;
      padding: 12px 14px calc(12px + env(safe-area-inset-bottom, 0px));
      background: #ffffff;
      border-top: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 -10px 24px rgba(15, 23, 42, 0.08);
    }

    .mobile-filter-actions button {
      min-height: 50px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.1;
      font-weight: 850;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }

    ${FilterGroup} {
      padding: 0;
      overflow: hidden;
      min-height: 88px;
      border-radius: 14px;
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
    }

    ${FilterLabel} {
      min-height: 36px;
      display: flex;
      align-items: center;
      margin: 0;
      padding: 8px 12px;
      border-bottom: 1px solid rgba(15, 23, 42, 0.06);
      color: #111827;
      font-size: 12px;
      line-height: 1.25;
      letter-spacing: 0;
      text-transform: none;
      font-weight: 850;
      background: #ffffff;
      overflow-wrap: anywhere;
    }

    ${FilterGroup} .g9-mobile-select__trigger,
    ${FilterGroup} ${SearchInput} {
      min-height: 52px;
      border: 0;
      border-radius: 0;
      background: #ffffff;
      box-shadow: none;
      font-size: 14px;
      line-height: 1.35;
      font-weight: 650;
    }

    ${FilterGroup} .g9-mobile-select__trigger {
      padding: 0 12px;
    }

    ${FilterGroup} .g9-mobile-select__trigger span {
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    ${SearchBar} {
      margin: 0;
    }

    ${FilterGroup} ${SearchInput} {
      height: 52px;
      padding: 0 40px 0 38px;
    }

    ${SearchIcon} {
      left: 12px;
      color: ${navy};
    }

    ${ClearSearchBtn} {
      right: 10px;
      width: 28px;
      height: 28px;
      padding: 0;
    }
  }

  @media (max-width: 360px) {
    .mobile-filter-header {
      grid-template-columns: minmax(0, 1fr) auto;
      row-gap: 6px;
    }

    .mobile-filter-clear-top {
      grid-column: 1 / -1;
      justify-self: start;
      min-height: 32px;
    }

    .mobile-filter-body {
      padding-left: 12px;
      padding-right: 12px;
    }

    .mobile-filter-actions {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 8px;
      padding-left: 12px;
      padding-right: 12px;
    }
  }

  @media (min-width: 769px) {
    top: 0;
    right: 0;
    left: auto;
    bottom: auto;
    width: 88%;
    max-width: 390px;
    height: 100vh;
    max-height: none;
    border-radius: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    box-shadow: -12px 0 32px rgba(15, 23, 42, 0.18);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.52);
  z-index: 10029;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
`;

export const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 9px;

  @media (max-width: 768px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    margin: -2px -12px 0;
    padding: 0 12px 1px;
    gap: 7px;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const ActiveFilterChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 128, 0.12);
  border-radius: 999px;
  font-size: 12px;
  color: ${navy};
  font-weight: 900;
  cursor: pointer;
  transition: all 180ms ease;

  &:hover {
    background: #fee2e2;
    border-color: #ef4444;
    color: #ef4444;
  }

  @media (max-width: 768px) {
    flex: 0 0 auto;
    max-width: min(72vw, 240px);
    min-height: 32px;
    padding: 6px 10px;
    overflow: hidden;
    color: #000080;
    background: #ffffff;
    border-color: rgba(0, 0, 128, 0.12);
    box-shadow: 0 6px 14px rgba(15, 23, 42, 0.04);
    font-size: 11.5px;
    line-height: 1.2;
    font-weight: 750;
    text-overflow: ellipsis;
    white-space: nowrap;

    svg {
      width: 13px;
      height: 13px;
      flex: 0 0 auto;
      padding: 1px;
      border-radius: 999px;
      background: rgba(0, 0, 128, 0.08);
    }
  }
`;

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
  background: #f8fafc;
  border: 1px dashed rgba(0, 0, 128, 0.25);
`;

export const AIIcon = styled.div`font-size: 42px;`;
export const AITitle = styled.h3`font-size: 18px; font-weight: 900; color: ${navy};`;
export const AIDesc = styled.p`max-width: 460px; font-size: 14px; color: ${muted}; line-height: 1.5;`;
export const AIHint = styled.div`margin-top: 6px; font-size: 12px; font-weight: 900; color: ${navy};`;
