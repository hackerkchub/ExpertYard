import styled from "styled-components";

export const PageWrapper = styled.div`
  background-color: #f3f2ef;
  min-height: 100vh;
  padding: 20px 10px;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

export const Container = styled.div`
  max-width: 950px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  .header-text {
    flex: 1;
    min-width: 250px;
  }

  h1 { font-size: 24px; color: #1d1d1d; margin: 0; font-weight: 600; }
  p { color: #666; font-size: 14px; margin-top: 4px; }
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 500px) {
    width: 100%;
    flex-direction: column;
    button { width: 100%; justify-content: center; }
  }
`;

export const AddButton = styled.button`
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background-color: #004182; }
`;

export const BookingButton = styled.button`
  background-color: transparent;
  color: #0a66c2;
  border: 1px solid #0a66c2;
  border-radius: 24px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background-color: rgba(10, 102, 194, 0.1); }
`;

export const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ServiceCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  overflow: hidden;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  @media (max-width: 650px) { flex-direction: column; }
`;

export const ServiceImage = styled.img`
  width: 200px;
  object-fit: cover;
  background: #f0f2f5;
  @media (max-width: 650px) { width: 100%; height: 180px; }
`;

export const ServiceInfo = styled.div`
  padding: 16px;
  flex: 1;
  .top-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .price { font-size: 18px; font-weight: 700; color: #0a66c2; }
  h3 { font-size: 18px; color: #1d1d1d; margin: 0 0 8px 0; }
  .description { font-size: 14px; color: #666; line-height: 1.4; margin-bottom: 12px; }
`;

export const DeliverablesPreview = styled.div`
  background: #f8f9fa;
  padding: 10px;
  border-radius: 6px;
  font-size: 13px;
  border-left: 3px solid #0a66c2;
  strong { display: block; margin-bottom: 4px; color: #333; }
  .html-content { color: #555; ul, ol { padding-left: 18px; margin: 0; } }
`;

export const StatusBadge = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 12px;
  background: ${props => props.$status?.toLowerCase() === 'active' ? '#e7f4ed' : '#f9eaea'};
  color: ${props => props.$status?.toLowerCase() === 'active' ? '#057642' : '#cc1011'};
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid #eee;
  background: #fafafa;
  button {
    flex: 1;
    width: 60px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    &:hover { background: #f0f2f5; color: #0a66c2; }
    &.delete:hover { color: #d93025; }
  }
  @media (max-width: 650px) { flex-direction: row; border-left: none; border-top: 1px solid #eee; button { padding: 12px; width: 33.3%; } }
`;

export const LoadingBox = styled.div`text-align: center; padding: 40px; color: #666;`;
export const ErrorBox = styled.div`text-align: center; padding: 20px; color: #cc1011; background: #f9eaea; border-radius: 8px;`;
export const EmptyState = styled.div`text-align: center; padding: 60px; background: white; border-radius: 8px; h3 { margin-top: 16px; color: #333; }`;