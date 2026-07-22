import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const PremiumContainer = styled.div`
  min-height: 100dvh;
  width: 100%;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #111827;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export const StickyHeaderBar = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  min-height: calc(56px + env(safe-area-inset-top, 0px));
  padding-top: max(8px, env(safe-area-inset-top, 0px));
  padding-bottom: 8px;
  padding-left: 14px;
  padding-right: 14px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 90;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;

  .header-back-btn {
    background: none;
    border: none;
    color: #000080;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.15s;

    &:hover {
      background: #eef2ff;
    }
  }

  .header-page-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #000080;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const PageContainer = styled.div`
  width: 100%;
  max-width: 1128px;
  margin: 0 auto;
  padding: 20px 16px max(32px, calc(20px + env(safe-area-inset-bottom, 0px)));
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 14px 12px max(24px, calc(16px + env(safe-area-inset-bottom, 0px)));
  }

  @media (max-width: 480px) {
    padding: 12px 10px max(20px, calc(12px + env(safe-area-inset-bottom, 0px)));
  }
`;

export const Header = styled.div`
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 14px;
  }
`;

export const Title = styled.h1`
  font-size: 1.65rem;
  font-weight: 700;
  color: #000080;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 1.35rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const ResponsiveGrid = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 16px;

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 14px 0 16px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 480px) {
    gap: 6px;
    margin: 10px 0 12px;
  }
`;

export const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: ${(props) => (props.active ? "#000080" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#475569")};
  border: 1px solid ${(props) => (props.active ? "#000080" : "#e2e8f0")};
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: #000080;
    color: #ffffff;
    border-color: #000080;
  }

  @media (max-width: 480px) {
    padding: 6px 14px;
    font-size: 0.82rem;
    flex: 1;
    justify-content: center;
  }
`;

export const MobileSummaryToggle = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 16px;
  background: #ffffff;
  border: 1px solid #000080;
  border-radius: 20px;
  color: #000080;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-bottom: 12px;

  @media (max-width: 992px) {
    display: flex;
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const StatCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: #eef2ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    color: #000080;
    flex-shrink: 0;
  }

  .stat-value {
    font-size: 1.2rem;
    font-weight: 700;
    color: #000080;
    display: block;
  }

  .stat-label {
    font-size: 0.76rem;
    color: #64748b;
    font-weight: 500;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    .stat-icon {
      width: 34px;
      height: 34px;
      font-size: 1rem;
    }
    .stat-value {
      font-size: 1rem;
    }
    .stat-label {
      font-size: 0.74rem;
    }
  }
`;

export const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

export const SearchBar = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 0 14px;
  height: 44px;

  &:focus-within {
    border-color: #000080;
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    padding: 8px;
    font-size: 0.9rem;
    color: #111827;
    &::placeholder {
      color: #94a3b8;
    }
  }
`;

export const PillBadge = styled.button`
  padding: 6px 16px;
  border-radius: 18px;
  border: 1px solid ${(props) => (props.active ? "#000080" : "#e2e8f0")};
  background: ${(props) => (props.active ? "#000080" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#475569")};
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: #000080;
    color: #ffffff;
    border-color: #000080;
  }
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
  width: 100%;
`;

export const HistoryItem = styled.div`
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  animation: ${fadeIn} 0.2s ease-out;

  .expanded-content {
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    padding: 16px 20px;
    @media (max-width: 480px) {
      padding: 12px;
    }
  }
`;

export const ChatHeader = styled.div`
  padding: 14px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: #ffffff;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #000080 !important;
    color: #ffffff !important;

    h4, span, div, p, svg, .meta-item, .last-activity {
      color: #ffffff !important;
    }

    .earnings-badge, .status-badge, .pricing-badge {
      background: rgba(255, 255, 255, 0.2) !important;
      color: #ffffff !important;
    }
  }

  @media (max-width: 480px) {
    padding: 12px 10px;
  }

  .chat-header-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .user-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;

    h4 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .user-stats {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }

  .meta-item {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;

    .last-activity {
      text-align: right;
      font-size: 0.78rem;
      color: #64748b;
      font-weight: 500;
    }
  }
`;

export const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #eef2ff;
  overflow: hidden;
  border: 1.5px solid #000080;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  @media (max-width: 480px) {
    width: 42px;
    height: 42px;
  }
`;

export const EarningsBadge = styled.span`
  background: #eef2ff;
  color: #000080;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.76rem;
  font-weight: 700;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const PricingBadge = styled.span`
  background: #eef2ff;
  color: #000080;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  h5 {
    font-size: 0.88rem;
    font-weight: 600;
    margin: 0;
    color: #111827;
  }
`;

export const SessionsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SessionCard = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 14px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  gap: 12px;

  .session-number {
    width: 28px;
    height: 28px;
    background: #eef2ff;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000080;
    flex-shrink: 0;
  }

  .session-info {
    flex: 1;
    font-size: 0.85rem;
    color: #111827;
    font-weight: 500;
  }
  .session-earnings {
    font-weight: 700;
    color: #000080;
    font-size: 0.88rem;
  }
`;

export const ActionButton = styled.button`
  background: #ffffff;
  border: 1px solid #000080;
  color: #000080;
  padding: 6px 14px;
  border-radius: 18px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #000080;
    color: #ffffff;
  }

  ${(props) =>
    props.primary &&
    `
    background: #000080; color: #ffffff; border: none;
    &:hover { background: #1e3a8a; }
  `}
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  color: #64748b;
  text-align: center;
  margin-top: 16px;

  h3 {
    margin: 0;
    color: #111827;
    font-size: 1.1rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
  }
`;

export const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: #000080;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 40px auto;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  .modal-header {
    padding: 14px 16px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-user-info {
    display: flex;
    align-items: center;
    gap: 12px;

    h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
    }
  }

  .modal-meta {
    font-size: 0.78rem;
    color: #64748b;
    display: flex;
    gap: 6px;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #64748b;
    cursor: pointer;
  }

  .modal-footer {
    padding: 12px 16px;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;

    .footer-note {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      color: #64748b;
    }
  }
`;

export const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f8fafc;
`;

export const MessageBubble = styled.div`
  background: ${(props) => (props.$isMe ? "#000080" : "#ffffff")};
  color: ${(props) => (props.$isMe ? "#ffffff" : "#111827")};
  padding: 10px 14px;
  border-radius: ${(props) => (props.$isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px")};
  align-self: ${(props) => (props.$isMe ? "flex-end" : "flex-start")};
  max-width: 82%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  font-size: 0.88rem;
  line-height: 1.4;
  border: ${(props) => (props.$isMe ? "none" : "1px solid #e2e8f0")};
`;

export const MessageAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #000080;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;