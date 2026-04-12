import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// 1. Page Wrapper - LinkedIn background color
export const PageWrapper = styled.div`
  background: #f3f2ef;
  min-height: 100vh;
  padding: 24px 15px;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const Container = styled.div`
  max-width: 1128px;
  margin: 0 auto;
`;

// 2. Back Button - Improved hover and alignment
export const BackButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    color: #0a66c2;
  }
`;

// 3. Grid System - Responsive handling
export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// 4. Hero Image - High quality rendering
export const HeroImage = styled.img`
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  max-height: 480px;
  object-fit: cover;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

// 5. Info Box - Premium spacing
export const InfoBox = styled.div`
  background: white;
  padding: 32px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.08);

  h1 {
    font-size: 28px;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 12px;
    font-weight: 600;
  }

  .meta-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;

    span {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
    }
  }

  .description {
    line-height: 1.6;
    color: rgba(0, 0, 0, 0.7);
    font-size: 16px;
    white-space: pre-wrap;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 20px;
  margin: 32px 0 16px 0;
  color: rgba(0, 0, 0, 0.9);
  font-weight: 600;
  display: flex;
  align-items: center;
  
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e0e0e0;
    margin-left: 15px;
  }
`;

// 6. Deliverable List - Modern Grid cards
export const DeliverableList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 15px;
    color: rgba(0, 0, 0, 0.7);
    padding: 12px;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #eee;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const RightCol = styled.div``;

// 7. Sticky Card - Professional pricing box
export const StickyCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 24px;
  position: sticky;
  top: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 24px;
  }

  .label {
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .price {
    font-size: 36px;
    font-weight: 700;
    color: #0a66c2;
    margin: 0;
  }

  .footer-text {
    text-align: center;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
    margin-top: 16px;
  }
`;

// 8. Booking Button - LinkedIn Blue action
export const BookingButton = styled.button`
  width: 100%;
  background: #0a66c2;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;

  &:hover {
    background: #004182;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Features = styled.div`
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .feat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.7);
    
    svg {
      color: #057642; // Verified Green
    }
  }
`;

// 9. Status States - Fixed exports
export const LoaderWrapper = styled.div`
  padding: 100px 20px;
  text-align: center;
  color: #0a66c2;
  background: white;
  border-radius: 8px;
  margin: 20px 0;
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0a66c2;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: ${rotate} 0.8s linear infinite;
`;

export const ErrorState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  
  h2 { color: rgba(0,0,0,0.9); margin-bottom: 12px; }
  p { color: rgba(0,0,0,0.6); }
`;