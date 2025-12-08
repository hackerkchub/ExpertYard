import styled from "styled-components";

export const HeaderBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;

  h3 {
    margin: 0;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const FilterButton = styled.button`
  background: #1e293b;
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const AddButton = styled.button`
  background: #0ea5ff;
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
`;

export const SearchInput = styled.input`
  background: #0c1116;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 10px 14px;
  border-radius: 8px;
  color: #fff;
  width: 100%;
  margin-bottom: 12px;
`;

export const SelectFilter = styled.select`
  background: #0c1116;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 10px 14px;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 15px;
`;
