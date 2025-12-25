import React from "react";
import Sidebar from "../components/ExpertSidebar";
import Topbar from "../components/ExpertTopbar";
import { useExpertNotifications } from "../context/ExpertNotificationsContext";

import StatsCard from "../components/StatsCard";
import QueueCard from "../components/QueueCard";
import FeedCard from "../components/FeedCard";
import WidgetCard from "../components/WidgetCard";

import { useExpert } from "../../../shared/context/ExpertContext";

import {
  Layout,
  MainContent,
  ContentInner,
  Welcome,
  StatsRow,
  FeedArea,
  LiveRequests,
  RequestCount,
  NotificationBell,
  RedDot
} from "../styles/Dashboard.styles";

export default function Dashboard() {
  const { expertData, profileLoading } = useExpert();
  const { unreadCount, notifications } = useExpertNotifications(); // ✅ Get notifications too

  const expertName =
    expertData?.profile?.name ||
    expertData?.name ||
    "Expert";

  // ✅ LIVE COUNTS FROM NOTIFICATIONS
  const liveRequestsCount = unreadCount; // All unread = live requests
  const pendingChatsCount = notifications.length; // Total pending chats
  const todaysSessionsCount = "12"; // Static for now (API later)
  const monthsEarnings = "₹4,250"; // Static for now (API later)

  const stats = [
    { 
      label: "Live Requests", 
      value: liveRequestsCount.toString(), 
      color: "#10b981",
      trend: liveRequestsCount > 0 ? "+2" : "0"
    },
    { 
      label: "Pending Chats", 
      value: pendingChatsCount.toString(), 
      color: "#f59e0b",
      trend: "+1"
    },
    { 
      label: "Today's Sessions", 
      value: todaysSessionsCount, 
      color: "#3b82f6",
      trend: "+3"
    },
    { 
      label: "Month's Earnings", 
      value: monthsEarnings, 
      color: "#8b5cf6",
      trend: "+12%"
    }
  ];

  return (
    <Layout>
      <Sidebar />

      <MainContent>
        <Topbar />

        <ContentInner>
          <Welcome>
            {profileLoading
              ? "Welcome back..."
              : `Welcome back, ${expertName}!`
            }
          </Welcome>

          {/* 📊 STATS - LIVE COUNTS! */}
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
          <FeedArea>
            <FeedCard />
            <WidgetCard />
          </FeedArea>
        </ContentInner>
      </MainContent>
    </Layout>
  );
}
