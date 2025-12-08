import styled from "styled-components";

/* WRAPPER */

export const TopbarWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  backdrop-filter: blur(14px);
  background: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(214, 198, 198, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1300;
`;

export const LeftBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

/* BRAND */

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 18px;
  color: #0f1e36;

  img {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

/* SEARCH + FILTERS */

export const SearchWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SearchBox = styled.input`
  width: 360px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f4f6f8;
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #2c2c2c;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    background: #ffffff;
  }

  @media (max-width: 950px) {
    width: 260px;
  }
`;

export const SearchFilters = styled.div`
  display: flex;
  gap: 6px;
`;

export const FilterChip = styled.button`
  padding: 4px 10px;
  border-radius: 20px;
  border: none;
  font-size: 12px;
  cursor: pointer;
  background: ${({ active }) => (active ? "#0ea5ff" : "#f3f4f6")};
  color: ${({ active }) => (active ? "#ffffff" : "#4b5563")};
  font-weight: 500;

  &:hover {
    background: ${({ active }) => (active ? "#0284c7" : "#e5e7eb")};
  }
`;

/* SEARCH SUGGESTIONS DROPDOWN */

export const SuggestBox = styled.div`
  position: absolute;
  top: 46px;
  left: 0;
  width: 100%;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  max-height: 260px;
  overflow-y: auto;
  z-index: 1500;
`;

export const SuggestItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;

  &:hover {
    background: #f3f4f6;
  }
`;

export const SuggestText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const SuggestTitle = styled.span`
  font-weight: 500;
  color: #111827;
`;

export const SuggestMeta = styled.span`
  font-size: 11px;
  color: #6b7280;
`;

export const SuggestType = styled.span`
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
`;

export const SuggestEmpty = styled.div`
  padding: 12px;
  font-size: 13px;
  color: #6b7280;
`;

/* RIGHT SIDE */

export const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

export const IconBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  color: #0e1522;
  position: relative;

  &.mobile-only {
    display: none;
  }

  @media (max-width: 768px) {
    &.mobile-only {
      display: flex;
    }
  }

  &:hover {
    opacity: 0.6;
  }
`;

export const UnreadDot = styled.span`
  position: absolute;
  top: 2px;
  right: 1px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ef4444;
`;

/* BUTTON / AVATAR */

export const CreateBtn = styled.button`
  display: flex;
  gap: 6px;
  align-items: center;
  background: #0ea5ff;
  color: #fff;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    opacity: 0.85;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 13px;
  }
`;

export const ProfileImg = styled.div`
  cursor: pointer;

  img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.08);
  }
`;
