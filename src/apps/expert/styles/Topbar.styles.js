import styled from "styled-components";

/* WRAPPER - Premium Glassmorphism */
export const TopbarWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  backdrop-filter: blur(20px) saturate(180%);
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 2000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    padding: 0 16px;
    height: 65px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
  }
`;

/* LEFT BLOCK */
export const LeftBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 0;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

/* PREMIUM BRAND */
export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 20px;
  color: #1e293b;
  letter-spacing: -0.025em;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(14, 165, 255, 0.1);
    color: #0ea5ff;
  }

  img {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    font-size: 18px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

/* RESPONSIVE SEARCH */
export const SearchWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  max-width: 420px;

  @media (max-width: 1024px) {
    max-width: 300px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

export const SearchBox = styled.input`
  flex: 1;
  padding: 12px 20px;
  border-radius: 12px;
  background: rgba(248, 250, 252, 0.8);
  border: 2px solid rgba(226, 232, 240, 0.8);
  color: #1e293b;
  font-size: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
  min-height: 44px;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
  }

  @media (max-width: 1024px) {
    font-size: 14px;
    padding: 10px 16px;
  }
`;

export const SearchFilters = styled.div`
  display: flex;
  gap: 8px;
`;

export const FilterChip = styled.button`
  padding: 6px 14px;
  border-radius: 20px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  background: ${({ active }) => (active ? "linear-gradient(135deg, #0ea5ff, #0284c7)" : "rgba(248, 250, 252, 0.8)")};
  color: ${({ active }) => (active ? "#ffffff" : "#64748b")};
  font-weight: 600;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
  box-shadow: ${({ active }) => (active ? "0 4px 12px rgba(14, 165, 255, 0.3)" : "none")};

  &:hover {
    background: ${({ active }) => (active ? "linear-gradient(135deg, #0284c7, #0369a1)" : "rgba(203, 213, 225, 0.8)")};
    transform: translateY(-1px);
  }
`;

/* PREMIUM SEARCH SUGGESTIONS */
export const SuggestBox = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  max-height: 320px;
  overflow-y: auto;
  z-index: 2100;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

export const SuggestItem = styled.div`
  padding: 14px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  transition: all 0.2s ease;
  border-radius: 12px;
  margin: 4px 8px;

  &:hover {
    background: linear-gradient(135deg, rgba(14, 165, 255, 0.1), rgba(59, 130, 246, 0.1));
    transform: translateX(4px);
  }
`;

export const SuggestText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const SuggestTitle = styled.span`
  font-weight: 600;
  color: #1e293b;
`;

export const SuggestMeta = styled.span`
  font-size: 12px;
  color: #64748b;
`;

export const SuggestType = styled.span`
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 20px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #1d4ed8;
  font-weight: 500;
`;

export const SuggestEmpty = styled.div`
  padding: 20px;
  font-size: 14px;
  color: #64748b;
  text-align: center;
`;

/* RIGHT ACTIONS - Premium */
export const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

/* PREMIUM ICON BUTTONS */
export const IconBtn = styled.button`
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: #1e293b;
  position: relative;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  &.mobile-only {
    display: none;
  }

  &:hover {
    background: rgba(14, 165, 255, 0.15);
    border-color: rgba(14, 165, 255, 0.3);
    color: #0ea5ff;
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(14, 165, 255, 0.2);
  }

  @media (max-width: 768px) {
    &.mobile-only {
      display: flex;
    }
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
`;

/* PREMIUM UNREAD DOT */
export const UnreadDot = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.9);
`;

/* PREMIUM CREATE BUTTON */
export const CreateBtn = styled.button`
  display: flex;
  gap: 8px;
  align-items: center;
  background: linear-gradient(135deg, #0ea5ff, #0284c7);
  color: #fff;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.025em;
  box-shadow: 0 8px 24px rgba(14, 165, 255, 0.3);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  min-height: 44px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(14, 165, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
    min-height: 40px;
  }
`;

/* PREMIUM PROFILE */
export const ProfileImg = styled.div`
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  &:hover img {
    transform: scale(1.05);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    img {
      width: 40px;
      height: 40px;
    }
  }
`;

/* MOBILE HAMBURGER OVERLAY */
export const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 1900;
  opacity: ${({ open }) => (open ? 1 : 0)};
  visibility: ${({ open }) => (open ? "visible" : "hidden")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const MobileMenu = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  width: 280px;
  max-width: 90vw;
  height: calc(100vh - 70px);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
  transform: translateX(${({ open }) => (open ? "0%" : "-100%")});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2000;
  padding: 24px 0;
  overflow-y: auto;
`;

export const MobileMenuHeader = styled.div`
  padding: 0 24px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
`;

export const MobileMenuTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

export const MobileMenuSubtitle = styled.div`
  font-size: 14px;
  color: #64748b;
`;

export const MobileNavList = styled.div`
  padding: 0 24px;
`;

export const MobileNavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #374151;

  &:hover {
    background: rgba(14, 165, 255, 0.1);
    color: #0ea5ff;
    padding-left: 8px;
  }

  &.active {
    background: linear-gradient(135deg, rgba(14, 165, 255, 0.15), rgba(59, 130, 246, 0.15));
    color: #0ea5ff;
    font-weight: 600;
  }
`;

export const MobileNavIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(14, 165, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0ea5ff;
  font-size: 18px;
  flex-shrink: 0;
`;

export const MobileSectionTitle = styled.div`
  padding: 20px 24px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

/* FIXED NOTIFICATION POPOVER CONTAINER */
export const PopoverContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 360px;
  max-width: calc(100vw - 32px); /* ✅ MOBILE FULL WIDTH */
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 2200;
  overflow: hidden;
  animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* MOBILE: Full viewport width */
  @media (max-width: 480px) {
    width: calc(100vw - 48px);
    right: 16px;
    left: 16px;
  }

  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    right: 12px;
    left: 12px;
  }
`;

/* FIXED PROFILE DROPDOWN - SAME ISSUE */
export const ProfileDropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 220px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 2200;
  animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 480px) {
    width: calc(100vw - 48px);
    right: 16px;
    left: 16px;
    max-width: 300px;
  }
`;

export const NotifPopoverWrap = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 340px;
  max-width: 90vw;
  z-index: 2200;

  @media (max-width: 768px) {
    right: 12px;
    left: auto;
    width: calc(100vw - 48px);
  }
`;