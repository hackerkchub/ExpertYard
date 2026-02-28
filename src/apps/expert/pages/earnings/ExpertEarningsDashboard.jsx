// ExpertEarningsDashboard.jsx
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
  FiSearch,
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
  FiEye,
  FiEyeOff,
  FiCopy,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronDown,
  FiFilter,
} from "react-icons/fi";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdAttachMoney, MdVerified, MdWarning, MdInfo } from "react-icons/md";
import { BsGraphUp, BsLightningCharge, BsCalendarCheck, BsBank2 } from "react-icons/bs";
import { TbPigMoney } from "react-icons/tb";
import { FaRegCreditCard, FaWallet, FaHistory, FaExchangeAlt } from "react-icons/fa";

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
  AllWithdrawalsSection,
  WithdrawalsTable,
  TableHeaderCell,
  TableRow,
  TableCell,
  WithdrawalDetailsModal,
  FilterBar,
  SearchInput,
  DateRangePicker,
  ExportButton,
  EmptyState,
  Pagination,
  PageButton,
  MobileWithdrawalCard,
  MobileCardHeader,
  MobileCardBody,
  MobileCardFooter,
  DesktopOnly,
  MobileOnly,
  BalanceContainer,
  RightColumnGrid,
  InfoCardsContainer,
  StatsRow,
  TransactionMeta,
  // TabContainer,
  Label,
  Tab,
  MobileTransactionCard,
  MobileTabBar,
  // MobileFilterBar,
  MobileFilterButton,
  MobileSearchBar,
  FilterDrawer,
  FilterDrawerHeader,
  FilterDrawerBody,
  FilterDrawerFooter,
  ActionButton,
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
  getWithdrawalHistoryApi,
  getExpertAllWithdrawalsApi
} from "../../../../shared/api/expertapi/withdrawal.api";

const ExpertEarningsDashboard = () => {
  const { expertData } = useExpert();
  const [timeFilter, setTimeFilter] = useState("month");
  const [earningsStats, setEarningsStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showWithdrawalDetailsModal, setShowWithdrawalDetailsModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [showSuccess, setShowSuccess] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [allWithdrawals, setAllWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [activeMobileTab, setActiveMobileTab] = useState('overview'); // 'overview', 'transactions', 'withdrawals'
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter states for withdrawals
  const [withdrawalFilter, setWithdrawalFilter] = useState({
    status: 'all',
    search: '',
    dateFrom: '',
    dateTo: '',
  });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Expanded view state
  const [expandedWithdrawals, setExpandedWithdrawals] = useState(false);
  const [expandedTransactions, setExpandedTransactions] = useState(false);

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

      const [summaryRes, historyRes, withdrawalRes, allWithdrawalsRes] = await Promise.all([
        getEarningSummaryApi(),
        getEarningHistoryApi(),
        getWithdrawalHistoryApi(),
        getExpertAllWithdrawalsApi(),
      ]);

      // Process Summary Data
      const summary = summaryRes.data.data;
      
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

      // Process Withdrawal History (recent withdrawals)
      const withdrawals = withdrawalRes?.data?.data || [];
      setWithdrawalHistory(withdrawals);
      
      // Process All Withdrawals (complete history)
      const allWithdrawalsData = allWithdrawalsRes?.data?.data || [];
      if (Array.isArray(allWithdrawalsData)) {
        const formattedWithdrawals = allWithdrawalsData.map(withdrawal => ({
          id: withdrawal.id,
          amount: parseFloat(withdrawal.amount || 0),
          status: withdrawal.status || 'pending',
          payment_method: withdrawal.payment_method || 'bank_transfer',
          transaction_ref: withdrawal.transaction_ref || '-',
          rejection_reason: withdrawal.rejection_reason || null,
          created_at: withdrawal.created_at,
          paid_at: withdrawal.paid_at || null,
          processed_at: withdrawal.processed_at || null,
          formatted_amount: new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
          }).format(withdrawal.amount || 0),
        }));
        setAllWithdrawals(formattedWithdrawals);
        setFilteredWithdrawals(formattedWithdrawals);
      }

      // Check verification status from expertData
      if (expertData?.verification_status) {
        setVerificationStatus(expertData.verification_status);
      } else {
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

  // Filter withdrawals based on filter criteria
  useEffect(() => {
    let filtered = [...allWithdrawals];
    
    if (withdrawalFilter.status !== 'all') {
      filtered = filtered.filter(w => w.status === withdrawalFilter.status);
    }
    
    if (withdrawalFilter.search) {
      const searchLower = withdrawalFilter.search.toLowerCase();
      filtered = filtered.filter(w => 
        w.transaction_ref?.toLowerCase().includes(searchLower) ||
        w.amount.toString().includes(searchLower) ||
        w.formatted_amount.includes(searchLower)
      );
    }
    
    if (withdrawalFilter.dateFrom) {
      const fromDate = new Date(withdrawalFilter.dateFrom).setHours(0, 0, 0, 0);
      filtered = filtered.filter(w => new Date(w.created_at) >= fromDate);
    }
    
    if (withdrawalFilter.dateTo) {
      const toDate = new Date(withdrawalFilter.dateTo).setHours(23, 59, 59, 999);
      filtered = filtered.filter(w => new Date(w.created_at) <= toDate);
    }
    
    setFilteredWithdrawals(filtered);
    setCurrentPage(1);
  }, [allWithdrawals, withdrawalFilter]);

  const calculateGrowth = useCallback(() => {
    if (!earningsStats) return 0;
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

  const paginatedWithdrawals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredWithdrawals.slice(startIndex, endIndex);
  }, [filteredWithdrawals, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage);

  // Get visible transactions based on expanded state and screen size
  const visibleTransactions = useMemo(() => {
    if (windowWidth < 768) {
      return expandedTransactions ? filteredTransactions : filteredTransactions.slice(0, 5);
    }
    return filteredTransactions;
  }, [filteredTransactions, expandedTransactions, windowWidth]);

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    
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
      await loadDashboard();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.log("FULL ERROR →", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
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

  const handleFilterChange = (key, value) => {
    setWithdrawalFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setWithdrawalFilter({
      status: 'all',
      search: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const handleViewWithdrawalDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowWithdrawalDetailsModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
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

  const getPaymentMethodIcon = (method) => {
    switch(method?.toLowerCase()) {
      case 'bank_transfer':
      case 'bank':
        return <BsBank2 />;
      case 'upi':
        return <HiOutlineCurrencyRupee />;
      case 'card':
        return <FaRegCreditCard />;
      default:
        return <FiCreditCard />;
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

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', text: '#92400e' },
      approved: { bg: '#d1fae5', text: '#065f46' },
      paid: { bg: '#d1fae5', text: '#065f46' },
      completed: { bg: '#d1fae5', text: '#065f46' },
      rejected: { bg: '#fee2e2', text: '#991b1b' },
      failed: { bg: '#fee2e2', text: '#991b1b' },
      processing: { bg: '#e0f2fe', text: '#0369a1' }
    };
    const color = colors[status?.toLowerCase()] || { bg: '#f1f5f9', text: '#334155' };
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: color.bg,
        color: color.text,
        textTransform: 'capitalize'
      }}>
        {getStatusIcon(status)}
        {status}
      </span>
    );
  };

  // Mobile view for transactions
  const renderMobileTransactions = () => {
    return visibleTransactions.map((transaction) => (
      <MobileTransactionCard key={transaction.id}>
        <div className="transaction-left">
          <div className="transaction-icon">
            {getTransactionTypeIcon(transaction.type)}
          </div>
          <div className="transaction-info">
            <div className="transaction-title">{transaction.description}</div>
            <div className="transaction-meta">
              <span>{formatDate(transaction.date)}</span>
              <span>• {transaction.minutes} min</span>
            </div>
          </div>
        </div>
        <div className="transaction-right">
          <div className="transaction-amount">+{formatCurrency(transaction.amount)}</div>
          <div className="transaction-rate">₹{transaction.rate}/min</div>
        </div>
      </MobileTransactionCard>
    ));
  };

  // Mobile view for withdrawals
  const renderMobileWithdrawals = () => {
  return paginatedWithdrawals.map((withdrawal) => (
    <MobileWithdrawalCard key={withdrawal.id}>
      <MobileCardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <strong style={{ fontSize: '14px' }}>#{withdrawal.id}</strong>
          <span style={{ fontSize: '12px', color: '#475569' }}>
            {formatDate(withdrawal.created_at)}
          </span>
        </div>
        {getStatusBadge(withdrawal.status)}
      </MobileCardHeader>
      
      <MobileCardBody>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '16px', 
          marginBottom: '16px' 
        }}>
          <div>
            <div className="detail-label">Amount</div>
            <div className="detail-value">{withdrawal.formatted_amount}</div>
          </div>
          <div>
            <div className="detail-label">Payment Method</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {getPaymentMethodIcon(withdrawal.payment_method)}
              <span style={{ 
                fontSize: '13px', 
                textTransform: 'capitalize',
                color: '#0f172a',
                fontWeight: 500
              }}>
                {withdrawal.payment_method?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <div className="detail-label">Transaction Reference</div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            background: '#f8fafc',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <span style={{ 
              fontFamily: 'monospace', 
              fontSize: '13px',
              color: '#0f172a',
              wordBreak: 'break-all',
              flex: 1
            }}>
              {withdrawal.transaction_ref}
            </span>
            {withdrawal.transaction_ref !== '-' && (
              <FiCopy
                size={16}
                style={{ 
                  cursor: 'pointer', 
                  color: '#64748b',
                  flexShrink: 0
                }}
                onClick={() => copyToClipboard(withdrawal.transaction_ref)}
              />
            )}
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px',
          marginTop: '8px'
        }}>
          <div>
            <div className="detail-label">Requested</div>
            <div style={{ fontSize: '12px', color: '#0f172a' }}>
              {formatDateTime(withdrawal.created_at)}
            </div>
          </div>
          <div>
            <div className="detail-label">Processed</div>
            <div style={{ fontSize: '12px', color: '#0f172a' }}>
              {withdrawal.processed_at ? formatDateTime(withdrawal.processed_at) : '-'}
            </div>
          </div>
        </div>
      </MobileCardBody>
      
      <MobileCardFooter>
        <ActionButton onClick={() => handleViewWithdrawalDetails(withdrawal)}>
          <FiEye size={14} />
          View Details
        </ActionButton>
      </MobileCardFooter>
    </MobileWithdrawalCard>
  ));
};

  // Mobile overview tab content
  const renderMobileOverview = () => {
    const sessionSummary = getSessionSummary();
    
    return (
      <>
        {/* Stats Cards - Mobile */}
        <StatsGrid>
          <StatCard $primary>
            <div className="stat-icon">
              <MdAttachMoney />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Earnings</div>
              <div className="stat-value">{formattedStats?.formattedTotal}</div>
              <div className="stat-change">
                <FiTrendingUp />
                <span>+{formattedStats?.growthPercentage}%</span>
              </div>
            </div>
          </StatCard>

          <StatCard $accent>
            <div className="stat-icon">
              <FiClock />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Time</div>
              <div className="stat-value">{formattedStats?.totalMinutes} min</div>
              <div className="stat-change">
                <StatsRow>
                  <span>Chat: {sessionSummary.chat}min</span>
                  <span>Call: {sessionSummary.call}min</span>
                </StatsRow>
              </div>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-icon">
              <BsLightningCharge />
            </div>
            <div className="stat-content">
              <div className="stat-label">Withdrawn</div>
              <div className="stat-value">{formattedStats?.formattedWithdrawn}</div>
              <div className="stat-change">
                <BsCalendarCheck />
                <span>Total paid</span>
              </div>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-icon">
              <TbPigMoney />
            </div>
            <div className="stat-content">
              <div className="stat-label">Available</div>
              <div className="stat-value">{formattedStats?.formattedAvailable}</div>
              <div className="stat-change">
                <FiCalendar />
                <span>Ready to withdraw</span>
              </div>
            </div>
          </StatCard>
        </StatsGrid>

        {/* Account Status Card - Mobile */}
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
                { number: 2, label: 'Bank', completed: verificationStatus === 'verified' },
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

        {/* Summary Card - Mobile */}
        <SummaryCard>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <SectionTitle>Payout Summary</SectionTitle>
            <FiShare2 size={16} color="#64748b" style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { 
                label: 'Available Balance', 
                value: formatCurrency(formattedStats?.availableBalance) 
              },
              { 
                label: 'Total Withdrawn', 
                value: formatCurrency(formattedStats?.totalWithdrawn) 
              },
              { 
                label: 'Min. Withdrawal', 
                value: formatCurrency(100) 
              },
              { 
                label: 'Processing Time', 
                value: '3-5 days' 
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
                Bank-level security for all transactions
              </div>
            </div>
          </SecurityNote>
        </SummaryCard>

        {/* Withdrawal History Preview - Mobile */}
        {withdrawalHistory.length > 0 && (
          <WithdrawalHistory>
            <SectionTitle style={{ marginBottom: '12px' }}>
              Recent Withdrawals
            </SectionTitle>
            
            {withdrawalHistory.slice(0, 3).map((withdrawal) => (
              <WithdrawalItem key={withdrawal.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <StatusBadge $status={withdrawal.status}>
                    {getStatusIcon(withdrawal.status)}
                  </StatusBadge>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
                      {formatCurrency(withdrawal.amount)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {formatDate(withdrawal.created_at)}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: 500,
                  color: getStatusColor(withdrawal.status),
                  textTransform: 'capitalize'
                }}>
                  {withdrawal.status}
                </div>
              </WithdrawalItem>
            ))}
            
            {allWithdrawals.length > 3 && (
              <button
                onClick={() => {
                  setActiveMobileTab('withdrawals');
                  setExpandedWithdrawals(true);
                }}
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '8px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#8b5cf6',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <FiEye size={12} />
                View All Withdrawals ({allWithdrawals.length})
              </button>
            )}
          </WithdrawalHistory>
        )}

        {/* Info Cards - Mobile */}
        <InfoCardsContainer>
          {verificationStatus === 'verified' && (
            <BankDetailsCard>
              <SectionTitle>Bank Details</SectionTitle>
              <div style={{ marginTop: '12px' }}>
                {[
                  { label: 'Bank', value: accountDetails.bankName },
                  { label: 'Account', value: accountDetails.accountNumber },
                  { label: 'IFSC', value: accountDetails.ifscCode },
                  { label: 'UPI', value: accountDetails.upiId }
                ].map((detail, index) => (
                  <div key={index} className="bank-detail">
                    <div className="detail-label">{detail.label}</div>
                    <div className="detail-value">{detail.value}</div>
                  </div>
                ))}
              </div>
            </BankDetailsCard>
          )}

          <InfoCard>
            <FiDollarSign />
            <div className="info-content">
              <div className="info-title">Need Help?</div>
              <div className="info-description">
                Contact support for payout queries
              </div>
            </div>
            <InfoButton>Contact</InfoButton>
          </InfoCard>
        </InfoCardsContainer>
      </>
    );
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
              <BalanceContainer>
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
              </BalanceContainer>
            </HeaderRight>
          </HeaderContent>
        </Header>

        {/* Desktop View - Original Layout with Improved Balance */}
        <DesktopOnly>
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
                  <StatsRow>
                    <span>Chat: {sessionSummary.chat}min</span>
                    <span>Call: {sessionSummary.call}min</span>
                  </StatsRow>
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

          {/* Main Content Grid - Desktop */}
          <ContentGrid>
            {/* Left Column - Transactions */}
            <TransactionHistory>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <SectionTitle>Recent Transactions</SectionTitle>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                      $active={timeFilter === 'all'} 
                      onClick={() => setTimeFilter('all')}
                    >
                      All
                    </FilterPill>
                  </TimeFilter>
                  <ExportButton>
                    <FiDownload size={14} />
                    Export
                  </ExportButton>
                </div>
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
                        <TransactionMeta>
                          <span>Rate: ₹{transaction.rate}/min</span>
                          <span>Commission: {formatCurrency(transaction.commission)}</span>
                        </TransactionMeta>
                      </div>
                      
                      <div className="transaction-amount">
                        <div className="amount">
                          +{formatCurrency(transaction.amount)}
                        </div>
                        <div className="status" style={{ color: getStatusColor(transaction.status) }}>
                          {transaction.status}
                        </div>
                      </div>
                      
                      <button className="transaction-action">
                        <FiChevronRight />
                      </button>
                    </TransactionItem>
                  ))
                ) : (
                  <EmptyState>
                    <FiRefreshCw size={32} />
                    <h3>No transactions found</h3>
                    <p>Your recent transactions will appear here</p>
                  </EmptyState>
                )}
              </div>
            </TransactionHistory>

            {/* Right Column - All Cards in Grid Layout */}
            <RightColumn>
              <RightColumnGrid>
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
                        { number: 2, label: 'Bank', completed: verificationStatus === 'verified' },
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
                    marginBottom: '16px'
                  }}>
                    <SectionTitle>Payout Summary</SectionTitle>
                    <FiShare2 size={16} color="#64748b" style={{ cursor: 'pointer' }} />
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
                        value: '3-5 days' 
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
                        Bank-level security for all transactions
                      </div>
                    </div>
                  </SecurityNote>
                </SummaryCard>

                {/* Withdrawal History Preview */}
                {withdrawalHistory.length > 0 && (
                  <WithdrawalHistory>
                    <SectionTitle style={{ marginBottom: '12px' }}>
                      Recent Withdrawals
                    </SectionTitle>
                    
                    {withdrawalHistory.slice(0, 3).map((withdrawal) => (
                      <WithdrawalItem key={withdrawal.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <StatusBadge $status={withdrawal.status}>
                            {getStatusIcon(withdrawal.status)}
                          </StatusBadge>
                          <div>
                            <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
                              {formatCurrency(withdrawal.amount)}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              {formatDate(withdrawal.created_at)}
                            </div>
                          </div>
                        </div>
                        <div style={{ 
                          fontSize: '11px', 
                          fontWeight: 500,
                          color: getStatusColor(withdrawal.status),
                          textTransform: 'capitalize'
                        }}>
                          {withdrawal.status}
                        </div>
                      </WithdrawalItem>
                    ))}
                    
                    {allWithdrawals.length > 3 && (
                      <button
                        onClick={() => setExpandedWithdrawals(!expandedWithdrawals)}
                        style={{
                          width: '100%',
                          marginTop: '12px',
                          padding: '8px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          color: '#8b5cf6',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <FiEye size={12} />
                        {expandedWithdrawals ? 'Show Less' : `View All (${allWithdrawals.length})`}
                      </button>
                    )}
                  </WithdrawalHistory>
                )}

                {/* Info Cards Container */}
                <InfoCardsContainer>
                  {/* Bank Details Preview */}
                  {verificationStatus === 'verified' && (
                    <BankDetailsCard>
                      <SectionTitle>Bank Details</SectionTitle>
                      <div style={{ marginTop: '12px' }}>
                        {[
                          { label: 'Bank', value: accountDetails.bankName },
                          { label: 'Account', value: accountDetails.accountNumber },
                          { label: 'IFSC', value: accountDetails.ifscCode },
                          { label: 'UPI', value: accountDetails.upiId }
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
                      <div className="info-title">Need Help?</div>
                      <div className="info-description">
                        Contact support for payout queries
                      </div>
                    </div>
                    <InfoButton>Contact</InfoButton>
                  </InfoCard>
                </InfoCardsContainer>
              </RightColumnGrid>
            </RightColumn>
          </ContentGrid>
        </DesktopOnly>

        {/* Mobile View - Tabbed Interface */}
        <MobileOnly>
          {/* Mobile Tab Navigation */}
          <MobileTabBar>
            <Tab 
              $active={activeMobileTab === 'overview'} 
              onClick={() => setActiveMobileTab('overview')}
            >
              <FaWallet size={16} />
              Overview
            </Tab>
            <Tab 
              $active={activeMobileTab === 'transactions'} 
              onClick={() => setActiveMobileTab('transactions')}
            >
              <FaExchangeAlt size={16} />
              Transactions
            </Tab>
            <Tab 
              $active={activeMobileTab === 'withdrawals'} 
              onClick={() => setActiveMobileTab('withdrawals')}
            >
              <FaHistory size={16} />
              Withdrawals
            </Tab>
          </MobileTabBar>

          {/* Overview Tab */}
          {activeMobileTab === 'overview' && renderMobileOverview()}

          {/* Transactions Tab */}
          {activeMobileTab === 'transactions' && (
            <>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '8px'
              }}>
                <SectionTitle>Transaction History</SectionTitle>
                <MobileFilterButton onClick={() => setShowMobileFilters(true)}>
                  <FiFilter size={14} />
                  Filter
                </MobileFilterButton>
              </div>

              {/* Mobile Filter Drawer */}
             {showMobileFilters && (
  <FilterDrawer>
    <FilterDrawerHeader>
      <h3>Filter Withdrawals</h3>
      <ModalClose onClick={() => setShowMobileFilters(false)}>×</ModalClose>
    </FilterDrawerHeader>
    <FilterDrawerBody>
      <div style={{ marginBottom: '20px' }}>
        <Label>Status</Label>
        <SelectInput
          value={withdrawalFilter.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </SelectInput>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Label>Search</Label>
        <MobileSearchBar>
          <FiSearch size={16} />
          <input
            type="text"
            placeholder="Search by amount or reference..."
            value={withdrawalFilter.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </MobileSearchBar>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Label>Date Range</Label>
        <DateRangePicker>
          <input
            type="date"
            value={withdrawalFilter.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            placeholder="From"
          />
          <span>to</span>
          <input
            type="date"
            value={withdrawalFilter.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            placeholder="To"
          />
        </DateRangePicker>
      </div>
    </FilterDrawerBody>
    <FilterDrawerFooter>
      <PrimaryButton onClick={() => setShowMobileFilters(false)}>
        Apply Filters
      </PrimaryButton>
      <SecondaryButton 
        onClick={() => {
          clearFilters();
          setShowMobileFilters(false);
        }}
      >
        Clear All
      </SecondaryButton>
    </FilterDrawerFooter>
  </FilterDrawer>
)}
              {/* Transactions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {visibleTransactions.length > 0 ? (
                  renderMobileTransactions()
                ) : (
                  <EmptyState>
                    <FiRefreshCw size={32} />
                    <h3>No transactions found</h3>
                    <p>Your transactions will appear here</p>
                  </EmptyState>
                )}
              </div>

              {/* Show More Button */}
              {filteredTransactions.length > 5 && !expandedTransactions && (
                <button
                  onClick={() => setExpandedTransactions(true)}
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    padding: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    color: '#8b5cf6',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <FiChevronDown size={16} />
                  Show More ({filteredTransactions.length - 5} more)
                </button>
              )}

              {/* Show Less Button */}
              {expandedTransactions && (
                <button
                  onClick={() => setExpandedTransactions(false)}
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    padding: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  Show Less
                </button>
              )}

              {/* Export Button */}
              <ExportButton style={{ marginTop: '16px', width: '100%' }}>
                <FiDownload size={14} />
                Export Transactions
              </ExportButton>
            </>
          )}

          {/* Withdrawals Tab */}
          {activeMobileTab === 'withdrawals' && (
            <>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '8px'
              }}>
                <SectionTitle>Withdrawal History</SectionTitle>
                <MobileFilterButton onClick={() => setShowMobileFilters(true)}>
                  <FiFilter size={14} />
                  Filter
                </MobileFilterButton>
              </div>

              {/* Mobile Filter Drawer for Withdrawals */}
              {showMobileFilters && (
                <FilterDrawer>
                  <FilterDrawerHeader>
                    <h3>Filter Withdrawals</h3>
                    <ModalClose onClick={() => setShowMobileFilters(false)}>×</ModalClose>
                  </FilterDrawerHeader>
                  <FilterDrawerBody>
                    <div style={{ marginBottom: '16px' }}>
                      <Label>Status</Label>
                      <SelectInput
                        value={withdrawalFilter.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </SelectInput>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <Label>Search</Label>
                      <MobileSearchBar>
                        <FiSearch size={14} />
                        <input
                          type="text"
                          placeholder="Search withdrawals..."
                          value={withdrawalFilter.search}
                          onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                      </MobileSearchBar>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <Label>Date Range</Label>
                      <DateRangePicker>
                        <input
                          type="date"
                          value={withdrawalFilter.dateFrom}
                          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                          placeholder="From"
                        />
                        <span>to</span>
                        <input
                          type="date"
                          value={withdrawalFilter.dateTo}
                          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                          placeholder="To"
                        />
                      </DateRangePicker>
                    </div>
                  </FilterDrawerBody>
                  <FilterDrawerFooter>
                    <PrimaryButton onClick={() => setShowMobileFilters(false)}>
                      Apply Filters
                    </PrimaryButton>
                    <SecondaryButton 
                      onClick={() => {
                        clearFilters();
                        setShowMobileFilters(false);
                      }}
                    >
                      Clear
                    </SecondaryButton>
                  </FilterDrawerFooter>
                </FilterDrawer>
              )}

              {/* Active Filters Display */}
              {(withdrawalFilter.status !== 'all' || withdrawalFilter.search || withdrawalFilter.dateFrom || withdrawalFilter.dateTo) && (
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '8px', 
                  marginBottom: '16px',
                  padding: '8px',
                  background: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  {withdrawalFilter.status !== 'all' && (
                    <FilterTag>
                      Status: {withdrawalFilter.status}
                      <button onClick={() => handleFilterChange('status', 'all')}>×</button>
                    </FilterTag>
                  )}
                  {withdrawalFilter.search && (
                    <FilterTag>
                      Search: {withdrawalFilter.search}
                      <button onClick={() => handleFilterChange('search', '')}>×</button>
                    </FilterTag>
                  )}
                  {(withdrawalFilter.dateFrom || withdrawalFilter.dateTo) && (
                    <FilterTag>
                      Date: {withdrawalFilter.dateFrom || 'Any'} to {withdrawalFilter.dateTo || 'Any'}
                      <button onClick={() => {
                        handleFilterChange('dateFrom', '');
                        handleFilterChange('dateTo', '');
                      }}>×</button>
                    </FilterTag>
                  )}
                  <ClearFilters onClick={clearFilters}>
                    Clear All
                  </ClearFilters>
                </div>
              )}

              {/* Withdrawals List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {paginatedWithdrawals.length > 0 ? (
                  renderMobileWithdrawals()
                ) : (
                  <EmptyState>
                    <FiRefreshCw size={32} />
                    <h3>No withdrawals found</h3>
                    <p>Your withdrawal history will appear here</p>
                  </EmptyState>
                )}
              </div>

              {/* Pagination */}
              {filteredWithdrawals.length > itemsPerPage && (
                <Pagination>
                  <PageButton
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <FiChevronLeft size={14} />
                  </PageButton>
                  
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <PageButton
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <FiChevronRight size={14} />
                  </PageButton>
                </Pagination>
              )}
            </>
          )}
        </MobileOnly>

        {/* All Withdrawals Section - Complete History (Desktop) */}
        <DesktopOnly>
          <AllWithdrawalsSection $expanded={expandedWithdrawals}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div>
                <SectionTitle style={{ marginBottom: '4px' }}>
                  Complete Withdrawal History
                </SectionTitle>
                <p style={{ color: '#64748b', fontSize: '14px' }}>
                  View all your past withdrawal requests
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <ExportButton onClick={() => {}}>
                  <FiDownload size={14} />
                  Export
                </ExportButton>
                
                <button
                  onClick={() => setExpandedWithdrawals(false)}
                  style={{
                    padding: '8px 16px',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#475569',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <FiEyeOff size={14} />
                  Collapse
                </button>
              </div>
            </div>

            {/* Filters */}
            <FilterBar>
              <SearchInput>
                <FiSearch size={14} />
                <input
                  type="text"
                  placeholder="Search by amount or transaction ref..."
                  value={withdrawalFilter.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </SearchInput>
              
              <SelectInput
                value={withdrawalFilter.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </SelectInput>
              
              <DateRangePicker>
                <input
                  type="date"
                  value={withdrawalFilter.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  placeholder="From"
                />
                <span>to</span>
                <input
                  type="date"
                  value={withdrawalFilter.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  placeholder="To"
                />
              </DateRangePicker>
              
              {(withdrawalFilter.search || withdrawalFilter.status !== 'all' || withdrawalFilter.dateFrom || withdrawalFilter.dateTo) && (
                <ClearFilters onClick={clearFilters}>
                  Clear Filters
                </ClearFilters>
              )}
            </FilterBar>

            {/* Desktop Table View */}
            <WithdrawalsTable>
              <table>
                <thead>
                  <tr>
                    <TableHeaderCell>ID</TableHeaderCell>
                    <TableHeaderCell>Amount</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Payment Method</TableHeaderCell>
                    <TableHeaderCell>Transaction Ref</TableHeaderCell>
                    <TableHeaderCell>Requested On</TableHeaderCell>
                    <TableHeaderCell>Processed On</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {paginatedWithdrawals.length > 0 ? (
                    paginatedWithdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell>#{withdrawal.id}</TableCell>
                        <TableCell>
                          <strong>{withdrawal.formatted_amount}</strong>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(withdrawal.status)}
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {getPaymentMethodIcon(withdrawal.payment_method)}
                            <span style={{ textTransform: 'capitalize' }}>
                              {withdrawal.payment_method?.replace('_', ' ')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {withdrawal.transaction_ref !== '-' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                                {withdrawal.transaction_ref}
                              </span>
                              <FiCopy
                                size={12}
                                style={{ cursor: 'pointer', color: '#64748b' }}
                                onClick={() => copyToClipboard(withdrawal.transaction_ref)}
                              />
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>{formatDateTime(withdrawal.created_at)}</TableCell>
                        <TableCell>
                          {withdrawal.processed_at ? formatDateTime(withdrawal.processed_at) : '-'}
                        </TableCell>
                        <TableCell>
                          <ActionButton
                            onClick={() => handleViewWithdrawalDetails(withdrawal)}
                          >
                            <FiEye size={12} />
                            View
                          </ActionButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <tr>
                      <TableCell colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                        <EmptyState>
                          <FiRefreshCw size={32} />
                          <h3>No withdrawals found</h3>
                          <p>Try adjusting your filters or request a new payout</p>
                        </EmptyState>
                      </TableCell>
                    </tr>
                  )}
                </tbody>
              </table>
            </WithdrawalsTable>

            {/* Pagination */}
            {filteredWithdrawals.length > itemsPerPage && (
              <Pagination>
                <PageButton
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </PageButton>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PageButton
                    key={i + 1}
                    $active={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PageButton>
                ))}
                
                <PageButton
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PageButton>
              </Pagination>
            )}
            
            <div style={{
              marginTop: '12px',
              fontSize: '12px',
              color: '#64748b',
              textAlign: 'right'
            }}>
              Showing {paginatedWithdrawals.length} of {filteredWithdrawals.length} withdrawals
            </div>
          </AllWithdrawalsSection>
        </DesktopOnly>
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
                fontSize: windowWidth < 480 ? '24px' : '28px', 
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
                  fontSize: '11px', 
                  color: '#64748b', 
                  marginTop: '4px' 
                }}>
                  Minimum withdrawal: {formatCurrency(100)}
                </div>
              </InputGroup>

              <div style={{ marginTop: '20px' }}>
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
                      <FiHome size={16} />
                    </div>
                    <div>
                      <div className="option-title">Bank Transfer</div>
                      <div className="option-subtitle">3-5 business days</div>
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
                      <HiOutlineCurrencyRupee size={16} />
                    </div>
                    <div>
                      <div className="option-title">UPI Instant</div>
                      <div className="option-subtitle">Within 24 hours</div>
                    </div>
                  </div>
                </PayoutOption>
              </div>

              <SecurityNote style={{ marginTop: '20px' }}>
                <FiShield />
                <div className="security-text">
                  <div className="security-title">Processing Information</div>
                  <div className="security-description">
                    Payouts processed on Monday & Thursday
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
                      <HiOutlineCurrencyRupee size={16} />
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

      {/* Withdrawal Details Modal */}
      {showWithdrawalDetailsModal && selectedWithdrawal && (
        <ModalOverlay onClick={() => setShowWithdrawalDetailsModal(false)}>
          <ModalContent style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Withdrawal Details</h2>
              <ModalClose onClick={() => setShowWithdrawalDetailsModal(false)}>×</ModalClose>
            </ModalHeader>

            <WithdrawalDetailsModal>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '10px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                    Withdrawal ID
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>
                    #{selectedWithdrawal.id}
                  </div>
                </div>
                {getStatusBadge(selectedWithdrawal.status)}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>Amount</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>
                    {selectedWithdrawal.formatted_amount}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '12px', color: '#101316', marginBottom: '2px' }}>Payment Method</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#8b5cf6'
                    }}>
                      {getPaymentMethodIcon(selectedWithdrawal.payment_method)}
                    </div>
                    <span style={{ textTransform: 'capitalize', fontSize: '13px', color: '#1c1d1e' }}>
                      {selectedWithdrawal.payment_method?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>Requested On</div>
                  <div style={{ fontSize: '13px', color: '#1c1d1e' }}>{formatDateTime(selectedWithdrawal.created_at)}</div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: '#1f2225', marginBottom: '2px' }}>Processed On</div>
                  <div style={{ fontSize: '13px', color: '#1c1d1e' }}>
                    {selectedWithdrawal.processed_at ? formatDateTime(selectedWithdrawal.processed_at) : '-'}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                    Transaction Reference
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#1c1d1e',
                    background: '#f8fafc',
                    padding: '8px',
                    borderRadius: '6px'
                  }}>
                    {selectedWithdrawal.transaction_ref}
                    {selectedWithdrawal.transaction_ref !== '-' && (
                      <FiCopy
                        size={12}
                        style={{ cursor: 'pointer', color: '#64748b', marginLeft: 'auto' }}
                        onClick={() => copyToClipboard(selectedWithdrawal.transaction_ref)}
                      />
                    )}
                  </div>
                </div>
              </div>

              {selectedWithdrawal.rejection_reason && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: '#fee2e2',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                  fontSize: '13px',
                  color: '#991b1b'
                }}>
                  <strong>Rejection Reason:</strong> {selectedWithdrawal.rejection_reason}
                </div>
              )}

              <FormActions style={{ marginTop: '20px' }}>
                <FormButton
                  type="button"
                  onClick={() => setShowWithdrawalDetailsModal(false)}
                >
                  Close
                </FormButton>
              </FormActions>
            </WithdrawalDetailsModal>
          </ModalContent>
        </ModalOverlay>
      )}
    </PremiumContainer>
  );
};

export default ExpertEarningsDashboard;