import styled from "styled-components";

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px 120px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  @media (max-width: 768px) {
    padding: 12px 8px 100px;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    background: #ef4444;
    color: white;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 999px;
    font-weight: 600;
  }
`;

export const MarkAllReadBtn = styled.button`
  background: none;
  border: none;
  color: #000080;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TabButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid ${props => props.$active ? "#000080" : "#e5e7eb"};
  background: ${props => props.$active ? "#000080" : "#ffffff"};
  color: ${props => props.$active ? "#ffffff" : "#4b5563"};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? "#000080" : "#f3f4f6"};
  }
`;

export const NotificationList = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

export const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  background: ${props => props.$unread ? "#f3f8ff" : "#ffffff"};
  transition: background 0.2s ease;
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.$unread ? "#ebf3fe" : "#fafafa"};
  }

  @media (max-width: 600px) {
    padding: 12px;
    gap: 12px;
  }
`;

export const UnreadIndicator = styled.div`
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
`;

export const AvatarWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #e5e7eb;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    font-size: 20px;
    color: #4b5563;
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

export const MessageText = styled.p`
  font-size: 14px;
  line-height: 1.4;
  color: #1f2937;
  margin: 0;

  strong {
    font-weight: 600;
    color: #111827;
  }
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

export const TimeText = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

export const TypeBadge = styled.span`
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 500;
  background: ${props => props.$bg || "#f3f4f6"};
  color: ${props => props.$color || "#4b5563"};
`;

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 600px) {
    gap: 8px;
  }
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.$danger ? "#ef4444" : "#000080"};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.$danger ? "#fef2f2" : "#f0f0ff"};
  }

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 4px;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;

  .icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px;
  }

  p {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
`;

export const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 0;
  font-size: 16px;
  color: #4b5563;
  font-weight: 500;
`;
