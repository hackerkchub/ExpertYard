import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const Side = styled.aside`
  position: fixed;
  top: 64px; /* below Topbar */
  left: 0;
  width: ${(p) => (p.collapsed ? "80px" : "260px")};
  height: calc(100vh - 64px);
  background: rgba(15, 23, 42, 0.96);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(148, 163, 184, 0.25);
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: 0.25s ease;
  z-index: 1200;

  @media (max-width: 768px) {
    left: ${(p) => (p.mobileOpen ? "0" : "-260px")};
    width: 240px;
  }
`;

export const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(p) => (p.show ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1100;
  }
`;

export const CollapseBtn = styled.button`
  background: none;
  border: none;
  color: #e5e7eb;
  font-size: 20px;
  cursor: pointer;
  margin-bottom: 8px;
  align-self: ${(p) => (p.collapsed ? "center" : "flex-end")};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Menu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 10px;
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  transition: 0.18s ease;

  svg {
    font-size: 18px;
  }

  &:hover {
    background: rgba(15, 118, 255, 0.12);
    color: #e5f2ff;
  }

  &.active {
    background: linear-gradient(135deg, #0ea5e9, #6366f1);
    color: #f9fafb;
    box-shadow: 0 0 18px rgba(59, 130, 246, 0.45);
  }

  &.collapsed span {
    display: none;
  }
`;
