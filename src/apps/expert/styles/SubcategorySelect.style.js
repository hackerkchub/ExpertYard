import styled from "styled-components";

/* ================= 🌍 1. MAIN SPLIT LAYOUT ================= */
export const CategorySplitWrapper = styled.div`
  display: flex;
  gap: 24px;
  height: calc(100vh - 180px);
  position: relative;

  @media (max-width: 1024px) {
    height: calc(100vh - 160px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding-bottom: 120px; 
    gap: 16px;
  }
`;

export const CategoryLeftScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 12px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    overflow-y: visible;
    padding-right: 0;
  }
`;

export const CategoryRightFixed = styled.div`
  width: 340px;
  position: sticky;
  top: 0;
  height: fit-content;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 992px) {
    width: 300px;
    padding: 20px;
  }

  @media (max-width: 768px) {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.08);
    background: #ffffff;
    padding: 16px;
    gap: 12px;
    border-top: 1px solid #e2e8f0;
  }
`;

/* ================= 🔍 2. SEARCH & STATS ================= */
export const CategorySearch = styled.div`
  width: 100%;
  margin-bottom: 24px;

  input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #0ea5ff;
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
    }
  }
`;

export const SubcategorySearch = styled(CategorySearch)`
  input:focus {
    border-color: #10b981; /* Green for subcategory */
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
  }
`;

export const SelectionStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  div {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const SelectedCount = styled.span`
  background: #10b981;
  color: #fff !important;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px !important;
  font-weight: 600;
`;

/* ================= 📦 3. CARDS & GRID ================= */
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const SelectCard = styled.button`
  width: 100%;
  border: 2px solid ${(props) => (props.active ? "#0ea5ff" : "#e2e8f0")};
  background: ${(props) => (props.active ? "#f0f9ff" : "#fff")};
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: #38bdf8;
    background: #f8fafc;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 12px;
    &:hover {
      transform: none;
    }
  }
`;

export const CardTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 2px 0;
`;

export const CardMeta = styled.p`
  font-size: 12px;
  color: #64748b;
  margin: 0;
`;

/* ================= 🖼️ 4. PREVIEW & EMPTY STATES ================= */
export const SelectionPreviewBox = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px dashed #cbd5e1;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h3 {
    font-size: 13px;
    color: #64748b;
    margin: 0 0 12px 0;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: 100%;
    text-align: center;
  }

  @media (max-width: 768px) {
    display: none; 
  }
`;

export const CategoryEmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #64748b;

  h3 {
    margin: 0 0 8px 0;
    color: #1e293b;
  }
`;

export const SubcategoryEmptyState = styled(CategoryEmptyState)`
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  background: #fff;
`;

/* ================= 🚀 5. ACTIONS & BUTTONS ================= */
export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
`;

export const PrimaryButton = styled.button`
  background: #0ea5ff;
  color: #fff;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 100%;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #0284c7;
  }
`;

export const SecondaryButton = styled.button`
  background: #fff;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }

  @media (max-width: 768px) {
    order: 2; /* Back button नीचे आएगा मोबाइल में */
  }
`;