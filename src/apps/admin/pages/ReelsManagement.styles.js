import styled from "styled-components";

export const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1f2937;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #000080;
  margin: 0 0 24px;
`;

export const TabsRow = styled.div`
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1px;
  margin-bottom: 24px;
`;

export const TabButton = styled.button`
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? "#000080" : "transparent"};
  color: ${props => props.active ? "#000080" : "#6b7280"};
  font-weight: ${props => props.active ? "700" : "500"};
  padding: 12px 18px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    color: #000080;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

export const ReelCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
`;

export const VideoContainer = styled.div`
  width: 100%;
  aspect-ratio: 9/16;
  max-height: 280px;
  background: #000000;
  position: relative;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Content = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }

  div {
    display: flex;
    flex-direction: column;
    
    span.name {
      font-weight: 700;
      font-size: 13px;
      color: #111827;
    }
    
    span.category {
      font-size: 11px;
      color: #6b7280;
    }
  }
`;

export const ReelTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 6px;
  color: #111827;
`;

export const ReelCaption = styled.p`
  font-size: 13px;
  color: #4b5563;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

export const Button = styled.button`
  flex: 1;
  border: 1px solid ${props => props.variant === "success" ? "transparent" : props.variant === "danger" ? "transparent" : "#e5e7eb"};
  background: ${props => {
    if (props.variant === "success") return "#10b981";
    if (props.variant === "danger") return "#ef4444";
    return "#ffffff";
  }};
  color: ${props => {
    if (props.variant === "success" || props.variant === "danger") return "#ffffff";
    return "#4b5563";
  }};
  padding: 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export const ReportsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  border: 1px solid #e5e7eb;

  th, td {
    padding: 14px 18px;
    text-align: left;
    font-size: 13px;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background: #f9fafb;
    font-weight: 700;
    color: #4b5563;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

export const ReportReason = styled.div`
  color: #991b1b;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

export const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
`;

export const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(0,0,80,0.1);
  border-left-color: #ffd23f;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
