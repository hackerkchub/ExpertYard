import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FiDollarSign,
  FiClock,
  FiTrendingUp,
  FiCalendar,
  FiCreditCard,
  FiHome,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDownload,
  FiShare2,
  FiChevronRight,
  FiAlertCircle,
  FiLock,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiClock as FiClockIcon,
} from "react-icons/fi";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdAttachMoney, MdVerified, MdWarning } from "react-icons/md";
import { BsGraphUp, BsLightningCharge, BsCalendarCheck } from "react-icons/bs";
import { TbPigMoney } from "react-icons/tb";

import {
  PremiumContainer,
  DashboardContainer,
  Header,
  Title,
  HeaderContent,
  HeaderLeft,
  HeaderRight,
  BalanceDisplay,
  PayoutButton,
  StatsGrid,
  StatCard,
  ContentGrid,
  ChartContainer,
  SectionTitle,
  TimeFilter,
  FilterPill,
  ChartPlaceholder,
  TransactionHistory,
  TransactionItem,
  RightColumn,
  AccountStatus,
  VerificationBadge,
  PayoutProgress,
  SetupButton,
  SummaryCard,
  SecurityNote,
  BankDetailsCard,
  InfoCard,
  InfoButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalClose,
  AccountForm,
  FormGrid,
  InputGroup,
  FormLabel,
  FormInput,
  SelectInput,
  FormActions,
  FormButton,
  PayoutOption,
  Loader,
  SuccessMessage,
  LoadingSpinner,
  WithdrawalHistory,
  WithdrawalItem,
  StatusBadge,
} from "./ExpertEarningsDashboard.styles";

import { useExpert } from "../../../../shared/context/ExpertContext";
import {
  getExpertDashboardApi
} from "../../../../shared/api/expertapi/dashboard.api";

import {
  getEarningSummaryApi,
  getEarningHistoryApi
} from "../../../../shared/api/expertapi/earning.api";

import {
  requestWithdrawalApi,
  getWithdrawalHistoryApi
} from "../../../../shared/api/expertapi/withdrawal.api";

const ExpertEarningsDashboard = () => {
  const { expertData } = useExpert();
  const [timeFilter, setTimeFilter] = useState("month");
  const [earningsStats, setEarningsStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [showSuccess, setShowSuccess] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Track window width for responsive
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Account form state (static for now)
  const [accountDetails, setAccountDetails] = useState({
    fullName: expertData?.name || "Dr. Sarah Johnson",
    bankName: "HDFC Bank",
    accountNumber: "XXXXXXXXXXXX1234",
    ifscCode: "HDFC0001234",
    accountType: "savings",
    upiId: "sarah@okhdfcbank",
    phone: expertData?.phone || "+91 98765 43210",
    email: expertData?.email || "sarah@expertyard.com",
    panNumber: "ABCDE1234F",
    address: "Mumbai, Maharashtra",
  });

  // Payout request state
  const [payoutRequest, setPayoutRequest] = useState({
    amount: 0,
    method: "bank",
  });

  // Load dashboard data
  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const [summaryRes, historyRes, withdrawalRes] = await Promise.all([
        getEarningSummaryApi(),
        getEarningHistoryApi(),
        getWithdrawalHistoryApi(),
      ]);

      // Process Summary Data
     const summary = summaryRes.data.data;   // 🔥 main data yahan hai

setEarningsStats({
  totalEarnings: Number(summary.totalEarning || 0),
  totalMinutes:
    Number(summary.totalChatMinutes || 0) +
    Number(summary.totalCallMinutes || 0),

  chatMinutes: Number(summary.totalChatMinutes || 0),
  callMinutes: Number(summary.totalCallMinutes || 0),

  totalWithdrawn: Number(summary.totalWithdrawn || 0),
  availableBalance: Number(summary.availableBalance || 0),

  completedSessions: historyRes.data.total_records || 0,
});
      // Process Transaction History
      const history = historyRes?.data?.data || [];
      if (Array.isArray(history)) {
        const formattedTransactions = history.map((item, index) => ({
          id: index + 1,
          type: item.session_type,
          amount: parseFloat(item.expert_earning || 0),
          totalAmount: parseFloat(item.total_amount || 0),
          commission: parseFloat(item.commission_amount || 0),
          minutes: parseInt(item.total_minutes || 0),
          rate: parseFloat(item.rate_per_minute || 0),
          date: item.created_at,
          status: "completed",
          description: `${item.session_type} session • ${item.total_minutes} min • ₹${item.rate_per_minute}/min`,
        }));
        setTransactions(formattedTransactions);
      }

      // Process Withdrawal History
      const withdrawals = withdrawalRes?.data?.data || [];
setWithdrawalHistory(withdrawals);
      if (Array.isArray(withdrawals)) {
        setWithdrawalHistory(withdrawals);
      }

      // Check verification status from expertData
      if (expertData?.verification_status) {
        setVerificationStatus(expertData.verification_status);
      } else {
        // If user has completed withdrawals, consider them verified
        const hasWithdrawals = Array.isArray(withdrawals) && withdrawals.length > 0;
        if (hasWithdrawals) {
          setVerificationStatus("verified");
        }
      }

    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [expertData]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Calculate growth percentage (comparing to previous month - simulated for now)
  const calculateGrowth = useCallback(() => {
    if (!earningsStats) return 0;
    // This would need previous month data from API
    // For now, returning a simulated value
    return 12.5;
  }, [earningsStats]);

  const formattedStats = useMemo(() => {
    if (!earningsStats) return null;

    const formattedTotal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(earningsStats.totalEarnings);

    const formattedAvailable = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(earningsStats.availableBalance);

    const formattedWithdrawn = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(earningsStats.totalWithdrawn);

    const growthPercentage = calculateGrowth();

    return {
      ...earningsStats,
      formattedTotal,
      formattedAvailable,
      formattedWithdrawn,
      growthPercentage,
      avgPerSession: earningsStats.completedSessions > 0 
        ? earningsStats.totalEarnings / earningsStats.completedSessions 
        : 0,
      avgPerMinute: earningsStats.totalMinutes > 0 
        ? earningsStats.totalEarnings / earningsStats.totalMinutes 
        : 0,
    };
  }, [earningsStats, calculateGrowth]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let filtered = [...transactions];

    if (timeFilter === "week") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(t => new Date(t.date) > weekAgo);
    } else if (timeFilter === "month") {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter(t => new Date(t.date) > monthAgo);
    }

    return filtered;
  }, [transactions, timeFilter]);

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStatus("verified");
      setShowAccountModal(false);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const handlePayoutRequest = async (e) => {
    e.preventDefault();

    try {
      setIsVerifying(true);
      
      await requestWithdrawalApi({
        amount: payoutRequest.amount,
      });

      setShowPayoutModal(false);
      setShowSuccess(true);
      await loadDashboard(); // Refresh data

      setTimeout(() => setShowSuccess(false), 3000);
    }catch (err) {
  console.log("FULL ERROR →", err);

  const backendMessage =
    err?.response?.data?.message ||
    err?.response?.data?.error ||   // if your backend uses 'error'
    err?.message ||
    "Failed to request payout";

  alert(backendMessage);
} finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayoutChange = (e) => {
    const { name, value } = e.target;
    setPayoutRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'success':
      case 'paid':
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

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'success':
      case 'paid':
        return <FiCheckCircle />;
      case 'pending':
      case 'processing':
        return <FiClockIcon />;
      case 'rejected':
      case 'failed':
        return <FiXCircle />;
      default:
        return <FiAlertCircle />;
    }
  };

  const getTransactionTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'chat':
        return <FiMail size={16} />;
      case 'call':
        return <FiPhone size={16} />;
      default:
        return <FiDollarSign size={16} />;
    }
  };

  const getSessionSummary = () => {
    if (!earningsStats) return { chat: 0, call: 0 };
    return {
      chat: earningsStats.chatMinutes || 0,
      call: earningsStats.callMinutes || 0,
    };
  };

  if (loading) {
    return (
      <PremiumContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
          <p>Loading your earnings dashboard...</p>
        </LoadingSpinner>
      </PremiumContainer>
    );
  }

  if (!formattedStats) {
    return (
      <PremiumContainer>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3>No data available</h3>
          <p>Unable to load earnings information</p>
        </div>
      </PremiumContainer>
    );
  }

  const sessionSummary = getSessionSummary();

  return (
    <PremiumContainer>
      <DashboardContainer>
        {/* Header Section */}
        <Header>
          <HeaderContent>
            <HeaderLeft>
              <Title>
                <MdAttachMoney />
                <span>Earnings Dashboard</span>
              </Title>
              <p style={{ 
                color: '#64748b', 
                marginTop: 8, 
                fontSize: windowWidth < 640 ? '13px' : '14px',
                lineHeight: 1.5 
              }}>
                Track your earnings, manage payouts, and view transaction history
              </p>
            </HeaderLeft>
            
            <HeaderRight>
              <BalanceDisplay>
                <div className="balance-label">Available Balance</div>
                <div className="balance-value">
                  {formatCurrency(formattedStats.availableBalance)}
                </div>
              </BalanceDisplay>
              
              <PayoutButton
                onClick={() => setShowPayoutModal(true)}
                disabled={formattedStats.availableBalance < 100}
              >
                <HiOutlineCurrencyRupee />
                Request Payout
              </PayoutButton>
            </HeaderRight>
          </HeaderContent>
        </Header>

        {/* Stats Grid */}
        <StatsGrid>
          <StatCard $primary>
            <div className="stat-icon">
              <MdAttachMoney />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Earnings</div>
              <div className="stat-value">{formattedStats.formattedTotal}</div>
              <div className="stat-change">
                <FiTrendingUp />
                <span>+{formattedStats.growthPercentage}% this month</span>
              </div>
            </div>
          </StatCard>

          <StatCard $accent>
            <div className="stat-icon">
              <FiClock />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Time</div>
              <div className="stat-value">{formattedStats.totalMinutes} min</div>
              <div className="stat-change">
                <BsGraphUp />
                <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                  <span>Chat: {sessionSummary.chat}min</span>
                  <span>Call: {sessionSummary.call}min</span>
                </div>
              </div>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-icon">
              <BsLightningCharge />
            </div>
            <div className="stat-content">
              <div className="stat-label">Withdrawn</div>
              <div className="stat-value">{formattedStats.formattedWithdrawn}</div>
              <div className="stat-change">
                <BsCalendarCheck />
                <span>Total paid out</span>
              </div>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-icon">
              <TbPigMoney />
            </div>
            <div className="stat-content">
              <div className="stat-label">Available</div>
              <div className="stat-value">{formattedStats.formattedAvailable}</div>
              <div className="stat-change">
                <FiCalendar />
                <span>Ready for withdrawal</span>
              </div>
            </div>
          </StatCard>
        </StatsGrid>

        {/* Main Content Grid */}
        <ContentGrid>
          {/* Left Column - Chart & Transactions */}
          <div>
            {/* Earnings Chart - Optional, can be implemented later */}
            {/* <ChartContainer>
              <div style={{ 
                display: 'flex', 
                flexDirection: windowWidth < 640 ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: windowWidth < 640 ? 'flex-start' : 'center',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <SectionTitle>Earnings Overview</SectionTitle>
                <TimeFilter>
                  <FilterPill 
                    $active={timeFilter === 'week'} 
                    onClick={() => setTimeFilter('week')}
                  >
                    Week
                  </FilterPill>
                  <FilterPill 
                    $active={timeFilter === 'month'} 
                    onClick={() => setTimeFilter('month')}
                  >
                    Month
                  </FilterPill>
                  <FilterPill 
                    $active={timeFilter === 'year'} 
                    onClick={() => setTimeFilter('year')}
                  >
                    Year
                  </FilterPill>
                </TimeFilter>
              </div>
              
              <ChartPlaceholder>
                <div style={{ textAlign: 'center' }}>
                  <BsGraphUp size={28} />
                  <div>Earnings chart coming soon</div>
                  <div style={{ fontSize: '12px', marginTop: '4px', color: '#94a3b8' }}>
                    Your earnings visualization will appear here
                  </div>
                </div>
              </ChartPlaceholder>
            </ChartContainer> */}

            {/* Transaction History */}
            <TransactionHistory>
              <div style={{ 
                display: 'flex', 
                flexDirection: windowWidth < 480 ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: windowWidth < 480 ? 'flex-start' : 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <SectionTitle>Recent Transactions</SectionTitle>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    color: '#64748b',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
                >
                  <FiDownload size={14} />
                  Export CSV
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TransactionItem key={transaction.id}>
                      <div className="transaction-icon">
                        {getTransactionTypeIcon(transaction.type)}
                      </div>
                      
                      <div className="transaction-details">
                        <div className="transaction-title">
                          {transaction.description}
                        </div>
                        <div className="transaction-date">
                          {formatDate(transaction.date)}
                        </div>
                        <div style={{ 
                          fontSize: '11px', 
                          color: '#94a3b8',
                          marginTop: '2px',
                          display: 'flex',
                          gap: '8px'
                        }}>
                          <span>Rate: ₹{transaction.rate}/min</span>
                          <span>Commission: {formatCurrency(transaction.commission)}</span>
                        </div>
                      </div>
                      
                      <div className="transaction-amount">
                        <div className="amount">
                          +{formatCurrency(transaction.amount)}
                        </div>
                        <div 
                          className="status" 
                          style={{ color: getStatusColor(transaction.status) }}
                        >
                          {transaction.status}
                        </div>
                      </div>
                      
                      <button className="transaction-action">
                        <FiChevronRight />
                      </button>
                    </TransactionItem>
                  ))
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px 20px',
                    color: '#64748b',
                    fontSize: '14px'
                  }}>
                    No transactions found
                  </div>
                )}
              </div>
            </TransactionHistory>
          </div>

          {/* Right Column - Account & Payout */}
          <RightColumn>
            {/* Account Status */}
            <AccountStatus>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <SectionTitle>Account Status</SectionTitle>
                <VerificationBadge $status={verificationStatus}>
                  {verificationStatus === 'verified' && <MdVerified size={14} />}
                  {verificationStatus === 'pending' && <FiAlertCircle size={14} />}
                  {verificationStatus === 'rejected' && <MdWarning size={14} />}
                  {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
                </VerificationBadge>
              </div>

              <PayoutProgress>
                <div className="progress-header">
                  <div className="progress-label">Account Completion</div>
                  <div className="progress-percentage">
                    {verificationStatus === 'verified' ? '100%' : '75%'}
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: verificationStatus === 'verified' ? '100%' : '75%' }}
                  />
                </div>
                <div className="progress-steps">
                  {[
                    { number: 1, label: 'Profile', completed: true },
                    { number: 2, label: 'Bank Details', completed: verificationStatus === 'verified' },
                    { number: 3, label: 'KYC', completed: verificationStatus === 'verified' }
                  ].map((step, index) => (
                    <div key={index} className="step">
                      <div className="step-number">{step.number}</div>
                      <div className="step-label">{step.label}</div>
                    </div>
                  ))}
                </div>

                <SetupButton
                  $verified={verificationStatus === 'verified'}
                  onClick={() => setShowAccountModal(true)}
                >
                  {verificationStatus === 'verified' ? (
                    <>
                      <FiUser size={16} />
                      View Account Details
                    </>
                  ) : (
                    <>
                      <FiLock size={16} />
                      Complete Account Setup
                    </>
                  )}
                </SetupButton>
              </PayoutProgress>
            </AccountStatus>

            {/* Payout Summary */}
            <SummaryCard>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <SectionTitle>Payout Summary</SectionTitle>
                <FiShare2 size={18} color="#64748b" style={{ cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { 
                    label: 'Available Balance', 
                    value: formatCurrency(formattedStats.availableBalance) 
                  },
                  { 
                    label: 'Total Withdrawn', 
                    value: formatCurrency(formattedStats.totalWithdrawn) 
                  },
                  { 
                    label: 'Min. Withdrawal', 
                    value: formatCurrency(100) 
                  },
                  { 
                    label: 'Processing Time', 
                    value: '3-5 business days' 
                  }
                ].map((item, index) => (
                  <div key={index} className="summary-item">
                    <div className="summary-label">{item.label}</div>
                    <div className="summary-value">{item.value}</div>
                  </div>
                ))}
              </div>

              <SecurityNote>
                <FiShield />
                <div className="security-text">
                  <div className="security-title">Secure & Encrypted</div>
                  <div className="security-description">
                    All transactions are protected with bank-level security
                  </div>
                </div>
              </SecurityNote>
            </SummaryCard>

            {/* Withdrawal History */}
            {withdrawalHistory.length > 0 && (
              <WithdrawalHistory>
                <SectionTitle style={{ marginBottom: '16px' }}>
                  Recent Withdrawals
                </SectionTitle>
                
                {withdrawalHistory.slice(0, 3).map((withdrawal) => (
                  <WithdrawalItem key={withdrawal.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <StatusBadge $status={withdrawal.status}>
                        {getStatusIcon(withdrawal.status)}
                      </StatusBadge>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>
                          {formatCurrency(withdrawal.amount)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {formatDate(withdrawal.created_at)}
                        </div>
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: 500,
                      color: getStatusColor(withdrawal.status),
                      textTransform: 'capitalize'
                    }}>
                      {withdrawal.status}
                    </div>
                  </WithdrawalItem>
                ))}
              </WithdrawalHistory>
            )}

            {/* Bank Details Preview */}
            {verificationStatus === 'verified' && (
              <BankDetailsCard>
                <SectionTitle>Bank Details</SectionTitle>
                <div style={{ marginTop: '16px' }}>
                  {[
                    { label: 'Bank Name', value: accountDetails.bankName },
                    { label: 'Account Number', value: accountDetails.accountNumber },
                    { label: 'IFSC Code', value: accountDetails.ifscCode },
                    { label: 'UPI ID', value: accountDetails.upiId }
                  ].map((detail, index) => (
                    <div key={index} className="bank-detail">
                      <div className="detail-label">{detail.label}</div>
                      <div className="detail-value">{detail.value}</div>
                    </div>
                  ))}
                </div>
              </BankDetailsCard>
            )}

            {/* Info Card */}
            <InfoCard>
              <FiDollarSign />
              <div className="info-content">
                <div className="info-title">Need Help With Payouts?</div>
                <div className="info-description">
                  Contact our support team for payout-related queries
                </div>
              </div>
              <InfoButton>Contact</InfoButton>
            </InfoCard>
          </RightColumn>
        </ContentGrid>
      </DashboardContainer>

      {/* Success Message */}
      {showSuccess && (
        <SuccessMessage>
          <MdVerified size={32} />
          <h3>Success!</h3>
          <p>Your request has been processed successfully.</p>
        </SuccessMessage>
      )}

      {/* Account Details Modal */}
      {showAccountModal && (
        <ModalOverlay onClick={() => !isVerifying && setShowAccountModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Account Details</h2>
              <ModalClose
                onClick={() => !isVerifying && setShowAccountModal(false)}
                disabled={isVerifying}
              >
                ×
              </ModalClose>
            </ModalHeader>

            <AccountForm onSubmit={handleAccountSubmit}>
              <FormGrid>
                <InputGroup>
                  <FormLabel>
                    <FiUser />
                    Full Name
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="fullName"
                    value={accountDetails.fullName}
                    onChange={handleInputChange}
                    disabled
                  />
                </InputGroup>

                <InputGroup>
                  <FormLabel>
                    <FiMail />
                    Email Address
                  </FormLabel>
                  <FormInput
                    type="email"
                    name="email"
                    value={accountDetails.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </InputGroup>

                <InputGroup>
                  <FormLabel>
                    <FiPhone />
                    Phone Number
                  </FormLabel>
                  <FormInput
                    type="tel"
                    name="phone"
                    value={accountDetails.phone}
                    onChange={handleInputChange}
                    disabled
                  />
                </InputGroup>

                <InputGroup>
                  <FormLabel>
                    <FiCreditCard />
                    PAN Number
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="panNumber"
                    value={accountDetails.panNumber}
                    onChange={handleInputChange}
                    disabled
                  />
                </InputGroup>

                <InputGroup $fullWidth>
                  <FormLabel>
                    <FiMapPin />
                    Address
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="address"
                    value={accountDetails.address}
                    onChange={handleInputChange}
                    disabled
                  />
                </InputGroup>

                <InputGroup $fullWidth>
                  <SectionTitle style={{ marginBottom: '16px' }}>
                    Bank Account Details
                  </SectionTitle>
                </InputGroup>

                <InputGroup>
                  <FormLabel>
                    <FiHome />
                    Bank Name
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="bankName"
                    value={accountDetails.bankName}
                    onChange={handleInputChange}
                    disabled
                  />
                </InputGroup>

                <InputGroup>
                  <FormLabel>
                    <FiCreditCard />
                    Account Number
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="accountNumber"
                    value={accountDetails.accountNumber}
                    onChange={handleInputChange}
                    disabled
                  />
                </InputGroup>

                <InputGroup>
                  <FormLabel>
                    <FiLock />
                    IFSC Code
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="ifscCode"
                    value={accountDetails.ifscCode}
                    onChange={handleInputChange}
                    disabled
                  />
                </InputGroup>

                <InputGroup $fullWidth>
                  <FormLabel>
                    <HiOutlineCurrencyRupee />
                    UPI ID
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="upiId"
                    value={accountDetails.upiId}
                    onChange={handleInputChange}
                    disabled
                  />
                </InputGroup>
              </FormGrid>

              <SecurityNote style={{ marginTop: '24px' }}>
                <FiShield />
                <div className="security-text">
                  <div className="security-title">Secure Information</div>
                  <div className="security-description">
                    Your bank details are encrypted and stored securely.
                  </div>
                </div>
              </SecurityNote>

              <FormActions>
                <FormButton
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                >
                  Close
                </FormButton>
              </FormActions>
            </AccountForm>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <ModalOverlay onClick={() => setShowPayoutModal(false)}>
          <ModalContent style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Request Payout</h2>
              <ModalClose onClick={() => setShowPayoutModal(false)}>×</ModalClose>
            </ModalHeader>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                Available Balance
              </div>
              <div style={{ 
                fontSize: windowWidth < 480 ? '28px' : '32px', 
                fontWeight: 700, 
                color: '#1e293b' 
              }}>
                {formatCurrency(formattedStats.availableBalance)}
              </div>
            </div>

            <form onSubmit={handlePayoutRequest}>
              <InputGroup>
                <FormLabel>Amount to Withdraw</FormLabel>
                <FormInput
                  type="number"
                  name="amount"
                  value={payoutRequest.amount}
                  onChange={handlePayoutChange}
                  placeholder="Enter amount"
                  min="100"
                  max={formattedStats.availableBalance}
                  required
                  disabled={isVerifying}
                />
                <div style={{ 
                  fontSize: '12px', 
                  color: '#64748b', 
                  marginTop: '6px' 
                }}>
                  Minimum withdrawal: {formatCurrency(100)}
                </div>
              </InputGroup>

              <div style={{ marginTop: '24px' }}>
                <FormLabel>Payout Method</FormLabel>
                <PayoutOption
                  $selected={payoutRequest.method === 'bank'}
                  onClick={() => !isVerifying && setPayoutRequest(prev => ({ ...prev, method: 'bank' }))}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div 
                      className="option-icon"
                      style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)' }}
                    >
                      <FiHome size={18} />
                    </div>
                    <div>
                      <div className="option-title">Bank Transfer</div>
                      <div className="option-subtitle">3-5 business days processing</div>
                    </div>
                  </div>
                </PayoutOption>

                <PayoutOption
                  $selected={payoutRequest.method === 'upi'}
                  onClick={() => !isVerifying && setPayoutRequest(prev => ({ ...prev, method: 'upi' }))}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div 
                      className="option-icon"
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}
                    >
                      <HiOutlineCurrencyRupee size={18} />
                    </div>
                    <div>
                      <div className="option-title">UPI Instant</div>
                      <div className="option-subtitle">Within 24 hours</div>
                    </div>
                  </div>
                </PayoutOption>
              </div>

              <SecurityNote style={{ marginTop: '24px' }}>
                <FiShield />
                <div className="security-text">
                  <div className="security-title">Processing Information</div>
                  <div className="security-description">
                    Payouts are processed every Monday and Thursday.
                  </div>
                </div>
              </SecurityNote>

              <FormActions>
                <FormButton 
                  type="submit" 
                  $primary 
                  disabled={isVerifying || payoutRequest.amount < 100 || payoutRequest.amount > formattedStats.availableBalance}
                >
                  {isVerifying ? (
                    <>
                      <Loader />
                      Processing...
                    </>
                  ) : (
                    <>
                      <HiOutlineCurrencyRupee size={18} />
                      Request Payout
                    </>
                  )}
                </FormButton>
                
                <FormButton 
                  type="button" 
                  onClick={() => setShowPayoutModal(false)}
                  disabled={isVerifying}
                >
                  Cancel
                </FormButton>
              </FormActions>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </PremiumContainer>
  );
};

export default ExpertEarningsDashboard;