import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaDollarSign,
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaSyncAlt,
  FaDownload,
  FaEye,
  FaCheck,
  FaBan,
  FaUpload,
  FaFilePdf,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaPrint,
  FaHistory,
  FaFileAlt,
  FaReceipt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { FiDownload, FiFilter, FiRefreshCw, FiEye, FiEyeOff } from "react-icons/fi";

import {
  PageContainer,
  ContentWrapper,
  PageHeader,
  HeaderLeft,
  HeaderRight,
  FilterButton,
  RefreshButton,
  StatsGrid,
  StatCard,
  StatIcon,
  StatLabel,
  StatValue,
  StatTrend,
  FiltersContainer,
  SearchInput,
  Select,
  DateInput,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  StatusBadge,
  ActionButton,
  ExpertInfo,
  ExpertAvatar,
  ExpertDetails,
  ExpertName,
  ExpertEmail,
  ExpertPhone,
  Amount,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalClose,
  FormGroup,
  Label,
  Input,
  TextArea,
  SelectModal,
  FileInput,
  FilePreview,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
  ReceiptButton,
  LoadingSpinner,
  EmptyState,
  // New imports for history and receipt preview
  TabContainer,
  Tab,
  HistoryTable,
  HistoryTableHeader,
  HistoryTableRow,
  HistoryTableCell,
  Pagination,
  PageButton,
  FilterTag,
  ClearFilters,
  ReceiptPreview,
  ReceiptPreviewHeader,
  ReceiptPreviewBody,
  ReceiptPreviewFooter,
  ReceiptActions,
  ReceiptImage,
  ReceiptFallback,
  ProcessedDateNote,
  InfoTooltip,
  MobileCard,
  MobileCardHeader,
  MobileCardBody,
  MobileCardFooter,
} from "../styles/PayoutManagement.styles";

import {
  getPendingWithdrawalsApi,
  approveWithdrawalApi,
  rejectWithdrawalApi,
  downloadReceiptApi,
  getAdminWithdrawalHistoryApi,
} from "../../../shared/api/admin/withdrawal.api";

const PayoutManagement = () => {
  // State for pending withdrawals
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReceiptPreviewModal, setShowReceiptPreviewModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'
  
  // State for withdrawal history
  const [historyWithdrawals, setHistoryWithdrawals] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyFilters, setHistoryFilters] = useState({
    search: "",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });
  
  // Pagination for history
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Window width for responsive design
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Track window width
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filters state for pending withdrawals
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Form states
  const [approveForm, setApproveForm] = useState({
    withdrawal_id: "",
    payment_method: "bank",
    transaction_ref: "",
    screenshot: null,
    screenshotPreview: null,
  });

  const [rejectForm, setRejectForm] = useState({
    withdrawal_id: "",
    reason: "",
  });

  const [processing, setProcessing] = useState(false);

  // Calculate stats for pending
  const stats = useMemo(() => {
    const totalPending = withdrawals.filter(w => w.status === 'pending').length;
    const totalApproved = withdrawals.filter(w => w.status === 'approved').length;
    const totalRejected = withdrawals.filter(w => w.status === 'rejected').length;
    const totalAmount = withdrawals.reduce((sum, w) => sum + parseFloat(w.amount || 0), 0);
    const pendingAmount = withdrawals
      .filter(w => w.status === 'pending')
      .reduce((sum, w) => sum + parseFloat(w.amount || 0), 0);
    const avgAmount = withdrawals.length > 0 ? totalAmount / withdrawals.length : 0;
    const uniqueExperts = new Set(withdrawals.map(w => w.expert_id)).size;

    return {
      totalPending,
      totalApproved,
      totalRejected,
      totalAmount,
      pendingAmount,
      avgAmount,
      uniqueExperts,
    };
  }, [withdrawals]);

  // Calculate stats for history
  const historyStats = useMemo(() => {
    const totalApproved = historyWithdrawals.filter(w => w.status === 'approved' || w.status === 'paid').length;
    const totalRejected = historyWithdrawals.filter(w => w.status === 'rejected').length;
    const totalAmount = historyWithdrawals.reduce((sum, w) => sum + parseFloat(w.amount || 0), 0);
    const approvedAmount = historyWithdrawals
      .filter(w => w.status === 'approved' || w.status === 'paid')
      .reduce((sum, w) => sum + parseFloat(w.amount || 0), 0);

    return {
      totalApproved,
      totalRejected,
      totalAmount,
      approvedAmount,
    };
  }, [historyWithdrawals]);

  // Fetch pending withdrawals
  const fetchWithdrawals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPendingWithdrawalsApi();
      
      const list = Array.isArray(res?.data) 
        ? res.data 
        : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];
      
      setWithdrawals(list);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch withdrawal history
  const fetchWithdrawalHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await getAdminWithdrawalHistoryApi();
      
      const historyData = Array.isArray(res?.data) 
        ? res.data 
        : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];
      
      // Format the data to ensure processed_at is properly handled
      const formattedHistory = historyData.map(item => ({
        ...item,
        processed_at: item.processed_at || item.paid_at || null,
        // Ensure we have all necessary fields
        withdrawal_id: item.withdrawal_id || item.id,
        expert_name: item.expert_name || 'Unknown',
        expert_email: item.expert_email || 'N/A',
        admin_name: item.admin_name || 'System',
      }));
      
      setHistoryWithdrawals(formattedHistory);
    } catch (error) {
      console.error("Error fetching withdrawal history:", error);
      setHistoryWithdrawals([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchWithdrawals();
    fetchWithdrawalHistory();
  }, [fetchWithdrawals, fetchWithdrawalHistory]);

  // Filter pending withdrawals
  const filteredWithdrawals = useMemo(() => {
    let filtered = [...withdrawals];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(w =>
        w.name?.toLowerCase().includes(searchLower) ||
        w.email?.toLowerCase().includes(searchLower) ||
        w.expert_id?.toString().includes(searchLower) ||
        w.withdrawal_id?.toString().includes(searchLower)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(w => w.status === filters.status);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(w => new Date(w.created_at) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(w => new Date(w.created_at) <= toDate);
    }

    return filtered;
  }, [withdrawals, filters]);

  // Filter history withdrawals
  const filteredHistory = useMemo(() => {
    let filtered = [...historyWithdrawals];

    if (historyFilters.search) {
      const searchLower = historyFilters.search.toLowerCase();
      filtered = filtered.filter(w =>
        w.expert_name?.toLowerCase().includes(searchLower) ||
        w.expert_email?.toLowerCase().includes(searchLower) ||
        w.withdrawal_id?.toString().includes(searchLower) ||
        w.transaction_ref?.toLowerCase().includes(searchLower)
      );
    }

    if (historyFilters.status && historyFilters.status !== 'all') {
      filtered = filtered.filter(w => w.status === historyFilters.status);
    }

    if (historyFilters.dateFrom) {
      const fromDate = new Date(historyFilters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(w => new Date(w.created_at) >= fromDate);
    }

    if (historyFilters.dateTo) {
      const toDate = new Date(historyFilters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(w => new Date(w.created_at) <= toDate);
    }

    return filtered;
  }, [historyWithdrawals, historyFilters]);

  // Pagination for history
  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredHistory.slice(startIndex, endIndex);
  }, [filteredHistory, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  // Handle approve
  const handleApprove = async () => {
    if (!approveForm.payment_method || !approveForm.transaction_ref) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setProcessing(true);
      
      const formData = new FormData();
      formData.append("withdrawal_id", selectedRequest.withdrawal_id);
      formData.append("payment_method", approveForm.payment_method);
      formData.append("transaction_ref", approveForm.transaction_ref);
      if (approveForm.screenshot) {
        formData.append("screenshot", approveForm.screenshot);
      }

      const { data } = await approveWithdrawalApi(formData);

      if (data.success) {
        setShowApproveModal(false);
        resetForms();
        await fetchWithdrawals();
        await fetchWithdrawalHistory(); // Refresh history
        alert("Withdrawal approved successfully!");
      } else {
        alert(data.message || "Failed to approve withdrawal");
      }
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      alert(error.response?.data?.message || "Failed to approve withdrawal");
    } finally {
      setProcessing(false);
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!rejectForm.reason) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      setProcessing(true);
      
      const { data } = await rejectWithdrawalApi({
        withdrawal_id: selectedRequest.withdrawal_id,
        reason: rejectForm.reason,
      });
      
      if (data.success) {
        setShowRejectModal(false);
        resetForms();
        await fetchWithdrawals();
        await fetchWithdrawalHistory(); // Refresh history
        alert("Withdrawal rejected successfully!");
      } else {
        alert(data.message || "Failed to reject withdrawal");
      }
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
      alert(error.response?.data?.message || "Failed to reject withdrawal");
    } finally {
      setProcessing(false);
    }
  };

  // Handle receipt download
  const handleDownloadReceipt = async (withdrawalId) => {
    try {
      setDownloading(true);
      const res = await downloadReceiptApi(withdrawalId);
      
      // Check if response is PDF or image
      const contentType = res.headers['content-type'];
      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Set filename based on content type
      const extension = contentType.includes('pdf') ? 'pdf' : 'png';
      link.setAttribute("download", `receipt_${withdrawalId}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert("Failed to download receipt");
    } finally {
      setDownloading(false);
    }
  };

  // Handle receipt preview
  const handlePreviewReceipt = async (withdrawalId) => {
    try {
      setDownloading(true);
      const res = await downloadReceiptApi(withdrawalId);
      
      const contentType = res.headers['content-type'];
      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      
      setSelectedReceipt({
        id: withdrawalId,
        url: url,
        type: contentType,
      });
      setShowReceiptPreviewModal(true);
    } catch (error) {
      console.error("Error previewing receipt:", error);
      alert("Failed to load receipt preview");
    } finally {
      setDownloading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setApproveForm(prev => ({
        ...prev,
        screenshot: file,
        screenshotPreview: previewUrl,
      }));
    }
  };

  // Reset forms
  const resetForms = () => {
    setApproveForm({
      withdrawal_id: "",
      payment_method: "bank",
      transaction_ref: "",
      screenshot: null,
      screenshotPreview: null,
    });
    setRejectForm({ withdrawal_id: "", reason: "" });
    setSelectedRequest(null);
  };

  // Open approve modal
  const openApproveModal = (withdrawal) => {
    setSelectedRequest(withdrawal);
    setApproveForm(prev => ({
      ...prev,
      withdrawal_id: withdrawal.withdrawal_id,
    }));
    setShowApproveModal(true);
  };

  // Open reject modal
  const openRejectModal = (withdrawal) => {
    setSelectedRequest(withdrawal);
    setRejectForm(prev => ({
      ...prev,
      withdrawal_id: withdrawal.withdrawal_id,
    }));
    setShowRejectModal(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format date only
  const formatDateOnly = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
      case 'paid':
      case 'completed':
        return '#10b981';
      case 'pending':
      case 'processing':
        return '#f59e0b';
      case 'rejected':
      case 'failed':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      dateFrom: "",
      dateTo: "",
    });
  };

  const clearHistoryFilters = () => {
    setHistoryFilters({
      search: "",
      status: "all",
      dateFrom: "",
      dateTo: "",
    });
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.search || filters.status !== 'all' || filters.dateFrom || filters.dateTo;
  }, [filters]);

  const hasActiveHistoryFilters = useMemo(() => {
    return historyFilters.search || historyFilters.status !== 'all' || historyFilters.dateFrom || historyFilters.dateTo;
  }, [historyFilters]);

  // Render mobile view for pending withdrawals
  const renderMobilePendingCards = () => {
    return filteredWithdrawals.map((withdrawal) => (
      <MobileCard key={withdrawal.withdrawal_id}>
        <MobileCardHeader>
          <div>
            <strong>#{withdrawal.withdrawal_id}</strong>
            <StatusBadge $status={withdrawal.status || 'pending'}>
              {withdrawal.status || 'pending'}
            </StatusBadge>
          </div>
          <Amount>{formatCurrency(withdrawal.amount)}</Amount>
        </MobileCardHeader>
        
        <MobileCardBody>
          <ExpertInfo>
            <ExpertAvatar>
              {withdrawal.name?.charAt(0) || 'E'}
            </ExpertAvatar>
            <ExpertDetails>
              <ExpertName>{withdrawal.name}</ExpertName>
              <ExpertEmail>
                <FaEnvelope /> {withdrawal.email}
              </ExpertEmail>
              <ExpertPhone>
                <FaPhone /> {withdrawal.phone || 'N/A'}
              </ExpertPhone>
            </ExpertDetails>
          </ExpertInfo>
          
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Requested:</span>
              <span>{formatDateOnly(withdrawal.created_at)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>Available Balance:</span>
              <span>{formatCurrency(withdrawal.available_balance)}</span>
            </div>
          </div>
        </MobileCardBody>
        
        <MobileCardFooter>
          <ActionButton
            $variant="view"
            onClick={() => {
              setSelectedRequest(withdrawal);
              setShowDetailModal(true);
            }}
          >
            <FaEye /> Details
          </ActionButton>
          
          {withdrawal.status === 'pending' && (
            <>
              <ActionButton
                $variant="approve"
                onClick={() => openApproveModal(withdrawal)}
              >
                <FaCheck /> Approve
              </ActionButton>
              
              <ActionButton
                $variant="reject"
                onClick={() => openRejectModal(withdrawal)}
              >
                <FaBan /> Reject
              </ActionButton>
            </>
          )}

          {withdrawal.status === 'approved' && (
            <ReceiptButton
              onClick={() => handleDownloadReceipt(withdrawal.withdrawal_id)}
              disabled={downloading}
            >
              <FaFilePdf /> Receipt
            </ReceiptButton>
          )}
        </MobileCardFooter>
      </MobileCard>
    ));
  };

  // Render mobile view for history
  const renderMobileHistoryCards = () => {
    return paginatedHistory.map((withdrawal) => (
      <MobileCard key={withdrawal.withdrawal_id}>
        <MobileCardHeader>
          <div>
            <strong>#{withdrawal.withdrawal_id}</strong>
            <StatusBadge $status={withdrawal.status}>
              {withdrawal.status}
            </StatusBadge>
          </div>
          <Amount>{formatCurrency(withdrawal.amount)}</Amount>
        </MobileCardHeader>
        
        <MobileCardBody>
          <div style={{ marginBottom: '12px' }}>
            <ExpertName>{withdrawal.expert_name}</ExpertName>
            <ExpertEmail>{withdrawal.expert_email}</ExpertEmail>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Payment Method</div>
              <div style={{ fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>
                {withdrawal.payment_method || 'N/A'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Transaction Ref</div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>
                {withdrawal.transaction_ref || '-'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Requested</div>
              <div style={{ fontSize: '13px' }}>{formatDateOnly(withdrawal.created_at)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Processed
                <InfoTooltip title="Date when the withdrawal was processed (approved/rejected)">
                  <FaInfoCircle size={10} />
                </InfoTooltip>
              </div>
              <div style={{ fontSize: '13px' }}>
                {withdrawal.processed_at ? formatDateOnly(withdrawal.processed_at) : '-'}
              </div>
            </div>
          </div>
          
          {withdrawal.rejection_reason && (
            <div style={{ marginTop: '12px', padding: '8px', background: '#fee2e2', borderRadius: '8px', fontSize: '12px', color: '#991b1b' }}>
              <strong>Rejection Reason:</strong> {withdrawal.rejection_reason}
            </div>
          )}
        </MobileCardBody>
        
        <MobileCardFooter>
          <ActionButton
            $variant="view"
            onClick={() => {
              setSelectedRequest(withdrawal);
              setShowDetailModal(true);
            }}
          >
            <FaEye /> Details
          </ActionButton>
          
          {withdrawal.transaction_ref && (
            <ReceiptButton
              onClick={() => handlePreviewReceipt(withdrawal.withdrawal_id)}
              disabled={downloading}
            >
              <FaReceipt /> Preview
            </ReceiptButton>
          )}
        </MobileCardFooter>
      </MobileCard>
    ));
  };

  if (loading && activeTab === 'pending') {
    return (
      <PageContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
          <p>Loading payout requests...</p>
        </LoadingSpinner>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        {/* Header */}
        <PageHeader>
          <HeaderLeft>
            <h1>
              <FaWallet />
              Payout Management
            </h1>
            <p>Manage and process expert withdrawal requests</p>
          </HeaderLeft>

          <HeaderRight>
            <RefreshButton onClick={() => {
              fetchWithdrawals();
              fetchWithdrawalHistory();
            }}>
              <FaSyncAlt /> Refresh
            </RefreshButton>
          </HeaderRight>
        </PageHeader>

        {/* Stats Cards - Dynamic based on active tab */}
        {activeTab === 'pending' ? (
          <StatsGrid>
            <StatCard>
              <StatIcon>
                <FaClock />
              </StatIcon>
              <StatLabel>Pending Requests</StatLabel>
              <StatValue>{stats.totalPending}</StatValue>
              <StatTrend>
                Amount: {formatCurrency(stats.pendingAmount)}
              </StatTrend>
            </StatCard>

            <StatCard>
              <StatIcon $color="linear-gradient(135deg, #10b981, #34d399)">
                <FaCheckCircle />
              </StatIcon>
              <StatLabel>Approved</StatLabel>
              <StatValue>{stats.totalApproved}</StatValue>
              <StatTrend>Successfully processed</StatTrend>
            </StatCard>

            <StatCard>
              <StatIcon $color="linear-gradient(135deg, #ef4444, #dc2626)">
                <FaTimesCircle />
              </StatIcon>
              <StatLabel>Rejected</StatLabel>
              <StatValue>{stats.totalRejected}</StatValue>
              <StatTrend>Declined requests</StatTrend>
            </StatCard>

            <StatCard>
              <StatIcon $color="linear-gradient(135deg, #8b5cf6, #7c3aed)">
                <FaWallet />
              </StatIcon>
              <StatLabel>Total Amount</StatLabel>
              <StatValue>{formatCurrency(stats.totalAmount)}</StatValue>
              <StatTrend>{stats.uniqueExperts} experts</StatTrend>
            </StatCard>
          </StatsGrid>
        ) : (
          <StatsGrid>
            <StatCard>
              <StatIcon $color="linear-gradient(135deg, #10b981, #34d399)">
                <FaCheckCircle />
              </StatIcon>
              <StatLabel>Total Approved</StatLabel>
              <StatValue>{historyStats.totalApproved}</StatValue>
              <StatTrend>Amount: {formatCurrency(historyStats.approvedAmount)}</StatTrend>
            </StatCard>

            <StatCard>
              <StatIcon $color="linear-gradient(135deg, #ef4444, #dc2626)">
                <FaTimesCircle />
              </StatIcon>
              <StatLabel>Total Rejected</StatLabel>
              <StatValue>{historyStats.totalRejected}</StatValue>
              <StatTrend>Declined requests</StatTrend>
            </StatCard>

            <StatCard>
              <StatIcon $color="linear-gradient(135deg, #8b5cf6, #7c3aed)">
                <FaWallet />
              </StatIcon>
              <StatLabel>Total Processed</StatLabel>
              <StatValue>{formatCurrency(historyStats.totalAmount)}</StatValue>
              <StatTrend>All time total</StatTrend>
            </StatCard>

            <StatCard>
              <StatIcon $color="linear-gradient(135deg, #f59e0b, #d97706)">
                <FaHistory />
              </StatIcon>
              <StatLabel>History Items</StatLabel>
              <StatValue>{filteredHistory.length}</StatValue>
              <StatTrend>Showing {paginatedHistory.length} of {filteredHistory.length}</StatTrend>
            </StatCard>
          </StatsGrid>
        )}

        {/* Tabs */}
        <TabContainer>
          <Tab 
            $active={activeTab === 'pending'} 
            onClick={() => setActiveTab('pending')}
          >
            <FaClock /> Pending Requests ({withdrawals.length})
          </Tab>
          <Tab 
            $active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
          >
            <FaHistory /> Withdrawal History ({historyWithdrawals.length})
          </Tab>
        </TabContainer>

        {/* Pending Requests Tab */}
        {activeTab === 'pending' && (
          <>
            {/* Filters */}
            <FiltersContainer>
              <SearchInput>
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search by name, email, expert ID, or withdrawal ID..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </SearchInput>

              <Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>

              <DateInput
                type="date"
                placeholder="From Date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />

              <DateInput
                type="date"
                placeholder="To Date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />

              {hasActiveFilters && (
                <ClearFilters onClick={clearFilters}>
                  <FaTimes /> Clear Filters
                </ClearFilters>
              )}
            </FiltersContainer>

            {/* Table/ Cards View based on screen size */}
            {windowWidth > 768 ? (
              <TableContainer>
                <div style={{ overflowX: "auto" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <th>Withdrawal ID</th>
                        <th>Expert</th>
                        <th>Amount</th>
                        <th>Requested On</th>
                        <th>Available Balance</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </TableRow>
                    </TableHead>

                    <tbody>
                      {filteredWithdrawals.length > 0 ? (
                        filteredWithdrawals.map((withdrawal) => (
                          <TableRow key={withdrawal.withdrawal_id}>
                            <TableCell>
                              <strong>#{withdrawal.withdrawal_id}</strong>
                            </TableCell>

                            <TableCell>
                              <ExpertInfo>
                                <ExpertAvatar>
                                  {withdrawal.name?.charAt(0) || 'E'}
                                </ExpertAvatar>
                                <ExpertDetails>
                                  <ExpertName>{withdrawal.name}</ExpertName>
                                  <ExpertEmail>
                                    <FaEnvelope /> {withdrawal.email}
                                  </ExpertEmail>
                                  <ExpertPhone>
                                    <FaPhone /> {withdrawal.phone || 'N/A'}
                                  </ExpertPhone>
                                </ExpertDetails>
                              </ExpertInfo>
                            </TableCell>

                            <TableCell>
                              <Amount>{formatCurrency(withdrawal.amount)}</Amount>
                            </TableCell>

                            <TableCell>
                              <div>
                                <div>{formatDate(withdrawal.created_at)}</div>
                                <small style={{ color: '#64748b' }}>
                                  ID: {withdrawal.expert_id}
                                </small>
                              </div>
                            </TableCell>

                            <TableCell>
                              <Amount>{formatCurrency(withdrawal.available_balance)}</Amount>
                            </TableCell>

                            <TableCell>
                              <StatusBadge $status={withdrawal.status || 'pending'}>
                                {withdrawal.status || 'pending'}
                              </StatusBadge>
                            </TableCell>

                            <TableCell>
                              <ActionButton
                                $variant="view"
                                onClick={() => {
                                  setSelectedRequest(withdrawal);
                                  setShowDetailModal(true);
                                }}
                              >
                                <FaEye /> Details
                              </ActionButton>
                              
                              {withdrawal.status === 'pending' && (
                                <>
                                  <ActionButton
                                    $variant="approve"
                                    onClick={() => openApproveModal(withdrawal)}
                                  >
                                    <FaCheck /> Approve
                                  </ActionButton>
                                  
                                  <ActionButton
                                    $variant="reject"
                                    onClick={() => openRejectModal(withdrawal)}
                                  >
                                    <FaBan /> Reject
                                  </ActionButton>
                                </>
                              )}

                              {withdrawal.status === 'approved' && (
                                <ReceiptButton
                                  onClick={() => handleDownloadReceipt(withdrawal.withdrawal_id)}
                                  disabled={downloading}
                                >
                                  <FaFilePdf /> 
                                  {downloading ? '...' : 'Receipt'}
                                </ReceiptButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7}>
                            <EmptyState>
                              <FaWallet size={48} />
                              <h3>No withdrawal requests found</h3>
                              <p>There are no withdrawal requests matching your criteria.</p>
                              {hasActiveFilters && (
                                <FilterButton onClick={clearFilters}>
                                  Clear Filters
                                </FilterButton>
                              )}
                            </EmptyState>
                          </TableCell>
                        </TableRow>
                      )}
                    </tbody>
                  </Table>
                </div>
              </TableContainer>
            ) : (
              <div style={{ marginTop: '16px' }}>
                {filteredWithdrawals.length > 0 ? (
                  renderMobilePendingCards()
                ) : (
                  <EmptyState>
                    <FaWallet size={48} />
                    <h3>No withdrawal requests found</h3>
                    <p>There are no withdrawal requests matching your criteria.</p>
                    {hasActiveFilters && (
                      <FilterButton onClick={clearFilters}>
                        Clear Filters
                      </FilterButton>
                    )}
                  </EmptyState>
                )}
              </div>
            )}
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <>
            {/* History Filters */}
            <FiltersContainer>
              <SearchInput>
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search by expert name, email, transaction ref..."
                  value={historyFilters.search}
                  onChange={(e) => setHistoryFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </SearchInput>

              <Select
                value={historyFilters.status}
                onChange={(e) => setHistoryFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
              </Select>

              <DateInput
                type="date"
                placeholder="From Date"
                value={historyFilters.dateFrom}
                onChange={(e) => setHistoryFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />

              <DateInput
                type="date"
                placeholder="To Date"
                value={historyFilters.dateTo}
                onChange={(e) => setHistoryFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />

              {hasActiveHistoryFilters && (
                <ClearFilters onClick={clearHistoryFilters}>
                  <FaTimes /> Clear Filters
                </ClearFilters>
              )}
            </FiltersContainer>

            {/* History Table/ Cards */}
            {historyLoading ? (
              <LoadingSpinner>
                <div className="spinner"></div>
                <p>Loading withdrawal history...</p>
              </LoadingSpinner>
            ) : (
              <>
                {windowWidth > 1024 ? (
                  <TableContainer>
                    <div style={{ overflowX: "auto" }}>
                      <HistoryTable>
                        <HistoryTableHeader>
                          <tr>
                            <th>ID</th>
                            <th>Expert</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                            <th>Transaction Ref</th>
                            <th>Requested</th>
                            <th>Processed</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </HistoryTableHeader>
                        <tbody>
                          {paginatedHistory.length > 0 ? (
                            paginatedHistory.map((withdrawal) => (
                              <HistoryTableRow key={withdrawal.withdrawal_id}>
                                <HistoryTableCell>#{withdrawal.withdrawal_id}</HistoryTableCell>
                                <HistoryTableCell>
                                  <div>
                                    <div style={{ fontWeight: 600 }}>{withdrawal.expert_name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{withdrawal.expert_email}</div>
                                  </div>
                                </HistoryTableCell>
                                <HistoryTableCell>
                                  <Amount>{formatCurrency(withdrawal.amount)}</Amount>
                                </HistoryTableCell>
                                <HistoryTableCell>
                                  <div style={{ textTransform: 'capitalize' }}>
                                    {withdrawal.payment_method || 'N/A'}
                                    {withdrawal.admin_name && (
                                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                        by: {withdrawal.admin_name}
                                      </div>
                                    )}
                                  </div>
                                </HistoryTableCell>
                                <HistoryTableCell>
                                  <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                                    {withdrawal.transaction_ref || '-'}
                                  </div>
                                </HistoryTableCell>
                                <HistoryTableCell>{formatDateOnly(withdrawal.created_at)}</HistoryTableCell>
                                <HistoryTableCell>
                                  {withdrawal.processed_at ? (
                                    <div>
                                      <div>{formatDateOnly(withdrawal.processed_at)}</div>
                                      <ProcessedDateNote>
                                        Processed
                                      </ProcessedDateNote>
                                    </div>
                                  ) : '-'}
                                </HistoryTableCell>
                                <HistoryTableCell>
                                  <StatusBadge $status={withdrawal.status}>
                                    {withdrawal.status}
                                  </StatusBadge>
                                </HistoryTableCell>
                                <HistoryTableCell>
                                  <ActionButton
                                    $variant="view"
                                    onClick={() => {
                                      setSelectedRequest(withdrawal);
                                      setShowDetailModal(true);
                                    }}
                                  >
                                    <FaEye /> View
                                  </ActionButton>
                                  {withdrawal.transaction_ref && (
                                    <ReceiptButton
                                      onClick={() => handlePreviewReceipt(withdrawal.withdrawal_id)}
                                      disabled={downloading}
                                      style={{ marginTop: '4px' }}
                                    >
                                      <FaReceipt /> Preview
                                    </ReceiptButton>
                                  )}
                                </HistoryTableCell>
                              </HistoryTableRow>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="9">
                                <EmptyState>
                                  <FaHistory size={48} />
                                  <h3>No withdrawal history found</h3>
                                  <p>There are no processed withdrawals matching your criteria.</p>
                                  {hasActiveHistoryFilters && (
                                    <FilterButton onClick={clearHistoryFilters}>
                                      Clear Filters
                                    </FilterButton>
                                  )}
                                </EmptyState>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </HistoryTable>
                    </div>
                  </TableContainer>
                ) : (
                  <div style={{ marginTop: '16px' }}>
                    {paginatedHistory.length > 0 ? (
                      renderMobileHistoryCards()
                    ) : (
                      <EmptyState>
                        <FaHistory size={48} />
                        <h3>No withdrawal history found</h3>
                        <p>There are no processed withdrawals matching your criteria.</p>
                        {hasActiveHistoryFilters && (
                          <FilterButton onClick={clearHistoryFilters}>
                            Clear Filters
                          </FilterButton>
                        )}
                      </EmptyState>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {filteredHistory.length > itemsPerPage && (
                  <Pagination>
                    <PageButton
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <FaChevronLeft /> Previous
                    </PageButton>
                    
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <PageButton
                          key={pageNum}
                          $active={currentPage === pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </PageButton>
                      );
                    })}
                    
                    <PageButton
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next <FaChevronRight />
                    </PageButton>
                  </Pagination>
                )}
              </>
            )}
          </>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedRequest && (
          <ModalOverlay onClick={() => setShowDetailModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <h2>Withdrawal Details</h2>
                <ModalClose onClick={() => setShowDetailModal(false)}>×</ModalClose>
              </ModalHeader>

              <DetailGrid>
                <DetailItem>
                  <DetailLabel>Withdrawal ID</DetailLabel>
                  <DetailValue>#{selectedRequest.withdrawal_id}</DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Expert ID</DetailLabel>
                  <DetailValue>#{selectedRequest.expert_id || selectedRequest.expert_id}</DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Requested Amount</DetailLabel>
                  <DetailValue>{formatCurrency(selectedRequest.amount)}</DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Available Balance</DetailLabel>
                  <DetailValue>{formatCurrency(selectedRequest.available_balance || 0)}</DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Requested On</DetailLabel>
                  <DetailValue>{formatDate(selectedRequest.created_at)}</DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Processed On</DetailLabel>
                  <DetailValue>
                    {selectedRequest.processed_at ? formatDate(selectedRequest.processed_at) : '-'}
                    {!selectedRequest.processed_at && selectedRequest.status !== 'pending' && (
                      <ProcessedDateNote style={{ marginLeft: '4px' }}>
                        (Date not recorded - fix applied)
                      </ProcessedDateNote>
                    )}
                  </DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Status</DetailLabel>
                  <DetailValue>
                    <StatusBadge $status={selectedRequest.status || 'pending'}>
                      {selectedRequest.status || 'pending'}
                    </StatusBadge>
                  </DetailValue>
                </DetailItem>

                {selectedRequest.payment_method && (
                  <DetailItem>
                    <DetailLabel>Payment Method</DetailLabel>
                    <DetailValue style={{ textTransform: 'capitalize' }}>
                      {selectedRequest.payment_method}
                    </DetailValue>
                  </DetailItem>
                )}

                {selectedRequest.transaction_ref && (
                  <DetailItem>
                    <DetailLabel>Transaction Ref</DetailLabel>
                    <DetailValue style={{ fontFamily: 'monospace' }}>
                      {selectedRequest.transaction_ref}
                    </DetailValue>
                  </DetailItem>
                )}

                {selectedRequest.rejection_reason && (
                  <DetailItem $fullWidth>
                    <DetailLabel>Rejection Reason</DetailLabel>
                    <DetailValue style={{ color: '#ef4444', background: '#fee2e2', padding: '8px', borderRadius: '8px' }}>
                      {selectedRequest.rejection_reason}
                    </DetailValue>
                  </DetailItem>
                )}
              </DetailGrid>

              <div style={{ marginTop: '20px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#1e293b' }}>
                  Expert Information
                </h3>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Name</DetailLabel>
                    <DetailValue>{selectedRequest.name || selectedRequest.expert_name}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Email</DetailLabel>
                    <DetailValue>{selectedRequest.email || selectedRequest.expert_email}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Phone</DetailLabel>
                    <DetailValue>{selectedRequest.phone || 'N/A'}</DetailValue>
                  </DetailItem>
                </DetailGrid>
              </div>

              {selectedRequest.status === 'approved' && (
                <ReceiptButton
                  onClick={() => handleDownloadReceipt(selectedRequest.withdrawal_id)}
                  disabled={downloading}
                  style={{ width: '100%', marginTop: '20px' }}
                >
                  <FaFilePdf /> 
                  {downloading ? 'Downloading...' : 'Download Payment Receipt'}
                </ReceiptButton>
              )}

              {selectedRequest.transaction_ref && (
                <ReceiptButton
                  onClick={() => handlePreviewReceipt(selectedRequest.withdrawal_id)}
                  disabled={downloading}
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  <FaReceipt /> 
                  {downloading ? 'Loading...' : 'Preview Receipt'}
                </ReceiptButton>
              )}

              {selectedRequest.status === 'pending' && (
                <ButtonGroup>
                  <PrimaryButton
                    onClick={() => {
                      setShowDetailModal(false);
                      openApproveModal(selectedRequest);
                    }}
                  >
                    <FaCheck /> Approve
                  </PrimaryButton>
                  <SecondaryButton
                    $danger
                    onClick={() => {
                      setShowDetailModal(false);
                      openRejectModal(selectedRequest);
                    }}
                  >
                    <FaBan /> Reject
                  </SecondaryButton>
                </ButtonGroup>
              )}
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Approve Modal */}
        {showApproveModal && selectedRequest && (
          <ModalOverlay onClick={() => !processing && setShowApproveModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <h2>Approve Withdrawal</h2>
                <ModalClose
                  onClick={() => !processing && setShowApproveModal(false)}
                  disabled={processing}
                >
                  ×
                </ModalClose>
              </ModalHeader>

              <div style={{ marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Withdrawal ID: #{selectedRequest.withdrawal_id}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Expert: {selectedRequest.name}</div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', marginTop: '4px' }}>
                      Amount: {formatCurrency(selectedRequest.amount)}
                    </div>
                  </div>
                  <StatusBadge $status="pending">Pending</StatusBadge>
                </div>
              </div>

              <FormGroup>
                <Label>Payment Method *</Label>
                <SelectModal
                  value={approveForm.payment_method}
                  onChange={(e) => setApproveForm(prev => ({ ...prev, payment_method: e.target.value }))}
                  disabled={processing}
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="paypal">PayPal</option>
                  <option value="razorpay">Razorpay</option>
                </SelectModal>
              </FormGroup>

              <FormGroup>
                <Label>Transaction Reference *</Label>
                <Input
                  type="text"
                  placeholder="Enter transaction ID / UTR number"
                  value={approveForm.transaction_ref}
                  onChange={(e) => setApproveForm(prev => ({ ...prev, transaction_ref: e.target.value }))}
                  disabled={processing}
                />
                <small style={{ color: '#64748b', marginTop: '4px', display: 'block' }}>
                  This will be saved as transaction_ref in the database
                </small>
              </FormGroup>

              <FormGroup>
                <Label>Payment Screenshot (Optional)</Label>
                <FileInput onClick={() => document.getElementById('screenshot').click()}>
                  <input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={processing}
                  />
                  <FaUpload />
                  <p>Click to upload payment screenshot</p>
                  <small>PNG, JPG up to 5MB</small>
                </FileInput>

                {approveForm.screenshotPreview && (
                  <FilePreview>
                    <img src={approveForm.screenshotPreview} alt="Preview" />
                    <div>
                      <p>{approveForm.screenshot.name}</p>
                      <span>{(approveForm.screenshot.size / 1024).toFixed(2)} KB</span>
                    </div>
                  </FilePreview>
                )}
              </FormGroup>

              <ProcessedDateNote style={{ marginTop: '16px' }}>
                <FaInfoCircle /> Upon approval, processed_at will be automatically set to current timestamp
              </ProcessedDateNote>

              <ButtonGroup>
                <PrimaryButton onClick={handleApprove} disabled={processing}>
                  {processing ? 'Processing...' : 'Approve & Process'}
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => setShowApproveModal(false)}
                  disabled={processing}
                >
                  Cancel
                </SecondaryButton>
              </ButtonGroup>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedRequest && (
          <ModalOverlay onClick={() => !processing && setShowRejectModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <h2>Reject Withdrawal</h2>
                <ModalClose
                  onClick={() => !processing && setShowRejectModal(false)}
                  disabled={processing}
                >
                  ×
                </ModalClose>
              </ModalHeader>

              <div style={{ marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Withdrawal ID: #{selectedRequest.withdrawal_id}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Expert: {selectedRequest.name}</div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', marginTop: '4px' }}>
                      Amount: {formatCurrency(selectedRequest.amount)}
                    </div>
                  </div>
                  <StatusBadge $status="pending">Pending</StatusBadge>
                </div>
              </div>

              <FormGroup>
                <Label>Rejection Reason *</Label>
                <TextArea
                  placeholder="Please provide a reason for rejection..."
                  value={rejectForm.reason}
                  onChange={(e) => setRejectForm(prev => ({ ...prev, reason: e.target.value }))}
                  disabled={processing}
                  rows={4}
                />
                <small style={{ color: '#64748b', marginTop: '4px', display: 'block' }}>
                  This reason will be saved in the database and shown to the expert
                </small>
              </FormGroup>

              <ProcessedDateNote style={{ marginTop: '16px' }}>
                <FaInfoCircle /> Upon rejection, processed_at will be automatically set to current timestamp
              </ProcessedDateNote>

              <ButtonGroup>
                <SecondaryButton
                  $danger
                  onClick={handleReject}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Reject Request'}
                </SecondaryButton>
                <SecondaryButton
                  onClick={() => setShowRejectModal(false)}
                  disabled={processing}
                >
                  Cancel
                </SecondaryButton>
              </ButtonGroup>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Receipt Preview Modal */}
        {showReceiptPreviewModal && selectedReceipt && (
          <ModalOverlay onClick={() => setShowReceiptPreviewModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
              <ModalHeader>
                <h2>Receipt Preview</h2>
                <ModalClose onClick={() => setShowReceiptPreviewModal(false)}>×</ModalClose>
              </ModalHeader>

              <ReceiptPreview>
                <ReceiptPreviewHeader>
                  <h3>Withdrawal Receipt #{selectedReceipt.id}</h3>
                  <ReceiptActions>
                    <ActionButton
                      $variant="view"
                      onClick={() => handleDownloadReceipt(selectedReceipt.id)}
                      disabled={downloading}
                    >
                      <FaDownload /> Download
                    </ActionButton>
                    <ActionButton
                      $variant="view"
                      onClick={() => window.print()}
                    >
                      <FaPrint /> Print
                    </ActionButton>
                  </ReceiptActions>
                </ReceiptPreviewHeader>

                <ReceiptPreviewBody>
                  {selectedReceipt.type.includes('pdf') ? (
                    <iframe
                      src={selectedReceipt.url}
                      title="Receipt PDF"
                      width="100%"
                      height="600px"
                      style={{ border: 'none' }}
                    />
                  ) : (
                    <ReceiptImage src={selectedReceipt.url} alt="Receipt" />
                  )}
                </ReceiptPreviewBody>

                <ReceiptPreviewFooter>
                  <small>Generated on: {new Date().toLocaleString()}</small>
                </ReceiptPreviewFooter>
              </ReceiptPreview>
            </ModalContent>
          </ModalOverlay>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default PayoutManagement;