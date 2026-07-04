import styled from "styled-components";

export const PageContainer = styled.div`
  background-color: #f3f2ef;
  min-height: 100vh;
  padding: 40px 20px;

  @media (min-width: 1024px) {
    background:
      radial-gradient(circle at 8% 0%, rgba(0, 0, 128, 0.08), transparent 30%),
      radial-gradient(circle at 92% 8%, rgba(255, 213, 74, 0.14), transparent 28%),
      #f8fafc;
    color: #111827;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    padding: 28px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;

  @media (min-width: 1024px) {
    width: 100%;
    max-width: none;
  }
`;

export const Header = styled.div`
  margin-bottom: 24px;
  h1 { font-size: 24px; color: rgba(0,0,0,0.9); font-weight: 600; }
  p { font-size: 14px; color: rgba(0,0,0,0.6); }

  @media (min-width: 1024px) {
    margin-bottom: 28px;

    h1 {
      color: #111827;
      font-size: clamp(30px, 2.45vw, 38px);
      font-weight: 900;
      letter-spacing: -0.02em;
    }

    p {
      color: #64748b;
      font-size: 15px;
      font-weight: 650;
      line-height: 1.6;
    }
  }
`;

export const BookingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 1024px) {
    gap: 18px;
  }
`;

export const BookingCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
  display: flex;
  gap: 20px;
  align-items: center;
  transition: transform 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  @media (min-width: 1024px) {
    border-radius: 18px;
    border: 1px solid #e5e7eb;
    padding: 20px;
    box-shadow: 0 16px 42px rgba(15, 23, 42, 0.075);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ServiceImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  background: #f8f8f8;

  @media (min-width: 1024px) {
    width: 112px;
    height: 112px;
    border-radius: 16px;
  }
`;

export const BookingInfo = styled.div`
  flex: 1;
  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
    h3 { font-size: 18px; color: #1d1d1d; margin: 0; }
  }

  .price-row {
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    .price-label { font-size: 13px; color: #666; }
    .amount { font-size: 16px; font-weight: 700; color: #0a66c2; }
  }

  @media (min-width: 1024px) {
    .top-row h3 {
      color: #111827;
      font-size: 18px;
      font-weight: 850;
    }

    .price-row .price-label {
      color: #64748b;
      font-size: 14px;
      font-weight: 650;
    }

    .price-row .amount {
      color: #000080;
      font-size: 18px;
      font-weight: 900;
    }
  }
`;

export const MetaGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  .meta-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    color: #666;
    svg { color: #0a66c2; }
  }

  @media (min-width: 1024px) {
    gap: 14px;

    .meta-item {
      color: #64748b;
      font-size: 14px;
      font-weight: 650;

      svg {
        color: #000080;
      }
    }
  }
`;

export const StatusBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  text-transform: capitalize;
  
  background: ${props => {
    if (props.status === 'pending') return '#fff3cd';
    if (props.status === 'confirmed') return '#d4edda';
    if (props.status === 'cancelled') return '#f8d7da';
    return '#e2e3e5';
  }};

  color: ${props => {
    if (props.status === 'pending') return '#856404';
    if (props.status === 'confirmed') return '#155724';
    if (props.status === 'cancelled') return '#721c24';
    return '#383d41';
  }};
`;

export const ActionArea = styled.div`
  .details-btn {
    background: transparent;
    border: 1px solid #0a66c2;
    color: #0a66c2;
    padding: 6px 16px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    &:hover { background: rgba(10,102,194,0.1); }
  }

  @media (min-width: 1024px) {
    .details-btn {
      min-height: 42px;
      border-color: #000080;
      border-radius: 13px;
      background: #000080;
      color: #ffffff;
      font-size: 14px;
      font-weight: 850;
      box-shadow: 0 12px 26px rgba(0, 0, 128, 0.18);
    }
  }
`;

export const Loader = styled.div`text-align: center; padding: 100px; color: #666;`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  .icon { font-size: 48px; margin-bottom: 10px; }
  h3 { margin-bottom: 10px; color: #333; }
  p { color: #666; }
`;
