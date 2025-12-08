import styled from "styled-components";
import { Link } from "react-router-dom";

/* WRAPPER */
export const TopbarWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(18, 24, 38, 0.55);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255,255,255,0.08);

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  z-index: 1300;
`;

/* LEFT */
export const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

/* BRANDING BLOCK */
export const BrandingGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const BrandBox = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-decoration: none;
  gap: 2px;
`;

export const BrandLogo = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 2px;
`;

export const BrandName = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: white;
  letter-spacing: .6px;
  white-space: nowrap;
  line-height: 1;

  span {
    background: linear-gradient(135deg, #20e8ff, #0075ff);
    -webkit-background-clip: text;
    color: transparent;
  }
`;

export const AdminTitle = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: rgba(235, 245, 255, 0.65);
  letter-spacing: .4px;
  line-height: 1;
  white-space: nowrap;
  margin-top: -1px;
`;

/* MOBILE TOGGLE */
export const MobileToggle = styled.button`
  background: none;
  border: none;
  display: none;
  cursor: pointer;
  color: white;

  @media (max-width: 768px) {
    display: block;
  }
`;

/* RIGHT ICONS */
export const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  position: relative;
`;

/* DROPDOWN */
export const DropMenu = styled.div`
  position: absolute;
  right: 0;
  top: 40px;
  width: ${(p) => p.width || "200px"};
  display: ${(p) => (p.show ? "block" : "none")};
  background: rgba(18, 24, 38, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0px 4px 14px rgba(0,0,0,0.4);
`;

export const DropItem = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  color: #d8ecff;
  cursor: pointer;

  &:hover {
    background: rgba(255,255,255,0.08);
  }
`;
