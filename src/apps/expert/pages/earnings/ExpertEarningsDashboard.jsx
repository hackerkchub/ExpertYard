// src/apps/expert/pages/earnings/ExpertEarningsDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
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
//   FiCheckCircle,
  FiDownload,
  FiShare2,
//   FiFilter,
  FiChevronRight,
//   FiChevronDown,
  FiAlertCircle,
  FiLock,
  FiShield,
} from "react-icons/fi";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdAttachMoney, MdAccountBalance, MdVerified } from "react-icons/md";
import { BsGraphUp, BsLightningCharge } from "react-icons/bs";
import { TbPigMoney } from "react-icons/tb";

import {
  PremiumContainer,
  DashboardContainer,
  Header,
  Title,
  StatsGrid,
  StatCard,
  ChartContainer,
//   EarningsChart,
//   PayoutCard,
  AccountForm,
  InputGroup,
  FormLabel,
  FormInput,
  SelectInput,
  FormButton,
//   VerificationBadge,
  SectionTitle,
  TransactionHistory,
  TransactionItem,
  TimeFilter,
  FilterPill,
  SummaryCard,
  AccountStatus,
  PayoutProgress,
  InfoCard,
  ModalOverlay,
  ModalContent,
//   SuccessMessage,
  BankDetailsCard,
} from "./ExpertEarningsDashboard.styles";

import { useExpert } from "../../../../shared/context/ExpertContext";

// Mock data - Replace with API calls
const mockTransactions = [
  { id: 1, date: "2024-02-25", amount: 2500, type: "chat", status: "completed", description: "Chat session with User123" },
  { id: 2, date: "2024-02-24", amount: 1800, type: "chat", status: "completed", description: "Chat session with User456" },
  { id: 3, date: "2024-02-23", amount: 3200, type: "call", status: "completed", description: "Voice call consultation" },
  { id: 4, date: "2024-02-22", amount: 1500, type: "chat", status: "pending", description: "Chat session with User789" },
  { id: 5, date: "2024-02-21", amount: 4200, type: "call", status: "completed", description: "Extended consultation" },
  { id: 6, date: "2024-02-20", amount: 2800, type: "chat", status: "completed", description: "Chat session with User101" },
];

const mockEarningsData = {
  totalEarnings: 85400,
  totalMinutes: 2135,
  completedSessions: 128,
  pendingPayout: 12500,
  thisMonthEarnings: 25600,
  lastMonthEarnings: 19800,
  growthPercentage: 29.3,
};

const ExpertEarningsDashboard = () => {
  const { expertData } = useExpert();
  const [timeFilter, setTimeFilter] = useState("month");
  const [transactions, setTransactions] = useState(mockTransactions);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("pending"); // pending, verified, rejected

  // Account form state
  const [accountDetails, setAccountDetails] = useState({
    fullName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "savings",
    upiId: "",
    phone: "",
    email: expertData?.email || "",
    panNumber: "",
    address: "",
  });

  // Payout request state
  const [payoutRequest, setPayoutRequest] = useState({
    amount: 0,
    method: "bank",
  });

  const earningsStats = useMemo(() => {
    const base = mockEarningsData;
    const formattedTotal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(base.totalEarnings);

    const formattedPending = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(base.pendingPayout);

    const formattedThisMonth = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(base.thisMonthEarnings);

    return {
      ...base,
      formattedTotal,
      formattedPending,
      formattedThisMonth,
      avgPerSession: base.totalEarnings / base.completedSessions,
      avgPerMinute: base.totalEarnings / base.totalMinutes,
    };
  }, []);

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
      // Show success message
    }, 2000);
  };

  const handlePayoutRequest = (e) => {
    e.preventDefault();
    // Handle payout request
    setShowPayoutModal(false);
    // Show success message
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
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <PremiumContainer>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .verification-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-left: 12px;
        }
        
        .verified-badge {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
        }
        
        .pending-badge {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
        }
        
        .rejected-badge {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
        }
        
        .chart-placeholder {
          height: 200px;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-style: italic;
        }
        
        .payout-option {
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 12px;
        }
        
        .payout-option:hover {
          border-color: #8b5cf6;
          background: #f8fafc;
        }
        
        .payout-option.selected {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
        }
        
        .security-note {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 12px;
          margin-top: 20px;
          color: #92400e;
        }
        
        .success-animation {
          animation: fadeIn 0.5s ease;
        }
        
        .loader {
          width: 20px;
          height: 20px;
          border: 2px solid #e2e8f0;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <DashboardContainer>
        {/* Header Section */}
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <Title>
                <MdAttachMoney style={{ marginRight: 12, color: '#8b5cf6' }} />
                <span className="gradient-text">Earnings Dashboard</span>
              </Title>
              <p style={{ color: '#64748b', marginTop: 8, fontSize: 15 }}>
                Track your earnings, manage payouts, and update account details
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Available Balance</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>
                  {formatCurrency(earningsStats.pendingPayout)}
                </div>
              </div>
              
              <button
                onClick={() => setShowPayoutModal(true)}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <HiOutlineCurrencyRupee size={18} />
                Request Payout
              </button>
            </div>
          </div>
        </Header>

        {/* Stats Grid */}
        <StatsGrid>
          <StatCard primary>
            <div className="stat-icon">
              <MdAttachMoney size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Earnings</div>
              <div className="stat-value">{earningsStats.formattedTotal}</div>
              <div className="stat-change">
                <FiTrendingUp size={14} />
                <span>+{earningsStats.growthPercentage}% this month</span>
              </div>
            </div>
          </StatCard>

          <StatCard accent>
            <div className="stat-icon">
              <FiClock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Time</div>
              <div className="stat-value">{earningsStats.totalMinutes} min</div>
              <div className="stat-change">
                <BsGraphUp size={14} />
                <span>{earningsStats.avgPerMinute.toFixed(2)}/min avg</span>
              </div>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-icon">
              <FiTrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">This Month</div>
              <div className="stat-value">{earningsStats.formattedThisMonth}</div>
              <div className="stat-change">
                <BsLightningCharge size={14} />
                <span>{earningsStats.completedSessions} sessions</span>
              </div>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-icon">
              <TbPigMoney size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Pending Payout</div>
              <div className="stat-value">{earningsStats.formattedPending}</div>
              <div className="stat-change">
                <FiCalendar size={14} />
                <span>Ready for withdrawal</span>
              </div>
            </div>
          </StatCard>
        </StatsGrid>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24, marginTop: 32 }}>
          {/* Left Column - Chart & Transactions */}
          <div>
            {/* Earnings Chart */}
            <ChartContainer>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <SectionTitle>Earnings Overview</SectionTitle>
                <TimeFilter>
                  <FilterPill 
                    active={timeFilter === 'week'} 
                    onClick={() => setTimeFilter('week')}
                  >
                    Week
                  </FilterPill>
                  <FilterPill 
                    active={timeFilter === 'month'} 
                    onClick={() => setTimeFilter('month')}
                  >
                    Month
                  </FilterPill>
                  <FilterPill 
                    active={timeFilter === 'year'} 
                    onClick={() => setTimeFilter('year')}
                  >
                    Year
                  </FilterPill>
                </TimeFilter>
              </div>
              
              <div className="chart-placeholder">
                <div style={{ textAlign: 'center' }}>
                  <BsGraphUp size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <div>Earnings chart will appear here</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Visual representation of your earnings over time</div>
                </div>
              </div>
            </ChartContainer>

            {/* Transaction History */}
            <TransactionHistory>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <SectionTitle>Recent Transactions</SectionTitle>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#64748b',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <FiDownload size={14} />
                  Export CSV
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredTransactions.map(transaction => (
                  <TransactionItem key={transaction.id}>
                    <div className="transaction-icon">
                      {transaction.type === 'chat' ? (
                        <FiMail size={18} />
                      ) : (
                        <FiPhone size={18} />
                      )}
                    </div>
                    
                    <div className="transaction-details">
                      <div className="transaction-title">{transaction.description}</div>
                      <div className="transaction-date">{formatDate(transaction.date)}</div>
                    </div>
                    
                    <div className="transaction-amount">
                      <div className="amount">+{formatCurrency(transaction.amount)}</div>
                      <div 
                        className="status" 
                        style={{ color: getStatusColor(transaction.status) }}
                      >
                        {transaction.status}
                      </div>
                    </div>
                    
                    <button className="transaction-action">
                      <FiChevronRight size={18} />
                    </button>
                  </TransactionItem>
                ))}
              </div>
            </TransactionHistory>
          </div>

          {/* Right Column - Account & Payout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Account Status */}
            <AccountStatus>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <SectionTitle>Account Status</SectionTitle>
                <div className={`verification-badge ${verificationStatus}-badge`}>
                  {verificationStatus === 'verified' && <MdVerified size={14} />}
                  {verificationStatus === 'pending' && <FiAlertCircle size={14} />}
                  {verificationStatus === 'rejected' && <FiAlertCircle size={14} />}
                  {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
                </div>
              </div>

              <PayoutProgress>
                <div className="progress-header">
                  <div className="progress-label">Payout Readiness</div>
                  <div className="progress-percentage">75%</div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <div className="progress-steps">
                  <div className={`step ${verificationStatus === 'verified' ? 'completed' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-label">Account Details</div>
                  </div>
                  <div className={`step ${verificationStatus === 'verified' ? 'completed' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-label">KYC Verification</div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-label">First Payout</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowAccountModal(true)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: verificationStatus === 'verified' ? '#f8fafc' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: verificationStatus === 'verified' ? '#64748b' : 'white',
                    border: verificationStatus === 'verified' ? '1px solid #e2e8f0' : 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    marginTop: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {verificationStatus === 'verified' ? (
                    <>
                      <FiUser size={16} />
                      Update Account Details
                    </>
                  ) : (
                    <>
                      <FiLock size={16} />
                      Complete Account Setup
                    </>
                  )}
                </button>
              </PayoutProgress>
            </AccountStatus>

            {/* Payout Summary */}
            <SummaryCard>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <SectionTitle>Payout Summary</SectionTitle>
                <FiShare2 size={18} color="#64748b" style={{ cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="summary-item">
                  <div className="summary-label">Available Balance</div>
                  <div className="summary-value">{formatCurrency(earningsStats.pendingPayout)}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Next Payout Date</div>
                  <div className="summary-value">15 March 2024</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Min. Withdrawal</div>
                  <div className="summary-value">{formatCurrency(1000)}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Processing Time</div>
                  <div className="summary-value">3-5 business days</div>
                </div>
              </div>

              <div className="security-note">
                <FiShield size={20} />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Secure & Encrypted</div>
                  <div style={{ fontSize: 13 }}>All transactions are protected with bank-level security</div>
                </div>
              </div>
            </SummaryCard>

            {/* Bank Details Preview */}
            {verificationStatus === 'verified' && (
              <BankDetailsCard>
                <SectionTitle>Bank Details</SectionTitle>
                <div style={{ marginTop: 16 }}>
                  <div className="bank-detail">
                    <div className="detail-label">Bank Name</div>
                    <div className="detail-value">HDFC Bank</div>
                  </div>
                  <div className="bank-detail">
                    <div className="detail-label">Account Number</div>
                    <div className="detail-value">●●●● ●●●● 1234</div>
                  </div>
                  <div className="bank-detail">
                    <div className="detail-label">IFSC Code</div>
                    <div className="detail-value">HDFC0001234</div>
                  </div>
                </div>
              </BankDetailsCard>
            )}

            {/* Info Card */}
            <InfoCard>
              <FiDollarSign size={24} color="#8b5cf6" />
              <div>
                <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>
                  Need Help With Payouts?
                </div>
                <div style={{ fontSize: 14, color: '#64748b' }}>
                  Contact our support team for payout-related queries
                </div>
              </div>
              <button
                style={{
                  padding: '8px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#64748b',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Contact
              </button>
            </InfoCard>
          </div>
        </div>
      </DashboardContainer>

      {/* Account Setup Modal */}
      {showAccountModal && (
        <ModalOverlay onClick={() => !isVerifying && setShowAccountModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1e293b' }}>
                {verificationStatus === 'verified' ? 'Update Account Details' : 'Complete Account Setup'}
              </h2>
              <button
                onClick={() => !isVerifying && setShowAccountModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: 4,
                }}
                disabled={isVerifying}
              >
                ×
              </button>
            </div>

            <AccountForm onSubmit={handleAccountSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <InputGroup>
                  <FormLabel>
                    <FiUser size={16} />
                    Full Name
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="fullName"
                    value={accountDetails.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <FormLabel>
                    <FiMail size={16} />
                    Email Address
                  </FormLabel>
                  <FormInput
                    type="email"
                    name="email"
                    value={accountDetails.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <FormLabel>
                    <FiPhone size={16} />
                    Phone Number
                  </FormLabel>
                  <FormInput
                    type="tel"
                    name="phone"
                    value={accountDetails.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <FormLabel>
                    <FiCreditCard size={16} />
                    PAN Number
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="panNumber"
                    value={accountDetails.panNumber}
                    onChange={handleInputChange}
                    placeholder="ABCDE1234F"
                    required
                  />
                </InputGroup>

                <InputGroup style={{ gridColumn: 'span 2' }}>
                  <FormLabel>
                    <FiMapPin size={16} />
                    Address
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="address"
                    value={accountDetails.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    required
                  />
                </InputGroup>
              </div>

              <div style={{ marginTop: 32 }}>
                <SectionTitle>Bank Account Details</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 16 }}>
                  <InputGroup>
                    <FormLabel>
                      <FiHome size={16} />
                      Bank Name
                    </FormLabel>
                    <FormInput
                      type="text"
                      name="bankName"
                      value={accountDetails.bankName}
                      onChange={handleInputChange}
                      placeholder="e.g., HDFC Bank"
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <FormLabel>
                      <FiCreditCard size={16} />
                      Account Number
                    </FormLabel>
                    <FormInput
                      type="text"
                      name="accountNumber"
                      value={accountDetails.accountNumber}
                      onChange={handleInputChange}
                      placeholder="Enter account number"
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <FormLabel>
                      <FiLock size={16} />
                      IFSC Code
                    </FormLabel>
                    <FormInput
                      type="text"
                      name="ifscCode"
                      value={accountDetails.ifscCode}
                      onChange={handleInputChange}
                      placeholder="e.g., HDFC0001234"
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <FormLabel>
                      <FiCreditCard size={16} />
                      Account Type
                    </FormLabel>
                    <SelectInput
                      name="accountType"
                      value={accountDetails.accountType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="savings">Savings Account</option>
                      <option value="current">Current Account</option>
                    </SelectInput>
                  </InputGroup>

                  <InputGroup style={{ gridColumn: 'span 2' }}>
                    <FormLabel>
                      <HiOutlineCurrencyRupee size={16} />
                      UPI ID (Optional)
                    </FormLabel>
                    <FormInput
                      type="text"
                      name="upiId"
                      value={accountDetails.upiId}
                      onChange={handleInputChange}
                      placeholder="username@bank"
                    />
                  </InputGroup>
                </div>
              </div>

              <div className="security-note" style={{ marginTop: 24 }}>
                <FiShield size={20} />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Secure Information</div>
                  <div style={{ fontSize: 13 }}>Your bank details are encrypted and stored securely. We never share your information with third parties.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                <FormButton
                  type="submit"
                  primary
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <div className="loader" style={{ marginRight: 8 }}></div>
                      Verifying...
                    </>
                  ) : (
                    'Save & Verify Account'
                  )}
                </FormButton>
                
                <FormButton
                  type="button"
                  onClick={() => !isVerifying && setShowAccountModal(false)}
                  disabled={isVerifying}
                >
                  Cancel
                </FormButton>
              </div>
            </AccountForm>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <ModalOverlay onClick={() => setShowPayoutModal(false)}>
          <ModalContent style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1e293b' }}>
                Request Payout
              </h2>
              <button
                onClick={() => setShowPayoutModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>Available Balance</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>
                {formatCurrency(earningsStats.pendingPayout)}
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
                  min="1000"
                  max={earningsStats.pendingPayout}
                  required
                />
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  Minimum withdrawal: {formatCurrency(1000)}
                </div>
              </InputGroup>

              <div style={{ marginTop: 24 }}>
                <FormLabel>Payout Method</FormLabel>
                <div
                  className={`payout-option ${payoutRequest.method === 'bank' ? 'selected' : ''}`}
                  onClick={() => setPayoutRequest(prev => ({ ...prev, method: 'bank' }))}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)', 
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <FiHome size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>Bank Transfer</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>3-5 business days processing</div>
                    </div>
                  </div>
                </div>

                <div
                  className={`payout-option ${payoutRequest.method === 'upi' ? 'selected' : ''}`}
                  onClick={() => setPayoutRequest(prev => ({ ...prev, method: 'upi' }))}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', 
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <HiOutlineCurrencyRupee size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>UPI Instant</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>Within 24 hours</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="security-note" style={{ marginTop: 24 }}>
                <FiShield size={20} />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Processing Information</div>
                  <div style={{ fontSize: 13 }}>Payouts are processed every Monday and Thursday. A 2% processing fee applies to all withdrawals.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                <FormButton
                  type="submit"
                  primary
                  style={{ flex: 1 }}
                >
                  <HiOutlineCurrencyRupee size={18} />
                  Request Payout
                </FormButton>
                
                <FormButton
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </FormButton>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </PremiumContainer>
  );
};

export default ExpertEarningsDashboard;