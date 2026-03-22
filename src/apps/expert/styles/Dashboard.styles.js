import styled from "styled-components";

/* LinkedIn + Instagram Mix Layout */
export const Layout = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #f3f2ef; /* LinkedIn Soft Background */
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 70px; /* Topbar height */
  min-width: 0;
  
  /* Desktop Sidebar Space */
  margin-left: 244px; 

  @media (max-width: 1024px) {
    margin-left: 0; /* Mobile par sidebar hide hota hai */
    padding-top: 64px;
  }
`;

export const ContentInner = styled.div`
  padding: 24px;
  width: 100%;
  max-width: 1128px; /* LinkedIn standard width */
  margin: 0 auto; /* ✅ Center Align Desktop Content */

  @media (max-width: 768px) {
    padding: 16px 12px; /* Mobile par clean padding */
  }
`;

export const Welcome = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 24px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 16px;
  }
`;

/* Stats Grid - Instagram Insight Style */
export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Desktop: 4 Columns */
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 Columns */
  }

  @media (max-width: 480px) {
    gap: 8px; /* Mobile par kam space */
  }
`;

export const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #dbdbdb; /* Instagram-ish border */
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  
  span {
    font-size: 13px;
    color: #737373; /* Instagram Grey */
    font-weight: 500;
    display: block;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  h2 {
    margin: 0;
    font-size: 28px;
    color: #000000;
    font-weight: 700;
  }

  @media (max-width: 480px) {
    padding: 16px;
    h2 { font-size: 22px; }
  }
`;

/* Queue Card Section - Clean LinkedIn Look */
export const QueueCardWrap = styled.div`
  background: #ffffff;
  border: 1px solid #dbdbdb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
`;

export const QueueTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #dbdbdb;
  padding: 0 8px;
  background: #fff;

  button {
    background: none;
    border: none;
    padding: 16px 20px;
    font-size: 14px;
    font-weight: 600;
    color: #737373;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;

    &:hover { color: #000; }

    &.active {
      color: #000000;
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
  }
`;

export const QueueItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #efefef;
  transition: background 0.2s;

  &:hover { background: #fafafa; }
  &:last-child { border-bottom: none; }
  
  &.cancelled {
    background: #fafafa;
    opacity: 0.7;
    text-decoration: line-through;
  }

  @media (max-width: 480px) {
    padding: 12px;
    flex-direction: column; /* Mobile par stack ho jayega */
    align-items: flex-start;
    gap: 10px;
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

  @media (max-width: 480px) {
    width: 100%; /* Mobile par full width */
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