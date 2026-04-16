import React, { useMemo } from "react";
import Sidebar from "../components/ExpertSidebar";
import Topbar from "../components/ExpertTopbar";
import { useExpertNotifications } from "../context/ExpertNotificationsContext";
import { useExpert } from "../../../shared/context/ExpertContext";
import { useWebPush } from "../../../shared/hooks/useWebPush";

import StatsCard from "../components/StatsCard";
import QueueCard from "../components/QueueCard";

import {
  Layout,
  MainContent,
  ContentInner,
  Welcome,
  StatsRow,
} from "../styles/Dashboard.styles";

export default function Dashboard() {
  const { expertData, profileLoading } = useExpert();
  const { unreadCount, chatUnreadCount, callUnreadCount } = useExpertNotifications();

  const expertId = useMemo(() => {
    if (!expertData) return null;
    return expertData.expert_id || expertData.id || expertData?.expert?.id || expertData?.profile?.expert_id || null;
  }, [expertData]);

  const expertName = expertData?.profile?.name || expertData?.name || "Expert";

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
    <Layout>
      <Sidebar />

      <MainContent>
        <Topbar />

        <ContentInner>
          <Welcome>
            {profileLoading ? "Loading..." : `Welcome on Guidexa, ${expertName}`}
          </Welcome>

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

          <StatsRow>
            {stats.map((stat, index) => (
              <StatsCard key={index} label={stat.label} value={stat.value} />
            ))}
          </StatsRow>

          <QueueCard />
        </ContentInner>
      </MainContent>
    </Layout>
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