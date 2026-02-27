import React, { useEffect, useState } from "react";
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
  ChartContainer,
  FilterDropdown,
  DateRangePicker,
  TransactionBadge,
  ProgressBar,
  EmptyState
} from "./Wallet.styles";

import AddBalancePopup from "../../components/AddBalancePopup/AddBalancePopup";

// ✅ CONTEXTS
import { useWallet } from "../../../../shared/context/WalletContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useExpert } from "../../../../shared/context/ExpertContext";



const WalletPage = () => {
  const { balance, addMoney } = useWallet();
  // const { user } = useAuth();
  // const userId = user?.id;
const { experts } = useExpert();  
  
  const [expenseHistory, setExpenseHistory] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [topupHistory, setTopupHistory] = useState([]);
  const [stats, setStats] = useState({
    monthlySpent: 0,
    avgTransaction: 0,
    topExpert: null
  });

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupAmount, setPopupAmount] = useState(null);

  const [filterType, setFilterType] = useState("thisMonth");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customRange, setCustomRange] = useState({ from: "", to: "" });

  /* ================= LOAD DATA ================= */
 

useEffect(() => {
  if (!experts.length) return;

  const expense = experts.slice(0, 8).map((ex, index) => ({
    id: ex.id || index,
    name: ex.name || "Expert",
    role: ex.position || "Consultant",
    avatar: ex.profile_photo || "/avatar.png",
    amount: Math.floor(Math.random() * 500) + 100,
    date: new Date(),
    type: Math.random() > 0.5 ? "call" : "chat",
    status: "completed"
  }));

  setExpenseHistory(expense);
  setFilteredExpenses(expense);

  const topups = experts.slice(0, 4).map((_, i) => ({
    id: i,
    amount: Math.floor(Math.random() * 1000) + 100,
    mode: ["UPI", "Card", "Net Banking", "Wallet"][i % 4],
    date: new Date(),
    status: "success"
  }));

  setTopupHistory(topups);
}, [experts]);


useEffect(() => {
  if (!expenseHistory.length) return;

  const monthlySpent = expenseHistory
    .filter(e => sameMonth(e.date, new Date()))
    .reduce((sum, item) => sum + item.amount, 0);

  const avgTransaction =
    expenseHistory.reduce((sum, item) => sum + item.amount, 0) /
    expenseHistory.length;

  const topExpert = expenseHistory.reduce(
    (max, item) =>
      item.amount > (max?.amount || 0) ? item : max,
    null
  );

  setStats({
    monthlySpent,
    avgTransaction: Math.round(avgTransaction),
    topExpert
  });
}, [expenseHistory]);
// useEffect(() => {
//   if (!experts.length) return;

//   const expense = experts.slice(0, 8).map(...);

//   setExpenseHistory(expense);
//   setFilteredExpenses(expense.filter(e => sameMonth(e.date, new Date())));
// }, [experts]);
 
  

  /* ================= FILTER ================= */
  const sameMonth = (d1, d2) =>
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  useEffect(() => {
    applyFilters();
  }, [filterType, customRange, expenseHistory]);

  const applyFilters = () => {
    const now = new Date();

    if (filterType === "thisMonth") {
      setFilteredExpenses(expenseHistory.filter((e) => sameMonth(e.date, now)));
    } else if (filterType === "lastMonth") {
      const last = new Date();
      last.setMonth(last.getMonth() - 1);
      setFilteredExpenses(expenseHistory.filter((e) => sameMonth(e.date, last)));
    } else if (filterType === "last3Months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      setFilteredExpenses(
        expenseHistory.filter((e) => e.date >= threeMonthsAgo && e.date <= now)
      );
    } else if (filterType === "custom") {
      if (!customRange.from || !customRange.to) return;
      const from = new Date(customRange.from);
      const to = new Date(customRange.to);
      setFilteredExpenses(
        expenseHistory.filter((e) => e.date >= from && e.date <= to)
      );
    } else {
      setFilteredExpenses(expenseHistory);
    }
  };

  /* ================= POPUP ================= */
  const openPopup = (amount = null) => {
    setPopupAmount(amount);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setPopupAmount(null);
  };

  /* ================= ADD MONEY ================= */
  const handleAddMoney = async (amount) => {
  await addMoney(amount);
  closePopup();
};

  /* ================= FORMATTING ================= */
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTransactionTypeColor = (type) => {
    const colors = {
      call: "#3b82f6",
      chat: "#10b981",
      consultation: "#8b5cf6"
    };
    return colors[type] || "#64748b";
  };

  /* ================= UI ================= */
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
          {/* <div className="header-right">
            <div className="user-badge">
              <FaUserCircle className="user-icon" />
              <span className="user-name">{user?.name || "User"}</span>
            </div>
          </div> */}
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
          {/* <div className="balance-footer">
            <div className="balance-stat">
              <MdTrendingUp className="stat-icon" />
              <div>
                <span className="stat-label">Monthly Spent</span>
                <span className="stat-value">₹{stats.monthlySpent}</span>
              </div>
            </div>
            <div className="balance-stat">
              <MdPayments className="stat-icon" />
              <div>
                <span className="stat-label">Avg. Transaction</span>
                <span className="stat-value">₹{stats.avgTransaction}</span>
              </div>
            </div>
          </div> */}
        </BalanceCard>

        {/* STATS GRID */}
        <StatsGrid>
          <StatCard className="stat-1">
            <div className="stat-icon">
              <FaWallet />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Transactions</span>
              <span className="stat-value">{expenseHistory.length}</span>
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
              <span className="stat-label">Active Since</span>
              <span className="stat-value">{formatDate(new Date())}</span>
            </div>
          </StatCard>
        </StatsGrid>

        {/* EXPENSE HISTORY */}
        <ExpenseSection>
          <SectionTitle>
            <div className="section-header">
              <h2>Expense History</h2>
              <p className="section-subtitle">Track your expert consultations</p>
            </div>
            
            <div className="filter-section">
              <FilterDropdown>
                <select 
                  value={filterType}
                  onChange={(e) => {
  const value = e.target.value;
  setFilterType(value);
  setShowDatePicker(value === "custom");
}}
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

          {filterType === "custom" && (
            <DateRangePicker>
              <input
                type="date"
                value={customRange.from}
                onChange={(e) =>
                  setCustomRange({ ...customRange, from: e.target.value })
                }
                className="date-input"
                placeholder="From Date"
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                value={customRange.to}
                onChange={(e) =>
                  setCustomRange({ ...customRange, to: e.target.value })
                }
                className="date-input"
                placeholder="To Date"
              />
            </DateRangePicker>
          )}

          {filteredExpenses.length === 0 ? (
            <EmptyState>
              <div className="empty-icon">📊</div>
              <h3>No expenses found</h3>
              <p>Try adjusting your filters or add balance to get started</p>
            </EmptyState>
          ) : (
            <div className="expenses-list">
              {filteredExpenses.map((item) => (
                <ExpertCard key={item.id}>
                  <ExpertLeft>
                    <Avatar src={item.avatar}>
                      {!item.avatar && <FaUserCircle />}
                    </Avatar>
                    <ExpertInfo>
                      <div className="expert-header">
                        <strong>{item.name}</strong>
                        <TransactionBadge 
                          style={{ backgroundColor: getTransactionTypeColor(item.type) }}
                        >
                          {item.type.toUpperCase()}
                        </TransactionBadge>
                      </div>
                      <small className="expert-role">{item.role}</small>
                      <div className="expert-meta">
                        <span className="date">{formatDate(item.date)}</span>
                        <span className={`status ${item.status}`}>
                          {item.status}
                        </span>
                      </div>
                    </ExpertInfo>
                  </ExpertLeft>

                  <ExpertRight>
                    <AmountBox>
                      <span className="amount-label">Spent</span>
                      <span className="amount-value">₹{item.amount}</span>
                      <div className="amount-progress">
                        <ProgressBar 
                          width={Math.min((item.amount / stats.monthlySpent) * 100, 100)}
                          color={getTransactionTypeColor(item.type)}
                        />
                      </div>
                    </AmountBox>
                  </ExpertRight>
                </ExpertCard>
              ))}
            </div>
          )}
        </ExpenseSection>

        {/* TOPUP SECTION */}
        <TopupSection>
          <SectionTitle>
            <div className="section-header">
              <h2>Top-up History</h2>
              <p className="section-subtitle">Your recharge transactions</p>
            </div>
          </SectionTitle>

          {topupHistory.length === 0 ? (
            <EmptyState className="small">
              <div className="empty-icon">💳</div>
              <p>No top-up history yet</p>
            </EmptyState>
          ) : (
            <div className="topup-list">
              {topupHistory.map((item) => (
                <ExpertCard key={item.id} className="topup-card">
                  <ExpertLeft>
                    <div className="topup-icon">
                      <FaPlus />
                    </div>
                    <ExpertInfo>
                      <strong>₹{item.amount}</strong>
                      <small>Added via {item.mode}</small>
                      <small className="topup-date">{formatDate(item.date)}</small>
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