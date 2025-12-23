// src/apps/expert/styles/Dashboard.styles.js

import styled from "styled-components";

/* ===== Container Layout ===== */
export const Layout = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #f7f9fc; /* Light background */
  color: #0f182a;
  font-family: 'Inter', sans-serif;
`;

/* ===== Sidebar (kept dark for contrast) ===== */
export const SidebarWrap = styled.aside`
  width: 260px;
  min-width: 260px;
  height: calc(100vh - 64px);
  background: rgba(12, 17, 22, 0.85);
  border-right: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  position: fixed;
  top: 64px;
  left: 0;
  z-index: 1200;

  @media(max-width: 768px) {
    transform: translateX(${({ open }) => (open ? "0" : "-100%")});
    transition: 0.28s ease;
  }
`;

/* ===== Center Content ===== */
export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 50px;
  width: calc(100% - 50px);
  transition: margin-left 0.28s ease;

  @media(max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;


/* ===== Inner Page ===== */
export const ContentInner = styled.div`
  padding: 32px 40px;
  flex: 1;

  @media(max-width: 768px) {
    padding: 24px 16px;
  }
`;

export const Welcome = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 26px;
  color: #0f182a;
`;

/* ===== Stats ===== */
export const StatsRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 28px;

  @media(max-width: 768px) {
    flex-direction: column;
  }
`;

export const StatCard = styled.div`
  flex: 1;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(18,18,18,0.06);
  border-radius: 14px;
  padding: 20px 24px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.04);
  transition: 0.25s ease;

  &:hover {
    box-shadow: 0 6px 24px rgba(0,0,0,0.06);
    transform: translateY(-2px);
  }

  span {
    font-size: 14px;
    color: #5e6a7b;
  }

  h2 {
    margin: 10px 0 0;
    font-size: 26px;
    font-weight: 700;
    color: #0f182a;
  }
`;

/* ===== Queue Card ===== */
export const QueueCardWrap = styled.div`
  background: rgba(255,255,255,0.75);
  border-radius: 14px;
  backdrop-filter: blur(14px);
  border: 1px solid rgba(18,18,18,0.06);
  box-shadow: 0 4px 18px rgba(0,0,0,0.04);
  margin-bottom: 32px;
  padding: 24px;
`;

export const QueueTabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  button {
    background: transparent;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    color: #4b5563;
    cursor: pointer;
    transition: 0.2s ease;
    font-weight: 500;
  }

  .active {
    background: rgba(14,165,255,0.1);
    color: #0ea5ff;
  }
`;

export const QueueItem = styled.div`
  border-bottom: 1px solid rgba(18,18,18,0.06);
  padding: 14px 0;
  display: flex;
  justify-content: space-between;

  span {
    font-size: 14px;
    color: #4b5563;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ActionBtn = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
  border: none;
  color: white;
  background: linear-gradient(90deg,#0ea5ff,#38bdf8);
  transition: 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

/* ===== Feed and Widget ===== */
export const FeedArea = styled.div`
  display: flex;
  gap: 20px;

  @media(max-width: 768px) {
    flex-direction: column;
  }
`;

export const FeedCardWrap = styled.div`
  flex: 2;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(18,18,18,0.06);
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.04);
`;

export const WidgetCardWrap = styled.div`
  flex: 1;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(18,18,18,0.06);
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.04);
`;

export const WidgetInput = styled.textarea`
  background: #ffffff;
  border: 1px solid rgba(18,18,18,0.06);
  border-radius: 10px;
  color: #111827;
  padding: 10px;
  width: 100%;
  height: 90px;
  resize: none;
  font-size: 14px;

  &:focus {
    outline: 2px solid #0ea5ff;
  }
`;

export const WidgetActions = styled.div`
  margin-top: 14px;

  button {
    background: linear-gradient(90deg, #0ea5ff, #38bdf8);
    color: #fff;
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    border: none;
  }
`;

export const RedDot = styled.span`
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  display: inline-block;
  margin-left: 6px;
`;
