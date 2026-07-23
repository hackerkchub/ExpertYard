import styled from "styled-components";

/* LinkedIn + Instagram Mix Layout */
export const Layout = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #f8fafc;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #111827;
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  
  @media (max-width: 1024px) {
    margin-left: 0;
    padding-top: 12px;
  }
`;

export const ContentInner = styled.div`
  padding: 20px 16px max(32px, calc(20px + env(safe-area-inset-bottom, 0px)));
  width: 100%;
  max-width: 1128px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 14px 12px max(24px, calc(16px + env(safe-area-inset-bottom, 0px)));
  }

  @media (max-width: 480px) {
    padding: 12px 10px max(20px, calc(12px + env(safe-area-inset-bottom, 0px)));
  }
`;

export const Welcome = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: #000080;
  margin-bottom: 20px;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 14px;
  }
`;

/* Stats Grid - Groww Material Card Style */
export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px 20px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 128, 0.08);
    border-color: rgba(0, 0, 128, 0.2);
  }
  
  span {
    font-size: 0.78rem;
    color: #64748b;
    font-weight: 600;
    display: block;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  h2 {
    margin: 0;
    font-size: 1.75rem;
    color: #000080;
    font-weight: 800;
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    h2 { font-size: 1.4rem; }
  }
`;

/* Queue Card Section - Clean LinkedIn Look */
export const QueueCardWrap = styled.div`
  background: #ffffff;
  border: 1px solid #d8e0eb;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
`;

export const QueueTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  border-bottom: 1px solid #dbdbdb;
  padding: 8px;
  background: #fff;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  button {
    background: none;
    border: none;
    padding: 12px 14px;
    font-size: 14px;
    font-weight: 600;
    color: #737373;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
    border-radius: 10px;
    min-height: 42px;
    white-space: nowrap;
    flex: 1 1 128px;

    &:hover {
      color: #000;
      background: #f8fafc;
    }

    &.active {
      color: #000000;
      background: #f3f4f6;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: #000000; /* Active tab underline black */
      }
    }

    &.highlighted {
      border: 2px solid #10b981 !important;
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
      animation: subtleGreenPulse 2s infinite ease-in-out;
      background: rgba(16, 185, 129, 0.08) !important;
      color: #047857 !important;
      font-weight: 700;
    }

    @keyframes subtleGreenPulse {
      0% {
        box-shadow: 0 0 4px rgba(16, 185, 129, 0.4);
        border-color: #10b981;
      }
      50% {
        box-shadow: 0 0 14px rgba(16, 185, 129, 0.75);
        border-color: #059669;
      }
      100% {
        box-shadow: 0 0 4px rgba(16, 185, 129, 0.4);
        border-color: #10b981;
      }
    }

    &.link-tab {
      color: #334155;
    }
  }

  @media (max-width: 768px) {
    display: none !important;
  }
`;

export const QueueItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #efefef;
  transition: background 0.2s;
  gap: 16px;

  &:hover { background: #fafafa; }
  &:last-child { border-bottom: none; }
  
  &.cancelled {
    background: #fafafa;
    opacity: 0.7;
    text-decoration: line-through;
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
    flex-direction: column; /* Stack on mobile screen widths <= 768px */
    align-items: stretch;
    gap: 12px;
  }

  .queue-item-actions {
    display: flex;
    gap: 8px;

    @media (max-width: 768px) {
      width: 100%;
      justify-content: stretch;
    }
  }
`;

/* Instagram Style Action Button */
export const ActionBtn = styled.button`
  background: #0095f6; /* Instagram Blue */
  border: none;
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1877f2;
  }

  &:active {
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    width: 100%; /* Expand to full width on mobile screens <= 768px */
    flex: 1;
    text-align: center;
  }
`;

/* RedDot */
export const RedDot = styled.span`
  width: 8px;
  height: 8px;
  background: #ff3b30;
  border-radius: 50%;
  display: inline-block;
  margin-left: 6px;
`;

/* Modern Status Badge */
export const StatusBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${props => props.status === 'pending' ? '#fff9e6' : '#f1f5f9'};
  color: ${props => props.status === 'pending' ? '#b45309' : '#475569'};
`;
