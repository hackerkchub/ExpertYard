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

  @media (max-width: 1024px) {
    padding: 16px;
  }

  @media (max-width: 767px) {
    width: 100%;
    max-width: 100%;
    min-height: auto;
    overflow-x: hidden;
    padding: 12px 12px 0;
    background: #f8fafc;
    color: #111827;

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 767px) {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;

  @media (max-width: 767px) {
    justify-content: flex-start;
    margin-bottom: 10px;
  }
`;

export const FastTag = styled.div`
  color: #057642;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;

  @media (max-width: 767px) {
    width: fit-content;
    max-width: 100%;
    min-height: 30px;
    padding: 0 10px;
    border-radius: 999px;
    color: #000080;
    background: #eff6ff;
    border: 1px solid #dbeafe;
    font-size: 12px;
    font-weight: 700;
  }
`;

// NEW HORIZONTAL LAYOUT
export const HorizontalLayout = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;

  @media (max-width: 992px) {
    flex-direction: column;
  }

  @media (max-width: 767px) {
    width: 100%;
    max-width: 100%;
    gap: 14px;
    align-items: stretch;
  }
`;

export const ImageSide = styled.div`
  flex: 1;
  position: relative;
  max-width: 500px;
  @media (max-width: 992px) { max-width: 100%; }

  @media (max-width: 767px) {
    width: 100%;
    max-width: 100%;
    flex: 0 0 auto;
  }
`;

export const HeroImage = styled.img`
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 4px solid white;

  @media (max-width: 1024px) {
    display: block;
    max-width: 100%;
  }

  @media (max-width: 767px) {
    height: clamp(180px, 52vw, 220px);
    object-fit: cover;
    border: 0;
    border-radius: 16px;
    background: #f3f4f6;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  }
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

  @media (max-width: 767px) {
    top: 10px;
    left: 10px;
    padding: 6px 9px;
    border-radius: 999px;
    font-size: 11px;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
  }
`;

export const ContentSide = styled.div`
  flex: 1.5;

  @media (max-width: 767px) {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }
`;

export const MainInfoCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  border: 1px solid #e0e0e0;

  @media (max-width: 1024px) {
    width: 100%;
  }

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    max-width: 100%;
    padding: 16px;
    border-radius: 18px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
  }
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

  @media (max-width: 767px) {
    order: 1;

    h1 {
      margin: 0;
      color: #111827;
      font-size: clamp(20px, 6vw, 24px);
      line-height: 1.22;
      font-weight: 750;
      letter-spacing: -0.01em;
      overflow-wrap: anywhere;
    }

    .meta-stats {
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
      font-size: 12px;
      line-height: 1.3;

      span {
        min-height: 28px;
        padding: 0 9px;
        border-radius: 999px;
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
`;

export const DescriptionBox = styled.div`
  margin-top: 25px;
  h3 { font-size: 18px; margin-bottom: 10px; color: #333; }
  p { line-height: 1.6; color: #555; font-size: 15px; }

  @media (max-width: 767px) {
    order: 3;
    margin-top: 0;
    padding: 14px;
    border-radius: 16px;
    background: #f8fafc;
    border: 1px solid #e5e7eb;

    h3 {
      margin: 0 0 8px;
      color: #000080;
      font-size: clamp(17px, 4.6vw, 19px);
      line-height: 1.25;
      font-weight: 700;
    }

    p {
      margin: 0;
      color: #475569;
      font-size: clamp(13px, 3.7vw, 15px);
      line-height: 1.55;
      overflow-wrap: anywhere;
    }
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: #eee;
  margin: 25px 0;

  @media (max-width: 767px) {
    order: 4;
    margin: 0;
    background: #e5e7eb;
  }
`;

export const PricingActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 25px;

  @media (max-width: 767px) {
    order: 2;
    align-items: stretch;
    gap: 10px;
    margin-bottom: 0;
  }
`;

export const PriceBlock = styled.div`
  .label { font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase; }
  .price-val { font-size: 34px; color: #0a66c2; font-weight: 800; margin: 0; }

  @media (max-width: 767px) {
    flex: 1 1 130px;
    min-width: 0;
    padding: 12px;
    border-radius: 16px;
    background: linear-gradient(135deg, #eff6ff, #ffffff);
    border: 1px solid #dbeafe;

    .label {
      color: #64748b;
      font-size: 11px;
      line-height: 1.2;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .price-val {
      margin-top: 4px;
      color: #000080;
      font-size: clamp(18px, 6vw, 22px);
      line-height: 1.15;
      font-weight: 800;
    }
  }
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

  @media (max-width: 767px) {
    flex: 1 1 150px;
    min-width: 0;
    padding: 12px;
    border-radius: 16px;
    background: ${props => props.isLow ? '#fff5f5' : '#f0fdf4'};

    .w-head {
      align-items: flex-start;
      gap: 7px;
      color: #334155;
      font-size: 12px;
      line-height: 1.35;

      svg {
        flex: 0 0 auto;
        margin-top: 1px;
      }
    }
  }
`;

export const ButtonGroup = styled.div`
  margin-top: 10px;

  @media (max-width: 767px) {
    order: 6;
    margin-top: 0;
    position: sticky;
    bottom: calc(76px + env(safe-area-inset-bottom, 0px));
    z-index: 20;
  }
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

  @media (max-width: 767px) {
    min-height: 48px;
    padding: 0 16px;
    margin-top:20px;
    border-radius: 15px;
    background: ${props => {
      if (props.status === 'booked') return '#057642';
      if (props.status === 'low') return '#64748b';
      return '#000080';
    }};
    font-size: clamp(14px, 4vw, 16px);
    line-height: 1.2;
    box-shadow: 0 12px 24px rgba(0, 0, 128, 0.18);

    &:hover {
      filter: none;
      transform: none;
    }
  }
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

  @media (max-width: 767px) {
    order: 5;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 0;
    color: #475569;
    font-size: 12px;
    line-height: 1.3;

    span {
      min-height: 30px;
      padding: 0 9px;
      border-radius: 999px;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
    }
  }
`;

export const LoaderWrapper = styled.div`
  text-align: center;
  padding: 100px;

  @media (max-width: 767px) {
    min-height: calc(100svh - 140px);
    padding: 80px 16px 0;
    font-size: 14px;
    color: #475569;
  }
`;
export const Spinner = styled.div` 
  width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top-color: #0a66c2; 
  border-radius: 50%; animation: ${rotate} 0.8s linear infinite; margin: 0 auto 10px;
`;
export const ErrorState = styled.div`
  text-align: center;
  padding: 50px;

  @media (max-width: 767px) {
    padding: 80px 16px 0;
    font-size: 15px;
  }
`;
