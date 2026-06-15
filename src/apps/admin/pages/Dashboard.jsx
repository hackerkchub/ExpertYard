import React, { useState, useEffect, useCallback } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiBarChart2,
  FiSearch,
  FiRefreshCw,
  FiMessageSquare,
  FiStar,
} from "react-icons/fi";
import { MdPendingActions, MdVerified, MdWarning, MdOutlineRateReview } from "react-icons/md";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { BsGraphUp, BsLightningCharge, BsShieldCheck } from "react-icons/bs";

import {
  DashboardContainer,
  DashboardHeader,
  FilterBar,
  StatsSection,
  SectionTitle,
  StatsGrid,
  StatCard,
  StatIcon,
  StatLabel,
  StatValue,
  StatTrend,
  ContentGrid,
  SectionBox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  StatusBadge,
  ActionButton,
  RecentList,
  RecentItem,
  RecentAvatar,
  RecentInfo,
  RecentName,
  RecentMeta,
  RecentAmount,
  QuickActions,
  QuickActionButton,
  Row,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  LoadingSpinner,
  EmptyState,
  TextArea,
  Select,
  Input,
} from "../styles/dashboard";

import {
  getExpertRegistrationsApi,
  getExpertRegistrationDetailApi,
  updateExpertRegistrationStatusApi,
  getExpertRegistrationStatsApi,
} from "../../../shared/api/admin/expert.api";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    reviewed: 0,
    contacted: 0,
    approved: 0,
    rejected: 0,
  });
  const [filter, setFilter] = useState({
    search: "",
    status: "",
  });
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    adminNote: "",
  });
  const [updating, setUpdating] = useState(false);

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, registrationsRes] = await Promise.all([
        getExpertRegistrationStatsApi(),
        getExpertRegistrationsApi(filter.status || ""),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      if (registrationsRes.data.success) {
        setRegistrations(registrationsRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [filter.status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  // Apply search filter
  const filteredRegistrations = registrations.filter(reg => {
    if (!filter.search) return true;
    const searchTerm = filter.search.toLowerCase();
    return (
      reg.full_name.toLowerCase().includes(searchTerm) ||
      reg.mobile_number.includes(searchTerm) ||
      reg.category.toLowerCase().includes(searchTerm)
    );
  });

  // View registration details
  const handleViewDetails = async (id) => {
    try {
      const response = await getExpertRegistrationDetailApi(id);
      if (response.data.success) {
        setSelectedRegistration(response.data.data);
        setShowDetailModal(true);
        // Refresh list to update status
        fetchData();
      }
    } catch (error) {
      console.error("Error fetching registration details:", error);
    }
  };

  // Open status update modal
  const handleOpenStatusModal = (registration) => {
    setSelectedRegistration(registration);
    setStatusUpdate({
      status: registration.status,
      adminNote: registration.admin_note || "",
    });
    setShowStatusModal(true);
  };

  // Update status
  const handleUpdateStatus = async () => {
    if (!selectedRegistration) return;
    
    setUpdating(true);
    try {
      const response = await updateExpertRegistrationStatusApi(
        selectedRegistration.id,
        statusUpdate.status,
        statusUpdate.adminNote
      );
      
      if (response.data.success) {
        await fetchData();
        setShowStatusModal(false);
        setSelectedRegistration(null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    const variants = {
      new: "warning",
      reviewed: "info",
      contacted: "primary",
      approved: "success",
      rejected: "danger",
    };
    return variants[status] || "secondary";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Stat cards configuration
  const statCards = [
    { key: "total", label: "Total Registrations", icon: FiUsers, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
    { key: "new", label: "New", icon: FiClock, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
    { key: "reviewed", label: "Reviewed", icon: FiEye, color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)" },
    { key: "contacted", label: "Contacted", icon: FiMessageSquare, color: "#06b6d4", bg: "rgba(6, 182, 212, 0.1)" },
    { key: "approved", label: "Approved", icon: FiCheckCircle, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
    { key: "rejected", label: "Rejected", icon: FiXCircle, color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
  ];

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>
          <FiBarChart2 />
          Expert Registrations Dashboard
        </h1>
        <p>Manage and track all expert registration requests from one place.</p>
      </DashboardHeader>

      {/* Statistics Section */}
      <StatsSection>
        <SectionTitle>
          <FiBarChart2 /> Registration Overview
        </SectionTitle>
        <StatsGrid>
          {statCards.map((card) => (
            <StatCard key={card.key}>
              <StatIcon style={{ background: card.bg }}>
                <card.icon color={card.color} />
              </StatIcon>
              <div style={{ flex: 1 }}>
                <StatLabel>{card.label}</StatLabel>
                <StatValue>{stats[card.key] || 0}</StatValue>
                <StatTrend>
                  {card.key === "total" && "All time registrations"}
                  {card.key === "new" && "Awaiting review"}
                  {card.key === "reviewed" && "Reviewed by admin"}
                  {card.key === "contacted" && "Contact initiated"}
                  {card.key === "approved" && "Ready to onboard"}
                  {card.key === "rejected" && "Not selected"}
                </StatTrend>
              </div>
            </StatCard>
          ))}
        </StatsGrid>
      </StatsSection>

      {/* Filter Bar */}
      <FilterBar>
        <div className="search-wrapper">
          <FiSearch />
          <input
            type="text"
            name="search"
            placeholder="Search by name, mobile, or category..."
            value={filter.search}
            onChange={handleFilterChange}
          />
        </div>

        <select name="status" value={filter.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="contacted">Contacted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <ActionButton onClick={fetchData}>
          <FiRefreshCw /> Refresh
        </ActionButton>
      </FilterBar>

      {/* Registrations Table */}
      <SectionBox>
        <h3>
          Expert Registrations
          <span>{filteredRegistrations.length} records</span>
        </h3>
        
        {loading ? (
          <LoadingSpinner>
            <div className="spinner"></div>
            <p>Loading registrations...</p>
          </LoadingSpinner>
        ) : filteredRegistrations.length === 0 ? (
          <EmptyState>
            <FiUsers size={48} />
            <h4>No registrations found</h4>
            <p>Try adjusting your search or filter criteria</p>
          </EmptyState>
        ) : (
          <Table>
            <TableHead>
              <tr>
                <th>ID</th>
                <th>Expert Details</th>
                <th>Contact</th>
                <th>Category</th>
                <th>Plan</th>
                <th>Experience</th>
                <th>Charge</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <tbody>
              {filteredRegistrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell>#{reg.id}</TableCell>
                  <TableCell>
                    <div className="expert-info">
                      <div className="expert-avatar">
                        {reg.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="expert-name">{reg.full_name}</div>
                        <div className="expert-bio">{reg.bio?.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{reg.mobile_number}</TableCell>
                  <TableCell>
                    <span className="category-badge">{reg.category}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`plan-badge ${reg.plan?.toLowerCase()}`}>
                      {reg.plan}
                    </span>
                  </TableCell>
                  <TableCell>{reg.experience} years</TableCell>
                  <TableCell>₹{reg.charge}/min</TableCell>
                  <TableCell>
                    <div className="status-wrapper">
                      <StatusBadge $status={getStatusVariant(reg.status)}>
                        {reg.status.toUpperCase()}
                      </StatusBadge>
                      {reg.is_new === 1 && (
                        <span className="new-badge">NEW</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(reg.created_at)}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleViewDetails(reg.id)}>
                      <FiEye /> View
                    </ActionButton>
                    <ActionButton onClick={() => handleOpenStatusModal(reg)}>
                      <FiEdit2 /> Update
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </SectionBox>

      {/* Detail Modal */}
      {showDetailModal && selectedRegistration && (
        <Modal onClick={() => setShowDetailModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Registration Details</h2>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
            </ModalHeader>
            <ModalBody>
              <div className="detail-section">
                <div className="detail-group">
                  <label>Full Name</label>
                  <div className="detail-value">{selectedRegistration.full_name}</div>
                </div>
                <div className="detail-group">
                  <label>Mobile Number</label>
                  <div className="detail-value">{selectedRegistration.mobile_number}</div>
                </div>
                <div className="detail-group">
                  <label>Category</label>
                  <div className="detail-value">
                    <span className="category-badge">{selectedRegistration.category}</span>
                  </div>
                </div>
                <div className="detail-group">
                  <label>Plan</label>
                  <div className="detail-value">
                    <span className={`plan-badge ${selectedRegistration.plan?.toLowerCase()}`}>
                      {selectedRegistration.plan}
                    </span>
                  </div>
                </div>
                <div className="detail-group">
                  <label>Experience</label>
                  <div className="detail-value">{selectedRegistration.experience} years</div>
                </div>
                <div className="detail-group">
                  <label>Charge (per minute)</label>
                  <div className="detail-value">₹{selectedRegistration.charge}</div>
                </div>
                <div className="detail-group">
                  <label>Bio</label>
                  <div className="detail-value bio-text">{selectedRegistration.bio}</div>
                </div>
                <div className="detail-group">
                  <label>Status</label>
                  <div className="detail-value">
                    <StatusBadge $status={getStatusVariant(selectedRegistration.status)}>
                      {selectedRegistration.status.toUpperCase()}
                    </StatusBadge>
                  </div>
                </div>
                {selectedRegistration.admin_note && (
                  <div className="detail-group">
                    <label>Admin Note</label>
                    <div className="detail-value note-text">{selectedRegistration.admin_note}</div>
                  </div>
                )}
                <div className="detail-group">
                  <label>Registration Date</label>
                  <div className="detail-value">{formatDate(selectedRegistration.created_at)}</div>
                </div>
                <div className="detail-group">
                  <label>Last Updated</label>
                  <div className="detail-value">{formatDate(selectedRegistration.updated_at)}</div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ActionButton onClick={() => setShowDetailModal(false)}>Close</ActionButton>
              <ActionButton $primary onClick={() => {
                setShowDetailModal(false);
                handleOpenStatusModal(selectedRegistration);
              }}>
                <FiEdit2 /> Update Status
              </ActionButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedRegistration && (
        <Modal onClick={() => setShowStatusModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Update Registration Status</h2>
              <button className="close-btn" onClick={() => setShowStatusModal(false)}>×</button>
            </ModalHeader>
            <ModalBody>
              <div className="form-group">
                <label>Expert: {selectedRegistration.full_name}</label>
                <label>Current Status: 
                  <StatusBadge $status={getStatusVariant(selectedRegistration.status)}>
                    {selectedRegistration.status.toUpperCase()}
                  </StatusBadge>
                </label>
              </div>
              <div className="form-group">
                <label>New Status</label>
                <Select
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="contacted">Contacted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </div>
              <div className="form-group">
                <label>Admin Note (Optional)</label>
                <TextArea
                  rows="4"
                  placeholder="Add any notes about this registration..."
                  value={statusUpdate.adminNote}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, adminNote: e.target.value })}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <ActionButton onClick={() => setShowStatusModal(false)}>Cancel</ActionButton>
              <ActionButton $primary onClick={handleUpdateStatus} disabled={updating}>
                {updating ? "Updating..." : "Update Status"}
              </ActionButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      <style jsx>{`
        .expert-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .expert-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
        }
        .expert-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }
        .expert-bio {
          font-size: 12px;
          color: #64748b;
        }
        .category-badge {
          background: #e0e7ff;
          color: #4338ca;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .plan-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .plan-badge.premium {
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          color: white;
        }
        .plan-badge.basic {
          background: #d1fae5;
          color: #065f46;
        }
        .status-wrapper {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .new-badge {
          background: #ef4444;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .search-wrapper {
          position: relative;
          flex: 1;
        }
        .search-wrapper svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .search-wrapper input {
          width: 100%;
          padding: 10px 12px 10px 36px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
        }
        .detail-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .detail-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .detail-group label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #94a3b8;
          font-weight: 600;
        }
        .detail-value {
          font-size: 14px;
          color: #1e293b;
        }
        .bio-text, .note-text {
          background: #f8fafc;
          padding: 12px;
          border-radius: 12px;
          line-height: 1.5;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .form-group label {
          font-weight: 500;
          color: #1e293b;
        }
      `}</style>
    </DashboardContainer>
  );
}