import styled from "styled-components";

/* WRAPPER */
export const TopbarWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 2000;

  @media (max-width: 768px) {
    height: 64px;
    padding: 0 16px;
  }
`;

/* LEFT BLOCK */
export const LeftBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

/* BRAND */
export const Brand = styled.div`
  font-size: 24px;
  font-weight: 800;
  background:#000080;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  span { color: #3b82f6; -webkit-text-fill-color: #3b82f6; }
  @media (max-width: 480px) { font-size: 20px; }

  img {
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  @media (max-width: 580px) {
    font-size: 0; /* Hide text on very small screens */
  }
`;

/* SEARCH BOX */
export const SearchWrap = styled.div`
  flex: 1;
  max-width: 400px;
  margin: 0 20px;

  @media (max-width: 850px) {
    display: none; 
  }
`;

export const SearchRow = styled.div`
  width: 100%;
`;

export const SearchBox = styled.input`
  width: 100%;
  background: #f1f5f9;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    background: #fff;
    border-color: #000080;
    box-shadow: 0 0 0 1px #000080;
  }
`;

/* RIGHT ACTIONS */
export const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

/* CREATE BUTTON - Hidden on Mobile */
export const CreateBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #000080;
  color: #fff;
  padding: 8px 18px;
  border-radius: 20px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #004182;
  }

  /* ✅ Mobile par hide */
  @media (max-width: 768px) {
    display: none !important;
  }
`;

/* ICON BUTTONS */
export const IconBtn = styled.button`
  background: transparent;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 22px;
  color: #666;
  cursor: pointer;
  position: relative;

  &:hover {
    background: rgba(0,0,0,0.05);
    color: #000;
  }

  &.mobile-only {
    display: none;
    @media (max-width: 768px) {
      display: flex;
    }
  }
`;

export const UnreadDot = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 10px;
  height: 10px;
  background: #d11124;
  border-radius: 50%;
  border: 2px solid #fff;
`;

export const ProfileImg = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #e0e0e0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/* MOBILE MENU & OVERLAY */
export const MobileMenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 2050;
  display: ${({ open }) => (open ? "block" : "none")};
`;

export const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: #fff;
  z-index: 2100;
  transform: translateX(${({ open }) => (open ? "0" : "-100%")});
  transition: transform 0.3s ease-in-out;
  box-shadow: 5px 0 15px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
`;

/* ✅ MISSING EXPORTS ADDED HERE */
export const MobileMenuHeader = styled.div`
  padding: 24px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f9fafb;
`;

export const MobileMenuTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`;

export const MobileMenuSubtitle = styled.div`
  font-size: 13px;
  color: #64748b;
`;

export const MobileNavList = styled.div`
  padding: 12px;
  flex: 1;
`;

export const MobileNavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  color: #475569;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 4px;

  &:hover, &.active {
    background: #f0f7ff;
    color: #000080;
  }
`;

export const MobileNavIcon = styled.span`
  font-size: 20px;
  display: flex;
`;

export const MobileSectionTitle = styled.div`
  padding: 16px 20px 8px;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

/* POPOVERS */
export const PopoverContainer = styled.div`
  position: absolute;
  top: 55px;
  right: 0;
  width: 360px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border: 1px solid #e0e0e0;
  z-index: 2200;
  
  @media (max-width: 480px) {
    position: fixed;
    top: 64px;
    left: 10px;
    right: 10px;
    width: auto;
  }
`;

export const ProfileDropdownContainer = styled(PopoverContainer)`
  width: 240px;
`;