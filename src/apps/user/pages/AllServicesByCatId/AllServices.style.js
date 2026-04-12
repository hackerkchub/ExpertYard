import styled from "styled-components";

export const PageContainer = styled.div`
  background-color: #f3f2ef; /* LinkedIn light grey bg */
  min-height: 100vh;
  padding: 40px 20px;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const ContentWrapper = styled.div`
  max-width: 1128px;
  margin: 0 auto;
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;

  .title-area h2 {
    font-size: 24px;
    color: rgba(0,0,0,0.9);
    font-weight: 600;
    margin-bottom: 4px;
  }

  .title-area p {
    color: rgba(0,0,0,0.6);
    font-size: 16px;
  }
`;

export const TopActionButton = styled.button`
  background: white;
  border: 1px solid #0a66c2;
  color: #0a66c2;
  padding: 8px 16px;
  border-radius: 1600px; /* Pill shape */
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #eef3f8;
    border-width: 2px;
  }
`;

export const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

export const ServiceCard = styled.div`
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

export const ExpertIdentitySection = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border-bottom: 1px solid #f3f2ef;

  .expert-avatar {
    width: 40px;
    height: 40px;
    background: #eef3f8;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0a66c2;
  }

  .expert-info h4 {
    font-size: 14px;
    margin: 0;
    color: rgba(0,0,0,0.9);
    &:hover { text-decoration: underline; color: #0a66c2; }
  }

  .expert-info span {
    font-size: 12px;
    color: rgba(0,0,0,0.6);
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  height: 180px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PriceBadge = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
`;

export const CardContent = styled.div`
  padding: 16px;
  flex-grow: 1;

  h3 {
    font-size: 16px;
    margin: 8px 0;
    color: rgba(0,0,0,0.9);
    line-height: 1.4;
  }

  .description {
    font-size: 14px;
    color: rgba(0,0,0,0.6);
    margin-bottom: 12px;
  }
`;

export const CategoryTag = styled.div`
  font-size: 12px;
  color: #0a66c2;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  text-transform: uppercase;
`;

export const DeliverablesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  .skill-pill {
    background: #e1f0fe;
    color: #0366d6;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
  }
`;

export const CardFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #f3f2ef;
`;

export const PrimaryButton = styled.button`
  width: 100%;
  background: white;
  color: #0a66c2;
  border: 1px solid #0a66c2;
  padding: 8px;
  border-radius: 1600px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #0a66c2;
    color: white;
  }
`;

export const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #0a66c2;
  font-weight: 600;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;