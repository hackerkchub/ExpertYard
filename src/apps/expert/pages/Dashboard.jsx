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

  return (
    <Layout>
      <Sidebar /> {/* Sidebar constant rahega left mein */}

      <MainContent>
        <Topbar /> {/* Topbar fixed top par rahega */}

        <ContentInner>
          <Welcome>
            {profileLoading ? "Loading..." : `Welcome, ${expertName}`}
          </Welcome>

          {/* Minimal Push Notification Banner */}
          {supported && permission === "default" && (
            <div style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "12px 20px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "14px", color: "#666" }}>
                🔔 Enable desktop notifications to never miss a client request.
              </span>
              <button 
                onClick={enable}
                style={{ background: "none", border: "none", color: "#0a66c2", fontWeight: "700", cursor: "pointer" }}
              >
                Enable
              </button>
            </div>
          )}

          <StatsRow>
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </StatsRow>

          <QueueCard />

        </ContentInner>
      </MainContent>
    </Layout>
  );
}