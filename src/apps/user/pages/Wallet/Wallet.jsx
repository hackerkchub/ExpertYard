import React, { useEffect, useState, useCallback } from "react";
import { FaUserCircle, FaFilter, FaHistory, FaPlus, FaWallet, FaCalendarAlt, FaPhone, FaComments, FaConciergeBell, FaQuestionCircle, FaReceipt } from "react-icons/fa";
import { MdAccountBalanceWallet, MdPayments, MdTrendingUp } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

import {
  PageWrap, WalletBox, HeaderRow, BalanceCard, BalanceAmount, ExpenseSection,
  SectionTitle, ExpertCard, ExpertLeft, Avatar, ExpertInfo, AmountBox,
  TopupSection, AddBalanceBtn, QuickAddRow, QuickAddBtn, StatsGrid, StatCard,
  FilterDropdown, TransactionBadge, ProgressBar, EmptyState, LoadingState,
  ErrorState, LoadMoreBtn, TabFilterRow, TabFilterBtn
} from "./Wallet.styles";

import AddBalancePopup from "../../components/AddBalancePopup/AddBalancePopup";
import MobileSelect from "../../components/MobileSelect/MobileSelect";
import { useWallet } from "../../../../shared/context/WalletContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { getWalletHistoryApi, getUserSpendingHistoryApi } from "../../../../shared/api/userApi/walletApi";
import useNetworkReconnect from "../../../../shared/hooks/useNetworkReconnect";
import PremiumCenterLoader from "../../../../shared/components/Loader/PremiumCenterLoader";

const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const DATE_FILTER_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "custom", label: "Custom Range" },
];

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

const getCreditIcon = (source) => {
  switch (source?.toLowerCase()) {
    case "referral":
      return "🎁";
    case "topup":
    case "wallet_topup":
    case "razorpay":
      return "💰";
    default:
      return "💳";
  }
};

const getCreditDisplayName = (item) => {
  switch (item.source?.toLowerCase()) {
    case "referral":
      return "Referral Reward";
    case "topup":
    case "wallet_topup":
    case "razorpay":
      return "Wallet Top-up";
    default:
      return "Wallet Credit";
  }
};

const WalletPage = () => {
  const { balance, addMoney, createOrder } = useWallet();
  const { user } = useAuth();
  
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [spendingSummary, setSpendingSummary] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [activeTab, setActiveTab] = useState("expenses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [serviceFilter, setServiceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  
  const [stats, setStats] = useState({ totalDebits: 0, totalCredits: 0, monthlySpent: 0, transactionCount: 0 });
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupAmount, setPopupAmount] = useState(null);

  const fetchWalletData = useCallback(async () => {
    try {
      setLoading(true);
      const [historyRes, spendingRes] = await Promise.all([
        getWalletHistoryApi().catch(() => ({ success: false })),
        getUserSpendingHistoryApi().catch(() => ({ success: false }))
      ]);

      if (historyRes.success && historyRes.data) {
        setTransactions(historyRes.data);
        const debits = historyRes.data.filter(t => t.type === 'debit');
        const credits = historyRes.data.filter(t => t.type === 'credit');
        setStats({
          totalDebits: debits.reduce((sum, t) => sum + parseFloat(t.amount), 0),
          totalCredits: credits.reduce((sum, t) => sum + parseFloat(t.amount), 0),
          transactionCount: historyRes.data.length,
          monthlySpent: debits.filter(t => new Date(t.created_at).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + parseFloat(t.amount), 0)
        });
      }

      if (spendingRes.success && spendingRes.data) {
        setSpendingSummary(spendingRes.data);
      }
    } catch (err) { setError("Failed to load history"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchWalletData(); }, [fetchWalletData]);
  useNetworkReconnect(fetchWalletData, { enabled: Boolean(user?.id) });

  const applyFilters = useCallback(() => {
    let filtered = [...transactions];
    filtered = filtered.filter(t => activeTab === "expenses" ? t.type === 'debit' : t.type === 'credit');
    
    if (activeTab === "expenses" && serviceFilter !== "all") {
      if (serviceFilter === "other") {
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

    const now = new Date();
    if (dateFilter === "today") {
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      filtered = filtered.filter(t => new Date(t.created_at) >= todayStart);
    } else if (dateFilter === "week") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(t => new Date(t.created_at) >= weekAgo);
    } else if (dateFilter === "month") {
      const monthAgo = new Date(now.setDate(now.getDate() - 30));
      filtered = filtered.filter(t => new Date(t.created_at) >= monthAgo);
    } else if (dateFilter === "custom" && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(t => {
        const tDate = new Date(t.created_at);
        return tDate >= start && tDate <= end;
      });
    }
    
    setFilteredTransactions(filtered);
    setVisibleCount(5);
  }, [transactions, activeTab, serviceFilter, dateFilter, customStartDate, customEndDate]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const handleOpenPopup = (amount = null) => {
    setPopupAmount(amount);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setPopupAmount(null);
  };

  const handleAddBalanceSubmit = async (finalAmount, breakdown = {}) => {
    try {
      const order = await createOrder(finalAmount, breakdown);
      return order;
    } catch (err) {
      alert("Failed to initiate payment. Please try again.");
      throw err;
    }
  };

  const handleConfirmRecharge = async (paymentDetails) => {
    try {
      const orderId = paymentDetails?.order_id;
      if (!orderId) {
        throw new Error("Missing Order ID for payment verification");
      }
      const res = await addMoney({ order_id: orderId });
      if (res?.success) {
        await fetchWalletData();
        return res;
      } else {
        throw new Error(res?.message || "Failed to update wallet balance.");
      }
    } catch (err) {
      alert(err.message || "Error verifying wallet top-up.");
      throw err;
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      await fetchWalletData();
      alert("🎉 Balance added successfully to your wallet!");
    } catch (err) {
      console.error("Error refreshing balance:", err);
    }
  };

  if (loading) return <PremiumCenterLoader />;
  if (error) return <ErrorState><p>{error}</p><AddBalanceBtn onClick={fetchWalletData}>Retry</AddBalanceBtn></ErrorState>;

  return (
    <PageWrap>
      <WalletBox>
        <HeaderRow>
        
        </HeaderRow>

        {/* Balance Card & Spend Summary */}
        <BalanceCard style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '1.25rem 1.5rem', borderRadius: '20px', marginBottom: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Available Balance</span>
              <BalanceAmount style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.25rem', color: '#38bdf8' }}>
                {formatCurrency(balance)}
              </BalanceAmount>
            </div>
            
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block' }}>Total Services Spent</span>
                <strong style={{ fontSize: '1.3rem', color: '#10b981' }}>
                  {formatCurrency(spendingSummary?.total_spent || stats.totalDebits)}
                </strong>
                <span style={{ fontSize: '0.7rem', display: 'block', opacity: 0.7 }}>
                  {spendingSummary?.total_orders || 0} Paid Service Orders
                </span>
              </div>
              <AddBalanceBtn onClick={() => handleOpenPopup()} style={{ background: '#3b82f6', color: '#fff', padding: '0 16px', minHeight: '38px', borderRadius: '10px', border: 'none', fontWeight: '800', cursor: 'pointer', flexShrink: 0, fontSize: '0.85rem' }}>
                <FaPlus size={12} /> Add Money
              </AddBalanceBtn>
            </div>
          </div>
        </BalanceCard>

        {/* Quick Add Buttons */}
        <TopupSection style={{ marginBottom: '1.5rem' }}>
          <QuickAddRow>
            {[100, 500, 1000, 2000].map((amt) => (
              <QuickAddBtn key={amt} onClick={() => handleOpenPopup(amt)}>
                +{formatCurrency(amt)}
              </QuickAddBtn>
            ))}
          </QuickAddRow>
        </TopupSection>

        {/* Services Payment History Ledger */}
        {spendingSummary && spendingSummary.history && spendingSummary.history.length > 0 && (
          <ExpenseSection style={{ marginBottom: '2rem' }}>
            <SectionTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', color: '#0f172a', marginBottom: '1rem' }}>
              <FaReceipt color="#2563eb" /> Paid Services & Invoices Ledger
            </SectionTitle>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {spendingSummary.history.map((order) => (
                <div key={order.booking_id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ background: '#eff6ff', color: '#2563eb', fontWeight: '800', fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        Booking #{order.booking_id}
                      </span>
                      <strong style={{ color: '#0f172a', fontSize: '1rem' }}>{order.service_title}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span>👤 Expert: {order.expert_name}</span>
                      <span>📅 {formatDate(order.payment_date)}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#059669' }}>
                      {formatCurrency(order.total_paid)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Base: ₹{order.base_amount || 0} + GST (18%): ₹{order.gst_amount || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ExpenseSection>
        )}

        {/* Transaction Tabs */}
        <ExpenseSection>
          <TabFilterRow>
            <TabFilterBtn
              type="button"
              $active={activeTab === "expenses"}
              onClick={() => setActiveTab("expenses")}
            >
              Service Debits ({transactions.filter(t => t.type === 'debit').length})
            </TabFilterBtn>
            <TabFilterBtn
              type="button"
              $active={activeTab === "topups"}
              onClick={() => setActiveTab("topups")}
            >
              Wallet Credits ({transactions.filter(t => t.type === 'credit').length})
            </TabFilterBtn>
          </TabFilterRow>

          {filteredTransactions.length === 0 ? (
            <EmptyState>No {activeTab} found.</EmptyState>
          ) : (
            filteredTransactions.slice(0, visibleCount).map((item) => (
              <ExpertCard key={item.id}>
                <ExpertLeft>
                  <Avatar style={{ background: item.type === 'debit' ? '#fee2e2' : '#dcfce7', color: item.type === 'debit' ? '#dc2626' : '#166534' }}>
                    {item.type === 'debit' ? getServiceIcon(item.service_type) : getCreditIcon(item.source)}
                  </Avatar>
                  <ExpertInfo>
                    <h4>{item.type === 'debit' ? getServiceDisplayName(item.service_type) : getCreditDisplayName(item)}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{formatDate(item.created_at)}</p>
                  </ExpertInfo>
                </ExpertLeft>
                <AmountBox style={{ color: item.type === 'debit' ? '#dc2626' : '#166534', fontWeight: '800' }}>
                  {item.type === 'debit' ? '-' : '+'}{formatCurrency(item.amount)}
                </AmountBox>
              </ExpertCard>
            ))
          )}

          {filteredTransactions.length > visibleCount && (
            <LoadMoreBtn onClick={() => setVisibleCount(prev => prev + 5)}>Load More</LoadMoreBtn>
          )}
        </ExpenseSection>
      </WalletBox>

      {/* Add Balance Popup */}
      {popupOpen && (
        <AddBalancePopup
          isOpen={popupOpen}
          onClose={handleClosePopup}
          createOrder={handleAddBalanceSubmit}
          onConfirm={handleConfirmRecharge}
          onSuccess={handlePaymentSuccess}
          initialAmount={popupAmount}
        />
      )}
    </PageWrap>
  );
};

export default WalletPage;
