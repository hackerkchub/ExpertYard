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
} from "react-icons/fi";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdAttachMoney, MdVerified } from "react-icons/md";
import { BsGraphUp, BsLightningCharge } from "react-icons/bs";
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
  const [showSuccess, setShowSuccess] = useState(false);

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
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const handlePayoutRequest = (e) => {
    e.preventDefault();
    // Handle payout request
    setShowPayoutModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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
                fontSize: '14px',
                lineHeight: 1.5 
              }}>
                Track your earnings, manage payouts, and update account details
              </p>
            </HeaderLeft>
            
            <HeaderRight>
              <BalanceDisplay>
                <div className="balance-label">Available Balance</div>
                <div className="balance-value">
                  {formatCurrency(earningsStats.pendingPayout)}
                </div>
              </BalanceDisplay>
              
              <PayoutButton
                onClick={() => setShowPayoutModal(true)}
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
              <div className="stat-value">{earningsStats.formattedTotal}</div>
              <div className="stat-change">
                <FiTrendingUp />
                <span>+{earningsStats.growthPercentage}% this month</span>
              </div>
            </div>
          </StatCard>

          <StatCard $accent>
            <div className="stat-icon">
              <FiClock />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Time</div>
              <div className="stat-value">{earningsStats.totalMinutes} min</div>
              <div className="stat-change">
                <BsGraphUp />
                <span>₹{earningsStats.avgPerMinute.toFixed(2)}/min avg</span>
              </div>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-icon">
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <div className="stat-label">This Month</div>
              <div className="stat-value">{earningsStats.formattedThisMonth}</div>
              <div className="stat-change">
                <BsLightningCharge />
                <span>{earningsStats.completedSessions} sessions</span>
              </div>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-icon">
              <TbPigMoney />
            </div>
            <div className="stat-content">
              <div className="stat-label">Pending Payout</div>
              <div className="stat-value">{earningsStats.formattedPending}</div>
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
            {/* Earnings Chart */}
            <ChartContainer>
              <div style={{ 
                display: 'flex', 
                flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: window.innerWidth < 640 ? 'flex-start' : 'center',
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
                  <div>Earnings chart will appear here</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    Visual representation of your earnings over time
                  </div>
                </div>
              </ChartPlaceholder>
            </ChartContainer>

            {/* Transaction History */}
            <TransactionHistory>
              <div style={{ 
                display: 'flex', 
                flexDirection: window.innerWidth < 480 ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: window.innerWidth < 480 ? 'flex-start' : 'center',
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
                {filteredTransactions.map(transaction => (
                  <TransactionItem key={transaction.id}>
                    <div className="transaction-icon">
                      {transaction.type === 'chat' ? (
                        <FiMail size={16} />
                      ) : (
                        <FiPhone size={16} />
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
                      <FiChevronRight />
                    </button>
                  </TransactionItem>
                ))}
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
                  {verificationStatus === 'rejected' && <FiAlertCircle size={14} />}
                  {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
                </VerificationBadge>
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
                  {[
                    { number: 1, label: 'Account Details', completed: verificationStatus === 'verified' },
                    { number: 2, label: 'KYC Verification', completed: verificationStatus === 'verified' },
                    { number: 3, label: 'First Payout', completed: false }
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
                      Update Account Details
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
                  { label: 'Available Balance', value: formatCurrency(earningsStats.pendingPayout) },
                  { label: 'Next Payout Date', value: '15 March 2024' },
                  { label: 'Min. Withdrawal', value: formatCurrency(1000) },
                  { label: 'Processing Time', value: '3-5 business days' }
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

            {/* Bank Details Preview */}
            {verificationStatus === 'verified' && (
              <BankDetailsCard>
                <SectionTitle>Bank Details</SectionTitle>
                <div style={{ marginTop: '16px' }}>
                  {[
                    { label: 'Bank Name', value: 'HDFC Bank' },
                    { label: 'Account Number', value: '●●●● ●●●● 1234' },
                    { label: 'IFSC Code', value: 'HDFC0001234' }
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

      {/* Account Setup Modal */}
      {showAccountModal && (
        <ModalOverlay onClick={() => !isVerifying && setShowAccountModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>
                {verificationStatus === 'verified' ? 'Update Account Details' : 'Complete Account Setup'}
              </h2>
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
                    placeholder="Enter your full name"
                    required
                    disabled={isVerifying}
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
                    placeholder="Enter your email"
                    required
                    disabled={isVerifying}
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
                    placeholder="Enter phone number"
                    required
                    disabled={isVerifying}
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
                    placeholder="ABCDE1234F"
                    required
                    disabled={isVerifying}
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
                    placeholder="Enter your complete address"
                    required
                    disabled={isVerifying}
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
                    placeholder="e.g., HDFC Bank"
                    required
                    disabled={isVerifying}
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
                    placeholder="Enter account number"
                    required
                    disabled={isVerifying}
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
                    placeholder="e.g., HDFC0001234"
                    required
                    disabled={isVerifying}
                  />
                </InputGroup>

                <InputGroup>
                  <FormLabel>
                    <FiCreditCard />
                    Account Type
                  </FormLabel>
                  <SelectInput
                    name="accountType"
                    value={accountDetails.accountType}
                    onChange={handleInputChange}
                    required
                    disabled={isVerifying}
                  >
                    <option value="savings">Savings Account</option>
                    <option value="current">Current Account</option>
                  </SelectInput>
                </InputGroup>

                <InputGroup $fullWidth>
                  <FormLabel>
                    <HiOutlineCurrencyRupee />
                    UPI ID (Optional)
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="upiId"
                    value={accountDetails.upiId}
                    onChange={handleInputChange}
                    placeholder="username@bank"
                    disabled={isVerifying}
                  />
                </InputGroup>
              </FormGrid>

              <SecurityNote style={{ marginTop: '24px' }}>
                <FiShield />
                <div className="security-text">
                  <div className="security-title">Secure Information</div>
                  <div className="security-description">
                    Your bank details are encrypted and stored securely. We never share your information with third parties.
                  </div>
                </div>
              </SecurityNote>

              <FormActions>
                <FormButton
                  type="submit"
                  $primary
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader />
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
                fontSize: window.innerWidth < 480 ? '28px' : '32px', 
                fontWeight: 700, 
                color: '#1e293b' 
              }}>
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
                <div style={{ 
                  fontSize: '12px', 
                  color: '#64748b', 
                  marginTop: '6px' 
                }}>
                  Minimum withdrawal: {formatCurrency(1000)}
                </div>
              </InputGroup>

              <div style={{ marginTop: '24px' }}>
                <FormLabel>Payout Method</FormLabel>
                <PayoutOption
                  $selected={payoutRequest.method === 'bank'}
                  onClick={() => setPayoutRequest(prev => ({ ...prev, method: 'bank' }))}
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
                  onClick={() => setPayoutRequest(prev => ({ ...prev, method: 'upi' }))}
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
                    Payouts are processed every Monday and Thursday. A 2% processing fee applies to all withdrawals.
                  </div>
                </div>
              </SecurityNote>

              <FormActions>
                <FormButton type="submit" $primary>
                  <HiOutlineCurrencyRupee size={18} />
                  Request Payout
                </FormButton>
                
                <FormButton type="button" onClick={() => setShowPayoutModal(false)}>
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