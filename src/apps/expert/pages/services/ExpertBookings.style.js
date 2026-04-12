import styled from "styled-components";

export const PageWrapper = styled.div`
  background-color: #f3f2ef;
  min-height: 100vh;
  padding: 20px 10px;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

export const Header = styled.div`
  margin-bottom: 24px;
  h1 { font-size: 22px; color: #1d1d1d; margin: 0; font-weight: 600; }
  p { font-size: 14px; color: #666; margin-top: 4px; }
`;

export const BookingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

export const BookingCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .title-area {
    h3 { font-size: 16px; color: #0a66c2; margin: 0; font-weight: 600; }
    .booking-id { font-size: 11px; color: #888; }
  }
`;

export const StatusBadge = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  background: ${props => {
    switch(props.$status) {
      case 'pending': return '#fff3cd';
      case 'in_progress': return '#e7f4ed';
      case 'completed': return '#d1e7dd';
      default: return '#f0f2f5';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'pending': return '#856404';
      case 'in_progress': return '#057642';
      case 'completed': return '#0f5132';
      default: return '#666';
    }
  }};
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  .info-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #444;
    svg { color: #666; }
  }
`;

export const CardActions = styled.div`
  border-top: 1px solid #f0f2f5;
  padding-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .select-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    label { font-size: 12px; font-weight: 600; color: #666; }
    select {
      flex: 1;
      padding: 6px;
      border-radius: 4px;
      border: 1px solid #dcdcdc;
      font-size: 13px;
      &:focus { border-color: #0a66c2; outline: none; }
    }
  }
`;

export const MiniLoader = styled.span`
  font-size: 11px;
  color: #0a66c2;
  font-weight: 600;
  margin-left: 8px;
`;

// ... (previous styles)

export const UserDetailSection = styled.div`
  background: #f0f7ff;
  padding: 12px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 5px;

  .user-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #1d1d1d;
    svg { color: #0a66c2; min-width: 14px; }
    strong { font-size: 14px; color: #0a66c2; }
  }
`;



export const StatusBox = styled.div`text-align: center; padding: 50px; color: #666;`;
export const EmptyState = styled.div`text-align: center; padding: 60px; background: white; border-radius: 8px; color: #888; p { margin-top: 10px; }`;