import React, { useMemo } from "react";
import Sidebar from "../components/ExpertSidebar";
import Topbar from "../components/ExpertTopbar";
import { useExpertNotifications } from "../context/ExpertNotificationsContext";
import { useExpert } from "../../../shared/context/ExpertContext";
import { useWebPush } from "../../../shared/hooks/useWebPush";

import StatsCard from "../components/StatsCard";
import QueueCard from "../components/QueueCard";
import FeedCard from "../components/FeedCard";
import WidgetCard from "../components/WidgetCard";

import {
  Layout,
  MainContent,
  ContentInner,
  Welcome,
  StatsRow,
} from "../styles/Dashboard.styles";

export default function Dashboard() {
  const { expertData, profileLoading } = useExpert();
  const { notifications } = useExpertNotifications();

 const expertId = useMemo(() => {
  if (!expertData) return null;

  return (
    expertData.expert_id ||
    expertData.id ||
    expertData?.expert?.id ||
    expertData?.profile?.expert_id ||
    null
  );
}, [expertData]);
  const expertName =
    expertData?.profile?.name || expertData?.name || "Expert";

  /* ============================
     🔔 WEB PUSH
  ============================ */
  const {
    supported,
    permission, // "default" | "granted" | "denied"
    isSubscribed,
    loading,
    error,
    enable,
    disable,
  } = useWebPush({
    panel: "expert",
    userId: expertId,
  });

  /* ============================
   📊 REQUEST COUNTS
============================ */

// 🔥 Only CALL requests
const callRequestsCount = useMemo(
  () =>
    notifications.filter(
      (n) => n.type === "call" && n.status === "pending"
    ).length,
  [notifications]
);

// 🔥 Live = CALL + CHAT (pending)
const liveRequestsCount = useMemo(
  () =>
    notifications.filter(
      (n) => n.status === "pending"
    ).length,
  [notifications]
);

// 🔥 Pending chats (optional, agar QueueCard me use ho raha ho)
const pendingChatsCount = useMemo(
  () =>
    notifications.filter(
      (n) => n.type === "chat" && n.status === "pending"
    ).length,
  [notifications]
);


  const stats = [
  {
    label: "Live Requests",
    value: String(liveRequestsCount),
    color: "#10b981",
    trend: liveRequestsCount > 0 ? "+1" : "0",
  },
  {
    label: "Call Requests",
    value: String(callRequestsCount),
    color: "#3b82f6",
    trend: callRequestsCount > 0 ? "+1" : "0",
  },
  {
    label: "Pending Chats",
    value: String(pendingChatsCount),
    color: "#f59e0b",
    trend: pendingChatsCount > 0 ? "+1" : "0",
  },
];

  /* ============================
     🧠 UI STATES
  ============================ */
  const showUnsupported = !supported;

const showDeniedBanner =
  supported && permission === "denied";

const showAskPermission =
  supported && permission === "default";

const showEnableBanner =
  supported && permission === "granted" && !isSubscribed;

const showEnabledInfo =
  supported && permission === "granted" && isSubscribed;

  return (
    <Layout>
      <Sidebar />

      <MainContent>
        <Topbar />

        <ContentInner>
          <Welcome>
            {profileLoading
              ? "Welcome back..."
              : `Welcome back, ${expertName}!`}
          </Welcome>
{showAskPermission && (
  <div
    style={{
      background: "#0f172a",
      color: "white",
      padding: "12px 16px",
      borderRadius: 12,
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    }}
  >
    <div style={{ fontSize: 13 }}>
      Enable notifications to receive chat requests.
    </div>

    <button
      onClick={async () => {
        try {
          await enable();
        } catch (e) {
          alert(e?.message || "Permission failed");
        }
      }}
      style={{
        padding: "10px 14px",
        borderRadius: 999,
        border: "none",
        background: "white",
        color: "#0f172a",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Allow Notifications
    </button>
  </div>
)}

          {/* ❌ Browser not supported */}
          {showUnsupported && (
            <div
              style={{
                background: "#fef3c7",
                color: "#92400e",
                padding: "12px 16px",
                borderRadius: 12,
                marginBottom: 16,
                border: "1px solid #fde68a",
                fontSize: 13,
              }}
            >
              Your browser does not support system notifications.
              Please use the latest version of Chrome, Edge, or Firefox.
            </div>
          )}

          {/* ❌ Notifications blocked */}
          {showDeniedBanner && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "12px 16px",
                borderRadius: 12,
                marginBottom: 16,
                border: "1px solid #fecaca",
                fontSize: 13,
              }}
            >
              Notifications are blocked for this site.
              Please allow them from browser settings (site permissions) and reload.
            </div>
          )}

          {/* 🔔 Enable notifications */}
         {showEnableBanner && (
  <div  style={{
                background: "#fef3c7",
                color: "#92400e",
                padding: "12px 16px",
                borderRadius: 12,
                marginBottom: 16,
                border: "1px solid #fde68a",
                fontSize: 13,
              }}>
    <div style={{ fontSize: 13 }}>
      Notifications are off. Enable again to receive chat requests.
    </div>

    <button
      disabled={loading || !expertId}
      onClick={enable}
      style={ 
        {padding: "10px 14px",
  borderRadius: 999,
  border: "none",
  background: "white",
  color: "#0f172a",
  fontWeight: 600,
  cursor: "pointer",}}
    >
      {loading ? "Enabling..." : "Enable"}
    </button>
  </div>
)}

          {/* ✅ Enabled */}
       {showEnabledInfo && (
  <div
    style={{
      fontSize: 12,
      color: "#16a34a",
      marginBottom: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    }}
  >
    <span>Notifications enabled.</span>

    <button
      onClick={disable}
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid #16a34a",
        background: "transparent",
        color: "#16a34a",
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      Disable
    </button>
  </div>
)}

        

          {/* ❌ Hook error */}
          {error && (
            <div
              style={{
                fontSize: 12,
                color: "#dc2626",
                marginBottom: 12,
              }}
            >
              {error}
            </div>
          )}

          <StatsRow>
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                label={stat.label}
                value={stat.value}
                color={stat.color}
                trend={stat.trend}
              />
            ))}
          </StatsRow>

          <QueueCard />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 360px",
              gap: 16,
            }}
          >
            <FeedCard />
            <WidgetCard />
          </div>
        </ContentInner>
      </MainContent>
    </Layout>
  );
}
