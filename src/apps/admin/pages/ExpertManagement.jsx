// src/apps/admin/pages/ExpertManagement.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaPlus, 
  FaSearch, 
  FaFilter,
  FaUserGraduate,
  FaEnvelope,
  FaTag,
  FaLayerGroup,
  FaToggleOn,
  FaToggleOff,
  FaSpinner
} from "react-icons/fa";

// API IMPORTS
import { 
  getAllExpertsApi, 
  deleteExpertApi 
} from "../../../shared/api/admin/expert.api";

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

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  @media (max-width: 768px) {
    padding: 20px;
    flex-direction: column;
    gap: 16px;
    text-align: center;
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

const AddButton = styled.button`
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
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

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 16px;
  align-items: end;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr auto auto;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #adb5bd;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
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

const StyledSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ResetBtn = styled.button`
  padding: 12px 24px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  
  &:hover {
    background: #5a6268;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
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
  font-size: 14px;
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
    font-size: 12px;
  }
`;

const Tr = styled.tr`
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Td = styled.td`
  padding: 16px 12px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  
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

const ExpertPhoto = styled.img`
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

const ExpertName = styled.div`
  font-weight: 700;
  color: #212529;
  margin-bottom: 4px;
  font-size: 15px;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ExpertEmail = styled.div`
  font-size: 12px;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    font-size: 10px;
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
  background: ${props => props.$enabled ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$enabled ? '#155724' : '#721c24'};
  
  svg {
    font-size: 14px;
  }
  
  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 11px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const ActionBtn = styled.button`
  padding: 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color || '#f8f9fa'};
  color: ${props => props.$textColor || '#495057'};
  
  &:hover {
    transform: scale(1.05);
    background: ${props => props.$hover || '#e9ecef'};
  }
  
  @media (max-width: 768px) {
    padding: 6px;
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

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  h4 {
    margin: 0 0 8px;
    color: #6c757d;
    font-size: 14px;
  }
  
  .stat-number {
    font-size: 32px;
    font-weight: 700;
    color: #667eea;
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    
    .stat-number {
      font-size: 24px;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

// Main Component
export default function ExpertManagement() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const { data } = await getAllExpertsApi();
      
      setRows(
        data.data.map((e) => ({
          id: e.id,
          name: e.name,
          email: e.email,
          category: e.category_name || e.category_id || "-",
          subcategory: e.subcategory_name || e.subcategory_id || "-",
          photo: e.profile_photo || "https://via.placeholder.com/48",
          status: e.status === 1 ? "ENABLED" : "DISABLED"
        }))
      );
    } catch (err) {
      console.error("Error fetching experts:", err);
      alert("Failed to load experts");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this expert? This action cannot be undone.")) return;

    try {
      await deleteExpertApi(id);
      setRows(rows.filter((r) => r.id !== id));
      alert("Expert deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed. Please try again.");
    }
  };

  const filteredData = rows.filter((r) => {
    return (
      (r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase())) &&
      (category ? r.category === category : true) &&
      (subcategory ? r.subcategory === subcategory : true)
    );
  });

  const allCategories = [...new Set(rows.map((i) => i.category))];
  const allSubcategories = [...new Set(rows.map((i) => i.subcategory))];
  
  const stats = {
    total: rows.length,
    enabled: rows.filter(r => r.status === "ENABLED").length,
    disabled: rows.filter(r => r.status === "DISABLED").length
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
            <h2>Expert Management</h2>
            <p>Manage and oversee all expert profiles</p>
          </HeaderTitle>
          <AddButton onClick={() => navigate("/admin/expert/add")}>
            <FaPlus /> Add New Expert
          </AddButton>
        </Header>

        <FilterSection>
          <StatsGrid>
            <StatCard>
              <h4>Total Experts</h4>
              <div className="stat-number">{stats.total}</div>
            </StatCard>
            <StatCard>
              <h4>Active Experts</h4>
              <div className="stat-number" style={{ color: '#28a745' }}>{stats.enabled}</div>
            </StatCard>
            <StatCard>
              <h4>Inactive Experts</h4>
              <div className="stat-number" style={{ color: '#dc3545' }}>{stats.disabled}</div>
            </StatCard>
          </StatsGrid>
          
          <FilterGrid>
            <InputWrapper>
              <FaSearch />
              <StyledInput
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputWrapper>

            <StyledSelect
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {allCategories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </StyledSelect>

            <StyledSelect
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            >
              <option value="">All Subcategories</option>
              {allSubcategories.map((sc, i) => (
                <option key={i} value={sc}>{sc}</option>
              ))}
            </StyledSelect>

            <ResetBtn onClick={() => {
              setSearch("");
              setCategory("");
              setSubcategory("");
            }}>
              <FaFilter /> Reset Filters
            </ResetBtn>
          </FilterGrid>
        </FilterSection>

        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <Th>Expert</Th>
                <Th>Category</Th>
                <Th>Subcategory</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <Td colSpan="5">
                    <EmptyState>
                      <FaUserGraduate />
                      <h3>No experts found</h3>
                      <p>Try adjusting your filters or add a new expert</p>
                    </EmptyState>
                  </Td>
                </tr>
              ) : (
                filteredData.map((r) => (
                  <Tr key={r.id}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ExpertPhoto src={r.photo} alt={r.name} />
                        <div>
                          <ExpertName>{r.name}</ExpertName>
                          <ExpertEmail>
                            <FaEnvelope /> {r.email}
                          </ExpertEmail>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaTag style={{ color: '#667eea', fontSize: '12px' }} />
                        {r.category}
                      </div>
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaLayerGroup style={{ color: '#764ba2', fontSize: '12px' }} />
                        {r.subcategory}
                      </div>
                    </Td>
                    <Td>
                      <StatusBadge $enabled={r.status === "ENABLED"}>
                        {r.status === "ENABLED" ? <FaToggleOn /> : <FaToggleOff />}
                        {r.status}
                      </StatusBadge>
                    </Td>
                    <Td>
                      <ActionButtons>
                        <ActionBtn
                          title="View Full Profile"
                          onClick={() => navigate(`/admin/expert/${r.id}`)}
                          $color="#e3f2fd"
                          $textColor="#1976d2"
                          $hover="#bbdef5"
                        >
                          <FaEye />
                        </ActionBtn>
                        {/* <ActionBtn
                          title="Edit Expert"
                          onClick={() => navigate(`/admin/expert/edit/${r.id}`)}
                          $color="#fff3e0"
                          $textColor="#f57c00"
                          $hover="#ffe0b2"
                        >
                          <FaEdit />
                        </ActionBtn> */}
                        <ActionBtn
                          title="Delete Expert"
                          onClick={() => remove(r.id)}
                          $color="#ffebee"
                          $textColor="#d32f2f"
                          $hover="#ffcdd2"
                        >
                          <FaTrash />
                        </ActionBtn>
                      </ActionButtons>
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