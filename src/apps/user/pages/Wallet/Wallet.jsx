import React, { useEffect, useState, useCallback } from "react";
import { FaUserCircle, FaFilter, FaHistory, FaPlus, FaWallet, FaCalendarAlt } from "react-icons/fa";
import { MdAccountBalanceWallet, MdPayments, MdTrendingUp } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

import {
  PageWrap, WalletBox, HeaderRow, BalanceCard, BalanceAmount, ExpenseSection,
  SectionTitle, ExpertCard, ExpertLeft, Avatar, ExpertInfo, AmountBox,
  TopupSection, AddBalanceBtn, QuickAddRow, QuickAddBtn, StatsGrid, StatCard,
  FilterDropdown, TransactionBadge, ProgressBar, EmptyState, LoadingState,
  ErrorState, LoadMoreBtn
} from "./Wallet.styles";

import AddBalancePopup from "../../components/AddBalancePopup/AddBalancePopup";
import { useWallet } from "../../../../shared/context/WalletContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { getWalletHistoryApi } from "../../../../shared/api/userApi/walletApi";

const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const WalletPage = () => {
  const { balance, addMoney } = useWallet();
  const { user } = useAuth();
  
  const [transactions, setTransactions] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [activeTab, setActiveTab] = useState("expenses"); // "expenses" or "topups"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [stats, setStats] = useState({ totalDebits: 0, totalCredits: 0, monthlySpent: 0, transactionCount: 0 });
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupAmount, setPopupAmount] = useState(null);

  const fetchWalletHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getWalletHistoryApi();
      if (response.success && response.data) {
        setTransactions(response.data);
        // Stats Calculation logic remains same as before
        const debits = response.data.filter(t => t.type === 'debit');
        const credits = response.data.filter(t => t.type === 'credit');
        setStats({
          totalDebits: debits.reduce((sum, t) => sum + t.amount, 0),
          totalCredits: credits.reduce((sum, t) => sum + t.amount, 0),
          transactionCount: response.data.length,
          monthlySpent: debits.filter(t => new Date(t.created_at).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.amount, 0)
        });
      }
    } catch (err) { setError("Failed to load history"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchWalletHistory(); }, [fetchWalletHistory]);

  const handleAddMoney = async (amount) => {
    await addMoney(amount);
    setPopupOpen(false);
    fetchWalletHistory();
  };

  const filteredList = transactions.filter(t => activeTab === "expenses" ? t.type === 'debit' : t.type === 'credit');

  if (loading) return <PageWrap><LoadingState>Loading...</LoadingState></PageWrap>;

  return (
    <PageWrap>
      <WalletBox>
        <HeaderRow>
          <h1 className="page-title">My Wallet</h1>
          <div className="user-badge"><FaUserCircle /> <span>{user?.name || "User"}</span></div>
        </HeaderRow>

        <BalanceCard>
          <div className="balance-header"><h3>Available Balance</h3></div>
          <BalanceAmount>
            <RiMoneyRupeeCircleFill /> <span className="amount">{balance || 0}</span> <span className="currency">INR</span>
          </BalanceAmount>
          <div className="balance-footer">
            <div className="balance-stat"><span className="stat-label">Total Spent</span><span className="stat-value">{formatCurrency(stats.totalDebits)}</span></div>
            <div className="balance-stat"><span className="stat-label">Total Added</span><span className="stat-value">{formatCurrency(stats.totalCredits)}</span></div>
          </div>
        </BalanceCard>

        <TopupSection>
          <div className="action-section">
            <AddBalanceBtn onClick={() => {setPopupAmount(null); setPopupOpen(true)}}>
              <FaPlus /> ADD BALANCE
            </AddBalanceBtn>
            <QuickAddRow>
              <span className="quick-label">Quick Add:</span>
              {[500, 1000, 2000].map(amt => (
                <QuickAddBtn key={amt} className={amt >= 1000 ? "premium" : ""} onClick={() => {setPopupAmount(amt); setPopupOpen(true)}}>+₹{amt}</QuickAddBtn>
              ))}
            </QuickAddRow>
          </div>
        </TopupSection>

        <StatsGrid>
          <StatCard><FaWallet className="stat-icon" /><div><span className="stat-label">Transactions</span><span className="stat-value">{stats.transactionCount}</span></div></StatCard>
          <StatCard><FaCalendarAlt className="stat-icon" /><div><span className="stat-label">This Month</span><span className="stat-value">{formatCurrency(stats.monthlySpent)}</span></div></StatCard>
          <StatCard><MdTrendingUp className="stat-icon" /><div><span className="stat-label">Status</span><span className="stat-value">Active</span></div></StatCard>
        </StatsGrid>

        <ExpenseSection>
          <SectionTitle>
            <div className="tab-group">
              <span className={`tab ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => {setActiveTab('expenses'); setVisibleCount(5)}}>Expenses</span>
              <span className={`tab ${activeTab === 'topups' ? 'active' : ''}`} onClick={() => {setActiveTab('topups'); setVisibleCount(5)}}>Top-ups</span>
            </div>
            <FilterDropdown><FaFilter style={{marginRight: '5px', color: '#718096'}} /><select><option>Newest First</option></select></FilterDropdown>
          </SectionTitle>

          {filteredList.length === 0 ? (
            <EmptyState>No records found</EmptyState>
          ) : (
            <>
              {filteredList.slice(0, visibleCount).map((item) => (
                <ExpertCard key={item.id}>
                  <ExpertLeft>
                    <Avatar>{activeTab === 'expenses' ? "💬" : "💰"}</Avatar>
                    <ExpertInfo>
                      <strong>{item.expert_name || (activeTab === 'expenses' ? 'Consultation' : 'Wallet Top-up')}</strong>
                      <div className="expert-meta">
                        {formatDate(item.created_at)}
                        <span className={`status ${item.status}`}>{item.status}</span>
                      </div>
                    </ExpertInfo>
                  </ExpertLeft>
                  <AmountBox className={item.type}>
                    <span className="amount-value">{item.type === 'credit' ? '+' : '-'}{formatCurrency(item.amount)}</span>
                  </AmountBox>
                </ExpertCard>
              ))}
              {visibleCount < filteredList.length && (
                <LoadMoreBtn onClick={() => setVisibleCount(prev => prev + 5)}>View More History</LoadMoreBtn>
              )}
            </>
          )}
        </ExpenseSection>
      </WalletBox>

      {popupOpen && (
        <AddBalancePopup amountPreset={popupAmount} onClose={() => setPopupOpen(false)} onConfirm={handleAddMoney} />
      )}
    </PageWrap>
  );
};

export default WalletPage;