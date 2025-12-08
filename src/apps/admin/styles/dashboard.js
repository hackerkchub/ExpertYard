import styled from "styled-components";

export const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin: 18px 0;
  align-items: center;
  flex-wrap: wrap;

  input, select {
    background: #0d1318;
    border: 1px solid rgba(255,255,255,0.08);
    padding: 10px 12px;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
  }

  input { flex: 1; }
  select { min-width: 150px; }
`;

export const SectionBox = styled.div`
  background: #0c1116;
  border: 1px solid rgba(255,255,255,0.05);
  padding: 18px;
  border-radius: 10px;
  flex: 1;

  button {
    background: #0ea5ff;
    border: none;
    color: #fff;
    padding: 8px 14px;
    border-radius: 8px;
    margin-top: 10px;
    cursor: pointer;
    transition: 0.3s ease;

    &:hover {
      background: #38bdf8;
      transform: translateY(-1px);
    }
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 22px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const RecentList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;

  li {
    margin-bottom: 10px;
    color: #cbd5e1;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
