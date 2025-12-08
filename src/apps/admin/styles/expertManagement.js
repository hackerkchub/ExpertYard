import styled from "styled-components";

export const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;

  h3 {
    margin: 0;
  }

  button {
    background: #0ea5ff;
    color: #fff;
    padding: 8px 12px;
    border-radius: 8px;
  }
`;

export const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
`;

export const SearchInput = styled.input`
  padding: 8px;
  border-radius: 6px;
  min-width: 160px;
  flex: 1 1 150px;
  background: #0d1318;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.08);
`;

export const SelectBox = styled.select`
  padding: 8px;
  border-radius: 6px;
  flex: 1 1 150px;
  background: #0d1318;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.08);
`;

export const ResetButton = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  background: #ccc;
  flex: 1 1 100px;
`;

export const Photo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;
