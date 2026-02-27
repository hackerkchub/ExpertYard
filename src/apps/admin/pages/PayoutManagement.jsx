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
} from "react-icons/fa";
import { FiDownload, FiFilter } from "react-icons/fi";

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
} from "../styles/PayoutManagement.styles";

import {
  getPendingWithdrawalsApi,
  approveWithdrawalApi,
  rejectWithdrawalApi,
  downloadReceiptApi,
} from "../../../shared/api/admin/withdrawal.api";

const PayoutManagement = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
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

  // Calculate stats
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

  // Fetch withdrawals
  const fetchWithdrawals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPendingWithdrawalsApi();
      
      // Handle different response structures
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

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  // Filter withdrawals
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

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `receipt_${withdrawalId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    alert("Failed to download receipt");
  } finally {
    setDownloading(false);
  }
};
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      
      // Check file type
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

  if (loading) {
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
            <FilterButton onClick={() => {/* Toggle advanced filters */}}>
              <FiFilter /> Advanced Filters
            </FilterButton>
            <RefreshButton onClick={fetchWithdrawals}>
              <FaSyncAlt /> Refresh
            </RefreshButton>
          </HeaderRight>
        </PageHeader>

        {/* Stats Cards */}
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
        </FiltersContainer>

        {/* Withdrawals Table */}
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
                            {downloading ? 'Downloading...' : 'Receipt'}
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
                      </EmptyState>
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          </div>
        </TableContainer>

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
                  <DetailValue>#{selectedRequest.expert_id}</DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Requested Amount</DetailLabel>
                  <DetailValue>{formatCurrency(selectedRequest.amount)}</DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Available Balance</DetailLabel>
                  <DetailValue>{formatCurrency(selectedRequest.available_balance)}</DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Requested On</DetailLabel>
                  <DetailValue>{formatDate(selectedRequest.created_at)}</DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Status</DetailLabel>
                  <DetailValue>
                    <StatusBadge $status={selectedRequest.status || 'pending'}>
                      {selectedRequest.status || 'pending'}
                    </StatusBadge>
                  </DetailValue>
                </DetailItem>
              </DetailGrid>

              <div style={{ marginTop: '20px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#1e293b' }}>
                  Expert Information
                </h3>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Name</DetailLabel>
                    <DetailValue>{selectedRequest.name}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Email</DetailLabel>
                    <DetailValue>{selectedRequest.email}</DetailValue>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                />
                <small style={{ color: '#64748b', marginTop: '4px', display: 'block' }}>
                  This reason will be saved in the database and shown to the expert
                </small>
              </FormGroup>

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
      </ContentWrapper>
    </PageContainer>
  );
};

export default PayoutManagement;