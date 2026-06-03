// src/pages/admin/FinanceDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  Calendar,
  Activity,
  CreditCard,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  CheckCircle,
  Zap,
  Landmark,
  Home,
  BarChart3,
  Award,
  Target,
  Shield,
  Sparkles,
  Globe,
  Clock,
  Briefcase,
  Star,
  LineChart
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  getDashboardSummaryApi,
  getRevenueReportApi,
  getProfitSummaryApi,
  getNetProfitApi,
  getTodayGstApi,
  getMonthlyGstApi,
  getYearlyGstApi,
  getAiRevenueApi,
  getAiOrdersApi,
  getAiProfitApi,
  getRevenueGraphApi,
  getWalletAnalyticsApi
} from '../../../shared/api/admin/dashboard.api';
import {
  DashboardContainer,
  HeaderContainer,
  HeaderContent,
  HeaderLeft,
  HeaderIcon,
  HeaderTitle,
  RefreshButton,
  TabsContainer,
  Tab,
  StatsGrid,
  SummaryCard,
  CardGradientBg,
  CardContent,
  CardInfo,
  CardLabel,
  CardValue,
  CardTrend,
  CardIcon,
  ChartCard,
  ChartHeader,
  ChartSelect,
  ChartWrapper,
  TwoColumnGrid,
  InfoCard,
  InfoCardHeader,
  InfoRow,
  InfoLabel,
  InfoValue,
  GstGrid,
  GstItem,
  TableCard,
  TableHeader,
  StyledTable,
  TableHead,
  TableBody,
  StatusBadge,
  LoadingContainer,
  Spinner,
  GradientCard,
  GradientCardHeader,
  GradientCardValue,
  RangeButtonGroup,
  RangeButton
} from '../styles/financeDashboard.styles';

const FinanceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [profitSummary, setProfitSummary] = useState(null);
  const [netProfit, setNetProfit] = useState(null);
  const [gstData, setGstData] = useState({ today: 0, month: 0, year: 0 });
  const [aiRevenue, setAiRevenue] = useState(null);
  const [aiOrders, setAiOrders] = useState([]);
  const [aiProfit, setAiProfit] = useState(null);
  const [revenueGraph, setRevenueGraph] = useState([]);
  const [walletAnalytics, setWalletAnalytics] = useState(null);
  const [selectedRevenueRange, setSelectedRevenueRange] = useState('monthly');

  useEffect(() => {
    fetchAllData();
  }, [selectedRevenueRange]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboardSummary(),
        fetchRevenueReport(selectedRevenueRange),
        fetchProfitSummary(),
        fetchNetProfit(),
        fetchGstData(),
        fetchAiRevenue(),
        fetchAiOrders(),
        fetchAiProfit(),
        fetchRevenueGraph(),
        fetchWalletAnalytics()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardSummary = async () => {
    try {
      const response = await getDashboardSummaryApi();
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Dashboard summary error:', error);
    }
  };

  const fetchRevenueReport = async (range) => {
    try {
      const response = await getRevenueReportApi(range);
      if (response.data.success) {
        setRevenueData(response.data.data);
      }
    } catch (error) {
      console.error('Revenue report error:', error);
    }
  };

  const fetchProfitSummary = async () => {
    try {
      const response = await getProfitSummaryApi();
      if (response.data.success) {
        setProfitSummary(response.data.data);
      }
    } catch (error) {
      console.error('Profit summary error:', error);
    }
  };

  const fetchNetProfit = async () => {
    try {
      const response = await getNetProfitApi();
      if (response.data.success) {
        setNetProfit(response.data.data);
      }
    } catch (error) {
      console.error('Net profit error:', error);
    }
  };

  const fetchGstData = async () => {
    try {
      const [todayRes, monthRes, yearRes] = await Promise.all([
        getTodayGstApi(),
        getMonthlyGstApi(),
        getYearlyGstApi()
      ]);
      setGstData({
        today: todayRes.data.success ? todayRes.data.data.gst : 0,
        month: monthRes.data.success ? monthRes.data.data.gst : 0,
        year: yearRes.data.success ? yearRes.data.data.gst : 0
      });
    } catch (error) {
      console.error('GST data error:', error);
    }
  };

  const fetchAiRevenue = async () => {
    try {
      const response = await getAiRevenueApi();
      if (response.data.success) {
        setAiRevenue(response.data.data);
      }
    } catch (error) {
      console.error('AI revenue error:', error);
    }
  };

  const fetchAiOrders = async () => {
    try {
      const response = await getAiOrdersApi();
      if (response.data.success) {
        setAiOrders(response.data.data);
      }
    } catch (error) {
      console.error('AI orders error:', error);
    }
  };

  const fetchAiProfit = async () => {
    try {
      const response = await getAiProfitApi();
      if (response.data.success) {
        setAiProfit(response.data.data);
      }
    } catch (error) {
      console.error('AI profit error:', error);
    }
  };

  const fetchRevenueGraph = async () => {
    try {
      const response = await getRevenueGraphApi();
      if (response.data.success) {
        setRevenueGraph(response.data.data);
      }
    } catch (error) {
      console.error('Revenue graph error:', error);
    }
  };

  const fetchWalletAnalytics = async () => {
    try {
      const response = await getWalletAnalyticsApi();
      if (response.data.success) {
        setWalletAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Wallet analytics error:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'revenue', label: 'Revenue & Profit', icon: BarChart3 },
    { id: 'ai', label: 'AI Analytics', icon: Zap },
    { id: 'wallet', label: 'Wallet & Payouts', icon: Wallet }
  ];

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner>
          <div className="spinner-ring">
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="ring"></div>
          </div>
          <p>Loading Finance Dashboard...</p>
        </Spinner>
      </LoadingContainer>
    );
  }

  const renderOverview = () => (
    <>
      {/* Summary Cards */}
      <StatsGrid>
        <SummaryCard>
          <CardGradientBg $color1="#0ea5ff" $color2="#3b82f6" />
          <CardContent>
            <CardInfo>
              <CardLabel>Today's Revenue</CardLabel>
              <CardValue>{formatCurrency(dashboardData?.todayRevenue || 0)}</CardValue>
              <CardTrend $positive>
                <ArrowUpRight size={14} />
                +12.5% vs yesterday
              </CardTrend>
            </CardInfo>
            <CardIcon $color1="#0ea5ff" $color2="#3b82f6">
              <DollarSign />
            </CardIcon>
          </CardContent>
        </SummaryCard>

        <SummaryCard>
          <CardGradientBg $color1="#10b981" $color2="#34d399" />
          <CardContent>
            <CardInfo>
              <CardLabel>Monthly Revenue</CardLabel>
              <CardValue>{formatCurrency(dashboardData?.monthlyRevenue || 0)}</CardValue>
              <CardTrend $positive>
                <ArrowUpRight size={14} />
                +8.2% vs last month
              </CardTrend>
            </CardInfo>
            <CardIcon $color1="#10b981" $color2="#34d399">
              <Calendar />
            </CardIcon>
          </CardContent>
        </SummaryCard>

        <SummaryCard>
          <CardGradientBg $color1="#3b82f6" $color2="#0ea5ff" />
          <CardContent>
            <CardInfo>
              <CardLabel>Wallet Credits</CardLabel>
              <CardValue>{formatCurrency(dashboardData?.totalWalletCredit || 0)}</CardValue>
            </CardInfo>
            <CardIcon $color1="#3b82f6" $color2="#0ea5ff">
              <CreditCard />
            </CardIcon>
          </CardContent>
        </SummaryCard>

        <SummaryCard>
          <CardGradientBg $color1="#f59e0b" $color2="#fbbf24" />
          <CardContent>
            <CardInfo>
              <CardLabel>Expert Payouts</CardLabel>
              <CardValue>{formatCurrency(dashboardData?.expertPayout || 0)}</CardValue>
              <CardTrend $positive={false}>
                <ArrowDownRight size={14} />
                -3.1% vs last month
              </CardTrend>
            </CardInfo>
            <CardIcon $color1="#f59e0b" $color2="#fbbf24">
              <Users />
            </CardIcon>
          </CardContent>
        </SummaryCard>
      </StatsGrid>

      {/* Revenue Trend Graph */}
      <ChartCard>
        <ChartHeader>
          <h3>
            <LineChart size={20} />
            Revenue Trend
          </h3>
          <ChartSelect>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last 12 months</option>
          </ChartSelect>
        </ChartHeader>
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueGraph}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0ea5ff"
                strokeWidth={3}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartCard>

      {/* Two Column Layout */}
      <TwoColumnGrid>
        <InfoCard>
          <InfoCardHeader>
            <Briefcase size={20} />
            <h4>Revenue Breakdown</h4>
          </InfoCardHeader>
          {revenueData && (
            <>
              <InfoRow>
                <InfoLabel>Gross Revenue</InfoLabel>
                <InfoValue>{formatCurrency(revenueData.grossRevenue || 0)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Commission Revenue</InfoLabel>
                <InfoValue $positive>{formatCurrency(revenueData.commissionRevenue || 0)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Net Revenue</InfoLabel>
                <InfoValue $positive>{formatCurrency(revenueData.netRevenue || 0)}</InfoValue>
              </InfoRow>
            </>
          )}
        </InfoCard>

        <InfoCard>
          <InfoCardHeader>
            <Globe size={20} />
            <h4>GST Collection</h4>
          </InfoCardHeader>
          <GstGrid>
            <GstItem>
              <Clock size={20} color="#f59e0b" />
              <p>Today</p>
              <p>{formatCurrency(gstData.today)}</p>
            </GstItem>
            <GstItem>
              <Calendar size={20} color="#10b981" />
              <p>This Month</p>
              <p>{formatCurrency(gstData.month)}</p>
            </GstItem>
            <GstItem>
              <Award size={20} color="#8b5cf6" />
              <p>This Year</p>
              <p>{formatCurrency(gstData.year)}</p>
            </GstItem>
          </GstGrid>
        </InfoCard>
      </TwoColumnGrid>

      {/* Wallet Analytics */}
      <TwoColumnGrid>
        <GradientCard>
          <GradientCardHeader>
            <h3>Wallet Analytics</h3>
            <Wallet size={24} />
          </GradientCardHeader>
          <GradientCardValue>
            <p>Total Wallet Balance</p>
            <div className="amount">{formatCurrency(walletAnalytics?.totalWalletBalance || 0)}</div>
            <div className="subtitle">Total user wallet liability across platform</div>
          </GradientCardValue>
        </GradientCard>

        <InfoCard>
          <InfoCardHeader>
            <Target size={20} />
            <h4>Quick Stats</h4>
          </InfoCardHeader>
          <InfoRow>
            <InfoLabel>Wallet Debits</InfoLabel>
            <InfoValue>{formatCurrency(dashboardData?.totalWalletDebit || 0)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Net Wallet Position</InfoLabel>
            <InfoValue $positive>
              {formatCurrency((dashboardData?.totalWalletCredit || 0) - (dashboardData?.totalWalletDebit || 0))}
            </InfoValue>
          </InfoRow>
        </InfoCard>
      </TwoColumnGrid>
    </>
  );

  const renderRevenueProfit = () => (
    <>
      <StatsGrid>
        <SummaryCard>
          <CardGradientBg $color1="#10b981" $color2="#34d399" />
          <CardContent>
            <CardInfo>
              <CardLabel>Gross Profit</CardLabel>
              <CardValue>{formatCurrency(profitSummary?.gross_profit || 0)}</CardValue>
              <CardTrend $positive>Before expenses & deductions</CardTrend>
            </CardInfo>
            <CardIcon $color1="#10b981" $color2="#34d399">
              <TrendingUp />
            </CardIcon>
          </CardContent>
        </SummaryCard>

        <SummaryCard>
          <CardGradientBg $color1="#0ea5ff" $color2="#3b82f6" />
          <CardContent>
            <CardInfo>
              <CardLabel>Net Profit</CardLabel>
              <CardValue>{formatCurrency(netProfit?.netProfit || 0)}</CardValue>
              <CardTrend $positive>
                After expenses: {formatCurrency(netProfit?.referralExpense || 0)} total expenses
              </CardTrend>
            </CardInfo>
            <CardIcon $color1="#0ea5ff" $color2="#3b82f6">
              <Activity />
            </CardIcon>
          </CardContent>
        </SummaryCard>
      </StatsGrid>

      <InfoCard>
        <InfoCardHeader>
          <Shield size={20} />
          <h4>Profit & Loss Breakdown</h4>
        </InfoCardHeader>
        <InfoRow>
          <InfoLabel>Gross Profit</InfoLabel>
          <InfoValue $positive>{formatCurrency(profitSummary?.gross_profit || 0)}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Referral Expenses</InfoLabel>
          <InfoValue $negative>- {formatCurrency(netProfit?.referralExpense || 0)}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Refunds</InfoLabel>
          <InfoValue $negative>- {formatCurrency(netProfit?.refunds || 0)}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Gateway Fees</InfoLabel>
          <InfoValue $negative>- {formatCurrency(netProfit?.gatewayFee || 0)}</InfoValue>
        </InfoRow>
        <InfoRow $gradient>
          <InfoLabel style={{ fontWeight: 700 }}>Net Profit</InfoLabel>
          <InfoValue style={{ fontSize: 24, fontWeight: 800 }} $positive>
            {formatCurrency(netProfit?.netProfit || 0)}
          </InfoValue>
        </InfoRow>
      </InfoCard>

      <ChartCard>
        <ChartHeader>
          <h3>
            <BarChart3 size={20} />
            Revenue Report
          </h3>
          <RangeButtonGroup>
            {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
              <RangeButton
                key={range}
                $active={selectedRevenueRange === range}
                onClick={() => setSelectedRevenueRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </RangeButton>
            ))}
          </RangeButtonGroup>
        </ChartHeader>
        {revenueData && (
          <TwoColumnGrid style={{ marginBottom: 0 }}>
            <InfoRow $gradient>
              <InfoLabel>Gross Revenue</InfoLabel>
              <InfoValue>{formatCurrency(revenueData.grossRevenue || 0)}</InfoValue>
            </InfoRow>
            <InfoRow $gradient>
              <InfoLabel>Commission Revenue</InfoLabel>
              <InfoValue $positive>{formatCurrency(revenueData.commissionRevenue || 0)}</InfoValue>
            </InfoRow>
            <InfoRow $gradient>
              <InfoLabel>Net Revenue</InfoLabel>
              <InfoValue $positive>{formatCurrency(revenueData.netRevenue || 0)}</InfoValue>
            </InfoRow>
          </TwoColumnGrid>
        )}
      </ChartCard>
    </>
  );

  const renderAiAnalytics = () => (
    <>
      <StatsGrid>
        <SummaryCard>
          <CardGradientBg $color1="#8b5cf6" $color2="#d946ef" />
          <CardContent>
            <CardInfo>
              <CardLabel>AI Orders</CardLabel>
              <CardValue>{aiRevenue?.total_orders || 0}</CardValue>
              <CardTrend $positive>Total paid AI chat orders</CardTrend>
            </CardInfo>
            <CardIcon $color1="#8b5cf6" $color2="#d946ef">
              <Zap />
            </CardIcon>
          </CardContent>
        </SummaryCard>

        <SummaryCard>
          <CardGradientBg $color1="#ec4899" $color2="#f43f5e" />
          <CardContent>
            <CardInfo>
              <CardLabel>AI Revenue</CardLabel>
              <CardValue>{formatCurrency(aiRevenue?.revenue || 0)}</CardValue>
              <CardTrend $positive>Revenue from AI chat</CardTrend>
            </CardInfo>
            <CardIcon $color1="#ec4899" $color2="#f43f5e">
              <DollarSign />
            </CardIcon>
          </CardContent>
        </SummaryCard>

        <SummaryCard>
          <CardGradientBg $color1="#f43f5e" $color2="#ef4444" />
          <CardContent>
            <CardInfo>
              <CardLabel>AI Profit</CardLabel>
              <CardValue>{formatCurrency(aiProfit?.profit || 0)}</CardValue>
              <CardTrend $positive>100% platform commission</CardTrend>
            </CardInfo>
            <CardIcon $color1="#f43f5e" $color2="#ef4444">
              <TrendingUp />
            </CardIcon>
          </CardContent>
        </SummaryCard>
      </StatsGrid>

      <TableCard>
        <TableHeader>
          <h3>
            <Sparkles size={20} />
            Recent AI Orders
          </h3>
          <p>Complete list of AI chat purchases</p>
        </TableHeader>
        <StyledTable>
          <TableHead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </TableHead>
          <TableBody>
            {aiOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>User {order.user_id}</td>
                <td>{formatCurrency(order.ai_price)}</td>
                <td>
                  <StatusBadge $status={order.payment_status}>
                    <CheckCircle size={12} />
                    {order.payment_status}
                  </StatusBadge>
                </td>
                <td>{formatDate(order.created_at)}</td>
              </tr>
            ))}
          </TableBody>
        </StyledTable>
      </TableCard>
    </>
  );

  const renderWalletPayouts = () => (
    <>
      <StatsGrid>
        <SummaryCard>
          <CardGradientBg $color1="#3b82f6" $color2="#0ea5ff" />
          <CardContent>
            <CardInfo>
              <CardLabel>Total Wallet Balance</CardLabel>
              <CardValue>{formatCurrency(walletAnalytics?.totalWalletBalance || 0)}</CardValue>
              <CardTrend $positive>Total user wallet liability</CardTrend>
            </CardInfo>
            <CardIcon $color1="#3b82f6" $color2="#0ea5ff">
              <Wallet />
            </CardIcon>
          </CardContent>
        </SummaryCard>

        <SummaryCard>
          <CardGradientBg $color1="#10b981" $color2="#34d399" />
          <CardContent>
            <CardInfo>
              <CardLabel>Total Credits</CardLabel>
              <CardValue>{formatCurrency(dashboardData?.totalWalletCredit || 0)}</CardValue>
              <CardTrend $positive>All time wallet credits</CardTrend>
            </CardInfo>
            <CardIcon $color1="#10b981" $color2="#34d399">
              <TrendingUp />
            </CardIcon>
          </CardContent>
        </SummaryCard>

        <SummaryCard>
          <CardGradientBg $color1="#f59e0b" $color2="#fbbf24" />
          <CardContent>
            <CardInfo>
              <CardLabel>Expert Payouts</CardLabel>
              <CardValue>{formatCurrency(dashboardData?.expertPayout || 0)}</CardValue>
              <CardTrend $positive={false}>Total paid to experts</CardTrend>
            </CardInfo>
            <CardIcon $color1="#f59e0b" $color2="#fbbf24">
              <Users />
            </CardIcon>
          </CardContent>
        </SummaryCard>
      </StatsGrid>

      <InfoCard>
        <InfoCardHeader>
          <CreditCard size={20} />
          <h4>Wallet Transaction Summary</h4>
        </InfoCardHeader>
        <InfoRow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 8, background: '#10b981', borderRadius: '50%' }}>
              <ArrowUpRight size={16} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Total Credits</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Money added to user wallets</div>
            </div>
          </div>
          <InfoValue $positive>{formatCurrency(dashboardData?.totalWalletCredit || 0)}</InfoValue>
        </InfoRow>
        <InfoRow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 8, background: '#ef4444', borderRadius: '50%' }}>
              <ArrowDownRight size={16} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Total Debits</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Money spent from wallets</div>
            </div>
          </div>
          <InfoValue $negative>{formatCurrency(dashboardData?.totalWalletDebit || 0)}</InfoValue>
        </InfoRow>
      </InfoCard>

      <GradientCard>
        <GradientCardHeader>
          <div>
            <h3>Withdrawal Analytics</h3>
            <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Expert payout overview and statistics</p>
          </div>
          <Landmark size={32} opacity={0.5} />
        </GradientCardHeader>
        <GradientCardValue>
          <p>Total Approved Payouts</p>
          <div className="amount">{formatCurrency(dashboardData?.expertPayout || 0)}</div>
          <div className="subtitle">All time payouts disbursed to experts</div>
        </GradientCardValue>
      </GradientCard>
    </>
  );

  return (
    <DashboardContainer>
      <HeaderContainer>
        <HeaderContent>
          <HeaderLeft>
            <HeaderIcon>
              <TrendingUp />
            </HeaderIcon>
            <HeaderTitle>
              <h1>Finance Dashboard</h1>
              <p>Complete financial analytics and insights</p>
            </HeaderTitle>
          </HeaderLeft>
          <RefreshButton onClick={fetchAllData}>
            <RefreshCw size={18} />
            Refresh Data
          </RefreshButton>
        </HeaderContent>

        <TabsContainer>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </Tab>
          ))}
        </TabsContainer>
      </HeaderContainer>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'revenue' && renderRevenueProfit()}
      {activeTab === 'ai' && renderAiAnalytics()}
      {activeTab === 'wallet' && renderWalletPayouts()}
    </DashboardContainer>
  );
};

export default FinanceDashboard;