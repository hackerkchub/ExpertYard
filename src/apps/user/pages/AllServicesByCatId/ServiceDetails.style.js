import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const PageWrapper = styled.div`
  background: #f3f2ef;
  min-height: 100vh;
  padding: 20px;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const BackButton = styled.button`
  background: white;
  border: 1px solid #dcdcdc;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover { border-color: #0a66c2; color: #0a66c2; }
`;

export const FastTag = styled.div`
  color: #057642;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

// NEW HORIZONTAL LAYOUT
export const HorizontalLayout = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

export const ImageSide = styled.div`
  flex: 1;
  position: relative;
  max-width: 500px;
  @media (max-width: 992px) { max-width: 100%; }
`;

export const HeroImage = styled.img`
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 4px solid white;
`;

export const Badge = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #057642;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ContentSide = styled.div`
  flex: 1.5;
`;

export const MainInfoCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  border: 1px solid #e0e0e0;
`;

export const TitleSection = styled.div`
  h1 { font-size: 28px; color: #000; margin-bottom: 8px; }
  .meta-stats {
    display: flex;
    gap: 20px;
    font-size: 14px;
    color: #666;
    .rating { color: #f59e0b; font-weight: 700; display: flex; align-items: center; gap: 4px; }
  }
`;

export const DescriptionBox = styled.div`
  margin-top: 25px;
  h3 { font-size: 18px; margin-bottom: 10px; color: #333; }
  p { line-height: 1.6; color: #555; font-size: 15px; }
`;

export const Divider = styled.div`
  height: 1px;
  background: #eee;
  margin: 25px 0;
`;

export const PricingActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 25px;
`;

export const PriceBlock = styled.div`
  .label { font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase; }
  .price-val { font-size: 34px; color: #0a66c2; font-weight: 800; margin: 0; }
`;

export const WalletBlock = styled.div`
  background: ${props => props.isLow ? '#fff5f5' : '#f3f2ef'};
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid ${props => props.isLow ? '#feb2b2' : '#e0e0e0'};
  .w-head {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #444;
    strong { color: ${props => props.isLow ? '#c53030' : '#057642'}; }
  }
`;

export const ButtonGroup = styled.div`
  margin-top: 10px;
`;

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  color: white;
  background: ${props => {
    if (props.status === 'booked') return '#057642';
    if (props.status === 'low') return '#718096';
    return '#0a66c2';
  }};

  &:hover {
    filter: brightness(0.9);
    transform: translateY(-2px);
  }

  &:disabled { cursor: not-allowed; transform: none; }
`;

export const TrustBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  font-size: 11px;
  color: #888;
  span { display: flex; align-items: center; gap: 4px; }
  svg { color: #057642; }
`;

export const LoaderWrapper = styled.div` text-align: center; padding: 100px; `;
export const Spinner = styled.div` 
  width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top-color: #0a66c2; 
  border-radius: 50%; animation: ${rotate} 0.8s linear infinite; margin: 0 auto 10px;
`;
export const ErrorState = styled.div` text-align: center; padding: 50px; `;