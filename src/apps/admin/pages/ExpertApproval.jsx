// src/apps/admin/pages/ExpertApproval.jsx

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { 
  FaUserCircle, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSearch, 
  FaFilter,
  FaPhoneAlt,
  FaEnvelope,
  FaIdCard,
  FaSpinner,
  FaUserCheck,
  FaUserSlash,
  FaToggleOn,
  FaToggleOff
} from "react-icons/fa";

// 🔗 APIs
import {
  getAllExpertsApi,
  updateExpertStatusApi
} from "../../../shared/api/admin/expert.api";

import {
  getAllExpertProfilesApi
} from "../../../shared/api/expertapi/expert.api";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// Styled Components
const Container = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.div`
  padding: 24px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const HeaderTitle = styled.div`
  h2 {
    font-size: 28px;
    margin: 0;
    font-weight: 700;
    letter-spacing: -0.5px;
  }
  
  p {
    margin: 8px 0 0;
    opacity: 0.9;
    font-size: 14px;
  }
  
  @media (max-width: 768px) {
    h2 {
      font-size: 24px;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.3);
  }
  
  h4 {
    margin: 0 0 8px;
    font-size: 13px;
    opacity: 0.9;
    font-weight: 500;
  }
  
  .stat-number {
    font-size: 28px;
    font-weight: 700;
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    
    .stat-number {
      font-size: 24px;
    }
  }
`;

const FilterSection = styled.div`
  padding: 24px 32px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
  
  svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #adb5bd;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterChip = styled.button`
  padding: 8px 20px;
  border-radius: 20px;
  border: 2px solid ${props => props.$active ? '#667eea' : '#e9ecef'};
  background: ${props => props.$active ? '#667eea' : 'white'};
  color: ${props => props.$active ? 'white' : '#495057'};
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    border-color: #667eea;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  padding: 0 32px 32px;
  
  @media (max-width: 768px) {
    padding: 0 20px 20px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
  
  @media (max-width: 768px) {
    border-spacing: 0 8px;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 16px 12px;
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:first-child {
    border-radius: 12px 0 0 12px;
  }
  
  &:last-child {
    border-radius: 0 12px 12px 0;
  }
  
  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 11px;
  }
`;

const Tr = styled.tr`
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    td {
      background: #f8f9fa;
    }
  }
`;

const Td = styled.td`
  padding: 16px 12px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  transition: background 0.3s ease;
  
  &:first-child {
    border-radius: 12px 0 0 12px;
  }
  
  &:last-child {
    border-radius: 0 12px 12px 0;
  }
  
  @media (max-width: 768px) {
    padding: 12px 8px;
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const ProfileIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  
  svg {
    font-size: 28px;
    color: white;
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    
    svg {
      font-size: 24px;
    }
  }
`;

const ExpertInfo = styled.div`
  .name {
    font-weight: 700;
    color: #212529;
    margin-bottom: 4px;
    font-size: 15px;
  }
  
  .details {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #6c757d;
    
    span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    svg {
      font-size: 10px;
    }
  }
  
  @media (max-width: 768px) {
    .name {
      font-size: 14px;
    }
    
    .details {
      flex-direction: column;
      gap: 4px;
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$approved ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$approved ? '#155724' : '#721c24'};
  
  svg {
    font-size: 14px;
  }
  
  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 11px;
  }
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$approve ? '#10b981' : '#ef4444'};
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: ${props => props.$approve ? '#059669' : '#dc2626'};
  }
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 12px;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px;
  color: white;
  
  svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  color: #6c757d;
  
  svg {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  h3 {
    margin: 0 0 8px;
    font-size: 20px;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const LoadingRow = styled.tr`
  td {
    text-align: center;
    padding: 40px;
  }
  
  .skeleton {
    display: inline-block;
    width: 100%;
    height: 20px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: ${pulse} 1.5s ease-in-out infinite;
    border-radius: 4px;
  }
`;

export default function ExpertApproval() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadExperts();
  }, []);

  useEffect(() => {
    filterExperts();
  }, [searchTerm, statusFilter, rows]);

  const loadExperts = async () => {
    try {
      setLoading(true);
      const expertRes = await getAllExpertsApi();
      const experts = expertRes?.data?.data || [];
      const profileRes = await getAllExpertProfilesApi();
      const profiles = profileRes?.data?.data || [];

      const profileMap = {};
      profiles.forEach((p) => {
        profileMap[p.expert_id] = p.profile_photo;
      });

      const finalRows = experts.map((e) => ({
        expert_id: e.id,
        name: e.name,
        email: e.email,
        mobile: e.phone,
        status: e.status === 1 ? "APPROVED" : "DISABLED",
        profile_photo: profileMap[e.id] || null,
      }));

      setRows(finalRows);
    } catch (err) {
      console.error("Failed to load experts", err);
    } finally {
      setLoading(false);
    }
  };

  const filterExperts = () => {
    let filtered = [...rows];
    
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.expert_id.toString().includes(searchTerm)
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(r => 
        statusFilter === "approved" ? r.status === "APPROVED" : r.status === "DISABLED"
      );
    }
    
    setFilteredRows(filtered);
  };

  const toggleStatus = async (expert_id, currentStatus) => {
    const newStatus = currentStatus === "DISABLED" ? 1 : 0;

    try {
      setRows((prev) =>
        prev.map((r) =>
          r.expert_id === expert_id
            ? { ...r, status: newStatus === 1 ? "APPROVED" : "DISABLED" }
            : r
        )
      );

      await updateExpertStatusApi(expert_id, { status: newStatus });
    } catch (err) {
      console.error("Status update failed", err);
      loadExperts();
    }
  };

  const stats = {
    total: rows.length,
    approved: rows.filter(r => r.status === "APPROVED").length,
    disabled: rows.filter(r => r.status === "DISABLED").length,
    pending: rows.filter(r => r.status === "PENDING").length || 0
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <FaSpinner size={48} />
          <p>Loading experts...</p>
        </LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Header>
          <HeaderTitle>
            <h2>Expert Approval Management</h2>
            <p>Review and manage expert account statuses</p>
          </HeaderTitle>
          
          <StatsGrid>
            <StatCard>
              <h4>Total Experts</h4>
              <div className="stat-number">{stats.total}</div>
            </StatCard>
            <StatCard>
              <h4>Approved</h4>
              <div className="stat-number" style={{ color: '#10b981' }}>{stats.approved}</div>
            </StatCard>
            <StatCard>
              <h4>Disabled</h4>
              <div className="stat-number" style={{ color: '#ef4444' }}>{stats.disabled}</div>
            </StatCard>
            <StatCard>
              <h4>Pending Review</h4>
              <div className="stat-number" style={{ color: '#f59e0b' }}>{stats.pending}</div>
            </StatCard>
          </StatsGrid>
        </Header>

        <FilterSection>
          <SearchWrapper>
            <FaSearch />
            <SearchInput
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchWrapper>
          
          <FilterButtons>
            <FilterChip
              $active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            >
              All Experts
            </FilterChip>
            <FilterChip
              $active={statusFilter === "approved"}
              onClick={() => setStatusFilter("approved")}
            >
              <FaUserCheck style={{ marginRight: 4 }} /> Approved
            </FilterChip>
            <FilterChip
              $active={statusFilter === "disabled"}
              onClick={() => setStatusFilter("disabled")}
            >
              <FaUserSlash style={{ marginRight: 4 }} /> Disabled
            </FilterChip>
          </FilterButtons>
        </FilterSection>

        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <Th>Expert Profile</Th>
                <Th>Contact Info</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <EmptyState>
                      <FaUserCircle />
                      <h3>No experts found</h3>
                      <p>Try adjusting your search or filter criteria</p>
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                filteredRows.map((r) => (
                  <Tr key={r.expert_id}>
                    <Td>
                      <ProfileWrapper>
                        {r.profile_photo ? (
                          <ProfileImage 
                            src={r.profile_photo} 
                            alt={r.name}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        {!r.profile_photo && (
                          <ProfileIcon>
                            <FaUserCircle />
                          </ProfileIcon>
                        )}
                        <ExpertInfo>
                          <div className="name">{r.name}</div>
                          <div className="details">
                            <span><FaIdCard /> ID: {r.expert_id}</span>
                          </div>
                        </ExpertInfo>
                      </ProfileWrapper>
                    </Td>
                    <Td>
                      <ExpertInfo>
                        <div className="details">
                          <span><FaEnvelope /> {r.email}</span>
                          <span><FaPhoneAlt /> {r.mobile || 'N/A'}</span>
                        </div>
                      </ExpertInfo>
                    </Td>
                    <Td>
                      <StatusBadge $approved={r.status === "APPROVED"}>
                        {r.status === "APPROVED" ? <FaCheckCircle /> : <FaTimesCircle />}
                        {r.status}
                      </StatusBadge>
                    </Td>
                    <Td>
                      <ActionButton
                        $approve={r.status === "DISABLED"}
                        onClick={() => toggleStatus(r.expert_id, r.status)}
                      >
                        {r.status === "DISABLED" ? (
                          <>
                            <FaCheckCircle /> Approve
                          </>
                        ) : (
                          <>
                            <FaTimesCircle /> Disable
                          </>
                        )}
                      </ActionButton>
                    </Td>
                  </Tr>
                ))
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Card>
    </Container>
  );
}