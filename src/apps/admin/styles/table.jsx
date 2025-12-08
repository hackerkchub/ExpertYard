import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";

export const TableContainer = styled.div`
  background: linear-gradient(180deg,#0f1419,#0b0f12);
  border-radius:12px;
  padding:16px;
  box-shadow: 0 8px 24px rgba(2,6,23,0.6);
  margin-top:12px;
`;

export const Table = styled.table`
  width:100%;
  border-collapse:collapse;
`;

export const TableHead = styled.thead`
  tr { border-bottom:1px solid rgba(255,255,255,0.04); }
`;

export const TableRow = styled.tr`
  &:nth-child(even){ background: rgba(255,255,255,0.01); }
`;

export const TableCell = styled.td`
  padding:12px 10px;
  color:#cbd6e2;
  font-size:14px;
`;

export const StatusTag = styled.span`
  padding:6px 10px;
  border-radius:12px;
  font-weight:600;
  font-size:12px;
  color:${(p) => (p.$enabled ? "#052e1f" : "#3b0a0a")};
  background:${(p) => (p.$enabled ? "#bff0d6" : "#f5c8c8")};
`;

export const ActionsCell = styled.div`
  display:flex; gap:10px; align-items:center;
  button { background:transparent; border:none; cursor:pointer; color:#9fb3c7; }
`;

export const SwitchToggle = styled.input.attrs({ type: "checkbox" })`
  width:44px; height:24px; appearance:none; background:#2b3036; border-radius:20px; position:relative;
  cursor:pointer; border:1px solid rgba(255,255,255,0.03);

  &:before{
    content:""; position:absolute; left:4px; top:4px; width:16px; height:16px; border-radius:50%; background:#fff; transition:0.22s;
    transform: translateX(${(p)=> (p.checked ? '20px' : '0px')});
  }
  &:checked { background: linear-gradient(90deg,#00d4ff,#00c899); }
`;

const SearchBar = {
  background: "#0c1116",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "10px 14px",
  borderRadius: "8px",
  color: "#fff",
  width: "100%",
  fontSize: "14px",
  outline: "none",
};
