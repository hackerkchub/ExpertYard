import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaRecycle, FaSpinner, FaTrashRestore, FaUserSlash } from "react-icons/fa";

import {
  getDeletedExpertsApi,
  restoreDeletedExpertApi,
} from "../../../shared/api/admin/expert.api";

const Page = styled.div`
  min-height: 100vh;
  padding: 24px;
  background: #f5f7fb;

  @media (max-width: 768px) {
    padding: 14px;
  }
`;

const Card = styled.div`
  overflow: hidden;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 26px;
  color: #ffffff;
  background: linear-gradient(135deg, #1f2937 0%, #4f46e5 100%);

  h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    font-size: 24px;
  }

  p {
    margin: 6px 0 0;
    color: rgba(255, 255, 255, 0.82);
    font-size: 13px;
  }

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
    padding: 18px;
  }
`;

const RefreshButton = styled.button`
  min-height: 40px;
  border: 0;
  border-radius: 10px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1f2937;
  background: #ffffff;
  font-weight: 700;
  cursor: pointer;
`;

const TableWrap = styled.div`
  overflow-x: auto;
  padding: 18px;
`;

const Table = styled.table`
  width: 100%;
  min-width: 880px;
  border-collapse: separate;
  border-spacing: 0 10px;
`;

const Th = styled.th`
  padding: 12px;
  color: #64748b;
  background: #f8fafc;
  font-size: 12px;
  font-weight: 800;
  text-align: left;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: 14px 12px;
  background: #ffffff;
  border-top: 1px solid #eef2f7;
  border-bottom: 1px solid #eef2f7;
  color: #334155;
  font-size: 14px;

  &:first-child {
    border-left: 1px solid #eef2f7;
    border-radius: 12px 0 0 12px;
  }

  &:last-child {
    border-right: 1px solid #eef2f7;
    border-radius: 0 12px 12px 0;
  }
`;

const ExpertName = styled.div`
  font-weight: 800;
  color: #111827;

  small {
    display: block;
    margin-top: 3px;
    color: #64748b;
    font-weight: 600;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  padding: 5px 10px;
  border-radius: 999px;
  color: ${(props) => (props.$restored ? "#166534" : "#991b1b")};
  background: ${(props) => (props.$restored ? "#dcfce7" : "#fee2e2")};
  font-size: 12px;
  font-weight: 800;
`;

const RestoreButton = styled.button`
  min-height: 36px;
  border: 0;
  border-radius: 9px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #ffffff;
  background: #16a34a;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const State = styled.div`
  padding: 56px 20px;
  color: #64748b;
  text-align: center;

  svg {
    margin-bottom: 12px;
    color: #94a3b8;
    font-size: 42px;
  }
`;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

export default function DeletedExperts() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);

  const loadRows = async () => {
    try {
      setLoading(true);
      const { data } = await getDeletedExpertsApi({ limit: 50 });
      setRows(data.data || []);
    } catch (err) {
      console.error("Deleted experts load failed:", err);
      alert(typeof err === "string" ? err : "Failed to load deleted experts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, []);

  const restore = async (row) => {
    if (!window.confirm(`Restore ${row.name}? This expert will become active again.`)) return;

    try {
      setRestoringId(row.id);
      await restoreDeletedExpertApi(row.id);
      await loadRows();
      alert("Expert restored successfully");
    } catch (err) {
      console.error("Restore failed:", err);
      alert(typeof err === "string" ? err : "Restore failed");
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <Page>
      <Card>
        <Header>
          <div>
            <h2><FaUserSlash /> Deleted Experts</h2>
            <p>Experts removed from the platform and available for restore.</p>
          </div>
          <RefreshButton type="button" onClick={loadRows}>
            <FaRecycle /> Refresh
          </RefreshButton>
        </Header>

        {loading ? (
          <State>
            <FaSpinner />
            <p>Loading deleted experts...</p>
          </State>
        ) : rows.length === 0 ? (
          <State>
            <FaUserSlash />
            <h3>No deleted experts found</h3>
          </State>
        ) : (
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th>Expert</Th>
                  <Th>Mobile / Email</Th>
                  <Th>Category</Th>
                  <Th>City / Location</Th>
                  <Th>Deleted Date</Th>
                  <Th>Deleted By</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <Td>
                      <ExpertName>
                        {row.name}
                        <small>ID: {row.original_expert_id}</small>
                      </ExpertName>
                    </Td>
                    <Td>
                      {row.phone || "-"}
                      <br />
                      <small>{row.email || "-"}</small>
                    </Td>
                    <Td>{row.category_name || row.category_id || "-"}</Td>
                    <Td>{row.city || row.location || "-"}</Td>
                    <Td>{formatDate(row.deleted_at)}</Td>
                    <Td>{row.deleted_by_admin_name || row.deleted_by_admin_id || "-"}</Td>
                    <Td><Badge $restored={row.status === "restored"}>{row.status}</Badge></Td>
                    <Td>
                      <RestoreButton
                        type="button"
                        disabled={row.status === "restored" || restoringId === row.id}
                        onClick={() => restore(row)}
                      >
                        {restoringId === row.id ? <FaSpinner /> : <FaTrashRestore />}
                        Restore
                      </RestoreButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        )}
      </Card>
    </Page>
  );
}
