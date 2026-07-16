import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpertNotifications } from "../context/ExpertNotificationsContext";
import { useExpert } from "../../../shared/context/ExpertContext";
import { useWebPush } from "../../../shared/hooks/useWebPush";

import StatsCard from "../components/StatsCard";
import QueueCard from "../components/QueueCard";
import { getExpertLeadStatsApi } from "../../../shared/api/expertapi/leads.api";

import {
  ContentInner,
  Welcome,
  StatsRow,
} from "../styles/Dashboard.styles";

export default function Dashboard() {
  const navigate = useNavigate();
  const { expertData, profileLoading } = useExpert();
  const { unreadCount, chatUnreadCount, callUnreadCount } = useExpertNotifications();
  const [leadStats, setLeadStats] = useState({});

  const expertId = useMemo(() => {
    if (!expertData) return null;
    return expertData.expert_id || expertData.id || expertData?.expert?.id || expertData?.profile?.expert_id || null;
  }, [expertData]);

  const expertName = expertData?.profile?.name || expertData?.name || "Expert";
  const isLimited = !Boolean(expertData?.can_view_contact);

  useEffect(() => {
    getExpertLeadStatsApi()
      .then((res) => setLeadStats(res.data?.data || res.data?.stats || {}))
      .catch(() => setLeadStats({}));
  }, []);

  const { supported, permission, enable } = useWebPush({
    panel: "expert",
    userId: expertId,
  });

  const stats = [
    { label: "Live Requests", value: String(unreadCount) },
    { label: "Call Requests", value: String(callUnreadCount) },
    { label: "Pending Chats", value: String(chatUnreadCount) },
  ];

  // Ye function user ko guide karega ki settings kaise open karni hai
  const handleBlockedNotificationGuide = () => {
    alert(
      "Notifications are blocked in your browser settings.\n\n" +
      "To enable them:\n" +
      "1. Click the Lock/Settings icon next to the URL bar.\n" +
      "2. Change Notifications to 'Allow'.\n" +
      "3. Refresh the page."
    );
  };

  return (
    <ContentInner>
      <Welcome>
        {profileLoading ? "Loading..." : `Welcome, ${expertName}`}
      </Welcome>

      {isLimited && (
        <div style={{ ...bannerStyle, alignItems: "flex-start", background: "#f8fafc" }}>
          <div>
            <strong>Your free expert account is active.</strong>
            <p style={{ margin: "6px 0 0", color: "#475569" }}>
              Users are viewing your profile and category. Activate a G9 Expert plan to unlock contact details,
              chat/call access, service creation, earnings, and withdrawals.
            </p>
          </div>
          <button onClick={() => navigate("/expert/g9-plan")} style={buttonStyle}>
            Upgrade Plan
          </button>
        </div>
      )}

      {/* 🔔 1. Default State: Jab user ne choose nahi kiya (Pehli baar load par) */}
      {supported && permission === "default" && expertId && (
        <div style={bannerStyle}>
          <span style={{ fontSize: "14px", color: "#666" }}>
            🔔 Enable desktop notifications to never miss a client request.
          </span>
          <button onClick={enable} style={buttonStyle}>
            Enable
          </button>
        </div>
      )}

      {/* 🚫 2. Blocked State: Jab user ne ya browser ne notifications disable/block kar di hain */}
      {supported && permission === "denied" && expertId && (
        <div style={{ ...bannerStyle, border: "1px solid #ffcccc", background: "#fff5f5" }}>
          <span style={{ fontSize: "14px", color: "#d9534f" }}>
            ⚠️ Notifications are Blocked. Please enable them in browser settings to receive alerts.
          </span>
          <button onClick={handleBlockedNotificationGuide} style={{ ...buttonStyle, color: "#d9534f" }}>
            How to Enable?
          </button>
        </div>
      )}



      {isLimited && (
        <StatsRow>
          <StatsCard label="Category Views" value={String(leadStats.today_category_views || leadStats.todayCategoryViews || 0)} />
          <StatsCard label="Profile Visits" value={String(leadStats.profile_visits || leadStats.profileVisits || 0)} />
          <StatsCard label="Lead Opportunities" value={String(leadStats.new_inquiries || leadStats.newInquiries || 0)} />
          <StatsCard label="Chat Attempts" value={String(leadStats.chat_attempts || leadStats.chatAttempts || 0)} />
          <StatsCard label="Call Attempts" value={String(leadStats.call_attempts || leadStats.callAttempts || 0)} />
          <StatsCard label="Missed/Failed Calls" value={String((leadStats.missed_calls || leadStats.missedCalls || 0) + (leadStats.failed_calls || leadStats.failedCalls || 0))} />
        </StatsRow>
      )}

      {isLimited && (
        <div style={lockedGridStyle}>
          {[
            "Lead contact details",
            "Chat and call access",
            "Service creation",
            "Earnings",
            "Withdrawals",
          ].map((label) => (
            <div key={label} style={lockedCardStyle}>
              <div>
                <strong>{label}</strong>
                <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "13px" }}>
                  Activate a G9 Expert plan to unlock.
                </p>
              </div>
              <button onClick={() => navigate("/expert/g9-plan")} style={buttonStyle}>
                Upgrade Plan
              </button>
            </div>
          ))}
        </div>
      )}

      <QueueCard />
    </ContentInner>
  );
}

// Reuseable inline styles
const bannerStyle = {
  background: "#fff",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "12px 20px",
  marginBottom: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
};

const buttonStyle = {
  background: "none",
  border: "none",
  color: "#000080",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "14px"
};

const lockedGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
  marginBottom: "20px",
};

const lockedCardStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "14px",
  background: "#ffffff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
};
