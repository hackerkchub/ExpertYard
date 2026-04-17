import React, { useEffect, useState, useCallback } from "react";
import { FaUserCircle, FaFilter, FaHistory, FaPlus, FaWallet, FaCalendarAlt, FaPhone, FaComments, FaConciergeBell, FaQuestionCircle } from "react-icons/fa";
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

// Service type icons mapping
const getServiceIcon = (serviceType) => {
  switch(serviceType?.toLowerCase()) {
    case 'call':
      return <FaPhone />;
    case 'chat':
      return <FaComments />;
    case 'service_booking':
    case 'booking':
    case 'service booking':
      return <FaConciergeBell />;
    default:
      return <FaQuestionCircle />;
  }
};

// Get service display name
const getServiceDisplayName = (serviceType) => {
  switch(serviceType?.toLowerCase()) {
    case 'call':
      return 'Call Consultation';
    case 'chat':
      return 'Chat Consultation';
    case 'service_booking':
    case 'booking':
    case 'service booking':
      return 'Service Booking';
    default:
      return serviceType || 'Other Service';
  }
};

const WalletPage = () => {
  const { balance, addMoney } = useWallet();
  const { user } = useAuth();
  
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [activeTab, setActiveTab] = useState("expenses"); // "expenses" or "topups"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [serviceFilter, setServiceFilter] = useState("all"); // all, call, chat, service_booking, other
  const [dateFilter, setDateFilter] = useState("all"); // all, today, week, month, custom
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  
  const [stats, setStats] = useState({ totalDebits: 0, totalCredits: 0, monthlySpent: 0, transactionCount: 0 });
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupAmount, setPopupAmount] = useState(null);

  const fetchWalletHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getWalletHistoryApi();
      if (response.success && response.data) {
        setTransactions(response.data);
        // Stats Calculation logic
        const debits = response.data.filter(t => t.type === 'debit');
        const credits = response.data.filter(t => t.type === 'credit');
        setStats({
          totalDebits: debits.reduce((sum, t) => sum + parseFloat(t.amount), 0),
          totalCredits: credits.reduce((sum, t) => sum + parseFloat(t.amount), 0),
          transactionCount: response.data.length,
          monthlySpent: debits.filter(t => new Date(t.created_at).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + parseFloat(t.amount), 0)
        });
      }
    } catch (err) { setError("Failed to load history"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchWalletHistory(); }, [fetchWalletHistory]);

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...transactions];
    
    // Filter by type (expense/topup)
    filtered = filtered.filter(t => activeTab === "expenses" ? t.type === 'debit' : t.type === 'credit');
    
    // Filter by service type (only for expenses)
    if (activeTab === "expenses" && serviceFilter !== "all") {
      if (serviceFilter === "other") {
        // Include transactions that don't match call, chat, or service_booking
        filtered = filtered.filter(t => {
          const serviceType = t.service_type?.toLowerCase() || t.source?.toLowerCase();
          return !['call', 'chat', 'service_booking', 'booking'].includes(serviceType);
        });
      } else {
        filtered = filtered.filter(t => {
          const serviceType = t.service_type?.toLowerCase() || t.source?.toLowerCase();
          return serviceType === serviceFilter;
        });
      }
    }
    
    // Filter by date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);
    
    switch(dateFilter) {
      case "today":
        filtered = filtered.filter(t => new Date(t.created_at) >= today);
        break;
      case "week":
        filtered = filtered.filter(t => new Date(t.created_at) >= weekAgo);
        break;
      case "month":
        filtered = filtered.filter(t => new Date(t.created_at) >= monthAgo);
        break;
      case "custom":
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate);
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59);
          filtered = filtered.filter(t => {
            const date = new Date(t.created_at);
            return date >= start && date <= end;
          });
        }
        break;
      default:
        break;
    }
    
    setFilteredTransactions(filtered);
    setVisibleCount(5);
  }, [transactions, activeTab, serviceFilter, dateFilter, customStartDate, customEndDate]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleAddMoney = async (amount) => {
    await addMoney(amount);
    setPopupOpen(false);
    fetchWalletHistory();
  };

  const resetFilters = () => {
    setServiceFilter("all");
    setDateFilter("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setShowCustomDatePicker(false);
  };

  // Get unique service types for filter (only from debit transactions)
  const getServiceTypes = () => {
    const services = new Set();
    transactions.filter(t => t.type === 'debit').forEach(t => {
      const serviceType = t.service_type?.toLowerCase() || t.source?.toLowerCase();
      if (['call', 'chat', 'service_booking', 'booking'].includes(serviceType)) {
        services.add(serviceType === 'service_booking' || serviceType === 'booking' ? 'service_booking' : serviceType);
      } else {
        services.add('other');
      }
    });
    return Array.from(services);
  };

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
              <span className={`tab ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => {setActiveTab('expenses'); resetFilters();}}>Expenses</span>
              <span className={`tab ${activeTab === 'topups' ? 'active' : ''}`} onClick={() => {setActiveTab('topups'); resetFilters();}}>Top-ups</span>
            </div>
          </SectionTitle>

          {/* Filter Section - Only show for Expenses */}
          {activeTab === "expenses" && (
            <div style={{ 
              background: '#f7fafc', 
              padding: '15px', 
              borderRadius: '12px', 
              marginBottom: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '15px',
              alignItems: 'center'
            }}>
              {/* Service Type Filter */}
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ fontSize: '12px', color: '#718096', display: 'block', marginBottom: '5px' }}>Service Type</label>
                <select 
                  value={serviceFilter} 
                  onChange={(e) => setServiceFilter(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                >
                  <option value="all">All Services</option>
                  {getServiceTypes().includes('call') && <option value="call">📞 Call</option>}
                  {getServiceTypes().includes('chat') && <option value="chat">💬 Chat</option>}
                  {getServiceTypes().includes('service_booking') && <option value="service_booking">🛎️ Service Booking</option>}
                  {getServiceTypes().includes('other') && <option value="other">❓ Other</option>}
                </select>
              </div>

              {/* Date Filter */}
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ fontSize: '12px', color: '#718096', display: 'block', marginBottom: '5px' }}>Date Range</label>
                <select 
                  value={dateFilter} 
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setShowCustomDatePicker(e.target.value === 'custom');
                  }}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {/* Custom Date Picker */}
              {showCustomDatePicker && (
                <>
                  <div style={{ flex: 1, minWidth: '130px' }}>
                    <label style={{ fontSize: '12px', color: '#718096', display: 'block', marginBottom: '5px' }}>From Date</label>
                    <input 
                      type="date" 
                      value={customStartDate} 
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: '130px' }}>
                    <label style={{ fontSize: '12px', color: '#718096', display: 'block', marginBottom: '5px' }}>To Date</label>
                    <input 
                      type="date" 
                      value={customEndDate} 
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                  </div>
                </>
              )}

              {/* Reset Filter Button */}
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button 
                  onClick={resetFilters}
                  style={{ 
                    padding: '8px 16px', 
                    background: '#e2e8f0', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {filteredTransactions.length === 0 ? (
            <EmptyState>No records found</EmptyState>
          ) : (
            <>
              {filteredTransactions.slice(0, visibleCount).map((item) => {
                const serviceType = item.service_type || item.source;
                const isExpense = activeTab === 'expenses';
                const displayName = isExpense ? getServiceDisplayName(serviceType) : 'Wallet Top-up';
                const icon = isExpense ? getServiceIcon(serviceType) : "💰";
                
                return (
                  <ExpertCard key={item.id}>
                    <ExpertLeft>
                      <Avatar style={{ background: isExpense ? '#fef5e7' : '#e8f5e9' }}>
                        {icon}
                      </Avatar>
                      <ExpertInfo>
                        <strong>
                          {isExpense && item.expert_name ? `${item.expert_name} - ${displayName}` : displayName}
                        </strong>
                        <div className="expert-meta">
                          {formatDate(item.created_at)}
                          <span className={`status ${item.status}`}>{item.status}</span>
                          {isExpense && serviceType && (
                            <span style={{ 
                              marginLeft: '8px', 
                              fontSize: '11px', 
                              padding: '2px 6px', 
                              background: '#edf2f7', 
                              borderRadius: '4px',
                              color: '#4a5568'
                            }}>
                              {serviceType}
                            </span>
                          )}
                        </div>
                        {/* {isExpense && item.reference_id && (
                          <div style={{ fontSize: '11px', color: '#718096', marginTop: '2px' }}>
                            ID: {item.reference_id}
                          </div>
                        )} */}
                      </ExpertInfo>
                    </ExpertLeft>
                    <AmountBox className={item.type}>
                      <span className="amount-value">{item.type === 'credit' ? '+' : '-'}{formatCurrency(parseFloat(item.amount))}</span>
                    </AmountBox>
                  </ExpertCard>
                );
              })}
              {visibleCount < filteredTransactions.length && (
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