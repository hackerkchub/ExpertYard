import styled from "styled-components";

export const PageContainer = styled.div`
  background-color: #f8f9fb;
  min-height: 100vh;
  padding: 20px 0;
`;

export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);

  .title-area h2 {
    font-size: 24px;
    color: #111827;
    margin: 0;
  }
  .title-area p {
    color: #6b7280;
    margin: 5px 0 0 0;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

export const TopActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #000080;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #000066; transform: translateY(-1px); }
`;

export const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 650px) { grid-template-columns: 1fr; }
`;

export const ServiceCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  }
`;

export const ExpertIdentitySection = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;

  .expert-avatar {
    width: 32px;
    height: 32px;
    background: #f0edff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000080;
  }

  .expert-info h4 {
    font-size: 14px;
    margin: 0;
    color: #111827;
  }
  .expert-info span {
    font-size: 11px;
    color: #6b7280;
  }
`;

export const ImageWrapper = styled.div`
  height: 180px;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img { transform: scale(1.05); }
`;

export const PriceBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 14px;
  backdrop-filter: blur(4px);
`;

export const CardContent = styled.div`
  padding: 16px;
  flex-grow: 1;

  h3 {
    font-size: 18px;
    margin: 10px 0;
    color: #111827;
    line-height: 1.4;
  }

  .description {
    font-size: 13px;
    color: #4b5563;
    line-height: 1.5;
    margin-bottom: 15px;
  }
`;

export const CategoryTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f3f4f6;
  color: #4b5563;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
`;

export const DeliverablesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  .skill-pill {
    background: #f0f7ff;
    color: #0056b3;
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 100px;
    border: 1px solid #d0e7ff;
  }
`;

export const CardFooter = styled.div`
  padding: 16px;
  border-top: 1px solid #f3f4f6;
`;

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #000080;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: #000066; }
`;

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #000080;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  p { margin-top: 15px; color: #6b7280; font-weight: 500; }
  
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;