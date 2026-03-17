import React, { useEffect, useState, useCallback } from "react";
import { FaUserCircle, FaFilter, FaHistory, FaPlus, FaWallet, FaCalendarAlt } from "react-icons/fa";
import { MdAccountBalanceWallet, MdPayments, MdTrendingUp } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

import {
  PageWrap,
  WalletBox,
  HeaderRow,
  BalanceCard,
  BalanceAmount,
  ExpenseSection,
  SectionTitle,
  ExpertCard,
  ExpertLeft,
  Avatar,
  ExpertInfo,
  ExpertRight,
  AmountBox,
  TopupSection,
  AddBalanceBtn,
  QuickAddRow,
  QuickAddBtn,
  StatsGrid,
  StatCard,
  FilterDropdown,
  DateRangePicker,
  TransactionBadge,
  ProgressBar,
  EmptyState,
  LoadingState,
  ErrorState
} from "./Wallet.styles";

import AddBalancePopup from "../../components/AddBalancePopup/AddBalancePopup";
import { useWallet } from "../../../../shared/context/WalletContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { getWalletHistoryApi } from "../../../../shared/api/userApi/walletApi";

// Helper function to check if dates are in same month
const isSameMonth = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const WalletPage = () => {
  const { balance, addMoney } = useWallet();
  const { user } = useAuth();
  
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [stats, setStats] = useState({
    totalDebits: 0,
    totalCredits: 0,
    monthlySpent: 0,
    avgTransaction: 0,
    topExpert: null,
    transactionCount: 0
  });

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupAmount, setPopupAmount] = useState(null);

  const [filterType, setFilterType] = useState("thisMonth");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customRange, setCustomRange] = useState({ from: "", to: "" });

  /* ================= FETCH REAL DATA ================= */
  const fetchWalletHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWalletHistoryApi();
      
      if (response.success && response.data) {
        setTransactions(response.data);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Error fetching wallet history:", err);
      setError("Failed to load transaction history");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletHistory();
  }, [fetchWalletHistory]);

  /* ================= PROCESS TRANSACTIONS ================= */
  useEffect(() => {
    if (!transactions.length) {
      setFilteredTransactions([]);
      setStats({
        totalDebits: 0,
        totalCredits: 0,
        monthlySpent: 0,
        avgTransaction: 0,
        topExpert: null,
        transactionCount: 0
      });
      return;
    }

    // Separate credits and debits
    const credits = transactions.filter(t => t.type === 'credit');
    const debits = transactions.filter(t => t.type === 'debit');

    // Calculate monthly spent (current month debits)
    const currentMonthDebits = debits.filter(t => 
      isSameMonth(t.created_at, new Date())
    );
    const monthlySpent = currentMonthDebits.reduce((sum, t) => sum + t.amount, 0);

    // Calculate average transaction amount (only debits)
    const avgTransaction = debits.length > 0 
      ? Math.round(debits.reduce((sum, t) => sum + t.amount, 0) / debits.length) 
      : 0;

    // Find top expert (most spent on)
    const expertSpending = debits.reduce((acc, t) => {
      if (t.expert_name) {
        acc[t.expert_name] = (acc[t.expert_name] || 0) + t.amount;
      }
      return acc;
    }, {});

    let topExpert = null;
    let maxSpent = 0;
    
    Object.entries(expertSpending).forEach(([name, amount]) => {
      if (amount > maxSpent) {
        maxSpent = amount;
        topExpert = { name, amount };
      }
    });

    setStats({
      totalDebits: debits.reduce((sum, t) => sum + t.amount, 0),
      totalCredits: credits.reduce((sum, t) => sum + t.amount, 0),
      monthlySpent,
      avgTransaction,
      topExpert,
      transactionCount: transactions.length
    });

    // Apply current filter
    applyFilters(transactions, filterType, customRange);
  }, [transactions, filterType, customRange]);

  /* ================= FILTER FUNCTION ================= */
  const applyFilters = (txns, type, range) => {
    if (!txns || !txns.length) {
      setFilteredTransactions([]);
      return;
    }

    const now = new Date();
    let filtered = [...txns];

    if (type === "thisMonth") {
      filtered = txns.filter(t => isSameMonth(t.created_at, now));
    } else if (type === "lastMonth") {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filtered = txns.filter(t => isSameMonth(t.created_at, lastMonth));
    } else if (type === "last3Months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      filtered = txns.filter(t => new Date(t.created_at) >= threeMonthsAgo);
    } else if (type === "custom") {
      if (range.from && range.to) {
        const from = new Date(range.from);
        const to = new Date(range.to);
        to.setHours(23, 59, 59, 999);
        filtered = txns.filter(t => {
          const date = new Date(t.created_at);
          return date >= from && date <= to;
        });
      }
    }
    // "all" - no filtering

    setFilteredTransactions(filtered);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterType(value);
    setShowDatePicker(value === "custom");
  };

  const handleCustomRangeChange = (newRange) => {
    setCustomRange(newRange);
  };

  /* ================= POPUP HANDLERS ================= */
  const openPopup = (amount = null) => {
    setPopupAmount(amount);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setPopupAmount(null);
  };

  const handleAddMoney = async (amount) => {
    try {
      await addMoney(amount);
      closePopup();
      // Refresh transactions after adding money
      await fetchWalletHistory();
    } catch (err) {
      console.error("Error adding money:", err);
      // You might want to show an error toast here
    }
  };

  /* ================= UI HELPERS ================= */
  const getTransactionTypeColor = (type) => {
    const colors = {
      call: "#3b82f6",
      chat: "#10b981",
      consultation: "#8b5cf6",
      upi: "#f59e0b",
      card: "#6366f1",
      credit: "#10b981",
      debit: "#ef4444"
    };
    return colors[type] || "#64748b";
  };

  const getTransactionIcon = (source) => {
    const icons = {
      upi: "💳",
      call: "📞",
      chat: "💬",
      card: "💳",
      netbanking: "🏦"
    };
    return icons[source] || "💰";
  };

  /* ================= RENDER STATES ================= */
  if (loading) {
    return (
      <PageWrap>
        <WalletBox>
          <LoadingState>
            <div className="spinner"></div>
            <p>Loading wallet data...</p>
          </LoadingState>
        </WalletBox>
      </PageWrap>
    );
  }

  if (error) {
    return (
      <PageWrap>
        <WalletBox>
          <ErrorState>
            <div className="error-icon">⚠️</div>
            <h3>Error Loading Wallet</h3>
            <p>{error}</p>
            <button onClick={fetchWalletHistory} className="retry-btn">
              Try Again
            </button>
          </ErrorState>
        </WalletBox>
      </PageWrap>
    );
  }

  // Separate transactions for display
  const debitTransactions = filteredTransactions.filter(t => t.type === 'debit');
  const creditTransactions = filteredTransactions.filter(t => t.type === 'credit');

  return (
    <PageWrap>
      <WalletBox>
        {/* PREMIUM HEADER */}
        <HeaderRow>
          <div className="header-left">
            <div className="logo-container">
              <MdAccountBalanceWallet className="logo-icon" />
              <span className="logo-text">ExpertConnect</span>
            </div>
            <h1 className="page-title">Wallet Management</h1>
          </div>
          <div className="header-right">
            <div className="user-badge">
              <FaUserCircle className="user-icon" />
              <span className="user-name">{user?.name || "User"}</span>
            </div>
          </div>
        </HeaderRow>

        {/* PREMIUM BALANCE CARD */}
        <BalanceCard>
          <div className="balance-header">
            <h3>Available Balance</h3>
            <span className="balance-label">Live Balance</span>
          </div>
          <BalanceAmount>
            <RiMoneyRupeeCircleFill className="currency-icon" />
            <span className="amount">{balance || 0}</span>
            <span className="currency">INR</span>
          </BalanceAmount>
          <div className="balance-footer">
            <div className="balance-stat">
              <MdTrendingUp className="stat-icon" />
              <div>
                <span className="stat-label">Total Spent</span>
                <span className="stat-value">{formatCurrency(stats.totalDebits)}</span>
              </div>
            </div>
            <div className="balance-stat">
              <MdPayments className="stat-icon" />
              <div>
                <span className="stat-label">Total Added</span>
                <span className="stat-value">{formatCurrency(stats.totalCredits)}</span>
              </div>
            </div>
          </div>
        </BalanceCard>

        {/* STATS GRID */}
        <StatsGrid>
          <StatCard className="stat-1">
            <div className="stat-icon">
              <FaWallet />
            </div>
            <div className="stat-content">
              <span className="stat-label">Transactions</span>
              <span className="stat-value">{stats.transactionCount}</span>
            </div>
          </StatCard>
          <StatCard className="stat-2">
            <div className="stat-icon">
              <FaHistory />
            </div>
            <div className="stat-content">
              <span className="stat-label">Most Spent On</span>
              <span className="stat-value">
                {stats.topExpert?.name || "N/A"}
              </span>
            </div>
          </StatCard>
          <StatCard className="stat-3">
            <div className="stat-icon">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <span className="stat-label">Monthly Spent</span>
              <span className="stat-value">{formatCurrency(stats.monthlySpent)}</span>
            </div>
          </StatCard>
        </StatsGrid>

        {/* EXPENSE HISTORY (DEBITS) */}
        <ExpenseSection>
          <SectionTitle>
            <div className="section-header">
              <h2>Expense History</h2>
              <p className="section-subtitle">Track your consultation expenses</p>
            </div>
            
            <div className="filter-section">
              <FilterDropdown>
                <select 
                  value={filterType}
                  onChange={handleFilterChange}
                >
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="last3Months">Last 3 Months</option>
                  <option value="custom">Custom Range</option>
                  <option value="all">All Time</option>
                </select>
                <FaFilter className="filter-icon" />
              </FilterDropdown>
            </div>
          </SectionTitle>

          {showDatePicker && (
            <DateRangePicker>
              <input
                type="date"
                value={customRange.from}
                onChange={(e) =>
                  handleCustomRangeChange({ ...customRange, from: e.target.value })
                }
                className="date-input"
                placeholder="From Date"
                max={customRange.to || undefined}
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                value={customRange.to}
                onChange={(e) =>
                  handleCustomRangeChange({ ...customRange, to: e.target.value })
                }
                className="date-input"
                placeholder="To Date"
                min={customRange.from || undefined}
                max={new Date().toISOString().split('T')[0]}
              />
            </DateRangePicker>
          )}

          {debitTransactions.length === 0 ? (
            <EmptyState>
              <div className="empty-icon">📊</div>
              <h3>No expenses found</h3>
              <p>Start consulting with experts to see your transaction history</p>
            </EmptyState>
          ) : (
            <div className="expenses-list">
              {debitTransactions.map((item) => (
                <ExpertCard key={item.id}>
                  <ExpertLeft>
                    <Avatar>
                      {getTransactionIcon(item.source)}
                    </Avatar>
                    <ExpertInfo>
                      <div className="expert-header">
                        <strong>{item.expert_name || 'Consultation'}</strong>
                        <TransactionBadge 
                          style={{ backgroundColor: getTransactionTypeColor(item.service_type) }}
                        >
                          {item.service_type?.toUpperCase() || item.source?.toUpperCase()}
                        </TransactionBadge>
                      </div>
                      <small className="expert-role">
                        {item.service_type === 'call' ? 'Phone Consultation' : 'Chat Session'}
                      </small>
                      <div className="expert-meta">
                        <span className="date">{formatDate(item.created_at)}</span>
                        <span className={`status ${item.status}`}>
                          {item.status}
                        </span>
                      </div>
                    </ExpertInfo>
                  </ExpertLeft>

                  <ExpertRight>
                    <AmountBox>
                      <span className="amount-label">Spent</span>
                      <span className="amount-value">{formatCurrency(item.amount)}</span>
                      <div className="amount-progress">
                        <ProgressBar 
                          width={stats.monthlySpent > 0 
                            ? Math.min((item.amount / stats.monthlySpent) * 100, 100) 
                            : 0}
                          color={getTransactionTypeColor(item.service_type)}
                        />
                      </div>
                    </AmountBox>
                  </ExpertRight>
                </ExpertCard>
              ))}
            </div>
          )}
        </ExpenseSection>

        {/* TOPUP SECTION (CREDITS) */}
        <TopupSection>
          <SectionTitle>
            <div className="section-header">
              <h2>Top-up History</h2>
              <p className="section-subtitle">Your recharge transactions</p>
            </div>
          </SectionTitle>

          {creditTransactions.length === 0 ? (
            <EmptyState className="small">
              <div className="empty-icon">💳</div>
              <p>No top-up history yet</p>
            </EmptyState>
          ) : (
            <div className="topup-list">
              {creditTransactions.map((item) => (
                <ExpertCard key={item.id} className="topup-card">
                  <ExpertLeft>
                    <div className="topup-icon">
                      <FaPlus />
                    </div>
                    <ExpertInfo>
                      <strong>{formatCurrency(item.amount)}</strong>
                      <small>Added via {item.source?.toUpperCase()}</small>
                      <small className="topup-date">{formatDate(item.created_at)}</small>
                    </ExpertInfo>
                  </ExpertLeft>

                  <ExpertRight>
                    <AmountBox className={`status-${item.status}`}>
                      {item.status === 'success' ? '✅ Success' : '🔄 Pending'}
                    </AmountBox>
                  </ExpertRight>
                </ExpertCard>
              ))}
            </div>
          )}

          <div className="action-section">
            <AddBalanceBtn onClick={() => openPopup(null)}>
              <FaPlus className="btn-icon" />
              ADD BALANCE
            </AddBalanceBtn>

            <QuickAddRow>
              <span className="quick-label">Quick Add:</span>
              {[100, 250, 500, 1000, 2000, 5000].map((amt) => (
                <QuickAddBtn 
                  key={amt} 
                  onClick={() => openPopup(amt)}
                  className={amt >= 1000 ? "premium" : ""}
                >
                  + ₹{amt}
                </QuickAddBtn>
              ))}
            </QuickAddRow>
          </div>
        </TopupSection>
      </WalletBox>

      {popupOpen && (
        <AddBalancePopup
          amountPreset={popupAmount}
          onClose={closePopup}
          onConfirm={handleAddMoney}
        />
      )}
    </PageWrap>
  );
};

export default WalletPage;