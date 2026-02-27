import React, { useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiBarChart2,
} from "react-icons/fi";
import { MdPendingActions, MdVerified, MdWarning } from "react-icons/md";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { BsGraphUp, BsLightningCharge } from "react-icons/bs";

import {
  DashboardContainer,
  DashboardHeader,
  FilterBar,
  StatsSection,
  SectionTitle,
  StatsGrid,
  StatCard,
  StatIcon,
  StatLabel,
  StatValue,
  StatTrend,
  ContentGrid,
  SectionBox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  StatusBadge,
  ActionButton,
  RecentList,
  RecentItem,
  RecentAvatar,
  RecentInfo,
  RecentName,
  RecentMeta,
  RecentAmount,
  QuickActions,
  QuickActionButton,
  Row,
  ChartContainer,
  ChartPlaceholder,
} from "../styles/dashboard";

// Mock Data
const expertStats = {
  total: 156,
  active: 98,
  pending: 42,
  disabled: 16,
  growth: 12.5,
};

const earningsStats = {
  totalEarnings: 1250000,
  commission: 250000,
  pendingPayouts: 85000,
  completedPayouts: 1150000,
  thisMonth: 245000,
};

const payoutRequests = [
  { id: 1, expert: "Ravi Singh", amount: 25000, status: "pending", date: "2024-02-27" },
  { id: 2, expert: "Kritika Sharma", amount: 18000, status: "approved", date: "2024-02-26" },
  { id: 3, expert: "Amit Desai", amount: 32000, status: "pending", date: "2024-02-26" },
  { id: 4, expert: "Priya Shah", amount: 15000, status: "rejected", date: "2024-02-25" },
  { id: 5, expert: "Vikram Rao", amount: 42000, status: "approved", date: "2024-02-25" },
];

const recentExperts = [
  { name: "Ravi Singh", category: "Software Dev", status: "ENABLED", avatar: null },
  { name: "Kritika Sharma", category: "Nutrition", status: "ENABLED", avatar: null },
  { name: "Amit Desai", category: "AI", status: "PENDING", avatar: null },
  { name: "Priya Shah", category: "Business", status: "ENABLED", avatar: null },
  { name: "Vikram Rao", category: "Education", status: "PENDING", avatar: null },
];

const categories = [
  { name: "Technology", experts: 45, status: "active" },
  { name: "Health", experts: 32, status: "active" },
  { name: "Education", experts: 28, status: "active" },
  { name: "Business", experts: 24, status: "active" },
  { name: "AI", experts: 18, status: "active" },
  { name: "Nutrition", experts: 9, status: "pending" },
];

const subCategories = [
  { name: "Software Dev", category: "Technology", experts: 28, status: "active" },
  { name: "Fitness", category: "Health", experts: 18, status: "active" },
  { name: "Online Courses", category: "Education", experts: 15, status: "active" },
  { name: "AI Research", category: "AI", experts: 12, status: "active" },
  { name: "Diet Planning", category: "Nutrition", experts: 6, status: "pending" },
];

export default function Dashboard() {
  const [filter, setFilter] = useState({
    search: "",
    category: "",
    subcategory: "",
    status: "",
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status) => {
    return <StatusBadge $status={status}>{status}</StatusBadge>;
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>
          <FiBarChart2 />
          Admin Dashboard
        </h1>
        <p>Welcome back! Here's what's happening with your platform today.</p>
      </DashboardHeader>

      {/* Filter Bar */}
      <FilterBar>
        <input
          type="text"
          name="search"
          placeholder="Search experts by name, email, or ID..."
          value={filter.search}
          onChange={handleFilterChange}
        />

        <select name="category" value={filter.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.name} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <select name="subcategory" value={filter.subcategory} onChange={handleFilterChange}>
          <option value="">All Sub-Categories</option>
          {subCategories.map(sub => (
            <option key={sub.name} value={sub.name}>{sub.name}</option>
          ))}
        </select>

        <select name="status" value={filter.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="ENABLED">Enabled</option>
          <option value="DISABLED">Disabled</option>
          <option value="PENDING">Pending</option>
        </select>
      </FilterBar>

      {/* Expert Statistics Section */}
      <StatsSection>
        <SectionTitle>
          <FiUsers /> Expert Overview
        </SectionTitle>
        <StatsGrid>
          <StatCard $primary>
            <StatIcon>
              <FiUsers />
            </StatIcon>
            <div style={{ flex: 1 }}>
              <StatLabel>Total Experts</StatLabel>
              <StatValue>{expertStats.total}</StatValue>
              <StatTrend $positive>
                <FiTrendingUp /> +{expertStats.growth}% from last month
              </StatTrend>
            </div>
          </StatCard>

          <StatCard $success>
            <StatIcon>
              <FiUserCheck />
            </StatIcon>
            <div style={{ flex: 1 }}>
              <StatLabel>Active Experts</StatLabel>
              <StatValue>{expertStats.active}</StatValue>
              <StatTrend $positive>
                <FiCheckCircle /> {Math.round((expertStats.active / expertStats.total) * 100)}% of total
              </StatTrend>
            </div>
          </StatCard>

          <StatCard $warning>
            <StatIcon>
              <MdPendingActions />
            </StatIcon>
            <div style={{ flex: 1 }}>
              <StatLabel>Pending Verification</StatLabel>
              <StatValue>{expertStats.pending}</StatValue>
              <StatTrend>
                <FiClock /> Awaiting approval
              </StatTrend>
            </div>
          </StatCard>

          <StatCard $danger>
            <StatIcon>
              <FiUserX />
            </StatIcon>
            <div style={{ flex: 1 }}>
              <StatLabel>Disabled Experts</StatLabel>
              <StatValue>{expertStats.disabled}</StatValue>
              <StatTrend $negative>
                <FiXCircle /> Needs attention
              </StatTrend>
            </div>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      {/* Earnings & Payouts Section */}
      <StatsSection>
        <SectionTitle>
          <HiOutlineCurrencyRupee /> Earnings & Payouts
        </SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatIcon style={{ background: 'rgba(14, 165, 255, 0.1)' }}>
              <FiDollarSign color="#0ea5ff" />
            </StatIcon>
            <div style={{ flex: 1 }}>
              <StatLabel>Total Platform Earnings</StatLabel>
              <StatValue>{formatCurrency(earningsStats.totalEarnings)}</StatValue>
              <StatTrend $positive>
                <BsLightningCharge /> +18% this month
              </StatTrend>
            </div>
          </StatCard>

          <StatCard>
            <StatIcon style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <FiTrendingUp color="#f59e0b" />
            </StatIcon>
            <div style={{ flex: 1 }}>
              <StatLabel>Commission (20%)</StatLabel>
              <StatValue>{formatCurrency(earningsStats.commission)}</StatValue>
              <StatTrend>
                Platform revenue
              </StatTrend>
            </div>
          </StatCard>

          <StatCard $warning>
            <StatIcon>
              <MdPendingActions />
            </StatIcon>
            <div style={{ flex: 1 }}>
              <StatLabel>Pending Payouts</StatLabel>
              <StatValue>{formatCurrency(earningsStats.pendingPayouts)}</StatValue>
              <StatTrend>
                {payoutRequests.filter(r => r.status === 'pending').length} requests
              </StatTrend>
            </div>
          </StatCard>

          <StatCard $success>
            <StatIcon>
              <FiCheckCircle />
            </StatIcon>
            <div style={{ flex: 1 }}>
              <StatLabel>Completed Payouts</StatLabel>
              <StatValue>{formatCurrency(earningsStats.completedPayouts)}</StatValue>
              <StatTrend $positive>
                <MdVerified /> All processed
              </StatTrend>
            </div>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      {/* Main Content Grid */}
      <ContentGrid>
        {/* Payout Requests Section */}
        <SectionBox>
          <h3>
            Payout Requests
            <span>{payoutRequests.filter(r => r.status === 'pending').length} pending</span>
          </h3>
          <Table>
            <TableHead>
              <tr>
                <th>Expert</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <tbody>
              {payoutRequests.slice(0, 4).map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.expert}</TableCell>
                  <TableCell>
                    <strong>{formatCurrency(request.amount)}</strong>
                  </TableCell>
                  <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {getStatusBadge(request.status)}
                  </TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <>
                        <ActionButton $primary>Approve</ActionButton>
                        <ActionButton $danger>Reject</ActionButton>
                      </>
                    )}
                    {request.status !== 'pending' && (
                      <ActionButton>
                        <FiEye /> View
                      </ActionButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          <QuickActions>
            <QuickActionButton>
              <FiEye /> View All Requests
            </QuickActionButton>
          </QuickActions>
        </SectionBox>

        {/* Category Management */}
        <SectionBox>
          <h3>
            Category Management
            <span>{categories.length} total</span>
          </h3>
          <Table>
            <TableHead>
              <tr>
                <th>Category</th>
                <th>Experts</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <tbody>
              {categories.slice(0, 4).map((cat, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <strong>{cat.name}</strong>
                  </TableCell>
                  <TableCell>{cat.experts}</TableCell>
                  <TableCell>
                    <StatusBadge $status={cat.status === 'active' ? 'ENABLED' : 'PENDING'}>
                      {cat.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <ActionButton>
                      <FiEdit2 />
                    </ActionButton>
                    <ActionButton $danger>
                      <FiTrash2 />
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          <QuickActions>
            <QuickActionButton>
              <FiPlus /> Add Category
            </QuickActionButton>
            <QuickActionButton>
              <FiEdit2 /> Manage All
            </QuickActionButton>
          </QuickActions>
        </SectionBox>
      </ContentGrid>

      {/* Subcategory Management */}
      <SectionBox style={{ marginBottom: '32px' }}>
        <h3>
          Subcategory Management
          <span>{subCategories.length} total</span>
        </h3>
        <Table>
          <TableHead>
            <tr>
              <th>Subcategory</th>
              <th>Category</th>
              <th>Experts</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </TableHead>
          <tbody>
            {subCategories.map((sub, index) => (
              <TableRow key={index}>
                <TableCell>
                  <strong>{sub.name}</strong>
                </TableCell>
                <TableCell>{sub.category}</TableCell>
                <TableCell>{sub.experts}</TableCell>
                <TableCell>
                  <StatusBadge $status={sub.status === 'active' ? 'ENABLED' : 'PENDING'}>
                    {sub.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ActionButton>
                    <FiEdit2 />
                  </ActionButton>
                  <ActionButton $danger>
                    <FiTrash2 />
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        <QuickActions>
          <QuickActionButton>
            <FiPlus /> Add Subcategory
          </QuickActionButton>
        </QuickActions>
      </SectionBox>

      {/* Recent Activity Row */}
      <Row>
        <SectionBox>
          <h4>Recent Experts</h4>
          <RecentList>
            {recentExperts.map((expert, index) => (
              <RecentItem key={index}>
                <RecentAvatar src="/assets/avatar-placeholder.png">
                  {expert.name.charAt(0)}
                </RecentAvatar>
                <RecentInfo>
                  <RecentName>{expert.name}</RecentName>
                  <RecentMeta>
                    <span>{expert.category}</span>
                    {getStatusBadge(expert.status)}
                  </RecentMeta>
                </RecentInfo>
              </RecentItem>
            ))}
          </RecentList>
          <QuickActionButton style={{ marginTop: '16px', width: '100%' }}>
            <FiEye /> View All Experts
          </QuickActionButton>
        </SectionBox>

        <SectionBox>
          <h4>Recent Payouts</h4>
          <RecentList>
            {payoutRequests.slice(0, 3).map((payout, index) => (
              <RecentItem key={index}>
                <RecentAvatar>
                  {payout.expert.charAt(0)}
                </RecentAvatar>
                <RecentInfo>
                  <RecentName>{payout.expert}</RecentName>
                  <RecentMeta>
                    <span>{new Date(payout.date).toLocaleDateString()}</span>
                    {getStatusBadge(payout.status)}
                  </RecentMeta>
                </RecentInfo>
                <RecentAmount>
                  {formatCurrency(payout.amount)}
                </RecentAmount>
              </RecentItem>
            ))}
          </RecentList>
        </SectionBox>

        <SectionBox>
          <h4>Quick Stats</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>This Month's Earnings</span>
              <span style={{ fontWeight: 700, color: '#0ea5ff' }}>
                {formatCurrency(earningsStats.thisMonth)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Avg. per Expert</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>
                {formatCurrency(earningsStats.totalEarnings / expertStats.total)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Completion Rate</span>
              <span style={{ fontWeight: 700, color: '#f59e0b' }}>
                {Math.round((expertStats.active / expertStats.total) * 100)}%
              </span>
            </div>
          </div>
          <ChartPlaceholder style={{ marginTop: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <BsGraphUp size={24} />
              <div style={{ marginTop: '8px' }}>Earnings Chart</div>
            </div>
          </ChartPlaceholder>
        </SectionBox>
      </Row>
    </DashboardContainer>
  );
}