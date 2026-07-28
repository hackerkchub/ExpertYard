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
  FaSpinner,
  FaSave,
  FaGift,
  FaCheckSquare,
  FaSquare,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaBan,
  FaChevronDown,
  FaCheck,
  FaPhone // Added Phone Icon
} from "react-icons/fa";

// API IMPORTS - Use the correct bulk functions
import { 
  getAllExpertsApi, 
  deleteExpertApi,
  updateExpertRankApi,
  bulkExpireExpertTrialsApi,
  bulkExtendExpertTrialsApi,
  bulkResetExpertTrialsApi
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

// Bulk Action Bar
const BulkActionBar = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 24px;
  border-radius: 12px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  animation: ${fadeIn} 0.3s ease-out;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const BulkInfo = styled.span`
  font-weight: 600;
  font-size: 14px;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const BulkSelect = styled.select`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: white;
  color: #212529;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  min-width: 120px;
  
  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
  }
`;

const BulkButton = styled.button`
  padding: 8px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$primary ? 'white' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.$primary ? '#667eea' : 'white'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    background: ${props => props.$primary ? '#f0f0f0' : 'rgba(255, 255, 255, 0.3)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
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
  margin-bottom: 2px;
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

// 👇 NEW: Phone display
const ExpertPhone = styled.div`
  font-size: 12px;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
  
  svg {
    font-size: 10px;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #667eea;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
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

// Trial Status Badge
const TrialBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  
  ${props => {
    switch(props.$status) {
      case 'paid':
        return `
          background: #d1ecf1;
          color: #0c5460;
        `;
      case 'active':
        return `
          background: #d4edda;
          color: #155724;
        `;
      case 'expired':
        return `
          background: #f8d7da;
          color: #721c24;
        `;
      case 'converted':
        return `
          background: #d1ecf1;
          color: #0c5460;
        `;
      default:
        return `
          background: #e9ecef;
          color: #6c757d;
        `;
    }
  }}
  
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

const RankControls = styled.div`
  display: grid;
  grid-template-columns: 82px 92px;
  gap: 8px;
  align-items: center;
  min-width: 190px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    min-width: 150px;
  }
`;

const RankInput = styled.input`
  width: 82px;
  padding: 8px 10px;
  border: 1px solid #dfe3ea;
  border-radius: 8px;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
  }
`;

const RankToggle = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #495057;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;

  input {
    accent-color: #667eea;
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
    transform: none;
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
  const [savingRankId, setSavingRankId] = useState(null);
  const [bulkAction, setBulkAction] = useState("extend-24h");
  const [bulkProcessing, setBulkProcessing] = useState(false);
  
  // Selection state
  const [selectedExperts, setSelectedExperts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const response = await getAllExpertsApi();
      const data = response.data;
      
      // Debug: Log the first expert to check is_paid field
      if (data.data && data.data.length > 0) {
        console.log("First expert from API:", data.data[0]);
        console.log("All experts data:", data.data);
      }
      
      setRows(
        data.data.map((e) => ({
          id: e.id,
          name: e.name,
          email: e.email,
          phone: e.phone || "", // 👈 Added phone field
          category: e.category_name || e.category_id || "-",
          subcategory: e.subcategory_name || e.subcategory_id || "-",
          photo: e.profile_photo || "https://via.placeholder.com/48",
          status: e.status === 1 ? "ENABLED" : "DISABLED",
          manual_rank: e.manual_rank || "",
          rank_enabled: e.rank_enabled === 1 || e.rank_enabled === true,
          rank_context: e.rank_context || "call_chat",
          // Trial fields
          trial_enabled: e.trial_enabled === 1 || e.trial_enabled === true,
          trial_status: e.trial_status || "disabled",
          trial_end_at: e.trial_end_at,
          remaining_hours: e.remaining_hours || 0,
          // Paid status - Backend decides
          is_paid: Number(e.is_paid) === 1
        }))
      );
      
      // Reset selections
      setSelectedExperts([]);
      setSelectAll(false);
    } catch (err) {
      console.error("Error fetching experts:", err);
      alert("Failed to load experts");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("This expert will be removed from platform but saved in Deleted Experts for restore.")) return;

    try {
      await deleteExpertApi(id);
      setRows(rows.filter((r) => r.id !== id));
      // Remove from selected if present
      setSelectedExperts(selectedExperts.filter(expId => expId !== id));
      alert("Expert moved to Deleted Experts.");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed. Please try again.");
    }
  };

  const updateRankRow = (id, patch) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  };

  const saveRank = async (row) => {
    const rankValue = row.manual_rank === "" || row.manual_rank === null || row.manual_rank === undefined
      ? null
      : Number(row.manual_rank);

    if (row.rank_enabled && (!Number.isInteger(rankValue) || rankValue < 1)) {
      alert("Manual rank must be a positive integer when ranking is enabled.");
      return;
    }

    try {
      setSavingRankId(row.id);
      await updateExpertRankApi(row.id, {
        rank_enabled: row.rank_enabled,
        manual_rank: rankValue,
        rank_context: row.rank_context || "call_chat",
      });
      await fetchExperts();
      alert("Expert rank updated successfully");
    } catch (err) {
      console.error("Rank update failed:", err);
      alert(typeof err === "string" ? err : "Rank update failed");
    } finally {
      setSavingRankId(null);
    }
  };

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedExperts([]);
    } else {
      // Only select non-paid experts
      const selectableExperts = filteredData
        .filter(r => !r.is_paid)
        .map(r => r.id);
      setSelectedExperts(selectableExperts);
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectExpert = (id) => {
    setSelectedExperts(prev => {
      if (prev.includes(id)) {
        return prev.filter(expId => expId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Bulk action handler
  const handleBulkAction = async () => {
    if (selectedExperts.length === 0) {
      alert("Please select at least one expert.");
      return;
    }

    const action = bulkAction;
    let confirmMessage = "";
    let hours = 72;

    switch (action) {
      case "extend-24h":
        confirmMessage = `Extend trial by 24 hours for ${selectedExperts.length} expert(s)?`;
        hours = 24;
        break;
      case "extend-72h":
        confirmMessage = `Extend trial by 72 hours for ${selectedExperts.length} expert(s)?`;
        hours = 72;
        break;
      case "extend-7d":
        confirmMessage = `Extend trial by 7 days for ${selectedExperts.length} expert(s)?`;
        hours = 168; // 7 days
        break;
      case "expire":
        confirmMessage = `Expire trial for ${selectedExperts.length} expert(s)?`;
        break;
      case "reset":
        confirmMessage = `Reset trial for ${selectedExperts.length} expert(s)?`;
        hours = 72;
        break;
      default:
        alert("Invalid action selected.");
        return;
    }

    if (!window.confirm(confirmMessage)) return;

    try {
      setBulkProcessing(true);
      
      let response;
      // Call the appropriate bulk API based on action
      if (action === "expire") {
        response = await bulkExpireExpertTrialsApi(selectedExperts);
      } else if (action === "reset") {
        response = await bulkResetExpertTrialsApi(selectedExperts, hours);
      } else {
        // extend actions
        response = await bulkExtendExpertTrialsApi(selectedExperts, hours);
      }
      
      // Extract updated and failed from response
      const { updated = [], failed = [] } = response.data.data || response.data || {};
      
      await fetchExperts();
      
      // Build detailed success message
      let message = `✅ Updated : ${updated.length} expert(s)`;
      
      if (failed.length > 0) {
        const paidCount = failed.filter(f => 
          f.reason && (
            f.reason.includes("active subscription") || 
            f.reason.includes("paid")
          )
        ).length;
        
        message += `\n⚠️ Skipped : ${failed.length} expert(s)`;
        
        if (paidCount > 0) {
          message += ` (${paidCount} paid)`;
        }
        
        // Show first 3 failure details
        if (failed.length <= 3) {
          failed.forEach(f => {
            message += `\n   • Expert #${f.expert_id}: ${f.reason}`;
          });
        } else {
          message += `\n   • ${failed.length} experts failed. Check logs for details.`;
        }
      }
      
      alert(message);
      
      setSelectedExperts([]);
      setSelectAll(false);
    } catch (err) {
      console.error("Bulk action failed:", err);
      alert("Bulk action failed. Please try again.");
    } finally {
      setBulkProcessing(false);
    }
  };

  // Get trial status display
  const getTrialDisplay = (row) => {
    // Check if expert is paid first
    if (row.is_paid) {
      return {
        label: "Paid Plan",
        status: "paid",
        icon: <FaCheck />
      };
    }

    if (!row.trial_enabled) {
      return {
        label: "Disabled",
        status: "disabled",
        icon: <FaBan />
      };
    }

    switch (row.trial_status) {
      case "active":
        return {
          label: `Active (${Math.floor(row.remaining_hours)}h ${Math.floor((row.remaining_hours % 1) * 60)}m)`,
          status: "active",
          icon: <FaClock />
        };
      case "expired":
        return {
          label: "Expired",
          status: "expired",
          icon: <FaExclamationCircle />
        };
      case "converted":
        return {
          label: "Converted",
          status: "converted",
          icon: <FaCheckCircle />
        };
      default:
        return {
          label: "Disabled",
          status: "disabled",
          icon: <FaBan />
        };
    }
  };

  // 👇 Updated Filter to include Phone number
  const filteredData = rows.filter((r) => {
    const searchLower = search.toLowerCase();
    return (
      (r.name.toLowerCase().includes(searchLower) ||
        r.email.toLowerCase().includes(searchLower) ||
        (r.phone && r.phone.includes(searchLower))) && // 👈 Search by Phone
      (category ? r.category === category : true) &&
      (subcategory ? r.subcategory === subcategory : true)
    );
  });

  const allCategories = [...new Set(rows.map((i) => i.category))];
  const allSubcategories = [...new Set(rows.map((i) => i.subcategory))];
  
  const stats = {
    total: rows.length,
    enabled: rows.filter(r => r.status === "ENABLED").length,
    disabled: rows.filter(r => r.status === "DISABLED").length,
    paid: rows.filter(r => r.is_paid).length
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
              <h4>Paid Experts</h4>
              <div className="stat-number" style={{ color: '#17a2b8' }}>{stats.paid}</div>
            </StatCard>
          </StatsGrid>
          
          <FilterGrid>
            <InputWrapper>
              <FaSearch />
              <StyledInput
                placeholder="Search by name, email, or phone..."
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

        {/* Bulk Action Bar */}
        {selectedExperts.length > 0 && (
          <div style={{ padding: "0 32px" }}>
            <BulkActionBar>
              <BulkInfo>
                <FaCheckSquare style={{ marginRight: "8px" }} />
                Selected: {selectedExperts.length} Expert{selectedExperts.length > 1 ? 's' : ''}
              </BulkInfo>
              
              <BulkSelect 
                value={bulkAction} 
                onChange={(e) => setBulkAction(e.target.value)}
              >
                <option value="extend-24h">⏱ Extend 24 Hours</option>
                <option value="extend-72h">⏱ Extend 72 Hours</option>
                <option value="extend-7d">📅 Extend 7 Days</option>
                <option value="expire">🚫 Expire</option>
                <option value="reset">🔄 Reset</option>
              </BulkSelect>
              
              <BulkButton 
                $primary 
                onClick={handleBulkAction}
                disabled={bulkProcessing}
              >
                {bulkProcessing ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : 'Apply'}
              </BulkButton>
              
              <BulkButton 
                onClick={() => {
                  setSelectedExperts([]);
                  setSelectAll(false);
                }}
                disabled={bulkProcessing}
              >
                Clear
              </BulkButton>
            </BulkActionBar>
          </div>
        )}

        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <Th style={{ width: '40px' }}>
                  <CheckboxWrapper>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      disabled={filteredData.length === 0 || filteredData.every(r => r.is_paid)}
                    />
                  </CheckboxWrapper>
                </Th>
                <Th>Expert</Th>
                <Th>Category</Th>
                <Th>Subcategory</Th>
                <Th>Trial</Th>
                <Th>Manual Rank</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <Td colSpan="8">
                    <EmptyState>
                      <FaUserGraduate />
                      <h3>No experts found</h3>
                      <p>Try adjusting your filters or add a new expert</p>
                    </EmptyState>
                  </Td>
                </tr>
              ) : (
                filteredData.map((r) => {
                  const trialInfo = getTrialDisplay(r);
                  const isPaid = r.is_paid;
                  return (
                    <Tr key={r.id}>
                      <Td>
                        <CheckboxWrapper>
                          <input
                            type="checkbox"
                            checked={selectedExperts.includes(r.id)}
                            disabled={isPaid}
                            onChange={() => toggleSelectExpert(r.id)}
                            title={isPaid ? "Paid experts cannot be selected for bulk trial actions" : ""}
                          />
                        </CheckboxWrapper>
                      </Td>
                      <Td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <ExpertPhoto src={r.photo} alt={r.name} />
                          <div>
                            <ExpertName>{r.name}</ExpertName>
                            <ExpertEmail>
                              <FaEnvelope /> {r.email}
                            </ExpertEmail>
                            {/* 👇 Display Phone Number below Email */}
                            <ExpertPhone>
                              <FaPhone /> {r.phone || 'N/A'}
                            </ExpertPhone>
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
                        <TrialBadge $status={trialInfo.status}>
                          {trialInfo.icon}
                          {trialInfo.label}
                        </TrialBadge>
                      </Td>
                      <Td>
                        <RankControls>
                          <RankInput
                            type="number"
                            min="1"
                            placeholder="Rank"
                            value={r.manual_rank}
                            onChange={(event) => updateRankRow(r.id, { manual_rank: event.target.value })}
                          />
                          <RankToggle>
                            <input
                              type="checkbox"
                              checked={r.rank_enabled}
                              onChange={(event) => updateRankRow(r.id, { rank_enabled: event.target.checked })}
                            />
                            Enabled
                          </RankToggle>
                        </RankControls>
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
                          <ActionBtn
                            title="Trial Management"
                            onClick={() => navigate(`/admin/expert/${r.id}`)}
                            $color="#f3e5f5"
                            $textColor="#7b1fa2"
                            $hover="#e1bee7"
                          >
                            <FaGift />
                          </ActionBtn>
                          <ActionBtn
                            title="Save Rank"
                            onClick={() => saveRank(r)}
                            disabled={savingRankId === r.id}
                            $color="#e8f5e9"
                            $textColor="#2e7d32"
                            $hover="#c8e6c9"
                          >
                            {savingRankId === r.id ? <FaSpinner /> : <FaSave />}
                          </ActionBtn>
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
                  );
                })
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Card>
    </Container>
  );
}