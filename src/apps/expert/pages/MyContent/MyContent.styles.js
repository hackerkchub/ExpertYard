import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* PAGE WRAPPER */
export const PageWrap = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #fafafa; 
  display: flex;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

export const Content = styled.div`
  max-width: 1128px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 16px;
  color: #262626;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

/* HEADER */
export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #000000;
`;

export const MetricsRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const MetricChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid #dbdbdb;
  span { font-size: 12px; color: #8e8e8e; }
  strong { font-size: 13px; color: #262626; font-weight: 700; }
  svg { color: #0095f6; }
`;

/* ==================== CREATION HUB (FULLY RESPONSIVE) ==================== */
export const CreationCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #dbdbdb;
  display: flex;
  flex-direction: column; /* Mobile first stack */
  gap: 12px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  @media (min-width: 769px) {
    flex-direction: row; /* Desktop horizontal */
    align-items: center;
    padding: 16px 20px;
  }
`;

export const CreationInputFake = styled.div`
  flex: 1;
  width: 100%; /* Mobile par full width */
  padding: 12px 20px;
  border-radius: 35px;
  border: 1px solid #dbdbdb;
  background: #ffffff;
  color: #8e8e8e;
  font-size: 15px;
  font-weight: 500;
  cursor: text;
  min-height: 48px;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    background: #f2f2f2;
    border-color: #ccd0d5;
  }
`;

export const CreationActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Mobile par icons ek taraf, button ek taraf */
  gap: 10px;
  width: 100%;
  flex-wrap: wrap;

  @media (min-width: 769px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #666666;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #000;
  }
`;

export const PrimaryButton = styled.button`
  border: none;
  border-radius: 24px;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  background: #0a66c2; /* LinkedIn Blue */
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0; 

  &:hover {
    background: #004182;
  }

  @media (max-width: 480px) {
    padding: 8px 20px;
    font-size: 14px;
     width: 100%;
  }
`;

/* TABS */
export const Tabs = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 10px;
  border-bottom: 1px solid #dbdbdb;
  overflow-x: auto;
  white-space: nowrap;
  &::-webkit-scrollbar { display: none; }
`;

export const Tab = styled.button`
  border: none;
  background: transparent;
  padding: 14px 0;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  color: ${p => (p.active ? "#262626" : "#8e8e8e")};
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: -1px;
    height: 2px;
    background: ${p => (p.active ? "#262626" : "transparent")};
  }
`;

/* GRID SYSTEM */
export const GridWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* POST CARD */
export const PostCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #dbdbdb;
  animation: ${fadeIn} 0.4s ease forwards;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
`;

export const Thumb = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #efefef;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CardBody = styled.div`
  padding: 16px;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #000;
`;

export const CardExcerpt = styled.p`
  margin: 8px 0 12px;
  font-size: 14px;
  color: #262626;
  line-height: 1.5;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #8e8e8e;
  border-top: 1px solid #efefef;
  padding-top: 12px;
`;

/* ALL EXPORTS INCLUDED TO PREVENT SYNTAX ERRORS */
export const MetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
`;

export const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  background: ${p => p.status === "published" ? "#e1f0fe" : "#fff3cd"};
  color: ${p => p.status === "published" ? "#0a66c2" : "#856404"};
`;

export const MoreButton = styled.button`
  border: none;
  background: transparent;
  padding: 6px;
  cursor: pointer;
  color: #262626;
  border-radius: 50%;
  &:hover { background: #f2f2f2; }
`;

export const Menu = styled.div`
  position: absolute;
  right: 12px; bottom: 45px;
  background: #ffffff;
  border-radius: 12px;
  padding: 8px;
  width: 180px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
  border: 1px solid #dbdbdb;
  z-index: 100;
`;

export const MenuButton = styled.button`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  color: #262626;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  &:hover { background: #f2f2f2; }
`;

export const QuickImagePreview = styled.div`
  position: relative;
  width: 60px; height: 60px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #dbdbdb;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

export const QuickImageRemove = styled.button`
  position: absolute;
  top: 2px; right: 2px;
  width: 18px; height: 18px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.7);
  color: #fff;
  font-size: 10px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  &:hover { background: #000; }
`;