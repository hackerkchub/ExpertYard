import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

/* PAGE WRAPPER */
export const PageWrap = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

export const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
  color: #0a1628;

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

/* HEADER */
export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #0a1628;
  letter-spacing: -0.5px;
  
  span {
    font-size: 16px;
    font-weight: 400;
    color: #64748b;
    margin-left: 8px;
  }
`;

export const MetricsRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const MetricChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 100px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  
  span { 
    color: #94a3b8;
    font-weight: 400;
  }
  
  strong { 
    color: #0a1628;
    font-weight: 700;
    font-size: 15px;
  }
  
  svg { 
    color: #000080;
    flex-shrink: 0;
  }
`;

/* ==================== CREATION HUB (IMPROVED) ==================== */
export const CreationCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 24px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  @media (min-width: 769px) {
    flex-direction: row;
    align-items: stretch;
    padding: 16px 24px;
    gap: 16px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const CreationInputFake = styled.textarea`
  flex: 1;
  width: 100%;
  padding: 14px 20px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  background: #fafbfc;
  color: #0a1628;
  font-size: 15px;
  font-weight: 400;
  font-family: inherit;
  resize: vertical;
  min-height: 52px;
  max-height: 120px;
  transition: all 0.2s ease;
  line-height: 1.6;

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: #000080;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(0, 0, 128, 0.06);
  }

  &:hover:not(:disabled) {
    background: #ffffff;
    border-color: #cbd5e1;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 769px) {
    min-height: 48px;
    max-height: 80px;
    padding: 12px 18px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 14px;
    min-height: 60px;
  }
`;

export const CreationActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  flex-shrink: 0;

  @media (min-width: 769px) {
    justify-content: flex-end;
    flex-wrap: nowrap;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const ImageUploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-family: inherit;

  &:hover:not(.disabled) {
    background: #e2e8f0;
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
    font-size: 16px;
  }

  .required-star {
    color: #ef4444;
    font-weight: 700;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
    padding: 10px;
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
  border-radius: 10px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background: #000080;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  min-height: 44px;

  &:hover:not(:disabled) {
    background: #000066;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 128, 0.25);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &.secondary {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;

    &:hover:not(:disabled) {
      background: #e2e8f0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
  }

  svg {
    flex-shrink: 0;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
    padding: 10px 16px;
    font-size: 13px;
    min-height: 40px;
  }
`;

export const QuickImagePreview = styled.div`
  position: relative;
  display: inline-block;
  width: 56px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  flex-shrink: 0;
  background: #f8fafc;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
  }
`;

export const QuickImageRemove = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;

  &:hover:not(:disabled) {
    transform: scale(1.15);
    background: #dc2626;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 18px;
    height: 18px;
    top: -5px;
    right: -5px;
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
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/* POST CARD */
export const PostCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  animation: ${fadeIn} 0.4s ease forwards;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    border-color: #cbd5e1;
    transform: translateY(-2px);
  }
`;

export const Thumb = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  background: #f1f5f9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.03);
  }
`;

export const CardBody = styled.div`
  padding: 20px;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #0a1628;
  line-height: 1.4;
`;

export const CardExcerpt = styled.p`
  margin: 8px 0 16px;
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: #94a3b8;
  border-top: 1px solid #f1f5f9;
  padding-top: 14px;
  flex-wrap: wrap;
`;

export const MetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  font-size: 13px;
`;

export const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background: ${p => p.status === "published" ? "#dbeafe" : "#fef3c7"};
  color: ${p => p.status === "published" ? "#000080" : "#92400e"};
`;

export const MoreButton = styled.button`
  border: none;
  background: transparent;
  padding: 6px;
  cursor: pointer;
  color: #64748b;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover { 
    background: #f1f5f9;
    color: #0a1628;
  }
`;

export const Menu = styled.div`
  position: absolute;
  right: 12px; bottom: 45px;
  background: #ffffff;
  border-radius: 12px;
  padding: 8px;
  width: 180px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
  border: 1px solid #e2e8f0;
  z-index: 100;
  animation: ${fadeIn} 0.2s ease;
`;

export const MenuButton = styled.button`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  color: #0a1628;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover { 
    background: #f1f5f9;
  }
`;

/* ==================== EMPTY STATE ==================== */
export const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  animation: ${fadeIn} 0.5s ease;
  min-height: 400px;

  @media (max-width: 768px) {
    padding: 48px 24px;
    min-height: 300px;
  }
`;

export const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 36px;

  @media (max-width: 480px) {
    width: 64px;
    height: 64px;
    font-size: 28px;
  }
`;

export const EmptyStateTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #0a1628;
  margin: 0 0 8px 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0 0 24px 0;
  max-width: 480px;
  line-height: 1.6;
`;

export const EmptyStateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  background: #000080;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    background: #000066;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 128, 0.25);
  }

  svg {
    font-size: 18px;
  }
`;

export const EmptyStateDivider = styled.div`
  width: 60px;
  height: 2px;
  background: #e2e8f0;
  margin: 12px auto;
`;